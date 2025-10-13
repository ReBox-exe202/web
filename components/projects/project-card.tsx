"use client"

import type { Project } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, MapPin, Package, Calendar, ExternalLink, Archive, Copy } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
  onArchive?: (id: string) => void
  onDuplicate?: (id: string) => void
}

export function ProjectCard({ project, onArchive, onDuplicate }: ProjectCardProps) {
  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <Badge variant="secondary" className={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {project.description || "No description provided"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onArchive && project.status !== "Archived" && (
                <DropdownMenuItem onClick={() => onArchive(project.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{project.items}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{project.pickupPoints}</p>
              <p className="text-xs text-muted-foreground">Pickup Points</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">{format(new Date(project.updatedAt), "MMM dd")}</p>
              <p className="text-xs text-muted-foreground">Last Updated</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
