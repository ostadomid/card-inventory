import { useFieldContext, useFormContext } from "@/hooks/manage.cad.context"
import { useStore } from "@tanstack/react-form"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
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
