import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import z from "zod"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCardForm } from "@/hooks/manage.card.hook"
import { signUp } from "@/lib/auth-client"

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
})

const signupSchema = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "password and it's confirm are not the same",
    path: ["password"],
  })
function RouteComponent() {
  const navigate = useNavigate()

  const form = useCardForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signupSchema,
      onBlur: signupSchema,
    },
    async onSubmit({ value: { email, password, name } }) {
      const { data, error } = await signUp.email({ name, email, password })
      if (!error) {
        toast.success("Welcome", { position: "top-right" })
        return navigate({ to: "/dashboard" })
      }
      toast.error(error?.message)
    },
  })
  return (
    <Card className="w-full sm:max-w-md mt-4 mx-auto">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="signup-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppField name="name">
            {(f) => <f.TextInput label="Name" />}
          </form.AppField>
          <form.AppField name="email">
            {(f) => <f.TextInput label="Email" />}
          </form.AppField>
          <form.AppField name="password">
            {(f) => <f.TextInput label="Password" password />}
          </form.AppField>
          <form.AppField name="confirmPassword">
            {(f) => <f.TextInput label="Confirm Password" password />}
          </form.AppField>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <form.Submit label="Signup" formId="signup-form" />
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
