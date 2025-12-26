import { createFileRoute } from "@tanstack/react-router"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns-jalali"
import { Image, ZoomIn } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"

type Purchase = {
  cardId: string
  purchaseDate: number
  price: number
  sellingPrice: number
  quantity: number
  remaining: number
  imageKey: string
}

const numberFormat = (value: number) => Intl.NumberFormat("IR-fa").format(value)

const columns: Array<ColumnDef<Purchase>> = [
  {
    accessorKey: "cardId",
    header: "کد",
    cell(props) {
      return <span className="font-medium">{props.getValue() as string}</span>
    },
  },
  {
    accessorKey: "purchaseDate",
    header: "تاریخ خرید",
    cell(props) {
      return (
        <span className="tracking-wide">
          {format(props.getValue() as string, "yyyy/MM/dd")}
        </span>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: "تعداد",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "price",
    header: "قیمت خرید",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "sellingPrice",
    header: "قیمت فروش",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "remaining",
    header: "موجودی",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "imageKey",
    header: "نمایش",
    cell: ({ getValue }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Image className="cursor-pointer" size={16} />
        </DialogTrigger>
        <DialogContent>
          <p>Content Goes Here</p>
        </DialogContent>
      </Dialog>
    ),
  },
]

export const Route = createFileRoute("/dashboard/purchasehistory")({
  component: RouteComponent,
})

const data: Array<Purchase> = [
  {
    cardId: "H1210",
    purchaseDate: 1765617791,
    price: 1000,
    sellingPrice: 2000,
    remaining: 1500,
    quantity: 1500,
    imageKey: "",
  },
  {
    cardId: "AL440",
    purchaseDate: 1766247464439,
    price: 2700,
    sellingPrice: 7500,
    remaining: 300,
    quantity: 300,
    imageKey: "",
  },
]
function RouteComponent() {
  const table = useReactTable({
    columns: columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div style={{ direction: "rtl" }}>
      <Table className="w-full sm:max-w-lg mx-auto mt-8">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id} className="text-start">
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
          {table.getCoreRowModel().rows.map((row) => (
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
    </div>
  )
}
