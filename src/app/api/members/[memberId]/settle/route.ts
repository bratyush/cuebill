import { useAuth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/db";
import { members, transactions } from "~/db/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: { memberId: string } },
) {
  const { memberId } = params;
  const { amount, paymentMode, cashPaid, upiPaid } = await request.json();

  const user = await currentUser();
  const club = user?.privateMetadata.org?? '';

  const member = await db.query.members.findFirst({
    where: eq(members.id, parseInt(memberId)),
  });

  if (!member) {
    return NextResponse.json({ message: "Member not found" }, { status: 404 });
  }

  if (paymentMode === "cash") {
    await db.update(members).set({ balance: member.balance + cashPaid + upiPaid }).where(eq(members.id, parseInt(memberId)));
  }

  await db.insert(transactions).values({
    amount: cashPaid + upiPaid,
    paymentMode: paymentMode,
    memberId: parseInt(memberId),
    club: club,
  });

  return NextResponse.json({ message: "Settled" });
}
