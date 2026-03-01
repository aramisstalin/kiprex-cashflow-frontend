import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    dot?: boolean;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
    outline: "border border-border text-muted-foreground",
};

const dotColors: Record<BadgeVariant, string> = {
    default: "bg-secondary-foreground",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    outline: "bg-muted-foreground",
};

export function Badge({
    variant = "default",
    children,
    dot = false,
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 rounded-[var(--radius-full)]
        px-2.5 py-0.5 text-caption font-medium
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {dot && (
                <span
                    className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
                />
            )}
            {children}
        </span>
    );
}
