"use client"

import { useEffect, useState } from "react"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Package, Leaf, Loader2 } from "lucide-react"
import { walletApi } from "@/services/wallet.service"
import { WalletData } from "@/types/wallet.types"
import { toast } from "sonner"

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    try {
      setLoading(true)
      const data = await walletApi.getWallet()
      setWallet(data)
    } catch (error) {
      console.error("Error fetching wallet:", error)
      toast.error("Failed to load wallet information")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Unable to load wallet information</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
          <p className="text-muted-foreground mt-1">View your rewards, points, and environmental impact</p>
        </div>
      </div>

      {/* Main Balance Card */}
      <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Current Balance</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-bold text-foreground">{wallet.points.toLocaleString()}</h2>
                <span className="text-xl font-semibold text-muted-foreground">points</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Lifetime earned: {wallet.lifetimePoints.toLocaleString()} points
              </p>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Lifetime Points"
          value={wallet.lifetimePoints.toLocaleString()}
          icon={<TrendingUp className="h-5 w-5" />}
          description="total earned"
        />
        <KpiCard
          title="Total Returns"
          value={wallet.totalReturns.toLocaleString()}
          icon={<Package className="h-5 w-5" />}
          description="packages returned"
        />
        <KpiCard
          title="CO₂ Saved"
          value={`${wallet.co2Saved.toLocaleString()}g`}
          icon={<Leaf className="h-5 w-5" />}
          description="environmental impact"
        />
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">10</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Return a Package</p>
                <p className="text-xs text-muted-foreground">Base points for every package returned</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">+5</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Quick Return Bonus</p>
                <p className="text-xs text-muted-foreground">Extra points for returning within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">?</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">More Ways Coming Soon</p>
                <p className="text-xs text-muted-foreground">Stay tuned for additional earning opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CO₂ Reduction</span>
                <span className="text-sm font-bold text-green-600">{wallet.co2Saved.toLocaleString()}g</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all"
                  style={{ width: `${Math.min((wallet.co2Saved / 10000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Goal: 10,000g CO₂ reduction
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                🌱 Great job!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                By returning {wallet.totalReturns} package{wallet.totalReturns !== 1 ? 's' : ''}, you've helped reduce waste and save{" "}
                {wallet.co2Saved.toLocaleString()}g of CO₂ emissions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
