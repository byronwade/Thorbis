(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
	"chunks/526ad_@supabase_realtime-js_dist_module_baaa373b._.js",
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"WebSocketFactory",
			() => WebSocketFactory,
			"default",
			() => __TURBOPACK__default__export__,
		]);
		class WebSocketFactory {
			static detectEnvironment() {
				var _a;
				if (typeof WebSocket !== "undefined") {
					return {
						type: "native",
						constructor: WebSocket,
					};
				}
				if (
					typeof globalThis !== "undefined" &&
					typeof globalThis.WebSocket !== "undefined"
				) {
					return {
						type: "native",
						constructor: globalThis.WebSocket,
					};
				}
				if (
					("TURBOPACK compile-time value", "object") !== "undefined" &&
					typeof (
						/*TURBOPACK member replacement*/ __turbopack_context__.g.WebSocket
					) !== "undefined"
				) {
					return {
						type: "native",
						constructor:
							/*TURBOPACK member replacement*/ __turbopack_context__.g
								.WebSocket,
					};
				}
				if (
					typeof globalThis !== "undefined" &&
					typeof globalThis.WebSocketPair !== "undefined" &&
					typeof globalThis.WebSocket === "undefined"
				) {
					return {
						type: "cloudflare",
						error:
							"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
						workaround:
							"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.",
					};
				}
				if (
					(typeof globalThis !== "undefined" && globalThis.EdgeRuntime) ||
					(typeof navigator !== "undefined" &&
						((_a = navigator.userAgent) === null || _a === void 0
							? void 0
							: _a.includes("Vercel-Edge")))
				) {
					return {
						type: "unsupported",
						error:
							"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
						workaround:
							"Use serverless functions or a different deployment target for WebSocket functionality.",
					};
				}
				if (typeof process !== "undefined") {
					// Use dynamic property access to avoid Next.js Edge Runtime static analysis warnings
					const processVersions = process["versions"];
					if (processVersions && processVersions["node"]) {
						// Remove 'v' prefix if present and parse the major version
						const versionString = processVersions["node"];
						const nodeVersion = parseInt(
							versionString.replace(/^v/, "").split(".")[0],
						);
						// Node.js 22+ should have native WebSocket
						if (nodeVersion >= 22) {
							// Check if native WebSocket is available (should be in Node.js 22+)
							if (typeof globalThis.WebSocket !== "undefined") {
								return {
									type: "native",
									constructor: globalThis.WebSocket,
								};
							}
							// If not available, user needs to provide it
							return {
								type: "unsupported",
								error: `Node.js ${nodeVersion} detected but native WebSocket not found.`,
								workaround:
									"Provide a WebSocket implementation via the transport option.",
							};
						}
						// Node.js < 22 doesn't have native WebSocket
						return {
							type: "unsupported",
							error: `Node.js ${nodeVersion} detected without native WebSocket support.`,
							workaround:
								'For Node.js < 22, install "ws" package and provide it via the transport option:\n' +
								'import ws from "ws"\n' +
								"new RealtimeClient(url, { transport: ws })",
						};
					}
				}
				return {
					type: "unsupported",
					error: "Unknown JavaScript runtime without WebSocket support.",
					workaround:
						"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.",
				};
			}
			static getWebSocketConstructor() {
				const env = WebSocketFactory.detectEnvironment();
				if (env.constructor) {
					return env.constructor;
				}
				let errorMessage =
					env.error || "WebSocket not supported in this environment.";
				if (env.workaround) {
					errorMessage += `\n\nSuggested solution: ${env.workaround}`;
				}
				throw new Error(errorMessage);
			}
			static createWebSocket(url, protocols) {
				const WS = WebSocketFactory.getWebSocketConstructor();
				return new WS(url, protocols);
			}
			static isWebSocketSupported() {
				try {
					const env = WebSocketFactory.detectEnvironment();
					return env.type === "native" || env.type === "ws";
				} catch (_a) {
					return false;
				}
			}
		}
		const __TURBOPACK__default__export__ = WebSocketFactory;
		//# sourceMappingURL=websocket-factory.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/version.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		// Generated automatically during releases by scripts/update-version-files.ts
		// This file provides runtime access to the package version for:
		// - HTTP request headers (e.g., X-Client-Info header for API requests)
		// - Debugging and support (identifying which version is running)
		// - Telemetry and logging (version reporting in errors/analytics)
		// - Ensuring build artifacts match the published package version
		__turbopack_context__.s(["version", () => version]);
		const version = "2.81.0"; //# sourceMappingURL=version.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/constants.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"CHANNEL_EVENTS",
			() => CHANNEL_EVENTS,
			"CHANNEL_STATES",
			() => CHANNEL_STATES,
			"CONNECTION_STATE",
			() => CONNECTION_STATE,
			"DEFAULT_TIMEOUT",
			() => DEFAULT_TIMEOUT,
			"DEFAULT_VERSION",
			() => DEFAULT_VERSION,
			"DEFAULT_VSN",
			() => DEFAULT_VSN,
			"MAX_PUSH_BUFFER_SIZE",
			() => MAX_PUSH_BUFFER_SIZE,
			"SOCKET_STATES",
			() => SOCKET_STATES,
			"TRANSPORTS",
			() => TRANSPORTS,
			"VERSION",
			() => VERSION,
			"VSN_1_0_0",
			() => VSN_1_0_0,
			"VSN_2_0_0",
			() => VSN_2_0_0,
			"WS_CLOSE_NORMAL",
			() => WS_CLOSE_NORMAL,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/version.js [middleware-edge] (ecmascript)",
			);
		const DEFAULT_VERSION = `realtime-js/${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["version"]}`;
		const VSN_1_0_0 = "1.0.0";
		const VSN_2_0_0 = "2.0.0";
		const DEFAULT_VSN = VSN_1_0_0;
		const VERSION =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
				"version"
			];
		const DEFAULT_TIMEOUT = 10000;
		const WS_CLOSE_NORMAL = 1000;
		const MAX_PUSH_BUFFER_SIZE = 100;
		var SOCKET_STATES;
		((SOCKET_STATES) => {
			SOCKET_STATES[(SOCKET_STATES["connecting"] = 0)] = "connecting";
			SOCKET_STATES[(SOCKET_STATES["open"] = 1)] = "open";
			SOCKET_STATES[(SOCKET_STATES["closing"] = 2)] = "closing";
			SOCKET_STATES[(SOCKET_STATES["closed"] = 3)] = "closed";
		})(SOCKET_STATES || (SOCKET_STATES = {}));
		var CHANNEL_STATES;
		((CHANNEL_STATES) => {
			CHANNEL_STATES["closed"] = "closed";
			CHANNEL_STATES["errored"] = "errored";
			CHANNEL_STATES["joined"] = "joined";
			CHANNEL_STATES["joining"] = "joining";
			CHANNEL_STATES["leaving"] = "leaving";
		})(CHANNEL_STATES || (CHANNEL_STATES = {}));
		var CHANNEL_EVENTS;
		((CHANNEL_EVENTS) => {
			CHANNEL_EVENTS["close"] = "phx_close";
			CHANNEL_EVENTS["error"] = "phx_error";
			CHANNEL_EVENTS["join"] = "phx_join";
			CHANNEL_EVENTS["reply"] = "phx_reply";
			CHANNEL_EVENTS["leave"] = "phx_leave";
			CHANNEL_EVENTS["access_token"] = "access_token";
		})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
		var TRANSPORTS;
		((TRANSPORTS) => {
			TRANSPORTS["websocket"] = "websocket";
		})(TRANSPORTS || (TRANSPORTS = {}));
		var CONNECTION_STATE;
		((CONNECTION_STATE) => {
			CONNECTION_STATE["Connecting"] = "connecting";
			CONNECTION_STATE["Open"] = "open";
			CONNECTION_STATE["Closing"] = "closing";
			CONNECTION_STATE["Closed"] = "closed";
		})(CONNECTION_STATE || (CONNECTION_STATE = {})); //# sourceMappingURL=constants.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/serializer.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		// This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
		// License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
		__turbopack_context__.s(["default", () => Serializer]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/constants.js [middleware-edge] (ecmascript)",
			);
		class Serializer {
			constructor() {
				this.HEADER_LENGTH = 1;
				this.META_LENGTH = 4;
				this.USER_BROADCAST_PUSH_META_LENGTH = 5;
				this.KINDS = {
					push: 0,
					reply: 1,
					broadcast: 2,
					userBroadcastPush: 3,
					userBroadcast: 4,
				};
				this.BINARY_ENCODING = 0;
				this.JSON_ENCODING = 1;
				this.BROADCAST = "broadcast";
			}
			encode(msg, callback) {
				if (this._isArrayBuffer(msg.payload)) {
					return callback(this._binaryEncodePush(msg));
				}
				if (
					msg.event === this.BROADCAST &&
					!(msg.payload instanceof ArrayBuffer) &&
					typeof msg.payload.event === "string"
				) {
					return callback(this._binaryEncodeUserBroadcastPush(msg));
				}
				const payload = [
					msg.join_ref,
					msg.ref,
					msg.topic,
					msg.event,
					msg.payload,
				];
				return callback(JSON.stringify(payload));
			}
			_binaryEncodePush(message) {
				const { join_ref, ref, event, topic, payload } = message;
				const metaLength =
					this.META_LENGTH +
					join_ref.length +
					ref.length +
					topic.length +
					event.length;
				const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
				const view = new DataView(header);
				let offset = 0;
				view.setUint8(offset++, this.KINDS.push); // kind
				view.setUint8(offset++, join_ref.length);
				view.setUint8(offset++, ref.length);
				view.setUint8(offset++, topic.length);
				view.setUint8(offset++, event.length);
				Array.from(join_ref, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
				Array.from(topic, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				Array.from(event, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				var combined = new Uint8Array(header.byteLength + payload.byteLength);
				combined.set(new Uint8Array(header), 0);
				combined.set(new Uint8Array(payload), header.byteLength);
				return combined.buffer;
			}
			_binaryEncodeUserBroadcastPush(message) {
				var _a;
				if (
					this._isArrayBuffer(
						(_a = message.payload) === null || _a === void 0
							? void 0
							: _a.payload,
					)
				) {
					return this._encodeBinaryUserBroadcastPush(message);
				} else {
					return this._encodeJsonUserBroadcastPush(message);
				}
			}
			_encodeBinaryUserBroadcastPush(message) {
				var _a, _b;
				const { join_ref, ref, topic } = message;
				const userEvent = message.payload.event;
				const userPayload =
					(_b =
						(_a = message.payload) === null || _a === void 0
							? void 0
							: _a.payload) !== null && _b !== void 0
						? _b
						: new ArrayBuffer(0);
				const metaLength =
					this.USER_BROADCAST_PUSH_META_LENGTH +
					join_ref.length +
					ref.length +
					topic.length +
					userEvent.length;
				const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
				const view = new DataView(header);
				let offset = 0;
				view.setUint8(offset++, this.KINDS.userBroadcastPush); // kind
				view.setUint8(offset++, join_ref.length);
				view.setUint8(offset++, ref.length);
				view.setUint8(offset++, topic.length);
				view.setUint8(offset++, userEvent.length);
				view.setUint8(offset++, this.BINARY_ENCODING);
				Array.from(join_ref, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
				Array.from(topic, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				Array.from(userEvent, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				var combined = new Uint8Array(
					header.byteLength + userPayload.byteLength,
				);
				combined.set(new Uint8Array(header), 0);
				combined.set(new Uint8Array(userPayload), header.byteLength);
				return combined.buffer;
			}
			_encodeJsonUserBroadcastPush(message) {
				var _a, _b;
				const { join_ref, ref, topic } = message;
				const userEvent = message.payload.event;
				const userPayload =
					(_b =
						(_a = message.payload) === null || _a === void 0
							? void 0
							: _a.payload) !== null && _b !== void 0
						? _b
						: {};
				const encoder = new TextEncoder(); // Encodes to UTF-8
				const encodedUserPayload = encoder.encode(
					JSON.stringify(userPayload),
				).buffer;
				const metaLength =
					this.USER_BROADCAST_PUSH_META_LENGTH +
					join_ref.length +
					ref.length +
					topic.length +
					userEvent.length;
				const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
				const view = new DataView(header);
				let offset = 0;
				view.setUint8(offset++, this.KINDS.userBroadcastPush); // kind
				view.setUint8(offset++, join_ref.length);
				view.setUint8(offset++, ref.length);
				view.setUint8(offset++, topic.length);
				view.setUint8(offset++, userEvent.length);
				view.setUint8(offset++, this.JSON_ENCODING);
				Array.from(join_ref, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
				Array.from(topic, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				Array.from(userEvent, (char) =>
					view.setUint8(offset++, char.charCodeAt(0)),
				);
				var combined = new Uint8Array(
					header.byteLength + encodedUserPayload.byteLength,
				);
				combined.set(new Uint8Array(header), 0);
				combined.set(new Uint8Array(encodedUserPayload), header.byteLength);
				return combined.buffer;
			}
			decode(rawPayload, callback) {
				if (this._isArrayBuffer(rawPayload)) {
					const result = this._binaryDecode(rawPayload);
					return callback(result);
				}
				if (typeof rawPayload === "string") {
					const jsonPayload = JSON.parse(rawPayload);
					const [join_ref, ref, topic, event, payload] = jsonPayload;
					return callback({
						join_ref,
						ref,
						topic,
						event,
						payload,
					});
				}
				return callback({});
			}
			_binaryDecode(buffer) {
				const view = new DataView(buffer);
				const kind = view.getUint8(0);
				const decoder = new TextDecoder();
				switch (kind) {
					case this.KINDS.push:
						return this._decodePush(buffer, view, decoder);
					case this.KINDS.reply:
						return this._decodeReply(buffer, view, decoder);
					case this.KINDS.broadcast:
						return this._decodeBroadcast(buffer, view, decoder);
					case this.KINDS.userBroadcast:
						return this._decodeUserBroadcast(buffer, view, decoder);
				}
			}
			_decodePush(buffer, view, decoder) {
				const joinRefSize = view.getUint8(1);
				const topicSize = view.getUint8(2);
				const eventSize = view.getUint8(3);
				let offset = this.HEADER_LENGTH + this.META_LENGTH - 1; // pushes have no ref
				const joinRef = decoder.decode(
					buffer.slice(offset, offset + joinRefSize),
				);
				offset = offset + joinRefSize;
				const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
				offset = offset + topicSize;
				const event = decoder.decode(buffer.slice(offset, offset + eventSize));
				offset = offset + eventSize;
				const data = JSON.parse(
					decoder.decode(buffer.slice(offset, buffer.byteLength)),
				);
				return {
					join_ref: joinRef,
					ref: null,
					topic: topic,
					event: event,
					payload: data,
				};
			}
			_decodeReply(buffer, view, decoder) {
				const joinRefSize = view.getUint8(1);
				const refSize = view.getUint8(2);
				const topicSize = view.getUint8(3);
				const eventSize = view.getUint8(4);
				let offset = this.HEADER_LENGTH + this.META_LENGTH;
				const joinRef = decoder.decode(
					buffer.slice(offset, offset + joinRefSize),
				);
				offset = offset + joinRefSize;
				const ref = decoder.decode(buffer.slice(offset, offset + refSize));
				offset = offset + refSize;
				const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
				offset = offset + topicSize;
				const event = decoder.decode(buffer.slice(offset, offset + eventSize));
				offset = offset + eventSize;
				const data = JSON.parse(
					decoder.decode(buffer.slice(offset, buffer.byteLength)),
				);
				const payload = {
					status: event,
					response: data,
				};
				return {
					join_ref: joinRef,
					ref: ref,
					topic: topic,
					event:
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_EVENTS"
						].reply,
					payload: payload,
				};
			}
			_decodeBroadcast(buffer, view, decoder) {
				const topicSize = view.getUint8(1);
				const eventSize = view.getUint8(2);
				let offset = this.HEADER_LENGTH + 2;
				const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
				offset = offset + topicSize;
				const event = decoder.decode(buffer.slice(offset, offset + eventSize));
				offset = offset + eventSize;
				const data = JSON.parse(
					decoder.decode(buffer.slice(offset, buffer.byteLength)),
				);
				return {
					join_ref: null,
					ref: null,
					topic: topic,
					event: event,
					payload: data,
				};
			}
			_decodeUserBroadcast(buffer, view, decoder) {
				const topicSize = view.getUint8(1);
				const userEventSize = view.getUint8(2);
				const metadataSize = view.getUint8(3);
				const payloadEncoding = view.getUint8(4);
				let offset = this.HEADER_LENGTH + 4;
				const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
				offset = offset + topicSize;
				const userEvent = decoder.decode(
					buffer.slice(offset, offset + userEventSize),
				);
				offset = offset + userEventSize;
				const metadata = decoder.decode(
					buffer.slice(offset, offset + metadataSize),
				);
				offset = offset + metadataSize;
				const payload = buffer.slice(offset, buffer.byteLength);
				const parsedPayload =
					payloadEncoding === this.JSON_ENCODING
						? JSON.parse(decoder.decode(payload))
						: payload;
				const data = {
					type: this.BROADCAST,
					event: userEvent,
					payload: parsedPayload,
				};
				// Metadata is optional and always JSON encoded
				if (metadataSize > 0) {
					data["meta"] = JSON.parse(metadata);
				}
				return {
					join_ref: null,
					ref: null,
					topic: topic,
					event: this.BROADCAST,
					payload: data,
				};
			}
			_isArrayBuffer(buffer) {
				var _a;
				return (
					buffer instanceof ArrayBuffer ||
					((_a =
						buffer === null || buffer === void 0
							? void 0
							: buffer.constructor) === null || _a === void 0
						? void 0
						: _a.name) === "ArrayBuffer"
				);
			}
		} //# sourceMappingURL=serializer.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/timer.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
		 *
		 * @example
		 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
		 *      return [1000, 5000, 10000][tries - 1] || 10000
		 *    })
		 *    reconnectTimer.scheduleTimeout() // fires after 1000
		 *    reconnectTimer.scheduleTimeout() // fires after 5000
		 *    reconnectTimer.reset()
		 *    reconnectTimer.scheduleTimeout() // fires after 1000
		 */ __turbopack_context__.s(["default", () => Timer]);
		class Timer {
			constructor(callback, timerCalc) {
				this.callback = callback;
				this.timerCalc = timerCalc;
				this.timer = undefined;
				this.tries = 0;
				this.callback = callback;
				this.timerCalc = timerCalc;
			}
			reset() {
				this.tries = 0;
				clearTimeout(this.timer);
				this.timer = undefined;
			}
			// Cancels any previous scheduleTimeout and schedules callback
			scheduleTimeout() {
				clearTimeout(this.timer);
				this.timer = setTimeout(
					() => {
						this.tries = this.tries + 1;
						this.callback();
					},
					this.timerCalc(this.tries + 1),
				);
			}
		} //# sourceMappingURL=timer.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/transformers.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Helpers to convert the change Payload into native JS types.
		 */ // Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
		// 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
		__turbopack_context__.s([
			"PostgresTypes",
			() => PostgresTypes,
			"convertCell",
			() => convertCell,
			"convertChangeData",
			() => convertChangeData,
			"convertColumn",
			() => convertColumn,
			"httpEndpointURL",
			() => httpEndpointURL,
			"toArray",
			() => toArray,
			"toBoolean",
			() => toBoolean,
			"toJson",
			() => toJson,
			"toNumber",
			() => toNumber,
			"toTimestampString",
			() => toTimestampString,
		]);
		var PostgresTypes;
		((PostgresTypes) => {
			PostgresTypes["abstime"] = "abstime";
			PostgresTypes["bool"] = "bool";
			PostgresTypes["date"] = "date";
			PostgresTypes["daterange"] = "daterange";
			PostgresTypes["float4"] = "float4";
			PostgresTypes["float8"] = "float8";
			PostgresTypes["int2"] = "int2";
			PostgresTypes["int4"] = "int4";
			PostgresTypes["int4range"] = "int4range";
			PostgresTypes["int8"] = "int8";
			PostgresTypes["int8range"] = "int8range";
			PostgresTypes["json"] = "json";
			PostgresTypes["jsonb"] = "jsonb";
			PostgresTypes["money"] = "money";
			PostgresTypes["numeric"] = "numeric";
			PostgresTypes["oid"] = "oid";
			PostgresTypes["reltime"] = "reltime";
			PostgresTypes["text"] = "text";
			PostgresTypes["time"] = "time";
			PostgresTypes["timestamp"] = "timestamp";
			PostgresTypes["timestamptz"] = "timestamptz";
			PostgresTypes["timetz"] = "timetz";
			PostgresTypes["tsrange"] = "tsrange";
			PostgresTypes["tstzrange"] = "tstzrange";
		})(PostgresTypes || (PostgresTypes = {}));
		const convertChangeData = (columns, record, options = {}) => {
			var _a;
			const skipTypes =
				(_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
			if (!record) {
				return {};
			}
			return Object.keys(record).reduce((acc, rec_key) => {
				acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
				return acc;
			}, {});
		};
		const convertColumn = (columnName, columns, record, skipTypes) => {
			const column = columns.find((x) => x.name === columnName);
			const colType =
				column === null || column === void 0 ? void 0 : column.type;
			const value = record[columnName];
			if (colType && !skipTypes.includes(colType)) {
				return convertCell(colType, value);
			}
			return noop(value);
		};
		const convertCell = (type, value) => {
			// if data type is an array
			if (type.charAt(0) === "_") {
				const dataType = type.slice(1, type.length);
				return toArray(value, dataType);
			}
			// If not null, convert to correct type.
			switch (type) {
				case PostgresTypes.bool:
					return toBoolean(value);
				case PostgresTypes.float4:
				case PostgresTypes.float8:
				case PostgresTypes.int2:
				case PostgresTypes.int4:
				case PostgresTypes.int8:
				case PostgresTypes.numeric:
				case PostgresTypes.oid:
					return toNumber(value);
				case PostgresTypes.json:
				case PostgresTypes.jsonb:
					return toJson(value);
				case PostgresTypes.timestamp:
					return toTimestampString(value); // Format to be consistent with PostgREST
				case PostgresTypes.abstime:
				case PostgresTypes.date:
				case PostgresTypes.daterange:
				case PostgresTypes.int4range:
				case PostgresTypes.int8range:
				case PostgresTypes.money:
				case PostgresTypes.reltime:
				case PostgresTypes.text:
				case PostgresTypes.time:
				case PostgresTypes.timestamptz:
				case PostgresTypes.timetz:
				case PostgresTypes.tsrange:
				case PostgresTypes.tstzrange:
					return noop(value);
				default:
					// Return the value for remaining types
					return noop(value);
			}
		};
		const noop = (value) => {
			return value;
		};
		const toBoolean = (value) => {
			switch (value) {
				case "t":
					return true;
				case "f":
					return false;
				default:
					return value;
			}
		};
		const toNumber = (value) => {
			if (typeof value === "string") {
				const parsedValue = parseFloat(value);
				if (!Number.isNaN(parsedValue)) {
					return parsedValue;
				}
			}
			return value;
		};
		const toJson = (value) => {
			if (typeof value === "string") {
				try {
					return JSON.parse(value);
				} catch (error) {
					console.log(`JSON parse error: ${error}`);
					return value;
				}
			}
			return value;
		};
		const toArray = (value, type) => {
			if (typeof value !== "string") {
				return value;
			}
			const lastIdx = value.length - 1;
			const closeBrace = value[lastIdx];
			const openBrace = value[0];
			// Confirm value is a Postgres array by checking curly brackets
			if (openBrace === "{" && closeBrace === "}") {
				let arr;
				const valTrim = value.slice(1, lastIdx);
				// TODO: find a better solution to separate Postgres array data
				try {
					arr = JSON.parse("[" + valTrim + "]");
				} catch (_) {
					// WARNING: splitting on comma does not cover all edge cases
					arr = valTrim ? valTrim.split(",") : [];
				}
				return arr.map((val) => convertCell(type, val));
			}
			return value;
		};
		const toTimestampString = (value) => {
			if (typeof value === "string") {
				return value.replace(" ", "T");
			}
			return value;
		};
		const httpEndpointURL = (socketUrl) => {
			const wsUrl = new URL(socketUrl);
			wsUrl.protocol = wsUrl.protocol.replace(/^ws/i, "http");
			wsUrl.pathname = wsUrl.pathname
				.replace(/\/+$/, "") // remove all trailing slashes
				.replace(/\/socket\/websocket$/i, "") // remove the socket/websocket path
				.replace(/\/socket$/i, "") // remove the socket path
				.replace(/\/websocket$/i, ""); // remove the websocket path
			if (wsUrl.pathname === "" || wsUrl.pathname === "/") {
				wsUrl.pathname = "/api/broadcast";
			} else {
				wsUrl.pathname = wsUrl.pathname + "/api/broadcast";
			}
			return wsUrl.href;
		}; //# sourceMappingURL=transformers.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/push.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["default", () => Push]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/constants.js [middleware-edge] (ecmascript)",
			);
		class Push {
			/**
			 * Initializes the Push
			 *
			 * @param channel The Channel
			 * @param event The event, for example `"phx_join"`
			 * @param payload The payload, for example `{user_id: 123}`
			 * @param timeout The push timeout in milliseconds
			 */ constructor(
				channel,
				event,
				payload = {},
				timeout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
					"DEFAULT_TIMEOUT"
				],
			) {
				this.channel = channel;
				this.event = event;
				this.payload = payload;
				this.timeout = timeout;
				this.sent = false;
				this.timeoutTimer = undefined;
				this.ref = "";
				this.receivedResp = null;
				this.recHooks = [];
				this.refEvent = null;
			}
			resend(timeout) {
				this.timeout = timeout;
				this._cancelRefEvent();
				this.ref = "";
				this.refEvent = null;
				this.receivedResp = null;
				this.sent = false;
				this.send();
			}
			send() {
				if (this._hasReceived("timeout")) {
					return;
				}
				this.startTimeout();
				this.sent = true;
				this.channel.socket.push({
					topic: this.channel.topic,
					event: this.event,
					payload: this.payload,
					ref: this.ref,
					join_ref: this.channel._joinRef(),
				});
			}
			updatePayload(payload) {
				this.payload = Object.assign(Object.assign({}, this.payload), payload);
			}
			receive(status, callback) {
				var _a;
				if (this._hasReceived(status)) {
					callback(
						(_a = this.receivedResp) === null || _a === void 0
							? void 0
							: _a.response,
					);
				}
				this.recHooks.push({
					status,
					callback,
				});
				return this;
			}
			startTimeout() {
				if (this.timeoutTimer) {
					return;
				}
				this.ref = this.channel.socket._makeRef();
				this.refEvent = this.channel._replyEventName(this.ref);
				const callback = (payload) => {
					this._cancelRefEvent();
					this._cancelTimeout();
					this.receivedResp = payload;
					this._matchReceive(payload);
				};
				this.channel._on(this.refEvent, {}, callback);
				this.timeoutTimer = setTimeout(() => {
					this.trigger("timeout", {});
				}, this.timeout);
			}
			trigger(status, response) {
				if (this.refEvent)
					this.channel._trigger(this.refEvent, {
						status,
						response,
					});
			}
			destroy() {
				this._cancelRefEvent();
				this._cancelTimeout();
			}
			_cancelRefEvent() {
				if (!this.refEvent) {
					return;
				}
				this.channel._off(this.refEvent, {});
			}
			_cancelTimeout() {
				clearTimeout(this.timeoutTimer);
				this.timeoutTimer = undefined;
			}
			_matchReceive({ status, response }) {
				this.recHooks
					.filter((h) => h.status === status)
					.forEach((h) => h.callback(response));
			}
			_hasReceived(status) {
				return this.receivedResp && this.receivedResp.status === status;
			}
		} //# sourceMappingURL=push.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/*
  This file draws heavily from https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/assets/js/phoenix/presence.js
  License: https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/LICENSE.md
*/ __turbopack_context__.s([
			"REALTIME_PRESENCE_LISTEN_EVENTS",
			() => REALTIME_PRESENCE_LISTEN_EVENTS,
			"default",
			() => RealtimePresence,
		]);
		var REALTIME_PRESENCE_LISTEN_EVENTS;
		((REALTIME_PRESENCE_LISTEN_EVENTS) => {
			REALTIME_PRESENCE_LISTEN_EVENTS["SYNC"] = "sync";
			REALTIME_PRESENCE_LISTEN_EVENTS["JOIN"] = "join";
			REALTIME_PRESENCE_LISTEN_EVENTS["LEAVE"] = "leave";
		})(
			REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}),
		);
		class RealtimePresence {
			/**
			 * Initializes the Presence.
			 *
			 * @param channel - The RealtimeChannel
			 * @param opts - The options,
			 *        for example `{events: {state: 'state', diff: 'diff'}}`
			 */ constructor(channel, opts) {
				this.channel = channel;
				this.state = {};
				this.pendingDiffs = [];
				this.joinRef = null;
				this.enabled = false;
				this.caller = {
					onJoin: () => {},
					onLeave: () => {},
					onSync: () => {},
				};
				const events = (opts === null || opts === void 0
					? void 0
					: opts.events) || {
					state: "presence_state",
					diff: "presence_diff",
				};
				this.channel._on(events.state, {}, (newState) => {
					const { onJoin, onLeave, onSync } = this.caller;
					this.joinRef = this.channel._joinRef();
					this.state = RealtimePresence.syncState(
						this.state,
						newState,
						onJoin,
						onLeave,
					);
					this.pendingDiffs.forEach((diff) => {
						this.state = RealtimePresence.syncDiff(
							this.state,
							diff,
							onJoin,
							onLeave,
						);
					});
					this.pendingDiffs = [];
					onSync();
				});
				this.channel._on(events.diff, {}, (diff) => {
					const { onJoin, onLeave, onSync } = this.caller;
					if (this.inPendingSyncState()) {
						this.pendingDiffs.push(diff);
					} else {
						this.state = RealtimePresence.syncDiff(
							this.state,
							diff,
							onJoin,
							onLeave,
						);
						onSync();
					}
				});
				this.onJoin((key, currentPresences, newPresences) => {
					this.channel._trigger("presence", {
						event: "join",
						key,
						currentPresences,
						newPresences,
					});
				});
				this.onLeave((key, currentPresences, leftPresences) => {
					this.channel._trigger("presence", {
						event: "leave",
						key,
						currentPresences,
						leftPresences,
					});
				});
				this.onSync(() => {
					this.channel._trigger("presence", {
						event: "sync",
					});
				});
			}
			/**
			 * Used to sync the list of presences on the server with the
			 * client's state.
			 *
			 * An optional `onJoin` and `onLeave` callback can be provided to
			 * react to changes in the client's local presences across
			 * disconnects and reconnects with the server.
			 *
			 * @internal
			 */ static syncState(currentState, newState, onJoin, onLeave) {
				const state = RealtimePresence.cloneDeep(currentState);
				const transformedState = RealtimePresence.transformState(newState);
				const joins = {};
				const leaves = {};
				RealtimePresence.map(state, (key, presences) => {
					if (!transformedState[key]) {
						leaves[key] = presences;
					}
				});
				RealtimePresence.map(transformedState, (key, newPresences) => {
					const currentPresences = state[key];
					if (currentPresences) {
						const newPresenceRefs = newPresences.map((m) => m.presence_ref);
						const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
						const joinedPresences = newPresences.filter(
							(m) => curPresenceRefs.indexOf(m.presence_ref) < 0,
						);
						const leftPresences = currentPresences.filter(
							(m) => newPresenceRefs.indexOf(m.presence_ref) < 0,
						);
						if (joinedPresences.length > 0) {
							joins[key] = joinedPresences;
						}
						if (leftPresences.length > 0) {
							leaves[key] = leftPresences;
						}
					} else {
						joins[key] = newPresences;
					}
				});
				return RealtimePresence.syncDiff(
					state,
					{
						joins,
						leaves,
					},
					onJoin,
					onLeave,
				);
			}
			/**
			 * Used to sync a diff of presence join and leave events from the
			 * server, as they happen.
			 *
			 * Like `syncState`, `syncDiff` accepts optional `onJoin` and
			 * `onLeave` callbacks to react to a user joining or leaving from a
			 * device.
			 *
			 * @internal
			 */ static syncDiff(state, diff, onJoin, onLeave) {
				const { joins, leaves } = {
					joins: RealtimePresence.transformState(diff.joins),
					leaves: RealtimePresence.transformState(diff.leaves),
				};
				if (!onJoin) {
					onJoin = () => {};
				}
				if (!onLeave) {
					onLeave = () => {};
				}
				RealtimePresence.map(joins, (key, newPresences) => {
					var _a;
					const currentPresences =
						(_a = state[key]) !== null && _a !== void 0 ? _a : [];
					state[key] = RealtimePresence.cloneDeep(newPresences);
					if (currentPresences.length > 0) {
						const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
						const curPresences = currentPresences.filter(
							(m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0,
						);
						state[key].unshift(...curPresences);
					}
					onJoin(key, currentPresences, newPresences);
				});
				RealtimePresence.map(leaves, (key, leftPresences) => {
					let currentPresences = state[key];
					if (!currentPresences) return;
					const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
					currentPresences = currentPresences.filter(
						(m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0,
					);
					state[key] = currentPresences;
					onLeave(key, currentPresences, leftPresences);
					if (currentPresences.length === 0) delete state[key];
				});
				return state;
			}
			/** @internal */ static map(obj, func) {
				return Object.getOwnPropertyNames(obj).map((key) =>
					func(key, obj[key]),
				);
			}
			/**
			 * Remove 'metas' key
			 * Change 'phx_ref' to 'presence_ref'
			 * Remove 'phx_ref' and 'phx_ref_prev'
			 *
			 * @example
			 * // returns {
			 *  abc123: [
			 *    { presence_ref: '2', user_id: 1 },
			 *    { presence_ref: '3', user_id: 2 }
			 *  ]
			 * }
			 * RealtimePresence.transformState({
			 *  abc123: {
			 *    metas: [
			 *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
			 *      { phx_ref: '3', user_id: 2 }
			 *    ]
			 *  }
			 * })
			 *
			 * @internal
			 */ static transformState(state) {
				state = RealtimePresence.cloneDeep(state);
				return Object.getOwnPropertyNames(state).reduce((newState, key) => {
					const presences = state[key];
					if ("metas" in presences) {
						newState[key] = presences.metas.map((presence) => {
							presence["presence_ref"] = presence["phx_ref"];
							delete presence["phx_ref"];
							delete presence["phx_ref_prev"];
							return presence;
						});
					} else {
						newState[key] = presences;
					}
					return newState;
				}, {});
			}
			/** @internal */ static cloneDeep(obj) {
				return JSON.parse(JSON.stringify(obj));
			}
			/** @internal */ onJoin(callback) {
				this.caller.onJoin = callback;
			}
			/** @internal */ onLeave(callback) {
				this.caller.onLeave = callback;
			}
			/** @internal */ onSync(callback) {
				this.caller.onSync = callback;
			}
			/** @internal */ inPendingSyncState() {
				return !this.joinRef || this.joinRef !== this.channel._joinRef();
			}
		} //# sourceMappingURL=RealtimePresence.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"REALTIME_CHANNEL_STATES",
			() => REALTIME_CHANNEL_STATES,
			"REALTIME_LISTEN_TYPES",
			() => REALTIME_LISTEN_TYPES,
			"REALTIME_POSTGRES_CHANGES_LISTEN_EVENT",
			() => REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
			"REALTIME_SUBSCRIBE_STATES",
			() => REALTIME_SUBSCRIBE_STATES,
			"default",
			() => RealtimeChannel,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/constants.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$push$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/push.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$timer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/timer.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimePresence$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$transformers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/transformers.js [middleware-edge] (ecmascript)",
			);
		var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
		((REALTIME_POSTGRES_CHANGES_LISTEN_EVENT) => {
			REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["ALL"] = "*";
			REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["INSERT"] = "INSERT";
			REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["UPDATE"] = "UPDATE";
			REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["DELETE"] = "DELETE";
		})(
			REALTIME_POSTGRES_CHANGES_LISTEN_EVENT ||
				(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}),
		);
		var REALTIME_LISTEN_TYPES;
		((REALTIME_LISTEN_TYPES) => {
			REALTIME_LISTEN_TYPES["BROADCAST"] = "broadcast";
			REALTIME_LISTEN_TYPES["PRESENCE"] = "presence";
			REALTIME_LISTEN_TYPES["POSTGRES_CHANGES"] = "postgres_changes";
			REALTIME_LISTEN_TYPES["SYSTEM"] = "system";
		})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
		var REALTIME_SUBSCRIBE_STATES;
		((REALTIME_SUBSCRIBE_STATES) => {
			REALTIME_SUBSCRIBE_STATES["SUBSCRIBED"] = "SUBSCRIBED";
			REALTIME_SUBSCRIBE_STATES["TIMED_OUT"] = "TIMED_OUT";
			REALTIME_SUBSCRIBE_STATES["CLOSED"] = "CLOSED";
			REALTIME_SUBSCRIBE_STATES["CHANNEL_ERROR"] = "CHANNEL_ERROR";
		})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
		const REALTIME_CHANNEL_STATES =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
				"CHANNEL_STATES"
			];
		class RealtimeChannel {
			constructor(
				/** Topic name can be any string. */ topic,
				params = {
					config: {},
				},
				socket,
			) {
				var _a, _b;
				this.topic = topic;
				this.params = params;
				this.socket = socket;
				this.bindings = {};
				this.state =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].closed;
				this.joinedOnce = false;
				this.pushBuffer = [];
				this.subTopic = topic.replace(/^realtime:/i, "");
				this.params.config = Object.assign(
					{
						broadcast: {
							ack: false,
							self: false,
						},
						presence: {
							key: "",
							enabled: false,
						},
						private: false,
					},
					params.config,
				);
				this.timeout = this.socket.timeout;
				this.joinPush =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$push$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"default"
					](
						this,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_EVENTS"
						].join,
						this.params,
						this.timeout,
					);
				this.rejoinTimer =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$timer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"default"
					](() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
				this.joinPush.receive("ok", () => {
					this.state =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_STATES"
						].joined;
					this.rejoinTimer.reset();
					this.pushBuffer.forEach((pushEvent) => pushEvent.send());
					this.pushBuffer = [];
				});
				this._onClose(() => {
					this.rejoinTimer.reset();
					this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
					this.state =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_STATES"
						].closed;
					this.socket._remove(this);
				});
				this._onError((reason) => {
					if (this._isLeaving() || this._isClosed()) {
						return;
					}
					this.socket.log("channel", `error ${this.topic}`, reason);
					this.state =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_STATES"
						].errored;
					this.rejoinTimer.scheduleTimeout();
				});
				this.joinPush.receive("timeout", () => {
					if (!this._isJoining()) {
						return;
					}
					this.socket.log(
						"channel",
						`timeout ${this.topic}`,
						this.joinPush.timeout,
					);
					this.state =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_STATES"
						].errored;
					this.rejoinTimer.scheduleTimeout();
				});
				this.joinPush.receive("error", (reason) => {
					if (this._isLeaving() || this._isClosed()) {
						return;
					}
					this.socket.log("channel", `error ${this.topic}`, reason);
					this.state =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_STATES"
						].errored;
					this.rejoinTimer.scheduleTimeout();
				});
				this._on(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_EVENTS"
					].reply,
					{},
					(payload, ref) => {
						this._trigger(this._replyEventName(ref), payload);
					},
				);
				this.presence =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimePresence$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"default"
					](this);
				this.broadcastEndpointURL = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$transformers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
					"httpEndpointURL"
				])(this.socket.endPoint);
				this.private = this.params.config.private || false;
				if (
					!this.private &&
					((_b =
						(_a = this.params.config) === null || _a === void 0
							? void 0
							: _a.broadcast) === null || _b === void 0
						? void 0
						: _b.replay)
				) {
					throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
				}
			}
			/** Subscribe registers your client with the server */ subscribe(
				callback,
				timeout = this.timeout,
			) {
				var _a, _b, _c;
				if (!this.socket.isConnected()) {
					this.socket.connect();
				}
				if (
					this.state ==
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].closed
				) {
					const {
						config: { broadcast, presence, private: isPrivate },
					} = this.params;
					const postgres_changes =
						(_b =
							(_a = this.bindings.postgres_changes) === null || _a === void 0
								? void 0
								: _a.map((r) => r.filter)) !== null && _b !== void 0
							? _b
							: [];
					const presence_enabled =
						(!!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] &&
							this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0) ||
						((_c = this.params.config.presence) === null || _c === void 0
							? void 0
							: _c.enabled) === true;
					const accessTokenPayload = {};
					const config = {
						broadcast,
						presence: Object.assign(Object.assign({}, presence), {
							enabled: presence_enabled,
						}),
						postgres_changes,
						private: isPrivate,
					};
					if (this.socket.accessTokenValue) {
						accessTokenPayload.access_token = this.socket.accessTokenValue;
					}
					this._onError((e) =>
						callback === null || callback === void 0
							? void 0
							: callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e),
					);
					this._onClose(() =>
						callback === null || callback === void 0
							? void 0
							: callback(REALTIME_SUBSCRIBE_STATES.CLOSED),
					);
					this.updateJoinPayload(
						Object.assign(
							{
								config,
							},
							accessTokenPayload,
						),
					);
					this.joinedOnce = true;
					this._rejoin(timeout);
					this.joinPush
						.receive("ok", async ({ postgres_changes }) => {
							var _a;
							this.socket.setAuth();
							if (postgres_changes === undefined) {
								callback === null || callback === void 0
									? void 0
									: callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
								return;
							} else {
								const clientPostgresBindings = this.bindings.postgres_changes;
								const bindingsLen =
									(_a =
										clientPostgresBindings === null ||
										clientPostgresBindings === void 0
											? void 0
											: clientPostgresBindings.length) !== null && _a !== void 0
										? _a
										: 0;
								const newPostgresBindings = [];
								for (let i = 0; i < bindingsLen; i++) {
									const clientPostgresBinding = clientPostgresBindings[i];
									const {
										filter: { event, schema, table, filter },
									} = clientPostgresBinding;
									const serverPostgresFilter =
										postgres_changes && postgres_changes[i];
									if (
										serverPostgresFilter &&
										serverPostgresFilter.event === event &&
										serverPostgresFilter.schema === schema &&
										serverPostgresFilter.table === table &&
										serverPostgresFilter.filter === filter
									) {
										newPostgresBindings.push(
											Object.assign(Object.assign({}, clientPostgresBinding), {
												id: serverPostgresFilter.id,
											}),
										);
									} else {
										this.unsubscribe();
										this.state =
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
												"CHANNEL_STATES"
											].errored;
										callback === null || callback === void 0
											? void 0
											: callback(
													REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR,
													new Error(
														"mismatch between server and client bindings for postgres changes",
													),
												);
										return;
									}
								}
								this.bindings.postgres_changes = newPostgresBindings;
								callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
								return;
							}
						})
						.receive("error", (error) => {
							this.state =
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
									"CHANNEL_STATES"
								].errored;
							callback === null || callback === void 0
								? void 0
								: callback(
										REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR,
										new Error(
											JSON.stringify(
												Object.values(error).join(", ") || "error",
											),
										),
									);
							return;
						})
						.receive("timeout", () => {
							callback === null || callback === void 0
								? void 0
								: callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
							return;
						});
				}
				return this;
			}
			presenceState() {
				return this.presence.state;
			}
			async track(payload, opts = {}) {
				return await this.send(
					{
						type: "presence",
						event: "track",
						payload,
					},
					opts.timeout || this.timeout,
				);
			}
			async untrack(opts = {}) {
				return await this.send(
					{
						type: "presence",
						event: "untrack",
					},
					opts,
				);
			}
			on(type, filter, callback) {
				if (
					this.state ===
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_STATES"
						].joined &&
					type === REALTIME_LISTEN_TYPES.PRESENCE
				) {
					this.socket.log(
						"channel",
						`resubscribe to ${this.topic} due to change in presence callbacks on joined channel`,
					);
					this.unsubscribe().then(() => this.subscribe());
				}
				return this._on(type, filter, callback);
			}
			/**
			 * Sends a broadcast message explicitly via REST API.
			 *
			 * This method always uses the REST API endpoint regardless of WebSocket connection state.
			 * Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
			 *
			 * @param event The name of the broadcast event
			 * @param payload Payload to be sent (required)
			 * @param opts Options including timeout
			 * @returns Promise resolving to object with success status, and error details if failed
			 */ async httpSend(event, payload, opts = {}) {
				var _a;
				const authorization = this.socket.accessTokenValue
					? `Bearer ${this.socket.accessTokenValue}`
					: "";
				if (payload === undefined || payload === null) {
					return Promise.reject("Payload is required for httpSend()");
				}
				const options = {
					method: "POST",
					headers: {
						Authorization: authorization,
						apikey: this.socket.apiKey ? this.socket.apiKey : "",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						messages: [
							{
								topic: this.subTopic,
								event,
								payload: payload,
								private: this.private,
							},
						],
					}),
				};
				const response = await this._fetchWithTimeout(
					this.broadcastEndpointURL,
					options,
					(_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout,
				);
				if (response.status === 202) {
					return {
						success: true,
					};
				}
				let errorMessage = response.statusText;
				try {
					const errorBody = await response.json();
					errorMessage = errorBody.error || errorBody.message || errorMessage;
				} catch (_b) {}
				return Promise.reject(new Error(errorMessage));
			}
			/**
			 * Sends a message into the channel.
			 *
			 * @param args Arguments to send to channel
			 * @param args.type The type of event to send
			 * @param args.event The name of the event being sent
			 * @param args.payload Payload to be sent
			 * @param opts Options to be used during the send process
			 */ async send(args, opts = {}) {
				var _a, _b;
				if (!this._canPush() && args.type === "broadcast") {
					console.warn(
						"Realtime send() is automatically falling back to REST API. " +
							"This behavior will be deprecated in the future. " +
							"Please use httpSend() explicitly for REST delivery.",
					);
					const { event, payload: endpoint_payload } = args;
					const authorization = this.socket.accessTokenValue
						? `Bearer ${this.socket.accessTokenValue}`
						: "";
					const options = {
						method: "POST",
						headers: {
							Authorization: authorization,
							apikey: this.socket.apiKey ? this.socket.apiKey : "",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							messages: [
								{
									topic: this.subTopic,
									event,
									payload: endpoint_payload,
									private: this.private,
								},
							],
						}),
					};
					try {
						const response = await this._fetchWithTimeout(
							this.broadcastEndpointURL,
							options,
							(_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout,
						);
						await ((_b = response.body) === null || _b === void 0
							? void 0
							: _b.cancel());
						return response.ok ? "ok" : "error";
					} catch (error) {
						if (error.name === "AbortError") {
							return "timed out";
						} else {
							return "error";
						}
					}
				} else {
					return new Promise((resolve) => {
						var _a, _b, _c;
						const push = this._push(
							args.type,
							args,
							opts.timeout || this.timeout,
						);
						if (
							args.type === "broadcast" &&
							!((_c =
								(_b =
									(_a = this.params) === null || _a === void 0
										? void 0
										: _a.config) === null || _b === void 0
									? void 0
									: _b.broadcast) === null || _c === void 0
								? void 0
								: _c.ack)
						) {
							resolve("ok");
						}
						push.receive("ok", () => resolve("ok"));
						push.receive("error", () => resolve("error"));
						push.receive("timeout", () => resolve("timed out"));
					});
				}
			}
			updateJoinPayload(payload) {
				this.joinPush.updatePayload(payload);
			}
			/**
			 * Leaves the channel.
			 *
			 * Unsubscribes from server events, and instructs channel to terminate on server.
			 * Triggers onClose() hooks.
			 *
			 * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
			 * channel.unsubscribe().receive("ok", () => alert("left!") )
			 */ unsubscribe(timeout = this.timeout) {
				this.state =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].leaving;
				const onClose = () => {
					this.socket.log("channel", `leave ${this.topic}`);
					this._trigger(
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_EVENTS"
						].close,
						"leave",
						this._joinRef(),
					);
				};
				this.joinPush.destroy();
				let leavePush = null;
				return new Promise((resolve) => {
					leavePush =
						new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$push$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"default"
						](
							this,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
								"CHANNEL_EVENTS"
							].leave,
							{},
							timeout,
						);
					leavePush
						.receive("ok", () => {
							onClose();
							resolve("ok");
						})
						.receive("timeout", () => {
							onClose();
							resolve("timed out");
						})
						.receive("error", () => {
							resolve("error");
						});
					leavePush.send();
					if (!this._canPush()) {
						leavePush.trigger("ok", {});
					}
				}).finally(() => {
					leavePush === null || leavePush === void 0
						? void 0
						: leavePush.destroy();
				});
			}
			/**
			 * Teardown the channel.
			 *
			 * Destroys and stops related timers.
			 */ teardown() {
				this.pushBuffer.forEach((push) => push.destroy());
				this.pushBuffer = [];
				this.rejoinTimer.reset();
				this.joinPush.destroy();
				this.state =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].closed;
				this.bindings = {};
			}
			/** @internal */ async _fetchWithTimeout(url, options, timeout) {
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), timeout);
				const response = await this.socket.fetch(
					url,
					Object.assign(Object.assign({}, options), {
						signal: controller.signal,
					}),
				);
				clearTimeout(id);
				return response;
			}
			/** @internal */ _push(event, payload, timeout = this.timeout) {
				if (!this.joinedOnce) {
					throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
				}
				const pushEvent =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$push$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"default"
					](this, event, payload, timeout);
				if (this._canPush()) {
					pushEvent.send();
				} else {
					this._addToPushBuffer(pushEvent);
				}
				return pushEvent;
			}
			/** @internal */ _addToPushBuffer(pushEvent) {
				pushEvent.startTimeout();
				this.pushBuffer.push(pushEvent);
				// Enforce buffer size limit
				if (
					this.pushBuffer.length >
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"MAX_PUSH_BUFFER_SIZE"
					]
				) {
					const removedPush = this.pushBuffer.shift();
					if (removedPush) {
						removedPush.destroy();
						this.socket.log(
							"channel",
							`discarded push due to buffer overflow: ${removedPush.event}`,
							removedPush.payload,
						);
					}
				}
			}
			/**
			 * Overridable message hook
			 *
			 * Receives all events for specialized message handling before dispatching to the channel callbacks.
			 * Must return the payload, modified or unmodified.
			 *
			 * @internal
			 */ _onMessage(_event, payload, _ref) {
				return payload;
			}
			/** @internal */ _isMember(topic) {
				return this.topic === topic;
			}
			/** @internal */ _joinRef() {
				return this.joinPush.ref;
			}
			/** @internal */ _trigger(type, payload, ref) {
				var _a, _b;
				const typeLower = type.toLocaleLowerCase();
				const { close, error, leave, join } =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_EVENTS"
					];
				const events = [close, error, leave, join];
				if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
					return;
				}
				let handledPayload = this._onMessage(typeLower, payload, ref);
				if (payload && !handledPayload) {
					throw "channel onMessage callbacks must return the payload, modified or unmodified";
				}
				if (["insert", "update", "delete"].includes(typeLower)) {
					(_a = this.bindings.postgres_changes) === null || _a === void 0
						? void 0
						: _a
								.filter((bind) => {
									var _a, _b, _c;
									return (
										((_a = bind.filter) === null || _a === void 0
											? void 0
											: _a.event) === "*" ||
										((_c =
											(_b = bind.filter) === null || _b === void 0
												? void 0
												: _b.event) === null || _c === void 0
											? void 0
											: _c.toLocaleLowerCase()) === typeLower
									);
								})
								.map((bind) => bind.callback(handledPayload, ref));
				} else {
					(_b = this.bindings[typeLower]) === null || _b === void 0
						? void 0
						: _b
								.filter((bind) => {
									var _a, _b, _c, _d, _e, _f;
									if (
										["broadcast", "presence", "postgres_changes"].includes(
											typeLower,
										)
									) {
										if ("id" in bind) {
											const bindId = bind.id;
											const bindEvent =
												(_a = bind.filter) === null || _a === void 0
													? void 0
													: _a.event;
											return (
												bindId &&
												((_b = payload.ids) === null || _b === void 0
													? void 0
													: _b.includes(bindId)) &&
												(bindEvent === "*" ||
													(bindEvent === null || bindEvent === void 0
														? void 0
														: bindEvent.toLocaleLowerCase()) ===
														((_c = payload.data) === null || _c === void 0
															? void 0
															: _c.type.toLocaleLowerCase()))
											);
										} else {
											const bindEvent =
												(_e =
													(_d =
														bind === null || bind === void 0
															? void 0
															: bind.filter) === null || _d === void 0
														? void 0
														: _d.event) === null || _e === void 0
													? void 0
													: _e.toLocaleLowerCase();
											return (
												bindEvent === "*" ||
												bindEvent ===
													((_f =
														payload === null || payload === void 0
															? void 0
															: payload.event) === null || _f === void 0
														? void 0
														: _f.toLocaleLowerCase())
											);
										}
									} else {
										return bind.type.toLocaleLowerCase() === typeLower;
									}
								})
								.map((bind) => {
									if (
										typeof handledPayload === "object" &&
										"ids" in handledPayload
									) {
										const postgresChanges = handledPayload.data;
										const { schema, table, commit_timestamp, type, errors } =
											postgresChanges;
										const enrichedPayload = {
											schema: schema,
											table: table,
											commit_timestamp: commit_timestamp,
											eventType: type,
											new: {},
											old: {},
											errors: errors,
										};
										handledPayload = Object.assign(
											Object.assign({}, enrichedPayload),
											this._getPayloadRecords(postgresChanges),
										);
									}
									bind.callback(handledPayload, ref);
								});
				}
			}
			/** @internal */ _isClosed() {
				return (
					this.state ===
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].closed
				);
			}
			/** @internal */ _isJoined() {
				return (
					this.state ===
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].joined
				);
			}
			/** @internal */ _isJoining() {
				return (
					this.state ===
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].joining
				);
			}
			/** @internal */ _isLeaving() {
				return (
					this.state ===
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].leaving
				);
			}
			/** @internal */ _replyEventName(ref) {
				return `chan_reply_${ref}`;
			}
			/** @internal */ _on(type, filter, callback) {
				const typeLower = type.toLocaleLowerCase();
				const binding = {
					type: typeLower,
					filter: filter,
					callback: callback,
				};
				if (this.bindings[typeLower]) {
					this.bindings[typeLower].push(binding);
				} else {
					this.bindings[typeLower] = [binding];
				}
				return this;
			}
			/** @internal */ _off(type, filter) {
				const typeLower = type.toLocaleLowerCase();
				if (this.bindings[typeLower]) {
					this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
						var _a;
						return !(
							((_a = bind.type) === null || _a === void 0
								? void 0
								: _a.toLocaleLowerCase()) === typeLower &&
							RealtimeChannel.isEqual(bind.filter, filter)
						);
					});
				}
				return this;
			}
			/** @internal */ static isEqual(obj1, obj2) {
				if (Object.keys(obj1).length !== Object.keys(obj2).length) {
					return false;
				}
				for (const k in obj1) {
					if (obj1[k] !== obj2[k]) {
						return false;
					}
				}
				return true;
			}
			/** @internal */ _rejoinUntilConnected() {
				this.rejoinTimer.scheduleTimeout();
				if (this.socket.isConnected()) {
					this._rejoin();
				}
			}
			/**
			 * Registers a callback that will be executed when the channel closes.
			 *
			 * @internal
			 */ _onClose(callback) {
				this._on(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_EVENTS"
					].close,
					{},
					callback,
				);
			}
			/**
			 * Registers a callback that will be executed when the channel encounteres an error.
			 *
			 * @internal
			 */ _onError(callback) {
				this._on(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_EVENTS"
					].error,
					{},
					(reason) => callback(reason),
				);
			}
			/**
			 * Returns `true` if the socket is connected and the channel has been joined.
			 *
			 * @internal
			 */ _canPush() {
				return this.socket.isConnected() && this._isJoined();
			}
			/** @internal */ _rejoin(timeout = this.timeout) {
				if (this._isLeaving()) {
					return;
				}
				this.socket._leaveOpenTopic(this.topic);
				this.state =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CHANNEL_STATES"
					].joining;
				this.joinPush.resend(timeout);
			}
			/** @internal */ _getPayloadRecords(payload) {
				const records = {
					new: {},
					old: {},
				};
				if (payload.type === "INSERT" || payload.type === "UPDATE") {
					records.new =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$transformers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"convertChangeData"
						](payload.columns, payload.record);
				}
				if (payload.type === "UPDATE" || payload.type === "DELETE") {
					records.old =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$transformers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"convertChangeData"
						](payload.columns, payload.old_record);
				}
				return records;
			}
		} //# sourceMappingURL=RealtimeChannel.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js [middleware-edge] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["default", () => RealtimeClient]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$websocket$2d$factory$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/constants.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$serializer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/serializer.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$timer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/timer.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$transformers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/transformers.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimeChannel$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js [middleware-edge] (ecmascript)",
			);
		const noop = () => {};
		// Connection-related constants
		const CONNECTION_TIMEOUTS = {
			HEARTBEAT_INTERVAL: 25000,
			RECONNECT_DELAY: 10,
			HEARTBEAT_TIMEOUT_FALLBACK: 100,
		};
		const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000];
		const DEFAULT_RECONNECT_FALLBACK = 10000;
		const WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
		class RealtimeClient {
			/**
			 * Initializes the Socket.
			 *
			 * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
			 * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
			 * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
			 * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
			 * @param options.params The optional params to pass when connecting.
			 * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
			 * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
			 * @param options.heartbeatCallback The optional function to handle heartbeat status.
			 * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
			 * @param options.logLevel Sets the log level for Realtime
			 * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
			 * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
			 * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
			 * @param options.worker Use Web Worker to set a side flow. Defaults to false.
			 * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
			 */ constructor(endPoint, options) {
				var _a;
				this.accessTokenValue = null;
				this.apiKey = null;
				this.channels = [];
				this.endPoint = "";
				this.httpEndpoint = "";
				/** @deprecated headers cannot be set on websocket connections */ this.headers =
					{};
				this.params = {};
				this.timeout =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"DEFAULT_TIMEOUT"
					];
				this.transport = null;
				this.heartbeatIntervalMs = CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
				this.heartbeatTimer = undefined;
				this.pendingHeartbeatRef = null;
				this.heartbeatCallback = noop;
				this.ref = 0;
				this.reconnectTimer = null;
				this.vsn =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"DEFAULT_VSN"
					];
				this.logger = noop;
				this.conn = null;
				this.sendBuffer = [];
				this.serializer =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$serializer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"default"
					]();
				this.stateChangeCallbacks = {
					open: [],
					close: [],
					error: [],
					message: [],
				};
				this.accessToken = null;
				this._connectionState = "disconnected";
				this._wasManualDisconnect = false;
				this._authPromise = null;
				/**
				 * Use either custom fetch, if provided, or default fetch to make HTTP requests
				 *
				 * @internal
				 */ this._resolveFetch = (customFetch) => {
					if (customFetch) {
						return (...args) => customFetch(...args);
					}
					return (...args) => fetch(...args);
				};
				// Validate required parameters
				if (
					!((_a =
						options === null || options === void 0
							? void 0
							: options.params) === null || _a === void 0
						? void 0
						: _a.apikey)
				) {
					throw new Error("API key is required to connect to Realtime");
				}
				this.apiKey = options.params.apikey;
				// Initialize endpoint URLs
				this.endPoint = `${endPoint}/${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["TRANSPORTS"].websocket}`;
				this.httpEndpoint = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$transformers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
					"httpEndpointURL"
				])(endPoint);
				this._initializeOptions(options);
				this._setupReconnectionTimer();
				this.fetch = this._resolveFetch(
					options === null || options === void 0 ? void 0 : options.fetch,
				);
			}
			/**
			 * Connects the socket, unless already connected.
			 */ connect() {
				// Skip if already connecting, disconnecting, or connected
				if (
					this.isConnecting() ||
					this.isDisconnecting() ||
					(this.conn !== null && this.isConnected())
				) {
					return;
				}
				this._setConnectionState("connecting");
				this._setAuthSafely("connect");
				// Establish WebSocket connection
				if (this.transport) {
					// Use custom transport if provided
					this.conn = new this.transport(this.endpointURL());
				} else {
					// Try to use native WebSocket
					try {
						this.conn =
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$websocket$2d$factory$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
								"default"
							].createWebSocket(this.endpointURL());
					} catch (error) {
						this._setConnectionState("disconnected");
						const errorMessage = error.message;
						// Provide helpful error message based on environment
						if (errorMessage.includes("Node.js")) {
							throw new Error(
								`${errorMessage}\n\n` +
									"To use Realtime in Node.js, you need to provide a WebSocket implementation:\n\n" +
									"Option 1: Use Node.js 22+ which has native WebSocket support\n" +
									'Option 2: Install and provide the "ws" package:\n\n' +
									"  npm install ws\n\n" +
									'  import ws from "ws"\n' +
									"  const client = new RealtimeClient(url, {\n" +
									"    ...options,\n" +
									"    transport: ws\n" +
									"  })",
							);
						}
						throw new Error(`WebSocket not available: ${errorMessage}`);
					}
				}
				this._setupConnectionHandlers();
			}
			/**
			 * Returns the URL of the websocket.
			 * @returns string The URL of the websocket.
			 */ endpointURL() {
				return this._appendParams(
					this.endPoint,
					Object.assign({}, this.params, {
						vsn: this.vsn,
					}),
				);
			}
			/**
			 * Disconnects the socket.
			 *
			 * @param code A numeric status code to send on disconnect.
			 * @param reason A custom reason for the disconnect.
			 */ disconnect(code, reason) {
				if (this.isDisconnecting()) {
					return;
				}
				this._setConnectionState("disconnecting", true);
				if (this.conn) {
					// Setup fallback timer to prevent hanging in disconnecting state
					const fallbackTimer = setTimeout(() => {
						this._setConnectionState("disconnected");
					}, 100);
					this.conn.onclose = () => {
						clearTimeout(fallbackTimer);
						this._setConnectionState("disconnected");
					};
					// Close the WebSocket connection
					if (code) {
						this.conn.close(
							code,
							reason !== null && reason !== void 0 ? reason : "",
						);
					} else {
						this.conn.close();
					}
					this._teardownConnection();
				} else {
					this._setConnectionState("disconnected");
				}
			}
			/**
			 * Returns all created channels
			 */ getChannels() {
				return this.channels;
			}
			/**
			 * Unsubscribes and removes a single channel
			 * @param channel A RealtimeChannel instance
			 */ async removeChannel(channel) {
				const status = await channel.unsubscribe();
				if (this.channels.length === 0) {
					this.disconnect();
				}
				return status;
			}
			/**
			 * Unsubscribes and removes all channels
			 */ async removeAllChannels() {
				const values_1 = await Promise.all(
					this.channels.map((channel) => channel.unsubscribe()),
				);
				this.channels = [];
				this.disconnect();
				return values_1;
			}
			/**
			 * Logs the message.
			 *
			 * For customized logging, `this.logger` can be overridden.
			 */ log(kind, msg, data) {
				this.logger(kind, msg, data);
			}
			/**
			 * Returns the current state of the socket.
			 */ connectionState() {
				switch (this.conn && this.conn.readyState) {
					case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"SOCKET_STATES"
					].connecting:
						return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CONNECTION_STATE"
						].Connecting;
					case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"SOCKET_STATES"
					].open:
						return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CONNECTION_STATE"
						].Open;
					case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"SOCKET_STATES"
					].closing:
						return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CONNECTION_STATE"
						].Closing;
					default:
						return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CONNECTION_STATE"
						].Closed;
				}
			}
			/**
			 * Returns `true` is the connection is open.
			 */ isConnected() {
				return (
					this.connectionState() ===
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"CONNECTION_STATE"
					].Open
				);
			}
			/**
			 * Returns `true` if the connection is currently connecting.
			 */ isConnecting() {
				return this._connectionState === "connecting";
			}
			/**
			 * Returns `true` if the connection is currently disconnecting.
			 */ isDisconnecting() {
				return this._connectionState === "disconnecting";
			}
			channel(
				topic,
				params = {
					config: {},
				},
			) {
				const realtimeTopic = `realtime:${topic}`;
				const exists = this.getChannels().find(
					(c) => c.topic === realtimeTopic,
				);
				if (!exists) {
					const chan =
						new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimeChannel$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"default"
						](`realtime:${topic}`, params, this);
					this.channels.push(chan);
					return chan;
				} else {
					return exists;
				}
			}
			/**
			 * Push out a message if the socket is connected.
			 *
			 * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
			 */ push(data) {
				const { topic, event, payload, ref } = data;
				const callback = () => {
					this.encode(data, (result) => {
						var _a;
						(_a = this.conn) === null || _a === void 0
							? void 0
							: _a.send(result);
					});
				};
				this.log("push", `${topic} ${event} (${ref})`, payload);
				if (this.isConnected()) {
					callback();
				} else {
					this.sendBuffer.push(callback);
				}
			}
			/**
			 * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
			 *
			 * If param is null it will use the `accessToken` callback function or the token set on the client.
			 *
			 * On callback used, it will set the value of the token internal to the client.
			 *
			 * @param token A JWT string to override the token set on the client.
			 */ async setAuth(token = null) {
				this._authPromise = this._performAuth(token);
				try {
					await this._authPromise;
				} finally {
					this._authPromise = null;
				}
			}
			/**
			 * Sends a heartbeat message if the socket is connected.
			 */ async sendHeartbeat() {
				var _a;
				if (!this.isConnected()) {
					try {
						this.heartbeatCallback("disconnected");
					} catch (e) {
						this.log("error", "error in heartbeat callback", e);
					}
					return;
				}
				// Handle heartbeat timeout and force reconnection if needed
				if (this.pendingHeartbeatRef) {
					this.pendingHeartbeatRef = null;
					this.log(
						"transport",
						"heartbeat timeout. Attempting to re-establish connection",
					);
					try {
						this.heartbeatCallback("timeout");
					} catch (e) {
						this.log("error", "error in heartbeat callback", e);
					}
					// Force reconnection after heartbeat timeout
					this._wasManualDisconnect = false;
					(_a = this.conn) === null || _a === void 0
						? void 0
						: _a.close(
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
									"WS_CLOSE_NORMAL"
								],
								"heartbeat timeout",
							);
					setTimeout(() => {
						var _a;
						if (!this.isConnected()) {
							(_a = this.reconnectTimer) === null || _a === void 0
								? void 0
								: _a.scheduleTimeout();
						}
					}, CONNECTION_TIMEOUTS.HEARTBEAT_TIMEOUT_FALLBACK);
					return;
				}
				// Send heartbeat message to server
				this.pendingHeartbeatRef = this._makeRef();
				this.push({
					topic: "phoenix",
					event: "heartbeat",
					payload: {},
					ref: this.pendingHeartbeatRef,
				});
				try {
					this.heartbeatCallback("sent");
				} catch (e) {
					this.log("error", "error in heartbeat callback", e);
				}
				this._setAuthSafely("heartbeat");
			}
			onHeartbeat(callback) {
				this.heartbeatCallback = callback;
			}
			/**
			 * Flushes send buffer
			 */ flushSendBuffer() {
				if (this.isConnected() && this.sendBuffer.length > 0) {
					this.sendBuffer.forEach((callback) => callback());
					this.sendBuffer = [];
				}
			}
			/**
			 * Return the next message ref, accounting for overflows
			 *
			 * @internal
			 */ _makeRef() {
				const newRef = this.ref + 1;
				if (newRef === this.ref) {
					this.ref = 0;
				} else {
					this.ref = newRef;
				}
				return this.ref.toString();
			}
			/**
			 * Unsubscribe from channels with the specified topic.
			 *
			 * @internal
			 */ _leaveOpenTopic(topic) {
				const dupChannel = this.channels.find(
					(c) => c.topic === topic && (c._isJoined() || c._isJoining()),
				);
				if (dupChannel) {
					this.log("transport", `leaving duplicate topic "${topic}"`);
					dupChannel.unsubscribe();
				}
			}
			/**
			 * Removes a subscription from the socket.
			 *
			 * @param channel An open subscription.
			 *
			 * @internal
			 */ _remove(channel) {
				this.channels = this.channels.filter((c) => c.topic !== channel.topic);
			}
			/** @internal */ _onConnMessage(rawMessage) {
				this.decode(rawMessage.data, (msg) => {
					// Handle heartbeat responses
					if (msg.topic === "phoenix" && msg.event === "phx_reply") {
						try {
							this.heartbeatCallback(
								msg.payload.status === "ok" ? "ok" : "error",
							);
						} catch (e) {
							this.log("error", "error in heartbeat callback", e);
						}
					}
					// Handle pending heartbeat reference cleanup
					if (msg.ref && msg.ref === this.pendingHeartbeatRef) {
						this.pendingHeartbeatRef = null;
					}
					// Log incoming message
					const { topic, event, payload, ref } = msg;
					const refString = ref ? `(${ref})` : "";
					const status = payload.status || "";
					this.log(
						"receive",
						`${status} ${topic} ${event} ${refString}`.trim(),
						payload,
					);
					// Route message to appropriate channels
					this.channels
						.filter((channel) => channel._isMember(topic))
						.forEach((channel) => channel._trigger(event, payload, ref));
					this._triggerStateCallbacks("message", msg);
				});
			}
			/**
			 * Clear specific timer
			 * @internal
			 */ _clearTimer(timer) {
				var _a;
				if (timer === "heartbeat" && this.heartbeatTimer) {
					clearInterval(this.heartbeatTimer);
					this.heartbeatTimer = undefined;
				} else if (timer === "reconnect") {
					(_a = this.reconnectTimer) === null || _a === void 0
						? void 0
						: _a.reset();
				}
			}
			/**
			 * Clear all timers
			 * @internal
			 */ _clearAllTimers() {
				this._clearTimer("heartbeat");
				this._clearTimer("reconnect");
			}
			/**
			 * Setup connection handlers for WebSocket events
			 * @internal
			 */ _setupConnectionHandlers() {
				if (!this.conn) return;
				// Set binary type if supported (browsers and most WebSocket implementations)
				if ("binaryType" in this.conn) {
					this.conn.binaryType = "arraybuffer";
				}
				this.conn.onopen = () => this._onConnOpen();
				this.conn.onerror = (error) => this._onConnError(error);
				this.conn.onmessage = (event) => this._onConnMessage(event);
				this.conn.onclose = (event) => this._onConnClose(event);
			}
			/**
			 * Teardown connection and cleanup resources
			 * @internal
			 */ _teardownConnection() {
				if (this.conn) {
					if (
						this.conn.readyState ===
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
								"SOCKET_STATES"
							].open ||
						this.conn.readyState ===
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
								"SOCKET_STATES"
							].connecting
					) {
						try {
							this.conn.close();
						} catch (e) {
							this.log("error", "Error closing connection", e);
						}
					}
					this.conn.onopen = null;
					this.conn.onerror = null;
					this.conn.onmessage = null;
					this.conn.onclose = null;
					this.conn = null;
				}
				this._clearAllTimers();
				this.channels.forEach((channel) => channel.teardown());
			}
			/** @internal */ _onConnOpen() {
				this._setConnectionState("connected");
				this.log("transport", `connected to ${this.endpointURL()}`);
				this.flushSendBuffer();
				this._clearTimer("reconnect");
				if (!this.worker) {
					this._startHeartbeat();
				} else {
					if (!this.workerRef) {
						this._startWorkerHeartbeat();
					}
				}
				this._triggerStateCallbacks("open");
			}
			/** @internal */ _startHeartbeat() {
				this.heartbeatTimer && clearInterval(this.heartbeatTimer);
				this.heartbeatTimer = setInterval(
					() => this.sendHeartbeat(),
					this.heartbeatIntervalMs,
				);
			}
			/** @internal */ _startWorkerHeartbeat() {
				if (this.workerUrl) {
					this.log("worker", `starting worker for from ${this.workerUrl}`);
				} else {
					this.log("worker", `starting default worker`);
				}
				const objectUrl = this._workerObjectUrl(this.workerUrl);
				this.workerRef = new Worker(objectUrl);
				this.workerRef.onerror = (error) => {
					this.log("worker", "worker error", error.message);
					this.workerRef.terminate();
				};
				this.workerRef.onmessage = (event) => {
					if (event.data.event === "keepAlive") {
						this.sendHeartbeat();
					}
				};
				this.workerRef.postMessage({
					event: "start",
					interval: this.heartbeatIntervalMs,
				});
			}
			/** @internal */ _onConnClose(event) {
				var _a;
				this._setConnectionState("disconnected");
				this.log("transport", "close", event);
				this._triggerChanError();
				this._clearTimer("heartbeat");
				// Only schedule reconnection if it wasn't a manual disconnect
				if (!this._wasManualDisconnect) {
					(_a = this.reconnectTimer) === null || _a === void 0
						? void 0
						: _a.scheduleTimeout();
				}
				this._triggerStateCallbacks("close", event);
			}
			/** @internal */ _onConnError(error) {
				this._setConnectionState("disconnected");
				this.log("transport", `${error}`);
				this._triggerChanError();
				this._triggerStateCallbacks("error", error);
			}
			/** @internal */ _triggerChanError() {
				this.channels.forEach((channel) =>
					channel._trigger(
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
							"CHANNEL_EVENTS"
						].error,
					),
				);
			}
			/** @internal */ _appendParams(url, params) {
				if (Object.keys(params).length === 0) {
					return url;
				}
				const prefix = url.match(/\?/) ? "&" : "?";
				const query = new URLSearchParams(params);
				return `${url}${prefix}${query}`;
			}
			_workerObjectUrl(url) {
				let result_url;
				if (url) {
					result_url = url;
				} else {
					const blob = new Blob([WORKER_SCRIPT], {
						type: "application/javascript",
					});
					result_url = URL.createObjectURL(blob);
				}
				return result_url;
			}
			/**
			 * Set connection state with proper state management
			 * @internal
			 */ _setConnectionState(state, manual = false) {
				this._connectionState = state;
				if (state === "connecting") {
					this._wasManualDisconnect = false;
				} else if (state === "disconnecting") {
					this._wasManualDisconnect = manual;
				}
			}
			/**
			 * Perform the actual auth operation
			 * @internal
			 */ async _performAuth(token = null) {
				let tokenToSend;
				if (token) {
					tokenToSend = token;
				} else if (this.accessToken) {
					// Always call the accessToken callback to get fresh token
					tokenToSend = await this.accessToken();
				} else {
					tokenToSend = this.accessTokenValue;
				}
				if (this.accessTokenValue != tokenToSend) {
					this.accessTokenValue = tokenToSend;
					this.channels.forEach((channel) => {
						const payload = {
							access_token: tokenToSend,
							version:
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
									"DEFAULT_VERSION"
								],
						};
						tokenToSend && channel.updateJoinPayload(payload);
						if (channel.joinedOnce && channel._isJoined()) {
							channel._push(
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
									"CHANNEL_EVENTS"
								].access_token,
								{
									access_token: tokenToSend,
								},
							);
						}
					});
				}
			}
			/**
			 * Wait for any in-flight auth operations to complete
			 * @internal
			 */ async _waitForAuthIfNeeded() {
				if (this._authPromise) {
					await this._authPromise;
				}
			}
			/**
			 * Safely call setAuth with standardized error handling
			 * @internal
			 */ _setAuthSafely(context = "general") {
				this.setAuth().catch((e) => {
					this.log("error", `error setting auth in ${context}`, e);
				});
			}
			/**
			 * Trigger state change callbacks with proper error handling
			 * @internal
			 */ _triggerStateCallbacks(event, data) {
				try {
					this.stateChangeCallbacks[event].forEach((callback) => {
						try {
							callback(data);
						} catch (e) {
							this.log("error", `error in ${event} callback`, e);
						}
					});
				} catch (e) {
					this.log("error", `error triggering ${event} callbacks`, e);
				}
			}
			/**
			 * Setup reconnection timer with proper configuration
			 * @internal
			 */ _setupReconnectionTimer() {
				this.reconnectTimer =
					new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$timer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"default"
					](async () => {
						setTimeout(async () => {
							await this._waitForAuthIfNeeded();
							if (!this.isConnected()) {
								this.connect();
							}
						}, CONNECTION_TIMEOUTS.RECONNECT_DELAY);
					}, this.reconnectAfterMs);
			}
			/**
			 * Initialize client options with defaults
			 * @internal
			 */ _initializeOptions(options) {
				var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
				// Set defaults
				this.transport =
					(_a =
						options === null || options === void 0
							? void 0
							: options.transport) !== null && _a !== void 0
						? _a
						: null;
				this.timeout =
					(_b =
						options === null || options === void 0
							? void 0
							: options.timeout) !== null && _b !== void 0
						? _b
						: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
								"DEFAULT_TIMEOUT"
							];
				this.heartbeatIntervalMs =
					(_c =
						options === null || options === void 0
							? void 0
							: options.heartbeatIntervalMs) !== null && _c !== void 0
						? _c
						: CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
				this.worker =
					(_d =
						options === null || options === void 0
							? void 0
							: options.worker) !== null && _d !== void 0
						? _d
						: false;
				this.accessToken =
					(_e =
						options === null || options === void 0
							? void 0
							: options.accessToken) !== null && _e !== void 0
						? _e
						: null;
				this.heartbeatCallback =
					(_f =
						options === null || options === void 0
							? void 0
							: options.heartbeatCallback) !== null && _f !== void 0
						? _f
						: noop;
				this.vsn =
					(_g =
						options === null || options === void 0 ? void 0 : options.vsn) !==
						null && _g !== void 0
						? _g
						: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
								"DEFAULT_VSN"
							];
				// Handle special cases
				if (options === null || options === void 0 ? void 0 : options.params)
					this.params = options.params;
				if (options === null || options === void 0 ? void 0 : options.logger)
					this.logger = options.logger;
				if (
					(options === null || options === void 0
						? void 0
						: options.logLevel) ||
					(options === null || options === void 0 ? void 0 : options.log_level)
				) {
					this.logLevel = options.logLevel || options.log_level;
					this.params = Object.assign(Object.assign({}, this.params), {
						log_level: this.logLevel,
					});
				}
				// Set up functions with defaults
				this.reconnectAfterMs =
					(_h =
						options === null || options === void 0
							? void 0
							: options.reconnectAfterMs) !== null && _h !== void 0
						? _h
						: (tries) => {
								return (
									RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK
								);
							};
				switch (this.vsn) {
					case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"VSN_1_0_0"
					]:
						this.encode =
							(_j =
								options === null || options === void 0
									? void 0
									: options.encode) !== null && _j !== void 0
								? _j
								: (payload, callback) => {
										return callback(JSON.stringify(payload));
									};
						this.decode =
							(_k =
								options === null || options === void 0
									? void 0
									: options.decode) !== null && _k !== void 0
								? _k
								: (payload, callback) => {
										return callback(JSON.parse(payload));
									};
						break;
					case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
						"VSN_2_0_0"
					]:
						this.encode =
							(_l =
								options === null || options === void 0
									? void 0
									: options.encode) !== null && _l !== void 0
								? _l
								: this.serializer.encode.bind(this.serializer);
						this.decode =
							(_m =
								options === null || options === void 0
									? void 0
									: options.decode) !== null && _m !== void 0
								? _m
								: this.serializer.decode.bind(this.serializer);
						break;
					default:
						throw new Error(`Unsupported serializer version: ${this.vsn}`);
				}
				// Handle worker setup
				if (this.worker) {
					if (
						("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
					);
					this.workerUrl =
						options === null || options === void 0 ? void 0 : options.workerUrl;
				}
			}
		} //# sourceMappingURL=RealtimeClient.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/index.js [middleware-edge] (ecmascript) <locals>",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimeClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimeChannel$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimePresence$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js [middleware-edge] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$lib$2f$websocket$2d$factory$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js [middleware-edge] (ecmascript)",
			);
		//# sourceMappingURL=index.js.map
	},
	"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js [middleware-edge] (ecmascript) <export default as RealtimeClient>",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"RealtimeClient",
			() =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimeClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__[
					"default"
				],
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$realtime$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$realtime$2d$js$2f$dist$2f$module$2f$RealtimeClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@supabase+realtime-js@2.81.0/node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js [middleware-edge] (ecmascript)",
			);
	},
]);

//# sourceMappingURL=526ad_%40supabase_realtime-js_dist_module_baaa373b._.js.map
