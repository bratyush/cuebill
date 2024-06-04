import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { canteenBills } from "~/db/schema";
import type { CanteenBillType } from "~/types/myTypes";

// add bill
export async function POST(request: Request) {

  const body = await request.json() as CanteenBillType

  const user = await currentUser();
  const club = user?.username ?? '';

  await db.insert(canteenBills).values({...body, club:club});

  return Response.json({status: "created"})
}

export async function GET() {

  const user = await currentUser();
  const club = user?.username ?? '';

  const ctnbls = await db.query.canteenBills.findMany({
    where: eq(canteenBills.club, club)
  })

  return Response.json({canteenBills: ctnbls})
}