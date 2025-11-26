import { boolean, mysqlTable, serial, text, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
  email: varchar('email', { length: 256 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  salt: text('salt').notNull(),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  otp: varchar('otp', { length: 6 }).notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
