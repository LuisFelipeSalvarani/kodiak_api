import bcrypt from 'bcrypt'
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { login } from '../../../functions/auth/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login',
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
              name: z.string(),
              email: z.string().email(),
              position: z.union([
                z.literal('Administrador'),
                z.literal('Vendedor'),
              ]),
              idCompany: z.string().cuid2(),
              tradeName: z.string(),
            }),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { user: userData } = await login(email)

      if (!userData)
        return reply.code(401).send({ message: 'Credenciais inválidas!' })

      const isPasswordValid = await bcrypt.compare(password, userData.password)

      if (!isPasswordValid)
        return reply.code(401).send({ message: 'Credenciais inválidas!' })

      const token = app.jwt.sign({ userId: userData.userId })

      const { userId: __, password: _, ...user } = userData

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
