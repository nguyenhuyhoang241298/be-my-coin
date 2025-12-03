import express from 'express'
import { insertRefreshToken } from '~/services/refreshToken.services'
import { getUserByEmail } from '~/services/users.services'
import { authentication, random } from '~/utils/crypto'
import generateJWTToken from '~/utils/jwt'
import { UserLoginDTO } from './dto'
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

    const { salt, password: userPassword, ...other } = users[0]

    const expectedHash = authentication(salt, password)

    if (userPassword !== expectedHash) {
      return res.sendStatus(403)
    }

    const refreshToken = random()
    const newRefreshTokenData = generateRefreshTokenData(other.id, refreshToken)

    await insertRefreshToken(newRefreshTokenData)

    return res.status(200).json({
      user: other,
      accessToken: generateJWTToken(other.id),
      refreshToken
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
