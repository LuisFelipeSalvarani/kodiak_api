import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProductGroupsRoute } from './get-all-product-groups'
import { getAllProductsRoute } from './get-all-products'
import { getProductByIdRoute } from './get-product-by-id'
import { getProductSalesHistoryByIdRoute } from './get-product-sales-history-by-id'
import { getTopCustomersWhoBuyTheProductByIdRoute } from './get-top-customers-who-buy-the-product-by-id'

export const productsRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllProductsRoute)
  await app.register(getAllProductGroupsRoute)
  await app.register(getProductByIdRoute)
  await app.register(getTopCustomersWhoBuyTheProductByIdRoute)
  await app.register(getProductSalesHistoryByIdRoute)
}
