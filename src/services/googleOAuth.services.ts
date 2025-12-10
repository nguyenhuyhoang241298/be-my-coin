import { OAuth2Client } from 'google-auth-library'

export const getGoogleOauthClient = () => {
  console.log('process.env.GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID)
  console.log('process.env.GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET)
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
}
