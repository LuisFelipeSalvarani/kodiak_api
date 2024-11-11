import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getProductById } from '../../../functions/produtcs/get-product-by-id'

export const getProductByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:idProduct',
    {
      schema: {
        summary: 'Obtém um produto pelo id',
        tags: ['Produtos'],
        params: z.object({
          idProduct: z.string(),
        }),
        response: {
          200: z.object({
            product: z.object({
              idProduct: z.string(),
              descriptionProduct: z.string().nullable(),
              descriptionGroup: z.string().nullable(),
              unitValue: z.string().nullable(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { idProduct } = request.params
      const { product } = await getProductById({ idProduct })

      if (!product) {
        return reply.status(400).send({ message: 'Produto não encontrado' })
      }

      return reply.status(200).send({ product })
    }
  )
}
