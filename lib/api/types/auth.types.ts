/**
 * Authentication Types
 *
 * Type definitions for authentication-related requests and responses.
 */

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
    message: string;
    token: string;
    expired: string;
    userId: string;
    refreshToken?: string;
}

/**
 * Login response
 */
export interface LoginResponseDemo {
    token: string;
    role: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
    status: string;
    message: string;
    userId: string;
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
    token: string;
    refreshToken: string;
    expired: string;
}

/**
 * Account profile
 */
export interface AccountProfile {
    id: string;
    email: string;
    username: string;
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
