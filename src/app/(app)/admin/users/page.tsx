"use client";

import { useEffect, useState } from "react";
import { Search, UserMinus, UserCheck } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/feedback/skeleton";
import type { UserResponse } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError(null);
            try {
                const data = await api.get<UserResponse[]>("/users");
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setError("Failed to load users list.");
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const filtered = users.filter(
        (u) =>
            !debouncedQuery ||
            u.display_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-heading-1 text-foreground">User Management</h1>
                <p className="text-body text-muted-foreground mt-1">
                    Search and manage all user accounts.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name or email…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        leftIcon={<Search size={16} />}
                    />
                </div>
            </div>
            {error && (
                <div className="p-4 rounded-[var(--radius-md)] bg-destructive/10 border border-destructive/20 text-destructive text-body-sm">
                    {error}
                </div>
            )}


            <Card padding="none">
                <CardHeader className="px-6 pt-5">
                    <CardTitle>All Users</CardTitle>
                    <Badge variant="outline">{filtered.length} users</Badge>
                </CardHeader>
                <div className="divide-y divide-border">
                    {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>
                        ))
                        : filtered.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-accent/30 transition-colors"
                            >
                                <Avatar name={user.display_name} src={user.avatar_url} size="md" status={user.is_active ? "online" : "offline"} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-body-sm font-medium text-foreground">{user.display_name}</p>
                                    <p className="text-caption text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={user.is_active ? "success" : "outline"} dot={user.is_active}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        leftIcon={user.is_active ? <UserMinus size={14} /> : <UserCheck size={14} />}
                                        className={user.is_active ? "text-destructive hover:text-destructive" : "text-success hover:text-success"}
                                    >
                                        {user.is_active ? "Deactivate" : "Activate"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            </Card>
        </div>
    );
}
