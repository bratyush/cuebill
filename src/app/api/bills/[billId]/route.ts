import { eq } from "drizzle-orm";
import { db } from "~/db";
import { bills } from "~/db/schema";
import { BillType } from "~/types/myTypes";

export async function DELETE(
  request: Request,
  { params }: { params: { billId: string } }
) {

  const billId = params.billId
  const id = parseInt(billId);

  await db.delete(bills).where(eq(bills.id, id))

  return Response.json({status: "deleted"})
}

export async function PATCH(
  request: Request,
  { params }: { params: { billId: string } }
) {

  const billId = params.billId
  const id = parseInt(billId);

  const body : BillType = await request.json() as BillType

  await db.update(bills).set(body).where(eq(bills.id, id))

  return Response.json({status: "created"})
}

export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {

  const billId = params.billId
  const id = parseInt(billId);

  const bill = await db.select().from(bills).where(eq(bills.id, id));

  return Response.json(bill[0])

}