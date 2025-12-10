import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import {
  ArrowBigDownDash,
  ClipboardList,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-slate-50 h-[calc(100vh-72px)] flex flex-col">
      <div className="flex justify-between gap-4 max-w-md mx-auto space-x-4 rounded-b-lg bg-amber-300 p-2 h-8 hover:h-24 transform transition-all ease-in-out duration-150">
        <Link
          to="/dashboard/addcard"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <ArrowBigDownDash size={24} />
          <span className="font-medium">Buy Cards</span>
        </Link>
        <Link
          to="/test"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <ShoppingCart size={24} />
          <span className="font-medium">Sell Cards</span>{" "}
        </Link>
        <Link
          to="/test"
          className="w-20 rounded-lg aspect-square flex flex-col justify-center items-center  hover:bg-amber-500 transform transition-colors ease-in-out duration-150"
        >
          <ClipboardList size={24} />
          <span className="font-medium">All Cards</span>{" "}
        </Link>
      </div>

      <Outlet />
    </div>
  )
}
