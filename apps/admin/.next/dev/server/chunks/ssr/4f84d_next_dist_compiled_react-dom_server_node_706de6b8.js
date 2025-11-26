module.exports = [
	"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react-dom/server.node.js [app-rsc] (ecmascript, async loader)",
	(__turbopack_context__) => {
		__turbopack_context__.v((parentImport) => {
			return Promise.all(
				[
					"server/chunks/ssr/4f84d_next_dist_compiled_14c3157b._.js",
					"server/chunks/ssr/[root-of-the-server]__d50f6093._.js",
				].map((chunk) => __turbopack_context__.l(chunk)),
			).then(() => {
				return parentImport(
					"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react-dom/server.node.js [app-rsc] (ecmascript)",
				);
			});
		});
	},
];
