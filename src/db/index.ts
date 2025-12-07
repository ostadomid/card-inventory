/* eslint-disable @typescript-eslint/no-namespace */
import 'dotenv/config'

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

import * as schema from './schema.ts'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
    }
  }
}

const sqlite = new Database(process.env.DATABASE_URL)
export const db = drizzle(sqlite, { schema })
