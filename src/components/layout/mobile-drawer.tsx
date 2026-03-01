"use client";

/**
 * MobileDrawer — slide-in navigation drawer for mobile devices.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    LayoutDashboard,
    Lock,
    Monitor,
    ScrollText,
    Settings,
    Shield,
    Users,
    X,
    type LucideIcon,
} from "lucide-react";

import { ADMIN_NAV_ITEMS, NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/lib/auth/hooks";
import { Avatar } from "@/components/ui/avatar";

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

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    // Close on route change
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border shadow-[var(--shadow-xl)] animate-slide-in-left">
                {/* Header */}
                <div className="flex items-center justify-between h-[var(--header-height)] px-4 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground font-bold">
                            S
                        </div>
                        <span className="text-heading-3 text-sidebar-foreground">Social</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-[var(--radius-md)] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground focus-ring"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                        Main
                    </p>
                    {NAV_ITEMS.map((item) => {
                        const Icon = ICON_MAP[item.icon];
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)]
                  text-body font-medium touch-target
                  transition-colors duration-[var(--duration-fast)]
                  ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                    }
                `}
                            >
                                {Icon && <Icon size={20} />}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2 mt-6">
                        Administration
                    </p>
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = ICON_MAP[item.icon];
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)]
                  text-body font-medium touch-target
                  transition-colors duration-[var(--duration-fast)]
                  ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                    }
                `}
                            >
                                {Icon && <Icon size={20} />}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="border-t border-sidebar-border p-3">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar
                            src={user?.avatar_url}
                            name={user?.display_name ?? "User"}
                            size="sm"
                            status="online"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-body-sm font-medium text-sidebar-foreground truncate">
                                {user?.display_name ?? "User"}
                            </p>
                            <p className="text-caption text-muted-foreground truncate">
                                {user?.email ?? ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
