import { db } from "~/server/db";
import { bills, canteenBills } from "~/server/db/schema";
import type { BillType, CanteenBillType } from "~/types/myTypes";

// add bill
export async function POST(request: Request) {

  const body = await request.json() as CanteenBillType

  await db.insert(canteenBills).values(body);

  return Response.json({status: "created"})
}

export async function GET() {
  const canteenBills = await db.query.canteenBills.findMany()

  return Response.json({canteenBills: canteenBills})
}