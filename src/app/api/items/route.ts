import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { items } from "~/server/db/schema";
import type { ItemType } from "~/types/myTypes";

// add item
export async function POST(request: Request) {

  const body = await request.json() as ItemType
  console.log('asdf', body);

  await db.insert(items).values(body);

  return Response.json({status: "created"})
}

// get items
export async function GET() {
  
  const items = await db.query.items.findMany();

  return Response.json({items: items})
}

// delete item
export async function DELETE(request: Request) {

  const body = await request.json() as {id: number}

  await db.delete(items).where(eq(items.id, body.id));

  return Response.json({status: "deleted"})
}