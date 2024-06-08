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

  let canteenTotal = 0;
  for (const b of bills ?? []) {
    canteenTotal += b.amount??0;
  }

  return Response.json({total: canteenTotal})
}