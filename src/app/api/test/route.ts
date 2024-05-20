import { db } from "~/server/db";

export async function GET() {
  
  // const items = await db.select().from(bills).where(
  //   and(
  //     eq(bills.tableId, 1),
  //     eq(bills.settled, false)
  //   )
  // )

  const items = await db.query.bills.findMany({
    where: (bills, { eq }) => eq(bills.tableId, 1),
  })

  return Response.json({items: items})
}
