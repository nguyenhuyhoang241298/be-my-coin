import express from 'express'
import authRouter from './auth.route'
import healthRouter from './health'
import userRouter from './users.routes'

const appRouter = express.Router()

appRouter.use('/user', userRouter)
appRouter.use('/auth', authRouter)
appRouter.use('/health', healthRouter)

export default appRouter
