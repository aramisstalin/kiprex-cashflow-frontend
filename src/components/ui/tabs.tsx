"use client";

import type { ReactNode } from "react";

interface TabItem {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    items: TabItem[];
    activeId: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ items, activeId, onChange, className = "" }: TabsProps) {
    return (
        <div
            className={`flex border-b border-border overflow-x-auto ${className}`}
            role="tablist"
        >
            {items.map((item) => (
                <button
                    key={item.id}
                    role="tab"
                    aria-selected={activeId === item.id}
                    onClick={() => onChange(item.id)}
                    className={`
            relative flex items-center gap-2 px-4 py-3 text-body-sm font-medium
            whitespace-nowrap transition-colors duration-[var(--duration-fast)]
            focus-ring touch-target
            ${activeId === item.id
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }
          `}
                >
                    {item.icon}
                    {item.label}
                    {activeId === item.id && (
                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}
