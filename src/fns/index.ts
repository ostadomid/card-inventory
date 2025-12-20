import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth"

export const getSessionFN = createServerFn().handler(async () => {
  const result = await auth.api.getSession({ headers: getRequestHeaders() })
  return { session: result?.session }
})
