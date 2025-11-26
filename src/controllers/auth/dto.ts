import z from 'zod'

export const NewUserDTO = z.object({
  fullName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6)
})

export const OtpDTO = z.object({
  otp: z.string().length(6),
  email: z.string().email()
})
