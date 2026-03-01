"use client";

/**
 * CommandPalette — ⌘K / Ctrl+K fuzzy search overlay.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    LayoutDashboard,
    Lock,
    LogOut,
    Monitor,
    Moon,
    ScrollText,
    Search,
    Settings,
    Shield,
    Sun,
    Users,
    type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/lib/auth/hooks";
import { useTheme } from "@/components/theme-provider";

interface CommandItem {
    id: string;
    label: string;
    icon: LucideIcon;
    category: string;
    action: () => void;
    keywords?: string[];
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter();
    const { logout } = useAuth();
    const { resolvedTheme, toggleTheme } = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const navigate = useCallback(
        (path: string) => {
            router.push(path);
            onClose();
        },
        [router, onClose],
    );

    const items: CommandItem[] = useMemo(
        () => [
            { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, category: "Navigation", action: () => navigate("/dashboard") },
            { id: "analytics", label: "Go to Analytics", icon: BarChart3, category: "Navigation", action: () => navigate("/analytics") },
            { id: "settings", label: "Go to Settings", icon: Settings, category: "Navigation", action: () => navigate("/settings") },
            { id: "admin", label: "Go to Admin Panel", icon: Shield, category: "Navigation", action: () => navigate("/admin") },
            { id: "users", label: "Manage Users", icon: Users, category: "Admin", action: () => navigate("/admin/users"), keywords: ["user", "people"] },
            { id: "roles", label: "Manage Roles", icon: Lock, category: "Admin", action: () => navigate("/admin/roles"), keywords: ["role", "permission"] },
            { id: "sessions", label: "View Sessions", icon: Monitor, category: "Admin", action: () => navigate("/admin/sessions") },
            { id: "audit", label: "View Audit Logs", icon: ScrollText, category: "Admin", action: () => navigate("/admin/audit-logs"), keywords: ["audit", "log", "history"] },
            { id: "theme", label: `Switch to ${resolvedTheme === "light" ? "Dark" : "Light"} Mode`, icon: resolvedTheme === "light" ? Moon : Sun, category: "Actions", action: () => { toggleTheme(); onClose(); } },
            { id: "logout", label: "Log Out", icon: LogOut, category: "Actions", action: () => { logout(); onClose(); } },
        ],
        [navigate, resolvedTheme, toggleTheme, logout, onClose],
    );

    const filtered = useMemo(() => {
        if (!query) return items;
        const lowerQuery = query.toLowerCase();
        return items.filter(
            (item) =>
                item.label.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery) ||
                item.keywords?.some((k) => k.includes(lowerQuery)),
        );
    }, [items, query]);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handler = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((i) => Math.max(i - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    filtered[activeIndex]?.action();
                    break;
                case "Escape":
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, filtered, activeIndex, onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    // Group items by category
    const grouped = filtered.reduce(
        (acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        },
        {} as Record<string, CommandItem[]>,
    );

    let itemIndex = -1;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in" />

            <div
                className="relative w-full max-w-lg rounded-[var(--radius-xl)] bg-popover border border-border shadow-[var(--shadow-xl)] overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 border-b border-border">
                    <Search size={18} className="text-muted-foreground flex-shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setActiveIndex(0);
                        }}
                        placeholder="Type a command or search..."
                        className="flex-1 h-12 bg-transparent text-body text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <kbd className="hidden sm:inline rounded border border-border bg-secondary px-1.5 py-0.5 text-caption font-mono text-muted-foreground">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto py-2">
                    {filtered.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-body-sm text-muted-foreground">
                            No results found
                        </div>
                    ) : (
                        Object.entries(grouped).map(([category, items]) => (
                            <div key={category}>
                                <p className="px-4 py-1.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                                    {category}
                                </p>
                                {items.map((item) => {
                                    itemIndex++;
                                    const currentIndex = itemIndex;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={item.action}
                                            className={`
                        flex items-center gap-3 w-full px-4 py-2.5 text-left
                        text-body-sm transition-colors duration-75
                        ${currentIndex === activeIndex
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-popover-foreground hover:bg-accent/50"
                                                }
                      `}
                                        >
                                            <item.icon size={18} className="flex-shrink-0 text-muted-foreground" />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-caption text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-mono">↑</kbd>
                        <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-mono">↓</kbd>
                        navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-mono">↵</kbd>
                        select
                    </span>
                </div>
            </div>
        </div>
    );
}
