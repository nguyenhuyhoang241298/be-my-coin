import express from 'express'
import { enable2FA } from '~/controllers/auth/enable2FA.controllers'
import { googleLogin } from '~/controllers/auth/googleLogin.controllers'
import { login, loginWith2FA } from '~/controllers/auth/login.controllers'
import { logout } from '~/controllers/auth/logout.controllers'
import { requestMagicLink, verifyMagicLink } from '~/controllers/auth/magicLink.controllers'
import { refreshToken } from '~/controllers/auth/refresh.controllers'
import { register, verifyRegisterOtp } from '~/controllers/auth/register.controllers'
import { verify2FA } from '~/controllers/auth/verify2FA.controllers'
import { isAuthenticated } from '~/middlewares/auth.middlewares'

const authRouter = express.Router()

// Credential Auth

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/verify-register-otp', verifyRegisterOtp)
authRouter.post('/refresh-token', refreshToken)
authRouter.post('/logout', logout)

// Google OAuth

authRouter.post('/google-login', googleLogin)

// 2FA

authRouter.post('/enable-2fa', isAuthenticated(), enable2FA)
authRouter.post('/verify-2fa', isAuthenticated(), verify2FA)
authRouter.post('/login-2fa', loginWith2FA)

// Magic Link

authRouter.post('/request-magic-link', requestMagicLink)
authRouter.post('/verify-magic-link', verifyMagicLink)

export default authRouter
