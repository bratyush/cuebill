import { NextRequest, NextResponse } from 'next/server';
import { BillType, ctnBllInt, TransactionType } from '@/types/myTypes';
import { db } from "@/db";
import { bills, canteenBills, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { startRange: startRangeStr, endRange: endRangeStr } = await request.json();

    const user = await currentUser();
    const club = user?.privateMetadata.org ?? '';

    // Parse date strings back to Date objects
    const startRange = startRangeStr ? new Date(startRangeStr) : null;
    const endRange = endRangeStr ? new Date(endRangeStr) : null;

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
        startRange ? gte(bills.checkIn, startRange.getTime()) : undefined,
        endRange ? lte(bills.checkIn, endRange.getTime()) : undefined
      ),
    });

    // Fetch canteen bills with date filtering through bill relation
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

    // Filter canteen bills by checkout date (since we can't join in the where clause easily)
    const filteredCanteen = ctnBls.filter((canteenItem) => {
      if (canteenItem.bill?.checkOut) {
        const checkOutTimestamp = canteenItem.bill.checkOut;
        if (startRange && checkOutTimestamp < startRange.getTime()) return false;
        if (endRange && checkOutTimestamp > endRange.getTime()) return false;
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
        startRange ? gte(transactions.createdAt, startRange.getTime()) : undefined,
        endRange ? lte(transactions.createdAt, endRange.getTime()) : undefined
      ),
      with: {
        member: {
          columns: { name: true },
        },
      },
    });

    return NextResponse.json({
      bills: bls,
      canteen: filteredCanteen,
      transactions: trs
    });

  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}

