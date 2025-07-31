import { db } from "@/db";
import { bills } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function GET(request: Request, props: { params: Promise<{ memberId: string }> }) {
  const params = await props.params;
  const { memberId } = params;

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

  // Fetch bills for the member from the database or any data source
  const memberBills = await db.query.bills.findMany({
      columns: {
        tableId: false,
        checkOut: false,
        note: false,
        club: false,
      },
      with: {
        table: {
          columns: {name:true, rate:true}
        },
      },
      where: and(eq(bills.club, club), eq(bills.memberId, parseInt(memberId))),
    });

  return new Response(JSON.stringify(memberBills), {
      status: 200,
      headers: {
          'Content-Type': 'application/json',
      },
  });
}
