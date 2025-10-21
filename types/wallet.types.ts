/**
 * Wallet Types
 *
 * Type definitions for wallet-related data.
 */

/**
 * Wallet data from API
 */
export interface WalletData {
    accountId: string;
    points: number;
    lifetimePoints: number;
    totalReturns: number;
    co2Saved: number;
}

/**
 * Wallet API response wrapper
 */
export interface WalletResponse {
    isSuccess: boolean;
    data: WalletData;
    message: string;
}
