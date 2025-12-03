import crypto from 'node:crypto'
import { RefreshToken } from '~/models/schemas/refreshToken'

export const generateRefreshTokenData = (userId: number, token: string): RefreshToken => {
  return {
    token: hashRefreshToken(token),
    userId,
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime() // 30 days
  }
}

export const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex')
}
