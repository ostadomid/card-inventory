import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createFileRoute } from "@tanstack/react-router"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { parse, format } from "date-fns-jalali"
import { ZoomIn } from "lucide-react"
import { toast } from "sonner"

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

const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "cardId",
    header: "Card ID",
    cell(props) {
      return <span className="font-medium">{props.getValue() as string}</span>
    },
  },
  {
    accessorKey: "purchaseDate",
    header: "Date",
    cell(props) {
      return <span>{format(props.getValue() as string, "yyyy-MM-dd")}</span>
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "price",
    header: "Pirce",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "remaining",
    header: "Left",
    cell: ({ getValue }) => numberFormat(getValue() as number),
  },
  {
    accessorKey: "imageKey",
    cell: ({ getValue }) => (
      <ZoomIn
        className="cursor-pointer"
        size={16}
        onClick={() => toast.info(getValue() as string)}
      />
    ),
  },
]

export const Route = createFileRoute("/dashboard/cards")({
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
    <Table className="w-full sm:max-w-md mx-auto mt-8">
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id}>
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
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
