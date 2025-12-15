import express from 'express'
import { sendEmail } from '~/services/email.services'
import { insertRefreshToken } from '~/services/refreshToken.services'
import { getUserByEmail } from '~/services/users.services'
import { random } from '~/utils/crypto'
import generateJWTToken, { getTokenTimestamps, verifyJWTToken } from '~/utils/jwt'
import { RequestMagicLinkDTO, VerifyMagicLinkDTO } from './dto'
import { generateRefreshTokenData } from './helper'

export const requestMagicLink = async (req: express.Request, res: express.Response) => {
  try {
    const dto = RequestMagicLinkDTO.safeParse(req.body)

    if (!dto.success) {
      return res.status(400).json({ message: 'Invalid request data' })
    }

    const email = dto.data.email

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.status(400).json({ message: 'User not found' })

    const user = users[0]

    const accessToken = generateJWTToken(user.id)
    const domain = process.env.NODE_ENV === 'production' ? 'https://huyhoang.me' : 'http://localhost:3000'
    const magicLink = `${domain}/login?token=${accessToken}&email=${encodeURIComponent(email)}`

    await sendEmail({
      to: email,
      subject: 'Login Magic Link',
      html: `<h1>Your magic link is: ${magicLink}</h1>`
    })

    res.status(200).json({ message: 'Magic link sent to email' })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const verifyMagicLink = async (req: express.Request, res: express.Response) => {
  try {
    const dto = VerifyMagicLinkDTO.safeParse(req.body)

    if (!dto.success) {
      return res.status(400).json({ message: 'Invalid request data' })
    }

    const { email, accessToken } = dto.data

    const { userId } = verifyJWTToken(accessToken)

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.status(400).json({ message: 'User not found' })

    const { salt, password: userPassword, twoFAEnabled, ...other } = users[0]

    if (other.id !== userId) {
      return res.status(403).json({ message: 'Invalid token for the given email' })
    }

    const refreshToken = random()
    const newRefreshTokenData = generateRefreshTokenData(other.id, refreshToken)

    await insertRefreshToken(newRefreshTokenData)

    return res.status(200).json({
      user: other,
      accessToken,
      refreshToken,
      ...getTokenTimestamps(accessToken)
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
