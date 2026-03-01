/** Application-wide constants. */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const AUTH_KEYS = {
    STATE: "oauth_state",
    CODE_VERIFIER: "oauth_code_verifier",
} as const;

export const ROUTES = {
    LOGIN: "/auth/login",
    CALLBACK: "/auth/callback",
    DASHBOARD: "/dashboard",
    ANALYTICS: "/analytics",
    ADMIN: "/admin",
    ADMIN_USERS: "/admin/users",
    ADMIN_ROLES: "/admin/roles",
    ADMIN_SESSIONS: "/admin/sessions",
    ADMIN_AUDIT_LOGS: "/admin/audit-logs",
    SETTINGS: "/settings",
    SETTINGS_SECURITY: "/settings/security",
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.CALLBACK] as const;

export const NAV_ITEMS = [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
    { label: "Analytics", href: ROUTES.ANALYTICS, icon: "BarChart3" },
    { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
] as const;

export const ADMIN_NAV_ITEMS = [
    { label: "Admin", href: ROUTES.ADMIN, icon: "Shield" },
    { label: "Users", href: ROUTES.ADMIN_USERS, icon: "Users" },
    { label: "Roles", href: ROUTES.ADMIN_ROLES, icon: "Lock" },
    { label: "Sessions", href: ROUTES.ADMIN_SESSIONS, icon: "Monitor" },
    { label: "Audit Logs", href: ROUTES.ADMIN_AUDIT_LOGS, icon: "ScrollText" },
] as const;
