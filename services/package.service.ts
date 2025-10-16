import axiosClient from "@/config/axios.config";
import { ApiResponse } from "@/types/response.types";

export interface TPackage {
    id: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    // Add other relevant fields as necessary
}

export const packageApi = {
    getPackages: async (): Promise<TPackage[]> => {
        try {
            const response = await axiosClient.get<ApiResponse<TPackage[]>>(
                "/package"
            );
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error("Failed to fetch package");
        } catch (error) {
            throw error;
        }
    },
    getPackageById: async (id: string) => {
        try {
            const response = await axiosClient.get<ApiResponse<TPackage>>(
                `/package/${id}`
            );
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error("Failed to fetch package");
        } catch (error) {
            throw error;
        }
    },
    createPackage: async (
        data: Omit<TPackage, "id" | "createdAt" | "updatedAt">
    ) => {
        try {
            const response = await axiosClient.post<ApiResponse<TPackage>>(
                "/package",
                data
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updatePackage: async (
        id: string,
        data: Omit<TPackage, "id" | "createdAt" | "updatedAt">
    ) => {
        try {
            const response = await axiosClient.put<ApiResponse<TPackage>>(
                `/package/${id}`,
                data
            );
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error("Failed to update package");
        } catch (error) {
            throw error;
        }
    },
    deletePackage: async (id: string) => {
        try {
            const response = await axiosClient.delete<ApiResponse<TPackage>>(
                `/package/${id}`
            );
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error("Failed to delete package");
        } catch (error) {
            throw error;
        }
    },
};
