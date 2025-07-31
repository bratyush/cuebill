import { db } from "@/db";
import { tables } from "@/db/schema";
import type { TableType } from "@/types/myTypes";
import { eq } from "drizzle-orm";


export async function GET(request: Request, props: { params: Promise<{ tableId: string }> }) {
  const params = await props.params;
  const tableId = params.tableId
  const id = parseInt(tableId);

  const table = await db.query.tables.findFirst({
    where: eq(tables.id, id)
  })

  return Response.json({table: table})
}

// checking in a table
export async function PATCH(request: Request, props: { params: Promise<{ tableId: string }> }) {
  const params = await props.params;

  const tableId = params.tableId
  const id = parseInt(tableId);

  const body : TableType = await request.json() as TableType

  await db.update(tables).set(body).where(eq(tables.id, id))

  return Response.json({status: "created"})
}
