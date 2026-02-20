import { date, int, mysqlEnum, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { BillingStatus } from "../model/BillingModel"

export const billingsTable = mysqlTable('billings_table', {
    id: serial('id').primaryKey(),
    clientName: varchar('client_name', { length: 255 }).notNull(),
    value: int('value').notNull(),
    dueDate: date('due_date').notNull(),
    status: mysqlEnum('status', [BillingStatus.PENDING, BillingStatus.PAID])
        .default(BillingStatus.PENDING)
        .notNull()
});