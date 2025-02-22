import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/db";
import { members } from "~/db/schema";
import type { MemberType } from "~/types/myTypes";
import { eq } from "drizzle-orm";

// Add member
export async function POST(request: Request) {
  const body = await request.json() as MemberType;

  const user = await currentUser();
  const club: string = user?.privateMetadata?.org ?? '';

  await db.insert(members).values({ ...body, club: club });

  return Response.json({ status: "created" });
}

// Get members
export async function GET() {
  const user = await currentUser();

  if (!user) return Response.json({ members: [] });

  const club: string = user?.privateMetadata?.org ?? "";

  const allMembers = await db.query.members.findMany({
    where: eq(members.club, club),
  });

  return Response.json({ members: allMembers });
}

// Delete member
export async function DELETE(request: Request) {
  const body = await request.json() as { id: number };

  await db.delete(members).where(eq(members.id, body.id));

  return Response.json({ status: "deleted" });
}
