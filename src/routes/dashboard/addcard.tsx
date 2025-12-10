import { TextInput } from "@/components/manage.card.components"
import { useCardForm } from "@/hooks/manage.card.hook"
import { createFileRoute } from "@tanstack/react-router"
import z from "zod"

export const Route = createFileRoute("/dashboard/addcard")({
  component: RouteComponent,
})
const schema = z.object({
  cardId: z.string().min(3),
  quantity: z.number().min(1),
  price: z.number().min(1000),
  sellingPrice: z.number().min(1000),
})

function RouteComponent() {
  const form = useCardForm({
    defaultValues: {
      cardId: "",
      quantity: 50,
      price: 1000,
      sellingPrice: 2000,
    },
    validators: {
      onBlur: schema,
    },
    onSubmit(props) {
      console.log(props.value)
    },
  })
  return (
    <div className="w-full max-w-md p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="cardId">
          {(field) => <field.TextInput label="Card ID" />}
        </form.AppField>
        <form.AppField name="quantity">
          {(field) => <field.TextInput label="Quantity" numeric />}
        </form.AppField>
        <form.AppField name="price">
          {(field) => <field.TextInput label="Price" numeric />}
        </form.AppField>
        <form.AppField name="sellingPrice">
          {(field) => <field.TextInput label="Selling Price" numeric />}
        </form.AppField>
        <form.AppForm>
          <form.Submit />
        </form.AppForm>
      </form>
    </div>
  )
}
