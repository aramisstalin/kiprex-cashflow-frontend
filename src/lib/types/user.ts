/** User types — mirrors backend DTOs. */

export interface UserResponse {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    is_active: boolean;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface UserUpdate {
    display_name?: string | null;
    avatar_url?: string | null;
}

export interface UserBriefResponse {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
}
