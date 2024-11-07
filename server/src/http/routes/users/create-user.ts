import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../../db'
import { companies, users } from '../../../db/schema'
import { createUser } from '../../../functions/user/create-user'
import { authenticate } from '../../../hook/auth-hook'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '',
    {
      schema: {
        summary: 'Cadastro de usuário',
        tags: ['Usuário'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          position: z.union([
            z.literal('Administrador'),
            z.literal('Vendedor'),
          ]),
          idCompany: z.string().cuid2(),
        }),
        response: {
          201: z.object({
            userId: z.string().cuid2(),
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
      const { name, email, password, position, idCompany } = request.body

      const result = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, email))

      const userExists = result[0]

      if (userExists)
        return reply.status(400).send({ message: 'E-mail já cadastrado!' })

      const customer = await db
        .select({
          tradeName: companies.tradeName,
        })
        .from(companies)
        .where(eq(companies.id, idCompany))

      if (customer.length === 0)
        return reply.status(400).send({ message: 'Empresa não encontrada!' })

      const tradeName = customer[0].tradeName ?? ''

      const salt = await bcrypt.genSalt(10)
      const enpryptedPassword = await bcrypt.hash(password, salt)

      const { user } = await createUser({
        name,
        email,
        password: enpryptedPassword,
        position,
        idCompany,
        tradeName,
      })

      return reply.status(201).send({ userId: user.id })
    }
  )
}
