import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { salesByCustomer } from '../../../functions/sales/get-sales-by-customer'
import { authenticate } from '../../../hook/auth-hook'

export const salesBycustomerRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/by/customer',
    {
      schema: {
        summary: 'Relatório de vendas por cliente',
        description:
          'Obtém o total de vendas por clientes, incluindo o valor total e quantidade de produtos vendidos',
        tags: ['Vendas'],
        response: {
          200: z.object({
            report: z.array(
              z.object({
                idcustomer: z.number().nullable(),
                companyName: z.string().nullable(),
                totalProducts: z.string().nullable(),
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
      const { report } = await salesByCustomer()

      if (!report)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter o relatório!' })

      return reply.status(200).send({ report })
    }
  )
}
