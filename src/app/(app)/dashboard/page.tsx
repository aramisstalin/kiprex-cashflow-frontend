"use client";

import { useEffect, useState } from "react";
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    CheckCircle,
    Clock,
    Shield,
    TrendingUp,
    Users,
} from "lucide-react";
import type { Metadata } from "next";

import { api } from "@/lib/api-client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCard, EmptyState } from "@/components/feedback/skeleton";
import type { UserResponse, DashboardStatsResponse, ActivityItem, HealthResponse } from "@/lib/types";

interface StatCard {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: React.ElementType;
    color: string;
}

const STAT_CARDS: StatCard[] = [
    { label: "Total Users", value: "2,847", change: "+12.5%", positive: true, icon: Users, color: "text-primary bg-primary/10" },
    { label: "Active Sessions", value: "184", change: "+4.2%", positive: true, icon: Activity, color: "text-success bg-success/10" },
    { label: "Audit Events", value: "12,058", change: "+8.1%", positive: true, icon: Shield, color: "text-warning bg-warning/10" },
    { label: "Avg Response", value: "42ms", change: "-18%", positive: true, icon: TrendingUp, color: "text-info bg-info/10" },
];

function formatRelativeTime(dateString: string) {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    // Only use Intl.RelativeTimeFormat if it's available, otherwise fallback
    if (typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return rtf.format(-days, "day");
        if (hours > 0) return rtf.format(-hours, "hour");
        if (minutes > 0) return rtf.format(-minutes, "minute");
        return "just now";
    }
    return new Date(dateString).toLocaleDateString();
}

function StatCardSkeleton() {
    return (
        <div className="rounded-[var(--radius-lg)] border border-border p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-16" />
        </div>
    );
}

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [health, setHealth] = useState<HealthResponse | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        Promise.all([
            api.get<UserResponse>("/users/me"),
            api.get<DashboardStatsResponse>("/admin/stats"),
            api.get<ActivityItem[]>("/admin/recent-activity"),
            api.get<HealthResponse>("http://localhost:8000/health", { absoluteUrl: true }),
        ])
            .then(([userData, statsData, activityData, healthData]) => {
                setUser(userData);
                setStats(statsData);
                setActivity(activityData);
                setHealth(healthData);
            })
            .catch((err) => {
                console.error("Dashboard data fetch failed:", err);
                setError("Failed to load dashboard data. Please try again later.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const statCards = stats ? [
        { label: "Total Users", value: stats.total_users.toString(), change: `+${stats.user_growth_pct}%`, positive: true, icon: Users, color: "text-primary bg-primary/10" },
        { label: "Active Sessions", value: stats.active_sessions.toString(), change: `+${stats.session_growth_pct}%`, positive: true, icon: Activity, color: "text-success bg-success/10" },
        { label: "Audit Events", value: stats.audit_events_count.toString(), change: `+${stats.audit_growth_pct}%`, positive: true, icon: Shield, color: "text-warning bg-warning/10" },
        { label: "Avg Response", value: `${stats.avg_response_time_ms}ms`, change: "-18%", positive: true, icon: TrendingUp, color: "text-info bg-info/10" },
    ] : [];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-heading-1 text-foreground">
                        Good morning
                        {user ? `, ${user.display_name.split(" ")[0]}` : ""}
                        {" "}👋
                    </h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Here&apos;s what&apos;s happening across your platform today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={health && health.status === "ok" ? "success" : "warning"} dot>
                        {health && health.status === "ok" ? "All systems operational" : "System Degraded"}
                    </Badge>
                </div>
                {error && (
                    <div className="p-4 rounded-[var(--radius-md)] bg-destructive/10 border border-destructive/20 text-destructive text-body-sm">
                        {error}
                    </div>
                )}
            </div>


            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading || !stats
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : statCards.map((stat) => (
                        <Card key={stat.label} hover className="group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <ArrowUpRight
                                    size={16}
                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]"
                                />
                            </div>
                            <p className="text-display text-foreground font-bold" style={{ fontSize: "2rem" }}>
                                {stat.value}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-body-sm text-muted-foreground">{stat.label}</p>
                            </div>
                            <p className={`text-caption mt-1 font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
                                {stat.change} this month
                            </p>
                        </Card>
                    ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card padding="none">
                        <CardHeader className="px-6 pt-6">
                            <CardTitle>Recent Activity</CardTitle>
                            <Badge variant="outline" className="text-caption">Live</Badge>
                        </CardHeader>
                        <div className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="p-4 px-6"><SkeletonCard /></div>
                                ))
                            ) : activity.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-body-sm">
                                    No recent activity found.
                                </div>
                            ) : (
                                activity.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 px-6 py-4 hover:bg-accent/30 transition-colors duration-[var(--duration-fast)]"
                                    >
                                        <Avatar name={item.user} size="sm" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-body-sm font-medium text-foreground">
                                                {item.user}
                                            </p>
                                            <p className="text-body-sm text-muted-foreground mt-0.5">
                                                {item.action}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span className="text-caption text-muted-foreground flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatRelativeTime(item.time)}
                                            </span>
                                            <Badge variant={item.type as "success" | "info" | "warning" | "default"}>
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Quick Actions + System Status */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <div className="space-y-2">
                            {[
                                { href: "/admin/users", label: "Manage Users", icon: Users },
                                { href: "/admin/roles", label: "Configure Roles", icon: Shield },
                                { href: "/analytics", label: "View Analytics", icon: BarChart3 },
                                { href: "/admin/audit-logs", label: "Audit Logs", icon: Activity },
                            ].map((action) => (
                                <a
                                    key={action.href}
                                    href={action.href}
                                    className="
                    flex items-center gap-3 p-3 rounded-[var(--radius-md)]
                    border border-border hover:border-primary/30 hover:bg-accent/50
                    transition-all duration-[var(--duration-fast)] group
                  "
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10 text-primary">
                                        <action.icon size={16} />
                                    </div>
                                    <span className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {action.label}
                                    </span>
                                    <ArrowUpRight size={14} className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                        </CardHeader>
                        <div className="space-y-3">
                            {health && health.services
                                ? Object.entries(health.services).map(([service, status]) => (
                                    <div key={service} className="flex items-center justify-between">
                                        <span className="text-body-sm text-muted-foreground">{service}</span>
                                        <div className={`flex items-center gap-1.5 ${status === "Operational" ? "text-success" : "text-destructive"}`}>
                                            <CheckCircle size={14} />
                                            <span className="text-caption font-medium">{status}</span>
                                        </div>
                                    </div>
                                ))
                                : Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))
                            }
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
