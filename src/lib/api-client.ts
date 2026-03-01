/**
 * API Client — typed fetch wrapper with automatic auth injection + 401 retry.
 */

import { API_BASE_URL } from "@/lib/constants";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly body: unknown,
    ) {
        super(`API Error ${status}: ${statusText}`);
        this.name = "ApiError";
    }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    skipAuth?: boolean;
    absoluteUrl?: boolean;
}

async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { body, skipAuth = false, ...init } = options;

    const headers = new Headers(init.headers);

    if (body !== undefined) {
        headers.set("Content-Type", "application/json");
    }

    const baseUrl = options.absoluteUrl ? "" : API_BASE_URL;
    let res = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers,
        credentials: "include", // Send cookies with request
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // Handle 401 unauthorized globally
    // If the server rejects the token, we try to refresh it
    if (res.status === 401 && !skipAuth) {
        // Call the refresh endpoint to get new cookies
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (refreshRes.ok) {
            // Retry the original request
            res = await fetch(`${baseUrl}${path}`, {
                ...init,
                headers,
                credentials: "include",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            });
        }
    }

    if (res.status === 204) return undefined as T;

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new ApiError(res.status, res.statusText, errorBody);
    }

    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(path: string, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "GET" }),

    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "POST", body }),

    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "PATCH", body }),

    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "PUT", body }),

    delete: <T>(path: string, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "DELETE" }),
};
