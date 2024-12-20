import { desc, eq, sql, sum } from 'drizzle-orm'
import { view } from '../../db'
import { products, sales } from '../../db/viewSchema'

export const salesByProductGroup = async () => {
  const report = await view
    .select({
      descriptionGroup: products.descriptionGroup,
      totalSoldProducts: sum(sales.quantity).as('total_produtos_vendidos'),
      totalValueSales: sum(sales.total).as('valor_total_vendas'),
    })
    .from(sales)
    .innerJoin(products, eq(sales.idProduct, products.idProduct))
    .groupBy(products.descriptionGroup)
    .orderBy(desc(sql`valor_total_vendas`))

  return {
    report,
  }
}
