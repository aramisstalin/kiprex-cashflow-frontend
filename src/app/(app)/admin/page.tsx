"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BarChart3,
    Lock,
    Monitor,
    ScrollText,
    Shield,
    Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/feedback/skeleton";
import { api } from "@/lib/api-client";
import type { DashboardStatsResponse } from "@/lib/types";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [rolesCount, setRolesCount] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            api.get<DashboardStatsResponse>("/admin/stats"),
            api.get<any[]>("/roles"),
        ])
            .then(([statsData, rolesData]) => {
                setStats(statsData);
                setRolesCount(rolesData.length);
            })
            .catch((err) => {
                console.error("Admin data fetch failed:", err);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const ADMIN_SECTIONS = [
        {
            href: "/admin/users",
            icon: Users,
            label: "User Management",
            description: "View, activate, and deactivate user accounts across tenants.",
            badge: stats ? `${stats.total_users.toLocaleString()} users` : "...",
        },
        {
            href: "/admin/roles",
            icon: Lock,
            label: "Roles & Permissions",
            description: "Define roles and assign fine-grained permission codenames.",
            badge: rolesCount ? `${rolesCount} roles` : "...",
        },
        {
            href: "/admin/sessions",
            icon: Monitor,
            label: "Session Management",
            description: "Monitor and revoke active user sessions in real time.",
            badge: stats ? `${stats.active_sessions.toLocaleString()} active` : "...",
        },
        {
            href: "/admin/audit-logs",
            icon: ScrollText,
            label: "Audit Logs",
            description: "Immutable event journal for compliance and security review.",
            badge: stats ? `${stats.audit_events_count.toLocaleString()} events` : "...",
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
                    <Shield size={22} />
                </div>
                <div>
                    <h1 className="text-heading-1 text-foreground">Admin Panel</h1>
                    <p className="text-body text-muted-foreground">
                        Manage users, roles, sessions, and audit logs.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ADMIN_SECTIONS.map((section) => (
                    <Link key={section.href} href={section.href} className="group">
                        <Card hover className="h-full">
                            <CardHeader>
                                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <section.icon size={20} />
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    {isLoading ? (
                                        <Skeleton className="h-6 w-20" />
                                    ) : (
                                        <Badge variant="outline">{section.badge}</Badge>
                                    )}
                                    <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </CardHeader>
                            <CardTitle className="mb-1">{section.label}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
