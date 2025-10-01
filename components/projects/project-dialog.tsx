"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockPartners } from "@/lib/mock-data"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    name: string
    description: string
    itemType: string
    area: string
    partnerId: string
  }) => void
}

export function ProjectDialog({ open, onOpenChange, onSubmit }: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    itemType: "cup",
    area: "",
    partnerId: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      description: "",
      itemType: "cup",
      area: "",
      partnerId: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Set up a new reusable packaging project for your organization.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Downtown Food District"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the project goals and scope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemType">Item Type</Label>
              <Select
                value={formData.itemType}
                onValueChange={(value) => setFormData({ ...formData, itemType: value })}
              >
                <SelectTrigger id="itemType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cup">Cups</SelectItem>
                  <SelectItem value="box">Boxes</SelectItem>
                  <SelectItem value="bowl">Bowls</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area/Region</Label>
              <Input
                id="area"
                placeholder="Downtown"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner">Primary Partner</Label>
            <Select
              value={formData.partnerId}
              onValueChange={(value) => setFormData({ ...formData, partnerId: value })}
            >
              <SelectTrigger id="partner">
                <SelectValue placeholder="Select a partner" />
              </SelectTrigger>
              <SelectContent>
                {mockPartners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name} ({partner.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
