import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getCustomerProductsHistory } from '../../../functions/customer/get-customer-products-history'
import { authenticate } from '../../../hook/auth-hook'

export const getCustomerProductsHistoryRoute: FastifyPluginAsyncZod =
  async app => {
    app.withTypeProvider<ZodTypeProvider>().get(
      '/:customerId/products/history',
      {
        schema: {
          summary: 'Histórico de produtos do cliente',
          description:
            'Obtém os 5 produtos mais comprados e as últimas 3 compras do cliente',
          tags: ['Clientes'],
          params: z.object({
            customerId: z.string().transform(Number),
          }),
          response: {
            200: z.object({
              customerHistory: z.object({
                idCustomer: z.number(),
                companyName: z.string().nullable(),
                dayThatBuysTheMost: z.unknown(),
                weekThatBuysTheMost: z.unknown(),
                topProducts: z.array(
                  z.object({
                    productId: z.string().nullable(),
                    productDescription: z.string().nullable(),
                    productCount: z.string().nullable(),
                    total: z.string().nullable(),
                  })
                ),
                lastPurchases: z.array(
                  z.object({
                    issueDate: z.string().nullable(),
                    productId: z.string().nullable(),
                    productDescription: z.string().nullable(),
                    quantity: z.string().nullable(),
                    total: z.string().nullable(),
                  })
                ),
                totalLastPurchases: z.string(),
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
        const { customerId } = request.params

        const {
          customer,
          topProducts,
          lastPurchases,
          dayThatBuysTheMost,
          weekThatBuysTheMost,
        } = await getCustomerProductsHistory(customerId)

        if (
          !customer ||
          !topProducts ||
          !lastPurchases ||
          !dayThatBuysTheMost ||
          !weekThatBuysTheMost
        ) {
          return reply.status(400).send({
            message: 'Erro ao buscar histórico de produtos do cliente',
          })
        }

        const totalLastPurchases = lastPurchases
          .reduce((acc, purchase) => {
            const total = Number.parseFloat(purchase.total ?? '0')
            return acc + total
          }, 0)
          .toFixed(2)

        return reply.status(200).send({
          customerHistory: {
            idCustomer: customer.idCustomer,
            companyName: customer.companyName,
            dayThatBuysTheMost: dayThatBuysTheMost.day,
            weekThatBuysTheMost: weekThatBuysTheMost.week,
            topProducts,
            lastPurchases,
            totalLastPurchases: totalLastPurchases.toString(),
          },
        })
      }
    )
  }
