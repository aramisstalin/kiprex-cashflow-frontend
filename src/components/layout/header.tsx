"use client";

/**
 * Header — top bar with search, theme toggle, and profile menu.
 */

import { useState } from "react";
import {
    Bell,
    LogOut,
    Menu,
    Moon,
    Search,
    Sun,
    User,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/hooks";
import { useTheme } from "@/components/theme-provider";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/lib/constants";

interface HeaderProps {
    onMenuClick: () => void;
    onCommandPalette: () => void;
}

export function Header({ onMenuClick, onCommandPalette }: HeaderProps) {
    const { user, logout } = useAuth();
    const { resolvedTheme, toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header
            className="
        sticky top-0 z-20 flex items-center justify-between
        h-[var(--header-height)] px-4 lg:px-6
        bg-background/80 backdrop-blur-md
        border-b border-border
      "
        >
            {/* Left: Menu (mobile) + Search */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-[var(--radius-md)] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-ring touch-target"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <button
                    onClick={onCommandPalette}
                    className="
            hidden sm:flex items-center gap-2 h-9 px-3
            rounded-[var(--radius-md)] border border-border bg-secondary/50
            text-body-sm text-muted-foreground
            hover:bg-secondary hover:text-foreground
            transition-colors duration-[var(--duration-fast)]
            focus-ring
          "
                >
                    <Search size={16} />
                    <span>Search...</span>
                    <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-caption font-mono">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="
            p-2 rounded-[var(--radius-md)] text-muted-foreground
            hover:bg-accent hover:text-foreground
            transition-colors duration-[var(--duration-fast)]
            focus-ring touch-target
          "
                    aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
                >
                    {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* Notifications */}
                <button
                    className="
            relative p-2 rounded-[var(--radius-md)] text-muted-foreground
            hover:bg-accent hover:text-foreground
            transition-colors duration-[var(--duration-fast)]
            focus-ring touch-target
          "
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                </button>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu((v) => !v)}
                        className="flex items-center gap-2 p-1 rounded-[var(--radius-md)] hover:bg-accent transition-colors focus-ring"
                    >
                        <Avatar
                            src={user?.avatar_url}
                            name={user?.display_name ?? "User"}
                            size="sm"
                        />
                    </button>

                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 z-50 rounded-[var(--radius-lg)] border border-border bg-popover shadow-[var(--shadow-lg)] py-1 animate-scale-in">
                                <div className="px-3 py-2 border-b border-border">
                                    <p className="text-body-sm font-medium text-popover-foreground">
                                        {user?.display_name}
                                    </p>
                                    <p className="text-caption text-muted-foreground truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <Link
                                    href={ROUTES.SETTINGS}
                                    onClick={() => setShowProfileMenu(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-body-sm text-popover-foreground hover:bg-accent transition-colors"
                                >
                                    <User size={16} />
                                    Profile & Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-destructive hover:bg-accent transition-colors"
                                >
                                    <LogOut size={16} />
                                    Log out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
