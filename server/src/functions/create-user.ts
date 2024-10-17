import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

interface CreateUserRequest {
  name: string
  email: string
  password: string
  position: string
  idCostumer: number
  tradeName: string
}

export async function createUser({
  name,
  email,
  password,
  position,
  idCostumer,
  tradeName,
}: CreateUserRequest) {
  const result = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, email))

  const userExists = result[0]

  if (userExists) throw new Error('E-mail já cadastrado!')

  const insertUser = await db
    .insert(users)
    .values({ name, email, password, position, idCostumer, tradeName })
    .returning()

  const user = insertUser[0]

  return {
    user,
  }
}
