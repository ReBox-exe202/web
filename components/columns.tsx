"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Transaction } from "@/lib/types"
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
import { ArrowUpDown, MoreHorizontal, Eye, CheckCircle, XCircle, Droplet } from "lucide-react"
import { format } from "date-fns"

const statusColors = {
 Ready: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Borrowed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Returned: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Washing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Damaged: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Retired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export const createColumns = (
  onViewDetails: (transaction: Transaction) => void,
  onMarkReturned: (id: string) => void,
  onMarkDamaged: (id: string) => void,
  onMarkWashing: (id: string) => void,
): ColumnDef<Transaction>[] => [
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
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Transaction ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "itemId",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Item ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono text-sm font-medium">{row.getValue("itemId")}</div>,
  },
  {
    accessorKey: "borrowerAnonId",
    header: "Borrower",
    cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("borrowerAnonId")}</div>,
  },
  {
    accessorKey: "partnerId",
    header: "Partner",
    cell: ({ row }) => <div className="text-sm">{row.getValue("partnerId")}</div>,
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
    accessorKey: "borrowedAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Borrowed At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("borrowedAt") as Date
      return <div className="text-sm">{format(new Date(date), "MMM dd, yyyy HH:mm")}</div>
    },
  },
  {
    accessorKey: "dueAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Due At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("dueAt") as Date
      const isOverdue = new Date(date) < new Date() && row.getValue("status") !== "Returned"
      return (
        <div className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>
          {format(new Date(date), "MMM dd, yyyy HH:mm")}
        </div>
      )
    },
  },
  {
    accessorKey: "returnedAt",
    header: "Returned At",
    cell: ({ row }) => {
      const date = row.getValue("returnedAt") as Date | undefined
      return <div className="text-sm">{date ? format(new Date(date), "MMM dd, yyyy HH:mm") : "-"}</div>
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | undefined
      return <div className="text-sm text-muted-foreground max-w-[200px] truncate">{notes || "-"}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original

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
            <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {transaction.status === "Borrowed" && (
              <DropdownMenuItem onClick={() => onMarkReturned(transaction.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Returned
              </DropdownMenuItem>
            )}
            {transaction.status !== "Damaged" && transaction.status !== "Retired" && (
              <DropdownMenuItem onClick={() => onMarkDamaged(transaction.id)} className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Mark Damaged
              </DropdownMenuItem>
            )}
            {transaction.status === "Returned" && (
              <DropdownMenuItem onClick={() => onMarkWashing(transaction.id)}>
                <Droplet className="mr-2 h-4 w-4" />
                Mark Washing
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
