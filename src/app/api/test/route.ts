import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { tables, bills } from "~/db/schema";

export async function GET() {
  const user = await currentUser();

  if (!user) return Response.json({ tables: [] });

  const club: string = user?.privateMetadata?.org ?? "";

  const tbls = await db.query.tables.findMany({
    columns: { club: false, active: false },
    where: and(eq(tables.club, club), eq(tables.active, true)),
  });

  const unsettled = await db.query.bills.findMany({
    columns: { club: false },
    where: and(eq(bills.club, club), eq(bills.settled, false)),
  });

  let resData: any = [];
  for (let tbl of tbls) {
    let unsettledBills = unsettled.filter((b) => b.tableId === tbl.id);
    resData.push({
      ...tbl,
      unsettled: unsettledBills
    });
  }

  return Response.json({ tables: resData });
}
