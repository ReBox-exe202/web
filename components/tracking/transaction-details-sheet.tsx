"use client"

import type { Transaction } from "@/lib/types"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { LifecycleTimeline } from "./lifecycle-timeline"
import { format } from "date-fns"

interface TransactionDetailsSheetProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailsSheet({ transaction, open, onOpenChange }: TransactionDetailsSheetProps) {
  if (!transaction) return null

  const timelineSteps = [
    {
      label: "Item Manufactured",
      date: new Date(new Date(transaction.borrowedAt).getTime() - 30 * 24 * 60 * 60 * 1000),
      completed: true,
    },
    {
      label: "Assigned to Partner",
      date: new Date(new Date(transaction.borrowedAt).getTime() - 7 * 24 * 60 * 60 * 1000),
      completed: true,
    },
    {
      label: "Borrowed by Customer",
      date: transaction.borrowedAt,
      completed: true,
    },
    {
      label: "Returned",
      date: transaction.returnedAt,
      completed: !!transaction.returnedAt,
    },
    {
      label: "Sanitized",
      completed: transaction.status === "Sanitizing",
    },
    {
      label: "Ready for Reuse",
      completed: false,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>Complete lifecycle information for {transaction.itemId}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium">{transaction.id}</p>
              </div>
              <Badge
                variant="secondary"
                className={
                  transaction.status === "Returned"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : transaction.status === "Overdue"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : ""
                }
              >
                {transaction.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Item ID</p>
              <p className="font-mono font-medium">{transaction.itemId}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Borrower</p>
              <p className="font-medium">{transaction.borrowerAnonId}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Partner</p>
              <p className="font-medium">{transaction.partnerId}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">Timeline</h3>
            <div>
              <p className="text-sm text-muted-foreground">Borrowed At</p>
              <p className="font-medium">{format(new Date(transaction.borrowedAt), "PPpp")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due At</p>
              <p className="font-medium">{format(new Date(transaction.dueAt), "PPpp")}</p>
            </div>
            {transaction.returnedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Returned At</p>
                <p className="font-medium">{format(new Date(transaction.returnedAt), "PPpp")}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Notes</p>
              <p className="text-sm">{transaction.notes}</p>
            </div>
          )}

          {/* Lifecycle */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-4">Product Lifecycle</h3>
            <LifecycleTimeline steps={timelineSteps} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
