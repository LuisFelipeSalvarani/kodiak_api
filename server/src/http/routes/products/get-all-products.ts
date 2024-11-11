import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProducts } from '../../../functions/produtcs/get-all-products'
import { authenticate } from '../../../hook/auth-hook'

export const getAllProductsRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '',
    {
      schema: {
        summary: 'Obtém todos os produtos',
        description: 'Obtém o id do produto, a descrição e o valor unitário',
        tags: ['Produtos'],
        querystring: z.object({
          idGroup: z.coerce.number().optional(),
        }),
        response: {
          200: z.object({
            allProducts: z.array(
              z.object({
                idProduct: z.string(),
                descriptionProduct: z.string().nullable(),
                unitValue: z.string().nullable(),
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
    async (request, reply) => {
      const { idGroup } = request.query

      const { allProducts } = await getAllProducts({
        idGroup,
      })

      if (!allProducts)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter os dados!' })

      return reply.status(200).send({ allProducts })
    }
  )
}
