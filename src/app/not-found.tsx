import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <p className="text-[8rem] font-bold leading-none text-primary/10 select-none">
                404
            </p>
            <h1 className="text-heading-1 text-foreground -mt-8">Page not found</h1>
            <p className="mt-3 text-body text-muted-foreground max-w-sm">
                The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href={ROUTES.DASHBOARD}
                className="
          mt-8 inline-flex items-center justify-center h-10 px-6
          rounded-[var(--radius-md)] bg-primary text-primary-foreground
          text-body font-medium shadow-sm
          transition-all duration-[var(--duration-normal)] hover:bg-primary/90
          active:scale-[0.98]
        "
            >
                Back to Dashboard
            </Link>
        </div>
    );
}
