"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

import { api } from "@/lib/api-client";
import { AUTH_KEYS, ROUTES } from "@/lib/constants";
import type { TokenResponse } from "@/lib/types";
import { useAuth } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        async function handleCallback() {
            const code = searchParams.get("code");
            const stateFromUrl = searchParams.get("state");
            const errorParam = searchParams.get("error");

            if (errorParam) {
                setError(`Google denied access: ${errorParam}`);
                return;
            }

            if (!code || !stateFromUrl) {
                setError("Missing authorization parameters.");
                return;
            }

            const storedState = sessionStorage.getItem(AUTH_KEYS.STATE);
            const codeVerifier = sessionStorage.getItem(AUTH_KEYS.CODE_VERIFIER);

            if (!storedState || storedState !== stateFromUrl) {
                setError("Security check failed: state mismatch. Please try again.");
                return;
            }

            if (!codeVerifier) {
                setError("Missing PKCE code verifier. Please try again.");
                return;
            }

            // Clear PKCE params from sessionStorage
            sessionStorage.removeItem(AUTH_KEYS.STATE);
            sessionStorage.removeItem(AUTH_KEYS.CODE_VERIFIER);

            try {
                await api.post<TokenResponse>(
                    "/auth/google/callback",
                    { code, state: stateFromUrl, code_verifier: codeVerifier },
                    { skipAuth: true },
                );

                await refreshUser();
                router.replace(ROUTES.DASHBOARD);
            } catch (err: unknown) {
                const msg =
                    err instanceof Error ? err.message : "Authentication failed.";
                setError(msg);
            }
        }

        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                    <XCircle className="text-destructive" size={32} />
                </div>
                <h1 className="text-heading-2 text-foreground mb-2">Sign-in failed</h1>
                <p className="text-body text-muted-foreground mb-6 max-w-sm text-center">
                    {error}
                </p>
                <Button onClick={() => router.replace(ROUTES.LOGIN)}>
                    Try again
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-body text-muted-foreground">Completing sign-in…</p>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-body text-muted-foreground">Completing sign-in…</p>
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}
