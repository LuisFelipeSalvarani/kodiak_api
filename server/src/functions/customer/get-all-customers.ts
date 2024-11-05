import { view } from '../../db'
import { customers } from '../../db/viewSchema'

export const getAllCustomers = async () => {
  const allCustomers = await view
    .select({
      idCustomer: customers.idCustomer,
      companyName: customers.companyName,
    })
    .from(customers)

  return {
    allCustomers,
  }
}
