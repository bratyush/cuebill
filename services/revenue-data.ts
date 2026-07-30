import { db } from "@/db";
import { bills, canteenBills, transactions, items, tables, members } from "@/db/schema";
import { BillType, ctnBllInt, TransactionType } from "@/types/myTypes";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, gte, lte } from "drizzle-orm";

export async function getRevenueData(startRange: string | null, endRange: string | null) {
  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

  // Parse date strings back to Date objects and convert to timestamps
  const startTimestamp = startRange ? new Date(startRange).getTime() : null;
  const endTimestamp = endRange ? new Date(endRange).getTime() : null;

  // Fetch bills with date filtering
  const blsQuery = await db.select({
    id: bills.id,
    tableId: bills.tableId,
    checkIn: bills.checkIn,
    timePlayed: bills.timePlayed,
    tableMoney: bills.tableMoney,
    canteenMoney: bills.canteenMoney,
    paymentMode: bills.paymentMode,
    discount: bills.discount,
    totalAmount: bills.totalAmount,
    cashPaid: bills.cashPaid,
    upiPaid: bills.upiPaid,
    settled: bills.settled,
    memberId: bills.memberId,
    table: {
      name: tables.name,
      rate: tables.rate,
    },
    member: {
      name: members.name,
    }
  })
  .from(bills)
  .leftJoin(tables, eq(bills.tableId, tables.id))
  .leftJoin(members, eq(bills.memberId, members.id))
  .where(
    and(
      eq(bills.club, club),
      startTimestamp ? gte(bills.checkIn, startTimestamp) : undefined,
      endTimestamp ? lte(bills.checkIn, endTimestamp) : undefined
    )
  );

  const bls = blsQuery as unknown as BillType[];

  // Fetch and filter canteen bills using database joins
  const filteredCanteenQuery = await db.select({
    id: canteenBills.id,
    quantity: canteenBills.quantity,
    amount: canteenBills.amount,
    billId: canteenBills.billId,
    item: {
      name: items.name,
      price: items.price,
    },
    bill: {
      checkOut: bills.checkOut,
    },
  })
  .from(canteenBills)
  .innerJoin(bills, eq(canteenBills.billId, bills.id))
  .innerJoin(items, eq(canteenBills.itemId, items.id))
  .where(
    and(
      eq(canteenBills.club, club),
      startTimestamp ? gte(bills.checkOut, startTimestamp) : undefined,
      endTimestamp ? lte(bills.checkOut, endTimestamp) : undefined
    )
  );

  const filteredCanteen = filteredCanteenQuery as unknown as ctnBllInt[];

  // Fetch transactions with date filtering
  const trsQuery = await db.select({
    id: transactions.id,
    memberId: transactions.memberId,
    amount: transactions.amount,
    paymentMode: transactions.paymentMode,
    createdAt: transactions.createdAt,
    member: {
      name: members.name,
    }
  })
  .from(transactions)
  .leftJoin(members, eq(transactions.memberId, members.id))
  .where(
    and(
      eq(transactions.club, club),
      startTimestamp ? gte(transactions.createdAt, startTimestamp) : undefined,
      endTimestamp ? lte(transactions.createdAt, endTimestamp) : undefined
    )
  );

  const trs = trsQuery as unknown as TransactionType[];

  // Calculate chart data aggregations
  const totalRevenue = bls.reduce((acc, bill) => acc + (bill.totalAmount ?? 0), 0);
  const canteenRevenue = bls.reduce((acc, bill) => acc + (bill.canteenMoney ?? 0), 0);

  // Table revenue aggregation
  const tableRevenue: { [key: string]: number } = {};
  bls.forEach((bill) => {
    const tableName = bill?.table?.name ?? 'Canteen';
    if (!tableRevenue[tableName]) {
      tableRevenue[tableName] = 0;
    }
    tableRevenue[tableName] += bill.totalAmount ?? 0;
  });
  const tableRevenueList = Object.entries(tableRevenue).map(([name, revenue]) => ({ name, revenue }));

  // Canteen item revenue aggregation
  const canteenItemRevenue: { [key: string]: number } = {};
  filteredCanteen.forEach((bill) => {
    const itemName = bill?.item?.name ?? 'Unknown';
    if (!canteenItemRevenue[itemName]) {
      canteenItemRevenue[itemName] = 0;
    }
    canteenItemRevenue[itemName] += bill.amount ?? 0;
  });
  const canteenRevenueList = Object.entries(canteenItemRevenue).map(([name, revenue]) => ({ name, revenue }));

  // Canteen item quantity aggregation
  const canteenItemQuantity: { [key: string]: number } = {};
  filteredCanteen.forEach((bill) => {
    const itemName = bill?.item?.name ?? 'Unknown';
    if (!canteenItemQuantity[itemName]) {
      canteenItemQuantity[itemName] = 0;
    }
    canteenItemQuantity[itemName] += bill.quantity ?? 0;
  });
  const canteenQuantityList = Object.entries(canteenItemQuantity).map(([name, quantity]) => ({ name, quantity }));

  // Table time aggregation (exclude canteen bills)
  const tableTime: { [key: string]: number } = {};
  bls.forEach((bill) => {
    if (bill?.table?.name) { // Only include bills with actual tables
      const tableName = bill.table.name;
      if (!tableTime[tableName]) {
        tableTime[tableName] = 0;
      }
      tableTime[tableName] += bill.timePlayed ?? 0;
    }
  });
  const tableTimeList = Object.entries(tableTime).map(([name, timePlayed]) => ({ name, time: timePlayed }));

  // Payment mode aggregation with colors
  const paymentMode: { [key: string]: number } = {};
  bls.forEach((bill) => {
    const mode = bill.paymentMode ?? 'Unknown';
    if (!paymentMode[mode]) {
      paymentMode[mode] = 0;
    }
    paymentMode[mode] += 1;
  });
  
  const payModeList = Object.entries(paymentMode).map(([mode, bills]) => {
    let color = '#6b7280'; // default gray
    if (mode === 'cash') color = '#10b981';
    else if (mode === 'upi') color = '#3b82f6';
    else if (mode === 'both') color = '#f59e0b';
    
    return { id: mode, value: bills, color };
  });

  return {
    bills: bls as BillType[],
    canteen: filteredCanteen as ctnBllInt[],
    transactions: trs as TransactionType[],
    charts: {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      canteenRevenue: parseFloat(canteenRevenue.toFixed(2)),
      tableRevenueList,
      canteenRevenueList,
      canteenQuantityList,
      tableTimeList,
      payModeList
    }
  };
}