import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { items } from "~/db/schema";

export async function GET() {

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  const club: string = user?.privateMetadata?.org ?? '';

  console.log('club', club)

  const itms = await db.query.items.findMany({
    where: eq(items.club, club),
  })

  return Response.json({items: itms})
}
