import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'

export const getUserByIdInCookie = async (userId: string) => {
  const result = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      position: users.position,
      idCompany: users.idCompany,
      tradeName: users.tradeName,
    })
    .from(users)
    .where(eq(users.id, userId))

  const user = result[0]

  return {
    user,
  }
}
