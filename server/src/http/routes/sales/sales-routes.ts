import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { salesByCostumerRoute } from './sales-by-costumer'
import { salesByProductGroupRoute } from './sales-by-products-group'

export const salesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(salesByCostumerRoute)
  await app.register(salesByProductGroupRoute)
}
