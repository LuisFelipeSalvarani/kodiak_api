import { view } from '../../db'
import { costumers } from '../../db/viewSchema'

export const getAllCostumers = async () => {
  const allCostumers = await view
    .select({
      idCostumer: costumers.idCustomer,
      companyName: costumers.companyName,
    })
    .from(costumers)

  return {
    allCostumers,
  }
}