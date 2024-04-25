import "server-only"

import { db } from "./db"


export async function getBills() {
  const bills = await db.query.bills.findMany({
    with: {
      table: true
    }
  })

  return bills;
}