import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProductsDescriptionAndUnitValue } from '../../../functions/produtcs/get-all-products-description-and-unit-value'
import { authenticate } from '../../../hook/auth-hook'

export const getAllProductsDescriptionAndUnitValueRoute: FastifyPluginAsyncZod =
  async app => {
    app.withTypeProvider<ZodTypeProvider>().get(
      '/description/and/unit/value',
      {
        schema: {
          summary: 'Obtém todos os produtos e seu valor unitário',
          description:
            'Obtém o id do produto, a descrição e o valor unitário, apenas de produtos que contenham valor unitário',
          tags: ['Produtos'],
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
      async (_, reply) => {
        const { allProducts } = await getAllProductsDescriptionAndUnitValue()

        if (!allProducts)
          return reply
            .status(400)
            .send({ message: 'Não foi possível obter os dados!' })

        return reply.status(200).send({ allProducts })
      }
    )
  }
