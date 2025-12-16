export const corsOptions = {
  origin: ['http://localhost:3000', 'https://huyhoang.me'],
  credentials: true
}

export const passkeyRPConfigs = {
  rpName: 'Be My Coin',
  rpID: process.env.NODE_ENV === 'development' ? 'localhost' : 'huyhoang.me',
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://huyhoang.me'
}
