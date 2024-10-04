import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { createUserRoute } from './routes/create-user'
import { LoginRoute } from './routes/login'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(jwt, { secret: env.SECRET })
app.register(cookie)

app.register(createUserRoute)
app.register(LoginRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
