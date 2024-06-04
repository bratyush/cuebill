import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { tables } from "~/db/schema";
import type { TableType } from "~/types/myTypes";

// add table
export async function POST(request: Request) {

  const body = await request.json() as TableType

  const user = await currentUser();
  const club = user?.username ?? '';

  await db.insert(tables).values({...body, club:club});

  return Response.json({status: "created"})
}

// get tables
export async function GET() {

  const user = await currentUser();

  if (!user) return Response.json({tables: []})

  const club = user.username ?? '';
  const tbls = await db.select().from(tables).where(eq(tables.club, club));
  return Response.json({tables: tbls});

}

// delete table
export async function DELETE(request: Request) {

  const body = await request.json() as {id: number}

  await db.delete(tables).where(eq(tables.id, body.id));

  return Response.json({status: "deleted"})
}