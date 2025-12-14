import express from 'express'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { User } from '~/models/schemas/user'
import { updateUserById } from '~/services/users.services'

export const enable2FA = async (req: express.Request, res: express.Response) => {
  try {
    const user: User = res.locals.user

    const secret = authenticator.generateSecret()
    await updateUserById(user.id, { ...user, twoFASecret: secret })

    const otpAuth = authenticator.keyuri(user.email, 'my-coin', secret)
    const qrCodeUrl = await QRCode.toDataURL(otpAuth)

    res.status(200).json({ qrCodeUrl, secret })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
