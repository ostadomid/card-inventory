import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// export const todos = sqliteTable('todos', {
//   id: integer('id', { mode: 'number' }).primaryKey({
//     autoIncrement: true,
//   }),
//   title: text('title').notNull(),
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(
//     sql`(unixepoch())`,
//   ),
// })

export const users = sqliteTable('users', {
  phone: text().primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  password: text(),
  active: integer({ mode: 'boolean' }).default(true),
})
export const cards = sqliteTable('cards', {
  id: text().primaryKey(),
  price: integer({ mode: 'number' }).default(0),
})

export const orders = sqliteTable('orders', {
  id: integer().primaryKey({ autoIncrement: true }),
  price: integer(),
  amount: integer(),
  createdAd: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  by: integer('ordered_by')
    .notNull()
    .references(() => users.phone),
})
