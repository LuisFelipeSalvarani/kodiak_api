import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { string, z } from 'zod'
import { view } from '../../db'
import { costumers } from '../../db/viewSchema'
import { createUser } from '../../functions/create-user'
import { authenticate } from '../../hook/auth-hook'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Cadastrado de usuário',
        tags: ['Usuário'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          position: z.string(),
          idCostumer: z.number(),
        }),
        response: {
          201: z.object({
            userId: z.string().cuid2(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
      // onRequest: [authenticate],
    },
    async (request, reply) => {
      const { name, email, password, position, idCostumer } = request.body

      const costumer = await view
        .select({
          tradeName: costumers.tradeName,
        })
        .from(costumers)
        .where(eq(costumers.idCustomer, idCostumer))

      if (costumer.length === 0)
        return reply.status(400).send({ error: 'Empresa não encontrada!' })

      const tradeName = costumer[0].tradeName ?? ''

      const salt = await bcrypt.genSalt(10)
      const enpryptedPassword = await bcrypt.hash(password, salt)

      const { user } = await createUser({
        name,
        email,
        password: enpryptedPassword,
        position,
        idCostumer,
        tradeName,
      })

      return reply.status(201).send({ userId: user.id })
    }
  )
}
