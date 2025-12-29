import { Table, TableHead, TableRow } from "@/components/ui/table"
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import z from "zod"

const schema = z.object({
  name: z.string().min(3),
  email: z.email(),
})
type Person = z.infer<typeof schema>

const h = createColumnHelper<Person>()

const cols = [
  h.accessor("name", {
    header: "Name",
    cell(props) {
      return <span>{props.getValue()}</span>
    },
  }),
]

const table = useReactTable({
  columns: cols,
  data: [{ name: "bob", email: "bob@io.net" }],
  getCoreRowModel: getCoreRowModel(),
  manualSorting: true,
  onSortingChange: (x) => {},
})
const t = (
  <Table>
    {table.getHeaderGroups().map((g) => (
      <TableRow key={g.id}>
        {g.headers.map((h) => (
          <TableHead>
            {h.isPlaceholder
              ? null
              : flexRender(h.column.columnDef.header, h.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </Table>
)
