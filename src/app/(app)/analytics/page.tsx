"use client";

import {
    ArrowUpRight,
    BarChart3,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { SkeletonCard } from "@/components/feedback/skeleton";
import type { DashboardStatsResponse, AnalyticsResponse } from "@/lib/types";
import type { Metadata } from "next";

const TIME_RANGES = [
    { id: "7d", label: "7 days" },
    { id: "30d", label: "30 days" },
    { id: "90d", label: "90 days" },
    { id: "1y", label: "1 year" },
];

const METRICS_MOCK = [
    { label: "New Users", value: "2,847", change: "+12.5%", positive: true },
    { label: "Active Users", value: "1,204", change: "+4.2%", positive: true },
    { label: "Churn Rate", value: "1.8%", change: "-0.3%", positive: true },
    { label: "Avg Session", value: "8m 22s", change: "+0.5m", positive: true },
];

// Minimal inline SVG bar chart
function GrowthChart({ data, height = 200 }: { data: number[], height?: number }) {
    const maxVal = Math.max(...data, 1);
    return (
        <div className="flex items-end justify-between gap-1.5" style={{ height }}>
            {data.map((val, i) => (
                <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/80 transition-all duration-500 hover:bg-primary"
                    style={{ height: `${(val / maxVal) * 100}%`, minWidth: 0 }}
                />
            ))}
        </div>
    );
}

// Minimal sparkline
function Sparkline({ positive }: { positive: boolean }) {
    const points = [0, 15, 8, 25, 18, 30, 22, 40].map(
        (v, i, arr) => `${(i / (arr.length - 1)) * 100},${100 - v * 2.5}`
    ).join(" ");
    return (
        <svg viewBox="0 0 100 100" className="h-10 w-20" preserveAspectRatio="none">
            <polyline
                points={points}
                fill="none"
                stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function AnalyticsPage() {
    const [activeRange, setActiveRange] = useState("30d");
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        Promise.all([
            api.get<DashboardStatsResponse>(`/admin/stats?range=${activeRange}`),
            api.get<AnalyticsResponse>(`/admin/analytics?range=${activeRange}`)
        ])
            .then(([statsData, analyticsData]) => {
                setStats(statsData);
                setAnalytics(analyticsData);
            })
            .catch((err) => {
                console.error("Failed to fetch analytics:", err);
                setError("Failed to load analytics data.");
            })
            .finally(() => setIsLoading(false));
    }, [activeRange]);

    const metrics = stats ? [
        { label: "New Users", value: stats.total_users.toString(), change: `+${stats.user_growth_pct}%`, positive: true },
        { label: "Active Users", value: stats.active_sessions.toString(), change: `+${stats.session_growth_pct}%`, positive: true },
        { label: "Audit Volume", value: stats.audit_events_count.toString(), change: `+${stats.audit_growth_pct}%`, positive: true },
        { label: "Avg Session", value: "8m 22s", change: "+0.5m", positive: true },
    ] : METRICS_MOCK;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-heading-1 text-foreground">Analytics</h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Platform-wide metrics and user insights.
                    </p>
                </div>
                <Badge variant="info">Live data</Badge>
            </div>
            {error && (
                <div className="p-4 rounded-[var(--radius-md)] bg-destructive/10 border border-destructive/20 text-destructive text-body-sm">
                    {error}
                </div>
            )}


            {/* Time Range */}
            <Tabs
                items={TIME_RANGES}
                activeId={activeRange}
                onChange={setActiveRange}
            />

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading || !stats
                    ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                    : metrics.map((m) => (
                        <Card key={m.label} hover>
                            <div className="flex items-start justify-between">
                                <p className="text-body-sm text-muted-foreground">{m.label}</p>
                                <Sparkline positive={m.positive} />
                            </div>
                            <p className="text-heading-2 text-foreground mt-2">{m.value}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {m.positive ? (
                                    <TrendingUp size={14} className="text-success" />
                                ) : (
                                    <TrendingDown size={14} className="text-destructive" />
                                )}
                                <span className={`text-caption font-medium ${m.positive ? "text-success" : "text-destructive"}`}>
                                    {m.change}
                                </span>
                                <span className="text-caption text-muted-foreground">vs. prev period</span>
                            </div>
                        </Card>
                    ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2" padding="md">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <Badge variant="outline">Monthly</Badge>
                    </CardHeader>
                    {analytics ? (
                        <GrowthChart data={analytics.user_growth} height={240} />
                    ) : (
                        <SkeletonCard />
                    )}
                    <div className="flex items-center justify-between mt-3 text-caption text-muted-foreground">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                            <span key={m} className="hidden sm:inline">{m}</span>
                        ))}
                    </div>
                </Card>

                {/* Donut placeholder */}
                <Card padding="md">
                    <CardHeader>
                        <CardTitle>User Roles</CardTitle>
                    </CardHeader>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex h-32 w-32 items-center justify-center">
                            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="60 40" strokeLinecap="round" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--success))" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-60" strokeLinecap="round" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--warning))" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-85" strokeLinecap="round" />
                            </svg>
                            <div className="absolute text-center">
                                <p className="text-heading-3 text-foreground font-bold">{analytics?.total_users_for_roles || "0"}</p>
                                <p className="text-caption text-muted-foreground">total</p>
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            {analytics?.roles_distribution?.map((r) => (
                                <div key={r.label} className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${r.color}`} />
                                    <span className="text-body-sm text-foreground flex-1">{r.label}</span>
                                    <span className="text-body-sm font-medium text-muted-foreground">
                                        {analytics.total_users_for_roles > 0
                                            ? Math.round((r.count / analytics.total_users_for_roles) * 100)
                                            : 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Data Table Placeholder */}
            <Card padding="none">
                <CardHeader className="px-6 pt-6">
                    <CardTitle>Top Activity by User</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {["User", "Events", "Sessions", "Avg Duration", "Status"].map((h) => (
                                    <th key={h} className="py-3 px-6 text-left text-caption font-semibold text-muted-foreground uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {analytics ? analytics.top_users.map((row, i) => (
                                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-caption font-semibold">
                                                {row.name.charAt(0)}
                                            </div>
                                            <span className="text-body-sm font-medium text-foreground">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-body-sm text-foreground">{row.events}</td>
                                    <td className="py-3 px-6 text-body-sm text-foreground">{row.sessions}</td>
                                    <td className="py-3 px-6 text-body-sm text-foreground">{row.duration}</td>
                                    <td className="py-3 px-6">
                                        <Badge variant={row.active ? "success" : "outline"} dot={row.active}>
                                            {row.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center"><SkeletonCard /></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
