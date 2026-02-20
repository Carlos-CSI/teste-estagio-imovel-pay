import { BillingModel, BillingStatus } from "../model/BillingModel";
import { db } from "../db";
import { billingsTable } from "../db/schema";
import { eq } from "drizzle-orm";

interface BillingModelWithId extends BillingModel {
    id: number
}

export class BillingRepository {
    

    find() {
        return db.select().from(billingsTable)
    }

    async create(billing: BillingModel) {
        const [result] = await db.insert(billingsTable).values({...billing, dueDate: new Date(billing.dueDate)})
        const [newBilling] = await db.select().from(billingsTable).where(eq(billingsTable.id, result.insertId))
        return newBilling
    }

    async update(id: number, status: BillingStatus) {
        const [result] = await db.update(billingsTable).set({status}).where(eq(billingsTable.id, id))
        const [newBilling] = await db.select().from(billingsTable).where(eq(billingsTable.id, id))
        return newBilling
    }
}

