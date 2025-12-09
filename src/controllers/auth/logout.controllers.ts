import express, { CookieOptions } from 'express'
import { COOKIE_KEYS } from '~/constants/cookie'
import { deleteRefreshToken } from '~/services/refreshToken.services'
import { verifyJWTIgnoreExpiration } from '~/utils/jwt'
import { LogoutDTO } from './dto'
import { hashRefreshToken } from './helper'

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const dto = LogoutDTO.safeParse(req.cookies)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const { refreshToken, accessToken } = dto.data

    const userId = verifyJWTIgnoreExpiration(accessToken)

    if (!userId) {
      return res.status(403).json({ error: 'Invalid access token' })
    }

    await deleteRefreshToken(userId, hashRefreshToken(refreshToken))

    const config: CookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.huyhoang.me' : 'localhost'
    }

    res.clearCookie(COOKIE_KEYS.ACCESS_TOKEN, config)
    res.clearCookie(COOKIE_KEYS.REFRESH_TOKEN, config)
    res.clearCookie(COOKIE_KEYS.EXPIRES_AT, config)

    res.status(200).json({
      message: 'Logged out successfully'
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(500)
  }
}
