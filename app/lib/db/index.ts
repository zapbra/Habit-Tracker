import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

const connectionString =
    process.env.DATABASE_PUBLIC_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_PUBLIC_URL or DATABASE_URL must be set");
}
const pool = new Pool({
    connectionString,
});

export const db = drizzle(pool, { schema });
