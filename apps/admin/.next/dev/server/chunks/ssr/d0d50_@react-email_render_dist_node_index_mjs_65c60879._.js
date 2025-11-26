module.exports = [
	"[project]/node_modules/.pnpm/@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@react-email/render/dist/node/index.mjs [app-rsc] (ecmascript, async loader)",
	(__turbopack_context__) => {
		__turbopack_context__.v((parentImport) => {
			return Promise.all(
				[
					"server/chunks/ssr/4f84d_next_dist_compiled_react-dom_server_node_706de6b8.js",
					"server/chunks/ssr/node_modules__pnpm_f4e59ad3._.js",
					"server/chunks/ssr/[root-of-the-server]__f8153c6d._.js",
				].map((chunk) => __turbopack_context__.l(chunk)),
			).then(() => {
				return parentImport(
					"[project]/node_modules/.pnpm/@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@react-email/render/dist/node/index.mjs [app-rsc] (ecmascript)",
				);
			});
		});
	},
];
