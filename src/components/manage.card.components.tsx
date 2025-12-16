import { useStore } from "@tanstack/react-form"
import { Activity, useRef } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { UploadButton } from "./upload-button"
import { Field, FieldError, FieldLabel } from "./ui/field"
import type { UploadHookControl } from "@better-upload/client"
import { useFieldContext, useFormContext } from "@/hooks/manage.cad.context"
import { cn } from "@/lib/utils"

function ErrorMessages({
  errors,
}: {
  errors?: Array<string | { message: string }>
}) {
  return (
    <>
      {errors?.map((error) => (
        <div
          key={typeof error === "string" ? error : error.message}
          className="text-red-500 mt-1 font-bold"
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  )
}

type InputProps = {
  label: string
  numeric?: boolean
}
export function TextInput({ label, numeric = false }: InputProps) {
  const field = useFieldContext<string | number>()
  const errors = useStore(
    field.store,
    (s) => s.meta.errorMap.onChange || s.meta.errorMap.onBlur,
  )
  console.log({ errors })
  return (
    <div className="space-y-2">
      <Label className="flex flex-col gap-y-2 items-start">
        <span>{label}</span>
        <Input
          type={numeric ? "number" : "text"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) =>
            field.handleChange(
              numeric ? Number(e.target.value) : e.target.value,
            )
          }
          data-has-error={errors?.length > 0}
        />
      </Label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {/* {field.state.meta.isTouched && errors && errors.length > 0 && (
        <ul className="text-red-600">
          {errors.map((err, idx) => (
            <li key={idx}>{err.message}</li>
          ))}
        </ul>
      )} */}
    </div>
  )
}

export function Submit() {
  const form = useFormContext()
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)
  const canSubmit = useStore(form.store, (s) => s.canSubmit)
  return (
    <Button
      disabled={!canSubmit}
      type="submit"
      className="block mx-auto disabled:bg-gray-400"
    >
      {isSubmitting ? "Wait..." : "Submit"}
    </Button>
  )
}

type FileUploaderProps = {
  control: UploadHookControl<false>
}
export function FileUploader({ control }: FileUploaderProps) {
  const preview = useRef(null)
  const field = useFieldContext<File>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const badSize = field.state.value.size
  const size = useStore(field.store, (s) => s.value.size)
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor="photo-uploader">Card Photo</FieldLabel>
      <p>Size = {size}</p>
      <p>Bad Size = {badSize}</p>

      <img alt="preview" ref={preview} className={cn({ hidden: size <= 0 })} />

      <UploadButton
        id="photo-uploader"
        control={control}
        uploadOverride={(file) => {
          field.setValue(file)
          field.handleChange(file)
          field.handleBlur()
          ;(preview.current as unknown as HTMLImageElement).src =
            URL.createObjectURL(file)
        }}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
