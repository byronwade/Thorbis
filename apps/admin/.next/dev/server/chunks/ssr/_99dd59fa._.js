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
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/sign.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)",
			);
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
			const token =
				await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"SignJWT"
				]({
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
				const { payload } = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"jwtVerify"
				])(token, getJwtSecret());
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
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"concat",
			() => concat,
			"decoder",
			() => decoder,
			"encode",
			() => encode,
			"encoder",
			() => encoder,
			"uint32be",
			() => uint32be,
			"uint64be",
			() => uint64be,
		]);
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();
		const MAX_INT32 = 2 ** 32;
		function concat(...buffers) {
			const size = buffers.reduce((acc, { length }) => acc + length, 0);
			const buf = new Uint8Array(size);
			let i = 0;
			for (const buffer of buffers) {
				buf.set(buffer, i);
				i += buffer.length;
			}
			return buf;
		}
		function writeUInt32BE(buf, value, offset) {
			if (value < 0 || value >= MAX_INT32) {
				throw new RangeError(
					`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`,
				);
			}
			buf.set([value >>> 24, value >>> 16, value >>> 8, value & 0xff], offset);
		}
		function uint64be(value) {
			const high = Math.floor(value / MAX_INT32);
			const low = value % MAX_INT32;
			const buf = new Uint8Array(8);
			writeUInt32BE(buf, high, 0);
			writeUInt32BE(buf, low, 4);
			return buf;
		}
		function uint32be(value) {
			const buf = new Uint8Array(4);
			writeUInt32BE(buf, value);
			return buf;
		}
		function encode(string) {
			const bytes = new Uint8Array(string.length);
			for (let i = 0; i < string.length; i++) {
				const code = string.charCodeAt(i);
				if (code > 127) {
					throw new TypeError("non-ASCII string encountered in encode()");
				}
				bytes[i] = code;
			}
			return bytes;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/base64.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"decodeBase64",
			() => decodeBase64,
			"encodeBase64",
			() => encodeBase64,
		]);
		function encodeBase64(input) {
			if (Uint8Array.prototype.toBase64) {
				return input.toBase64();
			}
			const CHUNK_SIZE = 0x8000;
			const arr = [];
			for (let i = 0; i < input.length; i += CHUNK_SIZE) {
				arr.push(
					String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)),
				);
			}
			return btoa(arr.join(""));
		}
		function decodeBase64(encoded) {
			if (Uint8Array.fromBase64) {
				return Uint8Array.fromBase64(encoded);
			}
			const binary = atob(encoded);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			return bytes;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/base64url.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["decode", () => decode, "encode", () => encode]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$base64$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/base64.js [app-rsc] (ecmascript)",
			);
		function decode(input) {
			if (Uint8Array.fromBase64) {
				return Uint8Array.fromBase64(
					typeof input === "string"
						? input
						: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"decoder"
							].decode(input),
					{
						alphabet: "base64url",
					},
				);
			}
			let encoded = input;
			if (encoded instanceof Uint8Array) {
				encoded =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"decoder"
					].decode(encoded);
			}
			encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
			try {
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$base64$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"decodeBase64"
				])(encoded);
			} catch {
				throw new TypeError(
					"The input to be decoded is not correctly encoded.",
				);
			}
		}
		function encode(input) {
			let unencoded = input;
			if (typeof unencoded === "string") {
				unencoded =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encoder"
					].encode(unencoded);
			}
			if (Uint8Array.prototype.toBase64) {
				return unencoded.toBase64({
					alphabet: "base64url",
					omitPadding: true,
				});
			}
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$base64$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"encodeBase64"
			])(unencoded)
				.replace(/=/g, "")
				.replace(/\+/g, "-")
				.replace(/\//g, "_");
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"JOSEAlgNotAllowed",
			() => JOSEAlgNotAllowed,
			"JOSEError",
			() => JOSEError,
			"JOSENotSupported",
			() => JOSENotSupported,
			"JWEDecryptionFailed",
			() => JWEDecryptionFailed,
			"JWEInvalid",
			() => JWEInvalid,
			"JWKInvalid",
			() => JWKInvalid,
			"JWKSInvalid",
			() => JWKSInvalid,
			"JWKSMultipleMatchingKeys",
			() => JWKSMultipleMatchingKeys,
			"JWKSNoMatchingKey",
			() => JWKSNoMatchingKey,
			"JWKSTimeout",
			() => JWKSTimeout,
			"JWSInvalid",
			() => JWSInvalid,
			"JWSSignatureVerificationFailed",
			() => JWSSignatureVerificationFailed,
			"JWTClaimValidationFailed",
			() => JWTClaimValidationFailed,
			"JWTExpired",
			() => JWTExpired,
			"JWTInvalid",
			() => JWTInvalid,
		]);
		class JOSEError extends Error {
			static code = "ERR_JOSE_GENERIC";
			code = "ERR_JOSE_GENERIC";
			constructor(message, options) {
				super(message, options);
				this.name = this.constructor.name;
				Error.captureStackTrace?.(this, this.constructor);
			}
		}
		class JWTClaimValidationFailed extends JOSEError {
			static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
			code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
			claim;
			reason;
			payload;
			constructor(
				message,
				payload,
				claim = "unspecified",
				reason = "unspecified",
			) {
				super(message, {
					cause: {
						claim,
						reason,
						payload,
					},
				});
				this.claim = claim;
				this.reason = reason;
				this.payload = payload;
			}
		}
		class JWTExpired extends JOSEError {
			static code = "ERR_JWT_EXPIRED";
			code = "ERR_JWT_EXPIRED";
			claim;
			reason;
			payload;
			constructor(
				message,
				payload,
				claim = "unspecified",
				reason = "unspecified",
			) {
				super(message, {
					cause: {
						claim,
						reason,
						payload,
					},
				});
				this.claim = claim;
				this.reason = reason;
				this.payload = payload;
			}
		}
		class JOSEAlgNotAllowed extends JOSEError {
			static code = "ERR_JOSE_ALG_NOT_ALLOWED";
			code = "ERR_JOSE_ALG_NOT_ALLOWED";
		}
		class JOSENotSupported extends JOSEError {
			static code = "ERR_JOSE_NOT_SUPPORTED";
			code = "ERR_JOSE_NOT_SUPPORTED";
		}
		class JWEDecryptionFailed extends JOSEError {
			static code = "ERR_JWE_DECRYPTION_FAILED";
			code = "ERR_JWE_DECRYPTION_FAILED";
			constructor(message = "decryption operation failed", options) {
				super(message, options);
			}
		}
		class JWEInvalid extends JOSEError {
			static code = "ERR_JWE_INVALID";
			code = "ERR_JWE_INVALID";
		}
		class JWSInvalid extends JOSEError {
			static code = "ERR_JWS_INVALID";
			code = "ERR_JWS_INVALID";
		}
		class JWTInvalid extends JOSEError {
			static code = "ERR_JWT_INVALID";
			code = "ERR_JWT_INVALID";
		}
		class JWKInvalid extends JOSEError {
			static code = "ERR_JWK_INVALID";
			code = "ERR_JWK_INVALID";
		}
		class JWKSInvalid extends JOSEError {
			static code = "ERR_JWKS_INVALID";
			code = "ERR_JWKS_INVALID";
		}
		class JWKSNoMatchingKey extends JOSEError {
			static code = "ERR_JWKS_NO_MATCHING_KEY";
			code = "ERR_JWKS_NO_MATCHING_KEY";
			constructor(
				message = "no applicable key found in the JSON Web Key Set",
				options,
			) {
				super(message, options);
			}
		}
		class JWKSMultipleMatchingKeys extends JOSEError {
			[Symbol.asyncIterator];
			static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
			code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
			constructor(
				message = "multiple matching keys found in the JSON Web Key Set",
				options,
			) {
				super(message, options);
			}
		}
		class JWKSTimeout extends JOSEError {
			static code = "ERR_JWKS_TIMEOUT";
			code = "ERR_JWKS_TIMEOUT";
			constructor(message = "request timed out", options) {
				super(message, options);
			}
		}
		class JWSSignatureVerificationFailed extends JOSEError {
			static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
			code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
			constructor(message = "signature verification failed", options) {
				super(message, options);
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/subtle_dsa.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["subtleAlgorithm", () => subtleAlgorithm]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		function subtleAlgorithm(alg, algorithm) {
			const hash = `SHA-${alg.slice(-3)}`;
			switch (alg) {
				case "HS256":
				case "HS384":
				case "HS512":
					return {
						hash,
						name: "HMAC",
					};
				case "PS256":
				case "PS384":
				case "PS512":
					return {
						hash,
						name: "RSA-PSS",
						saltLength: parseInt(alg.slice(-3), 10) >> 3,
					};
				case "RS256":
				case "RS384":
				case "RS512":
					return {
						hash,
						name: "RSASSA-PKCS1-v1_5",
					};
				case "ES256":
				case "ES384":
				case "ES512":
					return {
						hash,
						name: "ECDSA",
						namedCurve: algorithm.namedCurve,
					};
				case "Ed25519":
				case "EdDSA":
					return {
						name: "Ed25519",
					};
				case "ML-DSA-44":
				case "ML-DSA-65":
				case "ML-DSA-87":
					return {
						name: alg,
					};
				default:
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JOSENotSupported"
					](
						`alg ${alg} is not supported either by JOSE or your javascript runtime`,
					);
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/check_key_length.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["checkKeyLength", () => checkKeyLength]);
		function checkKeyLength(alg, key) {
			if (alg.startsWith("RS") || alg.startsWith("PS")) {
				const { modulusLength } = key.algorithm;
				if (typeof modulusLength !== "number" || modulusLength < 2048) {
					throw new TypeError(
						`${alg} requires key modulusLength to be 2048 bits or larger`,
					);
				}
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/crypto_key.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"checkEncCryptoKey",
			() => checkEncCryptoKey,
			"checkSigCryptoKey",
			() => checkSigCryptoKey,
		]);
		const unusable = (name, prop = "algorithm.name") =>
			new TypeError(
				`CryptoKey does not support this operation, its ${prop} must be ${name}`,
			);
		const isAlgorithm = (algorithm, name) => algorithm.name === name;
		function getHashLength(hash) {
			return parseInt(hash.name.slice(4), 10);
		}
		function getNamedCurve(alg) {
			switch (alg) {
				case "ES256":
					return "P-256";
				case "ES384":
					return "P-384";
				case "ES512":
					return "P-521";
				default:
					throw new Error("unreachable");
			}
		}
		function checkUsage(key, usage) {
			if (usage && !key.usages.includes(usage)) {
				throw new TypeError(
					`CryptoKey does not support this operation, its usages must include ${usage}.`,
				);
			}
		}
		function checkSigCryptoKey(key, alg, usage) {
			switch (alg) {
				case "HS256":
				case "HS384":
				case "HS512": {
					if (!isAlgorithm(key.algorithm, "HMAC")) throw unusable("HMAC");
					const expected = parseInt(alg.slice(2), 10);
					const actual = getHashLength(key.algorithm.hash);
					if (actual !== expected)
						throw unusable(`SHA-${expected}`, "algorithm.hash");
					break;
				}
				case "RS256":
				case "RS384":
				case "RS512": {
					if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
						throw unusable("RSASSA-PKCS1-v1_5");
					const expected = parseInt(alg.slice(2), 10);
					const actual = getHashLength(key.algorithm.hash);
					if (actual !== expected)
						throw unusable(`SHA-${expected}`, "algorithm.hash");
					break;
				}
				case "PS256":
				case "PS384":
				case "PS512": {
					if (!isAlgorithm(key.algorithm, "RSA-PSS")) throw unusable("RSA-PSS");
					const expected = parseInt(alg.slice(2), 10);
					const actual = getHashLength(key.algorithm.hash);
					if (actual !== expected)
						throw unusable(`SHA-${expected}`, "algorithm.hash");
					break;
				}
				case "Ed25519":
				case "EdDSA": {
					if (!isAlgorithm(key.algorithm, "Ed25519")) throw unusable("Ed25519");
					break;
				}
				case "ML-DSA-44":
				case "ML-DSA-65":
				case "ML-DSA-87": {
					if (!isAlgorithm(key.algorithm, alg)) throw unusable(alg);
					break;
				}
				case "ES256":
				case "ES384":
				case "ES512": {
					if (!isAlgorithm(key.algorithm, "ECDSA")) throw unusable("ECDSA");
					const expected = getNamedCurve(alg);
					const actual = key.algorithm.namedCurve;
					if (actual !== expected)
						throw unusable(expected, "algorithm.namedCurve");
					break;
				}
				default:
					throw new TypeError("CryptoKey does not support this operation");
			}
			checkUsage(key, usage);
		}
		function checkEncCryptoKey(key, alg, usage) {
			switch (alg) {
				case "A128GCM":
				case "A192GCM":
				case "A256GCM": {
					if (!isAlgorithm(key.algorithm, "AES-GCM")) throw unusable("AES-GCM");
					const expected = parseInt(alg.slice(1, 4), 10);
					const actual = key.algorithm.length;
					if (actual !== expected) throw unusable(expected, "algorithm.length");
					break;
				}
				case "A128KW":
				case "A192KW":
				case "A256KW": {
					if (!isAlgorithm(key.algorithm, "AES-KW")) throw unusable("AES-KW");
					const expected = parseInt(alg.slice(1, 4), 10);
					const actual = key.algorithm.length;
					if (actual !== expected) throw unusable(expected, "algorithm.length");
					break;
				}
				case "ECDH": {
					switch (key.algorithm.name) {
						case "ECDH":
						case "X25519":
							break;
						default:
							throw unusable("ECDH or X25519");
					}
					break;
				}
				case "PBES2-HS256+A128KW":
				case "PBES2-HS384+A192KW":
				case "PBES2-HS512+A256KW":
					if (!isAlgorithm(key.algorithm, "PBKDF2")) throw unusable("PBKDF2");
					break;
				case "RSA-OAEP":
				case "RSA-OAEP-256":
				case "RSA-OAEP-384":
				case "RSA-OAEP-512": {
					if (!isAlgorithm(key.algorithm, "RSA-OAEP"))
						throw unusable("RSA-OAEP");
					const expected = parseInt(alg.slice(9), 10) || 1;
					const actual = getHashLength(key.algorithm.hash);
					if (actual !== expected)
						throw unusable(`SHA-${expected}`, "algorithm.hash");
					break;
				}
				default:
					throw new TypeError("CryptoKey does not support this operation");
			}
			checkUsage(key, usage);
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/invalid_key_input.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"invalidKeyInput",
			() => invalidKeyInput,
			"withAlg",
			() => withAlg,
		]);
		function message(msg, actual, ...types) {
			types = types.filter(Boolean);
			if (types.length > 2) {
				const last = types.pop();
				msg += `one of type ${types.join(", ")}, or ${last}.`;
			} else if (types.length === 2) {
				msg += `one of type ${types[0]} or ${types[1]}.`;
			} else {
				msg += `of type ${types[0]}.`;
			}
			if (actual == null) {
				msg += ` Received ${actual}`;
			} else if (typeof actual === "function" && actual.name) {
				msg += ` Received function ${actual.name}`;
			} else if (typeof actual === "object" && actual != null) {
				if (actual.constructor?.name) {
					msg += ` Received an instance of ${actual.constructor.name}`;
				}
			}
			return msg;
		}
		const invalidKeyInput = (actual, ...types) =>
			message("Key must be ", actual, ...types);
		const withAlg = (alg, actual, ...types) =>
			message(`Key for the ${alg} algorithm must be `, actual, ...types);
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/get_sign_verify_key.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["getSigKey", () => getSigKey]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/crypto_key.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/invalid_key_input.js [app-rsc] (ecmascript)",
			);
		async function getSigKey(alg, key, usage) {
			if (key instanceof Uint8Array) {
				if (!alg.startsWith("HS")) {
					throw new TypeError(
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
							"invalidKeyInput"
						])(key, "CryptoKey", "KeyObject", "JSON Web Key"),
					);
				}
				return crypto.subtle.importKey(
					"raw",
					key,
					{
						hash: `SHA-${alg.slice(-3)}`,
						name: "HMAC",
					},
					false,
					[usage],
				);
			}
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"checkSigCryptoKey"
			])(key, alg, usage);
			return key;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/sign.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["sign", () => sign]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$subtle_dsa$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/subtle_dsa.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_length$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/check_key_length.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$get_sign_verify_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/get_sign_verify_key.js [app-rsc] (ecmascript)",
			);
		async function sign(alg, key, data) {
			const cryptoKey = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$get_sign_verify_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"getSigKey"
			])(alg, key, "sign");
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_length$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"checkKeyLength"
			])(alg, cryptoKey);
			const signature = await crypto.subtle.sign(
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$subtle_dsa$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"subtleAlgorithm"
				])(alg, cryptoKey.algorithm),
				cryptoKey,
				data,
			);
			return new Uint8Array(signature);
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_disjoint.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["isDisjoint", () => isDisjoint]);
		function isDisjoint(...headers) {
			const sources = headers.filter(Boolean);
			if (sources.length === 0 || sources.length === 1) {
				return true;
			}
			let acc;
			for (const header of sources) {
				const parameters = Object.keys(header);
				if (!acc || acc.size === 0) {
					acc = new Set(parameters);
					continue;
				}
				for (const parameter of parameters) {
					if (acc.has(parameter)) {
						return false;
					}
					acc.add(parameter);
				}
			}
			return true;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_key_like.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"assertCryptoKey",
			() => assertCryptoKey,
			"isCryptoKey",
			() => isCryptoKey,
			"isKeyLike",
			() => isKeyLike,
			"isKeyObject",
			() => isKeyObject,
		]);
		function assertCryptoKey(key) {
			if (!isCryptoKey(key)) {
				throw new Error("CryptoKey instance expected");
			}
		}
		const isCryptoKey = (key) => {
			if (key?.[Symbol.toStringTag] === "CryptoKey") return true;
			try {
				return key instanceof CryptoKey;
			} catch {
				return false;
			}
		};
		const isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject";
		const isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_object.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["isObject", () => isObject]);
		const isObjectLike = (value) => typeof value === "object" && value !== null;
		function isObject(input) {
			if (
				!isObjectLike(input) ||
				Object.prototype.toString.call(input) !== "[object Object]"
			) {
				return false;
			}
			if (Object.getPrototypeOf(input) === null) {
				return true;
			}
			let proto = input;
			while (Object.getPrototypeOf(proto) !== null) {
				proto = Object.getPrototypeOf(proto);
			}
			return Object.getPrototypeOf(input) === proto;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_jwk.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"isJWK",
			() => isJWK,
			"isPrivateJWK",
			() => isPrivateJWK,
			"isPublicJWK",
			() => isPublicJWK,
			"isSecretJWK",
			() => isSecretJWK,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_object.js [app-rsc] (ecmascript)",
			);
		const isJWK = (key) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"isObject"
			])(key) && typeof key.kty === "string";
		const isPrivateJWK = (key) =>
			key.kty !== "oct" &&
			((key.kty === "AKP" && typeof key.priv === "string") ||
				typeof key.d === "string");
		const isPublicJWK = (key) =>
			key.kty !== "oct" && key.d === undefined && key.priv === undefined;
		const isSecretJWK = (key) => key.kty === "oct" && typeof key.k === "string";
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/check_key_type.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["checkKeyType", () => checkKeyType]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/invalid_key_input.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_key_like.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_jwk.js [app-rsc] (ecmascript)",
			);
		const tag = (key) => key?.[Symbol.toStringTag];
		const jwkMatchesOp = (alg, key, usage) => {
			if (key.use !== undefined) {
				let expected;
				switch (usage) {
					case "sign":
					case "verify":
						expected = "sig";
						break;
					case "encrypt":
					case "decrypt":
						expected = "enc";
						break;
				}
				if (key.use !== expected) {
					throw new TypeError(
						`Invalid key for this operation, its "use" must be "${expected}" when present`,
					);
				}
			}
			if (key.alg !== undefined && key.alg !== alg) {
				throw new TypeError(
					`Invalid key for this operation, its "alg" must be "${alg}" when present`,
				);
			}
			if (Array.isArray(key.key_ops)) {
				let expectedKeyOp;
				switch (true) {
					case usage === "sign" || usage === "verify":
					case alg === "dir":
					case alg.includes("CBC-HS"):
						expectedKeyOp = usage;
						break;
					case alg.startsWith("PBES2"):
						expectedKeyOp = "deriveBits";
						break;
					case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
						if (!alg.includes("GCM") && alg.endsWith("KW")) {
							expectedKeyOp = usage === "encrypt" ? "wrapKey" : "unwrapKey";
						} else {
							expectedKeyOp = usage;
						}
						break;
					case usage === "encrypt" && alg.startsWith("RSA"):
						expectedKeyOp = "wrapKey";
						break;
					case usage === "decrypt":
						expectedKeyOp = alg.startsWith("RSA") ? "unwrapKey" : "deriveBits";
						break;
				}
				if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
					throw new TypeError(
						`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`,
					);
				}
			}
			return true;
		};
		const symmetricTypeCheck = (alg, key, usage) => {
			if (key instanceof Uint8Array) return;
			if (
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isJWK"
				](key)
			) {
				if (
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"isSecretJWK"
					](key) &&
					jwkMatchesOp(alg, key, usage)
				)
					return;
				throw new TypeError(
					`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`,
				);
			}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isKeyLike"
				])(key)
			) {
				throw new TypeError(
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"withAlg"
					])(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"),
				);
			}
			if (key.type !== "secret") {
				throw new TypeError(
					`${tag(key)} instances for symmetric algorithms must be of type "secret"`,
				);
			}
		};
		const asymmetricTypeCheck = (alg, key, usage) => {
			if (
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isJWK"
				](key)
			) {
				switch (usage) {
					case "decrypt":
					case "sign":
						if (
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"isPrivateJWK"
							](key) &&
							jwkMatchesOp(alg, key, usage)
						)
							return;
						throw new TypeError(
							`JSON Web Key for this operation be a private JWK`,
						);
					case "encrypt":
					case "verify":
						if (
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"isPublicJWK"
							](key) &&
							jwkMatchesOp(alg, key, usage)
						)
							return;
						throw new TypeError(
							`JSON Web Key for this operation be a public JWK`,
						);
				}
			}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isKeyLike"
				])(key)
			) {
				throw new TypeError(
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"withAlg"
					])(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"),
				);
			}
			if (key.type === "secret") {
				throw new TypeError(
					`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`,
				);
			}
			if (key.type === "public") {
				switch (usage) {
					case "sign":
						throw new TypeError(
							`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`,
						);
					case "decrypt":
						throw new TypeError(
							`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`,
						);
				}
			}
			if (key.type === "private") {
				switch (usage) {
					case "verify":
						throw new TypeError(
							`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`,
						);
					case "encrypt":
						throw new TypeError(
							`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`,
						);
				}
			}
		};
		function checkKeyType(alg, key, usage) {
			switch (alg.substring(0, 2)) {
				case "A1":
				case "A2":
				case "di":
				case "HS":
				case "PB":
					symmetricTypeCheck(alg, key, usage);
					break;
				default:
					asymmetricTypeCheck(alg, key, usage);
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/validate_crit.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["validateCrit", () => validateCrit]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		function validateCrit(
			Err,
			recognizedDefault,
			recognizedOption,
			protectedHeader,
			joseHeader,
		) {
			if (
				joseHeader.crit !== undefined &&
				protectedHeader?.crit === undefined
			) {
				throw new Err(
					'"crit" (Critical) Header Parameter MUST be integrity protected',
				);
			}
			if (!protectedHeader || protectedHeader.crit === undefined) {
				return new Set();
			}
			if (
				!Array.isArray(protectedHeader.crit) ||
				protectedHeader.crit.length === 0 ||
				protectedHeader.crit.some(
					(input) => typeof input !== "string" || input.length === 0,
				)
			) {
				throw new Err(
					'"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
				);
			}
			let recognized;
			if (recognizedOption !== undefined) {
				recognized = new Map([
					...Object.entries(recognizedOption),
					...recognizedDefault.entries(),
				]);
			} else {
				recognized = recognizedDefault;
			}
			for (const parameter of protectedHeader.crit) {
				if (!recognized.has(parameter)) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JOSENotSupported"
					](`Extension Header Parameter "${parameter}" is not recognized`);
				}
				if (joseHeader[parameter] === undefined) {
					throw new Err(`Extension Header Parameter "${parameter}" is missing`);
				}
				if (
					recognized.get(parameter) &&
					protectedHeader[parameter] === undefined
				) {
					throw new Err(
						`Extension Header Parameter "${parameter}" MUST be integrity protected`,
					);
				}
			}
			return new Set(protectedHeader.crit);
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/jwk_to_key.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["jwkToKey", () => jwkToKey]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		function subtleMapping(jwk) {
			let algorithm;
			let keyUsages;
			switch (jwk.kty) {
				case "AKP": {
					switch (jwk.alg) {
						case "ML-DSA-44":
						case "ML-DSA-65":
						case "ML-DSA-87":
							algorithm = {
								name: jwk.alg,
							};
							keyUsages = jwk.priv ? ["sign"] : ["verify"];
							break;
						default:
							throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"JOSENotSupported"
							]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
					}
					break;
				}
				case "RSA": {
					switch (jwk.alg) {
						case "PS256":
						case "PS384":
						case "PS512":
							algorithm = {
								name: "RSA-PSS",
								hash: `SHA-${jwk.alg.slice(-3)}`,
							};
							keyUsages = jwk.d ? ["sign"] : ["verify"];
							break;
						case "RS256":
						case "RS384":
						case "RS512":
							algorithm = {
								name: "RSASSA-PKCS1-v1_5",
								hash: `SHA-${jwk.alg.slice(-3)}`,
							};
							keyUsages = jwk.d ? ["sign"] : ["verify"];
							break;
						case "RSA-OAEP":
						case "RSA-OAEP-256":
						case "RSA-OAEP-384":
						case "RSA-OAEP-512":
							algorithm = {
								name: "RSA-OAEP",
								hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`,
							};
							keyUsages = jwk.d
								? ["decrypt", "unwrapKey"]
								: ["encrypt", "wrapKey"];
							break;
						default:
							throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"JOSENotSupported"
							]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
					}
					break;
				}
				case "EC": {
					switch (jwk.alg) {
						case "ES256":
							algorithm = {
								name: "ECDSA",
								namedCurve: "P-256",
							};
							keyUsages = jwk.d ? ["sign"] : ["verify"];
							break;
						case "ES384":
							algorithm = {
								name: "ECDSA",
								namedCurve: "P-384",
							};
							keyUsages = jwk.d ? ["sign"] : ["verify"];
							break;
						case "ES512":
							algorithm = {
								name: "ECDSA",
								namedCurve: "P-521",
							};
							keyUsages = jwk.d ? ["sign"] : ["verify"];
							break;
						case "ECDH-ES":
						case "ECDH-ES+A128KW":
						case "ECDH-ES+A192KW":
						case "ECDH-ES+A256KW":
							algorithm = {
								name: "ECDH",
								namedCurve: jwk.crv,
							};
							keyUsages = jwk.d ? ["deriveBits"] : [];
							break;
						default:
							throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"JOSENotSupported"
							]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
					}
					break;
				}
				case "OKP": {
					switch (jwk.alg) {
						case "Ed25519":
						case "EdDSA":
							algorithm = {
								name: "Ed25519",
							};
							keyUsages = jwk.d ? ["sign"] : ["verify"];
							break;
						case "ECDH-ES":
						case "ECDH-ES+A128KW":
						case "ECDH-ES+A192KW":
						case "ECDH-ES+A256KW":
							algorithm = {
								name: jwk.crv,
							};
							keyUsages = jwk.d ? ["deriveBits"] : [];
							break;
						default:
							throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"JOSENotSupported"
							]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
					}
					break;
				}
				default:
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JOSENotSupported"
					]('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
			}
			return {
				algorithm,
				keyUsages,
			};
		}
		async function jwkToKey(jwk) {
			if (!jwk.alg) {
				throw new TypeError(
					'"alg" argument is required when "jwk.alg" is not present',
				);
			}
			const { algorithm, keyUsages } = subtleMapping(jwk);
			const keyData = {
				...jwk,
			};
			if (keyData.kty !== "AKP") {
				delete keyData.alg;
			}
			delete keyData.use;
			return crypto.subtle.importKey(
				"jwk",
				keyData,
				algorithm,
				jwk.ext ?? (jwk.d || jwk.priv ? false : true),
				jwk.key_ops ?? keyUsages,
			);
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/normalize_key.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["normalizeKey", () => normalizeKey]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_jwk.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/base64url.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwk_to_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/jwk_to_key.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_key_like.js [app-rsc] (ecmascript)",
			);
		let cache;
		const handleJWK = async (key, jwk, alg, freeze = false) => {
			cache ||= new WeakMap();
			const cached = cache.get(key);
			if (cached?.[alg]) {
				return cached[alg];
			}
			const cryptoKey = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwk_to_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"jwkToKey"
			])({
				...jwk,
				alg,
			});
			if (freeze) Object.freeze(key);
			if (!cached) {
				cache.set(key, {
					[alg]: cryptoKey,
				});
			} else {
				cached[alg] = cryptoKey;
			}
			return cryptoKey;
		};
		const handleKeyObject = (keyObject, alg) => {
			cache ||= new WeakMap();
			const cached = cache.get(keyObject);
			if (cached?.[alg]) {
				return cached[alg];
			}
			const isPublic = keyObject.type === "public";
			const extractable = isPublic ? true : false;
			let cryptoKey;
			if (keyObject.asymmetricKeyType === "x25519") {
				switch (alg) {
					case "ECDH-ES":
					case "ECDH-ES+A128KW":
					case "ECDH-ES+A192KW":
					case "ECDH-ES+A256KW":
						break;
					default:
						throw new TypeError(
							"given KeyObject instance cannot be used for this algorithm",
						);
				}
				cryptoKey = keyObject.toCryptoKey(
					keyObject.asymmetricKeyType,
					extractable,
					isPublic ? [] : ["deriveBits"],
				);
			}
			if (keyObject.asymmetricKeyType === "ed25519") {
				if (alg !== "EdDSA" && alg !== "Ed25519") {
					throw new TypeError(
						"given KeyObject instance cannot be used for this algorithm",
					);
				}
				cryptoKey = keyObject.toCryptoKey(
					keyObject.asymmetricKeyType,
					extractable,
					[isPublic ? "verify" : "sign"],
				);
			}
			switch (keyObject.asymmetricKeyType) {
				case "ml-dsa-44":
				case "ml-dsa-65":
				case "ml-dsa-87": {
					if (alg !== keyObject.asymmetricKeyType.toUpperCase()) {
						throw new TypeError(
							"given KeyObject instance cannot be used for this algorithm",
						);
					}
					cryptoKey = keyObject.toCryptoKey(
						keyObject.asymmetricKeyType,
						extractable,
						[isPublic ? "verify" : "sign"],
					);
				}
			}
			if (keyObject.asymmetricKeyType === "rsa") {
				let hash;
				switch (alg) {
					case "RSA-OAEP":
						hash = "SHA-1";
						break;
					case "RS256":
					case "PS256":
					case "RSA-OAEP-256":
						hash = "SHA-256";
						break;
					case "RS384":
					case "PS384":
					case "RSA-OAEP-384":
						hash = "SHA-384";
						break;
					case "RS512":
					case "PS512":
					case "RSA-OAEP-512":
						hash = "SHA-512";
						break;
					default:
						throw new TypeError(
							"given KeyObject instance cannot be used for this algorithm",
						);
				}
				if (alg.startsWith("RSA-OAEP")) {
					return keyObject.toCryptoKey(
						{
							name: "RSA-OAEP",
							hash,
						},
						extractable,
						isPublic ? ["encrypt"] : ["decrypt"],
					);
				}
				cryptoKey = keyObject.toCryptoKey(
					{
						name: alg.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
						hash,
					},
					extractable,
					[isPublic ? "verify" : "sign"],
				);
			}
			if (keyObject.asymmetricKeyType === "ec") {
				const nist = new Map([
					["prime256v1", "P-256"],
					["secp384r1", "P-384"],
					["secp521r1", "P-521"],
				]);
				const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
				if (!namedCurve) {
					throw new TypeError(
						"given KeyObject instance cannot be used for this algorithm",
					);
				}
				if (alg === "ES256" && namedCurve === "P-256") {
					cryptoKey = keyObject.toCryptoKey(
						{
							name: "ECDSA",
							namedCurve,
						},
						extractable,
						[isPublic ? "verify" : "sign"],
					);
				}
				if (alg === "ES384" && namedCurve === "P-384") {
					cryptoKey = keyObject.toCryptoKey(
						{
							name: "ECDSA",
							namedCurve,
						},
						extractable,
						[isPublic ? "verify" : "sign"],
					);
				}
				if (alg === "ES512" && namedCurve === "P-521") {
					cryptoKey = keyObject.toCryptoKey(
						{
							name: "ECDSA",
							namedCurve,
						},
						extractable,
						[isPublic ? "verify" : "sign"],
					);
				}
				if (alg.startsWith("ECDH-ES")) {
					cryptoKey = keyObject.toCryptoKey(
						{
							name: "ECDH",
							namedCurve,
						},
						extractable,
						isPublic ? [] : ["deriveBits"],
					);
				}
			}
			if (!cryptoKey) {
				throw new TypeError(
					"given KeyObject instance cannot be used for this algorithm",
				);
			}
			if (!cached) {
				cache.set(keyObject, {
					[alg]: cryptoKey,
				});
			} else {
				cached[alg] = cryptoKey;
			}
			return cryptoKey;
		};
		async function normalizeKey(key, alg) {
			if (key instanceof Uint8Array) {
				return key;
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isCryptoKey"
				])(key)
			) {
				return key;
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isKeyObject"
				])(key)
			) {
				if (key.type === "secret") {
					return key.export();
				}
				if ("toCryptoKey" in key && typeof key.toCryptoKey === "function") {
					try {
						return handleKeyObject(key, alg);
					} catch (err) {
						if (err instanceof TypeError) {
							throw err;
						}
					}
				}
				const jwk = key.export({
					format: "jwk",
				});
				return handleJWK(key, jwk, alg);
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isJWK"
				])(key)
			) {
				if (key.k) {
					return (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"decode"
					])(key.k);
				}
				return handleJWK(key, key, alg, true);
			}
			throw new Error("unreachable");
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/flattened/sign.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["FlattenedSign", () => FlattenedSign]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/base64url.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/sign.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_disjoint.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/check_key_type.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/validate_crit.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/normalize_key.js [app-rsc] (ecmascript)",
			);
		class FlattenedSign {
			#payload;
			#protectedHeader;
			#unprotectedHeader;
			constructor(payload) {
				if (!(payload instanceof Uint8Array)) {
					throw new TypeError("payload must be an instance of Uint8Array");
				}
				this.#payload = payload;
			}
			setProtectedHeader(protectedHeader) {
				if (this.#protectedHeader) {
					throw new TypeError("setProtectedHeader can only be called once");
				}
				this.#protectedHeader = protectedHeader;
				return this;
			}
			setUnprotectedHeader(unprotectedHeader) {
				if (this.#unprotectedHeader) {
					throw new TypeError("setUnprotectedHeader can only be called once");
				}
				this.#unprotectedHeader = unprotectedHeader;
				return this;
			}
			async sign(key, options) {
				if (!this.#protectedHeader && !this.#unprotectedHeader) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					](
						"either setProtectedHeader or setUnprotectedHeader must be called before #sign()",
					);
				}
				if (
					!(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"isDisjoint"
					])(this.#protectedHeader, this.#unprotectedHeader)
				) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					](
						"JWS Protected and JWS Unprotected Header Parameter names must be disjoint",
					);
				}
				const joseHeader = {
					...this.#protectedHeader,
					...this.#unprotectedHeader,
				};
				const extensions = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"validateCrit"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					],
					new Map([["b64", true]]),
					options?.crit,
					this.#protectedHeader,
					joseHeader,
				);
				let b64 = true;
				if (extensions.has("b64")) {
					b64 = this.#protectedHeader.b64;
					if (typeof b64 !== "boolean") {
						throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
							"JWSInvalid"
						](
							'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
						);
					}
				}
				const { alg } = joseHeader;
				if (typeof alg !== "string" || !alg) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"checkKeyType"
				])(alg, key, "sign");
				let payloadS;
				let payloadB;
				if (b64) {
					payloadS = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encode"
					])(this.#payload);
					payloadB = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encode"
					])(payloadS);
				} else {
					payloadB = this.#payload;
					payloadS = "";
				}
				let protectedHeaderString;
				let protectedHeaderBytes;
				if (this.#protectedHeader) {
					protectedHeaderString = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encode"
					])(JSON.stringify(this.#protectedHeader));
					protectedHeaderBytes = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encode"
					])(protectedHeaderString);
				} else {
					protectedHeaderString = "";
					protectedHeaderBytes = new Uint8Array();
				}
				const data = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"concat"
				])(
					protectedHeaderBytes,
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encode"
					])("."),
					payloadB,
				);
				const k = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"normalizeKey"
				])(key, alg);
				const signature = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"sign"
				])(alg, k, data);
				const jws = {
					signature: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encode"
					])(signature),
					payload: payloadS,
				};
				if (this.#unprotectedHeader) {
					jws.header = this.#unprotectedHeader;
				}
				if (this.#protectedHeader) {
					jws.protected = protectedHeaderString;
				}
				return jws;
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/compact/sign.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["CompactSign", () => CompactSign]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/flattened/sign.js [app-rsc] (ecmascript)",
			);
		class CompactSign {
			#flattened;
			constructor(payload) {
				this.#flattened =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"FlattenedSign"
					](payload);
			}
			setProtectedHeader(protectedHeader) {
				this.#flattened.setProtectedHeader(protectedHeader);
				return this;
			}
			async sign(key, options) {
				const jws = await this.#flattened.sign(key, options);
				if (jws.payload === undefined) {
					throw new TypeError(
						"use the flattened module for creating JWS with b64: false",
					);
				}
				return `${jws.protected}.${jws.payload}.${jws.signature}`;
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"JWTClaimsBuilder",
			() => JWTClaimsBuilder,
			"secs",
			() => secs,
			"validateClaimsSet",
			() => validateClaimsSet,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_object.js [app-rsc] (ecmascript)",
			);
		const epoch = (date) => Math.floor(date.getTime() / 1000);
		const minute = 60;
		const hour = minute * 60;
		const day = hour * 24;
		const week = day * 7;
		const year = day * 365.25;
		const REGEX =
			/^(\+|-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
		function secs(str) {
			const matched = REGEX.exec(str);
			if (!matched || (matched[4] && matched[1])) {
				throw new TypeError("Invalid time period format");
			}
			const value = parseFloat(matched[2]);
			const unit = matched[3].toLowerCase();
			let numericDate;
			switch (unit) {
				case "sec":
				case "secs":
				case "second":
				case "seconds":
				case "s":
					numericDate = Math.round(value);
					break;
				case "minute":
				case "minutes":
				case "min":
				case "mins":
				case "m":
					numericDate = Math.round(value * minute);
					break;
				case "hour":
				case "hours":
				case "hr":
				case "hrs":
				case "h":
					numericDate = Math.round(value * hour);
					break;
				case "day":
				case "days":
				case "d":
					numericDate = Math.round(value * day);
					break;
				case "week":
				case "weeks":
				case "w":
					numericDate = Math.round(value * week);
					break;
				default:
					numericDate = Math.round(value * year);
					break;
			}
			if (matched[1] === "-" || matched[4] === "ago") {
				return -numericDate;
			}
			return numericDate;
		}
		function validateInput(label, input) {
			if (!Number.isFinite(input)) {
				throw new TypeError(`Invalid ${label} input`);
			}
			return input;
		}
		const normalizeTyp = (value) => {
			if (value.includes("/")) {
				return value.toLowerCase();
			}
			return `application/${value.toLowerCase()}`;
		};
		const checkAudiencePresence = (audPayload, audOption) => {
			if (typeof audPayload === "string") {
				return audOption.includes(audPayload);
			}
			if (Array.isArray(audPayload)) {
				return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
			}
			return false;
		};
		function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
			let payload;
			try {
				payload = JSON.parse(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"decoder"
					].decode(encodedPayload),
				);
			} catch {}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isObject"
				])(payload)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTInvalid"
				]("JWT Claims Set must be a top-level JSON object");
			}
			const { typ } = options;
			if (
				typ &&
				(typeof protectedHeader.typ !== "string" ||
					normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTClaimValidationFailed"
				]('unexpected "typ" JWT header value', payload, "typ", "check_failed");
			}
			const {
				requiredClaims = [],
				issuer,
				subject,
				audience,
				maxTokenAge,
			} = options;
			const presenceCheck = [...requiredClaims];
			if (maxTokenAge !== undefined) presenceCheck.push("iat");
			if (audience !== undefined) presenceCheck.push("aud");
			if (subject !== undefined) presenceCheck.push("sub");
			if (issuer !== undefined) presenceCheck.push("iss");
			for (const claim of new Set(presenceCheck.reverse())) {
				if (!(claim in payload)) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTClaimValidationFailed"
					](`missing required "${claim}" claim`, payload, claim, "missing");
				}
			}
			if (
				issuer &&
				!(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTClaimValidationFailed"
				]('unexpected "iss" claim value', payload, "iss", "check_failed");
			}
			if (subject && payload.sub !== subject) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTClaimValidationFailed"
				]('unexpected "sub" claim value', payload, "sub", "check_failed");
			}
			if (
				audience &&
				!checkAudiencePresence(
					payload.aud,
					typeof audience === "string" ? [audience] : audience,
				)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTClaimValidationFailed"
				]('unexpected "aud" claim value', payload, "aud", "check_failed");
			}
			let tolerance;
			switch (typeof options.clockTolerance) {
				case "string":
					tolerance = secs(options.clockTolerance);
					break;
				case "number":
					tolerance = options.clockTolerance;
					break;
				case "undefined":
					tolerance = 0;
					break;
				default:
					throw new TypeError("Invalid clockTolerance option type");
			}
			const { currentDate } = options;
			const now = epoch(currentDate || new Date());
			if (
				(payload.iat !== undefined || maxTokenAge) &&
				typeof payload.iat !== "number"
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTClaimValidationFailed"
				]('"iat" claim must be a number', payload, "iat", "invalid");
			}
			if (payload.nbf !== undefined) {
				if (typeof payload.nbf !== "number") {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTClaimValidationFailed"
					]('"nbf" claim must be a number', payload, "nbf", "invalid");
				}
				if (payload.nbf > now + tolerance) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTClaimValidationFailed"
					](
						'"nbf" claim timestamp check failed',
						payload,
						"nbf",
						"check_failed",
					);
				}
			}
			if (payload.exp !== undefined) {
				if (typeof payload.exp !== "number") {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTClaimValidationFailed"
					]('"exp" claim must be a number', payload, "exp", "invalid");
				}
				if (payload.exp <= now - tolerance) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTExpired"
					](
						'"exp" claim timestamp check failed',
						payload,
						"exp",
						"check_failed",
					);
				}
			}
			if (maxTokenAge) {
				const age = now - payload.iat;
				const max =
					typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge);
				if (age - tolerance > max) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTExpired"
					](
						'"iat" claim timestamp check failed (too far in the past)',
						payload,
						"iat",
						"check_failed",
					);
				}
				if (age < 0 - tolerance) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTClaimValidationFailed"
					](
						'"iat" claim timestamp check failed (it should be in the past)',
						payload,
						"iat",
						"check_failed",
					);
				}
			}
			return payload;
		}
		class JWTClaimsBuilder {
			#payload;
			constructor(payload) {
				if (
					!(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"isObject"
					])(payload)
				) {
					throw new TypeError("JWT Claims Set MUST be an object");
				}
				this.#payload = structuredClone(payload);
			}
			data() {
				return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"encoder"
				].encode(JSON.stringify(this.#payload));
			}
			get iss() {
				return this.#payload.iss;
			}
			set iss(value) {
				this.#payload.iss = value;
			}
			get sub() {
				return this.#payload.sub;
			}
			set sub(value) {
				this.#payload.sub = value;
			}
			get aud() {
				return this.#payload.aud;
			}
			set aud(value) {
				this.#payload.aud = value;
			}
			set jti(value) {
				this.#payload.jti = value;
			}
			set nbf(value) {
				if (typeof value === "number") {
					this.#payload.nbf = validateInput("setNotBefore", value);
				} else if (value instanceof Date) {
					this.#payload.nbf = validateInput("setNotBefore", epoch(value));
				} else {
					this.#payload.nbf = epoch(new Date()) + secs(value);
				}
			}
			set exp(value) {
				if (typeof value === "number") {
					this.#payload.exp = validateInput("setExpirationTime", value);
				} else if (value instanceof Date) {
					this.#payload.exp = validateInput("setExpirationTime", epoch(value));
				} else {
					this.#payload.exp = epoch(new Date()) + secs(value);
				}
			}
			set iat(value) {
				if (value === undefined) {
					this.#payload.iat = epoch(new Date());
				} else if (value instanceof Date) {
					this.#payload.iat = validateInput("setIssuedAt", epoch(value));
				} else if (typeof value === "string") {
					this.#payload.iat = validateInput(
						"setIssuedAt",
						epoch(new Date()) + secs(value),
					);
				} else {
					this.#payload.iat = validateInput("setIssuedAt", value);
				}
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/sign.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["SignJWT", () => SignJWT]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/compact/sign.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [app-rsc] (ecmascript)",
			);
		class SignJWT {
			#protectedHeader;
			#jwt;
			constructor(payload = {}) {
				this.#jwt =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTClaimsBuilder"
					](payload);
			}
			setIssuer(issuer) {
				this.#jwt.iss = issuer;
				return this;
			}
			setSubject(subject) {
				this.#jwt.sub = subject;
				return this;
			}
			setAudience(audience) {
				this.#jwt.aud = audience;
				return this;
			}
			setJti(jwtId) {
				this.#jwt.jti = jwtId;
				return this;
			}
			setNotBefore(input) {
				this.#jwt.nbf = input;
				return this;
			}
			setExpirationTime(input) {
				this.#jwt.exp = input;
				return this;
			}
			setIssuedAt(input) {
				this.#jwt.iat = input;
				return this;
			}
			setProtectedHeader(protectedHeader) {
				this.#protectedHeader = protectedHeader;
				return this;
			}
			async sign(key, options) {
				const sig =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"CompactSign"
					](this.#jwt.data());
				sig.setProtectedHeader(this.#protectedHeader);
				if (
					Array.isArray(this.#protectedHeader?.crit) &&
					this.#protectedHeader.crit.includes("b64") &&
					this.#protectedHeader.b64 === false
				) {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWTInvalid"
					]("JWTs MUST NOT use unencoded payload");
				}
				return sig.sign(key, options);
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/verify.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["verify", () => verify]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$subtle_dsa$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/subtle_dsa.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_length$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/check_key_length.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$get_sign_verify_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/get_sign_verify_key.js [app-rsc] (ecmascript)",
			);
		async function verify(alg, key, signature, data) {
			const cryptoKey = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$get_sign_verify_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"getSigKey"
			])(alg, key, "verify");
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_length$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"checkKeyLength"
			])(alg, cryptoKey);
			const algorithm = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$subtle_dsa$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"subtleAlgorithm"
			])(alg, cryptoKey.algorithm);
			try {
				return await crypto.subtle.verify(
					algorithm,
					cryptoKey,
					signature,
					data,
				);
			} catch {
				return false;
			}
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/validate_algorithms.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["validateAlgorithms", () => validateAlgorithms]);
		function validateAlgorithms(option, algorithms) {
			if (
				algorithms !== undefined &&
				(!Array.isArray(algorithms) ||
					algorithms.some((s) => typeof s !== "string"))
			) {
				throw new TypeError(`"${option}" option must be an array of strings`);
			}
			if (!algorithms) {
				return undefined;
			}
			return new Set(algorithms);
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/flattened/verify.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["flattenedVerify", () => flattenedVerify]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/base64url.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/verify.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_disjoint.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/is_object.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/check_key_type.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/validate_crit.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_algorithms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/validate_algorithms.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/normalize_key.js [app-rsc] (ecmascript)",
			);
		async function flattenedVerify(jws, key, options) {
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isObject"
				])(jws)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("Flattened JWS must be an object");
			}
			if (jws.protected === undefined && jws.header === undefined) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				](
					'Flattened JWS must have either of the "protected" or "header" members',
				);
			}
			if (jws.protected !== undefined && typeof jws.protected !== "string") {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("JWS Protected Header incorrect type");
			}
			if (jws.payload === undefined) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("JWS Payload missing");
			}
			if (typeof jws.signature !== "string") {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("JWS Signature missing or incorrect type");
			}
			if (
				jws.header !== undefined &&
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_object$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isObject"
				])(jws.header)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("JWS Unprotected Header incorrect type");
			}
			let parsedProt = {};
			if (jws.protected) {
				try {
					const protectedHeader = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"decode"
					])(jws.protected);
					parsedProt = JSON.parse(
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
							"decoder"
						].decode(protectedHeader),
					);
				} catch {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					]("JWS Protected Header is invalid");
				}
			}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"isDisjoint"
				])(parsedProt, jws.header)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				](
					"JWS Protected and JWS Unprotected Header Parameter names must be disjoint",
				);
			}
			const joseHeader = {
				...parsedProt,
				...jws.header,
			};
			const extensions = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"validateCrit"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				],
				new Map([["b64", true]]),
				options?.crit,
				parsedProt,
				joseHeader,
			);
			let b64 = true;
			if (extensions.has("b64")) {
				b64 = parsedProt.b64;
				if (typeof b64 !== "boolean") {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					](
						'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
					);
				}
			}
			const { alg } = joseHeader;
			if (typeof alg !== "string" || !alg) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
			}
			const algorithms =
				options &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_algorithms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"validateAlgorithms"
				])("algorithms", options.algorithms);
			if (algorithms && !algorithms.has(alg)) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JOSEAlgNotAllowed"
				]('"alg" (Algorithm) Header Parameter value not allowed');
			}
			if (b64) {
				if (typeof jws.payload !== "string") {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					]("JWS Payload must be a string");
				}
			} else if (
				typeof jws.payload !== "string" &&
				!(jws.payload instanceof Uint8Array)
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("JWS Payload must be a string or an Uint8Array instance");
			}
			let resolvedKey = false;
			if (typeof key === "function") {
				key = await key(parsedProt, jws);
				resolvedKey = true;
			}
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"checkKeyType"
			])(alg, key, "verify");
			const data = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"concat"
			])(
				jws.protected !== undefined
					? (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
							"encode"
						])(jws.protected)
					: new Uint8Array(),
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"encode"
				])("."),
				typeof jws.payload === "string"
					? b64
						? (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"encode"
							])(jws.payload)
						: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
								"encoder"
							].encode(jws.payload)
					: jws.payload,
			);
			let signature;
			try {
				signature = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"decode"
				])(jws.signature);
			} catch {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("Failed to base64url decode the signature");
			}
			const k = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"normalizeKey"
			])(key, alg);
			const verified = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"verify"
			])(alg, k, signature, data);
			if (!verified) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSSignatureVerificationFailed"
				]();
			}
			let payload;
			if (b64) {
				try {
					payload = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"decode"
					])(jws.payload);
				} catch {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"JWSInvalid"
					]("Failed to base64url decode the payload");
				}
			} else if (typeof jws.payload === "string") {
				payload =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"encoder"
					].encode(jws.payload);
			} else {
				payload = jws.payload;
			}
			const result = {
				payload,
			};
			if (jws.protected !== undefined) {
				result.protectedHeader = parsedProt;
			}
			if (jws.header !== undefined) {
				result.unprotectedHeader = jws.header;
			}
			if (resolvedKey) {
				return {
					...result,
					key: k,
				};
			}
			return result;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/compact/verify.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["compactVerify", () => compactVerify]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/flattened/verify.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-rsc] (ecmascript)",
			);
		async function compactVerify(jws, key, options) {
			if (jws instanceof Uint8Array) {
				jws =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
						"decoder"
					].decode(jws);
			}
			if (typeof jws !== "string") {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("Compact JWS must be a string or Uint8Array");
			}
			const {
				0: protectedHeader,
				1: payload,
				2: signature,
				length,
			} = jws.split(".");
			if (length !== 3) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWSInvalid"
				]("Invalid Compact JWS");
			}
			const verified = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"flattenedVerify"
			])(
				{
					payload,
					protected: protectedHeader,
					signature,
				},
				key,
				options,
			);
			const result = {
				payload: verified.payload,
				protectedHeader: verified.protectedHeader,
			};
			if (typeof key === "function") {
				return {
					...result,
					key: verified.key,
				};
			}
			return result;
		}
	},
	"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["jwtVerify", () => jwtVerify]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jws/compact/verify.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [app-rsc] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript)",
			);
		async function jwtVerify(jwt, key, options) {
			const verified = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"compactVerify"
			])(jwt, key, options);
			if (
				verified.protectedHeader.crit?.includes("b64") &&
				verified.protectedHeader.b64 === false
			) {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
					"JWTInvalid"
				]("JWTs MUST NOT use unencoded payload");
			}
			const payload = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
				"validateClaimsSet"
			])(verified.protectedHeader, verified.payload, options);
			const result = {
				payload,
				protectedHeader: verified.protectedHeader,
			};
			if (typeof key === "function") {
				return {
					...result,
					key: verified.key,
				};
			}
			return result;
		}
	},
];

//# sourceMappingURL=_99dd59fa._.js.map
