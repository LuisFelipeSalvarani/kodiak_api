import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllCustomers } from '../../../functions/customer/get-all-customers'
import { authenticate } from '../../../hook/auth-hook'

export const getAllCustomersRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '',
    {
      schema: {
        summary: 'Todos os clientes cadastrados',
        description: 'Obtém todos os clientes cadastrados',
        tags: ['Clientes'],
        response: {
          200: z.object({
            allCustomers: z.array(
              z.object({
                idCustomer: z.number(),
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
      const { allCustomers } = await getAllCustomers()

      if (!allCustomers)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter os clientes!' })

      return reply.status(200).send({ allCustomers })
    }
  )
}
