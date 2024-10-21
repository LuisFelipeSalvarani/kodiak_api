import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { loginRoute } from './login'
import { logoutRoute } from './logout'

export const authRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(loginRoute)
  await app.register(logoutRoute)
}
