import { eq } from "drizzle-orm";
import { db } from "~/db";
import { tables } from "~/db/schema";
import type { TableType } from "~/types/myTypes";


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
  
  const body : TableType = await request.json() as TableType

  await db.update(tables).set(body).where(eq(tables.id, id))

  return Response.json({status: "created"})
}
