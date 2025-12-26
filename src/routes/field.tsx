import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  BadgeDollarSign,
  ChevronsUpDown,
  DollarSign,
  LucideSquareDashedMousePointer,
  Sigma,
} from "lucide-react"
import { useState } from "react"
import z from "zod"

export const Route = createFileRoute("/field")({
  component: RouteComponent,
})

const schema = z.object({
  cardId: z.string().min(3),
  quantity: z.int().min(1),
})
const items: Array<{ cardId: string; price: number; quantity: number }> = [
  { cardId: "H1230", price: 6500, quantity: 315 },
  { cardId: "H1000", price: 7500, quantity: 30 },
  { cardId: "AL428", price: 8500, quantity: 200 },
  { cardId: "M545", price: 12500, quantity: 455 },
]
function RouteComponent() {
  const [isPopOpen, setIsPopOpen] = useState(false)
  const form = useForm({
    defaultValues: {
      cardId: "",
      quantity: 0,
    },
    validators: {
      onSubmit: schema,
    },
  })
  return (
    <>
      <Card className="w-full sm:max-w-md mx-auto mt-8 shadow-xl">
        <CardHeader>
          <CardTitle>Field Component Playground</CardTitle>
          <CardDescription>
            Here we inspcet different components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="simple-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name="cardId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <Popover open={isPopOpen} onOpenChange={setIsPopOpen}>
                        <PopoverTrigger aria-invalid={isInvalid} asChild>
                          <Button className="max-w-fit" variant={"outline"}>
                            {field.state.value || "Select Card"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Command>
                            <CommandInput />
                            <CommandEmpty>Nothing found</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={(e) => {
                                    field.handleChange(e)
                                    setIsPopOpen(false)
                                  }}
                                  value="H1230"
                                >
                                  H-1230
                                </CommandItem>
                                <CommandItem
                                  onSelect={(e) => {
                                    field.handleChange(e)
                                    setIsPopOpen(false)
                                  }}
                                  value="AL428"
                                >
                                  AL-428
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="quantity">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="quantity"
                          aria-invalid={isInvalid}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(Number(e.target.value))
                          }}
                          onBlur={field.handleBlur}
                        />
                        <InputGroupAddon>
                          <Sigma />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <form.Subscribe selector={(s) => s.isFormValid}>
            {(valid) => (
              <Button form="simple-form" type="submit" disabled={!valid}>
                Add
              </Button>
            )}
          </form.Subscribe>
          <Field></Field>
        </CardFooter>
      </Card>
    </>
  )
}
