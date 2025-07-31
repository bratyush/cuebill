import { db } from "@/db";
import { transactions } from "@/db/schema";
import { TransactionType } from "@/types/myTypes";
import { eq } from "drizzle-orm";

export async function GET(request: Request, props: { params: Promise<{ transactionId: string }> }) {
    const params = await props.params;
    const transactionId = params.transactionId
    const id = parseInt(transactionId);

    const transaction = await db.select().from(transactions).where(eq(transactions.id, id));
    return Response.json({transaction})
}  

export async function DELETE(request: Request, props: { params: Promise<{ transactionId: string }> }) {
    const params = await props.params;
    const transactionId = params.transactionId
    const id = parseInt(transactionId);

    await db.delete(transactions).where(eq(transactions.id, id))
    return Response.json({status: "deleted"})
}

export async function PATCH(request: Request, props: { params: Promise<{ transactionId: string }> }) {
    const params = await props.params;
    const transactionId = params.transactionId
    const id = parseInt(transactionId);

    const body = await request.json() as TransactionType

    await db.update(transactions).set(body).where(eq(transactions.id, id))
    return Response.json({status: "updated"})
}
