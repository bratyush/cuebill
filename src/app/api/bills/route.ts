import { db } from "~/server/db";
import { bills } from "~/server/db/schema";

export async function POST(request: Request) {

  const body = await request.json()
  console.log('body', body)

  await db.insert(bills).values(body);

  return Response.json({status: "created"})
}