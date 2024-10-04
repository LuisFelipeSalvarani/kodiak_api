import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { createUserRoute } from './routes/create-user'
import { LoginRoute } from './routes/login'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, { secret: env.SECRET })
app.register(fastifyCookie)
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Kodiak Pocket',
      description: 'Especificações da API para o back-end da aplicação Kodiak Pocket',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.register(createUserRoute)
app.register(LoginRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
