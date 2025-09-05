import { db } from "@/db";
import { bills } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();
  
  if (!user) return Response.json({ bills: [] });
  
  const club = user?.publicMetadata.org as string ?? '';

  try {
    // Get unsettled bills with tableId = 0 (canteen-only bills)
    const unsettledCanteenBills = await db.query.bills.findMany({
      columns: { club: false },
      where: and(
        eq(bills.club, club),
        eq(bills.settled, false),
        eq(bills.tableId, 0)
      ),
    });

    return Response.json({ bills: unsettledCanteenBills });
  } catch (error) {
    console.error("Error fetching unsettled canteen bills:", error);
    return Response.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}