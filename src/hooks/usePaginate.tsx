import { useCallback, useMemo, useState } from "react"
import { chunk, take, last, takeRight, windowed } from "es-toolkit"
import { cn } from "@/lib/utils"

// type Props = {
//   totalItems: number
//   pageSize: number
//   len?: number
// }
// function where(pageNo: number, frameLength: number, totalPages: number) {
//   const isMiddle =
//     Math.ceil(pageNo / frameLength) > 1 &&
//     Math.ceil(pageNo / frameLength) < Math.ceil(totalPages / frameLength)
//   const isHead = pageNo == 1
//   const isTail =
//     Math.ceil(pageNo / frameLength) == Math.ceil(totalPages / frameLength)
//   return { isHead, isMiddle, isTail }
// }
// export function usePaginate({ totalItems, pageSize, len = 5 }: Props) {
//   const [currentPage, setCurrentPage] = useState(1)
//   const totalpages = Math.ceil(totalItems / pageSize)
//   const frameLength = Math.min(totalpages, len)
//   const frames = useMemo(
//     () =>
//       chunk(
//         Array.from({ length: totalpages }, (_, idx) => idx + 1),
//         frameLength,
//       ),
//     [totalpages, frameLength],
//   )

//   const nextPage = useCallback(() => {
//     setCurrentPage((old) => Math.min(old + 1, totalpages))
//   }, [setCurrentPage, totalpages])
//   const prevPage = useCallback(() => {
//     setCurrentPage((old) => Math.max(1, old - 1))
//   }, [setCurrentPage])

//   console.log({
//     totalpages,
//     frames,
//     frameLength,
//   })

//   let render: Array<number> = []
//   const mainFrameIdx = Math.ceil(currentPage / frameLength) - 1
//   //render.push(...frames[mainFrameIdx])

//   //LeftIndex Margin of Frame
//   if (currentPage % frameLength === 1) {
//     const isFirstFrame = mainFrameIdx === 0
//     render = [
//       ...take(
//         frames[mainFrameIdx],
//         isFirstFrame ? frameLength : frameLength - 1,
//       ),
//     ]
//     if (!isFirstFrame) {
//       render = [last(frames[mainFrameIdx - 1])!, ...render]
//     }
//   }
//   //Right Margin of Frame
//   else if (currentPage % frameLength === 0) {
//     const isLastFrame = mainFrameIdx === frames.length - 1
//     render = [
//       ...takeRight(
//         frames[mainFrameIdx],
//         isLastFrame ? frameLength : frameLength - 1,
//       ),
//     ]
//     if (!isLastFrame) {
//       render = [...render, frames[mainFrameIdx + 1][0]]
//     }
//   }
//   //Mid Range of Frame
//   else {
//     render.push(...frames[mainFrameIdx])
//   }
//   return {
//     render: (
//       <div className="flex gap-2">
//         {render.map((e) => (
//           <p className={cn({ "text-red-700": e == currentPage })}>{e}</p>
//         ))}
//       </div>
//     ),
//     prevPage,
//     nextPage,
//   }
// }

const { floor: lower, ceil: upper, min, max } = Math

export const usePaginate1 = ({ totalPages }: { totalPages: number }) => {
  const arr = useMemo(
    () => Array.from({ length: totalPages }, (_, idx) => idx + 1),
    [totalPages],
  )
  const LEN = 5
  const isFirst = (n: number) => n == 1
  const isLast = (n: number) => n == 0
  const [currentIdx, setCurrentIdx] = useState(0)

  const nextPage = useCallback(() => {
    setCurrentIdx((old) => min(totalPages - 1, old + 1))
  }, [setCurrentIdx])
  const prevPage = useCallback(() => {
    setCurrentIdx((old) => max(0, old - 1))
  }, [setCurrentIdx])

  const position = (currentIdx + 1) % LEN
  const frameNoIdx = upper(currentIdx / LEN)
  let [left, right] = [0, 0]
  left = max(0, frameNoIdx - 1) * 5
  right = left + LEN - 1
  console.log({ position, frameNoIdx })

  if (isFirst(position) && frameNoIdx != 0) {
    console.log("A")
    left = max(0, currentIdx - 2)
    right = left + LEN - 1
  }
  if (isLast(position) && frameNoIdx < upper(totalPages / 5) - 1) {
    console.log("B")
    left = currentIdx - 2
    right = left + LEN - 1
  }
  const render = arr.slice(left, right + 1)
  return {
    render: (
      <div className="flex gap-2">
        {render.map((e) => (
          <p className={cn({ "text-red-700": e == currentIdx + 1 })}>{e}</p>
        ))}
      </div>
    ),
    nextPage,
    prevPage,
  }
}

