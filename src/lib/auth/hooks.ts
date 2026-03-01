"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./provider";

/** Hook to access the auth context. Throws if used outside AuthProvider. */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

/** Convenience: get just the user. */
export function useUser() {
    const { user } = useAuth();
    return user;
}

/** Check if user has required permissions (for future RBAC integration). */
export function usePermissions() {
    const { user } = useAuth();

    return {
        /** Placeholder — will be populated via user roles once backend exposes them. */
        hasPermission: (_codename: string) => !!user,
        isAdmin: !!user, // Placeholder
    };
}
