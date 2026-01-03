import { useStore } from "@tanstack/react-form"
import { useRef, useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { UploadButton } from "./upload-button"
import { Field, FieldError, FieldLabel } from "./ui/field"
import type { UploadHookControl } from "@better-upload/client"
import { useFieldContext, useFormContext } from "@/hooks/manage.cad.context"
import { cn } from "@/lib/utils"
import { Calendar } from "./ui/calendar"
import { format } from "date-fns-jalali"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { useQuery } from "@tanstack/react-query"

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
type ComboInputProps = {
  label: string
  items: Array<string> | (() => Promise<Array<string>>)
}
export function ComboInput({ label, items }: ComboInputProps) {
  // const [buttonLabel, setButtonLabel] = useState(label)
  const field = useFieldContext<string>()

  const [open, setOpen] = useState(false)
  const { data, isFetching } = useQuery({
    queryKey: [`${field.name}-items`],
    queryFn: async () => {
      if (typeof items === "function") {
        return await items()
      } else if (Array.isArray(items)) {
        return items
      }
      return ["Invalid Data Provided"]
    },
  })
  const errors = useStore(
    field.store,
    (s) => s.meta.errorMap.onChange || s.meta.errorMap.onBlur,
  )
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>
            {isFetching
              ? "Loading..."
              : field.state.value.length > 0
                ? field.state.value
                : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="search for card id" />
            <CommandEmpty>Card ID Not Found!</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data?.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onBlur={field.handleBlur}
                    onSelect={(e) => {
                      field.handleChange(e)
                      setOpen(false)
                    }}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FieldError errors={errors} />
    </Field>
  )
}

export function CalendarInput() {
  const field = useFieldContext<Date | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field data-invalid={isInvalid}>
      <Calendar
        mode="single"
        formatters={{
          formatWeekdayName(weekday) {
            return format(weekday, "EEEEE")
          },
        }}
        onDayBlur={field.handleBlur}
        selected={field.state.value}
        onSelect={(e) => {
          field.handleChange(e)
        }}
        aria-invalid={isInvalid}
      />
    </Field>
  )
}

type InputProps = {
  label: string
  numeric?: boolean
  password?: boolean
  readonly?: boolean
}
export function TextInput({
  label,
  numeric = false,
  password = false,
  readonly = false,
}: InputProps) {
  const field = useFieldContext<string | number>()
  const errors = useStore(field.store, (s) => s.meta.errors)
  const isInvalid = useStore(
    field.store,
    (s) => s.meta.isTouched && !s.meta.isValid,
  )

  return (
    <div className="space-y-2">
      <Label className="flex flex-col gap-y-2 items-start">
        <span>{label}</span>
        <Input
          type={numeric ? "number" : password ? "password" : "text"}
          readOnly={readonly}
          name={field.name}
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
      {isInvalid && <FieldError errors={errors} />}
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

export function Submit({
  label = "Submit",
  formId,
}: {
  label?: string
  formId?: string
}) {
  const form = useFormContext()
  const [isFormValid, isSubmitting, canSubmit] = useStore(form.store, (s) => [
    s.isFieldsValid,
    s.isSubmitting,
    s.canSubmit,
  ])
  return (
    <Button
      disabled={!canSubmit}
      type="submit"
      form={formId}
      className="block mx-auto disabled:bg-gray-400"
    >
      {isSubmitting ? "Wait..." : label}
    </Button>
  )
}

type FileUploaderProps = {
  control: UploadHookControl<false>
  imageKey?: string
}
export function FileUploader({ control, imageKey }: FileUploaderProps) {
  const preview = useRef(null)
  const field = useFieldContext<File | undefined | null>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const size = useStore(field.store, (s) => s.value?.size || 0)
  // const badSize = field.state.value.size
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor="photo-uploader">Card Photo</FieldLabel>
      <img
        alt="preview"
        src={
          imageKey
            ? `http://localhost:9000/card-inventory/${imageKey}`
            : undefined
        }
        ref={preview}
        className={cn({ hidden: !imageKey && size <= 0 })}
        onLoad={(e) => {
          // const img = e.target as HTMLImageElement
          // const canvas = document.createElement("canvas")
          // canvas.height = img.naturalHeight
          // canvas.width = img.naturalWidth
          // canvas.getContext("2d")?.drawImage(img, 0, 0)
          // canvas.toBlob((blob) => {
          //   field.setValue(new File(blob ? [blob] : [], "alaki.png"))
          // })
        }}
      />

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
