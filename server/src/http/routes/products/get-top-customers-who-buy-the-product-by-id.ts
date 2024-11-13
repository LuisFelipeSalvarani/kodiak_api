import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getTopCustomersWhoBuyTheProductById } from '../../../functions/produtcs/get-top-customers-who-buy-the-product-by-id'
import { authenticate } from '../../../hook/auth-hook'

export const getTopCustomersWhoBuyTheProductByIdRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/:idProduct/purchases/top/customers',
      {
        schema: {
          summary: 'Listar os clientes que mais compraram um produto',
          tags: ['Produtos'],
          description:
            'Listar os clientes que mais compraram um produto, com base no ID do produto',
          params: z.object({
            idProduct: z.string(),
          }),
          response: {
            200: z.object({
              topCustomers: z.array(
                z.object({
                  idCustomer: z.number().nullable(),
                  companyName: z.string().nullable(),
                  totalPurchasedProduct: z.string().nullable(),
                  totalPurchases: z.number(),
                })
              ),
            }),
            400: z.object({
              message: z.string(),
            }),
          },
          security: [{ CookieAuth: [] }],
        },
        onRequest: [authenticate],
      },
      async (request, reply) => {
        const { idProduct } = request.params

        const { topCustomers } =
          await getTopCustomersWhoBuyTheProductById(idProduct)

        if (!topCustomers) {
          return reply.status(400).send({
            message: 'Não foi possível fornecer o relatório',
          })
        }

        return reply.status(200).send({
          topCustomers,
        })
      }
    )
  }
