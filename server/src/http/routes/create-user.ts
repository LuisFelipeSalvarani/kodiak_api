import bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createUser } from '../../functions/create-user'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            userId: z.string().uuid(),
          }),
        },
      },
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
