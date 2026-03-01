"use client";

/**
 * AppShell — authenticated app layout.
 * Wraps all (app) routes with sidebar, header, command palette, and mobile nav.
 */

import { Suspense, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";

import { AuthGuard } from "@/lib/auth/guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CommandPalette } from "@/components/command-palette";

function PageLoader() {
    return (
        <div className="flex flex-col gap-4 p-6 animate-pulse">
            <div className="h-8 w-48 skeleton rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 skeleton rounded-[var(--radius-lg)]" />
                ))}
            </div>
            <div className="h-64 skeleton rounded-[var(--radius-lg)]" />
        </div>
    );
}

export default function AppLayout({ children }: { children: ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cmdOpen, setCmdOpen] = useState(false);

    const toggleSidebar = useCallback(
        () => setSidebarCollapsed((v) => !v),
        [],
    );
    const openDrawer = useCallback(() => setDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const openCmd = useCallback(() => setCmdOpen(true), []);
    const closeCmd = useCallback(() => setCmdOpen(false), []);

    // Global ⌘K / Ctrl+K listener
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCmdOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const sidebarWidth = sidebarCollapsed
        ? "lg:pl-[var(--sidebar-collapsed)]"
        : "lg:pl-[var(--sidebar-width)]";

    return (
        <AuthGuard>
            {/* Desktop Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

            {/* Mobile Drawer */}
            <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} />

            {/* Command Palette */}
            <CommandPalette isOpen={cmdOpen} onClose={closeCmd} />

            {/* Main content area */}
            <div
                className={`
          flex flex-col min-h-screen
          transition-all duration-[var(--duration-slow)] ease-[var(--ease-default)]
          ${sidebarWidth}
          pb-[var(--bottom-nav-height)] lg:pb-0
        `}
            >
                <Header onMenuClick={openDrawer} onCommandPalette={openCmd} />

                <main className="flex-1 w-full">
                    <Suspense fallback={<PageLoader />}>{children}</Suspense>
                </main>
            </div>

            {/* Mobile bottom nav */}
            <BottomNav />
        </AuthGuard>
    );
}
