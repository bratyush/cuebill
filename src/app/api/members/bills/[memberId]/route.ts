import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/db";
import { bills } from "~/db/schema";

export async function GET(request: Request, { params }: { params: { memberId: string } }) {
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
        where: and(eq(bills.club, club), eq(bills.memberId, memberId)),
      });

    return new Response(JSON.stringify(memberBills), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
