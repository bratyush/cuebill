import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { bills } from "~/db/schema";
import { CanteenBillType } from "~/types/myTypes";

export async function GET() {

  const user = await currentUser();
  const club = user?.username ?? '';

  const bls = await db.query.bills.findMany({
    with: {
      table: true
    },
    where: eq(bills.club, club)
  })

  const ctnBls = await db.query.canteenBills.findMany({
    where: eq(bills.club, club)
  })

  const ctnItems = await db.query.items.findMany({
    where: eq(bills.club, club)
  })

  const ctnRev = ctnBls.reduce((acc: {[key:string]: number}, bill) => {
    if (!acc[bill.itemId]) {
      acc[bill.itemId] = 0;
    }
    acc[bill.itemId] += bill.amount ?? 0;
    return acc;
  }, {});

  const ctnQua = ctnBls.reduce((acc: {[key:string]: number}, bill) => {
    if (!acc[bill.itemId]) {
      acc[bill.itemId] = 0;
    }
    acc[bill.itemId] += bill.quantity ?? 0;
    return acc;
  }, {});

  const ctnRevList = Object.entries(ctnRev).map(([name, revenue]) => {
      const item = ctnItems.find(i => i.id === parseInt(name));
      return ({ id: name, name: item?.name, revenue, quantity: ctnQua[name]});
    }
  );

  return Response.json({bills: bls, canteen: ctnRevList})

}