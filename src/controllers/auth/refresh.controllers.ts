import express from 'express'
import { getRefreshToken, updateRefreshToken } from '~/services/refreshToken.services'
import { random } from '~/utils/crypto'
import generateJWTToken, { verifyJWTIgnoreExpiration } from '~/utils/jwt'
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
      return res.sendStatus(403).json({ error: 'Invalid access token' })
    }

    const refreshTokenData = await getRefreshToken(hashRefreshToken(refreshToken), userId)

    if (refreshTokenData.length === 0) {
      return res.sendStatus(403).json({ error: 'Invalid refresh token' })
    }

    if (refreshTokenData[0].expiredAt < Date.now()) {
      return res.sendStatus(403).json({ error: 'Refresh token expired' })
    }

    const newToken = random()

    const newRefreshTokenData = generateRefreshTokenData(userId, newToken)

    await updateRefreshToken(userId, newRefreshTokenData)

    res.status(200).json({
      accessToken: generateJWTToken(userId),
      refreshToken: newToken
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(500)
  }
}
