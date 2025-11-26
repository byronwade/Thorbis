module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},997868,a=>{a.n(a.i(884849))},592581,a=>{a.n(a.i(596565))},134005,a=>{a.n(a.i(977930))},565165,a=>{a.n(a.i(728209))},147941,a=>{a.n(a.i(484103))},304434,a=>{a.n(a.i(632684))},407521,a=>{a.n(a.i(693094))},797797,a=>{a.n(a.i(977207))},290022,a=>{a.n(a.i(362735))},729157,a=>{a.n(a.i(470009))},416128,a=>{"use strict";a.i(730154),a.s([])},749647,a=>{a.n(a.i(276089))},891183,a=>{a.n(a.i(823574))},933633,a=>{a.n(a.i(907588))},844685,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call DispatchMapView() from the server but DispatchMapView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/app/(dashboard)/dashboard/schedule/dispatch-map/dispatch-map-view.tsx <module evaluation>","DispatchMapView");a.s(["DispatchMapView",0,b])},643788,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call DispatchMapView() from the server but DispatchMapView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/app/(dashboard)/dashboard/schedule/dispatch-map/dispatch-map-view.tsx","DispatchMapView");a.s(["DispatchMapView",0,b])},682297,a=>{"use strict";a.i(844685);var b=a.i(643788);a.n(b)},787061,a=>{"use strict";var b=a.i(504348),c=a.i(429969),d=a.i(136874),e=a.i(445074),f=a.i(682297);a.i(416128);var g=a.i(109483);function h(){return(0,b.jsxs)("div",{className:"relative h-full w-full bg-muted/30",children:[(0,b.jsx)(g.Skeleton,{className:"absolute inset-0"}),(0,b.jsx)("div",{className:"absolute left-4 top-4 w-80",children:(0,b.jsx)(g.Skeleton,{className:"h-[500px] rounded-lg"})})]})}async function i(){let a=await (0,d.createClient)(),c=await (0,e.getActiveCompanyId)();if(!c)return(0,b.jsx)("div",{className:"flex h-full items-center justify-center",children:(0,b.jsx)("p",{children:"Please sign in to view the dispatch map"})});let g=new Date;g.setHours(0,0,0,0);let h=new Date(g);h.setDate(h.getDate()+1);let{data:i}=await a.from("team_members").select(`
			id,
			invited_name,
			email,
			phone,
			role,
			status,
			user:users (
				name,
				avatar
			)
		`).eq("company_id",c).eq("role","technician").is("archived_at",null),j=(i||[]).map(a=>({id:a.id,name:a.user?.name||a.invited_name||"Unknown",email:a.email,phone:a.phone,avatar:a.user?.avatar,role:a.role,status:a.status})),{data:k}=await a.from("technician_locations").select("*").eq("company_id",c),{data:l}=await a.from("appointments").select(`
			id,
			scheduled_start,
			scheduled_end,
			status,
			assigned_technician_ids,
			job:jobs (
				id,
				title,
				job_type,
				priority,
				status,
				total_amount,
				customer:customers (
					id,
					display_name,
					phone,
					address,
					city,
					state,
					zip_code,
					lat,
					lon
				),
				property:properties (
					id,
					address,
					city,
					state,
					zip_code,
					lat,
					lon
				)
			)
		`).eq("company_id",c).gte("scheduled_start",g.toISOString()).lt("scheduled_start",h.toISOString()).order("scheduled_start",{ascending:!0}),{data:m}=await a.from("jobs").select(`
			id,
			title,
			job_type,
			priority,
			status,
			total_amount,
			customer:customers (
				id,
				display_name,
				phone,
				address,
				city,
				state,
				lat,
				lon
			),
			property:properties (
				id,
				address,
				city,
				state,
				lat,
				lon
			)
		`).eq("company_id",c).eq("status","pending").is("archived_at",null).limit(50),{data:n}=await a.from("company_settings").select("address, city, state").eq("company_id",c).single();return(0,b.jsx)(f.DispatchMapView,{technicians:j||[],gpsLocations:k||[],appointments:l||[],unassignedJobs:m||[],companyId:c,defaultCenter:n?.city?{address:`${n.address}, ${n.city}, ${n.state}`}:void 0})}function j(){return(0,b.jsx)("div",{className:"h-[calc(100vh-4rem)] w-full overflow-hidden",children:(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)(h,{}),children:(0,b.jsx)(i,{})})})}a.s(["default",()=>j,"metadata",0,{title:"Dispatch Map - Live Fleet View",description:"Real-time map view of all technicians and jobs"}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf90ab26._.js.map