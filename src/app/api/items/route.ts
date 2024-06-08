import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { items } from "~/db/schema";
import type { ItemType } from "~/types/myTypes";

// add item
export async function POST(request: Request) {

  const body = await request.json() as ItemType

  const user = await currentUser();
  const club = user?.username ?? '';

  await db.insert(items).values({...body, club:club});

  return Response.json({status: "created"})
}

// get items
export async function GET() {

  const user = await currentUser();
  const club = user?.username ?? '';

  const itms = await db.query.items.findMany({
    columns: {club:false, active:false},
    where: and(eq(items.club, club),eq(items.active, true)),
  });

  return Response.json({items: itms})
}

// delete item
export async function DELETE(request: Request) {

  const body = await request.json() as {id: number}

  // await db.delete(items).where(eq(items.id, body.id));
  
  await db.update(items).set({active:false}).where(eq(items.id, body.id))

  return Response.json({status: "deleted"})
}