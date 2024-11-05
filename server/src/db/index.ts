import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'
import * as viewSchema from './viewSchema'

export const client = postgres(env.URL_CONNECTION_DB)
export const db = drizzle(client, { schema: schema, logger: true })

export const clientView = postgres(env.URL_CONNECTION_VIEW)
export const view = drizzle(clientView, { schema: viewSchema, logger: true })
