import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { db } from "@/db"
import { purchases } from "@/db/schema"
import { useCardForm } from "@/hooks/manage.card.hook"
import { useUploadFile } from "@better-upload/client"
import { useForm, useStore } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { count, eq, sum } from "drizzle-orm"
import { toast } from "sonner"
import z from "zod"

const schema = z.object({
  id: z.int().positive(),
  quantity: z.number().min(1, "حداقل یک کارت لازم است"),
  price: z.number().min(1000, "حداقل قیمت باید 1000 باشد"),
  sellingPrice: z.number().min(1000, "حداقل قیمت باید 1000 باشد"),
  remaining: z.number().min(0, "کمتر از 0 نمیشود"),
  image: z
    .file()
    .refine((f) => f.size > 0, "چرا عکسی انتخاب نشده است؟")
    .optional(),
})

const serverSchema = z.object({
  ...schema.omit({ image: true }).shape,
  imageKey: z.string().min(10).optional(),
})
const editCard = createServerFn({ method: "POST" })
  .inputValidator(serverSchema)
  .handler(async ({ data }) => {
    const result = db
      .update(purchases)
      .set({ ...data, id: undefined })
      .where(eq(purchases.id, data.id))
      .run()
    return { msg: `${result.changes} record(s) edited.` }
  })
const getPurchaseInfo = createServerFn()
  .inputValidator(z.object({ id: z.coerce.number().int().positive() }))
  .handler(async ({ data }) => {
    const result = db
      .select()
      .from(purchases)
      .where(eq(purchases.id, data.id))
      .get()
    if (!result) throw Error("Invalid ID")
    return { ...result, purchaseDate: result.purchaseDate.getTime() }
  })

export const Route = createFileRoute("/dashboard/editpurchase/$id")({
  component: RouteComponent,
  async beforeLoad(ctx) {
    const currentValues = await getPurchaseInfo({ data: { id: ctx.params.id } })
    return { currentValues }
  },
  loader(ctx) {
    return ctx.context.currentValues
  },
})

function RouteComponent() {
  const { id, quantity, price, sellingPrice, remaining, imageKey } =
    Route.useLoaderData()
  const uploader = useUploadFile({ route: "cards" })

  const form = useCardForm({
    defaultValues: {
      id,
      quantity,
      price,
      sellingPrice,
      remaining,
      image: undefined,
    } as z.infer<typeof schema>,
    validators: {
      onChange: schema,
    },
    async onSubmit(props) {
      let imageKey = undefined
      if (props.value.image) {
        const res = await uploader.uploadAsync(props.value.image)
        imageKey = res.file.objectInfo.key
      }
      try {
        const { id, price, sellingPrice, quantity, remaining } = props.value
        const result = await editCard({
          data: {
            id,
            price,
            quantity,
            sellingPrice,
            remaining,
            imageKey,
          },
        })
        toast.success(result.msg)
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
  })

  return (
    <Card className="w-full sm:max-w-md mx-auto mt-4 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-right">ویرایش</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          style={{ direction: "rtl" }}
          id="edit-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField name="price">
              {(field) => (
                <Field>
                  <field.TextInput numeric label="قیمت خرید" />
                </Field>
              )}
            </form.AppField>
            <form.AppField name="sellingPrice">
              {(field) => (
                <Field>
                  <field.TextInput numeric label="قیمت فروش" />
                </Field>
              )}
            </form.AppField>

            <form.AppField name="quantity">
              {(field) => (
                <Field>
                  <field.TextInput numeric label="تعداد خرید" />
                </Field>
              )}
            </form.AppField>
            <form.AppField name="remaining">
              {(field) => (
                <Field>
                  <field.TextInput numeric label="باقیمانده خرید" />
                </Field>
              )}
            </form.AppField>
            <form.AppField name="image">
              {(field) => (
                <Field>
                  <field.FileUploader
                    imageKey={imageKey}
                    control={uploader.control}
                  />
                </Field>
              )}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <Field>
            <form.Submit formId="edit-form" label="ثبت تغییرات" />
          </Field>
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
