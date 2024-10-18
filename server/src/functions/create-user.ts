import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

interface CreateUserRequest {
  name: string
  email: string
  password: string
  position: string
  idCompany: string
  tradeName: string
}

export async function createUser({
  name,
  email,
  password,
  position,
  idCompany,
  tradeName,
}: CreateUserRequest) {
  const insertUser = await db
    .insert(users)
    .values({ name, email, password, position, idCompany, tradeName })
    .returning()

  const user = insertUser[0]

  return {
    user,
  }
}
