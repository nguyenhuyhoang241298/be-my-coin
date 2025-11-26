import express from 'express'
import { getUserByEmail } from '~/services/users.services'
import { authentication } from '~/utils/crypto'
import generateToken from '~/utils/jwt'

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.sendStatus(400)

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.sendStatus(400)

    const { salt, password: userPassword, ...other } = users[0]

    const expectedHash = authentication(salt, password)

    if (userPassword !== expectedHash) {
      return res.sendStatus(403)
    }

    return res.status(200).json({
      user: other,
      accessToken: generateToken(other.id)
    })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
