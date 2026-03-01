"use client";

/**
 * Sidebar — collapsible navigation with tenant switcher and user section.
 */

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Lock,
    Monitor,
    ScrollText,
    Settings,
    Shield,
    Users,
    type LucideIcon,
} from "lucide-react";

import { ADMIN_NAV_ITEMS, NAV_ITEMS, ROUTES, APP_NAME } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/hooks";

const ICON_MAP: Record<string, LucideIcon> = {
    LayoutDashboard,
    BarChart3,
    Settings,
    Shield,
    Users,
    Lock,
    Monitor,
    ScrollText,
};

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside
            className={`
        hidden lg:flex flex-col h-screen fixed top-0 left-0 z-30
        bg-sidebar border-r border-sidebar-border
        transition-all duration-[var(--duration-slow)] ease-[var(--ease-default)]
        ${collapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-width)]"}
      `}
        >
            {/* Logo / Brand */}
            <div className="flex items-center h-[var(--header-height)] px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground font-bold text-body">
                        {APP_NAME.charAt(0)}
                    </div>
                    {!collapsed && (
                        <span className="text-heading-3 text-sidebar-foreground whitespace-nowrap">
                            {APP_NAME}
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {/* Main Nav */}
                <div className="space-y-1">
                    {!collapsed && (
                        <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                            Main
                        </p>
                    )}
                    {NAV_ITEMS.map((item) => {
                        const Icon = ICON_MAP[item.icon];
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
                  text-body-sm font-medium
                  transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)]
                  focus-ring touch-target
                  ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                    }
                  ${collapsed ? "justify-center" : ""}
                `}
                                title={collapsed ? item.label : undefined}
                            >
                                {Icon && <Icon size={20} className="flex-shrink-0" />}
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* Admin Nav */}
                <div className="space-y-1 pt-4">
                    {!collapsed && (
                        <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                            Administration
                        </p>
                    )}
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = ICON_MAP[item.icon];
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
                  text-body-sm font-medium
                  transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)]
                  focus-ring touch-target
                  ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                    }
                  ${collapsed ? "justify-center" : ""}
                `}
                                title={collapsed ? item.label : undefined}
                            >
                                {Icon && <Icon size={20} className="flex-shrink-0" />}
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={onToggle}
                className="
          absolute top-1/2 -right-3 z-10
          flex items-center justify-center h-6 w-6
          rounded-full bg-card border border-border shadow-[var(--shadow-sm)]
          text-muted-foreground hover:text-foreground
          transition-colors duration-[var(--duration-fast)]
        "
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* User Section */}
            <div className="border-t border-sidebar-border p-3">
                <div
                    className={`
            flex items-center gap-3 px-2 py-2 rounded-[var(--radius-md)]
            hover:bg-sidebar-accent transition-colors duration-[var(--duration-fast)]
            cursor-pointer
            ${collapsed ? "justify-center" : ""}
          `}
                >
                    <Avatar
                        src={user?.avatar_url}
                        name={user?.display_name ?? "User"}
                        size="sm"
                        status="online"
                    />
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-body-sm font-medium text-sidebar-foreground truncate">
                                {user?.display_name ?? "User"}
                            </p>
                            <p className="text-caption text-muted-foreground truncate">
                                {user?.email ?? ""}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
