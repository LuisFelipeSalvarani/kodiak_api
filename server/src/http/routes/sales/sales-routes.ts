import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getProductSalesHistoryByIdRoute } from './get-product-sales-history-by-id'
import { salesBycustomerRoute } from './get-sales-by-customer'
import { getSalesByDaysOfTheLastWeekRoute } from './get-sales-by-days-of-the-last-week'
import { salesByProductGroupRoute } from './get-sales-by-products-group'
import { topSellingProductsRoute } from './get-top-selling-products'

export const salesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(salesBycustomerRoute)
  await app.register(salesByProductGroupRoute)
  await app.register(topSellingProductsRoute)
  await app.register(getSalesByDaysOfTheLastWeekRoute)
  await app.register(getProductSalesHistoryByIdRoute)
}
