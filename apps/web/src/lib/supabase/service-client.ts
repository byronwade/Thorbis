/**
 * Supabase Service Client Re-export
 *
 * Re-exports the service client from the shared database package.
 * This provides a consistent import path for the web app.
 */

export {
	createServiceSupabaseClient,
	type ServiceSupabaseClient,
} from "@stratos/database";
