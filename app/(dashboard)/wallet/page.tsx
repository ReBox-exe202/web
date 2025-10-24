"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, Loader2, Plus, DollarSign, CreditCard, TrendingUp, History, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { createPaymentLink } from "@/services/payment.service"
import { getPaymentStatus } from "@/services/payment.service"
import { accountApi, consumerApi } from "@/services/account.service"
import { toast } from "sonner"

const AMOUNT_OPTIONS = [
  { value: 10000, label: "10K" },   // 10,000 VND
  { value: 20000, label: "20K" },   // 20,000 VND
  { value: 50000, label: "50K" },   // 50,000 VND
  { value: 100000, label: "100K" }, // 100,000 VND
]

// Mock wallet data - simplified for money/balance only
interface WalletBalance {
  accountId: string
  balance: number // Current money balance
  currency: string
}

/*
const MOCK_WALLET_DATA: WalletBalance = {
  accountId: "ACC-001",
  balance: 105000, // Money balance in VND (105,000 VND)
  currency: "VND",
}

// Mock transaction history
const MOCK_TRANSACTIONS = [
  { id: "TXN-001", type: "add", amount: 20000, date: new Date("2025-01-09"), description: "Added money to wallet" },
  { id: "TXN-002", type: "spend", amount: 5000, date: new Date("2025-01-08"), description: "Package rental" },
  { id: "TXN-003", type: "add", amount: 50000, date: new Date("2025-01-05"), description: "Added money to wallet (with bonus)" },
  { id: "TXN-004", type: "spend", amount: 3000, date: new Date("2025-01-03"), description: "Package rental" },
  { id: "TXN-005", type: "add", amount: 10000, date: new Date("2024-12-28"), description: "Added money to wallet" },
]
*/

