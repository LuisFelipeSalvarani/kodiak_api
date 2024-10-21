import { eq } from 'drizzle-orm'
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../../db'
import { companies } from '../../../db/schema'
import { createCompany } from '../../../functions/company/create-company'
import { authenticate } from '../../../hook/auth-hook'

export const createCompanyRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '',
    {
      schema: {
        summary: 'Cadastro de usuário',
        tags: ['Empresa'],
        body: z.object({
          cnpj: z.string(),
          companyName: z.string(),
          tradeName: z.string(),
          cep: z.string(),
          street: z.string(),
          number: z.number(),
          complement: z.string(),
          district: z.string(),
          city: z.string(),
          state: z.string(),
        }),
        response: {
          201: z.object({
            companyId: z.string().cuid2(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        security: [
          {
            CookieAuth: [],
          },
        ],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const {
        cnpj,
        companyName,
        tradeName,
        cep,
        street,
        number,
        complement,
        district,
        city,
        state,
      } = request.body

      const companyExists = await db
        .select()
        .from(companies)
        .where(eq(companies.cnpj, cnpj))

      if (!companyExists)
        return reply.status(400).send({ message: 'CNPJ já cadastrado' })

      const { company } = await createCompany({
        cnpj: cnpj.replace(/[^\d]/g, ''),
        companyName,
        tradeName,
        cep: cep.replace(/[^\d]/g, ''),
        street,
        number,
        complement,
        district,
        city,
        state,
      })

      return reply.status(201).send({ companyId: company.id })
    }
  )
}
