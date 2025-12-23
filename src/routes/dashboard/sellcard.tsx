import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/db"
import { purchases } from "@/db/schema"
import { useCardForm } from "@/hooks/manage.card.hook"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { gt } from "drizzle-orm"
import z from "zod"

const getCardIDs = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db
    .selectDistinct({ cardId: purchases.cardId })
    .from(purchases)
    .where(gt(purchases.remaining, 0))
  return result.map((e) => e.cardId)
})

export const Route = createFileRoute("/dashboard/sellcard")({
  component: RouteComponent,
})

const schema = z.object({
  cardId: z.string().min(3),
  orderAt: z.date(),
  quantity: z.int().min(1),
  price: z.number().min(1000),
})

function RouteComponent() {
  const form = useCardForm({
    defaultValues: {
      cardId: "",
      orderAt: new Date(),
      quantity: 0,
      price: 0,
    },
    validators: {
      onBlur: schema,
      onChange: schema,
    },
    onSubmit(props) {
      console.log({ submittedValues: props.value })
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
          <form.AppField name="price">
            {(field) => <field.TextInput label="Price" numeric />}
          </form.AppField>
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
