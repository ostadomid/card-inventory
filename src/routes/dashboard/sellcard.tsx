import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/db"
import { allocations, orders, purchases } from "@/db/schema"
import { useCardForm } from "@/hooks/manage.card.hook"
import { useStore } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { and, desc, eq, gt, sql } from "drizzle-orm"
import { toast } from "sonner"
import z from "zod"

const schema = z.object({
  cardId: z.string().min(3),
  orderAt: z.date(),
  quantity: z.int().min(1),
  price: z.number().min(1000),
  preparationPrice: z.number().min(1000),
})
type PutOrder = z.infer<typeof schema>

const serverSchema = z.object({
  ...schema.omit({ orderAt: true }).shape,
  orderAt: z.int(),
})

const getCardIDs = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db
    .selectDistinct({ cardId: purchases.cardId })
    .from(purchases)
    .where(gt(purchases.remaining, 0))
  return result.map((e) => e.cardId)
})

const getPriceSchema = z.object({ cardId: z.string().min(3) })
const getCardPrice = createServerFn()
  .inputValidator(getPriceSchema)
  .handler(({ data: { cardId } }) => {
    const result = db
      .select({ price: purchases.sellingPrice })
      .from(purchases)
      .where(and(eq(purchases.cardId, cardId), gt(purchases.remaining, 0)))
      .orderBy(desc(purchases.purchaseDate))
      .get()
    return result?.price || 0
  })

const putNewOrder = createServerFn({ method: "POST" })
  .inputValidator(serverSchema)
  .handler(async ({ data }) => {
    const availableRows = db
      .select({
        id: purchases.id,
        remaining: purchases.remaining,
        sellingPrice: purchases.sellingPrice,
      })
      .from(purchases)
      .where(and(eq(purchases.cardId, data.cardId), gt(purchases.remaining, 0)))
      .orderBy(purchases.purchaseDate)
      .all()
    const totalAvailableQuantity = availableRows.reduce(
      (acc, cur) => acc + (cur.remaining ?? 0),
      0,
    )
    if (data.quantity > totalAvailableQuantity) {
      throw new Error(`موجودی انبار (${totalAvailableQuantity}) کافی نیست`)
    }
    db.transaction((tx) => {
      const { lastInsertRowid: orderId } = tx.insert(orders).values(data).run()
      let allocated = 0
      let current = 0
      while (allocated < data.price && current < availableRows.length) {
        const row = availableRows[current++]
        const taken = Math.min(data.quantity - allocated, row.remaining!)
        allocated += taken
        tx.insert(allocations)
          .values({
            orderId: Number(orderId),
            purchaseId: row.id,
            sellingPrice: row.sellingPrice,
            quantity: taken,
          })
          .run()
        tx.update(purchases)
          .set({ remaining: sql`remaining - ${taken}` })
          .where(eq(purchases.id, row.id))
          .run()
      }
    })

    return { ok: true, message: "Order put successfully" }
  })

export const Route = createFileRoute("/dashboard/sellcard")({
  component: RouteComponent,
})

function RouteComponent() {
  const { mutateAsync } = useMutation({
    mutationFn: async (data: PutOrder) => {
      const result = await putNewOrder({
        data: { ...data, orderAt: data.orderAt.getDate() },
      })
      return result
    },
  })

  const form = useCardForm({
    defaultValues: {
      cardId: "",
      orderAt: new Date(),
      quantity: 100,
      price: 1000,
      preparationPrice: 300000,
    },
    validators: {
      onBlur: schema,
      onChange: schema,
    },
    onSubmit(props) {
      mutateAsync(props.value)
        .then((result) => {
          toast.success(result.message, {
            position: "top-center",
            style: { direction: "rtl" },
          })
          form.reset()
        })
        .catch((err) => {
          toast.error((err as Error).message, {
            position: "top-center",
            style: { direction: "rtl" },
          })
        })
    },
  })
  const selectedCardId = useStore(form.store, (s) => s.values.cardId)

  useQuery({
    queryKey: ["cardId", selectedCardId],
    queryFn: async () => {
      const price = await getCardPrice({ data: { cardId: selectedCardId } })
      form.setFieldValue("price", price)
      return price
    },
    staleTime: Infinity,
    enabled: !!selectedCardId,
  })

  return (
    <Card className="mt-4 shadow-xl rounded-lg w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Print Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          id="order-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppField name="cardId">
            {(field) => (
              <field.ComboInput label="Select a card" items={getCardIDs} />
            )}
          </form.AppField>
          <form.AppField name="orderAt">
            {(field) => (
              <div className="flex justify-center">
                <field.CalendarInput />
              </div>
            )}
          </form.AppField>
          <form.AppField name="quantity">
            {(field) => <field.TextInput label="Quantity" numeric />}
          </form.AppField>
          <div className="flex justify-between gap-4">
            <form.AppField name="price">
              {(field) => <field.TextInput label="Price" numeric />}
            </form.AppField>
            <form.AppField name="preparationPrice">
              {(field) => <field.TextInput label="Preparation Price" numeric />}
            </form.AppField>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <form.Submit formId="order-form" label="Save" />
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
