import { create } from "zustand";
import AuthService from "@/lib/api/services/auth.service";
import type { LoginRequest } from "@/lib/api/types/auth.types";
import type { Account } from "@/lib/api/types/user.types";
import { AccountRole } from "@/lib/api/types/user.types";
import { setToken } from "@/lib/token";

// Do not access localStorage at module import time. The app should rehydrate
// the auth store on the client inside a useEffect to avoid SSR/CSR mismatches.
let initialUser: Account | null = null;
let initialToken: string | null = null;
let initialIsAuthenticated = false;

interface AuthState {
    user: Account | null;
    token: string | null;
    isAuthenticated: boolean;
    // Rehydrate from localStorage on demand (call from a client effect).
    rehydrate: () => void;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    signOut: () => void;
    setUser: (user: Account | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: initialUser,
    token: initialToken,
    isAuthenticated: initialIsAuthenticated,
    rehydrate: () => {
        if (typeof window === "undefined") return
        try {
            const raw = localStorage.getItem("auth-storage")
            if (!raw) return
            const parsed = JSON.parse(raw) as Record<string, unknown>
            let token: string | null = null
            let user: Account | null = null
            let isAuthenticated = false
            if (parsed.user && typeof parsed.user === "object") {
                user = parsed.user as Account
            }
            if (typeof parsed.token === "string") {
                token = parsed.token
                try {
                    setToken(token)
                } catch {}
            }
            if (typeof parsed.isAuthenticated === "boolean") {
                isAuthenticated = parsed.isAuthenticated
            }
            set({ user, token, isAuthenticated })
        } catch {
            /* ignore */
        }
    },
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
                } catch {}
            }
            // set in-memory token used by axios interceptor
            setToken(token);
            try {
                const profile = await AuthService.getCurrentAccount();
                // profile.role can be a string or an object. Normalize it to AccountRole
                let role: Account["role"] = AccountRole.USER;
                if (typeof profile.role === "string") {
                    const code = profile.role.toLowerCase();
                    if (code.includes("admin")) role = AccountRole.ADMIN;
                    else if (code.includes("manager"))
                        role = AccountRole.MANAGER;
                    else if (code.includes("guest")) role = AccountRole.GUEST;
                    else role = AccountRole.USER;
                } else if (profile.role && typeof profile.role === "object") {
                    const maybe = (profile.role as Record<string, unknown>)
                        .code;
                    if (typeof maybe === "string") {
                        const code = maybe.toLowerCase();
                        if (code === "admin" || code === "administrator")
                            role = AccountRole.ADMIN;
                        else if (code === "manager") role = AccountRole.MANAGER;
                        else if (code === "guest") role = AccountRole.GUEST;
                        else role = AccountRole.USER;
                    }
                }

                const mapped: Account = {
                    id: String(profile.id),
                    email: profile.email,
                    username: profile.username || profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    fullName:
                        profile.firstName && profile.lastName
                            ? `${profile.firstName} ${profile.lastName}`
                            : profile.username || profile.email,
                    avatar: profile.avatar,
                    role,
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
                    } catch {}
                }
            } catch {
                set({ token, isAuthenticated: true });
                if (typeof window !== "undefined") {
                    try {
                        localStorage.setItem(
                            "auth-storage",
                            JSON.stringify({ token, isAuthenticated: true })
                        );
                    } catch {}
                }
            }
        } else {
            throw new Error("Invalid login response");
        }
    },
    logout: async () => {
        try {
            await AuthService.logout();
        } catch {
            // ignore
        }
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem("auth-storage");
                localStorage.removeItem("token");
            } catch {}
        }
        setToken(null);
        set({ user: null, token: null, isAuthenticated: false });
    },
    signOut: () => {
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem("auth-storage");
                localStorage.removeItem("token");
            } catch {}
        }
        setToken(null);
        set({ user: null, token: null, isAuthenticated: false });
    },
    setUser: (user: Account | null) => set({ user }),
}));
