import axiosClient from "@/config/axios.config";
import type { ApiResponse } from "@/types/response.types";

export const emailVerificationService = {
  /**
   * Send email confirmation to user
   */
  sendConfirmationEmail: async (email: string) => {
    const response = await axiosClient.post<ApiResponse<null>>(
      "auth/send-confirm-email",
      { email }
    );
    return response.data;
  },

  /**
   * Verify email with token from email link
   * Note: Backend will handle URL decoding, so send token as-is
   */
  verifyEmail: async (userId: string, token: string) => {
    const response = await axiosClient.get<ApiResponse<null>>(
      `auth/verify-email`,
      {
        params: { 
          userId, 
          token // Send token as-is, backend will decode
        }
      }
    );
    return response.data;
  },
};

export default emailVerificationService;
