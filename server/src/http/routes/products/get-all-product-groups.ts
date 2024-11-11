import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProductGroups } from '../../../functions/produtcs/get-all-product-groups'
import { authenticate } from '../../../hook/auth-hook'

export const getAllProductGroupsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/groups',
    {
      schema: {
        summary: 'Obtém todos os grupos de produtos',
        description: 'Obtém todos os grupos de produtos',
        tags: ['Produtos'],
        response: {
          200: z.object({
            allProductGroups: z.array(
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
        onRequest: [authenticate],
      },
    },
    async (_, reply) => {
      const { allProductGroups } = await getAllProductGroups()

      if (!allProductGroups) {
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter os grupos de produtos' })
      }

      return reply.status(200).send({ allProductGroups })
    }
  )
}
