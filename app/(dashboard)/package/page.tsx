"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Filter } from "lucide-react"
import { mockItems } from "@/lib/mock-data"
import Link from "next/link"
import { useState } from "react"

export default function PackagePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = mockItems.filter((item) =>
    item.uid.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Sanitizing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Retired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Packages</h1>
        <p className="text-muted-foreground mt-1">Browse and search all reusable packaging items</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by package UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockItems.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockItems.filter((i) => i.status === "Active").length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockItems.filter((i) => i.status === "Sanitizing").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Package List */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Package List</CardTitle>
          <CardDescription>
            {filteredItems.length} package{filteredItems.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Link key={item.uid} href={`/package/${item.uid}`}>
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-mono font-bold">{item.uid}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type} - {item.size} - {item.cycles} cycles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.dealerId && (
                      <Badge variant="outline" className="text-xs">
                        {item.dealerId}
                      </Badge>
                    )}
                    <Badge variant="secondary" className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No packages found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
