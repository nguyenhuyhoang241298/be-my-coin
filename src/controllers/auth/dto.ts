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

export const UserLogin2FaDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  token: z.string().min(1)
})

export const GoogleLoginDTO = z.string().min(7)

export const Verify2faDTO = z.object({
  token: z.string().min(1)
})

export const OtpDTO = z.object({
  otp: z.string().length(6),
  email: z.string().email()
})

export const RefreshTokenDTO = z.object({
  refreshToken: z.string().min(1),
  accessToken: z.string().min(1)
})

export const LogoutDTO = z.object({
  refreshToken: z.string().min(1),
  accessToken: z.string().min(1)
})
