import { A, O, pipe } from "@mobily/ts-belt"
import { createFileRoute } from "@tanstack/react-router"
import cities from "@/db/cities.json"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ArrowLeft, ArrowRight, Search } from "lucide-react"
import { useDebouncedCallback } from "@tanstack/react-pacer"
import { usePaginate, usePaginationGemini } from "@/hooks/usePaginate"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/table")({
  component: RouteComponent,
})
type City = {
  city: string
  population: number
  country: string
  continent: string
}

const h = createColumnHelper<City>()
const columns = [
  h.accessor("city", {
    header: () => <span className="font-semibold">City</span>,
    cell(props) {
      return <span>{props.getValue()}</span>
    },
  }),
]

function RouteComponent() {
  const table = useReactTable({
    data: cities,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })
  const handleFilter = useDebouncedCallback(
    (filter: string) => {
      if (!filter) {
        return table.setColumnFilters([])
      }
      table.setColumnFilters([{ id: "city", value: filter }])
    },
    { wait: 500 },
  )
  //const { render, nextPage, prevPage } = usePaginate({ totalPages: 9 })

  const {
    visiblePages,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    isFirst,
    isLast,
  } = usePaginationGemini({ totalPages: 18 })
  return (
    <Card className="w-full sm:max-w-md mx-auto mt-4 shadow-lg">
      <CardHeader>
        <CardTitle>All Cities</CardTitle>
      </CardHeader>
      <CardContent>
        <InputGroup className="mb-4">
          <InputGroupInput
            onChange={(e) => {
              handleFilter(e.target.value)
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((g) => (
              <TableRow key={g.id}>
                {g.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid grid-cols-4 gap-4 p-3">
          {Array(table.getPageCount())
            .fill(0)
            .map((e, idx) => (
              <Button
                variant={
                  table.getState().pagination.pageIndex === idx
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  table.setPageIndex(idx)
                }}
              >
                {idx + 1}
              </Button>
            ))}
        </div>

        <CardFooter>
          <Button onClick={prevPage}>
            <ArrowLeft />
          </Button>
          <Button onClick={nextPage}>
            <ArrowRight />
          </Button>
        </CardFooter>
        {/* <div>{render}</div> */}
        <div className="flex gap-2 items-center">
          <button
            onClick={prevPage}
            disabled={isFirst}
            className="disabled:opacity-50"
          >
            Prev
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={cn("px-3 py-1 border rounded", {
                "bg-red-700 text-white font-black": page === currentPage,
              })}
            >
              {page}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={isLast}
            className="disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
