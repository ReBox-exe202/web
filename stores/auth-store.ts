import { create } from "zustand";
import AuthService from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types/auth.types";
import type { Account } from "@/types/user.types";
import { AccountRole } from "@/types/user.types";
import { setToken } from "@/lib/token";
import { accountApi } from "@/services/account.service";

// Manual rehydrate from localStorage 'auth-storage'
let initialUser: Account | null = null;
let initialToken: string | null = null;
let initialIsAuthenticated = false;
if (typeof window !== "undefined") {
    try {
        const raw = localStorage.getItem("auth-storage");
        if (raw) {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            if (parsed.user && typeof parsed.user === "object") {
                initialUser = parsed.user as Account;
            }
            if (typeof parsed.token === "string") {
                initialToken = parsed.token;
                setToken(initialToken);
            }
            if (typeof parsed.isAuthenticated === "boolean") {
                initialIsAuthenticated = parsed.isAuthenticated;
            }
        }
    } catch {
        /* ignore parse errors */
    }
}

interface AuthState {
    user: Account | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: initialUser,
    token: initialToken,
    isAuthenticated: initialIsAuthenticated,
    login: async (credentials: LoginRequest) => {
        const data = await AuthService.login(credentials);
        if (data && data.accessToken) {
            const token = data.accessToken;
            // persist token and auth snapshot to localStorage so it survives reloads
            if (typeof window !== "undefined") {
                try {
                    // will be overwritten later with full profile
                    localStorage.setItem(
                        "auth-storage",
                        JSON.stringify({ token, isAuthenticated: true })
                    );
                } catch { }
            }
            // set in-memory token used by axios interceptor
            setToken(token);
            try {
                const profile = await accountApi.getMe();
                // profile.role can be a string or an object. Normalize it to AccountRole
                // if (typeof profile.roles === "string") {
                //     const code = profile.roles.toLowerCase();
                //     if (code.includes("admin")) role = AccountRole.ADMIN;
                //     else if (code.includes("merchant"))
                //         role = AccountRole.MERCHANT;
                //     else if (code.includes("guest")) role = AccountRole.GUEST;
                //     else role = AccountRole.CONSUMER;
                // }
                // else if (profile.roles && typeof profile.roles === "object") {
                //     const maybe = (profile.roles as Record<string, unknown>)
                //         .code;
                //     if (typeof maybe === "string") {
                //         const code = maybe.toLowerCase();
                //         if (code === "admin" || code === "administrator")
                //             role = AccountRole.ADMIN;
                //         else if (code === "merchant")
                //             role = AccountRole.MERCHANT;
                //         else if (code === "guest") role = AccountRole.GUEST;
                //         else role = AccountRole.CONSUMER;
                //     }
                // }
                let roles: Account["role"] = AccountRole.CONSUMER;
                if (Array.isArray(profile.roles) && profile.roles.length > 0) {
                    const role = profile.roles[0].toLowerCase();
                    if (role === "admin" || role === "administrator")
                        roles = AccountRole.ADMIN;
                    else if (role === "merchant") roles = AccountRole.MERCHANT;
                    else if (role === "guest") roles = AccountRole.GUEST;
                    else roles = AccountRole.CONSUMER;
                }

                const mapped: Account = {
                    id: String(profile.id),
                    email: profile.email,
                    userName: profile.userName || profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    fullName:
                        profile.firstName && profile.lastName
                            ? `${profile.firstName} ${profile.lastName}`
                            : profile.userName || profile.email,
                    avatar: profile.avatar,
                    role: roles,
                    status: "active" as Account["status"],
                    createdAt: profile.createdAt,
                } as Account;
                set({ user: mapped, token, isAuthenticated: true });
                // persist full auth snapshot
                if (typeof window !== "undefined") {
                    try {
                        localStorage.setItem(
                            "auth-storage",
                            JSON.stringify({
                                user: mapped,
                                token,
                                isAuthenticated: true,
                            })
                        );
                    } catch { }
                }
            } catch {
                set({ token, isAuthenticated: true });
                if (typeof window !== "undefined") {
                    try {
                        localStorage.setItem(
                            "auth-storage",
                            JSON.stringify({ token, isAuthenticated: true })
                        );
                    } catch { }
                }
            }
        } else {
            throw new Error("Invalid login response");
        }
    },
    register: async (data: RegisterRequest) => {
        const response = await AuthService.register(data);
        if (response && response.accessToken) {
            const token = response.accessToken;
            // persist token and auth snapshot to localStorage so it survives reloads
            if (typeof window !== "undefined") {
                try {
                    // will be overwritten later with full profile
                    localStorage.setItem(
                        "auth-storage",
                        JSON.stringify({ token, isAuthenticated: true })
                    );
                } catch { }
            }
            // set in-memory token used by axios interceptor
            setToken(token);
        } else {
            throw new Error("Invalid registration response");
        }
    },
    logout: async (options?: { redirect?: string; callApi?: boolean }) => {
        const { redirect = "/login", callApi = false } = options || {};

        if (callApi) {
            try {
                // backend revoke token
                await AuthService.logout();
            } catch {
                // ignore
            }
        }

        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem("auth-storage");
                localStorage.removeItem("token");
            } catch {
                console.warn("Failed to clear localStorage on logout");
            }
        }

        setToken(null);
        set({ user: null, token: null, isAuthenticated: false });

        if (typeof window !== "undefined" && redirect) {
            window.location.href = redirect;
        }
    },
}));
