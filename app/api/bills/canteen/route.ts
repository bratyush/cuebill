import { db } from "@/db";
import { bills, canteenBills } from "@/db/schema";
import { BillType, CanteenBillType } from "@/types/myTypes";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// add bill
export async function POST(request: Request) {

  const body: CanteenBillType = await request.json()

  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

  await db.insert(canteenBills).values({...body, club:club});

  return Response.json({status: "created"})
}

export async function GET() {

  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

  const ctnbls = await db.query.canteenBills.findMany({
    where: eq(canteenBills.club, club)
  })
  console.log('canteenBills', ctnbls)

  return Response.json({canteenBills: ctnbls})
}

export async function PATCH(request: Request) {

  const body: BillType = await request.json()

  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

  // make a bill with body.bill time and tableId 0,
  // then update all canteenBills with -1 billId to this new billId

  const bill = await db.insert(bills).values({...body, club:club}).returning();
  console.log(bill);

  if (bill[0]) {
    await db.update(canteenBills)
    .set({billId: bill[0]?.id})
    .where(eq(canteenBills.billId, -1))
  }

  return Response.json({bill: bill[0]})
}