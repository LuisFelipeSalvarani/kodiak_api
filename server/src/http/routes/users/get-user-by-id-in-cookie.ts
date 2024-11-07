import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getUserByIdInCookie } from '../../../functions/user/get-user-by-id-in-cookie'
import { authenticate } from '../../../hook/auth-hook'

export const getUserByIdInCookieRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '',
    {
      schema: {
        summary: 'Obter usuário pelo id no cookie',
        tags: ['Usuário'],
        response: {
          200: z.object({
            user: z.object({
              name: z.string(),
              email: z.string().email(),
              position: z.string(),
              idCompany: z.string().cuid2(),
              tradeName: z.string(),
            }),
          }),
          400: z.object({
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
    async (request, reply) => {
      const { userId } = request.user as { userId: string }

      const { user } = await getUserByIdInCookie(userId)

      if (!user)
        return reply.status(400).send({ message: 'Usuário não encontrado!' })

      return reply.status(200).send({ user })
    }
  )
}
