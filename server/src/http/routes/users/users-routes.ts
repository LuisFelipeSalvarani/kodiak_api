import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createUserRoute } from './create-user'
import { getUserByIdInCookieRoute } from './get-user-by-id-in-cookie'

export const usersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(createUserRoute)
  await app.register(getUserByIdInCookieRoute)
}
