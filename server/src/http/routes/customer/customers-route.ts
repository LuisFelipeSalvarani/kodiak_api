import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllCustomerGroupsRoute } from './get-all-customer-groups'
import { getAllCustomersRoute } from './get-all-customers'
import { getCustomerProductsHistoryRoute } from './get-customer-products-history'

export const customersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllCustomersRoute)
  await app.register(getAllCustomerGroupsRoute)
  await app.register(getCustomerProductsHistoryRoute)
}
