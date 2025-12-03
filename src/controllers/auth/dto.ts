import z from 'zod'

export const NewUserDTO = z.object({
  fullName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6)
})

export const UserLoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const OtpDTO = z.object({
  otp: z.string().length(6),
  email: z.string().email()
})

export const RefreshTokenDTO = z.object({
  refreshToken: z.string().min(1),
  accessToken: z.string().min(1)
})
