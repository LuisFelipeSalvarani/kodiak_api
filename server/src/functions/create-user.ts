import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

interface CreateUserRequest {
  email: string
  password: string
}

export async function createUser({ email, password }: CreateUserRequest) {
  const result = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, email))

  const userExists = result[0]

  if (userExists) throw new Error('E-mail já cadastrado!')

  const insertUser = await db
    .insert(users)
    .values({ email, password })
    .returning()

  const user = insertUser[0]

  return {
    user,
  }
}
