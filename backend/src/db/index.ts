import { drizzle } from "drizzle-orm/mysql2";
export const db = drizzle("mysql://root:root@localhost:3306/billing_app");
