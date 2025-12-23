import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/db"
import { orders, purchases } from "@/db/schema"
import { useCardForm } from "@/hooks/manage.card.hook"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { and, eq, gt } from "drizzle-orm"
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

const putNewOrder = createServerFn({ method: "POST" })
  .inputValidator(serverSchema)
  .handler(async ({ data }) => {
    const availableRows = db
      .select({ id: purchases.id, remaining: purchases.remaining })
      .from(purchases)
      .where(and(eq(purchases.cardId, data.cardId), gt(purchases.remaining, 0)))
      .orderBy(purchases.purchaseDate)
      .all()
    db.transaction((tx) => {
      const { lastInsertRowid } = tx.insert(orders).values(data).run()
      const allocated = 0
      while (allocated < data.price) {}
    })

    return availableRows
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
      quantity: 0,
      price: 0,
      preparationPrice: 0,
    },
    validators: {
      onBlur: schema,
      onChange: schema,
    },
    onSubmit(props) {
      mutateAsync(props.value).then((result) => {
        console.log({ result })
      })
    },
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
