export interface SessionResponse {
    id: string;
    user_id: string;
    ip_address?: string;
    user_agent?: string;
    last_active_at: string;
    is_active: boolean;
    created_at: string;
    user_display_name?: string;
    user_email?: string;
    location?: string;
    device?: string;
    current: boolean;
}
