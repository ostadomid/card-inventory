import { useCallback, useState } from "react"

type Props = {
  count: number
  pageSize: number
  threshold?: number
}
export function usePaginate({ count, pageSize, threshold = 5 }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const nextPage = useCallback(() => {
    setCurrentPage((old) => Math.min(old + 1, Math.ceil(count / pageSize)))
  }, [setCurrentPage, count, pageSize])

  const prevPage = useCallback(() => {
    setCurrentPage((old) => Math.max(old - 1, 1))
  }, [setCurrentPage])

  const totalPages = Math.ceil(count / pageSize)
  const renderMinimal = totalPages <= threshold
  const renderRangeStart = !renderMinimal && currentPage < threshold
  const renderRangeEnd =
    !renderMinimal && !renderRangeStart && totalPages - currentPage <= threshold
  const renderMidRange = !renderMinimal && !renderRangeEnd
  let render = [] as Array<string>
  console.log({
    totalPages,
    renderMinimal,
    renderRangeStart,
    renderMidRange,
    renderRangeEnd,
  })

  if (renderMinimal) {
    render = ["1", "2", "3", "4", "5"]
  }
  if (renderRangeStart) {
    render = [
      "<",
      ...Array(threshold)
        .fill(0)
        .map((e, i) => String(currentPage + i)),
    ]
  }
  if (renderRangeEnd) {
    render = [
      "<",
      "1",
      "2",
      ...Array(threshold)
        .fill(0)
        .map((e, i) => String(currentPage + i)),
    ]
  }
  if (renderMidRange) {
    render = ["<", "1", "2", "...", String(totalPages - 1), String(totalPages)]
  }
  return { nextPage, prevPage, currentPage, render }
}
