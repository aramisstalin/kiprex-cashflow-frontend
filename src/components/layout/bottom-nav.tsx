"use client";

/**
 * BottomNav — mobile bottom navigation bar.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    LayoutDashboard,
    Settings,
    Shield,
} from "lucide-react";

const BOTTOM_ITEMS = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Admin", href: "/admin", icon: Shield },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="
        fixed bottom-0 inset-x-0 z-30 lg:hidden
        flex items-center justify-around
        h-[var(--bottom-nav-height)] px-2
        bg-background/90 backdrop-blur-md
        border-t border-border
        safe-area-inset-bottom
      "
        >
            {BOTTOM_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex flex-col items-center justify-center gap-1
              flex-1 py-2 touch-target
              transition-colors duration-[var(--duration-fast)]
              ${isActive ? "text-primary" : "text-muted-foreground"}
            `}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
