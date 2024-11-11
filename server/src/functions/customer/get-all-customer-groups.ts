import { view } from '../../db'
import { customers } from '../../db/viewSchema'

export const getAllCustomerGroups = async () => {
  const allCustomerGroups = await view
    .selectDistinctOn([customers.idGroup], {
      idGroup: customers.idGroup,
      descriptionGroup: customers.descriptionGroup,
    })
    .from(customers)

  return { allCustomerGroups }
}
