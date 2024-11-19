import { count, desc, eq, sql, sum } from 'drizzle-orm'
import { view } from '../../db'
import { sales } from '../../db/viewSchema'

export const getTopCustomersWhoBuyTheProductById = async (
  idProduct: string
) => {
  const topCustomers = await view
    .select({
      idCustomer: sales.idCustomer,
      companyName: sales.companyName,
      totalPurchasedProduct: sum(sales.quantity).as('total_produtos_comprados'),
      totalPurchases: count(sales.idSales).as('total_compras'),
      totalValue: sum(sales.total).as('valor_total'),
    })
    .from(sales)
    .where(eq(sales.idProduct, idProduct))
    .groupBy(sales.idCustomer, sales.companyName)
    .orderBy(desc(sql`total_produtos_comprados`))
    .limit(10)

  return {
    topCustomers,
  }
}
