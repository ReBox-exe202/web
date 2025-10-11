import { ApiResponse } from "./apiResponse";
import axiosClient from "@/config/axios.config";
import { basePath, createResourceEndpoints } from "@/lib/path.api";

export interface ILoginResponse {
    status: string;
    message: string;
    token: string;
    expired: string;
    userId: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export const userPath = basePath("users");
export const USER_API_ENDPOINTS = createResourceEndpoints(userPath);

export const authPath = basePath("auth");

export const AUTH_API_ENDPOINTS = createResourceEndpoints(authPath);

export const authApi = {
    login: async (payload: ILoginRequest): Promise<ApiResponse<ILoginResponse>> => {
        const response = await axiosClient.post(
            AUTH_API_ENDPOINTS.CUSTOM("/login"),
            payload
        );
        return response.data;
    },
};
