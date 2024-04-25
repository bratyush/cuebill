import { db } from "~/server/db";
import { bills } from "~/server/db/schema";

// add bill
export async function POST(request: Request) {

  const body = await request.json()
  console.log('body', body)

  await db.insert(bills).values(body);

  return Response.json({status: "created"})
}

export async function GET() {
  const bills = await db.query.bills.findMany({
    with: {
      table: true
    }
  })
  
  return Response.json({bills: bills})

}