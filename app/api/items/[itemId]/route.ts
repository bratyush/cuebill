import { db } from "@/db";
import { items } from "@/db/schema";
import type { TableType } from "@/types/myTypes";
import { eq } from "drizzle-orm";


export async function GET(request: Request, props: { params: Promise<{ itemId: string }> }) {
  const params = await props.params;
  const itemId = params.itemId
  const id = parseInt(itemId);

  const item = await db.query.items.findFirst({
    where: eq(items.id, id)
  })

  return Response.json({item: item})
}

export async function PATCH(request: Request, props: { params: Promise<{ itemId: string }> }) {
  const params = await props.params;

  const itemId = params.itemId
  const id = parseInt(itemId);

  const body : TableType = await request.json() as TableType

  await db.update(items).set(body).where(eq(items.id, id))

  return Response.json({status: "created"})
}

// delete item
export async function DELETE(request: Request, props: { params: Promise<{ itemId: string }> }) {
  const params = await props.params;

  const itemId = params.itemId
  const id = parseInt(itemId);

  await db.update(items).set({active:false}).where(eq(items.id, id))

  return Response.json({status: "deleted"})
}
