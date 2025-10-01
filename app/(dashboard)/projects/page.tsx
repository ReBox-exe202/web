"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectDialog } from "@/components/projects/project-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"
import type { Project, ProjectStatus } from "@/lib/types"
import { toast } from "sonner"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleCreateProject = (data: {
    name: string
    description: string
    itemType: string
    area: string
    partnerId: string
  }) => {
    const newProject: Project = {
      id: `PRJ-${String(projects.length + 1).padStart(3, "0")}`,
      name: data.name,
      description: data.description,
      status: "Active",
      items: 0,
      pickupPoints: 0,
      partnerId: data.partnerId,
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    setProjects([newProject, ...projects])
    toast.success("Project created", {
      description: `${data.name} has been successfully created.`,
    })
  }

  const handleArchive = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status: "Archived" as ProjectStatus } : p)))
    toast.success("Project archived", {
      description: "The project has been moved to archived status.",
    })
  }

  const handleDuplicate = (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (project) {
      const duplicated: Project = {
        ...project,
        id: `PRJ-${String(projects.length + 1).padStart(3, "0")}`,
        name: `${project.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setProjects([duplicated, ...projects])
      toast.success("Project duplicated", {
        description: `${project.name} has been duplicated.`,
      })
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your reusable packaging projects</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Create your first project to get started.</p>
          <Button onClick={() => setDialogOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onArchive={handleArchive} onDuplicate={handleDuplicate} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreateProject} />
    </div>
  )
}
