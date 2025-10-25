import Database from "better-sqlite3";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Database client - automatically uses SQLite in development, PostgreSQL in production
 */
export const db = isProduction
  ? (() => {
      if (!process.env.DATABASE_URL) {
        throw new Error(
          "DATABASE_URL environment variable is required in production"
        );
      }
      const client = postgres(process.env.DATABASE_URL);
      return drizzlePostgres(client, { schema });
    })()
  : (() => {
      const sqlite = new Database("local.db");
      return drizzleSQLite(sqlite, { schema });
    })();

/**
 * Export the schema for use in queries
 */
export { schema };

/**
 * Helper to check which database is being used
 */
export const getDatabaseType = () => (isProduction ? "postgresql" : "sqlite");

/**
 * Re-export types from schema
 */
export type {
  NewPost,
  NewUser,
  Post,
  User,
} from "./schema";
