import bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod, ZodTypeProvider } from 'fastify-type-provider-zod'
import { string, z } from 'zod'
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
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            userId: string().cuid2()
          })
        }
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { email, password } = request.body

      const salt = await bcrypt.genSalt(10)
      const enpryptedPassword = await bcrypt.hash(password, salt)

      const { user } = await createUser({
        email,
        password: enpryptedPassword,
      })

      return reply.status(201).send({ userId: user.id })
    }
  )
}
