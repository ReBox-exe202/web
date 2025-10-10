import axiosClient from "@/config/axios.config";
import type {
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    AccountProfile,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    LoginResponseDemo,
} from "../types/auth.types";
import type {
    SuccessResponse,
    ApiResponse,
    ApiResponseDemo,
} from "../types/response.types";

async function postApi<TRequest, TResponse = unknown>(
    url: string,
    data?: TRequest
) {
    const resp = await axiosClient.post<ApiResponseDemo<TResponse>>(url, data);
    // axiosClient interceptor returns the raw axios response; the project uses ApiResponse wrapper
    if (resp && resp.data && resp.status >= 200 && resp.status < 300) {
        return resp.data as ApiResponseDemo<TResponse>;
    }
    // Try to surface message when possible
    const msg = getMessageFromResponse(resp) || "API request failed";
    throw new Error(msg);
}

function getMessageFromResponse(resp: unknown): string | undefined {
    if (!resp || typeof resp !== "object") return undefined;
    const r = resp as Record<string, unknown>;
    if (typeof r.message === "string") return r.message;
    if (r.data && typeof r.data === "object") {
        const d = r.data as Record<string, unknown>;
        if (typeof d.message === "string") return d.message;
    }
    return undefined;
}

const AuthService = {
    login: async (credentials: LoginRequest) => {
        const result = await postApi<LoginRequest, LoginResponseDemo>(
            "auth/login",
            credentials
        );
        return result.data;
    },

    register: async (data: RegisterRequest) => {
        const result = await postApi<RegisterRequest, RegisterResponse>(
            "/register",
            data
        );
        return result.data;
    },

    logout: async () => {
        await postApi<void, SuccessResponse>("/logout");
    },

    refreshToken: async (data: RefreshTokenRequest) => {
        const result = await postApi<RefreshTokenRequest, RefreshTokenResponse>(
            "/refresh-token",
            data
        );
        return result.data;
    },

    getCurrentAccount: async () => {
        const resp = await axiosClient.get<ApiResponse<AccountProfile>>(
            "/profile"
        );
        if (resp && resp.data && resp.data.success && resp.data.data) {
            return resp.data.data;
        }
        throw new Error(
            getMessageFromResponse(resp) || "Failed to fetch profile"
        );
    },

    updateProfile: async (data: Partial<AccountProfile>) => {
        const resp = await axiosClient.put<ApiResponse<AccountProfile>>(
            "/profile",
            data
        );
        if (resp && resp.data && resp.data.success && resp.data.data) {
            return resp.data.data;
        }
        throw new Error(
            getMessageFromResponse(resp) || "Failed to update profile"
        );
    },

    changePassword: async (data: ChangePasswordRequest) => {
        const result = await postApi<ChangePasswordRequest, SuccessResponse>(
            "/change-password",
            data
        );
        return result.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest) => {
        const result = await postApi<ForgotPasswordRequest, SuccessResponse>(
            "/forgot-password",
            data
        );
        return result.data;
    },

    resetPassword: async (data: ResetPasswordRequest) => {
        const result = await postApi<ResetPasswordRequest, SuccessResponse>(
            "/reset-password",
            data
        );
        return result.data;
    },

    verifyEmail: async (token: string) => {
        const result = await postApi<void, SuccessResponse>(
            `/verify-email/${token}`
        );
        return result.data;
    },

    resendVerificationEmail: async (email: string) => {
        const result = await postApi<{ email: string }, SuccessResponse>(
            "/resend-verification",
            { email }
        );
        return result.data;
    },
};

export default AuthService;
