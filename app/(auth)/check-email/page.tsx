"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
import AuthService from "@/services/auth.service"

export default function CheckEmailPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isResending, setIsResending] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const user = useAuthStore((state) => state.user)

    // Get email from URL params or from user store
    const email = searchParams.get("email") || user?.email || ""

    useEffect(() => {
        // Cooldown timer for resend button
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown])

    const handleResendEmail = async () => {
        if (!email) {
            toast.error("Email not found", {
                description: "Please go back and register again.",
            })
            return
        }

        setIsResending(true)
        try {
            await AuthService.sendVerificationEmail(email)
            toast.success("Email sent!", {
                description: "Please check your inbox and spam folder.",
            })
            setResendCooldown(60) // 60 seconds cooldown
        } catch (error: any) {
            toast.error("Failed to resend email", {
                description: error?.response?.data?.message || "Please try again later.",
            })
        } finally {
            setIsResending(false)
        }
    }

    const handleGoToDashboard = () => {
        const userRole = user?.role
        if (userRole === "admin") {
            router.push("/admin")
        } else {
            router.push("/")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <Mail className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold">Check Your Email</CardTitle>
                        <CardDescription className="text-base mt-2">
                            We've sent a verification link to your email
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Email Display */}
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                            Verification email sent to:
                        </p>
                        <p className="font-semibold text-lg break-all">
                            {email || "your email"}
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm">Check your inbox</p>
                                <p className="text-sm text-muted-foreground">
                                    Click the verification link in the email we sent you
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm">Check your spam folder</p>
                                <p className="text-sm text-muted-foreground">
                                    Sometimes our emails end up there
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm">Verification link expires in 24 hours</p>
                                <p className="text-sm text-muted-foreground">
                                    Request a new one if it expires
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Resend Button */}
                    <div className="pt-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleResendEmail}
                            disabled={isResending || resendCooldown > 0}
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend verification email
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Go to Dashboard Button */}
                    <div className="pt-2 border-t">
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={handleGoToDashboard}
                        >
                            Continue to Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            You can verify your email later from the dashboard
                        </p>
                    </div>

                    {/* Help Text */}
                    <div className="text-center text-sm text-muted-foreground pt-2">
                        <p>Didn't receive the email?</p>
                        <p className="mt-1">
                            Check your spam folder or{" "}
                            <button
                                type="button"
                                className="text-primary hover:underline font-medium"
                                onClick={handleResendEmail}
                                disabled={isResending || resendCooldown > 0}
                            >
                                resend it
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
