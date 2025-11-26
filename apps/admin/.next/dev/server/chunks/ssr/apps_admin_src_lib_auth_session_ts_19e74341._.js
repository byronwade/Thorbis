module.exports = [
	"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript, async loader)",
	(__turbopack_context__) => {
		__turbopack_context__.v((parentImport) => {
			return Promise.all(
				["server/chunks/ssr/_99dd59fa._.js"].map((chunk) =>
					__turbopack_context__.l(chunk),
				),
			).then(() => {
				return parentImport(
					"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript)",
				);
			});
		});
	},
];
