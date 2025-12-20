import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { db } from "../db"

export const auth = betterAuth({
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  database: drizzleAdapter(db, { provider: "sqlite" }),
  plugins: [tanstackStartCookies()],
})
