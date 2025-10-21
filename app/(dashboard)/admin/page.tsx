"use client"

import { KpiCard } from "@/components/dashboard/kpi-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Package, TrendingUp, Clock, AlertCircle, Plus, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { mockTransactions } from "@/lib/mock-data"

// Mock chart data
const borrowsData = [
  { date: "Jan 3", borrows: 45 },
  { date: "Jan 4", borrows: 52 },
  { date: "Jan 5", borrows: 48 },
  { date: "Jan 6", borrows: 61 },
  { date: "Jan 7", borrows: 55 },
  { date: "Jan 8", borrows: 67 },
  { date: "Jan 9", borrows: 58 },
]

const lossRateData = [
  { month: "Aug", rate: 2.1 },
  { month: "Sep", rate: 1.8 },
  { month: "Oct", rate: 2.3 },
  { month: "Nov", rate: 1.9 },
  { month: "Dec", rate: 2.5 },
  { month: "Jan", rate: 2.2 },
]

export default function AdminDashboard() {
  // Calculate KPIs from mock data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayBorrows = mockTransactions.filter((t) => {
    const borrowDate = new Date(t.borrowedAt)
    borrowDate.setHours(0, 0, 0, 0)
    return borrowDate.getTime() === today.getTime()
  }).length

  const returnedOnTime = mockTransactions.filter(
    (t) => t.status === "Returned" && t.returnedAt && t.returnedAt <= t.dueAt,
  ).length
  const totalReturned = mockTransactions.filter((t) => t.status === "Returned").length
  const returnRate = totalReturned > 0 ? ((returnedOnTime / totalReturned) * 100).toFixed(1) : "0"

  const activeBorrows = mockTransactions.filter((t) => t.status === "Borrowed").length

  const dueSoon = mockTransactions.filter((t) => {
    if (t.status !== "Borrowed") return false
    const dueDate = new Date(t.dueAt)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return dueDate <= tomorrow
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your reusable packaging system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Today's Borrows"
          value={todayBorrows}
          change={12.5}
          trend="up"
          description="vs yesterday"
          icon={<Package className="h-5 w-5" />}
        />
        <KpiCard
          title="On-Time Return Rate"
          value={`${returnRate}%`}
          change={3.2}
          trend="up"
          description="vs last week"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KpiCard
          title="Avg Lifecycle"
          value="14.2 days"
          change={1.8}
          trend="down"
          description="vs last month"
          icon={<Clock className="h-5 w-5" />}
        />
        <KpiCard
          title="Items in Circulation"
          value={activeBorrows}
          change={5.4}
          trend="up"
          description="active now"
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Daily Borrows" description="Last 7 days">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={borrowsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="borrows" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Loss Rate Trend" description="Last 6 months">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lossRateData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="rate" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Alerts Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Due Today & Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dueSoon.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No items due today or soon</p>
            ) : (
              dueSoon.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{transaction.itemId}</p>
                      <p className="text-xs text-muted-foreground">Borrower: {transaction.borrowerAnonId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">Due: {new Date(transaction.dueAt).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.dueAt) < new Date() ? "Past due" : "Due today"}
                      </p>
                    </div>
                    <Badge variant={new Date(transaction.dueAt) < new Date() ? "destructive" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto py-4 bg-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Create QR Batch</p>
                  <p className="text-xs text-muted-foreground">Generate QR codes for items</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 bg-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Add New Partner</p>
                  <p className="text-xs text-muted-foreground">Register a new dealer or brand</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 bg-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Download className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Export Report</p>
                  <p className="text-xs text-muted-foreground">Download monthly analytics</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
