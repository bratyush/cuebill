import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { bills } from "~/db/schema";

// create bill
export async function POST(request: Request) {

  const body = await request.json() as {table: number};

  const user = await currentUser();
  const club = user?.username ?? '';

  const bl = await db.insert(bills).values({tableId: body.table, club:club}).returning();

  return Response.json({status: "created", bill: bl[0]})
}

export async function GET() {

  const user = await currentUser();
  const club = user?.username ?? '';

  const bls = await db.query.bills.findMany({
    with: {
      table: true
    },
    where: eq(bills.club, club)
  })
  
  return Response.json({bills: bls})

}