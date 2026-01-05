import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns-jalali"
import { Image, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db"
import { purchases } from "@/db/schema"
import { cn, numberFormat } from "@/lib/utils"
import { Paginator } from "@/components/Paginator"
import { ActionCell } from "@/components/ActionCell"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebouncedCallback } from "@tanstack/react-pacer"

type Purchase = {
  id: number
  cardId: string
  purchaseDate: number
  price: number
  sellingPrice: number
  quantity: number
  remaining: number
  imageKey: string
}

const hp = createColumnHelper<Purchase>()
const columns = [
  hp.display({
    id: "operation",
    cell(props) {
      return (
        <ActionCell
          onEdit={(id) => {
            props.table.options.meta?.navigate({
              to: "/dashboard/editpurchase/$id",
              params: { id: String(id) },
            })
          }}
          onDelete={(id) =>
            new Promise((res) => setTimeout(() => res(id), 1500))
          }
          id={props.row.original.id}
        />
      )
    },
  }),
  hp.accessor("cardId", {
    header: "کد",
    cell(props) {
      return <span className="font-medium">{props.getValue() as string}</span>
    },
  }),
  hp.accessor("purchaseDate", {
    header: "ت.خرید",
    cell(props) {
      return (
        <span className="tracking-wide">
          {format(props.getValue(), "yyyy/MM/dd")}
        </span>
      )
    },
  }),
  hp.accessor("quantity", {
    header: "تعداد",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  }),
  hp.accessor("price", {
    header: "ق.خرید",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  }),
  hp.accessor("sellingPrice", {
    header: "ق.فروش",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  }),
  hp.accessor("remaining", {
    header: "موجودی",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  }),
  hp.accessor("imageKey", {
    enableSorting: false,
    header: "",
    cell: ({ getValue, row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Image className="cursor-pointer" size={16} />
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-150">
          <DialogHeader>
            <DialogTitle>اطلاعات کارت</DialogTitle>
            <DialogDescription>123</DialogDescription>
          </DialogHeader>
          <img
            alt={`${row.getValue("cardId")}`}
            src={`http:\\\\localhost:9000\\card-inventory\\${getValue()}`}
          />
        </DialogContent>
      </Dialog>
    ),
  }),
]

export const Route = createFileRoute("/dashboard/purchasehistory")({
  component: RouteComponent,
})

const getPurchases = createServerFn().handler(async () => {
  // TODO: add authentication/authorization here
  const result = db.select().from(purchases).all()
  return result?.map((e) => ({ ...e, purchaseDate: e.purchaseDate.getTime() }))
})
function RouteComponent() {
  const navigate = useNavigate()

  const { data = [] } = useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
  })
  const table = useReactTable({
    columns: columns,
    data,
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
    meta: { navigate },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const applyFilter = useDebouncedCallback(
    (filter) => table.setColumnFilters([{ id: "cardId", value: filter }]),
    { wait: 500 },
  )

  return (
    <>
      <InputGroup className="w-full sm:max-w-lg mx-auto mt-8">
        <InputGroupInput
          onChange={(e) => {
            applyFilter(e.target.value)
          }}
        />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div style={{ direction: "rtl" }}>
        <Table className="w-full sm:max-w-lg mx-auto mt-8">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-start">
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          {
                            "cursor-pointer": header.column.getCanSort(),
                          },
                          "select-none",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
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
                  <TableCell key={cell.id} className="font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div style={{ direction: "ltr" }} className="my-4">
          <Paginator
            totalPages={table.getPageCount()}
            onChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      </div>
    </>
  )
}
