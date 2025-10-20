"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
import AuthService from "@/services/auth.service"
import { AccountRole } from "@/types/user.types"
import type { Account } from "@/types/user.types"
import { setToken } from "@/lib/token"
import { accountApi } from "@/services/account.service"

interface GoogleLoginButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  disabled?: boolean
}

export function GoogleLoginButton({
  className,
  variant = "outline",
  disabled = false,
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, token, isAuthenticated } = useAuthStore()

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // Check client ID first
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

      if (!clientId) {
        toast.error("Configuration Error", {
          description: "Google Client ID is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file.",
        })
        setIsLoading(false)
        return
      }

      // Load Google Sign-In script if not already loaded
      if (!window.google) {
        await loadGoogleScript()
      }

      // Ensure google is loaded
      if (!window.google) {
        throw new Error("Google Sign-In failed to load")
      }

      // Use Google Identity Services (GIS) with button rendering instead of One Tap
      // This avoids FedCM deprecation warnings
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // Use renderButton for a more reliable popup experience
      // Create a temporary container for the Google button
      const buttonContainer = document.createElement('div')
      buttonContainer.style.position = 'fixed'
      buttonContainer.style.top = '-9999px'
      buttonContainer.style.left = '-9999px'
      document.body.appendChild(buttonContainer)

      window.google.accounts.id.renderButton(buttonContainer, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
      })

      // Trigger click programmatically
      const googleButton = buttonContainer.querySelector('div[role="button"]') as HTMLElement
      if (googleButton) {
        googleButton.click()
      } else {
        // Fallback: use prompt if renderButton fails
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsLoading(false)
            toast.error("Sign-in unavailable", {
              description: "Please enable popups or try again later.",
            })
          }
        })
      }

      // Clean up the temporary button after a delay
      setTimeout(() => {
        if (buttonContainer.parentNode) {
          buttonContainer.parentNode.removeChild(buttonContainer)
        }
      }, 1000)

    } catch (error: any) {
      console.error("Google login error:", error)
      toast.error("Login Failed", {
        description: error.message || "Failed to initialize Google login. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const handleGoogleCallback = async (response: any) => {
    try {
      // response.credential contains the JWT ID token
      const idToken = response.credential

      if (!idToken) {
        throw new Error("No ID token received from Google")
      }

      await processGoogleLogin(idToken)
    } catch (error: any) {
      console.error("Google callback error:", error)
      toast.error("Login Failed", {
        description: error.message || "Failed to process Google login.",
      })
      setIsLoading(false)
    }
  }

  const processGoogleLogin = async (idToken: string) => {
    try {
      // Call backend API with the ID token
      const data = await AuthService.loginGoogle({ idToken })

      if (data && data.accessToken) {
        const token = data.accessToken

        // Persist token to localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "auth-storage",
              JSON.stringify({ token, isAuthenticated: true })
            )
          } catch {
            console.warn("Failed to save to localStorage")
          }
        }

        // Set in-memory token for axios
        setToken(token)

        // Fetch user profile
        try {
          const profile = await accountApi.getMe()

          // Map role
          let role: Account["role"] = AccountRole.CONSUMER
          if (Array.isArray(profile.roles) && profile.roles.length > 0) {
            const roleStr = profile.roles[0].toLowerCase()
            if (roleStr === "admin" || roleStr === "administrator") {
              role = AccountRole.ADMIN
            } else if (roleStr === "merchant") {
              role = AccountRole.MERCHANT
            } else if (roleStr === "guest") {
              role = AccountRole.GUEST
            } else {
              role = AccountRole.CONSUMER
            }
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
            role: role,
            status: "active" as Account["status"],
            createdAt: profile.createdAt,
          } as Account

          // Update store
          useAuthStore.setState({ user: mapped, token, isAuthenticated: true })

          // Persist full auth
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                "auth-storage",
                JSON.stringify({
                  user: mapped,
                  token,
                  isAuthenticated: true,
                })
              )
            } catch {
              console.warn("Failed to save user to localStorage")
            }
          }

          toast.success("Welcome!", {
            description: "You have successfully logged in with Google.",
          })

          // Redirect based on role
          if (role === AccountRole.ADMIN) {
            router.push("/admin")
          } else {
            router.push("/")
          }
        } catch (profileError) {
          // If profile fetch fails, still set authenticated with token
          useAuthStore.setState({ token, isAuthenticated: true })

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                "auth-storage",
                JSON.stringify({ token, isAuthenticated: true })
              )
            } catch {
              console.warn("Failed to save to localStorage")
            }
          }

          toast.success("Logged in", {
            description: "Successfully logged in with Google.",
          })

          router.push("/")
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error: any) {
      console.error("Process Google login error:", error)

      // Handle API errors
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
          .join("\n")

        toast.error(error.response.data.title || "Login failed", {
          description: errorMessages,
        })
      } else if (error?.response?.data?.message) {
        toast.error("Login Failed", {
          description: error.response.data.message,
        })
      } else if (error?.message) {
        toast.error("Login Failed", {
          description: error.message,
        })
      } else {
        toast.error("Login Failed", {
          description: "An unexpected error occurred. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleGoogleLogin}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  )
}

// Helper function to load Google Sign-In script
function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Sign-In script"))
    document.head.appendChild(script)
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (parent: HTMLElement, options: any) => void
        }
        oauth2: {
          initTokenClient: (config: any) => any
        }
      }
    }
  }
}
