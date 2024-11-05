import { desc, eq, sum } from 'drizzle-orm'
import { view } from '../../db'
import { customers, sales } from '../../db/viewSchema'

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

  const customer = await view
    .select({
      idCustomer: customers.idCustomer,
      companyName: customers.companyName,
    })
    .from(customers)
    .where(eq(customers.idCustomer, customerId))

  return {
    customer,
    topProducts,
    lastPurchases,
  }
}
