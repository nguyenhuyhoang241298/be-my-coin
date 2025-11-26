import express from 'express'
import { sendEmail } from '~/services/email.services'
import { getUserByEmail, insertUser, updateUserById } from '~/services/users.services'
import { authentication, generateOTP, random } from '~/utils/crypto'
import { NewUserDTO, OtpDTO } from './dto'

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
    const otp = generateOTP()

    const user = await insertUser({
      fullName,
      phone,
      email,
      password: authentication(salt, password),
      salt,
      isEmailVerified: false,
      otp
    })

    await sendEmail({
      to: email,
      subject: 'Verify Email',
      html: `<h1>Your OTP is: ${otp}</h1>`
    })

    return res.status(200).json(user)
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}

export const verifyRegisterOtp = async (req: express.Request, res: express.Response) => {
  try {
    const dto = OtpDTO.safeParse(req.body)

    if (!dto.success) {
      return res.status(400).json({ error: dto.error })
    }

    const { otp, email } = dto.data

    const usersExisted = await getUserByEmail(email)

    if (!usersExisted || usersExisted.length === 0) return res.sendStatus(400)

    const user = usersExisted[0]

    const isValidOtp = user.otp === otp

    if (!isValidOtp) return res.sendStatus(400)

    await updateUserById(user.id, { ...user, isEmailVerified: true })

    return res.status(200).json({ success: 'Verify successfully' })
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
