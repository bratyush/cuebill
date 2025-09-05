import { db } from "@/db";
import { members, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, props: { params: Promise<{ memberId: string }> }) {
  const params = await props.params;
  const { memberId } = params;
  const { amount, paymentMode, cashPaid, upiPaid } = await request.json();

  const user = await currentUser();
  const club = user?.publicMetadata.org as string ?? '';

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
