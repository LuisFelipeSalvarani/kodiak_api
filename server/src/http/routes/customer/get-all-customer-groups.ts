import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllCustomerGroups } from '../../../functions/customer/get-all-customer-groups'
import { authenticate } from '../../../hook/auth-hook'

export const getAllCustomerGroupsRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/groups',
    {
      schema: {
        summary: 'Todos os grupos de clientes cadastrados',
        description: 'Obtém todos os grupos de clientes cadastrados',
        tags: ['Clientes'],
        response: {
          200: z.object({
            allCustomerGroups: z.array(
              z.object({
                idGroup: z.number().nullable(),
                descriptionGroup: z.string().nullable(),
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
      const { allCustomerGroups } = await getAllCustomerGroups()

      if (!allCustomerGroups)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter os grupos de clientes!' })

      return reply.status(200).send({ allCustomerGroups })
    }
  )
}
