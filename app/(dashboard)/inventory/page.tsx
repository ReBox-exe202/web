"use client"

import { useState } from "react"
import { DataTable } from "@/components/tracking/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Item } from "@/lib/types"
import { mockItems } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ArrowUpDown, MoreHorizontal, QrCode, Archive, RefreshCw, Filter } from "lucide-react"
import { toast } from "sonner"

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Sanitizing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Retired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>(mockItems)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const handleRetire = (uid: string) => {
    setItems(items.map((item) => (item.uid === uid ? { ...item, status: "Retired" as const } : item)))
    toast.success("Item retired", {
      description: "The item has been marked as retired.",
    })
  }

  const handleReactivate = (uid: string) => {
    setItems(items.map((item) => (item.uid === uid ? { ...item, status: "Active" as const } : item)))
    toast.success("Item reactivated", {
      description: "The item is now active again.",
    })
  }

  const handlePrintQR = (uid: string) => {
    toast.success("QR Code generated", {
      description: `QR code for ${uid} is ready to print.`,
    })
  }

  const columns: ColumnDef<Item>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "uid",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Item UID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("uid")}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("size")}</Badge>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        return (
          <Badge variant="secondary" className={statusColors[status]}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "cycles",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Cycles Used
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const cycles = row.getValue("cycles") as number
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{cycles}</span>
            {cycles > 15 && <span className="text-xs text-orange-600 dark:text-orange-400">High usage</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "dealerId",
      header: "Assigned Dealer",
      cell: ({ row }) => {
        const dealerId = row.getValue("dealerId") as string | undefined
        return <div className="text-sm">{dealerId || "Unassigned"}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handlePrintQR(item.uid)}>
                <QrCode className="mr-2 h-4 w-4" />
                Print QR Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {item.status === "Active" ? (
                <DropdownMenuItem onClick={() => handleRetire(item.uid)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Retire Item
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleReactivate(item.uid)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reactivate Item
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Track and manage all reusable packaging items</p>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-wrap gap-3 flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Sanitizing">Sanitizing</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cup">Cups</SelectItem>
                <SelectItem value="box">Boxes</SelectItem>
                <SelectItem value="bowl">Bowls</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter("all")
                setTypeFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredItems} namespace="inventoryTable" />
    </div>
  )
}
