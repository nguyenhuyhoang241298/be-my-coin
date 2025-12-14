import express from 'express'
import { authenticator } from 'otplib'
import { User } from '~/models/schemas/user'
import { updateUserById } from '~/services/users.services'
import { Verify2faDTO } from './dto'

export const verify2FA = async (req: express.Request, res: express.Response) => {
  try {
    const user: User = res.locals.user

    if (!user.twoFASecret) {
      return res.status(400).json({ message: '2FA is not enabled for this user' })
    }

    const dto = Verify2faDTO.safeParse(req.body)
    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const isValid = authenticator.verify({
      token: dto.data.token,
      secret: user.twoFASecret
    })
    if (!isValid) return res.status(400).json({ message: 'Invalid 2FA token' })

    await updateUserById(user.id, { ...user, twoFAEnabled: true })

    res.status(200).json({ message: '2FA enabled successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
