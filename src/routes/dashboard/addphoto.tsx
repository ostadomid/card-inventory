import z from "zod"
import { useUploadFile } from "@better-upload/client"
import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UploadButton } from "@/components/upload-button"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export const Route = createFileRoute("/dashboard/addphoto")({
  component: RouteComponent,
})

const schema = z.object({
  cardId: z.string().min(3, "A valid CardId is required"),
  image: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Choose a valid/non empty file"),
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      cardId: "",
      image: new File([], "alaki"),
    },
    validators: {
      onBlur: schema,
      onChange: schema,
    },
    onSubmit(props) {
      return uploader.uploadAsync(props.value.image).then((r) => {
        toast.success("Saved Successfully")
      })
    },
    onSubmitInvalid(props) {
      console.log("Invalid")
      console.log({ invalidProps: props })
      console.log({
        onChangeErrors: form.state.errorMap.onChange,
        onBlurErrors: form.state.errorMap.onBlur,
      })
    },
  })
  const uploader = useUploadFile({
    route: "cards",
    onError(error) {
      console.log({ error })
    },
    onUploadProgress(data) {
      console.log(data.file.progress)
    },
  })
  return (
    <Card className="w-full sm:max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Upload Card Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form-tanstack-input"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="cardId">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <InputGroup>
                    <InputGroupInput
                      name={field.name}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon>
                      <FieldLabel htmlFor="cardId">Card ID</FieldLabel>
                    </InputGroupAddon>
                  </InputGroup>

                  <FieldError errors={field.state.meta.errorMap.onChange} />
                </Field>
              )}
            </form.Field>

            <form.Field name="image">
              {(field) => (
                <Field>
                  <FieldLabel>Card Image</FieldLabel>
                  <UploadButton
                    accept="image/*"
                    id={field.name}
                    control={uploader.control}
                    uploadOverride={(input) => {
                      form.setFieldValue("image", input)
                      form.validate("change")
                      form.validate("blur")
                    }}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errorMap.onChange} />
                  )}
                </Field>
              )}
            </form.Field>
            {uploader.control.uploadedFile && (
              <img
                className="border rounded-lg w-80 aspect-square object-contain"
                src={`http://localhost:9000/card-inventory/${uploader.control.uploadedFile.objectInfo.key}`}
                alt="uploaded image"
              />
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Field orientation={"horizontal"}>
              <Button
                disabled={isSubmitting}
                type="submit"
                form="form-tanstack-input"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Field>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  )
}
