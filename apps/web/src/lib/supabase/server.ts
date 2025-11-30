/**
 * Supabase Server Client Re-export
 *
 * Re-exports the server client from the shared database package.
 * This provides a consistent import path for the web app.
 */

export { createServerClient as createClient } from "@stratos/database";

