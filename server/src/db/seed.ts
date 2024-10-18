import { client, db } from '.'
import { companies, users } from './schema'

async function seed() {
  await db.delete(users)
  await db.delete(companies)

  await db.insert(companies).values({
    id: 'e5yu6dtaw4sgaw3bj0r2cyb7',
    cnpj: '3649461900014',
    companyName: 'Kodiak Sales Manager',
    tradeName: 'KSM',
    cep: '13972370',
    street: 'Rua Vitor Meirelles',
    number: 107,
    complement: '',
    district: 'Cubatão',
    city: 'Itapira',
    state: 'SP',
  })

  await db
    .insert(users)
    .values({
      id: 'yskuwgkyxhfmewcny28os75s',
      name: 'Admin',
      email: 'admin@kodiak.com',
      password: '$2b$10$iTzkXyMrTOLFAbVY7gTeleQpQxjVXE4oObTvai9qrcEh95LETMmaa',
      position: 'Administrador',
      idCompany: 'e5yu6dtaw4sgaw3bj0r2cyb7',
      tradeName: 'KSM',
    })
    .returning()
}

seed().finally(() => {
  client.end()
})
