// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { int, real, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `pool-rsc_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
//     name: text("name", { length: 256 }),
//     createdAt: int("created_at", { mode: "timestamp" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: int("updatedAt", { mode: "timestamp" }),
//   },
// );

export const tables = createTable(
  "table",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    rate: real("rate"),
    theme: text("theme", { enum: ['pool', 'snooker']}),
    checked_in_at: int("checkedInAt"),
    time: int("time"),
  }
)

export const bills = createTable(
  "bill",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    table_id: int("tableId", { mode: "number"}).notNull(),
    check_in: int("check_in"),
    check_out: int("check_out"),
    time_played: int("time_played"),
    table_money: real("money"),
    canteen_money: real("money").default(0),
    payment_mode: text("payment_mode", {enum: ['cash', 'upi', 'both']}),
    total_amount: real("total_amount"),
  }
)

export const items = createTable(
  "item",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    price: real("price"),
  }
)

export const canteenBills = createTable(
  "canteen_bill",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    item_id: int("itemId", { mode: "number"}).notNull(),
    bill_id: int("billId", { mode: "number"}).notNull(),
    quantity: int("quantity"),
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