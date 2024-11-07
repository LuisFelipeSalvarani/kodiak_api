import { date, decimal, integer, pgTable, text } from 'drizzle-orm/pg-core'

export const customers = pgTable('fatec_clientes', {
  idCustomer: integer('id_cliente').primaryKey(),
  companyName: text('razao_cliente'),
  tradeName: text('nome_fantasia'),
  city: text('cidade'),
  state: text('uf'),
  idGroup: integer('id_grupo'),
  descriptionGroup: text('descricao_grupo'),
})

export const products = pgTable('fatec_produtos', {
  idProduct: text('codigo').primaryKey(),
  descriptionProduct: text('descricao_produto'),
  idGroup: integer('id_grupo'),
  descriptionGroup: text('descricao_grupo'),
})

export const sales = pgTable('fatec_vendas', {
  idSales: integer('id_venda').primaryKey(),
  issueDate: date('data_emissao'),
  type: integer('tipo'),
  descriptionType: text('descricao_tipo'),
  idCustomer: integer('id_cliente'),
  companyName: text('razao_cliente'),
  tradeName: text('nome_fantasia'),
  idCustomerGroup: integer('id_grupo_cliente'),
  descriptionCustomerGroup: text('descricao_grupo_cliente'),
  city: text('cidade'),
  state: text('uf'),
  idProduct: text('codigo_produto'),
  descriptionProduct: text('descricao_produto'),
  idProductGroup: integer('id_grupo_produto'),
  descriptionProductGroup: text('descricao_grupo_produto'),
  quantity: decimal('qtde'),
  unitValue: decimal('valor_unitario'),
  total: decimal('total'),
})

export const receivables = pgTable('fatec_contas_receber', {
  idReceivables: integer('idcr').primaryKey(),
  document: text('documento'),
  title: integer('titulo'),
  installments: integer('parcela'),
  idCustomer: integer('id_cliente'),
  companyName: text('razao_cliente'),
  tradeName: text('nome_fantasia'),
  idCustomerGroup: integer('id_grupo_cliente'),
  descriptionCustomerGroup: text('descricao_grupo_cliente'),
  city: text('cidade'),
  state: text('uf'),
  titleValue: decimal('valor_titulo'),
  receivedValue: decimal('valor_recebido'),
  balanceValue: decimal('valor_saldo'),
  issueDate: date('data_emissao'),
  entryDate: date('data_entrada'),
  dueDate: date('data_vencimento'),
})
