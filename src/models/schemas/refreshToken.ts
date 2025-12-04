import { bigint, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core'
import { users } from './user'

export const refreshTokens = mysqlTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  token: varchar('token', { length: 512 }).notNull(),
  expiredAt: bigint('expired_at', { mode: 'number' }).notNull()
})

export type RefreshToken = typeof refreshTokens.$inferSelect
export type NewRefreshToken = typeof refreshTokens.$inferInsert
