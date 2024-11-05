import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllCostumersRoute } from './get-all-costumers'
import { getCustomerProductsHistoryRoute } from './get-customer-products-history'

export const costumersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllCostumersRoute)
  await app.register(getCustomerProductsHistoryRoute)
}
