import { db } from "@/db";
import { bills } from "@/db/schema";
import { BillType } from "@/types/myTypes";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request, props: { params: Promise<{ billId: string }> }) {
  const params = await props.params;

  const billId = params.billId
  const id = parseInt(billId);

  await db.delete(bills).where(eq(bills.id, id))

  return Response.json({status: "deleted"})
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