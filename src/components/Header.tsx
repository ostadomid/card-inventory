import { Link, useNavigate } from "@tanstack/react-router"
import {
  IconAddressBook,
  IconBrandTwitterFilled,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { Activity, useMemo, useState } from "react"
import { Cog, Home, LogOutIcon, Menu, User2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import type { LucideIcon } from "lucide-react"
import type { FileRouteTypes } from "@/routeTree.gen"
import { signOut, useSession } from "@/lib/auth-client"

type Menu = {
  title: string
  icon: LucideIcon
  to: FileRouteTypes["fullPaths"]
}

export default function Header() {
  const { data } = useSession()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const items = useMemo<Array<Menu>>(
    () => [
      { title: "خانه", icon: Home, to: "/" },
      { title: "مدیریت", icon: Cog, to: "/dashboard" },
    ],
    [],
  )

  return (
    <>
      <header
        style={{ direction: "rtl" }}
        className="p-4 flex items-center bg-gray-800 text-white shadow-lg"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ms-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
        <Activity mode={data ? "visible" : "hidden"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ms-auto cursor-pointer hover:bg-purple-700">
                <IconUserCircle /> {data?.user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <IconAddressBook /> پروفایل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut().then((r) => {
                    if (r.data?.success) {
                      navigate({ to: "/", reloadDocument: true })
                    }
                  })
                }}
              >
                <IconLogout />
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Activity>
      </header>

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl mx-auto font-bold">ناوبری</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {items.map(({ title, to, icon: Icon }, idx) => (
            <Link
              key={idx}
              onClick={() => setIsOpen(false)}
              to={to}
              activeProps={{ className: "bg-blue-600" }}
              className="transition-colors rounded-lg hover:bg-gray-600 flex justify-end gap-4 p-4 mb-2"
            >
              <span className="font-medium">{title}</span>
              <Icon size={24} />
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
