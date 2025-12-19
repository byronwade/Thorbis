/**
 * Convex HTTP Routes
 *
 * HTTP endpoints for authentication and various integrations.
 */
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// ============================================================================
// BETTER AUTH ROUTES
// ============================================================================

// Register all Better Auth HTTP routes (handles /api/auth/* paths)
// Enable CORS for cross-origin requests from localhost during development
authComponent.registerRoutes(http, createAuth, {
	cors: {
		allowedOrigins: [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
			process.env.SITE_URL || "",
		].filter(Boolean),
		allowedHeaders: ["Content-Type", "Authorization"],
		exposedHeaders: ["Set-Cookie"],
	},
});

// ============================================================================
// DEVELOPMENT ENDPOINTS (should be disabled in production)
// ============================================================================

/**
 * Seed the database via HTTP POST
 * POST /dev/seed
 *
 * Body: { "clear": true } to clear and reseed
 */
http.route({
	path: "/dev/seed",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		// Check for development mode (you can add more security checks here)
		const isDev =
			process.env.CONVEX_SITE_URL?.includes("localhost") ||
			process.env.NODE_ENV === "development" ||
			true; // Allow for demo purposes - remove in production!

		if (!isDev) {
			return new Response(
				JSON.stringify({ error: "Seed endpoint only available in development" }),
				{ status: 403, headers: { "Content-Type": "application/json" } }
			);
		}

		try {
			const body = await request.json().catch(() => ({}));
			const shouldClear = (body as { clear?: boolean }).clear === true;

			let result;
			if (shouldClear) {
				result = await ctx.runAction(internal.seed.index.clearAndSeed, {});
			} else {
				result = await ctx.runAction(internal.seed.index.seedDatabase, {});
			}

			return new Response(JSON.stringify(result), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: String(error) }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}
	}),
});

/**
 * Check seed status via HTTP GET
 * GET /dev/seed/status
 */
http.route({
	path: "/dev/seed/status",
	method: "GET",
	handler: httpAction(async (ctx) => {
		try {
			const result = await ctx.runQuery(internal.seed.mutations.checkIfSeeded, {});
			return new Response(JSON.stringify(result), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: String(error) }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}
	}),
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Health check endpoint
 * GET /health
 */
http.route({
	path: "/health",
	method: "GET",
	handler: httpAction(async () => {
		return new Response(JSON.stringify({ status: "ok", timestamp: Date.now() }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}),
});

export default http;
