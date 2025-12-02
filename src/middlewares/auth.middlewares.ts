import { COOKIE_KEYS } from '~/constants/cookie'
import { getUserById } from '~/services/users.services'
import { createHandler } from '~/utils/create'
import { BackendError } from '~/utils/errors'
import { verifyToken } from '~/utils/jwt'

export function isAuthenticated() {
  return createHandler(async (req, res, next) => {
    const accessToken = req.cookies[COOKIE_KEYS.ACCESS_TOKEN]

    if (!accessToken) {
      throw new BackendError('UNAUTHORIZED', {
        message: 'Token not found'
      })
    }

    const { userId } = verifyToken(accessToken)

    const user = await getUserById(userId)

    if (!user) throw new BackendError('USER_NOT_FOUND')

    res.locals.user = user
    next()
  })
}
