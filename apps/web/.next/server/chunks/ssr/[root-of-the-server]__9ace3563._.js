module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},997868,a=>{a.n(a.i(884849))},592581,a=>{a.n(a.i(596565))},134005,a=>{a.n(a.i(977930))},565165,a=>{a.n(a.i(728209))},147941,a=>{a.n(a.i(484103))},304434,a=>{a.n(a.i(632684))},407521,a=>{a.n(a.i(693094))},797797,a=>{a.n(a.i(977207))},290022,a=>{a.n(a.i(362735))},729157,a=>{a.n(a.i(470009))},416128,a=>{"use strict";a.i(730154),a.s([])},749647,a=>{a.n(a.i(276089))},891183,a=>{a.n(a.i(823574))},933633,a=>{a.n(a.i(907588))},644338,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call TechnicianDayView() from the server but TechnicianDayView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/app/(dashboard)/dashboard/schedule/technician/[id]/technician-day-view.tsx <module evaluation>","TechnicianDayView");a.s(["TechnicianDayView",0,b])},160726,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call TechnicianDayView() from the server but TechnicianDayView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/app/(dashboard)/dashboard/schedule/technician/[id]/technician-day-view.tsx","TechnicianDayView");a.s(["TechnicianDayView",0,b])},798143,a=>{"use strict";a.i(644338);var b=a.i(160726);a.n(b)},308053,a=>{"use strict";var b=a.i(504348),c=a.i(445074);a.i(692167);var d=a.i(852596),e=a.i(429969),f=a.i(136874),g=a.i(798143);a.i(416128);var h=a.i(109483);function i(){return(0,b.jsxs)("div",{className:"flex h-full flex-col",children:[(0,b.jsx)("div",{className:"border-b bg-card px-6 py-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)(h.Skeleton,{className:"h-16 w-16 rounded-full"}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(h.Skeleton,{className:"h-6 w-48"}),(0,b.jsx)(h.Skeleton,{className:"h-4 w-32"})]}),(0,b.jsxs)("div",{className:"ml-auto flex gap-2",children:[(0,b.jsx)(h.Skeleton,{className:"h-9 w-24"}),(0,b.jsx)(h.Skeleton,{className:"h-9 w-24"})]})]})}),(0,b.jsx)("div",{className:"border-b bg-muted/30 px-6 py-3",children:(0,b.jsx)("div",{className:"flex gap-6",children:[void 0,void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(h.Skeleton,{className:"h-8 w-8 rounded"}),(0,b.jsxs)("div",{className:"space-y-1",children:[(0,b.jsx)(h.Skeleton,{className:"h-3 w-16"}),(0,b.jsx)(h.Skeleton,{className:"h-5 w-12"})]})]},c))})}),(0,b.jsxs)("div",{className:"flex flex-1 overflow-hidden",children:[(0,b.jsxs)("div",{className:"flex-1 border-r p-6",children:[(0,b.jsx)(h.Skeleton,{className:"mb-4 h-6 w-32"}),(0,b.jsx)("div",{className:"space-y-4",children:[void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsxs)("div",{className:"flex gap-4",children:[(0,b.jsx)(h.Skeleton,{className:"h-12 w-12 rounded-full"}),(0,b.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,b.jsx)(h.Skeleton,{className:"h-5 w-48"}),(0,b.jsx)(h.Skeleton,{className:"h-4 w-64"}),(0,b.jsx)(h.Skeleton,{className:"h-4 w-32"})]})]},c))})]}),(0,b.jsxs)("div",{className:"w-[500px] p-6",children:[(0,b.jsx)(h.Skeleton,{className:"mb-4 h-6 w-24"}),(0,b.jsx)(h.Skeleton,{className:"h-[400px] w-full rounded-lg"})]})]})]})}async function j({params:a}){let{id:b}=await a,c=await (0,f.createClient)(),{data:d}=await c.from("team_members").select(`
			invited_name,
			user:users (name)
		`).eq("id",b).single(),e=d?.user?.name||d?.invited_name;return{title:e?`${e} - Today's Schedule`:"Technician Schedule",description:"View technician's daily schedule, route, and performance"}}async function k({technicianId:a}){let e=await (0,f.createClient)(),h=await (0,c.getActiveCompanyId)();h||(0,d.notFound)();let{data:i,error:j}=await e.from("team_members").select(`
			id,
			invited_name,
			email,
			phone,
			role,
			status,
			job_title,
			department,
			joined_at,
			user:users (
				name,
				avatar,
				phone,
				bio
			)
		`).eq("id",a).eq("company_id",h).single();(j||!i)&&(0,d.notFound)();let k={id:i.id,name:i.user?.name||i.invited_name||"Unknown",email:i.email,phone:i.phone||i.user?.phone,avatar:i.user?.avatar,role:i.role,status:i.status,job_title:i.job_title,department:i.department,joined_at:i.joined_at,bio:i.user?.bio},l=new Date;l.setHours(0,0,0,0);let m=new Date(l);m.setDate(m.getDate()+1);let{data:n}=await e.from("appointments").select(`
			id,
			scheduled_start,
			scheduled_end,
			status,
			notes,
			job:jobs (
				id,
				title,
				description,
				job_type,
				priority,
				status,
				total_amount,
				customer:customers (
					id,
					display_name,
					phone,
					email,
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
		`).eq("company_id",h).contains("assigned_technician_ids",[a]).gte("scheduled_start",l.toISOString()).lt("scheduled_start",m.toISOString()).order("scheduled_start",{ascending:!0}),{data:o}=await e.from("jobs").select(`
			id,
			title,
			job_type,
			priority,
			status,
			total_amount,
			customer:customers (
				id,
				display_name,
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
		`).eq("company_id",h).eq("status","pending").is("archived_at",null).limit(20),{data:p}=await e.from("technician_locations").select("*").eq("technician_id",a).single(),q=new Date;q.setDate(q.getDate()-30);let{data:r}=await e.from("appointments").select("id, status, scheduled_start, actual_start, actual_end").eq("company_id",h).contains("assigned_technician_ids",[a]).gte("scheduled_start",q.toISOString()).lt("scheduled_start",m.toISOString()),s=r?.filter(a=>"completed"===a.status||"closed"===a.status).length||0,t=r?.length||0,u=n||[],v=u.filter(a=>"completed"===a.status||"closed"===a.status).length,w=u.length;return(0,b.jsx)(g.TechnicianDayView,{technician:k,appointments:n||[],unassignedJobs:o||[],gpsLocation:p,stats:{todayCompleted:v,todayTotal:w,todayRemaining:w-v,monthCompleted:s,monthTotal:t,completionRate:t>0?s/t*100:0},companyId:h})}async function l({params:a}){let{id:c}=await a;return(0,b.jsx)(e.Suspense,{fallback:(0,b.jsx)(i,{}),children:(0,b.jsx)(k,{technicianId:c})})}a.s(["default",()=>l,"generateMetadata",()=>j],308053)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__9ace3563._.js.map