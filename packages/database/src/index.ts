// @stratos/database - Supabase client and types
// Re-exports database utilities for use across apps
// Use specific imports (@stratos/database/server, @stratos/database/client) to avoid conflicts

export { createClient as createBrowserClient } from "./client";
export * from "./error-helpers";
export { createClient as createServerClient } from "./server";
export {
	createServiceSupabaseClient,
	type ServiceSupabaseClient,
} from "./service-client";
export * from "./types";
