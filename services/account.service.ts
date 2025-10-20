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
};
