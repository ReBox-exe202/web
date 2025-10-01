import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  theme: "light" | "dark"
  sidebarOpen: boolean
  setTheme: (theme: "light" | "dark") => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: true,
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark")
        }
      },
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "ui-storage",
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", state.theme === "dark")
        }
      },
    },
  ),
)
