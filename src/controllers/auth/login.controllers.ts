import express from 'express'
import { authenticator } from 'otplib'
import { insertRefreshToken } from '~/services/refreshToken.services'
import { getUserByEmail } from '~/services/users.services'
import { authentication, random } from '~/utils/crypto'
import generateJWTToken, { getTokenTimestamps } from '~/utils/jwt'
import { UserLogin2FaDTO, UserLoginDTO } from './dto'
import { generateRefreshTokenData } from './helper'

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const dto = UserLoginDTO.safeParse(req.body)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const { email, password } = dto.data

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.sendStatus(400)

    const { salt, password: userPassword, twoFAEnabled, ...other } = users[0]

    const expectedHash = authentication(salt, password)

    if (userPassword !== expectedHash) {
      return res.sendStatus(403)
    }

    if (twoFAEnabled) {
      return res.status(200).json({ message: '2FA is required', code: '2FA_REQUIRED' })
    }

    const refreshToken = random()
    const accessToken = generateJWTToken(other.id)
    const newRefreshTokenData = generateRefreshTokenData(other.id, refreshToken)

    await insertRefreshToken(newRefreshTokenData)

    return res.status(200).json({
      user: other,
      accessToken,
      refreshToken,
      ...getTokenTimestamps(accessToken)
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}

export const loginWith2FA = async (req: express.Request, res: express.Response) => {
  try {
    const dto = UserLogin2FaDTO.safeParse(req.body)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const { email, password, token } = dto.data

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.sendStatus(400)

    const { salt, password: userPassword, twoFAEnabled, twoFASecret, ...other } = users[0]

    const expectedHash = authentication(salt, password)

    if (userPassword !== expectedHash) {
      return res.sendStatus(403)
    }

    if (!twoFAEnabled) {
      return res.status(400).json({ message: '2FA is not enabled for this user' })
    }

    const isValid = authenticator.verify({
      token,
      secret: twoFASecret!
    })
    if (!isValid) return res.status(400).json({ message: 'Invalid 2FA token' })

    const refreshToken = random()
    const accessToken = generateJWTToken(other.id)
    const newRefreshTokenData = generateRefreshTokenData(other.id, refreshToken)

    await insertRefreshToken(newRefreshTokenData)

    return res.status(200).json({
      user: other,
      accessToken,
      refreshToken,
      ...getTokenTimestamps(accessToken)
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
