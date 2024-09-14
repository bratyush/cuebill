import { eq } from "drizzle-orm";
import { db } from "~/db";
import { canteenBills } from "~/db/schema";


export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {

  const billId = params.billId
  const id = parseInt(billId);
  console.log("Id", id)

  // const bills = await db.query.canteenBills.findMany({
  //   columns: {club:false },
  //   where: eq(canteenBills.billId, id)
  // })
  
  const bills = await db.select({
    amount: canteenBills.amount
  }).from(canteenBills).where(eq(canteenBills.billId, id))

  console.log("bills", bills)

  let canteenTotal = 0;
  for (const b of bills ?? []) {
    canteenTotal += b.amount??0;
  }
  console.log("canteenTotal", canteenTotal)

  return Response.json({total: canteenTotal})
}
