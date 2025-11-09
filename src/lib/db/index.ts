import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Database client - uses PostgreSQL/Supabase in production
 *
 * Note: SQLite support removed - this project uses Supabase (PostgreSQL) only
 */
export const db = (() => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required. Use Supabase connection string."
    );
  }
  const client = postgres(process.env.DATABASE_URL);
  return drizzlePostgres(client, { schema });
})();

/**
 * Export the schema for use in queries
 */
export { schema };

/**
 * Helper to check which database is being used
 */
export const getDatabaseType = () => "postgresql";

/**
 * Re-export types from schema
 */
export type {
  NewPost,
  NewUser,
  Post,
  User,
} from "./schema";
