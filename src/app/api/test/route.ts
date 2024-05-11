import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { bills } from "~/server/db/schema";

export async function GET() {
  
  // const items = await db.select().from(bills).where(
  //   and(
  //     eq(bills.table_id, 1),
  //     eq(bills.settled, false)
  //   )
  // )

  const items = await db.query.bills.findMany({
    where: (bills, { eq }) => eq(bills.table_id, 1),
  })

  return Response.json({items: items})
}
