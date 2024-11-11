import { eq } from 'drizzle-orm'
import { view } from '../../db'
import { customers } from '../../db/viewSchema'

export const getAllCustomers = async ({ idGroup }: { idGroup?: number }) => {
  const allCustomers = await view
    .select({
      idCustomer: customers.idCustomer,
      companyName: customers.companyName,
    })
    .from(customers)
    .$dynamic()
    .where(idGroup ? eq(customers.idGroup, idGroup) : undefined)

  return {
    allCustomers,
  }
}
