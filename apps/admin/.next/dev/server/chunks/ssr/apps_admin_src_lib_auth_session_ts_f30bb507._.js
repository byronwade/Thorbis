module.exports = [
	"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript, async loader)",
	(__turbopack_context__) => {
		__turbopack_context__.v((parentImport) => {
			return Promise.all(
				[
					"server/chunks/ssr/apps_admin_src_lib_auth_session_ts_777a7544._.js",
				].map((chunk) => __turbopack_context__.l(chunk)),
			).then(() => {
				return parentImport(
					"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript)",
				);
			});
		});
	},
];
