import { count, eq, sql, sum } from 'drizzle-orm'
import { view } from '../../db'
import { sales } from '../../db/viewSchema'

export const getProductSalesHistoryById = async (id: string) => {
  const productSalesHistory = await view
    .select({
      year: sql<number>`extract(year from ${sales.issueDate})`.as('ano'),
      month: sql<number>`extract(month from ${sales.issueDate})`.as('mes'),
      countSales: count(sales.idSales),
      totalUnitSales: sum(sales.quantity),
    })
    .from(sales)
    .where(eq(sales.idProduct, id))
    .groupBy(sql`ano`, sql`mes`)
    .orderBy(sql`ano`, sql`mes`)

  return { productSalesHistory }
}
