"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthService from "@/services/auth.service"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const userId = searchParams.get("userId")
    const token = searchParams.get("token")

    if (!userId || !token) {
      setStatus("error")
      setMessage("Invalid verification link. Please check your email and try again.")
      return
    }

    verifyEmail(userId, token)
  }, [searchParams])

  const verifyEmail = async (userId: string, token: string) => {
    try {
      const response = await AuthService.verifyEmail(userId, token)
      if (response.success) {
        setStatus("success")
        setMessage("Your email has been verified successfully! You can now use all features of your account.")
      } else {
        setStatus("error")
        setMessage(response.message || "Verification failed. The link may have expired. Please request a new verification email.")
      }
    } catch (error: any) {
      setStatus("error")
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during verification."
      setMessage(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-4 inline-block">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === "error" && (
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-4 inline-block">
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          {status === "success" && (
            <>
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
                Go to Login
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Login
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Back to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
