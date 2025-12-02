import crypto from 'node:crypto'

export const authentication = (salt: string, password: string): string => {
  return crypto
    .createHmac('sha256', [salt, password].join('-'))
    .update(process.env.PASSWORD_SECRET ?? '')
    .digest('hex')
}

export const random = () => crypto.randomBytes(128).toString('base64')

export const generateOTP = (): string => {
  const otp = crypto.randomInt(100000, 999999)
  return otp.toString()
}
