import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const connectionString =
    process.env.DATABASE_URL ?? process.env.DATABASE_PUBLIC_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL or DATABASE_PUBLIC_URL is not set");
}

export default defineConfig({
    schema: "./app/lib/db/schema.ts", // ← this works from the root
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: connectionString,
    },
});
