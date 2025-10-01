"use client"

import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineStep {
  label: string
  date?: Date
  completed: boolean
}

interface LifecycleTimelineProps {
  steps: TimelineStep[]
}

export function LifecycleTimeline({ steps }: LifecycleTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {step.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </div>
            {index < steps.length - 1 && (
              <div className={cn("w-0.5 h-12 mt-2", step.completed ? "bg-primary" : "bg-muted")} />
            )}
          </div>
          <div className="flex-1 pb-8">
            <p className={cn("font-medium", step.completed ? "text-foreground" : "text-muted-foreground")}>
              {step.label}
            </p>
            {step.date && <p className="text-sm text-muted-foreground mt-1">{new Date(step.date).toLocaleString()}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
