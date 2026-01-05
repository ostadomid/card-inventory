import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { numberFormat } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { format } from "date-fns-jalali"

export const Route = createFileRoute("/dashboard/sellhistory")({
  component: RouteComponent,
})
type Order = {
  id: number
  cardId: string
  orderedAt: number
  price: number
  quantity: number
  preparationPrice: number
}
const hp = createColumnHelper<Order>()
const columns = [
  hp.accessor("id", { header: "", enableHiding: true }),
  hp.accessor("cardId", { header: "کد" }),
  hp.accessor("orderedAt", {
    header: "سفارش",
    cell(props) {
      return (
        <span className="tracking-wide">
          {format(props.getValue(), "yyyy/MM/dd")}
        </span>
      )
    },
  }),
  hp.accessor("quantity", { header: "تعداد" }),
  hp.accessor("price", {
    header: "فی",
    cell(props) {
      return numberFormat(props.getValue())
    },
  }),
  hp.accessor("preparationPrice", {
    header: "هزینه چاپ",
    cell(props) {
      return numberFormat(props.getValue())
    },
  }),
]
const data = [
  {
    id: 1,
    cardId: "H1230",
    orderedAt: 1767599548625,
    preparationPrice: 300000,
    price: 8400,
    quantity: 150,
  },
] as Array<Order>
function RouteComponent() {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Card className="sm:w-fit mx-4 sm:mx-auto mt-8">
      <CardHeader>
        <CardTitle>سابقه سفارش های مشتری</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : (
                      <div className="text-center">
                        {flexRender(h.column.columnDef.header, h.getContext())}
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
