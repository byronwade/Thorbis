import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, ".env.local") });

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

console.log("Drizzle Config:");
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  isProduction:", isProduction);
console.log("  Database URL:", databaseUrl ? "✓ Found" : "✗ Not found");

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: isProduction ? "postgresql" : "sqlite",
  dbCredentials: isProduction
    ? {
        url: databaseUrl!,
      }
    : {
        url: "local.db",
      },
  verbose: true,
  strict: true,
} satisfies Config;
