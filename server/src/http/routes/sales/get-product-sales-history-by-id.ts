import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getProductSalesHistoryById } from '../../../functions/sales/get-product-sales-history-by-id'
import { authenticate } from '../../../hook/auth-hook'

export const getProductSalesHistoryByIdRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/history/product/:idProduct',
      {
        schema: {
          summary: 'Obtém o histórico de vendas de um produto pelo id',
          tags: ['Vendas'],
          description: 'Obtém o histórico de vendas de um produto pelo id',
          params: z.object({ idProduct: z.string() }),
          response: {
            200: z.object({
              productSalesHistory: z.array(
                z.object({
                  year: z.number(),
                  month: z.number(),
                  countSales: z.number(),
                  totalUnitSales: z.string().nullable(),
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
        const { idProduct } = request.params
        const { productSalesHistory } =
          await getProductSalesHistoryById(idProduct)

        if (!productSalesHistory) {
          return reply.status(400).send({ message: 'Produto não encontrado' })
        }

        return reply.status(200).send({ productSalesHistory })
      }
    )
  }
