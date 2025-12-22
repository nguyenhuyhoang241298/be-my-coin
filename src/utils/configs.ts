export const corsOptions = {
  origin: ['http://localhost:3000', 'https://huyhoang.me'],
  credentials: true
}

export const passkeyRPConfigs = {
  rpName: 'Be My Coin',
  rpID: process.env.NODE_ENV === 'production' ? 'huyhoang.me' : 'localhost',
  origin: process.env.NODE_ENV === 'production' ? 'https://huyhoang.me' : 'http://localhost:3000'
}

export const socketConfigs = {
  cors: {
    origin: ['http://localhost:3000', 'https://huyhoang.me']
  }
}
