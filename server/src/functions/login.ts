import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

export async function login(email: string) {
  const result = await db
    .select({ userId: users.id, email: users.email, password: users.password })
    .from(users)
    .where(eq(users.email, email))

  const user = result[0]

  if (!user) throw new Error('Dados incorretos!')

  return {
    user,
  }
}
