import { eq } from "drizzle-orm";
import { db } from "~/db";
import { items } from "~/db/schema";
import type { TableType } from "~/types/myTypes";


export async function GET(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  const itemId = params.itemId
  const id = parseInt(itemId);

  const item = await db.query.items.findFirst({
    where: eq(items.id, id)
  })

  return Response.json({item: item})

}

export async function PATCH(
  request: Request,
  { params }: { params: { itemId: string } }
) {

  const itemId = params.itemId
  const id = parseInt(itemId);
  
  const body : TableType = await request.json() as TableType

  await db.update(items).set(body).where(eq(items.id, id))

  return Response.json({status: "created"})
}

// delete item
export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {

  const itemId = params.itemId
  const id = parseInt(itemId);

  await db.update(items).set({active:false}).where(eq(items.id, id))

  return Response.json({status: "deleted"})
}
