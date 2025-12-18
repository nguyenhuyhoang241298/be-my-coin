import 'dotenv/config'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import { createServer } from 'node:http'
import path from 'node:path'
import { Server } from 'socket.io'
import appRouter from './routes'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './services/chat.services'
import { corsOptions, socketConfigs } from './utils/configs'
import { errorHandler } from './utils/errors'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')))

// router
app.use('/api/v1/', appRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  errorHandler(err, req, res, next)
})

const server = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, socketConfigs)

io.on('connection', (socket) => {
  console.log('a user connected')
})

server.listen(process.env.PORT, async () => {
  console.log('Server running at port ' + process.env.PORT)
})

export { app, server }
