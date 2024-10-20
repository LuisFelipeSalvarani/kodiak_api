import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { salesByCostumerRoute } from './sales-by-costumer'
import { salesByProductGroupRoute } from './sales-by-products-group'
import { topSellingProductsRoute } from './top-selling-products'

export const salesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(salesByCostumerRoute)
  await app.register(salesByProductGroupRoute)
  await app.register(topSellingProductsRoute)
}
