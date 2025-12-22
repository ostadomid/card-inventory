import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCardForm } from "@/hooks/manage.card.hook"
import { createFileRoute } from "@tanstack/react-router"
import z from "zod"

export const Route = createFileRoute("/dashboard/sellcard")({
  component: RouteComponent,
})

const schema = z.object({
  orderAt: z.date(),
  quantity: z.int().min(1),
  price: z.number().min(1000),
})

function RouteComponent() {
  const form = useCardForm({
    defaultValues: {
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
