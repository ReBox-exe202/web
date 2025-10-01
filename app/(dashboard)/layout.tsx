"use client"
import type React from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Toaster } from "@/components/ui/sonner"
import { useUIStore } from "@/stores/theme-store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className={`transition-all ${sidebarOpen ? "lg:pl-64" : "pl-0"}`}>
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </AuthGuard>
  )
}
