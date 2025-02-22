import { eq } from "drizzle-orm";
import { db } from "~/db";
import { canteenBills } from "~/db/schema";

export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {

  const billId = params.billId
  const id = parseInt(billId);

  // const bills = await db.select().from(canteenBills).where(eq(canteenBills.billId, id));
  const bills = await db.query.canteenBills.findMany({
    columns: {club:false },
    where: eq(canteenBills.billId, id)
  })

  return Response.json({bills: bills})
}

export async function DELETE(
  request: Request,
  { params }: { params: { billId: string } }
) {
  const billId = params.billId
  const id = parseInt(billId);

  await db.delete(canteenBills).where(eq(canteenBills.id, id));

  return Response.json({status: "success"})
}
