"use client";

/**
 * AuthProvider — React context for authentication state.
 *
 * Manages: user loading on mount (via silent refresh), login redirect,
 * logout, and provides the current user to the component tree.
 */

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api-client";
import { AUTH_KEYS, ROUTES } from "@/lib/constants";
import type { GoogleAuthorizeResponse, UserResponse } from "@/lib/types";

export interface AuthContextValue {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: (logoutAll?: boolean) => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount: attempt silent auth check via refresh token
    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                const me = await api.get<UserResponse>("/users/me");
                if (!cancelled) {
                    setUser(me);
                }
            } catch {
                // Not authenticated
                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        init();
        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async () => {
        try {
            const redirectUri = `${window.location.origin}${ROUTES.CALLBACK}`;
            const data = await api.get<GoogleAuthorizeResponse>(
                `/auth/google/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`,
                { skipAuth: true },
            );

            // Store PKCE params temporarily for the callback
            sessionStorage.setItem(AUTH_KEYS.STATE, data.state);
            sessionStorage.setItem(AUTH_KEYS.CODE_VERIFIER, data.code_verifier);

            // Redirect user to Google
            window.location.href = data.authorize_url;
        } catch (error) {
            console.error("Failed to initiate login:", error);
            throw error;
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const me = await api.get<UserResponse>("/users/me");
            setUser(me);
        } catch (error) {
            console.error("Failed to refresh user:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(
        async (logoutAll = false) => {
            try {
                await api.post("/auth/logout", {
                    logout_all: logoutAll,
                });
            } catch {
                // Best-effort server logout; always clear client state
            } finally {
                setUser(null);
                router.push(ROUTES.LOGIN);
            }
        },
        [router],
    );

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isLoading,
            login,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, logout, refreshUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
