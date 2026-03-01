"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="text-destructive" size={32} />
            </div>
            <h1 className="text-heading-1 text-foreground">Something went wrong</h1>
            <p className="text-body text-muted-foreground max-w-sm">
                An unexpected error occurred. Our team has been notified.
            </p>
            {error.digest && (
                <code className="text-caption text-muted-foreground">
                    Error ID: {error.digest}
                </code>
            )}
            <Button onClick={reset} className="mt-4">
                Try again
            </Button>
        </div>
    );
}
