/**
 * Project Types
 *
 * Type definitions for project-related data.
 */

/**
 * Project status
 */
export enum ProjectStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

/**
 * Project priority
 */
export enum ProjectPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
}

/**
 * Project
 */
export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate?: string;
    endDate?: string;
    budget?: number;
    ownerId: string;
    teamMembers?: string[];
    tags?: string[];
    createdAt: string;
    updatedAt?: string;
}

/**
 * Create project request
 */
export interface CreateProjectRequest {
    name: string;
    description?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    startDate?: string;
    endDate?: string;
    budget?: number;
    teamMembers?: string[];
    tags?: string[];
}

/**
 * Update project request
 */
export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
    id: string;
}

/**
 * Project filter
 */
export interface ProjectFilter {
    status?: ProjectStatus | ProjectStatus[];
    priority?: ProjectPriority | ProjectPriority[];
    ownerId?: string;
    search?: string;
    tags?: string[];
    startDateFrom?: string;
    startDateTo?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
