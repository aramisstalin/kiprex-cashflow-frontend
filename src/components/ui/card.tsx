import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export function Card({
    children,
    className = "",
    hover = false,
    padding = "md",
    ...props
}: CardProps) {
    return (
        <div
            className={`
        rounded-[var(--radius-lg)] border border-border bg-card
        shadow-[var(--shadow-xs)]
        transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]
        ${hover ? "hover:shadow-[var(--shadow-md)] hover:border-primary/20 cursor-pointer" : ""}
        ${paddingStyles[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <h3 className={`text-heading-3 text-card-foreground ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <p className={`text-body-sm text-muted-foreground ${className}`}>
            {children}
        </p>
    );
}
