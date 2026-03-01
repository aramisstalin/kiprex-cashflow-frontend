"use client";

import type { Metadata } from "next";
import { Chrome } from "lucide-react";
import { useAuth } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const { resolvedTheme, toggleTheme } = useTheme();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-primary/3 blur-3xl" />
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-[var(--radius-md)] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-ring"
                aria-label="Toggle theme"
            >
                {resolvedTheme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Card */}
            <div className="relative w-full max-w-sm px-4 animate-fade-in-up">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-primary text-primary-foreground text-heading-2 font-bold shadow-[var(--shadow-lg)]">
                        {APP_NAME.charAt(0)}
                    </div>
                    <h1 className="text-heading-1 text-foreground">Welcome back</h1>
                    <p className="mt-2 text-body text-muted-foreground">
                        Sign in to your {APP_NAME} account
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-[var(--radius-xl)] border border-border bg-card/80 backdrop-blur-sm p-8 shadow-[var(--shadow-xl)]">
                    <Button
                        onClick={login}
                        isLoading={isLoading}
                        size="lg"
                        className="w-full"
                        leftIcon={
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        }
                    >
                        Continue with Google
                    </Button>

                    <div className="mt-6 text-center">
                        <p className="text-caption text-muted-foreground">
                            By signing in, you agree to our{" "}
                            <a href="#" className="underline underline-offset-2 hover:text-foreground">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline underline-offset-2 hover:text-foreground">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>

                {/* Security badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-caption text-muted-foreground">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secured with OAuth 2.0 + PKCE
                </div>
            </div>
        </div>
    );
}
