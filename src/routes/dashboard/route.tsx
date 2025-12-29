import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import {
  ClockCounterClockwiseIcon,
  SquaresFourIcon,
  StackMinusIcon,
  StackPlusIcon,
} from "@phosphor-icons/react"
import { getSessionFN } from "@/fns"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  async beforeLoad() {
    const { session } = await getSessionFN()
    if (!session) throw redirect({ to: "/login" })
    return { session }
  },
})

function RouteComponent() {
  return (
    <div className="bg-slate-50 h-[calc(100vh-72px)] flex flex-col">
      <div className="flex justify-between gap-4 max-w-md mx-auto space-x-4 rounded-b-lg bg-amber-300 p-2 h-8 hover:h-24 transform transition-all ease-in-out duration-150">
        <Link
          to="/dashboard/addcard"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          {/* <IconBasketDown size={32} /> */}
          <StackPlusIcon size={32} />
          <span className="font-medium">Buy Cards</span>
        </Link>
        <Link
          to="/dashboard/sellcard"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          {/* <IconBasketUp size={32} /> */}
          <StackMinusIcon size={32} />
          <span className="font-medium">Sell Cards</span>{" "}
        </Link>
        <Link
          to="/dashboard/purchasehistory"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          {/* <ClipboardList size={32} /> */}
          <ClockCounterClockwiseIcon size={32} />
          <span className="font-medium">Purchases</span>{" "}
        </Link>
        <Link
          to="/dashboard/cardslist"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <SquaresFourIcon size={32} />
          <span className="font-medium">Cards</span>{" "}
        </Link>
      </div>
      <Outlet />
    </div>
  )
}
