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
    <div
      style={{ direction: "rtl" }}
      className="bg-slate-50 h-[calc(100vh-72px)] flex flex-col"
    >
      <div className="flex justify-between gap-4 w-full sm:max-w-fit mx-auto space-x-4 rounded-b-lg bg-amber-300 p-2 h-24 sm:h-8 sm:hover:h-24 transform transition-all ease-in-out duration-150">
        <Link
          to="/dashboard/sellcard"
          className="w-24 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <StackMinusIcon size={32} />
          <span className="font-medium">فروش</span>
        </Link>
        <Link
          to="/dashboard/addcard"
          className="w-24 rounded-lg aspect-square flex flex-col justify-center items-center hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <StackPlusIcon size={32} />
          <span className="font-medium">خرید</span>
        </Link>
        <Link
          to="/dashboard/purchasehistory"
          className="w-24 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <ClockCounterClockwiseIcon size={32} />
          <span className="font-medium text-center">سابقه خرید</span>
        </Link>
        <Link
          to="/dashboard/sellhistory"
          className="w-24 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <ClockCounterClockwiseIcon size={32} />
          <span className="font-medium text-center">سابقه فروش</span>
        </Link>
        <Link
          to="/dashboard/cardslist"
          className="w-24 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <SquaresFourIcon size={32} />
          <span className="font-medium">کارتها</span>{" "}
        </Link>
      </div>
      <Outlet />
    </div>
  )
}
