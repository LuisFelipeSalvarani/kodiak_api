import { desc, sql, sum } from 'drizzle-orm'
import { view } from '../../db'
import { sales } from '../../db/viewSchema'

export const topSellingProducts = async () => {
  const topProducts = await view
    .select({
      idProduct: sales.idProduct,
      descriptionProduct: sales.descriptionProduct,
      totalSelling: sum(sales.quantity).as('total_vendido'),
      totalSalesValue: sum(sales.total).as('valor_total_vendas'),
    })
    .from(sales)
    .groupBy(sales.idProduct, sales.descriptionProduct)
    .orderBy(desc(sql`total_vendido`))
    .limit(10)

  return {
    topProducts,
  }
}
