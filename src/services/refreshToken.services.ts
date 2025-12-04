import { and, eq } from 'drizzle-orm'
import db from '~/models'
import { NewRefreshToken, refreshTokens } from '~/models/schemas/refreshToken'

export const getRefreshToken = async (refreshToken: string, userId: number) => {
  return db
    .select()
    .from(refreshTokens)
    .where(and(eq(refreshTokens.token, refreshToken), eq(refreshTokens.userId, userId)))
}

export const insertRefreshToken = async (refreshData: NewRefreshToken) => {
  return db.insert(refreshTokens).values(refreshData)
}

export const updateRefreshToken = async (userId: number, refreshData: NewRefreshToken) => {
  return db.update(refreshTokens).set(refreshData).where(eq(refreshTokens.userId, userId))
}
