import { db } from "@/db";
import { bills, tables } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// create bill
export async function POST(request: Request) {

  const body = await request.json() as {table: number};

  const user = await currentUser();
  
  const club = user?.publicMetadata.org as string ?? '';

  const isCanteenBill = body.table === 0;
  const now = Date.now();

  const billData = {
    tableId: body.table,
    club: club,
    checkIn: isCanteenBill ? now : undefined,
    checkOut: isCanteenBill ? now : undefined,
    timePlayed: isCanteenBill ? 0 : undefined,
    tableMoney: isCanteenBill ? 0 : undefined,
    canteenMoney: 0,
    paymentMode: 'upi' as const,
    totalAmount: 0,
    upiPaid: 0,
    settled: false
  };

  const bl = await db.insert(bills).values(billData).returning();

  return Response.json({status: "created", bill: bl[0]})
}

export async function GET() {

  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

  const queryResult = await db.select({
    bill: bills,
    table: tables
  })
  .from(bills)
  .leftJoin(tables, eq(bills.tableId, tables.id))
  .where(eq(bills.club, club));

  const bls = queryResult.map(row => ({
    ...row.bill,
    table: row.table
  }));
  
  return Response.json({bills: bls})

}