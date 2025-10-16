import axiosClient from "@/config/axios.config";
import { ApiResponse } from "./apiResponse";
import { AccountProfile } from "@/types/auth.types";

export const accountApi = {
    getMe: async (): Promise<AccountProfile> => {
        const resp = await axiosClient.get<ApiResponse<AccountProfile>>(
            "/accounts/me"
        );
        return resp.data.data;
    },
};
