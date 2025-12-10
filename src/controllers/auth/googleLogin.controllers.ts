import express from 'express'
import { DEFAULT_PASSWORD } from '~/constants/secret'
import { getGoogleOauthClient } from '~/services/googleOAuth.services'
import { insertRefreshToken } from '~/services/refreshToken.services'
import { getUserByEmail, insertUserReturnId } from '~/services/users.services'
import { authentication, generateOTP, random } from '~/utils/crypto'
import generateJWTToken, { getTokenTimestamps } from '~/utils/jwt'
import { GoogleLoginDTO } from './dto'
import { generateRefreshTokenData } from './helper'

export const googleLogin = async (req: express.Request, res: express.Response) => {
  try {
    const dto = GoogleLoginDTO.safeParse(req.headers.authorization)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const tokenId = dto.data
    const client = getGoogleOauthClient()

    const ticket = await client.verifyIdToken({
      idToken: tokenId.slice(7),
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()

    if (!payload || payload?.aud !== process.env.GOOGLE_CLIENT_ID || !payload?.email) {
      return res.sendStatus(401)
    }

    const { email, name, picture } = payload

    const existUsers = await getUserByEmail(email)

    let userId: number

    if (!existUsers || existUsers.length === 0) {
      const salt = random()
      const otp = generateOTP()

      const result = await insertUserReturnId({
        fullName: name,
        phone: null,
        email,
        password: authentication(salt, DEFAULT_PASSWORD),
        salt,
        isEmailVerified: true,
        otp,
        image: picture
      })

      userId = result[0].id
    } else {
      userId = existUsers[0].id
    }

    const refreshToken = random()
    const accessToken = generateJWTToken(userId)
    const newRefreshTokenData = generateRefreshTokenData(userId, refreshToken)

    await insertRefreshToken(newRefreshTokenData)

    return res.status(200).json({
      user: {
        id: userId,
        email,
        fullName: name,
        image: picture
      },
      accessToken,
      refreshToken,
      ...getTokenTimestamps(accessToken)
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
