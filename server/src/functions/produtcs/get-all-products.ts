import { eq } from 'drizzle-orm'
import { view } from '../../db'
import { products, sales } from '../../db/viewSchema'

export const getAllProducts = async ({ idGroup }: { idGroup?: number }) => {
  const allProductsQuery = view
    .selectDistinctOn([products.idProduct], {
      idProduct: products.idProduct,
      descriptionProduct: products.descriptionProduct,
      unitValue: sales.unitValue,
    })
    .from(products)
    .innerJoin(sales, eq(products.idProduct, sales.idProduct))
    .$dynamic()
    .where(idGroup ? eq(products.idGroup, idGroup) : undefined)
    .as('produtos')

  const allProducts = await view
    .select()
    .from(allProductsQuery)
    .orderBy(allProductsQuery.descriptionProduct)

  return {
    allProducts,
  }
}
