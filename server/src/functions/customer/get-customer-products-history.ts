import { count, desc, eq, sql, sum } from 'drizzle-orm'
import { view } from '../../db'
import { customers, sales } from '../../db/viewSchema'
import { salesByDaysOfTheLastWeek } from '../sales/get-sales-by-days-of-the-last-week'

export const getCustomerProductsHistory = async (customerId: number) => {
  const topProducts = await view
    .select({
      productId: sales.idProduct,
      productDescription: sales.descriptionProduct,
      productCount: sum(sales.quantity).as('total_produto'),
      total: sum(sales.total).as('valor_total'),
    })
    .from(sales)
    .where(eq(sales.idCustomer, customerId))
    .groupBy(sales.idProduct, sales.descriptionProduct)
    .orderBy(desc(sum(sales.quantity)))
    .limit(5)

  const lastPurchases = await view
    .select({
      issueDate: sales.issueDate,
      productId: sales.idProduct,
      productDescription: sales.descriptionProduct,
      quantity: sales.quantity,
      total: sales.total,
    })
    .from(sales)
    .where(eq(sales.idCustomer, customerId))
    .orderBy(desc(sales.issueDate))
    .limit(3)

  const customerResult = await view
    .select({
      idCustomer: customers.idCustomer,
      companyName: customers.companyName,
    })
    .from(customers)
    .where(eq(customers.idCustomer, customerId))

  const customer = customerResult[0]

  const dayThatBuysTheMostResult = await view
    .select({
      day: sql /* SQL */`EXTRACT(DAY FROM ${sales.issueDate})`.as('dia'),
      amountPurchases: count(sales.idSales).as('quantidade_compras'),
    })
    .from(sales)
    .where(eq(sales.idCustomer, customerId))
    .groupBy(sql`dia`)
    .orderBy(desc(sql`quantidade_compras`))
    .limit(1)

  const dayThatBuysTheMost = dayThatBuysTheMostResult[0]

  const weekThatBuysTheMostResult = await view
    .select({
      week: sql /* SQL */`EXTRACT(WEEK FROM ${sales.issueDate}) - EXTRACT(WEEK FROM DATE_TRUNC('MONTH', ${sales.issueDate})) + 1`.as(
        'semana'
      ),
      amountPurchases: count(sales.idSales).as('quantidade_compras'),
    })
    .from(sales)
    .where(eq(sales.idCustomer, customerId))
    .groupBy(sql`semana`)
    .orderBy(desc(sql`quantidade_compras`))
    .limit(1)

  const weekThatBuysTheMost = weekThatBuysTheMostResult[0]

  return {
    customer,
    topProducts,
    lastPurchases,
    dayThatBuysTheMost,
    weekThatBuysTheMost,
  }
}
