import axiosClient from "@/config/axios.config";
import { AccountProfile } from "@/types/auth.types";
import { ApiResponse } from "@/types/response.types";

export const accountApi = {
    getMe: async (): Promise<AccountProfile> => {
        const resp = await axiosClient.get<ApiResponse<AccountProfile>>(
            "/accounts/me"
        );
        return resp.data.data;
    },
    getWallet: async (): Promise<any> => {
        const resp = await axiosClient.get<ApiResponse<any>>("/consumers/wallet");
        return resp.data.data;
    }
};

// Consumer history endpoint
export const consumerApi = {
    getHistory: async (): Promise<string[]> => {
        const resp = await axiosClient.get<ApiResponse<string[]>>("/consumers/history");
        return resp.data.data;
    }
}
