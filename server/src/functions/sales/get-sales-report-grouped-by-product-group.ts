import { count, desc, sql } from 'drizzle-orm'
import { view } from '../../db'
import { sales } from '../../db/viewSchema'

export const getSalesReportGroupedByProductGroup = async () => {
  const [totalSalesData, salesGroupedByProductGroup] = await Promise.all([
    view
      .select({
        totalSales: count(sales.idSales),
      })
      .from(sales),

    view
      .select({
        idGroup: sales.idProductGroup,
        descriptionGroup: sales.descriptionProductGroup,
        totalSalesGroup: count(sales.idSales).as('total_vendas_grupo'),
      })
      .from(sales)
      .groupBy(sales.idProductGroup, sales.descriptionProductGroup)
      .orderBy(desc(sql`total_vendas_grupo`)),
  ])

  const totalSales = totalSalesData[0].totalSales

  return { totalSales, salesGroupedByProductGroup }
}
