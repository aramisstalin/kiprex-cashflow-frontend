"use client";

import { useState, useEffect } from "react";
import { KeyRound, LogOut, Monitor, Shield, Smartphone, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/hooks";
import { api } from "@/lib/api-client";
import type { SessionResponse } from "@/lib/types";
import { SkeletonCard } from "@/components/feedback/skeleton";

export default function SecuritySettingsPage() {
    const { logout } = useAuth();
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const data = await api.get<SessionResponse[]>("/sessions");
            setSessions(data);
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id: string) => {
        try {
            await api.post(`/sessions/${id}/revoke`);
            setSessions(sessions.filter(s => s.id !== id));
        } catch (err) {
            console.error("Failed to revoke session", err);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-heading-1 text-foreground">Security</h1>
                <p className="text-body text-muted-foreground mt-1">
                    Manage your security settings and active sessions.
                </p>
            </div>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield size={20} className="text-primary" />
                        <CardTitle>Two-Factor Authentication</CardTitle>
                    </div>
                    <Badge variant={twoFAEnabled ? "success" : "outline"} dot={twoFAEnabled}>
                        {twoFAEnabled ? "Enabled" : "Not enabled"}
                    </Badge>
                </CardHeader>
                <CardDescription className="mt-2">
                    Add an extra layer of security by requiring a verification code when signing in.
                </CardDescription>
                <div className="mt-4 p-4 rounded-[var(--radius-md)] border border-border bg-secondary/30">
                    {twoFAEnabled ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-success/10 text-success">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="text-body-sm font-medium text-foreground">Authenticator App</p>
                                    <p className="text-caption text-muted-foreground">TOTP configured</p>
                                </div>
                            </div>
                            <Button variant="danger" size="sm" onClick={() => setTwoFAEnabled(false)}>
                                Disable
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-muted text-muted-foreground">
                                    <KeyRound size={20} />
                                </div>
                                <div>
                                    <p className="text-body-sm font-medium text-foreground">Not configured</p>
                                    <p className="text-caption text-muted-foreground">Set up an authenticator app</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => setTwoFAEnabled(true)}>
                                Enable
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Active Sessions */}
            <Card padding="none">
                <CardHeader className="px-6 pt-5">
                    <div className="flex items-center gap-2">
                        <Monitor size={20} className="text-primary" />
                        <CardTitle>Active Sessions</CardTitle>
                    </div>
                    <Badge variant="outline">{sessions.length} devices</Badge>
                </CardHeader>
                <div className="divide-y divide-border">
                    {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="p-6">
                                <div className="flex items-center gap-4 animate-pulse">
                                    <div className="h-10 w-10 rounded-md bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-muted rounded" />
                                        <div className="h-3 w-48 bg-muted rounded" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : sessions.length === 0 ? (
                        <div className="px-6 py-8 text-center text-muted-foreground">
                            No active sessions found.
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div key={session.id} className="flex items-center gap-4 px-6 py-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-foreground flex-shrink-0">
                                    <Monitor size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-body-sm font-medium text-foreground">
                                        {session.user_agent}
                                        {session.is_active && (
                                            <Badge variant="success" className="ml-2">Active</Badge>
                                        )}
                                    </p>
                                    <p className="text-caption text-muted-foreground">
                                        {session.ip_address} · Last active: {new Date(session.last_active_at).toLocaleString()}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<XCircle size={14} />}
                                    className="text-destructive hover:text-destructive flex-shrink-0"
                                    onClick={() => handleRevoke(session.id)}
                                >
                                    Revoke
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                    <div>
                        <p className="text-body-sm font-medium text-foreground">
                            Sign out of all devices
                        </p>
                        <p className="text-caption text-muted-foreground">
                            This will revoke all active sessions including the current one.
                        </p>
                    </div>
                    <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<LogOut size={14} />}
                        onClick={() => logout(true)}
                    >
                        Log out everywhere
                    </Button>
                </div>
            </Card>
        </div>
    );
}
