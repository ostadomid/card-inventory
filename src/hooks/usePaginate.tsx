import { useCallback, useMemo, useState } from "react"
import { chunk, take, last, takeRight } from "es-toolkit"
import { cn } from "@/lib/utils"

type Props = {
  totalItems: number
  pageSize: number
  len?: number
}
function where(pageNo: number, frameLength: number, totalPages: number) {
  const isMiddle =
    Math.ceil(pageNo / frameLength) > 1 &&
    Math.ceil(pageNo / frameLength) < Math.ceil(totalPages / frameLength)
  const isHead = pageNo == 1
  const isTail =
    Math.ceil(pageNo / frameLength) == Math.ceil(totalPages / frameLength)
  return { isHead, isMiddle, isTail }
}
export function usePaginate({ totalItems, pageSize, len = 5 }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalpages = Math.ceil(totalItems / pageSize)
  const frameLength = Math.min(totalpages, len)
  const frames = useMemo(
    () =>
      chunk(
        Array.from({ length: totalpages }, (_, idx) => idx + 1),
        frameLength,
      ),
    [totalpages, frameLength],
  )

  const nextPage = useCallback(() => {
    setCurrentPage((old) => Math.min(old + 1, totalpages))
  }, [setCurrentPage, totalpages])
  const prevPage = useCallback(() => {
    setCurrentPage((old) => Math.max(1, old - 1))
  }, [setCurrentPage])

  console.log({
    totalpages,
    frames,
    frameLength,
  })

  let render: Array<number> = []
  const mainFrameIdx = Math.ceil(currentPage / frameLength) - 1
  //render.push(...frames[mainFrameIdx])

  //Left Margin of Frame
  if (currentPage % frameLength === 1) {
    const isFirstFrame = mainFrameIdx === 0
    render = [
      ...take(
        frames[mainFrameIdx],
        isFirstFrame ? frameLength : frameLength - 1,
      ),
    ]
    if (!isFirstFrame) {
      render = [last(frames[mainFrameIdx - 1])!, ...render]
    }
  }
  //Right Margin of Frame
  else if (currentPage % frameLength === 0) {
    const isLastFrame = mainFrameIdx === frames.length - 1
    render = [
      ...takeRight(
        frames[mainFrameIdx],
        isLastFrame ? frameLength : frameLength - 1,
      ),
    ]
    if (!isLastFrame) {
      render = [...render, frames[mainFrameIdx + 1][0]]
    }
  }
  //Mid Range of Frame
  else {
    render.push(...frames[mainFrameIdx])
  }
  return {
    render: (
      <div className="flex gap-2">
        {render.map((e) => (
          <p className={cn({ "text-red-700": e == currentPage })}>{e}</p>
        ))}
      </div>
    ),
    prevPage,
    nextPage,
  }
}
