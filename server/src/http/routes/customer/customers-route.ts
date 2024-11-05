import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllcustomersRoute } from './get-all-customers'
import { getCustomerProductsHistoryRoute } from './get-customer-products-history'

export const customersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllcustomersRoute)
  await app.register(getCustomerProductsHistoryRoute)
}
