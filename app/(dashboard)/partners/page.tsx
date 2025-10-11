"use client"

import type React from "react"

import { useState } from "react"
import { DataTable } from "@/components/tracking/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Partner } from "@/lib/types"
import { mockPartners } from "@/lib/mock-data"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Plus, Filter } from "lucide-react"
import { toast } from "sonner"

const typeColors = {
  Dealer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Brand: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Restaurant: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    type: "Restaurant" as const,
    contactName: "",
    contactEmail: "",
    pickupPoints: 1,
    slaDays: 2,
  })

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault()
    const newPartner: Partner = {
      id: `PTR-${String(partners.length + 1).padStart(3, "0")}`,
      ...formData,
      lossRate: 0,
    }
    setPartners([newPartner, ...partners])
    setDialogOpen(false)
    setFormData({
      name: "",
      type: "Restaurant",
      contactName: "",
      contactEmail: "",
      pickupPoints: 1,
      slaDays: 2,
    })
    toast.success("Partner created", {
      description: `${formData.name} has been added successfully.`,
    })
  }

  const columns: ColumnDef<Partner>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Partner Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
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
      cell: ({ row }) => {
        const type = row.getValue("type") as keyof typeof typeColors
        return (
          <Badge variant="secondary" className={typeColors[type]}>
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "contactName",
      header: "Contact Person",
      cell: ({ row }) => <div className="text-sm">{row.getValue("contactName")}</div>,
    },
    {
      accessorKey: "contactEmail",
      header: "Email",
      cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("contactEmail")}</div>,
    },
    {
      accessorKey: "pickupPoints",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Pickup Points
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("pickupPoints")}</div>,
    },
    {
      accessorKey: "slaDays",
      header: "SLA (Days)",
      cell: ({ row }) => <div className="text-sm">{row.getValue("slaDays")}</div>,
    },
    {
      accessorKey: "lossRate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Loss Rate
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const rate = row.getValue("lossRate") as number
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{rate}%</span>
            {rate > 3 && <span className="text-xs text-red-600 dark:text-red-400">High</span>}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const partner = row.original

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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Partner
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Remove Partner</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredPartners = partners.filter((partner) => {
    return typeFilter === "all" || partner.type === typeFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners Management</h1>
          <p className="text-muted-foreground mt-1">Manage dealers, brands, and restaurant partners</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-wrap gap-3 flex-1">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Dealer">Dealers</SelectItem>
                <SelectItem value="Brand">Brands</SelectItem>
                <SelectItem value="Restaurant">Restaurants</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setTypeFilter("all")}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredPartners} namespace="partnersTable" />

      {/* Create Partner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Partner</DialogTitle>
            <DialogDescription>Register a new dealer, brand, or restaurant partner.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePartner} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Partner Name</Label>
              <Input
                id="name"
                placeholder="Green Cafe Downtown"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Partner Type</Label>
              <Select
                value={formData.type}
                // onValueChange={(value) => setFormData({ ...formData, type: value as Partner["type"] })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dealer">Dealer</SelectItem>
                  <SelectItem value="Brand">Brand</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="John Doe"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupPoints">Pickup Points</Label>
                <Input
                  id="pickupPoints"
                  type="number"
                  min="1"
                  value={formData.pickupPoints}
                  onChange={(e) => setFormData({ ...formData, pickupPoints: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slaDays">SLA Days</Label>
                <Input
                  id="slaDays"
                  type="number"
                  min="1"
                  value={formData.slaDays}
                  onChange={(e) => setFormData({ ...formData, slaDays: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Partner</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
