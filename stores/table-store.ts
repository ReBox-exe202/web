import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"

interface TableState {
  [namespace: string]: {
    columnVisibility: VisibilityState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    pagination: {
      pageIndex: number
      pageSize: number
    }
  }
}

interface TableStore {
  tables: TableState
  setColumnVisibility: (namespace: string, visibility: VisibilityState) => void
  setSorting: (namespace: string, sorting: SortingState) => void
  setColumnFilters: (namespace: string, filters: ColumnFiltersState) => void
  setPagination: (namespace: string, pagination: { pageIndex: number; pageSize: number }) => void
  getTableState: (namespace: string) => TableState[string]
}

const defaultTableState = {
  columnVisibility: {},
  sorting: [],
  columnFilters: [],
  pagination: { pageIndex: 0, pageSize: 10 },
}

export const useTableStore = create<TableStore>()(
  persist(
    (set, get) => ({
      tables: {},
      setColumnVisibility: (namespace, visibility) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [namespace]: {
              ...(state.tables[namespace] || defaultTableState),
              columnVisibility: visibility,
            },
          },
        })),
      setSorting: (namespace, sorting) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [namespace]: {
              ...(state.tables[namespace] || defaultTableState),
              sorting,
            },
          },
        })),
      setColumnFilters: (namespace, filters) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [namespace]: {
              ...(state.tables[namespace] || defaultTableState),
              columnFilters: filters,
            },
          },
        })),
      setPagination: (namespace, pagination) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [namespace]: {
              ...(state.tables[namespace] || defaultTableState),
              pagination,
            },
          },
        })),
      getTableState: (namespace) => get().tables[namespace] || defaultTableState,
    }),
    {
      name: "table-storage",
    },
  ),
)
