module.exports = [
	"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript, async loader)",
	(__turbopack_context__) => {
		__turbopack_context__.v((parentImport) => {
			return Promise.resolve().then(() => {
				return parentImport(
					"[project]/apps/admin/src/lib/auth/session.ts [app-rsc] (ecmascript)",
				);
			});
		});
	},
	"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript, async loader)",
	(__turbopack_context__) => {
		__turbopack_context__.v((parentImport) => {
			return Promise.all(
				[
					"server/chunks/ssr/apps_admin_src_lib_supabase_server_ts_03f3d7b3._.js",
				].map((chunk) => __turbopack_context__.l(chunk)),
			).then(() => {
				return parentImport(
					"[project]/apps/admin/src/lib/supabase/server.ts [app-rsc] (ecmascript)",
				);
			});
		});
	},
];
