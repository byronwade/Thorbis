module.exports = [
	"[externals]/prettier/plugins/html [external] (prettier/plugins/html, esm_import)",
	(__turbopack_context__) => {
		"use strict";

		return __turbopack_context__.a(
			async (
				__turbopack_handle_async_dependencies__,
				__turbopack_async_result__,
			) => {
				try {
					const mod = await __turbopack_context__.y("prettier/plugins/html");

					__turbopack_context__.n(mod);
					__turbopack_async_result__();
				} catch (e) {
					__turbopack_async_result__(e);
				}
			},
			true,
		);
	},
	"[externals]/prettier/standalone [external] (prettier/standalone, esm_import)",
	(__turbopack_context__) => {
		"use strict";

		return __turbopack_context__.a(
			async (
				__turbopack_handle_async_dependencies__,
				__turbopack_async_result__,
			) => {
				try {
					const mod = await __turbopack_context__.y("prettier/standalone");

					__turbopack_context__.n(mod);
					__turbopack_async_result__();
				} catch (e) {
					__turbopack_async_result__(e);
				}
			},
			true,
		);
	},
	"[externals]/node:stream [external] (node:stream, cjs)",
	(__turbopack_context__, module, exports) => {
		const mod = __turbopack_context__.x("node:stream", () =>
			require("node:stream"),
		);

		module.exports = mod;
	},
];
