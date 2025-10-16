"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MapPin, FolderKanban, Package, Users, RotateCcw, Settings, Leaf, QrCode, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/stores/theme-store"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { AccountRole, NavigationByRole } from "@/types/user.types"

export const navigationByRole: NavigationByRole = {
  [AccountRole.ADMIN]: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Tracking", href: "/tracking", icon: MapPin },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Partners", href: "/partners", icon: Users },
    { name: "Returns", href: "/returns", icon: RotateCcw },
    { name: "QR", href: "/qr", icon: QrCode },
    { name: "Package", href: "/package", icon: Package },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  [AccountRole.MERCHANT]: [
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Package", href: "/package", icon: Package },
    { name: "QR", href: "/qr", icon: QrCode },
  ],
  [AccountRole.CONSUMER]: [
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Package", href: "/package", icon: Package },
    { name: "QR", href: "/qr", icon: QrCode },
  ],
  [AccountRole.GUEST]: [],
}

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || AccountRole.GUEST;
  const navigation = navigationByRole[userRole];

  const pathname = usePathname()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      toggleSidebar()
    }
  }, [pathname])

  // Close sidebar on ESC key press (mobile only)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen && window.innerWidth < 1024) {
        toggleSidebar()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen, toggleSidebar])

  return (
    <>
      {/* Backdrop overlay - only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300",
          !sidebarOpen && "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo + Close Button */}
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-sidebar-foreground">Rebox</h1>
              <p className="text-xs text-muted-foreground">Packaging Manager</p>
            </div>
            {/* Close button - only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 cursor-pointer",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-muted-foreground text-center">© 2025 Rebox System</p>
          </div>
        </div>
      </aside>
    </>
  )
}
