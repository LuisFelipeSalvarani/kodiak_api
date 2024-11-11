import { eq } from 'drizzle-orm'
import { view } from '../../db'
import { products, sales } from '../../db/viewSchema'

export const getProductById = async ({ idProduct }: { idProduct: string }) => {
  const productResult = await view
    .select({
      idProduct: products.idProduct,
      descriptionProduct: products.descriptionProduct,
      descriptionGroup: products.descriptionGroup,
      unitValue: sales.unitValue,
    })
    .from(products)
    .innerJoin(sales, eq(products.idProduct, sales.idProduct))
    .where(eq(products.idProduct, idProduct))

  const product = productResult[0]

  return { product }
}
