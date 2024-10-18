import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { companies } from '../../db/schema'

interface CreateCompanyRequest {
  cnpj: string
  companyName: string
  tradeName: string
  cep: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
}

export async function createCompany({
  cnpj,
  companyName,
  tradeName,
  cep,
  street,
  number,
  complement,
  district,
  city,
  state,
}: CreateCompanyRequest) {
  const insertCompany = await db
    .insert(companies)
    .values({
      cnpj,
      companyName,
      tradeName,
      cep,
      street,
      number,
      complement,
      district,
      city,
      state,
    })
    .returning()

  const company = insertCompany[0]

  return {
    company,
  }
}
