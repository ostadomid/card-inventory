import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { ArrowBigDownDash, ClipboardList, ShoppingCart } from "lucide-react"
import {
  IconBasketDown,
  IconBasketUp,
  IconListDetails,
} from "@tabler/icons-react"
import { getSessionFN } from "@/fns"
import { useQuery } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

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
          {/* <ArrowBigDownDash size={24} /> */}
          <IconBasketDown size={32} />
          <span className="font-medium">Buy Cards</span>
        </Link>
        <Link
          to="/dashboard/sellcard"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          {/* <ShoppingCart size={32} /> */}
          <IconBasketUp size={32} />
          <span className="font-medium">Sell Cards</span>{" "}
        </Link>
        <Link
          to="/dashboard/cards"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          {/* <ClipboardList size={32} /> */}
          <IconListDetails size={32} />
          <span className="font-medium">All Cards</span>{" "}
        </Link>
      </div>
      <Outlet />
    </div>
  )
}
