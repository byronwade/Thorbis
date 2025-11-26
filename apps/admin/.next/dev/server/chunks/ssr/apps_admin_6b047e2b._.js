module.exports = [
	"[project]/apps/admin/src/lib/supabase/admin-client.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"createAdminClient",
			() => createAdminClient,
			"getAdminClient",
			() => getAdminClient,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+supabase-js@2.81.0/node_modules/@supabase/supabase-js/dist/module/index.js [app-rsc] (ecmascript) <locals>",
			);
		function createAdminClient() {
			const supabaseUrl =
				("TURBOPACK compile-time value",
				"https://iwudmixxoozwskgolqlz.supabase.co");
			const serviceRoleKey = process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY;
			if (
				("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
			);
			if (!serviceRoleKey) {
				throw new Error(
					"Missing ADMIN_SUPABASE_SERVICE_ROLE_KEY environment variable. " +
						"Get this from Supabase dashboard -> Settings -> API -> service_role key",
				);
			}
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])(supabaseUrl, serviceRoleKey, {
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			});
		}
		/**
		 * Type-safe admin client singleton for repeated use
		 */ let adminClientInstance = null;
		function getAdminClient() {
			if (!adminClientInstance) {
				adminClientInstance = createAdminClient();
			}
			return adminClientInstance;
		}
	},
	"[project]/apps/admin/src/lib/supabase/web-reader.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"createWebReaderClient",
			() => createWebReaderClient,
			"getWebCompanies",
			() => getWebCompanies,
			"getWebCompany",
			() => getWebCompany,
			"getWebCompanyCustomers",
			() => getWebCompanyCustomers,
			"getWebCompanyInvoices",
			() => getWebCompanyInvoices,
			"getWebCompanyJobs",
			() => getWebCompanyJobs,
			"getWebCompanyUsers",
			() => getWebCompanyUsers,
			"getWebReaderClient",
			() => getWebReaderClient,
			"searchWebDatabase",
			() => searchWebDatabase,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+supabase-js@2.81.0/node_modules/@supabase/supabase-js/dist/module/index.js [app-rsc] (ecmascript) <locals>",
			);
		function createWebReaderClient() {
			const supabaseUrl = process.env.WEB_SUPABASE_URL;
			const serviceRoleKey = process.env.WEB_SUPABASE_SERVICE_ROLE_KEY;
			if (!supabaseUrl) {
				throw new Error("Missing WEB_SUPABASE_URL environment variable");
			}
			if (!serviceRoleKey) {
				throw new Error(
					"Missing WEB_SUPABASE_SERVICE_ROLE_KEY environment variable",
				);
			}
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])(supabaseUrl, serviceRoleKey, {
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			});
		}
		/**
		 * Type-safe web reader client singleton for repeated use
		 */ let webReaderInstance = null;
		function getWebReaderClient() {
			if (!webReaderInstance) {
				webReaderInstance = createWebReaderClient();
			}
			return webReaderInstance;
		}
		async function getWebCompany(companyId) {
			const client = getWebReaderClient();
			const { data, error } = await client
				.from("companies")
				.select("*")
				.eq("id", companyId)
				.single();
			if (error) throw error;
			return data;
		}
		async function getWebCompanies(options) {
			const client = getWebReaderClient();
			let query = client.from("companies").select("*", {
				count: "exact",
			});
			if (options?.status) {
				query = query.eq("status", options.status);
			}
			if (options?.limit) {
				query = query.limit(options.limit);
			}
			if (options?.offset) {
				query = query.range(
					options.offset,
					options.offset + (options.limit || 50) - 1,
				);
			}
			const { data, error, count } = await query.order("created_at", {
				ascending: false,
			});
			if (error) throw error;
			return {
				data,
				count,
			};
		}
		async function getWebCompanyUsers(companyId) {
			const client = getWebReaderClient();
			const { data, error } = await client
				.from("team_members")
				.select("*")
				.eq("company_id", companyId)
				.order("created_at", {
					ascending: false,
				});
			if (error) throw error;
			return data;
		}
		async function getWebCompanyJobs(companyId, options) {
			const client = getWebReaderClient();
			let query = client
				.from("jobs")
				.select("*")
				.eq("company_id", companyId)
				.order("created_at", {
					ascending: false,
				});
			if (options?.limit) {
				query = query.limit(options.limit);
			}
			const { data, error } = await query;
			if (error) throw error;
			return data;
		}
		async function getWebCompanyCustomers(companyId, options) {
			const client = getWebReaderClient();
			let query = client
				.from("customers")
				.select("*")
				.eq("company_id", companyId)
				.order("created_at", {
					ascending: false,
				});
			if (options?.limit) {
				query = query.limit(options.limit);
			}
			const { data, error } = await query;
			if (error) throw error;
			return data;
		}
		async function getWebCompanyInvoices(companyId, options) {
			const client = getWebReaderClient();
			let query = client
				.from("invoices")
				.select("*")
				.eq("company_id", companyId)
				.order("created_at", {
					ascending: false,
				});
			if (options?.limit) {
				query = query.limit(options.limit);
			}
			const { data, error } = await query;
			if (error) throw error;
			return data;
		}
		async function searchWebDatabase(searchTerm, options) {
			const client = getWebReaderClient();
			const limit = options?.limit || 10;
			// Search companies
			const { data: companies } = await client
				.from("companies")
				.select("id, name, slug")
				.or(`name.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`)
				.limit(limit);
			// Search customers
			const { data: customers } = await client
				.from("customers")
				.select("id, first_name, last_name, email, company_id")
				.or(
					`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`,
				)
				.limit(limit);
			return {
				companies: companies || [],
				customers: customers || [],
			};
		}
	},
	"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript) <locals>",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"createClient",
			() => createClient,
			"getAdminSession",
			() => getAdminSession,
			"getCurrentAdminUser",
			() => getCurrentAdminUser,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+supabase-js@2.81.0/node_modules/@supabase/supabase-js/dist/module/index.js [app-rsc] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)",
			);
		// Re-export the admin client for convenience
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$admin$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/supabase/admin-client.ts [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$web$2d$reader$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/supabase/web-reader.ts [app-rsc] (ecmascript)",
			);
		async function createClient() {
			const supabaseUrl =
				("TURBOPACK compile-time value",
				"https://iwudmixxoozwskgolqlz.supabase.co");
			const serviceRoleKey = process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY;
			const anonKey =
				("TURBOPACK compile-time value",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dWRtaXh4b296d3NrZ29scWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDA0NjIsImV4cCI6MjA3OTY3NjQ2Mn0.qeI64HEvKIsGxytOyO0JFkLt2oy3eYr2zjIKz11YrgI");
			// Use service role key if available, otherwise fall back to anon key
			const key = serviceRoleKey || anonKey;
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])(supabaseUrl, key, {
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			});
		}
		async function getAdminSession() {
			const cookieStore = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"cookies"
			])();
			const sessionToken = cookieStore.get("admin_session")?.value;
			if (!sessionToken) {
				return null;
			}
			// Verify and decode the session token
			const { verifySessionToken } = await __turbopack_context__.A(
				"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript, async loader)",
			);
			return verifySessionToken(sessionToken);
		}
		async function getCurrentAdminUser() {
			const session = await getAdminSession();
			if (!session) {
				return null;
			}
			const supabase = await createClient();
			const { data, error } = await supabase
				.from("admin_users")
				.select("*")
				.eq("id", session.userId)
				.single();
			if (error || !data) {
				return null;
			}
			return data;
		}
	},
	"[project]/apps/admin/src/lib/admin-auth.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Admin Authentication Utilities
		 *
		 * Validates that users are authorized Thorbis employees.
		 * Uses strict domain validation to prevent unauthorized access.
		 *
		 * Security measures:
		 * - Case-insensitive domain matching
		 * - Whitespace trimming
		 * - Multiple @ symbol detection (email injection)
		 * - Subdomain validation (prevents attacker.thorbis.com.evil.com)
		 * - Empty/null handling
		 */ // Authorized admin domains (must be exact match, no subdomains)
		__turbopack_context__.s([
			"getAllowedDomains",
			() => getAllowedDomains,
			"getEmailDomain",
			() => getEmailDomain,
			"isAdminEmail",
			() => isAdminEmail,
		]);
		const ALLOWED_DOMAINS = ["thorbis.com", "stratos.com"];
		// Email validation regex (basic RFC 5322 compliance)
		const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		/**
		 * Validate and normalize email address
		 *
		 * @param email - Email to validate
		 * @returns Normalized email or null if invalid
		 */ function normalizeEmail(email) {
			if (!email || typeof email !== "string") {
				return null;
			}
			// Trim whitespace
			const trimmed = email.trim().toLowerCase();
			// Check for empty string
			if (trimmed.length === 0) {
				return null;
			}
			// Check for multiple @ symbols (potential injection)
			const atCount = (trimmed.match(/@/g) || []).length;
			if (atCount !== 1) {
				return null;
			}
			// Basic format validation
			if (!EMAIL_REGEX.test(trimmed)) {
				return null;
			}
			return trimmed;
		}
		/**
		 * Extract and validate domain from email
		 *
		 * Prevents attacks like:
		 * - user@thorbis.com.evil.com (subdomain of evil.com)
		 * - user@evil.com\n@thorbis.com (newline injection)
		 * - user@thorbis.com%00@evil.com (null byte injection)
		 *
		 * @param email - Normalized email address
		 * @returns Domain or null if invalid
		 */ function extractDomain(email) {
			const parts = email.split("@");
			if (parts.length !== 2) {
				return null;
			}
			const domain = parts[1];
			if (!domain) {
				return null;
			}
			// Check for suspicious characters
			if (/[\s\n\r\0%]/.test(domain)) {
				return null;
			}
			// Must be exact domain match (no subdomains of allowed domains)
			// e.g., "mail.thorbis.com" would NOT be allowed
			return domain;
		}
		function isAdminEmail(email) {
			const normalized = normalizeEmail(email);
			if (!normalized) {
				return false;
			}
			const domain = extractDomain(normalized);
			if (!domain) {
				return false;
			}
			// Exact domain match only (case-insensitive already from normalization)
			return ALLOWED_DOMAINS.includes(domain);
		}
		function getEmailDomain(email) {
			const normalized = normalizeEmail(email);
			if (!normalized) {
				return null;
			}
			return extractDomain(normalized);
		}
		function getAllowedDomains() {
			return ALLOWED_DOMAINS;
		}
	},
	"[project]/apps/admin/src/lib/security/rate-limit.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Admin Rate Limiting
		 *
		 * Protects against brute force attacks on admin login.
		 * More restrictive than contractor app due to higher privileges.
		 *
		 * Limits:
		 * - Auth: 3 attempts per 30 minutes per email
		 * - Auth: 10 attempts per 30 minutes per IP
		 * - After lockout: exponential backoff
		 */ __turbopack_context__.s([
			"RateLimitError",
			() => RateLimitError,
			"checkAdminAuthRateLimit",
			() => checkAdminAuthRateLimit,
			"getClientIP",
			() => getClientIP,
			"resetRateLimitForEmail",
			() => resetRateLimitForEmail,
		]);
		class AdminRateLimiter {
			requests;
			maxRequests;
			windowMs;
			lockoutMultiplier;
			constructor(maxRequests, windowMs, lockoutMultiplier = 2) {
				this.requests = new Map();
				this.maxRequests = maxRequests;
				this.windowMs = windowMs;
				this.lockoutMultiplier = lockoutMultiplier;
				// Cleanup old entries every minute
				if (typeof setInterval !== "undefined") {
					setInterval(() => this.cleanup(), 60_000);
				}
			}
			async limit(identifier) {
				const now = Date.now();
				const key = identifier.toLowerCase(); // Normalize for case-insensitive matching
				let record = this.requests.get(key);
				// Initialize if doesn't exist
				if (!record) {
					record = {
						count: 0,
						requests: [],
					};
					this.requests.set(key, record);
				}
				// Check if currently locked out
				if (record.lockedUntil && now < record.lockedUntil) {
					return {
						success: false,
						limit: this.maxRequests,
						remaining: 0,
						reset: record.lockedUntil,
						locked: true,
						lockoutEnds: record.lockedUntil,
					};
				}
				// Clear lockout if expired
				if (record.lockedUntil && now >= record.lockedUntil) {
					record.lockedUntil = undefined;
				}
				// Remove requests outside the sliding window
				record.requests = record.requests.filter(
					(timestamp) => timestamp > now - this.windowMs,
				);
				// Check if limit exceeded
				if (record.requests.length >= this.maxRequests) {
					// Apply lockout with exponential backoff
					const lockoutDuration =
						this.windowMs *
						this.lockoutMultiplier **
							Math.floor(record.requests.length / this.maxRequests);
					record.lockedUntil = now + lockoutDuration;
					return {
						success: false,
						limit: this.maxRequests,
						remaining: 0,
						reset: record.lockedUntil,
						locked: true,
						lockoutEnds: record.lockedUntil,
					};
				}
				// Add new request
				record.requests.push(now);
				record.count = record.requests.length;
				return {
					success: true,
					limit: this.maxRequests,
					remaining: this.maxRequests - record.count,
					reset: now + this.windowMs,
					locked: false,
				};
			}
			cleanup() {
				const now = Date.now();
				for (const [key, record] of this.requests.entries()) {
					record.requests = record.requests.filter(
						(timestamp) => timestamp > now - this.windowMs,
					);
					// Remove if no recent requests and no active lockout
					if (
						record.requests.length === 0 &&
						(!record.lockedUntil || now >= record.lockedUntil)
					) {
						this.requests.delete(key);
					}
				}
			}
			reset(identifier) {
				this.requests.delete(identifier.toLowerCase());
			}
			clear() {
				this.requests.clear();
			}
		}
		// Admin auth rate limiter - stricter than contractor app
		// 3 attempts per 30 minutes, with exponential lockout
		const adminAuthByEmailLimiter = new AdminRateLimiter(3, 30 * 60 * 1000, 2);
		// IP-based limiter to prevent distributed attacks
		const adminAuthByIPLimiter = new AdminRateLimiter(10, 30 * 60 * 1000, 2);
		class RateLimitError extends Error {
			retryAfter;
			locked;
			constructor(message, retryAfter, locked) {
				super(message);
				this.name = "RateLimitError";
				this.retryAfter = retryAfter;
				this.locked = locked;
			}
		}
		async function checkAdminAuthRateLimit(email, ip) {
			// Check email-based limit
			const emailResult = await adminAuthByEmailLimiter.limit(email);
			if (!emailResult.success) {
				const retryAfterMs = emailResult.reset - Date.now();
				const retryAfterSec = Math.ceil(retryAfterMs / 1000);
				const minutes = Math.ceil(retryAfterSec / 60);
				throw new RateLimitError(
					emailResult.locked
						? `Account temporarily locked. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
						: `Too many login attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
					retryAfterMs,
					emailResult.locked,
				);
			}
			// Check IP-based limit
			const ipResult = await adminAuthByIPLimiter.limit(ip);
			if (!ipResult.success) {
				const retryAfterMs = ipResult.reset - Date.now();
				const retryAfterSec = Math.ceil(retryAfterMs / 1000);
				const minutes = Math.ceil(retryAfterSec / 60);
				throw new RateLimitError(
					`Too many requests from this location. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
					retryAfterMs,
					ipResult.locked,
				);
			}
		}
		function resetRateLimitForEmail(email) {
			adminAuthByEmailLimiter.reset(email);
		}
		function getClientIP(headers) {
			// Check common proxy headers in order of preference
			const forwarded = headers.get("x-forwarded-for");
			if (forwarded) {
				return forwarded.split(",")[0].trim();
			}
			const realIP = headers.get("x-real-ip");
			if (realIP) {
				return realIP;
			}
			const cfIP = headers.get("cf-connecting-ip"); // Cloudflare
			if (cfIP) {
				return cfIP;
			}
			const vercelIP = headers.get("x-vercel-forwarded-for");
			if (vercelIP) {
				return vercelIP.split(",")[0].trim();
			}
			return "unknown";
		}
	},
	"[project]/apps/admin/src/lib/security/audit-log.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Admin Audit Logging
		 *
		 * Logs all authentication and security events for the admin dashboard.
		 * Critical for compliance, security monitoring, and incident response.
		 *
		 * Events logged:
		 * - Login attempts (success/failure)
		 * - Logout events
		 * - Session refreshes
		 * - Unauthorized access attempts
		 * - Rate limit violations
		 * - Domain validation failures
		 */ __turbopack_context__.s([
			"logAdminAuthEvent",
			() => logAdminAuthEvent,
			"logAdminLoginFailure",
			() => logAdminLoginFailure,
			"logAdminLoginSuccess",
			() => logAdminLoginSuccess,
			"logInvalidDomainAttempt",
			() => logInvalidDomainAttempt,
			"logRateLimitExceeded",
			() => logRateLimitExceeded,
			"logUnauthorizedAccess",
			() => logUnauthorizedAccess,
		]);
		/**
		 * Determine severity based on event type
		 */ function getSeverity(eventType, success) {
			switch (eventType) {
				case "LOGIN_SUCCESS":
				case "LOGOUT":
				case "SESSION_REFRESH":
					return "INFO";
				case "LOGIN_ATTEMPT":
					return "INFO";
				case "LOGIN_FAILURE":
					return "WARN";
				case "RATE_LIMIT_EXCEEDED":
				case "INVALID_DOMAIN":
					return "WARN";
				case "UNAUTHORIZED_ACCESS":
					return "ERROR";
				case "SUSPICIOUS_ACTIVITY":
					return "CRITICAL";
				default:
					return success ? "INFO" : "WARN";
			}
		}
		async function logAdminAuthEvent(eventType, options) {
			const event = {
				timestamp: new Date().toISOString(),
				eventType,
				severity: getSeverity(eventType, options.success),
				email: options.email ? maskEmail(options.email) : undefined,
				ip: options.ip,
				userAgent: options.userAgent,
				details: options.details,
				success: options.success,
			};
			// Log to console in structured format
			const logMessage = formatLogMessage(event);
			switch (event.severity) {
				case "CRITICAL":
				case "ERROR":
					console.error(logMessage);
					break;
				case "WARN":
					console.warn(logMessage);
					break;
				default:
					console.log(logMessage);
			}
			// In production, send to logging service
			// await sendToLoggingService(event);
		}
		/**
		 * Format log message for structured logging
		 */ function formatLogMessage(event) {
			const base = `[ADMIN_AUTH] [${event.severity}] ${event.eventType}`;
			const details = [
				event.email && `email=${event.email}`,
				event.ip && `ip=${event.ip}`,
				`success=${event.success}`,
				event.details && `details=${JSON.stringify(event.details)}`,
			]
				.filter(Boolean)
				.join(" ");
			return `${base} ${details}`;
		}
		/**
		 * Mask email for privacy in logs
		 * user@domain.com -> u***@domain.com
		 */ function maskEmail(email) {
			const [local, domain] = email.split("@");
			if (!local || !domain) return "***@***";
			if (local.length <= 2) {
				return `${local[0]}***@${domain}`;
			}
			return `${local[0]}***${local[local.length - 1]}@${domain}`;
		}
		async function logAdminLoginSuccess(email, ip, userAgent) {
			await logAdminAuthEvent("LOGIN_SUCCESS", {
				email,
				ip,
				userAgent,
				success: true,
			});
		}
		async function logAdminLoginFailure(email, ip, reason, userAgent) {
			await logAdminAuthEvent("LOGIN_FAILURE", {
				email,
				ip,
				userAgent,
				success: false,
				details: {
					reason,
				},
			});
		}
		async function logRateLimitExceeded(email, ip, lockedUntil) {
			await logAdminAuthEvent("RATE_LIMIT_EXCEEDED", {
				email,
				ip,
				success: false,
				details: {
					lockedUntil: lockedUntil
						? new Date(lockedUntil).toISOString()
						: undefined,
				},
			});
		}
		async function logInvalidDomainAttempt(email, ip) {
			await logAdminAuthEvent("INVALID_DOMAIN", {
				email,
				ip,
				success: false,
				details: {
					domain: email.split("@")[1]?.toLowerCase(),
					message: "Non-admin domain attempted admin login",
				},
			});
		}
		async function logUnauthorizedAccess(email, ip, path) {
			await logAdminAuthEvent("UNAUTHORIZED_ACCESS", {
				email,
				ip,
				success: false,
				details: {
					path,
				},
			});
		}
	},
	"[project]/apps/admin/src/actions/auth.ts [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/* __next_internal_action_entry_do_not_use__ [{"002e1c391f094ec56a7471346238e872ae87d32f61":"adminSignOut","40c8fabab10a3afae1dc2c6e3f07a4797e6cfb34b0":"adminSignIn"},"",""] */ __turbopack_context__.s(
			["adminSignIn", () => adminSignIn, "adminSignOut", () => adminSignOut],
		);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/admin-auth.ts [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/security/rate-limit.ts [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/security/audit-log.ts [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)",
			);
		async function adminSignIn(formData) {
			const email = formData.get("email")?.trim().toLowerCase();
			const password = formData.get("password");
			// Get client info for rate limiting and logging
			const headersList = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"headers"
			])();
			const ip = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"getClientIP"
			])(headersList);
			const userAgent = headersList.get("user-agent") || undefined;
			// Validate inputs
			if (!email || !password) {
				return {
					success: false,
					error: "Email and password are required.",
				};
			}
			// Check rate limits BEFORE any other validation
			try {
				await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"checkAdminAuthRateLimit"
				])(email, ip);
			} catch (error) {
				if (
					error instanceof
					__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"RateLimitError"
					]
				) {
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"logRateLimitExceeded"
					])(email, ip, Date.now() + error.retryAfter);
					return {
						success: false,
						error: error.message,
						rateLimited: true,
						retryAfter: error.retryAfter,
					};
				}
				throw error;
			}
			// Validate admin domain BEFORE attempting authentication
			// This prevents timing attacks that could reveal valid accounts
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isAdminEmail"
				])(email)
			) {
				await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"logInvalidDomainAttempt"
				])(email, ip);
				return {
					success: false,
					error:
						"Access denied. Admin access is restricted to Thorbis employees.",
				};
			}
			// Attempt authentication
			const supabase = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"createClient"
			])();
			const { data, error: authError } = await supabase.auth.signInWithPassword(
				{
					email,
					password,
				},
			);
			if (authError) {
				await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"logAdminLoginFailure"
				])(email, ip, authError.message, userAgent);
				return {
					success: false,
					error: "Invalid email or password.",
				};
			}
			// Double-check the authenticated user's email domain
			// Defense in depth - in case of any bypasses
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isAdminEmail"
				])(data.user?.email)
			) {
				await supabase.auth.signOut();
				await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"logAdminLoginFailure"
				])(email, ip, "Email domain mismatch after auth", userAgent);
				return {
					success: false,
					error:
						"Access denied. Admin access is restricted to Thorbis employees.",
				};
			}
			// Success - reset rate limit and log
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"resetRateLimitForEmail"
			])(email);
			await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"logAdminLoginSuccess"
			])(email, ip, userAgent);
			return {
				success: true,
			};
		}
		async function adminSignOut() {
			try {
				const supabase = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"createClient"
				])();
				const { error } = await supabase.auth.signOut();
				if (error) {
					return {
						success: false,
						error: error.message,
					};
				}
				return {
					success: true,
				};
			} catch {
				return {
					success: false,
					error: "Failed to sign out. Please try again.",
				};
			}
		}
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"ensureServerEntryExports"
		])([adminSignIn, adminSignOut]);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(adminSignIn, "40c8fabab10a3afae1dc2c6e3f07a4797e6cfb34b0", null);
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
			"registerServerReference"
		])(adminSignOut, "002e1c391f094ec56a7471346238e872ae87d32f61", null);
	},
	'[project]/apps/admin/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin/src/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>',
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/actions/auth.ts [app-rsc] (ecmascript)",
			);
	},
	'[project]/apps/admin/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin/src/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript)',
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"40c8fabab10a3afae1dc2c6e3f07a4797e6cfb34b0",
			() =>
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"adminSignIn"
				],
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				'[project]/apps/admin/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin/src/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>',
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/actions/auth.ts [app-rsc] (ecmascript)",
			);
	},
];

//# sourceMappingURL=apps_admin_6b047e2b._.js.map
