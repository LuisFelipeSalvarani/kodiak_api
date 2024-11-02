import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { salesByCostumerRoute } from './get-sales-by-costumer'
import { getSalesByDaysOfTheLastWeekRoute } from './get-sales-by-days-of-the-last-week'
import { salesByProductGroupRoute } from './get-sales-by-products-group'
import { topSellingProductsRoute } from './get-top-selling-products'

export const salesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(salesByCostumerRoute)
  await app.register(salesByProductGroupRoute)
  await app.register(topSellingProductsRoute)
  await app.register(getSalesByDaysOfTheLastWeekRoute)
}
