import { eq } from 'drizzle-orm'
import db from '~/models'
import { NewPasskey, passkeyRegistrations, passkeys } from '~/models/schemas/passkey'

export const getUserPasskeys = async (userId: number) => {
  return await db.select().from(passkeys).where(eq(passkeys.userId, userId))
}

export const saveUserPasskey = async (passkey: NewPasskey) => {
  await db.insert(passkeys).values(passkey)
}

export const saveUpdatedCounter = async (passkey: { id: string }, newCounter: number) => {
  await db.update(passkeys).set({ counter: newCounter }).where(eq(passkeys.id, passkey.id))
}

export const saveRegistrationChallenge = async (userId: number, challenge: string) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await db
    .insert(passkeyRegistrations)
    .values({ userId, challenge, expiresAt })
    .onDuplicateKeyUpdate({ set: { challenge, expiresAt } })
}

export const getRegistrationChallenge = async (userId: number) => {
  const [record] = await db.select().from(passkeyRegistrations).where(eq(passkeyRegistrations.userId, userId))

  if (!record || new Date(record.expiresAt) < new Date()) {
    return null
  }

  return record.challenge
}

export const deleteRegistrationChallenge = async (userId: number) => {
  await db.delete(passkeyRegistrations).where(eq(passkeyRegistrations.userId, userId))
}
