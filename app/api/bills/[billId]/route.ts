import { db } from "@/db";
import { bills, canteenBills } from "@/db/schema";
import { BillType } from "@/types/myTypes";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function DELETE(request: Request, props: { params: Promise<{ billId: string }> }) {
  const params = await props.params;

  const billId = params.billId
  const id = parseInt(billId);

  const user = await currentUser();
  const club = user?.privateMetadata.org ?? '';

  try {
    // First delete all associated canteen bills
    await db.delete(canteenBills)
      .where(and(
        eq(canteenBills.billId, id),
        eq(canteenBills.club, club)
      ));

    // Then delete the main bill
    await db.delete(bills)
      .where(and(
        eq(bills.id, id),
        eq(bills.club, club)
      ));

    return Response.json({ status: "deleted" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return Response.json({ error: "Failed to delete bill" }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ billId: string }> }) {
  const params = await props.params;

  const billId = params.billId
  const id = parseInt(billId);

  const body : BillType = await request.json() as BillType

  await db.update(bills).set(body).where(eq(bills.id, id))

  return Response.json({status: "created"})
}

export async function GET(request: Request, props: { params: Promise<{ billId: string }> }) {
  const params = await props.params;

  const billId = params.billId
  const id = parseInt(billId);

  const bill = await db.select().from(bills).where(eq(bills.id, id));

  return Response.json(bill[0])
}