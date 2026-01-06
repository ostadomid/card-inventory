import { ActionCell } from "@/components/ActionCell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/db"
import { allocations, orders, purchases } from "@/db/schema"
import { numberFormat } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { format } from "date-fns-jalali"
import { eq, sql } from "drizzle-orm"

export const Route = createFileRoute("/dashboard/sellhistory")({
  component: RouteComponent,
})

const getSalesHistory = createServerFn().handler(async () => {
  const result = db
    .select({
      id: orders.id,
      cardId: purchases.cardId,
      orderedAt: sql<number>`ordered_at*1000`,
      quantity: orders.quantity,
      price: orders.price,
      preparationPrice: orders.preparationPrice,
    })
    .from(orders)
    .innerJoin(allocations, eq(orders.id, allocations.id))
    .innerJoin(purchases, eq(allocations.purchaseId, purchases.id))
    .groupBy(orders.id)
    .all()

  return result //result.map((e) => ({ ...e, orderedAt: e.orderedAt.getTime() }))
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
  hp.display({
    id: "action",
    cell: (props) => (
      <ActionCell
        id={props.row.original.id}
        onDelete={(id) => Promise.resolve("Ok")}
        onEdit={(id) => {}}
      />
    ),
  }),
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

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ["salehistory"],
    queryFn: getSalesHistory,
  })
  const table = useReactTable({
    columns,
    data: data || [],
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
