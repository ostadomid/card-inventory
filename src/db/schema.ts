import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const purchases = sqliteTable('purchases', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  cardId: text().notNull(),
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  price: integer(),
  sellingPrice:integer("selling_price"),
  quantity: integer(),
  remaining: integer(),
  imageKey: text("image_key")
})

export const allocations = sqliteTable('allocations', {
  id: integer().primaryKey({ autoIncrement: true }),
  orderId: integer()
    .notNull()
    .references(() => orders.id),
  purchaseId: integer()
    .notNull()
    .references(() => purchases.id),
  allocatedAt: integer('allocated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  quantity: integer(),
  sellingPrice:integer("selling_price")
})
export const orders = sqliteTable('orders', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  orderedAt: integer('ordered_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  quantity: integer(),
  price: integer(),
})


