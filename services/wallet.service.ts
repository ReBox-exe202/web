import axiosClient from "@/config/axios.config";
import { WalletResponse, WalletData } from "@/types/wallet.types";

export const walletApi = {
    /**
     * Get current user's wallet information
     * @returns {Promise<WalletData>} Wallet data including points, lifetime points, total returns, and CO2 saved
     */
    getWallet: async (): Promise<WalletData> => {
        const resp = await axiosClient.get<WalletResponse>("/wallet");
        
        if (!resp.data.isSuccess) {
            throw new Error(resp.data.message || "Failed to fetch wallet");
        }
        
        return resp.data.data;
    },
};
