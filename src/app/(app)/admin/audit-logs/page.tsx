"use client";

import { ChevronDown, ChevronRight, Filter, Search, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { SkeletonCard } from "@/components/feedback/skeleton";
import type { AuditLogResponse } from "@/lib/types";

export default function AuditLogsPage() {
    const [events, setEvents] = useState<AuditLogResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.get<AuditLogResponse[]>("/audit-logs");
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
                setError("Failed to load audit logs.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filtered = events.filter(
        (e) =>
            !query ||
            e.action.toLowerCase().includes(query.toLowerCase()) ||
            e.resource_type.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-heading-1 text-foreground">Audit Logs</h1>
                <p className="text-body text-muted-foreground mt-1">
                    Immutable event journal for compliance and security review.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="Filter by action, actor, or target…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        leftIcon={<Search size={16} />}
                    />
                </div>
                <Button variant="outline" leftIcon={<Filter size={16} />}>
                    Filters
                </Button>
            </div>

            {error && (
                <div className="p-4 rounded-[var(--radius-md)] bg-destructive/10 border border-destructive/20 text-destructive text-body-sm">
                    {error}
                </div>
            )}


            <Card padding="none">
                <CardHeader className="px-6 pt-5">
                    <CardTitle>Events</CardTitle>
                    <Badge variant="outline">{filtered.length} records</Badge>
                </CardHeader>

                <div className="divide-y divide-border">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4"><SkeletonCard /></div>)
                    ) : (
                        filtered.map((event) => (
                            <div key={event.id}>
                                <button
                                    onClick={() =>
                                        setExpandedId(expandedId === event.id ? null : event.id)
                                    }
                                    className="flex items-start gap-4 w-full text-left px-6 py-4 hover:bg-accent/30 transition-colors"
                                >
                                    <div className="flex flex-col items-center flex-shrink-0 mt-1">
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                                        <div className="w-px flex-1 bg-border mt-1" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="default">
                                                {event.action}
                                            </Badge>
                                            <span className="text-caption text-muted-foreground">
                                                {new Date(event.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-body-sm text-foreground mt-1">
                                            <span className="font-medium">{event.actor_id || "System"}</span>
                                            <span className="text-muted-foreground"> → </span>
                                            <span className="font-medium">{event.resource_type}:{event.resource_id}</span>
                                        </p>
                                        <p className="text-caption text-muted-foreground">
                                            IP: {event.ip_address || "N/A"}
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0 text-muted-foreground">
                                        {expandedId === event.id ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </div>
                                </button>

                                {expandedId === event.id && (
                                    <div className="px-6 pb-4 ml-10 animate-fade-in-up">
                                        <pre className="text-caption font-mono bg-secondary rounded-[var(--radius-md)] p-4 overflow-x-auto text-foreground">
                                            {JSON.stringify({ changes: event.changes, details: event.details }, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
