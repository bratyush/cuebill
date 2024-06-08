import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { canteenBills } from "~/db/schema";
import { CanteenBillType } from "~/types/myTypes";

// add bill
export async function POST(request: Request) {

  const body: CanteenBillType = await request.json()

  console.log('body', body);

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

  await db.insert(canteenBills).values({...body, club:club});

  return Response.json({status: "created"})
}

export async function GET() {

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

  const ctnbls = await db.query.canteenBills.findMany({
    where: eq(canteenBills.club, club)
  })

  return Response.json({canteenBills: ctnbls})
}