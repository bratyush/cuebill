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

  return {
    bills: bls as BillType[],
    canteen: filteredCanteen as ctnBllInt[],
    transactions: trs as TransactionType[]
  };
}