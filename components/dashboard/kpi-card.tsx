"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  description?: string
}

export function KpiCard({ title, value, change, trend = "neutral", icon, description }: KpiCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <ArrowUp className="h-4 w-4" />
    if (trend === "down") return <ArrowDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-600 dark:text-emerald-400"
    if (trend === "down") return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 text-sm font-medium mt-2", getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
            {description && <span className="text-muted-foreground ml-1">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
