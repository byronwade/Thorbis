module.exports=[389568,e=>{"use strict";var t=e.i(755535),a=e.i(377233),n=e.i(490003),s=e.i(492991),i=e.i(241970),o=e.i(357699),r=e.i(212454),c=e.i(48717),l=e.i(798301),d=e.i(986366),u=e.i(983537),p=e.i(147475),m=e.i(561930),_=e.i(803747),h=e.i(368557),g=e.i(42037),f=e.i(193695);e.i(432036);var v=e.i(573881),y=e.i(476674),w=e.i(353344),$=e.i(23322),R=e.i(443608),C=e.i(273568),b=e.i(477902),A=e.i(536804);let S=new Map;async function x(e){let t=(0,C.createServiceSupabaseClient)(),{data:a}=await t.from("ai_agent_settings").select("*").eq("company_id",e).single();return a}async function E(e){let t,a=(t=S.get(e))&&Date.now()-t.timestamp<3e5?t.data:null;if(a)return a;let n=(0,C.createServiceSupabaseClient)(),[s,i,o,r,c,l,d,u,p,m]=await Promise.all([n.from("companies").select("name, industry, phone, email, address, city, state, zip_code, website, timezone, business_hours").eq("id",e).single(),n.from("customers").select("id",{count:"exact",head:!0}).eq("company_id",e).eq("status","active"),n.from("profiles").select("id, role").eq("company_id",e),n.from("vendors").select("id",{count:"exact",head:!0}).eq("company_id",e).eq("is_active",!0),n.from("jobs").select("id, status").eq("company_id",e).in("status",["pending","in_progress","scheduled"]).limit(500),n.from("invoices").select("id, status, total_amount").eq("company_id",e).in("status",["draft","sent","pending"]).limit(500),n.from("invoices").select("id, total_amount, due_date").eq("company_id",e).eq("status","pending").lt("due_date",new Date().toISOString()).limit(100),n.from("appointments").select("id, status").eq("company_id",e).gte("scheduled_start",new Date().toISOString().split("T")[0]).lt("scheduled_start",new Date(Date.now()+864e5).toISOString().split("T")[0]),n.from("equipment").select("id, next_service_date").eq("company_id",e).lt("next_service_date",new Date(Date.now()+2592e6).toISOString()),n.from("jobs").select("id, total_amount").eq("company_id",e).eq("status","completed").gte("completed_at",new Date(Date.now()-2592e6).toISOString()).limit(500)]),_=s.data,h=i.count||0,g=o.data||[],f=r.count||0,v=c.data||[],y=l.data||[],w=d.data||[],$=u.data||[],R=p.data||[],b=m.data||[],A=g.reduce((e,t)=>{let a=t.role||"staff";return e[a]=(e[a]||0)+1,e},{}),x=v.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{}),E=y.reduce((e,t)=>e+(t.total_amount||0),0),I=w.reduce((e,t)=>e+(t.total_amount||0),0),T=b.reduce((e,t)=>e+(t.total_amount||0),0),N=e=>`$${(e/100).toLocaleString("en-US",{minimumFractionDigits:2})}`,q=`
## Company Information
- Name: ${_?.name||"Unknown"}
- Industry: ${_?.industry||"Service Business"}
- Phone: ${_?.phone||"Not configured"}
- Email: ${_?.email||"Not configured"}
- Location: ${_?.city?`${_.city}, ${_.state} ${_.zip_code}`:"Not configured"}
- Timezone: ${_?.timezone||"America/New_York"}

## Team Overview
- Total Team Members: ${g.length}
${Object.entries(A).map(([e,t])=>`- ${e.charAt(0).toUpperCase()+e.slice(1)}s: ${t}`).join("\n")}

## Business Metrics (Current)
- Active Customers: ${h}
- Active Vendors: ${f}
- Active Jobs: ${v.length} (${Object.entries(x).map(([e,t])=>`${t} ${e}`).join(", ")||"none"})
- Today's Appointments: ${$.length}
- Equipment Needing Service (next 30 days): ${R.length}

## Financial Overview
- Pending Invoices: ${y.length} (${N(E)})
- Overdue Invoices: ${w.length} (${N(I)})${w.length>0?" ⚠️ ATTENTION NEEDED":""}
- Last 30 Days Revenue: ${N(T)}

## Important Alerts
${w.length>0?`- ${w.length} overdue invoice(s) totaling ${N(I)} need attention`:""}
${R.length>0?`- ${R.length} piece(s) of equipment due for maintenance`:""}
${x.pending?`- ${x.pending} job(s) pending assignment`:""}
${!w.length&&!R.length&&!x.pending?"- No urgent issues at this time":""}
`;if(S.set(e,{data:q,timestamp:Date.now()}),S.size>100){let e=Date.now();for(let[t,a]of S)e-a.timestamp>3e5&&S.delete(t)}return q}let I=(0,w.tool)({description:"Request user approval before taking an action. Use this when you need permission to proceed.",parameters:R.z.object({action:R.z.string().describe("The action you want to take"),reason:R.z.string().describe("Why this action is beneficial"),details:R.z.string().describe("Specific details of what will happen")}),execute:async({action:e,reason:t,details:a})=>({requiresApproval:!0,action:e,reason:t,details:a,message:`I'd like to ${e}. ${t}. This will: ${a}. Do you approve?`})});async function T(e){try{let t,a,{messages:n,companyId:s,userId:i,chatId:o,model:r}=await e.json();if(!(n&&Array.isArray(n)))return Response.json({error:"Messages are required"},{status:400});let c=s||process.env.DEFAULT_COMPANY_ID;if(!c)return Response.json({error:"Company ID required"},{status:400});let l=o||crypto.randomUUID(),d=crypto.randomUUID(),[u,p]=await Promise.all([x(c),E(c)]),m=(t=u?.permission_mode||"ask_permission",a=[],u?.proactive_customer_outreach&&a.push("customer outreach"),u?.proactive_financial_advice&&a.push("financial advice"),u?.proactive_scheduling_suggestions&&a.push("scheduling optimization"),`You are an AI business manager assistant for a field service company. You act as a proactive manager helping owners and staff run their business efficiently.

${p}

## Your Role
- Help manage customers, jobs, invoices, and communications
- Provide business insights and recommendations
- ${a.length>0?`Proactively assist with: ${a.join(", ")}`:"Respond to user requests"}
- Be professional, helpful, and efficient

## Permission Level: ${t.toUpperCase()}
${({autonomous:"You can take actions directly without asking for permission. Execute tasks proactively to help the business.",ask_permission:"Always ask for confirmation before taking actions that modify data, send communications, or involve money. Explain what you plan to do and wait for approval.",manual_only:"Only respond to direct questions. Do not take any actions unless explicitly instructed by the user.",disabled:"You can only provide information and answer questions. You cannot execute any tools or take actions."})[t]}

## Available Capabilities
${u?`
### Customer Communication
- Send Emails to Customers: ${u.can_send_emails?"Yes":"No"}
- Send SMS to Customers: ${u.can_send_sms?"Yes":"No"}
- Make Calls: ${u.can_make_calls?"Yes":"No"}

### Team Communication
- Send Emails to Team: ${u.can_email_team?"Yes":"No"}
- Send SMS to Team: ${u.can_sms_team?"Yes":"No"}

### Vendor Communication
- Send Emails to Vendors: ${u.can_email_vendors?"Yes":"No"}
- Send SMS to Vendors: ${u.can_sms_vendors?"Yes":"No"}

### Scheduling & Reminders
- Create Appointments: ${u.can_create_appointments?"Yes":"No"}
- Schedule Reminders: ${u.can_schedule_reminders?"Yes":"No"}

### Financial
- Create Invoices: ${u.can_create_invoices?"Yes":"No"}
- Move Funds: ${u.can_move_funds?"Yes (max $${(settings.max_transaction_amount / 100).toFixed(2)})":"No"}

### Customer Management
- Create Customers: ${u.can_create_customers?"Yes":"No"}
- Update Customers: ${u.can_update_customers?"Yes":"No"}

### Data Access
- Access Properties: ${u.can_access_properties?"Yes":"No"}
- Access Equipment: ${u.can_access_equipment?"Yes":"No"}
- Detailed Reports (job costing, revenue breakdown, AR aging): ${u.can_access_detailed_reports?"Yes":"No"}
`:"All capabilities available (default settings)"}

## Guidelines
1. Always search for existing customers/jobs before creating new ones
2. Confirm customer details before sending communications
3. For financial actions, always explain the amounts involved
4. When scheduling, check availability first
5. Log all communications and actions taken
6. Provide proactive insights when relevant (overdue invoices, inactive customers, etc.)

## IMPORTANT: Destructive Action Approval
Certain actions are classified as "destructive" and REQUIRE owner approval before execution:
- Sending emails, SMS, or making calls to customers, team members, or vendors
- Creating invoices or moving funds
- Creating or modifying appointments
- Updating customer records

When you attempt these actions, they will be queued for owner review instead of executing immediately.
The system will show a notification that owner approval is required.
Once a company owner approves the action, it will be executed automatically.
If rejected, the action will not be executed and you'll be notified.
This is a security measure to prevent unauthorized communications or financial actions.

${u?.custom_system_prompt?`
## Additional Instructions
${u.custom_system_prompt}`:""}
${u?.company_context?`
## Business Context
${u.company_context}`:""}
`),_=function(e){if(!e)return b.aiAgentTools;let t=e.permission_mode;if("disabled"===t)return{};let a={};for(let[n,s]of Object.entries(b.aiAgentTools)){let i=b.toolCategories[n];"disabled"!==(e.action_permissions?.[i]||t)&&("sendEmail"!==n||e.can_send_emails)&&("sendSms"!==n||e.can_send_sms)&&("initiateCall"!==n||e.can_make_calls)&&("sendTeamEmail"!==n||e.can_email_team)&&("sendTeamSms"!==n||e.can_sms_team)&&("sendVendorEmail"!==n||e.can_email_vendors)&&("sendVendorSms"!==n||e.can_sms_vendors)&&("createInvoice"!==n||e.can_create_invoices)&&("transferToBucket"!==n||e.can_move_funds)&&("createAppointment"!==n||e.can_create_appointments)&&("createCustomer"!==n||e.can_create_customers)&&("updateCustomer"!==n||e.can_update_customers)&&("scheduleReminder"!==n&&"cancelReminder"!==n&&"sendImmediateNotification"!==n||e.can_schedule_reminders)&&("getJobCostingReport"!==n&&"getRevenueBreakdown"!==n&&"getARAgingReport"!==n&&"getTeamPerformanceReport"!==n&&"getCustomerLifetimeValue"!==n||e.can_access_detailed_reports)&&("searchProperties"!==n&&"getPropertyDetails"!==n||e.can_access_properties)&&("searchEquipment"!==n&&"getMaintenanceDue"!==n||e.can_access_equipment)&&(a[n]=s)}return a}(u);_=function(e,t){let a={};for(let[n,s]of Object.entries(e)){let e=(0,b.getDestructiveToolMetadata)(n);e&&e.requiresOwnerApproval?a[n]=(0,w.tool)({description:s.description,parameters:s.parameters,execute:async a=>{let i=await (0,A.shouldInterceptTool)(n,a,{companyId:t.companyId,chatId:t.chatId,messageId:t.messageId,userId:t.userId});return i.intercept?i.error?{success:!1,requiresOwnerApproval:!0,error:i.error,message:`Failed to create approval request: ${i.error}`}:{success:!1,requiresOwnerApproval:!0,pendingActionId:i.pendingActionId,riskLevel:e.riskLevel,actionType:e.actionType,message:`⚠️ This action requires owner approval before it can be executed.

**Action:** ${e.description}
**Risk Level:** ${e.riskLevel.toUpperCase()}
**Affected:** ${e.affectedEntityType}

The action has been queued for owner review. Once a company owner approves this action, it will be executed automatically.

Pending Action ID: ${i.pendingActionId}`}:"function"==typeof s.execute?await s.execute(a):{success:!1,error:"Tool execution not available"}}}):a[n]=s}return a}(_,{companyId:c,userId:i||"anonymous",chatId:l,messageId:d}),u?.permission_mode==="ask_permission"&&(_.requestApproval=I);let h=r||u?.preferred_model||"gemini-2.0-flash-exp",g=u?.model_temperature||.7,f=(0,$.google)(h);return(0,y.streamText)({model:f,messages:n,temperature:g,system:m,tools:_,maxSteps:5,experimental_toolCallStreaming:!0,onStepFinish:async({toolCalls:e,toolResults:t})=>{if(e&&e.length>0){let a=(0,C.createServiceSupabaseClient)();for(let n of e){let e=b.toolCategories[n.toolName]||"system",s=t?.find(e=>e.toolCallId===n.toolCallId);await a.from("ai_action_log").insert({company_id:c,action_type:e,action_name:n.toolName,action_description:JSON.stringify(n.args),permission_mode:u?.permission_mode||"ask_permission",permission_requested:u?.permission_mode==="ask_permission",permission_granted:u?.permission_mode==="autonomous",status:s?.result?.success?"executed":"failed",input_data:n.args,output_data:s?.result,executed_at:new Date().toISOString()})}}}}).toDataStreamResponse()}catch(e){return console.error("AI Chat Error:",e),Response.json({error:e instanceof Error?e.message:"Unknown error"},{status:500})}}e.s(["POST",()=>T,"maxDuration",0,60],728366);var N=e.i(728366);let q=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/ai/chat/route",pathname:"/api/ai/chat",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/api/ai/chat/route.ts",nextConfigOutput:"",userland:N}),{workAsyncStorage:D,workUnitAsyncStorage:O,serverHooks:k}=q;function P(){return(0,n.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:O})}async function M(e,t,n){q.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/ai/chat/route";y=y.replace(/\/index$/,"")||"/";let w=await q.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:$,params:R,nextConfig:C,parsedUrl:b,isDraftMode:A,prerenderManifest:S,routerServerContext:x,isOnDemandRevalidate:E,revalidateOnlyGenerated:I,resolvedPathname:T,clientReferenceManifest:N,serverActionsManifest:D}=w,O=(0,c.normalizeAppPath)(y),k=!!(S.dynamicRoutes[O]||S.routes[T]),P=async()=>((null==x?void 0:x.render404)?await x.render404(e,t,b,!1):t.end("This page could not be found"),null);if(k&&!A){let e=!!S.routes[T],t=S.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(C.experimental.adapterPath)return await P();throw new f.NoFallbackError}}let M=null;!k||q.isDev||A||(M="/index"===(M=T)?"/":M);let U=!0===q.isDev||!k,j=k&&!U;D&&N&&(0,o.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:N,serverActionsManifest:D,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:D})});let Y=e.method||"GET",H=(0,i.getTracer)(),F=H.getActiveScopeSpan(),L={params:R,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:C.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n)=>q.onRequestError(e,t,n,x)},sharedContext:{buildId:$}},z=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest(z,(0,d.signalFromNodeResponse)(t));try{let o=async e=>q.handle(V,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${Y} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${Y} ${y}`)}),r=!!(0,s.getRequestMeta)(e,"minimalMode"),c=async s=>{var i,c;let l=async({previousCacheEntry:a})=>{try{if(!r&&E&&I&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(s);e.fetchMetrics=L.renderOpts.fetchMetrics;let c=L.renderOpts.pendingWaitUntil;c&&n.waitUntil&&(n.waitUntil(c),c=void 0);let l=L.renderOpts.collectedTags;if(!k)return await (0,m.sendResponse)(z,B,i,L.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,n=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await q.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:E})},x),t}},d=await q.handleResponse({req:e,nextConfig:C,cacheKey:M,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:I,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:r});if(!k)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});r||t.setHeader("x-nextjs-cache",E?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,_.fromNodeOutgoingHttpHeaders)(d.value.headers);return r&&k||u.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,h.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(z,B,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};F?await c(F):await H.withPropagatedContext(e.headers,()=>H.trace(u.BaseServerSpan.handleRequest,{spanName:`${Y} ${y}`,kind:i.SpanKind.SERVER,attributes:{"http.method":Y,"http.target":e.url}},c))}catch(t){if(t instanceof f.NoFallbackError||await q.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:E})}),k)throw t;return await (0,m.sendResponse)(z,B,new Response(null,{status:500})),null}}e.s(["handler",()=>M,"patchFetch",()=>P,"routeModule",()=>q,"serverHooks",()=>k,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>O],389568)}];

//# sourceMappingURL=3c0ae_next_dist_esm_build_templates_app-route_ce2d4472.js.map