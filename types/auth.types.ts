/**
 * Authentication Types
 *
 * Type definitions for authentication-related requests and responses.
 */

/**
 * Token validation response
 */
export interface TokenCheckResponse {
    id: string;
    email: string;
    userName: string;
    role: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isVerified?: boolean;
}

/**
 * Login request payload
 */
export interface LoginRequest {
    email?: string;
    password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
    status: string;
    expiresAt: string;
    accessToken: string;
    refreshToken?: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
    email: string;
    phone: string;
    password: string;
    userName: string;
    fullName: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
    status: string;
    expiresAt: string;
    accessToken: string;
    refreshToken?: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
    acccesToken: string;
    refreshToken: string;
    expiredAt: string;
    role: string;
}

/**
 * Account profile
 */
export interface AccountProfile {
    id: string;
    email: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
    email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