export const usePaginate3 = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const nextPage = useCallback(() => {
    setCurrentPage((old) => min(totalPages, old + 1))
  }, [setCurrentPage])
  const prevPage = useCallback(() => {
    setCurrentPage((old) => max(1, old - 1))
  }, [setCurrentPage])

  const position = currentPage % 5
  const firstInFrame = (position: number) => position == 1
  const lastInFrame = (position: number) => position == 0
  const firstFrame = (frame: number) => frame == 1
  const lastFrame = (frame: number) => frame == upper(totalPages / 5)
  const frame = upper(currentPage / 5)
  let leftIndex = (frame - 1) * 5
  let rightIndex = min(leftIndex + 4, totalPages - 1)

  if (firstInFrame(position) && !firstFrame(frame)) {
    leftIndex = max(0, currentPage - 1 - 1)
    rightIndex = min(totalPages - 1, leftIndex + 4 - 1)
  }
  if (lastInFrame(position) && !lastFrame(frame)) {
    leftIndex = max(0, currentPage - 1)
    rightIndex = min(totalPages - 1, leftIndex + 4 - 1)
  }

  return {
    nextPage,
    prevPage,
    render: (
      <div className="flex gap-2">
        {Array.from(
          { length: rightIndex - leftIndex + 1 },
          (_, idx) => leftIndex + idx + 1,
        ).map((e) => (
          <p className={cn({ "text-red-700 font-black": e == currentPage })}>
            {e}
          </p>
        ))}
      </div>
    ),
  }
}

const createArray = (length: number) =>
  Array.from({ length: length }, (_, idx) => idx + 1)
const makeFrames = (array: Array<number | string>, frameSize: number) =>
  array
    .map((_, idx) =>
      array.slice(idx * (frameSize - 2), idx * (frameSize - 2) + frameSize),
    )
    .filter((a) => a.length != 0)
export const usePaginate = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const nextPage = useCallback(() => {
    setCurrentPage((old) => min(totalPages, old + 1))
  }, [setCurrentPage])
  const prevPage = useCallback(() => {
    setCurrentPage((old) => max(1, old - 1))
  }, [setCurrentPage])

  const items = useMemo(() => {
    const arr = createArray(totalPages)
    return totalPages <= 5 ? [arr] : makeFrames(arr, 5)
  }, [totalPages])
  const flatItems = useMemo(() => items.flat(), [items])

  const newCurrentPage = flatItems.findIndex((e) => e === currentPage) + 1
  console.log({ currentPage, newCurrentPage, items, flatItems })
  const frameIndex = min(
    items.length - 1,
    upper(newCurrentPage / 5) - 1 + (newCurrentPage % 5 == 0 ? 1 : 0),
  )

  return {
    nextPage,
    prevPage,
    render: (
      <div className="flex gap-2">
        {items[frameIndex].map((e) => (
          <p className={cn({ "text-red-700 font-black": e == currentPage })}>
            {e}
          </p>
        ))}
      </div>
    ),
  }
}

export const usePaginationGemini = ({ totalPages = 1, pageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Helper to change page safely
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }

  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)

  // Calculate the specific numbers to show (Sliding Window)
  const visiblePages = useMemo(() => {
    // If total pages is less than size, show all
    if (totalPages <= pageSize) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Calculate start/end to keep current page somewhat centered
    let start = currentPage - Math.floor(pageSize / 2)

    // Adjust if we are near the start
    if (start < 1) {
      start = 1
    }

    // Adjust if we are near the end
    if (start + pageSize > totalPages) {
      start = totalPages - pageSize + 1
    }

    return Array.from({ length: pageSize }, (_, i) => start + i)
  }, [totalPages, pageSize, currentPage])

  return {
    currentPage,
    visiblePages,
    goToPage,
    nextPage,
    prevPage,
    isFirst: currentPage === 1,
    isLast: currentPage === totalPages,
  }
}
