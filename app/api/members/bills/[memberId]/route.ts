import { db } from "@/db";
import { bills, tables } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function GET(request: Request, props: { params: Promise<{ memberId: string }> }) {
  const params = await props.params;
  const { memberId } = params;

  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

  // Fetch bills for the member from the database or any data source
  const queryResult = await db.select({
    bill: bills,
    table: {
      name: tables.name,
      rate: tables.rate,
    }
  })
  .from(bills)
  .leftJoin(tables, eq(bills.tableId, tables.id))
  .where(and(eq(bills.club, club), eq(bills.memberId, parseInt(memberId))));

  const memberBills = queryResult.map(({ bill, table }) => {
    const { tableId, checkOut, note, club: _, ...rest } = bill;
    return { ...rest, table };
  });

  return new Response(JSON.stringify(memberBills), {
      status: 200,
      headers: {
          'Content-Type': 'application/json',
      },
  });
}
