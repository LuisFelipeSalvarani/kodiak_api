import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticate } from '../../hook/auth-hook'

export const logoutRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users/logout',
    {
      schema: {
        summary: 'Logout',
        tags: ['Autenticação'],
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
      onRequest: [authenticate],
    },
    async (_, reply) => {
      reply
        .clearCookie('token')
        .status(200)
        .send({ message: 'Logout realizado com sucesso' })
    }
  )
}