export default function WalletPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [history, setHistory] = useState<string[] | null>(null)

  useEffect(() => {
  fetchWallet()

    // If redirected with success and order code, poll server for authoritative status
    const success = searchParams.get("success")
    const order = searchParams.get("order")
    const canceled = searchParams.get("canceled")

  if (success === "true" && order) {
      let attempts = 0
      const maxAttempts = 25

      const check = async () => {
        try {
          attempts += 1
          const statusResp = await getPaymentStatus(order)
            if (statusResp?.status === "Succeeded") {
            // Refresh wallet from server
            try {
              const data = await accountApi.getWallet()
              // server returns { balance: number }
              const updated: WalletBalance = {
                accountId: wallet?.accountId ?? "",
                balance: data?.balance ?? wallet?.balance ?? 0,
                currency: "VND",
              }
              setWallet(updated)

              // fetch history as well
              try {
                const h = await consumerApi.getHistory()
                setHistory(h)
              } catch (e) {
                // ignore history fetch error
              }
            } catch (e) {
              // fallback: keep existing wallet but notify
            }
            toast.success("Payment successful!", { description: "Your wallet has been updated." })
            router.replace("/wallet")
            return
          }

          if (statusResp?.status === "Failed" || statusResp?.status === "Canceled") {
            toast.error("Payment did not complete", { description: "Please try again or contact support." })
            router.replace("/wallet")
            return
          }

          if (attempts >= maxAttempts) {
            toast.error("Payment confirmation timed out", { description: "If your card was charged, contact support." })
            router.replace("/wallet")
            return
          }

          setTimeout(check, 2000)
        } catch (err) {
          if (attempts >= maxAttempts) {
            toast.error("Unable to confirm payment", { description: "Please contact support if you were charged." })
            router.replace("/wallet")
            return
          }
          setTimeout(check, 2000)
        }
      }

      check()
    } else if (canceled === "true") {
      toast.error("Payment canceled", { description: "You can try again when ready." })
      router.replace("/wallet")
    }
  }, [searchParams, router])

  const fetchWallet = async () => {
    try {
      setLoading(true)
      // call backend wallet API
      const data = await accountApi.getWallet()
      const mapped: WalletBalance = {
        accountId: "",
        balance: data?.balance ?? 0,
        currency: "VND",
      }
      setWallet(mapped)

      // fetch consumer history (if available)
      try {
        const h = await consumerApi.getHistory()
        setHistory(h)
      } catch (e) {
        setHistory(null)
      }
    } catch (error) {
      console.error("Error fetching wallet:", error)
      toast.error("Failed to load wallet information")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMoney = (amount: number) => {
    setSelectedAmount(amount)
    setIsAddMoneyOpen(false)
    handlePayment(amount)
  }

  const handlePayment = async (amount: number) => {
    try {
      setIsProcessing(true)
      // Generate a smaller order code to avoid overflow issues
      const orderCode = Math.floor(Date.now() / 1000) // Use seconds instead of milliseconds

      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const returnUrl = `${origin}/wallet?success=true&amount=${amount}&order=${orderCode}`
      const cancelUrl = `${origin}/wallet?canceled=true&order=${orderCode}`

      console.log("Creating payment link with:", {
        OrderCode: orderCode,
        Amount: amount,
        Description: `Add ${amount.toLocaleString("vi-VN")} VND to wallet`,
      })

      const link = await createPaymentLink({
        OrderCode: orderCode,
        Amount: amount,
        Description: `Add ${amount.toLocaleString("vi-VN")} VND to wallet`,
        ReturnUrl: returnUrl,
        CancelUrl: cancelUrl,
      })

      setCheckoutUrl(link)
      setIsConfirmOpen(true)
      toast.success("Payment link created", { description: "Ready to redirect to payment." })
    } catch (err: unknown) {
      console.error("Payment error details:", err)
      const msg = (err as { message?: string })?.message || "Failed to create payment link"
      toast.error("Payment error", { description: msg })
    } finally {
      setIsProcessing(false)
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
          <p className="text-muted-foreground mt-1">Manage your account balance and transactions</p>
        </div>
        <Button onClick={() => setIsAddMoneyOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Money
        </Button>
      </div>

      {/* Main Balance Card */}
      <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Account Balance</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-bold text-foreground">{wallet.balance.toLocaleString("vi-VN")}</h2>
                <span className="text-2xl font-semibold text-muted-foreground">{wallet.currency}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Account ID: {wallet.accountId}
              </p>
              <div className="flex gap-3 mt-6">
                <Button 
                  className="gap-2"
                  onClick={() => setIsAddMoneyOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Money
                </Button>
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Stats
                </Button>
              </div>
            </div>
            <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-14 w-14 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history && history.length > 0 ? (
              history.map((h, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <p className="text-sm font-medium">{h}</p>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground">No recent transactions</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Money Dialog */}
      <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Select an amount to add to your account balance
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {AMOUNT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAddMoney(option.value)}
                disabled={isProcessing}
                className="relative p-6 border-2 border-muted hover:border-primary rounded-xl transition-all hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex flex-col items-center gap-2">
                  <DollarSign className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="text-2xl font-bold">{option.label}</div>
                  <div className="text-sm text-muted-foreground">VND</div>
                </div>
              </button>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <div className="text-blue-600 dark:text-blue-400 text-sm">
              <p className="font-medium">💡 Quick & Easy!</p>
              <p className="text-xs mt-1">Select an amount and complete payment securely via PayOS.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue to payment?</DialogTitle>
            <DialogDescription>
              You'll be redirected to the secure payment page to complete your transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedAmount && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-base font-bold">
                <span>Amount to Pay:</span>
                <span className="text-primary">{selectedAmount.toLocaleString("vi-VN")} VND</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                This amount will be added to your wallet balance after successful payment.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            {checkoutUrl && (
              <Button asChild>
                <a href={checkoutUrl} target="_blank" rel="noreferrer" onClick={() => setIsConfirmOpen(false)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
