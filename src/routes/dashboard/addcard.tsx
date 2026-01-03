import { useUploadFile } from "@better-upload/client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { toast } from "sonner"
import z from "zod"
import { useStore } from "@tanstack/react-form"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "@tanstack/react-pacer"
import { count, eq, sum } from "drizzle-orm"
import { Sigma } from "lucide-react"
import { db } from "@/db"
import { purchases } from "@/db/schema"
import { useCardForm } from "@/hooks/manage.card.hook"
import { Label } from "@/components/ui/label"

const schema = z.object({
  cardId: z.string({ error: "required" }).min(3),
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

const cardIdSchema = z.object({ cardId: z.string().min(3) })

const getCardQuantity = createServerFn()
  .inputValidator(cardIdSchema)
  .handler(async ({ data: { cardId } }) => {
    const r = await db
      .select({ sum: sum(purchases.remaining).mapWith(Number), rows: count() })
      .from(purchases)
      .where(eq(purchases.cardId, cardId))

    return { quantity: r[0]?.sum || 0, rows: r[0]?.rows || 0 }
  })

const searchSchema = z.object({
  cardId: z.string().min(3).optional(),
})
export const Route = createFileRoute("/dashboard/addcard")({
  component: RouteComponent,
  validateSearch: searchSchema,
})

type CardInfo = {
  quantity: number
  timesPurchased: number
}

function RouteComponent() {
  const { cardId } = Route.useSearch()
  const uploader = useUploadFile({ route: "cards" })

  const form = useCardForm({
    defaultValues: {
      cardId: cardId || "",
      quantity: 0,
      price: 0,
      sellingPrice: 0,
      image: new File([], "dummy"),
    },
    validators: {
      onBlur: schema,
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit(props) {
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
    onSubmitInvalid() {},
  })
  const cardIdUserEntered = useStore(form.store, (s) => s.values.cardId)

  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null)
  const debouncedGetCardQuantity = useDebouncedCallback(
    (cardId: string) =>
      getCardQuantity({ data: { cardId } })
        .then((r) => {
          setCardInfo({ quantity: r.quantity, timesPurchased: r.rows })
        })
        .catch((err) => {
          setCardInfo(null)
          console.log({ error: err, where: "calling getCardQuantity" })
        }),
    { wait: 1500 },
  )
  useEffect(() => {
    cardIdSchema.safeParse({ cardId: cardIdUserEntered }).success &&
      debouncedGetCardQuantity(cardIdUserEntered)
  }, [cardIdUserEntered])
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
          {(field) => (
            <>
              <field.TextInput label="Card ID" />
              {cardInfo ? (
                <Label>
                  {cardInfo.timesPurchased > 0 ? (
                    <>
                      <Sigma size={16} />
                      {cardInfo.quantity}
                    </>
                  ) : (
                    <>
                      <Sigma size={16} />
                      <span>New Card</span>
                    </>
                  )}
                </Label>
              ) : null}
            </>
          )}
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
