import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { ArrowBigDownDash } from "lucide-react"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-amber-800 h-[calc(100vh-72px)]">
      <div className="flex justify-between gap-4 max-w-md mx-auto bg-amber-300">
        <Link
          to="/test"
          className="w-20 aspect-square flex flex-col justify-center items-center"
        >
          <ArrowBigDownDash size={24} />
          <span className="font-medium">Add Cards</span>
        </Link>
        <Link to="/test" className="w-20 aspect-square">
          A
        </Link>
        <Link to="/test" className="w-20 aspect-square">
          A
        </Link>
      </div>

      <Outlet />
    </div>
  )
}
