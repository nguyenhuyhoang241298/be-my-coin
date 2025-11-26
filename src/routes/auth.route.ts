import express from 'express'
import { login } from '~/controllers/auth/login.controllers'
import { register, verifyRegisterOtp } from '~/controllers/auth/register.controllers'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/verify-register-otp', verifyRegisterOtp)

export default authRouter
