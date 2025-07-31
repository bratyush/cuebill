import { db } from "@/db";
import { members } from "@/db/schema";
import type { MemberType } from "@/types/myTypes"; // Adjust the import based on your types
import { eq } from "drizzle-orm";

// Get member by ID
export async function GET(request: Request, props: { params: Promise<{ memberId: string }> }) {
  const params = await props.params;
  const memberId = params.memberId;
  const id = parseInt(memberId);

  const member = await db.query.members.findFirst({
    where: eq(members.id, id)
  });

  return Response.json({ member: member });
}

// Update member
export async function PATCH(request: Request, props: { params: Promise<{ memberId: string }> }) {
  const params = await props.params;
  const memberId = params.memberId;
  const id = parseInt(memberId);

  const body: MemberType = await request.json() as MemberType;

  await db.update(members).set(body).where(eq(members.id, id));

  return Response.json({ status: "updated" });
} 