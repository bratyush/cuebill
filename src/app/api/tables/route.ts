import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { tables } from "~/server/db/schema";

// add table
export async function POST(request: Request) {

  const body = await request.json()
  console.log('body', body)

  await db.insert(tables).values(body);

  return Response.json({status: "created"})
}

// get tables
export async function GET() {
  
  const tables = await db.query.tables.findMany();

  return Response.json({tables: tables})
}

// delete table
export async function DELETE(request: Request) {

  const body = await request.json()
  console.log('body', body)

  await db.delete(tables).where(eq(tables.id, body.id));

  return Response.json({status: "deleted"})
}