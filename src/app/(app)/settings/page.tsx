"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, Check, Chrome } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth/hooks";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserResponse, UserUpdate } from "@/lib/types";

export default function SettingsPage() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.display_name ?? "");
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? "");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

    useEffect(() => {
        if (user) {
            setDisplayName(user.display_name);
            setAvatarUrl(user.avatar_url ?? "");
        }
    }, [user]);

    const debouncedSave = useDebouncedCallback(
        async (updates: UserUpdate) => {
            setSaveStatus("saving");
            try {
                await api.patch("/users/me", updates);
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
            } catch {
                setSaveStatus("idle");
            }
        },
        800,
    );

    const handleNameChange = (value: string) => {
        setDisplayName(value);
        if (value.trim()) debouncedSave({ display_name: value.trim() });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-heading-1 text-foreground">Profile Settings</h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Manage your personal information and preferences.
                    </p>
                </div>
                {saveStatus === "saving" && (
                    <Badge variant="outline" className="animate-pulse">Saving…</Badge>
                )}
                {saveStatus === "saved" && (
                    <Badge variant="success" dot className="animate-fade-in">
                        <Check size={12} className="mr-1" /> Saved
                    </Badge>
                )}
            </div>

            {/* Avatar Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Avatar</CardTitle>
                </CardHeader>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Avatar
                            src={user?.avatar_url}
                            name={user?.display_name ?? "User"}
                            size="lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={20} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <p className="text-body-sm text-foreground font-medium">
                            {user?.display_name}
                        </p>
                        <p className="text-caption text-muted-foreground">
                            {user?.email}
                        </p>
                        <p className="text-caption text-muted-foreground mt-1">
                            Click the avatar to upload a new photo
                        </p>
                    </div>
                </div>
            </Card>

            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Changes are saved automatically.</CardDescription>
                </CardHeader>
                <div className="space-y-4 mt-4">
                    <Input
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Your name"
                    />
                    <Input
                        label="Email"
                        value={user?.email ?? ""}
                        disabled
                        helpText="Email is managed through your Google account."
                    />
                    <Input
                        label="Tenant ID"
                        value={user?.tenant_id ?? ""}
                        disabled
                        helpText="Your organization identifier."
                    />
                </div>
            </Card>

            {/* Connected Accounts */}
            <Card>
                <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>Manage your linked OAuth providers.</CardDescription>
                </CardHeader>
                <div className="mt-4 flex items-center justify-between p-4 rounded-[var(--radius-md)] border border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-secondary">
                            <svg viewBox="0 0 24 24" className="h-5 w-5">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-body-sm font-medium text-foreground">Google</p>
                            <p className="text-caption text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Badge variant="success" dot>Connected</Badge>
                </div>
            </Card>
        </div>
    );
}
