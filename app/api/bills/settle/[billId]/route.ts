import { db } from "@/db";
import { bills, members } from "@/db/schema";
import { BillType } from "@/types/myTypes";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request, props: { params: Promise<{ billId: string }> }) {
    const params = await props.params;

    const billId = params.billId
    const id = parseInt(billId);

    const body : BillType = await request.json()

    await db.update(bills).set(body).where(eq(bills.id, id))

    // update the balance of the member
    if (body.memberId) {
        // decrease the balance by the total amount
        await db.update(members).set({balance: sql`balance - ${body.totalAmount}`}).where(eq(members.id, body.memberId))
    }

    return Response.json({status: "created"})
}