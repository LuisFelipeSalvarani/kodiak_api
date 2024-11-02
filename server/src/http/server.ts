import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { sql } from 'drizzle-orm'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { db, view } from '../db'
import { env } from '../env'
import { authRoutes } from './routes/auth/auth-routes'
import { companiesRoutes } from './routes/companies/companies-routes'
import { costumersRoutes } from './routes/costumer/costumers-route'
import { salesRoutes } from './routes/sales/sales-routes'
import { usersRoutes } from './routes/users/users-routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  sign: {
    expiresIn: '8h',
  },
})

app.register(fastifyCookie)

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Kodiak Sales Manager',
      description:
        'Especificações da API para o backend da aplicação Kodiak Sales Manager',
      version: '1.0.0',
    },
    securityDefinitions: {
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'Cookie HTTP-Only que contém o token JWT de autenticação',
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(usersRoutes, { prefix: '/users' })
app.register(companiesRoutes, { prefix: '/companies' })
app.register(authRoutes, { prefix: '/auth' })
app.register(salesRoutes, { prefix: '/sales' })
app.register(costumersRoutes, { prefix: '/costumers' })

app.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  const dbConnect = await db
    .execute(sql`SELECT 1`)
    .then(() => {
      console.log('Database connected')
    })
    .catch(() => {
      console.log('Failed connect database')
    })

  await view
    .execute(sql`SELECT 1`)
    .then(() => {
      console.log('View connected')
    })
    .catch(() => {
      console.log('Failed connect view')
    })

  console.log('HTTP server running!')
})
