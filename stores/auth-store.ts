import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication logic
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Determine role based on email
        let role: "admin" | "manager" | "staff" = "staff"
        if (email === "admin@demo.io") role = "admin"
        else if (email === "manager@demo.io") role = "manager"

        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        }

        set({
          user,
          token: "mock-jwt-token-" + Math.random().toString(36),
          isAuthenticated: true,
        })
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
