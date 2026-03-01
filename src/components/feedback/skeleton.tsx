import type { ReactNode } from "react";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return <div className={`skeleton ${className}`} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
                />
            ))}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-[var(--radius-lg)] border border-border p-6">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <SkeletonText lines={2} />
        </div>
    );
}

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className = "",
}: EmptyStateProps) {
    return (
        <div
            className={`
        flex flex-col items-center justify-center py-16 px-4 text-center
        animate-fade-in-up
        ${className}
      `}
        >
            {icon && (
                <div className="mb-4 text-muted-foreground opacity-50">{icon}</div>
            )}
            <h3 className="text-heading-3 text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-body text-muted-foreground max-w-sm mb-6">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
