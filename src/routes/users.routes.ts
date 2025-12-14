import express from 'express'
import { addUser, deleteUserById, editUserById, getAllUsers, getUserById } from '~/controllers/users.controllers'
import { isAuthenticated } from '~/middlewares/auth.middlewares'

const userRouter = express.Router()

userRouter.get('/', isAuthenticated(), getAllUsers)
userRouter.get('/id', isAuthenticated(), getUserById)
userRouter.post('/', isAuthenticated(), addUser)
userRouter.put('/', isAuthenticated(), editUserById)
userRouter.delete('/', isAuthenticated(), deleteUserById)

export default userRouter
