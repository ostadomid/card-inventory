import { useCallback, useMemo, useState } from "react"
import { chunk, take, last, takeRight } from "es-toolkit"
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

//   //Left Margin of Frame
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

export const usePaginate = ({ totalPages }: { totalPages: number }) => {
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
