import { isNotNull } from 'drizzle-orm'
import { view } from '../../db'
import { products } from '../../db/viewSchema'

export const getAllProductGroups = async () => {
  const allProductGroups = await view
    .selectDistinctOn([products.idGroup], {
      idGroup: products.idGroup,
      descriptionGroup: products.descriptionGroup,
    })
    .from(products)
    .where(isNotNull(products.idGroup))

  return { allProductGroups }
}
