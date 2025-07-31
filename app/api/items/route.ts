import { db } from "@/db";
import { items } from "@/db/schema";
import type { ItemType } from "@/types/myTypes";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

// add item
export async function POST(request: Request) {

  const body = await request.json() as ItemType

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

  console.log('body', body)

  await db.insert(items).values({...body, club:club});

  return Response.json({status: "created"})
}

// get items
export async function GET() {

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

  const itms = await db.query.items.findMany({
    columns: {club:false, active:false},
    where: and(eq(items.club, club),eq(items.active, true)),
  });

  return Response.json({items: itms})
}
