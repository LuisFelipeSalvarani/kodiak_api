import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { salesByProductGroup } from '../../../functions/sales/sales-by-product-group'
import { authenticate } from '../../../hook/auth-hook'

export const salesByProductGroupRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/by/product-group',
    {
      schema: {
        summary: 'Relatório de vendas por grupo de produto',
        description:
          'Obtém o desempenho de vendas por grupo de produto, incluindo o valor total de vendas e total de produtos vendidos',
        tags: ['Vendas'],
        response: {
          200: z.object({
            report: z.array(
              z.object({
                descriptionGroup: z.string().nullable(),
                totalSoldProducts: z.string().nullable(),
                totalValueSales: z.string().nullable(),
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
      const { report } = await salesByProductGroup()

      if (!report)
        return reply
          .status(400)
          .send({ message: 'Não foi possível obter o relatório' })

      return reply.status(200).send({ report })
    }
  )
}
