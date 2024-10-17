import bcrypt from 'bcrypt'
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { login } from '../../functions/login'

export const LoginRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/login',
    {
      schema: {
        summary: 'Login',
        tags: ['Autenticação'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
              userId: z.string().cuid2(),
              name: z.string(),
              email: z.string().email(),
              position: z.string(),
              idCostumer: z.number(),
              tradeName: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { user: userData } = await login(email)

      const isPasswordValid = await bcrypt.compare(password, userData.password)

      if (!isPasswordValid) throw new Error('Dados incorretos!')

      const token = app.jwt.sign({ userId: userData.userId })

      const { password: _, ...user } = userData

      return reply
        .status(200)
        .setCookie('token', token, {
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 3600 * 8,
        })
        .send({ user })
    }
  )
}
