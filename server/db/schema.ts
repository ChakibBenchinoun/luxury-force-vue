import { relations } from 'drizzle-orm'
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { generateId } from 'lucia'

export const user = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(() => generateId(15)),
  email: text('email').unique().notNull(),
  hashedPassword: text('hashed_password').notNull(),
})

// export const domain = sqliteTable('domain', {
//   id: text('id').primaryKey().$defaultFn(() => generateId(15)),
//   domainUrl: text('domain_url').notNull(),
//   transactionId: text('transaction_id').unique(),
//   active: integer('active', { mode: 'boolean' }).notNull().default(false),
//   userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
//   createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
// })
// export const product = sqliteTable('product', {
//   id: text('id').unique().notNull(),
//   name: text('name').notNull(),
//   domainId: text('domain_id').references(() => domain.id, { onDelete: 'cascade' }).notNull(),
// })

export const session = sqliteTable('session', {
  id: text('id').primaryKey().$defaultFn(() => generateId(15)),
  expiresAt: int('expires_at', { mode: 'timestamp' }).notNull(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
})

// export const productRelations = relations(product, ({ one }) => ({
//   domain: one(domain, { fields: [product.domainId], references: [domain.id] }),
// }))

// export const domainRelations = relations(domain, ({ many, one }) => ({
//   products: many(product),
//   user: one(user, { fields: [domain.userId], references: [user.id] }),
// }))

// export const userRelations = relations(user, ({ many }) => ({
//   domains: many(domain),
// }))
