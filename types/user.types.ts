/**
 * Account Types
 *
 * Type definitions for user-related data.
 */

/**
 * Account role
 */
export enum AccountRole {
    ADMIN = "admin",
    MERCHANT = "merchant",
    CONSUMER = "consumer",
    GUEST = "guest",
}
/**
 * Navigation item
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export type NavigationByRole = Record<AccountRole, NavigationItem[]>;

/**
 * Account status
 */
export enum AccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
}

/**
 * Account
 */
export interface Account {
    id: string;
    email: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    avatar?: string;
    role: AccountRole;
    status: AccountStatus;
    phone?: string;
    department?: string;
    position?: string;
    emailConfirmed?: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Create user request
 */
export interface CreateAccountRequest {
    email: string;
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: AccountRole;
    phone?: string;
    department?: string;
    position?: string;
}

/**
 * Update user request
 */
export interface UpdateAccountRequest
    extends Partial<Omit<CreateAccountRequest, "password">> {
    id: string;
}

/**
 * Account filter
 */
export interface AccountFilter {
    role?: AccountRole | AccountRole[];
    status?: AccountStatus | AccountStatus[];
    department?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
