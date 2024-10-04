import bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { login } from '../../functions/login'

export const LoginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users/login',
    {
      schema: {
        summary: 'Login',
        tags: ['Usuário'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const {
        user: { userId, password: passwordHash },
      } = await login(email)

      const isPasswordValid = await bcrypt.compare(password, passwordHash)

      if (!isPasswordValid) throw new Error('Dados incorretos!')

      const token = app.jwt.sign({ userId })

      return reply
        .status(200)
        .setCookie('token', token, {
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 3600 * 8,
        })
        .send({ message: 'Login com sucesso!' })
    }
  )
}
