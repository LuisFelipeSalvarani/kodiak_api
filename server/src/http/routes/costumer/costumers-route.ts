import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllCostumersRoute } from './get-all-costumers'

export const costumersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllCostumersRoute)
}