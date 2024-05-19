// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { integer, real, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `pool_${name}`);

export const tables = createTable(
  "table",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    rate: real("rate"),
    theme: text("theme", { enum: ['pool', 'snooker']}),
    checked_in_at: integer("checkedInAt"),
    time: integer("time"),
  }
)

export const bills = createTable(
  "bill",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    table_id: integer("tableId").notNull(),
    check_in: integer("check_in").default(0),
    check_out: integer("check_out").default(0),
    time_played: integer("time_played").default(0),
    table_money: real("money").default(0),
    canteen_money: real("money").default(0),
    payment_mode: text("payment_mode", {enum: ['cash', 'upi', 'both']}).default('upi'),
    total_amount: real("total_amount").default(0),
  }
)

export const items = createTable(
  "item",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    price: real("price"),
  }
)

export const canteenBills = createTable(
  "canteen_bill",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    item_id: integer("itemId", { mode: "number"}).notNull(),
    bill_id: integer("billId", { mode: "number"}).notNull(),
    quantity: integer("quantity"),
    amount: real("amount"),
  }
)


export const tableRelations = relations(tables, ({many}) => ({
  bill: many(bills),
}));

export const billRelations = relations(bills, ({one}) => ({
  table: one(tables, {
    fields: [bills.table_id],
    references: [tables.id],
  }),
}))

export const itemRelations = relations(items, ({many}) => ({
  canteenBill: many(canteenBills),
}));

export const canteenBillRelations = relations(canteenBills, ({one}) => ({
  item: one(items, {
    fields: [canteenBills.item_id],
    references: [items.id],
  }),
  bill: one(bills, {
    fields: [canteenBills.bill_id],
    references: [bills.id],
  })
}))