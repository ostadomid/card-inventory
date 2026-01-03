import { useNavigate } from "@tanstack/react-router"
import type { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    navigate: ReturnType<typeof useNavigate>
  }
}
export {}
