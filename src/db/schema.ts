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
    theme: text("theme", { enum: ['pool', 'snooker', 'violet', 'amber', 'stone', 'red', 'canteen']}),
    checked_in_at: integer("checkedInAt"),
    active: integer("active", {mode: 'boolean'}).default(true),
    club: text("club"),
  }
)

export const bills = createTable(
  "bill",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tableId: integer("tableId").notNull(),
    checkIn: integer("checkIn").default(0),
    checkOut: integer("checkOut").default(0),
    timePlayed: integer("timePlayed").default(0),
    tableMoney: real("tableMoney").default(0),
    canteenMoney: real("canteenMoney").default(0),
    paymentMode: text("paymentMode", {enum: ['cash', 'upi', 'both']}).default('upi'),
    discount: real("discount").default(0),
    totalAmount: real("totalAmount").default(0),
    cashPaid: real("cashPaid").default(0),
    upiPaid: real("upiPaid").default(0),
    settled: integer("settled", {mode: 'boolean'}).default(false),
    note: text("note"),
    club: text("club"),
  }
)

export const items = createTable(
  "item",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    price: real("price"),
    active: integer("active", {mode: 'boolean'}).default(true),
    club: text("club"),
  }
)

export const canteenBills = createTable(
  "canteen_bill",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    itemId: integer("itemId", { mode: "number"}).notNull(),
    billId: integer("billId", { mode: "number"}).notNull(),
    quantity: integer("quantity"),
    amount: real("amount"),
    club: text("club"),
  }
)


export const tableRelations = relations(tables, ({many}) => ({
  bill: many(bills),
}));

export const billRelations = relations(bills, ({one}) => ({
  table: one(tables, {
    fields: [bills.tableId],
    references: [tables.id],
  }),
}))

export const itemRelations = relations(items, ({many}) => ({
  canteenBill: many(canteenBills),
}));

export const canteenBillRelations = relations(canteenBills, ({one}) => ({
  item: one(items, {
    fields: [canteenBills.itemId],
    references: [items.id],
  }),
  bill: one(bills, {
    fields: [canteenBills.billId],
    references: [bills.id],
  })
}))