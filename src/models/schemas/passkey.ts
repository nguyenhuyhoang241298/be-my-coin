import {
  bigint,
  boolean,
  index,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varbinary,
  varchar
} from 'drizzle-orm/mysql-core'
import { users } from './user'

export const passkeys = mysqlTable(
  'passkeys',
  {
    id: varchar('id', { length: 512 }).primaryKey(),
    publicKey: varbinary('public_key', { length: 512 }).notNull(),
    userId: serial('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    webauthnUserId: varchar('webauthn_user_id', { length: 512 }).notNull(),
    counter: bigint('counter', { mode: 'number' }).notNull().default(0),
    deviceType: varchar('device_type', { length: 32 }).notNull(),
    backedUp: boolean('backed_up').notNull().default(false),
    transports: text('transports')
  },
  (table) => [
    index('user_id_idx').on(table.userId),
    index('webauthn_user_id_idx').on(table.webauthnUserId),
    uniqueIndex('webauthn_user_unique_idx').on(table.webauthnUserId, table.userId)
  ]
)

export const passkeyRegistrations = mysqlTable('passkey_registrations', {
  userId: serial('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  challenge: varchar('challenge', { length: 512 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  optionUserId: varchar('option_user_id', { length: 512 }).notNull()
})

export const passkeyAuthentication = mysqlTable('passkey_authentications', {
  userId: serial('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  challenge: varchar('challenge', { length: 512 }).notNull(),
  expiresAt: timestamp('expires_at').notNull()
})

export type Passkey = typeof passkeys.$inferSelect
export type NewPasskey = typeof passkeys.$inferInsert
