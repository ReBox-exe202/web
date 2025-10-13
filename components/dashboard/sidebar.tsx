"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MapPin, FolderKanban, Package, Users, RotateCcw, Settings, Leaf, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/stores/theme-store"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Tracking", href: "/tracking", icon: MapPin },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Partners", href: "/partners", icon: Users },
  { name: "Returns", href: "/returns", icon: RotateCcw },
  { name: "QR", href: "/qr", icon: QrCode },
  { name: "Package", href: "/package", icon: Package },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300",
        !sidebarOpen && "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Rebox</h1>
            <p className="text-xs text-muted-foreground">Packaging Manager</p>
          </div>
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
  )
}
