import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createCompanyRoute } from './create-company'

export const companiesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(createCompanyRoute)
}
