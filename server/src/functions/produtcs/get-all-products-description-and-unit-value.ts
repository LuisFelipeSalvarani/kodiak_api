import { desc, eq, gt } from 'drizzle-orm'
import { view } from '../../db'
import { products, sales } from '../../db/viewSchema'

export const getAllProductsDescriptionAndUnitValue = async () => {
  const allProducts = await view
    .selectDistinctOn([products.idProduct], {
      idProduct: products.idProduct,
      descriptionProduct: products.descriptionProduct,
      unitValue: sales.unitValue,
    })
    .from(products)
    .innerJoin(sales, eq(products.idProduct, sales.idProduct))
    .where(gt(sales.unitValue, '0'))
    .orderBy(products.idProduct, desc(sales.issueDate))

  return {
    allProducts,
  }
}
