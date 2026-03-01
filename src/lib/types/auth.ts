/** Auth types — mirrors backend DTOs. */

export interface GoogleCallbackRequest {
    code: string;
    state: string;
    code_verifier: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface LogoutRequest {
    refresh_token?: string | null;
    logout_all?: boolean;
}

export interface GoogleAuthorizeResponse {
    authorize_url: string;
    state: string;
    code_verifier: string;
}
