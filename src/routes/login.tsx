import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { z } from "zod"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCardForm } from "@/hooks/manage.card.hook"
import { getSession, signIn, useSession } from "@/lib/auth-client"

export const Route = createFileRoute("/login")({
  async beforeLoad() {
    const { data } = await getSession()
    if (data) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RouteComponent,
})

const schema = z.object({
  email: z.email(),
  password: z.string().min(3),
})
function RouteComponent() {
  const navigate = useNavigate()
  const form = useCardForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: schema,
      onChange: schema,
    },
    async onSubmit(props) {
      const { data, error } = await signIn.email({
        email: props.value.email,
        password: props.value.password,
      })
      if (!error) {
        navigate({ to: "/dashboard" })
      } else {
        toast.error(error.message, { position: "top-center" })
      }
    },
  })
  return (
    <div className="container">
      <Card className="mx-auto mt-8 sm:max-w-md w-full rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.AppField name="email">
              {(f) => <f.TextInput label="Email" />}
            </form.AppField>
            <form.AppField name="password">
              {(f) => <f.TextInput label="Password" password />}
            </form.AppField>
          </form>
        </CardContent>
        <CardFooter className="grid gap-2 justify-items-center">
          <form.AppForm>
            <form.Submit formId="login-form" />
          </form.AppForm>
          <form.Subscribe selector={(s) => s.isFieldsValid}>
            {(valid) => <span>{String(valid)}</span>}
          </form.Subscribe>
          <span>
            Don't have account?{" "}
            <Link className="text-blue-600" to="/signup">
              Signup now
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
