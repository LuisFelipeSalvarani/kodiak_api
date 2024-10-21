import { desc, sql, sum } from 'drizzle-orm'
import { view } from '../../db'
import { sales } from '../../db/viewSchema'

export const salesByCustomer = async () => {
  const report = await view
    .select({
      idCostumer: sales.idCustomer,
      companyName: sales.companyName,
      totalProducts: sum(sales.quantity).as('total_produtos'),
      totalSalesValue: sum(sales.total).as('valor_total_vendas'),
    })
    .from(sales)
    .groupBy(sales.idCustomer, sales.companyName)
    .orderBy(desc(sql`valor_total_vendas`))

  return {
    report,
  }
}
