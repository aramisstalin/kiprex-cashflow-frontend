export interface StatItem {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon_key?: string;
}

export interface DashboardStatsResponse {
    total_users: number;
    active_sessions: number;
    audit_events_count: number;
    avg_response_time_ms: number;
    user_growth_pct: number;
    session_growth_pct: number;
    audit_growth_pct: number;
}

export interface ActivityItem {
    id: string;
    user: string;
    action: string;
    time: string;
    type: "success" | "info" | "warning" | "default";
}

export interface HealthResponse {
    status: string;
    version: string;
    environment: string;
    services: Record<string, string>;
}

export interface UserRoleData {
    label: string;
    count: number;
    color: string;
}

export interface TopUserActivity {
    name: string;
    events: number;
    sessions: number;
    duration: string;
    active: boolean;
}

export interface AnalyticsResponse {
    user_growth: number[];
    total_users_for_roles: number;
    roles_distribution: UserRoleData[];
    top_users: TopUserActivity[];
}
