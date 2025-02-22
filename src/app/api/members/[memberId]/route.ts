import { eq } from "drizzle-orm";
import { db } from "~/db";
import { members } from "~/db/schema";
import type { MemberType } from "~/types/myTypes"; // Adjust the import based on your types

// Get member by ID
export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  const memberId = params.memberId;
  const id = parseInt(memberId);

  const member = await db.query.members.findFirst({
    where: eq(members.id, id)
  });

  return Response.json({ member: member });
}

// Update member
export async function PATCH(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  const memberId = params.memberId;
  const id = parseInt(memberId);
  
  const body: MemberType = await request.json() as MemberType;

  await db.update(members).set(body).where(eq(members.id, id));

  return Response.json({ status: "updated" });
} 