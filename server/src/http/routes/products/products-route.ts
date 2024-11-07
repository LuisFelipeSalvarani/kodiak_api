import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProductsDescriptionAndUnitValueRoute } from './get-all-products-description-and-unit-value'

export const productsRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllProductsDescriptionAndUnitValueRoute)
}
