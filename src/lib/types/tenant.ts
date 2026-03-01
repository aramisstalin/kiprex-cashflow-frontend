/** Tenant types — mirrors backend DTOs. */

export interface TenantResponse {
    id: string;
    name: string;
    slug: string;
    plan: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TenantCreate {
    name: string;
    slug: string;
    plan?: string;
    description?: string | null;
}
