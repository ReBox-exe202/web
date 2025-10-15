"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Camera, CheckCircle, Package, Clock } from "lucide-react"
import { toast } from "sonner"
import { mockItems, mockTransactions } from "@/lib/mock-data"
import { format } from "date-fns"

export default function ReturnsPage() {
  const [qrInput, setQrInput] = useState("")
  const [scannedItem, setScannedItem] = useState<{
    id: string
    type: string
    size: string
    transaction?: {
      id: string
      borrowedAt: Date
      dueAt: Date
      borrower: string
    }
  } | null>(null)
  const [needsSanitizing, setNeedsSanitizing] = useState(false)

  const recentReturns = mockTransactions
    .filter((t) => t.status === "Returned")
    .slice(0, 5)
    .sort((a, b) => {
      const dateA = a.returnedAt ? new Date(a.returnedAt).getTime() : 0
      const dateB = b.returnedAt ? new Date(b.returnedAt).getTime() : 0
      return dateB - dateA
    })

  const handleScan = () => {
    if (!qrInput.trim()) {
      toast.error("Invalid input", {
        description: "Please enter an item UID or scan a QR code.",
      })
      return
    }

    // Find item in mock data
    const item = mockItems.find((i) => i.id === qrInput.trim())
    if (!item) {
      toast.error("Item not found", {
        description: "The scanned item UID does not exist in the system.",
      })
      return
    }

    // Find active transaction
    const transaction = mockTransactions.find((t) => t.itemId === item.id && t.status === "Borrowed")

    setScannedItem({
      id: item.id,
      type: item.type,
      size: item.size,
      transaction: transaction
        ? {
            id: transaction.id,
            borrowedAt: transaction.borrowedAt,
            dueAt: transaction.dueAt,
            borrower: transaction.borrowerAnonId,
          }
        : undefined,
    })
  }

  const handleConfirmReturn = () => {
    if (!scannedItem) return

    toast.success("Return confirmed", {
      description: `${scannedItem.id} has been marked as returned${needsSanitizing ? " and flagged for sanitizing" : ""}.`,
    })

    // Reset form
    setScannedItem(null)
    setQrInput("")
    setNeedsSanitizing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Returns Processing</h1>
        <p className="text-muted-foreground mt-1">Scan and process returned packaging items</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scan Section */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Scan Item</CardTitle>
            <CardDescription>Enter item UID or scan QR code to process return</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-input">Item UID / QR Code</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-input"
                  placeholder="CUP-001, BOX-002, etc."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleScan()
                    }
                  }}
                />
                <Button variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={handleScan} className="w-full">
              Scan Item
            </Button>

            {/* Scanned Item Display */}
            {scannedItem && (
              <div className="mt-6 space-y-4 p-4 border rounded-lg bg-accent/50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Item UID</p>
                    <p className="font-mono font-bold text-lg">{scannedItem.id}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Found
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{scannedItem.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium">{scannedItem.size}</p>
                  </div>
                </div>

                {scannedItem.transaction ? (
                  <div className="space-y-3 pt-3 border-t">
                    <p className="text-sm font-medium">Active Transaction</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <span className="font-mono">{scannedItem.transaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Borrower:</span>
                        <span>{scannedItem.transaction.borrower}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Borrowed:</span>
                        <span>{format(new Date(scannedItem.transaction.borrowedAt), "MMM dd, HH:mm")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due:</span>
                        <span
                          className={
                            new Date(scannedItem.transaction.dueAt) < new Date()
                              ? "text-red-600 dark:text-red-400 font-medium"
                              : ""
                          }
                        >
                          {format(new Date(scannedItem.transaction.dueAt), "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">No active transaction found for this item.</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-3 border-t">
                  <Checkbox
                    id="sanitize"
                    checked={needsSanitizing}
                    onCheckedChange={(checked) => setNeedsSanitizing(checked as boolean)}
                  />
                  <Label htmlFor="sanitize" className="text-sm font-normal cursor-pointer">
                    Mark for sanitizing
                  </Label>
                </div>

                <Button onClick={handleConfirmReturn} className="w-full" size="lg">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirm Return
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Returns */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent Returns</CardTitle>
            <CardDescription>Latest processed returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReturns.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent returns</p>
              ) : (
                recentReturns.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono font-medium text-sm">{transaction.itemId}</p>
                        <p className="text-xs text-muted-foreground">{transaction.borrowerAnonId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {transaction.returnedAt && format(new Date(transaction.returnedAt), "MMM dd, HH:mm")}
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Returned
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
