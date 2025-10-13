"use client"

import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, MapPin, Calendar, TrendingUp, User, QrCode } from "lucide-react"
import Link from "next/link"
import { mockItems } from "@/lib/mock-data"
import { format } from "date-fns"
import Image from "next/image"

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const packageItem = mockItems.find((item) => item.uid === id)

  if (!packageItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Package Not Found</h2>
          <p className="text-muted-foreground">
            The package with ID <code className="bg-muted px-2 py-1 rounded font-mono">{id}</code> does not exist.
          </p>
        </div>
        <Link href="/inventory">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
      </div>
    )
  }

  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Sanitizing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Retired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  // Helper function to get package image based on type
  const getPackageImage = (type: string) => {
    const images: Record<string, string> = {
      cup: "/images/cup-placeholder.png",
      box: "/images/box-placeholder.png",
      bowl: "/images/bowl-placeholder.png",
    }
    return images[type] || "/images/package-placeholder.png"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/inventory">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight font-mono">{packageItem.uid}</h1>
              <Badge variant="secondary" className={statusColors[packageItem.status]}>
                {packageItem.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">Reusable packaging item details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              View QR Code
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Column - Package Image */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Package Image</CardTitle>
            <CardDescription>Visual representation of the package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={getPackageImage(packageItem.type)}
                alt={`${packageItem.type} package`}
                fill
                className="object-contain p-8"
                unoptimized
                onError={(e) => {
                  // Fallback to placeholder icon if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
              {/* Fallback icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground/20" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Type: {packageItem.type}</p>
                <p className="text-xs text-muted-foreground">Size: {packageItem.size}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {packageItem.type}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Stats & Information */}
        <div className="space-y-4">
          {/* Stats Cards Grid */}
          <div className="grid gap-4 grid-cols-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Type</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{packageItem.type}</div>
                <p className="text-xs text-muted-foreground">Size: {packageItem.size}</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cycles Used</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{packageItem.cycles}</div>
                <p className="text-xs text-muted-foreground">
                  {packageItem.cycles > 15 ? "High usage" : "Normal usage"}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Created</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{format(new Date(packageItem.createdAt), "MMM dd, yyyy")}</div>
                <p className="text-xs text-muted-foreground">Registration date</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dealer</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{packageItem.dealerId || "Unassigned"}</div>
                <p className="text-xs text-muted-foreground">Assigned to</p>
              </CardContent>
            </Card>
          </div>

          {/* Package Information */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
              <CardDescription>Basic information about this package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UID</p>
                  <p className="text-lg font-mono font-bold">{packageItem.uid}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="secondary" className={statusColors[packageItem.status]}>
                    {packageItem.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-lg capitalize">{packageItem.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Size</p>
                  <Badge variant="outline" className="text-sm">
                    {packageItem.size}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Usage Statistics */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Lifecycle and usage information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Cycles</p>
              <p className="text-2xl font-bold">{packageItem.cycles}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(packageItem.createdAt), "PPp")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Dealer</p>
              <p className="text-sm font-medium">{packageItem.dealerId || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usage Status</p>
              <Badge variant="outline" className="mt-1">
                {packageItem.cycles > 15 ? "High usage" : "Normal"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle Timeline */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Package History
          </CardTitle>
          <CardDescription>Transaction and usage history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-8">
              Transaction history will be available once the item is used in transactions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Info Banner */}
      <Card className="rounded-2xl shadow-sm bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="font-medium">This page can be accessed via QR code scan</p>
              <p className="text-sm text-muted-foreground">
                Scan URL: <code className="bg-background px-2 py-1 rounded text-xs">
                  http://localhost:3000/package/{id}
                </code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
