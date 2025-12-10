import { useFieldContext, useFormContext } from "@/hooks/manage.cad.context"
import { useStore } from "@tanstack/react-form"

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
}) {
  return (
    <>
      {errors.map((error) => (
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
  const errors = useStore(field.store, (s) => s.meta.errors)
  return (
    <div className="space-y-2">
      <label>
        <span>{label}</span>
        <input
          type={numeric ? "number" : "text"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) =>
            field.handleChange(
              numeric ? Number(e.target.value) : e.target.value,
            )
          }
        />
      </label>
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
    <button disabled={!canSubmit} type="submit">
      {isSubmitting ? "Wait..." : "Submit"}
    </button>
  )
}
