module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},997868,a=>{a.n(a.i(884849))},592581,a=>{a.n(a.i(596565))},134005,a=>{a.n(a.i(977930))},565165,a=>{a.n(a.i(728209))},147941,a=>{a.n(a.i(484103))},304434,a=>{a.n(a.i(632684))},407521,a=>{a.n(a.i(693094))},797797,a=>{a.n(a.i(977207))},290022,a=>{a.n(a.i(362735))},729157,a=>{a.n(a.i(470009))},543474,a=>{"use strict";var b=a.i(429969);let c=a=>{let b=a.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,b,c)=>c?c.toUpperCase():b.toLowerCase());return b.charAt(0).toUpperCase()+b.slice(1)},d=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var e={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let f=(0,b.forwardRef)(({color:a="currentColor",size:c=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...e,width:c,height:c,stroke:a,strokeWidth:g?24*Number(f)/Number(c):f,className:d("lucide",h),...!i&&!(a=>{for(let b in a)if(b.startsWith("aria-")||"role"===b||"title"===b)return!0})(k)&&{"aria-hidden":"true"},...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]])),g=(a,e)=>{let g=(0,b.forwardRef)(({className:g,...h},i)=>(0,b.createElement)(f,{ref:i,iconNode:e,className:d(`lucide-${c(a).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${a}`,g),...h}));return g.displayName=c(a),g};a.s(["default",()=>g],543474)},811998,a=>{a.n(a.i(796608))},204265,a=>{a.n(a.i(492718))},388141,a=>{a.n(a.i(765017))},782955,a=>{"use strict";let b=(0,a.i(543474).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);a.s(["Loader2",()=>b],782955)},439186,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call TeamsPageClient() from the server but TeamsPageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/communication/teams-page-client.tsx <module evaluation>","TeamsPageClient");a.s(["TeamsPageClient",0,b])},755264,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call TeamsPageClient() from the server but TeamsPageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/communication/teams-page-client.tsx","TeamsPageClient");a.s(["TeamsPageClient",0,b])},930137,a=>{"use strict";a.i(439186);var b=a.i(755264);a.n(b)},892539,a=>{"use strict";var b=a.i(504348),c=a.i(782955),d=a.i(429969),e=a.i(930137);a.i(467361);var f=a.i(445074),g=a.i(136874);let h=(0,d.cache)(async()=>{let a=await (0,f.getActiveCompanyId)();if(!a)return{channels:[],total:0};let b=await (0,g.createClient)();if(!b)return{channels:[],total:0};let{data:c,error:d,count:e}=await b.from("team_channels").select(`
			id,
			company_id,
			name,
			description,
			type,
			created_at,
			updated_at
		`,{count:"exact"}).eq("company_id",a).order("name",{ascending:!0});return d||!c?{channels:[],total:0}:{channels:c,total:e??0}});function i(){return(0,b.jsx)("div",{className:"flex h-full w-full items-center justify-center bg-sidebar",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)(c.Loader2,{className:"h-8 w-8 animate-spin text-primary mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Loading channels..."})]})})}async function j({searchParams:a}){let c=await a,d=c?.channel||null,{channels:f}=await h();return(0,b.jsx)(e.TeamsPageClient,{initialChannels:f,initialChannelId:d})}async function k({searchParams:a}){return(0,b.jsx)(d.Suspense,{fallback:(0,b.jsx)(i,{}),children:(0,b.jsx)(j,{searchParams:a})})}(0,d.cache)(async a=>{let b=await (0,f.getActiveCompanyId)();if(!b)return null;let c=await (0,g.createClient)();if(!c)return null;let{data:d,error:e}=await c.from("team_channels").select(`
			id,
			company_id,
			name,
			description,
			type,
			created_at,
			updated_at
		`).eq("id",a).eq("company_id",b).single();return e||!d?null:d}),(0,d.cache)(async(a,b=100,c=0)=>{let d=await (0,f.getActiveCompanyId)();if(!d)return{messages:[],total:0,hasMore:!1};let e=await (0,g.createClient)();if(!e)return{messages:[],total:0,hasMore:!1};let{data:h,error:i,count:j}=await e.from("team_messages").select(`
			id,
			channel_id,
			company_id,
			team_member_id,
			message,
			attachments,
			created_at,
			updated_at,
			read_at,
			teamMember:team_members!team_member_id(
				id,
				first_name,
				last_name,
				email,
				role
			)
		`,{count:"exact"}).eq("channel_id",a).eq("company_id",d).order("created_at",{ascending:!0}).range(c,c+b-1);if(i||!h)return{messages:[],total:0,hasMore:!1};let k=j??0,l=k>c+b;return{messages:h,total:k,hasMore:l}}),(0,d.cache)(async a=>{let b=await (0,f.getActiveCompanyId)();if(!b)return null;let c=await (0,g.createClient)();if(!c)return null;let{data:d,error:e}=await c.from("team_messages").select(`
			id,
			channel_id,
			company_id,
			team_member_id,
			message,
			attachments,
			created_at,
			updated_at,
			read_at,
			teamMember:team_members!team_member_id(
				id,
				first_name,
				last_name,
				email,
				role
			)
		`).eq("id",a).eq("company_id",b).single();return e||!d?null:d}),a.s(["default",()=>k],892539)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b4d8f80._.js.map