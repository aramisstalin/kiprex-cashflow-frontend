export interface PermissionResponse {
    id: string;
    codename: string;
    description?: string;
    created_at: string;
}

export interface RoleResponse {
    id: string;
    name: string;
    description?: string;
    permissions: PermissionResponse[];
    user_count: number;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface RoleCreate {
    name: string;
    description?: string;
    permission_ids: string[];
}

export interface RoleUpdate {
    name?: string;
    description?: string;
    permission_ids?: string[];
}
