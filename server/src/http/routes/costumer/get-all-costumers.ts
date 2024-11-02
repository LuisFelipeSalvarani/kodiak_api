import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { any, z } from 'zod'
import { getAllCostumers } from '../../../functions/costumer/get-all-costumers'
import { authenticate } from '../../../hook/auth-hook'

export const getAllCostumersRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '',
    {
      schema: {
        summary: 'Todos os clientes cadastrados',
        description: 'Obtém todos os clientes cadastrados',
        tags: ['Clientes'],
        response: {
          200: z.object({
            allCostumers: z.array(
              z.object({
                idCostumer: z.number(),
                companyName: z.string().nullable(),
              })
            ),
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
    async (_, reply) => {
      const { allCostumers } = await getAllCostumers()

      if (!allCostumers)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter os clientes!' })

      return reply.status(200).send({ allCostumers })
    }
  )
}