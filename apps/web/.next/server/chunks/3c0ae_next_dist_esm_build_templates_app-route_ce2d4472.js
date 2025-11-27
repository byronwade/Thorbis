module.exports=[389568,e=>{"use strict";var t=e.i(755535),a=e.i(377233),n=e.i(490003),o=e.i(492991),i=e.i(241970),s=e.i(357699),r=e.i(212454),c=e.i(48717),l=e.i(798301),u=e.i(986366),d=e.i(983537),p=e.i(147475),m=e.i(561930),h=e.i(803747),g=e.i(368557),f=e.i(42037),_=e.i(193695);e.i(432036);var v=e.i(573881),y=e.i(928624),w=e.i(679774),C=e.i(443608),A=e.i(536804),b=e.i(477902),I=e.i(893214);e.i(208069);var S=e.i(273568),$=e.i(278378);let x=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function R(e){return x.test(e)}async function T(e,t,a){if(e&&a.trim())try{if(!process.env.GROQ_API_KEY)return;let n=(0,I.createAIProvider)({provider:"groq",model:"llama-3.3-70b-versatile"}),{text:o}=await (0,y.generateText)({model:n,prompt:`Generate a very brief, descriptive title (3-6 words max) for a conversation that starts with this message. Return ONLY the title, no quotes or extra text.

Message: "${a.slice(0,500)}"

Title:`,maxOutputTokens:30,temperature:.3}),i=o.trim().replace(/^["']|["']$/g,"").replace(/^Title:\s*/i,"").slice(0,100);i&&(i=i.charAt(0).toUpperCase()+i.slice(1)),i&&"New Chat"!==i&&await e.from("chats").update({title:i,updated_at:new Date().toISOString()}).eq("id",t)}catch(e){console.error("[AI Chat API] Title generation failed:",e)}}async function E(e,t,a,n,o){if(!e||!R(t)||!R(a)||"anonymous"===a||!R(n))return{id:t,isNew:!1,canPersist:!1};let{data:i}=await e.from("chats").select("id").eq("id",t).single();if(i)return{id:i.id,isNew:!1,canPersist:!0};let{data:s,error:r}=await e.from("chats").insert({id:t,title:"New Chat",user_id:a,company_id:n,visibility:"private"}).select("id").single();return r?(console.error("[AI Chat API] Error creating chat:",r),{id:t,isNew:!1,canPersist:!1}):(o&&o.trim()&&T(e,t,o).catch(e=>{console.error("[AI Chat API] Background title generation failed:",e)}),{id:s.id,isNew:!0,canPersist:!0})}async function N(e,t,a,n,o=[]){if(!e)return null;let{data:i,error:s}=await e.from("messages_v2").insert({chat_id:t,role:a,parts:n,attachments:o}).select("id").single();return s?(console.error("[AI Chat API] Error saving message:",s),null):i.id}let q=new Map;async function k(e){let t=await (0,S.createServiceSupabaseClient)();if(!t)return console.warn("[AI Chat API] Service client not configured, skipping AI settings"),null;let{data:a}=await t.from("ai_agent_settings").select("*").eq("company_id",e).single();return a}async function P(e){let t,a=(t=q.get(e))&&Date.now()-t.timestamp<3e5?t.data:null;if(a)return a;let n=await (0,S.createServiceSupabaseClient)();if(!n)return"## Company Context\nService client not configured - company context unavailable.";let[o,i,s,r,c,l,u,d,p,m]=await Promise.all([n.from("companies").select("name, industry, phone, email, address, city, state, zip_code, website, timezone, business_hours").eq("id",e).single(),n.from("customers").select("id",{count:"exact",head:!0}).eq("company_id",e).eq("status","active"),n.from("profiles").select("id, role").eq("company_id",e),n.from("vendors").select("id",{count:"exact",head:!0}).eq("company_id",e).eq("is_active",!0),n.from("jobs").select("id, status").eq("company_id",e).in("status",["pending","in_progress","scheduled"]).limit(500),n.from("invoices").select("id, status, total_amount").eq("company_id",e).in("status",["draft","sent","pending"]).limit(500),n.from("invoices").select("id, total_amount, due_date").eq("company_id",e).eq("status","pending").lt("due_date",new Date().toISOString()).limit(100),n.from("appointments").select("id, status").eq("company_id",e).gte("scheduled_start",new Date().toISOString().split("T")[0]).lt("scheduled_start",new Date(Date.now()+864e5).toISOString().split("T")[0]),n.from("equipment").select("id, next_service_date").eq("company_id",e).lt("next_service_date",new Date(Date.now()+2592e6).toISOString()),n.from("jobs").select("id, total_amount").eq("company_id",e).eq("status","completed").gte("completed_at",new Date(Date.now()-2592e6).toISOString()).limit(500)]),h=o.data,g=i.count||0,f=s.data||[],_=r.count||0,v=c.data||[],y=l.data||[],w=u.data||[],C=d.data||[],A=p.data||[],b=m.data||[],I=f.reduce((e,t)=>{let a=t.role||"staff";return e[a]=(e[a]||0)+1,e},{}),$=v.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{}),x=y.reduce((e,t)=>e+(t.total_amount||0),0),R=w.reduce((e,t)=>e+(t.total_amount||0),0),T=b.reduce((e,t)=>e+(t.total_amount||0),0),E=e=>`$${(e/100).toLocaleString("en-US",{minimumFractionDigits:2})}`,N=`
## Company Information
- Name: ${h?.name||"Unknown"}
- Industry: ${h?.industry||"Service Business"}
- Phone: ${h?.phone||"Not configured"}
- Email: ${h?.email||"Not configured"}
- Location: ${h?.city?`${h.city}, ${h.state} ${h.zip_code}`:"Not configured"}
- Timezone: ${h?.timezone||"America/New_York"}

## Team Overview
- Total Team Members: ${f.length}
${Object.entries(I).map(([e,t])=>`- ${e.charAt(0).toUpperCase()+e.slice(1)}s: ${t}`).join("\n")}

## Business Metrics (Current)
- Active Customers: ${g}
- Active Vendors: ${_}
- Active Jobs: ${v.length} (${Object.entries($).map(([e,t])=>`${t} ${e}`).join(", ")||"none"})
- Today's Appointments: ${C.length}
- Equipment Needing Service (next 30 days): ${A.length}

## Financial Overview
- Pending Invoices: ${y.length} (${E(x)})
- Overdue Invoices: ${w.length} (${E(R)})${w.length>0?" ⚠️ ATTENTION NEEDED":""}
- Last 30 Days Revenue: ${E(T)}

## Important Alerts
${w.length>0?`- ${w.length} overdue invoice(s) totaling ${E(R)} need attention`:""}
${A.length>0?`- ${A.length} piece(s) of equipment due for maintenance`:""}
${$.pending?`- ${$.pending} job(s) pending assignment`:""}
${!w.length&&!A.length&&!$.pending?"- No urgent issues at this time":""}
`;if(q.set(e,{data:N,timestamp:Date.now()}),q.size>100){let e=Date.now();for(let[t,a]of q)e-a.timestamp>3e5&&q.delete(t)}return N}let O=(0,w.tool)({description:"Request user approval before taking an action. Use this when you need permission to proceed.",inputSchema:C.z.object({action:C.z.string().describe("The action you want to take"),reason:C.z.string().describe("Why this action is beneficial"),details:C.z.string().describe("Specific details of what will happen")}),execute:async({action:e,reason:t,details:a})=>({requiresApproval:!0,action:e,reason:t,details:a,message:`I'd like to ${e}. ${t}. This will: ${a}. Do you approve?`})});async function D(e){try{var t;let a,n,o,{messages:i,companyId:s,userId:r,chatId:c,model:l}=await e.json();if(!(i&&Array.isArray(i)))return Response.json({error:"Messages are required"},{status:400});let u=s||process.env.DEFAULT_COMPANY_ID;if(!u)return Response.json({error:"Company ID required"},{status:400});let d=r||"anonymous",p=c||crypto.randomUUID(),m=crypto.randomUUID(),[h,g,f]=await Promise.all([k(u),P(u),(0,S.createServiceSupabaseClient)()]),_=i[i.length-1],v=_?.role==="user",C=v?"string"==typeof _.content?_.content:_.parts?.[0]?.text||"":"",x=await E(f,p,d,u,C);if(v&&f&&x.canPersist){let e=_.parts?_.parts:(t=_.content,Array.isArray(t)?t.map(e=>"string"==typeof e?{type:"text",text:e}:e):"string"==typeof t?[{type:"text",text:t}]:[{type:"text",text:String(t)}]);await N(f,p,"user",e,_.attachments||[])}let R=(n=h?.permission_mode||"ask_permission",o=[],h?.proactive_customer_outreach&&o.push("customer outreach"),h?.proactive_financial_advice&&o.push("financial advice"),h?.proactive_scheduling_suggestions&&o.push("scheduling optimization"),`You are an AI business manager assistant for a field service company. You act as a proactive manager helping owners and staff run their business efficiently.

${g}

## Your Role
- Help manage customers, jobs, invoices, and communications
- Provide business insights and recommendations
- ${o.length>0?`Proactively assist with: ${o.join(", ")}`:"Respond to user requests"}
- Be professional, helpful, and efficient

## Permission Level: ${n.toUpperCase()}
${({autonomous:"You can take actions directly without asking for permission. Execute tasks proactively to help the business.",ask_permission:"Always ask for confirmation before taking actions that modify data, send communications, or involve money. Explain what you plan to do and wait for approval.",manual_only:"Only respond to direct questions. Do not take any actions unless explicitly instructed by the user.",disabled:"You can only provide information and answer questions. You cannot execute any tools or take actions."})[n]}

## Available Capabilities
${h?`
### Customer Communication
- Send Emails to Customers: ${h.can_send_emails?"Yes":"No"}
- Send SMS to Customers: ${h.can_send_sms?"Yes":"No"}
- Make Calls: ${h.can_make_calls?"Yes":"No"}

### Team Communication
- Send Emails to Team: ${h.can_email_team?"Yes":"No"}
- Send SMS to Team: ${h.can_sms_team?"Yes":"No"}

### Vendor Communication
- Send Emails to Vendors: ${h.can_email_vendors?"Yes":"No"}
- Send SMS to Vendors: ${h.can_sms_vendors?"Yes":"No"}

### Scheduling & Reminders
- Create Appointments: ${h.can_create_appointments?"Yes":"No"}
- Schedule Reminders: ${h.can_schedule_reminders?"Yes":"No"}

### Financial
- Create Invoices: ${h.can_create_invoices?"Yes":"No"}
- Move Funds: ${h.can_move_funds?"Yes (max $${(settings.max_transaction_amount / 100).toFixed(2)})":"No"}

### Customer Management
- Create Customers: ${h.can_create_customers?"Yes":"No"}
- Update Customers: ${h.can_update_customers?"Yes":"No"}

### Data Access
- Access Properties: ${h.can_access_properties?"Yes":"No"}
- Access Equipment: ${h.can_access_equipment?"Yes":"No"}
- Detailed Reports (job costing, revenue breakdown, AR aging): ${h.can_access_detailed_reports?"Yes":"No"}
`:"All capabilities available (default settings)"}

## Guidelines
1. Always search for existing customers/jobs before creating new ones
2. Confirm customer details before sending communications
3. For financial actions, always explain the amounts involved
4. When scheduling, check availability first
5. Log all communications and actions taken
6. Provide proactive insights when relevant (overdue invoices, inactive customers, etc.)
7. Do NOT list database tables or perform schema introspection unless the user explicitly asks for it
8. Keep responses concise and focused on the user request; avoid verbose summaries
9. When a question needs current or external information, use the web search tools (webSearchTool/webSearchNewsTool/webSearchSiteTool) and cite the sources you used

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

${h?.custom_system_prompt?`
## Additional Instructions
${h.custom_system_prompt}`:""}
${h?.company_context?`
## Business Context
${h.company_context}`:""}
`),T=function(e){if(!e)return b.aiAgentTools;let t=e.permission_mode;if("disabled"===t)return{};let a={};for(let[n,o]of Object.entries(b.aiAgentTools)){let i=b.toolCategories[n],s=e.action_permissions?.[i]||t;"listDatabaseTables"!==n&&"disabled"!==s&&("sendEmail"!==n||e.can_send_emails)&&("sendSms"!==n||e.can_send_sms)&&("initiateCall"!==n||e.can_make_calls)&&("sendTeamEmail"!==n||e.can_email_team)&&("sendTeamSms"!==n||e.can_sms_team)&&("sendVendorEmail"!==n||e.can_email_vendors)&&("sendVendorSms"!==n||e.can_sms_vendors)&&("createInvoice"!==n||e.can_create_invoices)&&("transferToBucket"!==n||e.can_move_funds)&&("createAppointment"!==n||e.can_create_appointments)&&("createCustomer"!==n||e.can_create_customers)&&("updateCustomer"!==n||e.can_update_customers)&&("scheduleReminder"!==n&&"cancelReminder"!==n&&"sendImmediateNotification"!==n||e.can_schedule_reminders)&&("getJobCostingReport"!==n&&"getRevenueBreakdown"!==n&&"getARAgingReport"!==n&&"getTeamPerformanceReport"!==n&&"getCustomerLifetimeValue"!==n||e.can_access_detailed_reports)&&("searchProperties"!==n&&"getPropertyDetails"!==n||e.can_access_properties)&&("searchEquipment"!==n&&"getMaintenanceDue"!==n||e.can_access_equipment)&&(a[n]=o)}return a}(h);T=function(e,t){let a={};for(let[n,o]of Object.entries(e)){let e=(0,b.getDestructiveToolMetadata)(n);if(e&&e.requiresOwnerApproval){let i="inputSchema"in o?o.inputSchema:o.parameters;a[n]=(0,w.tool)({description:o.description,inputSchema:i,execute:async a=>{let i=await (0,A.shouldInterceptTool)(n,a,{companyId:t.companyId,chatId:t.chatId,messageId:t.messageId,userId:t.userId});return i.intercept?i.error?{success:!1,requiresOwnerApproval:!0,error:i.error,message:`Failed to create approval request: ${i.error}`}:{success:!1,requiresOwnerApproval:!0,pendingActionId:i.pendingActionId,riskLevel:e.riskLevel,actionType:e.actionType,message:`⚠️ This action requires owner approval before it can be executed.

**Action:** ${e.description}
**Risk Level:** ${e.riskLevel.toUpperCase()}
**Affected:** ${e.affectedEntityType}

The action has been queued for owner review. Once a company owner approves this action, it will be executed automatically.

Pending Action ID: ${i.pendingActionId}`}:"function"==typeof o.execute?await o.execute(a):{success:!1,error:"Tool execution not available"}}})}else a[n]=o}return a}(T,{companyId:u,userId:d,chatId:p,messageId:m}),h?.permission_mode==="ask_permission"&&(T.requestApproval=O);let q=h?.model_temperature||.7,D=l||h?.preferred_model||"llama-3.3-70b-versatile",M=(0,I.createAIProvider)({provider:"groq",model:D});a=i[0]?.parts!==void 0?(0,y.convertToModelMessages)(i):i.map(e=>({role:e.role,content:e.content}));let U={model:M,messages:a,temperature:q,system:R,maxOutputTokens:512};U.tools=T,U.stopWhen=(0,y.stepCountIs)(5),U.maxToolRoundtrips=2;let j=Date.now();return(0,y.streamText)({...U,onError:e=>{console.error("[AI Chat API] Stream error:",e.error),(0,$.trackExternalApiCall)({apiName:"groq",endpoint:`chat.${D}`,companyId:u,success:!1,responseTimeMs:Date.now()-j,estimatedCostCents:0,errorMessage:e.error instanceof Error?e.error.message:String(e.error)}).catch(()=>{})},onChunk:e=>{e.chunk.type},onToolCall:e=>{},onToolResult:e=>{},onFinish:async({text:e,toolCalls:t,toolResults:a,usage:n})=>{let o=Date.now()-j;if(n?.promptTokens,n?.completionTokens,(0,$.trackExternalApiCall)({apiName:"groq",endpoint:`chat.${D}`,companyId:u,success:!0,responseTimeMs:o,estimatedCostCents:0}).catch(()=>{}),e&&f&&x.canPersist){let n=[];if(e&&n.push({type:"text",text:e}),t&&t.length>0)for(let e of t){let t="toolName"in e?e.toolName:e.name||"unknown",o="input"in e?e.input:"args"in e?e.args:null;n.push({type:"tool-invocation",toolName:t,toolCallId:e.toolCallId,args:o});let i=a?.find(t=>t.toolCallId===e.toolCallId);if(i){let t="output"in i?i.output:i?.result;n.push({type:"tool-result",toolCallId:e.toolCallId,result:t})}}await N(f,p,"assistant",n,[])}},onStepFinish:async({toolCalls:e,toolResults:t})=>{if(e&&e.length>0){let a=await (0,S.createServiceSupabaseClient)();if(!a)return void console.warn("[AI Chat API] Service client not configured, skipping action log");for(let n of e){let e="toolName"in n?n.toolName:n.name||"unknown",o=b.toolCategories[e]||"system",i="input"in n?n.input:"args"in n?n.args:null,s=t?.find(e=>e.toolCallId===n.toolCallId),r=s&&"output"in s?s.output:s?.result,c=!!r&&"object"==typeof r&&"success"in r&&r.success;await a.from("ai_action_log").insert({company_id:u,action_type:o,action_name:e,action_description:JSON.stringify(i),permission_mode:h?.permission_mode||"ask_permission",permission_requested:h?.permission_mode==="ask_permission",permission_granted:h?.permission_mode==="autonomous",status:c?"executed":"failed",input_data:i,output_data:r,executed_at:new Date().toISOString()})}}}}).toUIMessageStreamResponse()}catch(a){console.error("[AI Chat API] Error:",a);let e=a instanceof Error?a.message:"Unknown error",t=a instanceof Error?a.name:"UnknownError";return Response.json({error:e,errorType:t,timestamp:new Date().toISOString()},{status:500})}}e.s(["POST",()=>D,"maxDuration",0,60],728366);var M=e.i(728366);let U=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/ai/chat/route",pathname:"/api/ai/chat",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/api/ai/chat/route.ts",nextConfigOutput:"",userland:M}),{workAsyncStorage:j,workUnitAsyncStorage:Y,serverHooks:F}=U;function H(){return(0,n.patchFetch)({workAsyncStorage:j,workUnitAsyncStorage:Y})}async function L(e,t,n){U.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/ai/chat/route";y=y.replace(/\/index$/,"")||"/";let w=await U.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:C,params:A,nextConfig:b,parsedUrl:I,isDraftMode:S,prerenderManifest:$,routerServerContext:x,isOnDemandRevalidate:R,revalidateOnlyGenerated:T,resolvedPathname:E,clientReferenceManifest:N,serverActionsManifest:q}=w,k=(0,c.normalizeAppPath)(y),P=!!($.dynamicRoutes[k]||$.routes[E]),O=async()=>((null==x?void 0:x.render404)?await x.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!S){let e=!!$.routes[E],t=$.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await O();throw new _.NoFallbackError}}let D=null;!P||U.isDev||S||(D="/index"===(D=E)?"/":D);let M=!0===U.isDev||!P,j=P&&!M;q&&N&&(0,s.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:N,serverActionsManifest:q,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:q})});let Y=e.method||"GET",F=(0,i.getTracer)(),H=F.getActiveScopeSpan(),L={params:A,prerenderManifest:$,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n)=>U.onRequestError(e,t,n,x)},sharedContext:{buildId:C}},z=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(z,(0,u.signalFromNodeResponse)(t));try{let s=async e=>U.handle(K,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${Y} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${Y} ${y}`)}),r=!!(0,o.getRequestMeta)(e,"minimalMode"),c=async o=>{var i,c;let l=async({previousCacheEntry:a})=>{try{if(!r&&R&&T&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(o);e.fetchMetrics=L.renderOpts.fetchMetrics;let c=L.renderOpts.pendingWaitUntil;c&&n.waitUntil&&(n.waitUntil(c),c=void 0);let l=L.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(z,B,i,L.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,n=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await U.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:R})},x),t}},u=await U.handleResponse({req:e,nextConfig:b,cacheKey:D,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:R,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:r});if(!P)return null;if((null==u||null==(i=u.value)?void 0:i.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(c=u.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});r||t.setHeader("x-nextjs-cache",R?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return r&&P||d.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,g.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(z,B,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};H?await c(H):await F.withPropagatedContext(e.headers,()=>F.trace(d.BaseServerSpan.handleRequest,{spanName:`${Y} ${y}`,kind:i.SpanKind.SERVER,attributes:{"http.method":Y,"http.target":e.url}},c))}catch(t){if(t instanceof _.NoFallbackError||await U.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:R})}),P)throw t;return await (0,m.sendResponse)(z,B,new Response(null,{status:500})),null}}e.s(["handler",()=>L,"patchFetch",()=>H,"routeModule",()=>U,"serverHooks",()=>F,"workAsyncStorage",()=>j,"workUnitAsyncStorage",()=>Y],389568)}];

//# sourceMappingURL=3c0ae_next_dist_esm_build_templates_app-route_ce2d4472.js.map