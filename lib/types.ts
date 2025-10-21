// Core types for the packaging management system

export type AccountRole = "admin" | "manager" | "staff"

export interface Account {
  id: string
  email: string
  name: string
  role: AccountRole
  avatar?: string
}

export type ItemType = "cup" | "box" | "bowl"
export type ItemSize = "S" | "M" | "L"
export type ItemStatus = "Ready" | "Borrowed" | "Returned" | "Washing" | "Damaged" | "Retired"

export interface Item {
  id: string
  type: ItemType
  size: ItemSize
  cycles: number
  status: ItemStatus
  dealerId?: string
  createdAt: Date
}

export type TransactionStatus = "Ready" | "Borrowed" | "Returned" | "Washing" | "Damaged" | "Retired"

export interface Transaction {
  id: string
  itemId: string
  partnerId: string
  borrowerAnonId: string
  status: TransactionStatus
  borrowedAt: Date
  dueAt: Date
  returnedAt?: Date
  notes?: string
}

export type PartnerType = "Dealer" | "Brand" | "Restaurant"

export interface Partner {
  id: string
  name: string
  type: PartnerType
  contactName: string
  contactEmail: string
  pickupPoints: number
  slaDays: number
  lossRate: number
}

export type ProjectStatus = "Active" | "Paused" | "Archived"

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  items: number
  pickupPoints: number
  partnerId?: string
  updatedAt: Date
  createdAt: Date
}

export interface KPI {
  label: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
}
