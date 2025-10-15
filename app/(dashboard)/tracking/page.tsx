"use client"

import { useState } from "react"
import { DataTable } from "@/components/tracking/data-table"
import { createColumns } from "@/components/tracking/columns"
import { TransactionDetailsSheet } from "@/components/tracking/transaction-details-sheet"
import { useTrackingStore } from "@/stores/tracking-store"
import type { Transaction } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { toast } from "sonner"

export default function TrackingPage() {
  const transactions = useTrackingStore((state) => state.transactions)
  const markReturned = useTrackingStore((state) => state.markReturned)
  const markLost = useTrackingStore((state) => state.markLost)
  const markSanitizing = useTrackingStore((state) => state.markSanitizing)

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredData, setFilteredData] = useState(transactions)

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setSheetOpen(true)
  }

  const handleMarkReturned = (id: string) => {
    markReturned(id)
    toast.success("Item marked as returned", {
      description: "The transaction has been updated successfully.",
    })
  }

  const handleMarkLost = (id: string) => {
    markLost(id)
    toast.error("Item marked as lost", {
      description: "The transaction has been updated.",
    })
  }

  const handleMarkSanitizing = (id: string) => {
    markSanitizing(id)
    toast.success("Item marked for sanitizing", {
      description: "The item will be sanitized before reuse.",
    })
  }

  const handleExportCSV = () => {
    const headers = ["ID", "Item UID", "Borrower", "Partner", "Status", "Borrowed At", "Due At", "Returned At", "Notes"]
    const csvData = filteredData.map((t) => [
      t.id,
      t.itemId,
      t.borrowerAnonId,
      t.partnerId,
      t.status,
      new Date(t.borrowedAt).toISOString(),
      new Date(t.dueAt).toISOString(),
      t.returnedAt ? new Date(t.returnedAt).toISOString() : "",
      t.notes || "",
    ])

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast.success("CSV exported", {
      description: "Your transaction data has been downloaded.",
    })
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    if (value === "all") {
      setFilteredData(transactions)
    } else {
      setFilteredData(transactions.filter((t) => t.status === value))
    }
  }

  const columns = createColumns(handleViewDetails, handleMarkReturned, handleMarkLost, handleMarkSanitizing)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Cycle Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all packaging transactions</p>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-wrap gap-3 flex-1">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Borrowed">Borrowed</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Sanitizing">Sanitizing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => handleStatusFilterChange("all")}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredData} namespace="trackingTable" onExportCSV={handleExportCSV} />

      {/* Details Sheet */}
      <TransactionDetailsSheet transaction={selectedTransaction} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}
