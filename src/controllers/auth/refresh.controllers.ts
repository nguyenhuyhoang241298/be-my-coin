import express from 'express'
import { COOKIE_KEYS } from '~/constants/cookie'
import { getRefreshToken, updateRefreshToken } from '~/services/refreshToken.services'
import { random } from '~/utils/crypto'
import generateJWTToken, { getTokenTimestamps, verifyJWTIgnoreExpiration } from '~/utils/jwt'
import { RefreshTokenDTO } from './dto'
import { generateRefreshTokenData, hashRefreshToken } from './helper'

export const refreshToken = async (req: express.Request, res: express.Response) => {
  try {
    const dto = RefreshTokenDTO.safeParse(req.cookies)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const { refreshToken, accessToken } = dto.data

    const userId = verifyJWTIgnoreExpiration(accessToken)

    if (!userId) {
      return res.status(403).json({ error: 'Invalid access token' })
    }

    const refreshTokenData = await getRefreshToken(hashRefreshToken(refreshToken), userId)

    if (refreshTokenData.length === 0) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }

    if (refreshTokenData[0].expiredAt < Date.now()) {
      return res.status(403).json({ error: 'Refresh token expired' })
    }

    const newRefreshToken = random()
    const newAccessToken = generateJWTToken(userId)

    const newRefreshTokenData = generateRefreshTokenData(userId, newRefreshToken)

    await updateRefreshToken(userId, newRefreshTokenData)

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.huyhoang.me' : 'localhost'
    } as const
    const expiresAt = getTokenTimestamps(newAccessToken).expiresAt

    res.cookie(COOKIE_KEYS.ACCESS_TOKEN, newAccessToken, cookieOptions)
    res.cookie(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken, cookieOptions)
    res.cookie(COOKIE_KEYS.EXPIRES_AT, expiresAt, cookieOptions)

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: expiresAt
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(500)
  }
}
