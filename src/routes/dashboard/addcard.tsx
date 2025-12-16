import { useUploadFile } from "@better-upload/client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { toast } from "sonner"
import z from "zod"
import { useCardForm } from "@/hooks/manage.card.hook"
import { purchases } from "@/db/schema"
import { db } from "@/db"

const schema = z.object({
  cardId: z.string().min(3),
  quantity: z.number().min(1),
  price: z.number().min(1000),
  sellingPrice: z.number().min(1000),
  image: z.file().refine((f) => f.size > 0, "Choose a non empty image"),
})

const serverSchema = z.object({
  ...schema.omit({ image: true }).shape,
  imageKey: z.string().min(10),
})

const addNewCard = createServerFn({ method: "POST" })
  .inputValidator(serverSchema)
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
  const uploader = useUploadFile({ route: "cards" })
  const form = useCardForm({
    defaultValues: {
      cardId: "",
      quantity: 50,
      price: 1000,
      sellingPrice: 2000,
      image: new File([], "dummy"),
    },
    validators: {
      onBlur: schema,
      onChange: schema,
    },
    async onSubmit(props) {
      uploader.uploadAsync(props.value.image).then((res) => {
        const imageKey = res.file.objectInfo.key
        // alert(imageKey)
        const { cardId, price, quantity, sellingPrice } = props.value
        addNewCard({
          data: {
            cardId,
            quantity,
            price,
            sellingPrice,
            imageKey,
          },
        }).then(({ msg }) => {
          toast.success(msg, { duration: 1500 })
          form.reset()
        })
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
        <form.AppField name="image">
          {(field) => <field.FileUploader control={uploader.control} />}
        </form.AppField>
        <form.AppForm>
          <form.Submit />
        </form.AppForm>
      </form>
    </div>
  )
}
