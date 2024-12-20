import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'

export const login = async (email: string) => {
  const result = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
      position: users.position,
      idCompany: users.idCompany,
      tradeName: users.tradeName,
    })
    .from(users)
    .where(eq(users.email, email))

  const user = result[0]

  return {
    user,
  }
}
