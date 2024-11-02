import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { topSellingProducts } from '../../../functions/sales/get-top-selling-products'
import { authenticate } from '../../../hook/auth-hook'

export const topSellingProductsRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/top/selling/products',
    {
      schema: {
        summary: 'Top produtos vendidos',
        description: 'Obtém uma lista com o top 10 produtos mais vendidos',
        tags: ['Vendas'],
        response: {
          200: z.object({
            topProducts: z.array(
              z.object({
                idProduct: z.any(),
                descriptionProduct: z.string().nullable(),
                totalSelling: z.string().nullable(),
                totalSalesValue: z.string().nullable(),
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
      const { topProducts } = await topSellingProducts()

      if (!topProducts)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter a lista!' })

      return reply.status(200).send({ topProducts })
    }
  )
}
