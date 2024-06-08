import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { bills, canteenBills } from "~/db/schema";

export async function GET() {

  const user = await currentUser();
  const club = user?.username ?? '';

  const bls = await db.query.bills.findMany({
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
    where: eq(bills.club, club),
  });

  const ctnBls = await db.query.canteenBills.findMany({
    columns: {
      billId: false,
      club: false,
      itemId: false,
    },
    where: eq(canteenBills.club, club),
    with: {
      bill: {
        columns: { checkIn: true },
      },
      item: {
        columns: { name: true, price: true},
      },
    },
  });

  return Response.json({bills: bls, canteen: ctnBls})

}