import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/db";

export async function GET() {

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();
  console.log('user', user);

  const items = await db.query.bills.findMany({
    where: (bills, { eq }) => eq(bills.tableId, 1),
  })

  return Response.json({items: items})
}
