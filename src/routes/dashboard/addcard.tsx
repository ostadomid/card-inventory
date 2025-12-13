import { db } from "@/db"
import { purchases } from "@/db/schema"
import { useCardForm } from "@/hooks/manage.card.hook"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { GhostIcon } from "lucide-react"
import { toast } from "sonner"
import z from "zod"

const schema = z.object({
  cardId: z.string().min(3),
  quantity: z.number().min(1),
  price: z.number().min(1000),
  sellingPrice: z.number().min(1000),
})

const addNewCard = createServerFn({ method: "POST" })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const result = await db
      .insert(purchases)
      .values({ ...data, remaining: data.quantity })
    return { msg: `${result.changes} record(s) added.` }
  })

export const Route = createFileRoute("/dashboard/addcard")({
  component: RouteComponent,
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
      onChange: schema,
    },
    async onSubmit(props) {
      // console.log(props.value)
      addNewCard({ data: props.value }).then(({ msg }) => {
        toast.success(msg, { duration: 1500 })
        form.reset()
      })
    },
    onSubmitInvalid() {
      ;(
        document.querySelector("input[data-has-error]") as HTMLInputElement
      )?.focus()
    },
  })
  return (
    <div className="w-full max-w-md p-4 mx-auto mt-8">
      <form
        className="space-y-4 px-4 py-8 border rounded-lg border-slate-300 shadow shadow-gray-200 "
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
