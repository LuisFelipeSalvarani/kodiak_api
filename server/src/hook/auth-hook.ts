import type { FastifyReply, FastifyRequest } from 'fastify'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const decoded = await request.jwtVerify<{ userId: string }>()

    request.user = decoded
  } catch (err) {
    reply.code(401).send({ error: 'Usuário não autenticado' })
  }
}
