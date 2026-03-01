"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Check, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { api } from "@/lib/api-client";
import { SkeletonCard } from "@/components/feedback/skeleton";
import type { RoleResponse, PermissionResponse } from "@/lib/types";

export default function AdminRolesPage() {
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [rolesData, permsData] = await Promise.all([
                    api.get<RoleResponse[]>("/roles"),
                    api.get<PermissionResponse[]>("/roles/permissions"),
                ]);
                setRoles(rolesData);
                setPermissions(permsData);
            } catch (error) {
                console.error("Failed to fetch roles/permissions:", error);
                setError("Failed to load roles and permissions.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-heading-1 text-foreground">Roles & Permissions</h1>
                    <p className="text-body text-muted-foreground mt-1">Define roles and assign permissions.</p>
                </div>
                <Button leftIcon={<Plus size={16} />}>New Role</Button>
            </div>
            {error && (
                <div className="p-4 rounded-[var(--radius-md)] bg-destructive/10 border border-destructive/20 text-destructive text-body-sm">
                    {error}
                </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    roles.map((role) => (
                        <Card key={role.id} hover className="cursor-pointer" onClick={() => { setSelectedRole(role); setIsModalOpen(true); }}>
                            <CardHeader>
                                <div>
                                    <CardTitle>{role.name}</CardTitle>
                                    <p className="text-body-sm text-muted-foreground mt-0.5">{role.description}</p>
                                </div>
                                <Badge variant="outline">{role.user_count} users</Badge>
                            </CardHeader>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {role.permissions.map((p) => (
                                    <Badge key={p.id} variant="info" className="font-mono text-[11px]">{p.codename}</Badge>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                <Button variant="ghost" size="sm" leftIcon={<Edit size={14} />} onClick={(e) => e.stopPropagation()}>Edit</Button>
                                <Button variant="ghost" size="sm" leftIcon={<Trash2 size={14} />} className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>Delete</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Permission Matrix Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit: ${selectedRole?.name}`} description="Toggle permissions for this role." size="md">
                {selectedRole && (
                    <div className="space-y-3">
                        {permissions.map((perm) => {
                            const hasIt = selectedRole.permissions.some(p => p.id === perm.id);
                            return (
                                <label
                                    key={perm.id}
                                    className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                                >
                                    <span className="font-mono text-body-sm text-foreground">{perm.codename}</span>
                                    <div className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 transition-colors ${hasIt ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                                        {hasIt && <Check size={12} />}
                                    </div>
                                </label>
                            );
                        })}
                        <div className="flex gap-3 pt-4">
                            <Button className="flex-1">Save Changes</Button>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
