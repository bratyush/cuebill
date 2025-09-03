import { db } from "@/db";
import { bills, canteenBills, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, gte, lte } from "drizzle-orm";
import { BillType, ctnBllInt, TransactionType } from "@/types/myTypes";

export async function getRevenueData(startRange: string | null, endRange: string | null) {
  const user = await currentUser();
  const club = user?.privateMetadata.org ?? '';

  // Parse date strings back to Date objects and convert to timestamps
  const startTimestamp = startRange ? new Date(startRange).getTime() : null;
  const endTimestamp = endRange ? new Date(endRange).getTime() : null;

  // Fetch bills with date filtering
  const bls = await db.query.bills.findMany({
    columns: {
      tableId: false,
      checkOut: false,
      note: false,
      club: false,
    },
    with: {
      table: {
        columns: {name:true, rate:true}
      },
      member: {
        columns: {name:true}
      },
    },
    where: and(
      eq(bills.club, club),
      startTimestamp ? gte(bills.checkIn, startTimestamp) : undefined,
      endTimestamp ? lte(bills.checkIn, endTimestamp) : undefined
    ),
  });

  // Fetch canteen bills with club filtering
  const ctnBls = await db.query.canteenBills.findMany({
    columns: {
      club: false,
      itemId: false,
    },
    where: eq(canteenBills.club, club),
    with: {
      bill: {
        columns: { checkOut: true },
      },
      item: {
        columns: { name: true, price: true},
      },
    },
  });

  // Filter canteen bills by checkout date
  const filteredCanteen = ctnBls.filter((canteenItem) => {
    if (canteenItem.bill?.checkOut) {
      const checkOutTimestamp = canteenItem.bill.checkOut;
      if (startTimestamp && checkOutTimestamp < startTimestamp) return false;
      if (endTimestamp && checkOutTimestamp > endTimestamp) return false;
      return true;
    }
    return false;
  });

  // Fetch transactions with date filtering
  const trs = await db.query.transactions.findMany({
    columns: {
      club: false,
    },
    where: and(
      eq(transactions.club, club),
      startTimestamp ? gte(transactions.createdAt, startTimestamp) : undefined,
      endTimestamp ? lte(transactions.createdAt, endTimestamp) : undefined
    ),
    with: {
      member: {
        columns: { name: true },
      },
    },
  });

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