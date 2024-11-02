import dayjs from 'dayjs'
import { count, desc, gte, min, sql } from 'drizzle-orm'
import { view } from '../../db'
import { sales } from '../../db/viewSchema'

export const salesByDaysOfTheLastWeek = async () => {
  const salesDate = await view
    .select({
      minIssueDate: min(sales.issueDate).as('minima_data_emissao'),
    })
    .from(sales)

  const minIssueDate = salesDate[0]?.minIssueDate

  if (!minIssueDate) return { salesByDay: [] }

  // const currentDate = dayjs()
  const sevenDaysAgo = dayjs(minIssueDate)
    .subtract(7, 'days')
    .format('YYYY-MM-DD')

  const salesByDay = await view
    .select({
      issueDate: sales.issueDate,
      dayOfWeek: sql /* sql */`CASE 
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 0 THEN 'Domingo'
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 1 THEN 'Segunda-feira'
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 2 THEN 'Terça-feira'
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 3 THEN 'Quarta-feira'
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 4 THEN 'Quinta-feira'
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 5 THEN 'Sexta-feira'
        WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 6 THEN 'Sábado'
      END`.as('dia_da_semana'),
      salesCount: count(sales.idSales).as('total_de_vendas'),
    })
    .from(sales)
    .where(gte(sales.issueDate, sevenDaysAgo))
    .groupBy(sales.issueDate)
    .orderBy(desc(sales.issueDate))
    .limit(7)

  return {
    salesByDay,
  }
}