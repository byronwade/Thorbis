module.exports = [
	"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"cleanupExpiredSessions",
			() => cleanupExpiredSessions,
			"createSession",
			() => createSession,
			"destroySession",
			() => destroySession,
			"getSession",
			() => getSession,
			"revokeAllUserSessions",
			() => revokeAllUserSessions,
			"verifySessionToken",
			() => verifySessionToken,
		]);
		(() => {
			const e = new Error("Cannot find module 'jose'");
			e.code = "MODULE_NOT_FOUND";
			throw e;
		})();
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript) <locals>",
			);
		/**
		 * Admin Session Management
		 *
		 * Uses JWT tokens stored in HTTP-only cookies for authentication.
		 * Sessions are also tracked in the database for revocation support.
		 */ const SESSION_COOKIE_NAME = "admin_session";
		const SESSION_DURATION_DAYS = 7;
		/**
		 * Get the JWT secret from environment
		 */ function getJwtSecret() {
			const secret = process.env.ADMIN_JWT_SECRET;
			if (!secret) {
				throw new Error("Missing ADMIN_JWT_SECRET environment variable");
			}
			return new TextEncoder().encode(secret);
		}
		async function createSession(userId, email, role, ipAddress, userAgent) {
			const supabase = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])();
			// Calculate expiration
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
			// Generate session ID
			const sessionId = crypto.randomUUID();
			// Create JWT token
			const token = await new SignJWT({
				userId,
				email,
				role,
				sessionId,
			})
				.setProtectedHeader({
					alg: "HS256",
				})
				.setIssuedAt()
				.setExpirationTime(expiresAt)
				.sign(getJwtSecret());
			// Hash the token for storage
			const tokenHash = await hashToken(token);
			// Store session in database
			const { error } = await supabase.from("admin_sessions").insert({
				id: sessionId,
				admin_user_id: userId,
				token_hash: tokenHash,
				ip_address: ipAddress,
				user_agent: userAgent,
				expires_at: expiresAt.toISOString(),
			});
			if (error) {
				throw new Error(`Failed to create session: ${error.message}`);
			}
			// Set cookie
			const cookieStore = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"cookies"
			])();
			cookieStore.set(SESSION_COOKIE_NAME, token, {
				httpOnly: true,
				secure:
					("TURBOPACK compile-time value", "development") === "production",
				sameSite: "lax",
				path: "/",
				expires: expiresAt,
			});
			return token;
		}
		async function verifySessionToken(token) {
			try {
				const { payload } = await jwtVerify(token, getJwtSecret());
				// Check if session exists and is not revoked
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"createClient"
				])();
				const { data: session, error } = await supabase
					.from("admin_sessions")
					.select("*")
					.eq("id", payload.sessionId)
					.is("revoked_at", null)
					.single();
				if (error || !session) {
					return null;
				}
				// Check expiration
				if (new Date(session.expires_at) < new Date()) {
					return null;
				}
				return payload;
			} catch {
				return null;
			}
		}
		async function getSession() {
			const cookieStore = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"cookies"
			])();
			const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
			if (!token) {
				return null;
			}
			return verifySessionToken(token);
		}
		async function destroySession() {
			const session = await getSession();
			if (session) {
				// Revoke session in database
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"createClient"
				])();
				await supabase
					.from("admin_sessions")
					.update({
						revoked_at: new Date().toISOString(),
					})
					.eq("id", session.sessionId);
			}
			// Clear cookie
			const cookieStore = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"cookies"
			])();
			cookieStore.delete(SESSION_COOKIE_NAME);
		}
		async function revokeAllUserSessions(userId) {
			const supabase = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])();
			await supabase
				.from("admin_sessions")
				.update({
					revoked_at: new Date().toISOString(),
				})
				.eq("admin_user_id", userId)
				.is("revoked_at", null);
		}
		/**
		 * Hash a token for storage
		 */ async function hashToken(token) {
			const encoder = new TextEncoder();
			const data = encoder.encode(token);
			const hashBuffer = await crypto.subtle.digest("SHA-256", data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
		}
		async function cleanupExpiredSessions() {
			const supabase = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])();
			const { data, error } = await supabase
				.from("admin_sessions")
				.delete()
				.lt("expires_at", new Date().toISOString())
				.select("id");
			if (error) {
				throw new Error(`Failed to cleanup sessions: ${error.message}`);
			}
			return data?.length || 0;
		}
	},
];

//# sourceMappingURL=apps_admin_src_lib_auth_session_ts_777a7544._.js.map
