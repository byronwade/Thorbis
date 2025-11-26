(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
	"chunks/[root-of-the-server]__05240214._.js",
	"[externals]/node:buffer [external] (node:buffer, cjs)",
	(__turbopack_context__, module, exports) => {
		const mod = __turbopack_context__.x("node:buffer", () =>
			require("node:buffer"),
		);

		module.exports = mod;
	},
	"[externals]/node:async_hooks [external] (node:async_hooks, cjs)",
	(__turbopack_context__, module, exports) => {
		const mod = __turbopack_context__.x("node:async_hooks", () =>
			require("node:async_hooks"),
		);

		module.exports = mod;
	},
	"[project]/apps/admin/src/middleware.ts [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"config",
			() => config,
			"middleware",
			() => middleware,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)",
			);
		/**
		 * Security Headers for Admin Dashboard
		 */ const SECURITY_HEADERS = {
			"X-Frame-Options": "DENY",
			"X-Content-Type-Options": "nosniff",
			"X-XSS-Protection": "1; mode=block",
			"Referrer-Policy": "strict-origin-when-cross-origin",
			"Permissions-Policy":
				"camera=(), microphone=(), geolocation=(), payment=()",
			"Content-Security-Policy": [
				"default-src 'self'",
				"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
				"style-src 'self' 'unsafe-inline'",
				"img-src 'self' data: https: blob:",
				"font-src 'self' data:",
				"connect-src 'self' https://*.supabase.co wss://*.supabase.co",
				"frame-ancestors 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			].join("; "),
		};
		const SESSION_COOKIE_NAME = "admin_session";
		/**
		 * Verify JWT token from cookie
		 */ async function verifyToken(token) {
			try {
				const secret = process.env.ADMIN_JWT_SECRET;
				if (!secret) {
					console.error("Missing ADMIN_JWT_SECRET");
					return false;
				}
				const secretKey = new TextEncoder().encode(secret);
				const { payload } = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
					"jwtVerify"
				])(token, secretKey);
				// Check if token is expired
				if (payload.exp && payload.exp * 1000 < Date.now()) {
					return false;
				}
				return true;
			} catch (error) {
				console.error("Token verification failed:", error);
				return false;
			}
		}
		async function middleware(request) {
			const response =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
					"NextResponse"
				].next();
			// Get session cookie
			const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
			const isLoginPage = request.nextUrl.pathname === "/login";
			const isProtectedRoute =
				request.nextUrl.pathname.startsWith("/dashboard");
			const isApiRoute = request.nextUrl.pathname.startsWith("/api");
			// Skip auth check for API routes (they handle their own auth)
			if (isApiRoute) {
				return applySecurityHeaders(response);
			}
			// Verify session for protected routes
			if (isProtectedRoute) {
				if (!sessionToken) {
					// No session - redirect to login
					const url = request.nextUrl.clone();
					url.pathname = "/login";
					return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"NextResponse"
					].redirect(url);
				}
				const isValidSession = await verifyToken(sessionToken);
				if (!isValidSession) {
					// Invalid session - clear cookie and redirect to login
					const url = request.nextUrl.clone();
					url.pathname = "/login";
					const redirectResponse =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"NextResponse"
						].redirect(url);
					redirectResponse.cookies.delete(SESSION_COOKIE_NAME);
					return redirectResponse;
				}
			}
			// If authenticated user tries to access login page, redirect to dashboard
			if (isLoginPage && sessionToken) {
				const isValidSession = await verifyToken(sessionToken);
				if (isValidSession) {
					const url = request.nextUrl.clone();
					url.pathname = "/dashboard";
					return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"NextResponse"
					].redirect(url);
				}
			}
			return applySecurityHeaders(response);
		}
		/**
		 * Apply security headers to response
		 */ function applySecurityHeaders(response) {
			Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
				response.headers.set(key, value);
			});
			return response;
		}
		const config = {
			matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
		};
	},
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__05240214._.js.map
