"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
//   const register = useAuthStore((state) => state.register)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault()
    // if (password !== confirmPassword) {
    //   toast.error("Password mismatch", {
    //     description: "Passwords do not match. Please re-enter.",
    //   })
    //   return
    // }
    // if (!agree) {
    //   toast.error("Terms not accepted", {
    //     description: "You must agree to the Terms and Conditions.",
    //   })
    //   return
    // }

    // setIsLoading(true)
    // try {
    //   await register({ fullName, email, phone, password })
    //   toast.success("Account created successfully!", {
    //     description: "You can now sign in with your credentials.",
    //   })
    //   router.push("/login")
    // } catch {
    //   toast.error("Registration failed", {
    //     description: "Please check your input and try again.",
    //   })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign up to manage your packaging efficiently
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agree"
                checked={agree}
                onCheckedChange={(checked) => setAgree(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="agree" className="text-sm font-normal cursor-pointer">
                I agree to the Terms and Conditions
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={() => router.push("/login")}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
