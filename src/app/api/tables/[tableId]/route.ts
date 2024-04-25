import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { tables } from "~/server/db/schema";


export async function GET(
  request: Request,
  { params }: { params: { tableId: string } }
) {
  const tableId = params.tableId // 'a', 'b', or 'c'
  const id = parseInt(tableId);

  const table = await db.query.tables.findFirst({
    where: eq(tables.id, id)
  })

  return Response.json({table: table})

}

export async function PATCH(
  request: Request,
  { params }: { params: { tableId: string } }
) {

  const tableId = params.tableId // 'a', 'b', or 'c'
  const id = parseInt(tableId);
  
  const body = await request.json()
  console.log('body', body)

  await db.update(tables).set(body).where(eq(tables.id, id))

  return Response.json({status: "created"})
}