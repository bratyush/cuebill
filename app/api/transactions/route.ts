import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { TransactionType } from "@/types/myTypes";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
    const user = await currentUser();
    const club = user?.publicMetadata.org as string ?? '';

    const trans = await db.select().from(transactions).where(eq(transactions.club, club));
    return Response.json({trans})
}

export async function POST(request: Request) {
    const body = await request.json() as TransactionType

    const user = await currentUser();
    const club = user?.publicMetadata.org as string ?? '';

    await db.insert(transactions).values({...body, club:club});

    return Response.json({status: "created"})
}
