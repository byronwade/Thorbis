import type { Config } from "drizzle-kit";

const isProduction = process.env.NODE_ENV === "production";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: isProduction ? "postgresql" : "sqlite",
  dbCredentials: isProduction
    ? {
        url: process.env.DATABASE_URL!,
      }
    : {
        url: "local.db",
      },
  verbose: true,
  strict: true,
} satisfies Config;
