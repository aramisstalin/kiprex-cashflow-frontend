"use client";

import { Monitor, Shield, XCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { SkeletonCard } from "@/components/feedback/skeleton";
import type { SessionResponse } from "@/lib/types";

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.get<SessionResponse[]>("/sessions");
                setSessions(data);
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
                setError("Failed to load active sessions.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const revokeSession = async (id: string) => {
        try {
            await api.post(`/sessions/${id}/revoke`);
            setSessions(sessions.map(s => s.id === id ? { ...s, is_active: false } : s));
        } catch (error) {
            console.error("Failed to revoke session:", error);
        }
    };

    const activeSessionsCount = sessions.filter(s => s.is_active).length;
    const mobileSessionsCount = sessions.filter(s => s.is_active && s.device && /mobile|android|iphone|ipad/i.test(s.device)).length;
    const inactiveSessionsCount = sessions.filter(s => !s.is_active).length;
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-heading-1 text-foreground">Session Management</h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Monitor and revoke active user sessions.
                    </p>
                </div>
                <Button variant="danger" size="sm">Revoke All Sessions</Button>
            </div>
            {error && (
                <div className="p-4 rounded-[var(--radius-md)] bg-destructive/10 border border-destructive/20 text-destructive text-body-sm">
                    {error}
                </div>
            )}


            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Sessions", value: sessions.length.toString(), icon: Monitor },
                    { label: "Online Now", value: activeSessionsCount.toString(), icon: Monitor },
                    { label: "From Mobile", value: mobileSessionsCount.toString(), icon: Monitor },
                    { label: "Inactive Today", value: inactiveSessionsCount.toString(), icon: XCircle },
                ].map((s) => (
                    <Card key={s.label}>
                        <p className="text-caption text-muted-foreground">{s.label}</p>
                        <p className="text-heading-2 text-foreground mt-1">{isLoading ? <Loader2 size={16} className="animate-spin" /> : s.value}</p>
                    </Card>
                ))}
            </div>

            {/* Sessions List */}
            <Card padding="none">
                <CardHeader className="px-6 pt-5">
                    <CardTitle>Active Sessions</CardTitle>
                    <Badge variant="success" dot>{activeSessionsCount} active</Badge>
                </CardHeader>
                <div className="divide-y divide-border">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6"><SkeletonCard /></div>
                        ))
                    ) : (
                        sessions.filter(s => s.is_active).map((session) => (
                            <div key={session.id} className="flex items-start gap-4 px-6 py-4 hover:bg-accent/30 transition-colors">
                                <Avatar name={session.user_display_name || "User"} size="md" status="online" />
                                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-4">
                                    <div>
                                        <p className="text-body-sm font-medium text-foreground">{session.user_display_name}</p>
                                        <p className="text-caption text-muted-foreground">{session.user_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-body-sm text-foreground flex items-center gap-1.5">
                                            <Monitor size={14} className="text-muted-foreground" />
                                            {session.device || "Unknown Device"}
                                        </p>
                                        <p className="text-caption text-muted-foreground">{session.ip_address} · {session.location || "Unknown Location"}</p>
                                    </div>
                                    <div>
                                        <p className="text-caption text-muted-foreground">Last active: {new Date(session.last_active_at).toLocaleString()}</p>
                                        {session.current && <Badge variant="success" dot className="mt-1">Current session</Badge>}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        leftIcon={<XCircle size={14} />}
                                        className="text-destructive hover:text-destructive"
                                        disabled={session.current}
                                        onClick={() => revokeSession(session.id)}
                                    >
                                        Revoke
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
