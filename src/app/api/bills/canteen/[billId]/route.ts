import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { canteenBills } from "~/server/db/schema";

export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {

  const billId = params.billId
  const id = parseInt(billId);

  const bills = await db.select().from(canteenBills).where(eq(canteenBills.billId, id));
  // const bills = await db.query.canteenBills.findMany({
  //   where: eq(canteenBills.billId, id)
  // })

  return Response.json({bills: bills})
}

export async function DELETE(
  request: Request,
  { params }: { params: { billId: string } }
) {
  const billId = params.billId
  const id = parseInt(billId);

  await db.delete(canteenBills).where(eq(canteenBills.id, id));
  // await db.query.canteenBills.deleteMany({
  //   where: eq(canteenBills.billId, id)
  // })

  return Response.json({status: "success"})
}
