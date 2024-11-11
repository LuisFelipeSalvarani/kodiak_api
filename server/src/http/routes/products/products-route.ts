import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProductGroupsRoute } from './get-all-product-groups'
import { getAllProductsRoute } from './get-all-products'

export const productsRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllProductsRoute)
  await app.register(getAllProductGroupsRoute)
}
