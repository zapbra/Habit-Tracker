import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./app/lib/db/schema.ts", // ← this works from the root
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
});
