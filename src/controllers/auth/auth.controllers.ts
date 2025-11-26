import express from 'express'
import { getUserByEmail, insertUser } from '~/services/users.services'
import { authentication, random } from '~/utils/crypto'
import generateToken from '~/utils/jwt'
import { NewUserDTO } from './dto'

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

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const dto = NewUserDTO.safeParse(req.body)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const { fullName, phone, email, password } = dto.data

    const usersExisted = await getUserByEmail(email)

    if (!usersExisted || usersExisted.length > 0) return res.sendStatus(400)

    const salt = random()
    const user = await insertUser({
      fullName,
      phone,
      email,
      password: authentication(salt, password),
      salt
    })

    return res.status(200).json(user)
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
