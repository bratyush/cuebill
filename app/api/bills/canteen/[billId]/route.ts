import { db } from "@/db";
import { canteenBills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, props: { params: Promise<{ billId: string }> }) {
  const params = await props.params;

  const billId = params.billId
  const id = parseInt(billId);

  // const bills = await db.select().from(canteenBills).where(eq(canteenBills.billId, id));
  const bills = await db.query.canteenBills.findMany({
    columns: {club:false },
    where: eq(canteenBills.billId, id)
  })

  return Response.json({bills: bills})
}

export async function DELETE(request: Request, props: { params: Promise<{ billId: string }> }) {
  const params = await props.params;
  const billId = params.billId
  const id = parseInt(billId);

  await db.delete(canteenBills).where(eq(canteenBills.id, id));

  return Response.json({status: "success"})
}
