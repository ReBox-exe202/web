"use client"

import { Menu, Search, Bell, Moon, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUIStore } from "@/stores/theme-store"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export function Topbar() {
  const { theme, setTheme, toggleSidebar } = useUIStore()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  const displayName =
    user?.username || user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.email || "User"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items, transactions, partners..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
