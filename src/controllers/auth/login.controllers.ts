import express from 'express'
import { getUserByEmail } from '~/services/users.services'
import { authentication } from '~/utils/crypto'
import generateToken from '~/utils/jwt'
import { UserLoginDTO } from './dto'

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

    const accessToken = generateToken(other.id)

    return res.status(200).json({
      user: other,
      accessToken
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
