import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core'
import { users } from './user'

export const refreshTokens = mysqlTable('refresh_tokens', {
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  token: varchar('token', { length: 512 }).notNull(),
  expiredAt: int('expired_at').notNull()
})

export type RefreshToken = typeof refreshTokens.$inferSelect
export type NewRefreshToken = typeof refreshTokens.$inferInsert
