import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { bills, canteenBills, transactions } from "~/db/schema";

export async function GET() {

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

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
      member: {
        columns: {name:true}
      },
    },
    where: eq(bills.club, club),
  });

  const ctnBls = await db.query.canteenBills.findMany({
    columns: {
      club: false,
      itemId: false,
    },
    where: eq(canteenBills.club, club),
    with: {
      bill: {
        columns: { checkOut: true },
      },
      item: {
        columns: { name: true, price: true},
      },
    },
  });

  const trs = await db.query.transactions.findMany({
    columns: {
      club: false,
    },
    where: eq(transactions.club, club),
    with: {
      member: {
        columns: { name: true },
      },
    },
  });

  return Response.json({bills: bls, canteen: ctnBls, transactions: trs})

}