import { create } from "zustand"
import type { Transaction } from "@/lib/types"
import { mockTransactions } from "@/lib/mock-data"

interface TrackingState {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  markReturned: (id: string) => void
  markDamaged: (id: string) => void
  markWashing: (id: string) => void
}

export const useTrackingStore = create<TrackingState>((set) => ({
  transactions: mockTransactions,
  setTransactions: (transactions) => set({ transactions }),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  markReturned: (id) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, status: "Returned", returnedAt: new Date() } : t,
      ),
    })),
  markDamaged: (id) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, status: "Damaged" } : t)),
    })),
  markWashing: (id) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, status: "Washing" } : t)),
    })),
}))
