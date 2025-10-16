/**
 * API Response Types
 *
 * Centralized type definitions for API responses.
 * Provides type safety across all API interactions.
 *
 * @principle DRY - Single source of truth for response types
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
    data: T;
    message: string;
    success: boolean;
}

export interface ApiResponseDemo<T = unknown> {
    data: T;
    message: string;
    statusCode: statusCodeDemo;
}
export interface statusCodeDemo {
    code: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    message: string;
    success: boolean;
}

/**
 * Base response from backend (flexible structure)
 */
export interface BaseResponse<T = unknown> {
    status: number;
    data: T;
    message: string;
    serverStatus: number;
}

/**
 * List response
 */
export interface ListResponse<T> {
    items: T[];
    total: number;
    message: string;
    success: boolean;
}

/**
 * Success response without data
 */
export interface SuccessResponse {
    message: string;
    success: true;
}

/**
 * Type guard to check if response is successful
 */
export function successResponse<T>(
    response: ApiResponse<T> | BaseResponse<T>
): response is ApiResponse<T> {
    return "success" in response && response.success === true;
}

/**
 * Extract data from response
 */
export function extractData<T>(response: ApiResponse<T> | BaseResponse<T>): T {
    return response.data;
}
