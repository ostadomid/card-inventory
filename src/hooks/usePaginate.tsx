import { useState } from "react"

type Props = {
  count: number
  pageSize: number
}
export function usePaginate({ count, pageSize }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(count / pageSize)
}
