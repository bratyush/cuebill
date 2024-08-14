import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { bills, tables } from "~/db/schema";
import type { TableType } from "~/types/myTypes";

// add table
export async function POST(request: Request) {

  const body = await request.json() as TableType

  const user = await currentUser();

  const club: string = user?.privateMetadata?.org ?? '';

  await db.insert(tables).values({...body, club:club});

  return Response.json({status: "created"})
}

// get tables
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

// delete table
export async function DELETE(request: Request) {

  const body = await request.json() as {id: number}

  // await db.delete(tables).where(eq(tables.id, body.id));
  
  await db.update(tables).set({active:false}).where(eq(tables.id, body.id))

  return Response.json({status: "deleted"})
}