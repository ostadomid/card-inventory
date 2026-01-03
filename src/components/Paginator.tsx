import { useCallback, useMemo, useState } from "react"
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

const { min, max, floor: lower, ceil: upper } = Math

type Props = {
  totalPages: number
  onChange: (page: number) => void
}
export function Paginator({ totalPages, onChange }: Props) {
  const { items, currentPage, setCurrentPage } = usePaginate({ totalPages })
  return (
    <Pagination>
      <PaginationContent>
        {items.map((e) => (
          <PaginationItem key={e}>
            <Button
              onClick={() => {
                const newPage = Number(e) ?? 1
                setCurrentPage(newPage)
                onChange(newPage)
              }}
              variant={e == currentPage ? "default" : "outline"}
            >
              {e}
            </Button>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  )
}

const createArray = (length: number) =>
  Array.from({ length: length }, (_, idx) => idx + 1)
const makeFrames = (array: Array<number | string>, frameSize: number) =>
  array
    .map((_, idx) =>
      array.slice(idx * (frameSize - 2), idx * (frameSize - 2) + frameSize),
    )
    .filter((a) => a.length != 0)

export const usePaginate = ({
  totalPages,
  blocks = 5,
}: {
  totalPages: number
  blocks?: number
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const nextPage = useCallback(() => {
    setCurrentPage((old) => min(totalPages, old + 1))
  }, [setCurrentPage])
  const prevPage = useCallback(() => {
    setCurrentPage((old) => max(1, old - 1))
  }, [setCurrentPage])

  const items = useMemo(() => {
    const arr = createArray(totalPages)
    return totalPages <= blocks ? [arr] : makeFrames(arr, blocks)
  }, [totalPages])
  const flatItems = useMemo(() => items.flat(), [items])

  const newCurrentPage = flatItems.findIndex((e) => e === currentPage) + 1

  const frameIndex = min(
    items.length - 1,
    upper(newCurrentPage / blocks) - 1 + (newCurrentPage % blocks == 0 ? 1 : 0),
  )

  return {
    nextPage,
    prevPage,
    setCurrentPage,
    currentPage,
    items: items[frameIndex]!,
  }
}
