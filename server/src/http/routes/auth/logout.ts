import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticate } from '../../../hook/auth-hook'

export const logoutRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/logout',
    {
      schema: {
        summary: 'Logout',
        tags: ['Autenticação'],
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
        security: [
          {
            CookieAuth: [],
          },
        ],
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
