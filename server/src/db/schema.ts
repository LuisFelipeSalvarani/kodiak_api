import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  idCompany: text('id_company')
    .notNull()
    .references(() => companies.id),
  tradeName: text('trade_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  position: text('position').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const companies = pgTable('companies', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  cnpj: text('cnpj').unique().notNull(),
  companyName: text('company_name').notNull(),
  tradeName: text('trade_name').notNull(),
  cep: text('cep').notNull(),
  street: text('street').notNull(),
  number: text('number').notNull(),
  complement: text('complement'),
  district: text('district').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
