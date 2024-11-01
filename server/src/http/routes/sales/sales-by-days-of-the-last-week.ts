import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { salesByDaysOfTheLastWeek } from '../../../functions/sales/sales-by-days-of-the-last-week'
import { authenticate } from '../../../hook/auth-hook'

export const getSalesByDaysOfTheLastWeekRoute: FastifyPluginAsyncZod =
  async app => {
    app.withTypeProvider<ZodTypeProvider>().get(
      '/by/days/last/week',
      {
        schema: {
          summary: 'Total de vendas por dia da última semana',
          description: 'Obtém o total de vendas dos últimos 7 dias',
          tags: ['Vendas'],
          response: {
            200: z.object({
              salesByDay: z.array(
                z.object({
                  issueDate: z.string().nullable(),
                  dayOfWeek: z.unknown(),
                  salesCount: z.number(),
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
        const { salesByDay } = await salesByDaysOfTheLastWeek()

        if (!salesByDay)
          return reply
            .status(400)
            .send({ message: 'Não foi possível obter os dados!' })

        return reply.status(200).send({ salesByDay })
      }
    )
  }