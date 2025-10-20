"use client"

import { useState } from "react"
import { AlertCircle, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { emailVerificationService } from "@/services/email-verification.service"
import { useAuthStore } from "@/stores/auth-store"

export function EmailVerificationBanner() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()

  // Don't show if email is already verified or user not logged in
  if (!user || user.emailConfirmed) {
    return null
  }

  const handleResendEmail = async () => {
    if (!user?.email) return

    setIsLoading(true)
    try {
      await emailVerificationService.sendConfirmationEmail(user.email)
      toast.success("Email sent!", {
        description: "Please check your inbox and spam folder.",
      })
    } catch (error: any) {
      toast.error("Failed to send email", {
        description: error.response?.data?.message || "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Alert variant="default" className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
        Please verify your email address
      </AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        <p className="mb-2">
          We sent a verification email to <strong>{user.email}</strong>. 
          Please check your inbox and click the verification link to activate your account.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendEmail}
          disabled={isLoading}
          className="mt-2 border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-900"
        >
          <Mail className="mr-2 h-4 w-4" />
          {isLoading ? "Sending..." : "Resend verification email"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
