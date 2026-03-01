export interface AuditLogResponse {
    id: string;
    tenant_id?: string;
    actor_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    changes?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    details?: string;
    created_at: string;
}
