import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSalesReportGroupedByProductGroup } from '../../../functions/sales/get-sales-report-grouped-by-product-group'
import { authenticate } from '../../../hook/auth-hook'

export const getSalesReportGroupedByProductGroupRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/report/grouped/product/group',
      {
        schema: {
          summary: 'Relatório de vendas agrupadas por grupo de produto',
          tags: ['Vendas'],
          response: {
            200: z.object({
              totalSales: z.number(),
              salesGroupedByProductGroup: z.array(
                z.object({
                  idGroup: z.number().nullable(),
                  descriptionGroup: z.string().nullable(),
                  totalSalesGroup: z.number(),
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
        const { totalSales, salesGroupedByProductGroup } =
          await getSalesReportGroupedByProductGroup()

        return reply.status(200).send({
          salesGroupedByProductGroup,
          totalSales,
        })
      }
    )
  }
