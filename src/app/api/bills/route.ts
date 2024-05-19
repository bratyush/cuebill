import { db } from "~/server/db";
import { bills } from "~/server/db/schema";

// create bill
export async function POST(request: Request) {

  const body = await request.json() as {table: number};

  const bill = await db.insert(bills).values({table_id: body.table}).returning();

  return Response.json({status: "created", bill: bill[0]})
}

export async function GET() {
  const bills = await db.query.bills.findMany({
    with: {
      table: true
    }
  })
  
  return Response.json({bills: bills})

}