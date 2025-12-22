import express from 'express'
import { getPresignedPutUrl } from '~/controllers/minio/getPresignedUrl.controllers'
import { isAuthenticated } from '~/middlewares/auth.middlewares'

const minioRouter = express.Router()

minioRouter.get('/presignedPutUrl', isAuthenticated(), getPresignedPutUrl)

export default minioRouter
