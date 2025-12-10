import express from 'express'
import { googleLogin } from '~/controllers/auth/googleLogin.controllers'
import { login } from '~/controllers/auth/login.controllers'
import { logout } from '~/controllers/auth/logout.controllers'
import { refreshToken } from '~/controllers/auth/refresh.controllers'
import { register, verifyRegisterOtp } from '~/controllers/auth/register.controllers'

const authRouter = express.Router()

// Credential Auth

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/verify-register-otp', verifyRegisterOtp)
authRouter.post('/refresh-token', refreshToken)
authRouter.post('/logout', logout)

// Google OAuth

authRouter.post('/google-login', googleLogin)

export default authRouter
