module.exports=[389568,e=>{"use strict";var t=e.i(755535),a=e.i(377233),n=e.i(490003),o=e.i(492991),i=e.i(241970),s=e.i(357699),r=e.i(212454),c=e.i(48717),l=e.i(798301),d=e.i(986366),u=e.i(983537),p=e.i(147475),m=e.i(561930),h=e.i(803747),g=e.i(368557),f=e.i(42037),v=e.i(193695);e.i(432036);var _=e.i(573881),y=e.i(928624),w=e.i(679774),C=e.i(443608),A=e.i(536804),b=e.i(477902),I=e.i(893214);e.i(208069);var S=e.i(273568),$=e.i(278378);let R=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function x(e){return R.test(e)}async function T(e,t,a){if(e&&a.trim())try{if(!process.env.GROQ_API_KEY)return;let n=(0,I.createAIProvider)({provider:"groq",model:"llama-3.3-70b-versatile"}),{text:o}=await (0,y.generateText)({model:n,prompt:`Generate a very brief, descriptive title (3-6 words max) for a conversation that starts with this message. Return ONLY the title, no quotes or extra text.

Message: "${a.slice(0,500)}"

Title:`,maxOutputTokens:30,temperature:.3}),i=o.trim().replace(/^["']|["']$/g,"").replace(/^Title:\s*/i,"").slice(0,100);i&&(i=i.charAt(0).toUpperCase()+i.slice(1)),i&&"New Chat"!==i&&await e.from("chats").update({title:i,updated_at:new Date().toISOString()}).eq("id",t)}catch(e){console.error("[AI Chat API] Title generation failed:",e)}}async function E(e,t,a,n,o){if(!e||!x(t)||!x(a)||"anonymous"===a||!x(n))return{id:t,isNew:!1,canPersist:!1};let{data:i}=await e.from("chats").select("id").eq("id",t).single();if(i)return{id:i.id,isNew:!1,canPersist:!0};let{data:s,error:r}=await e.from("chats").insert({id:t,title:"New Chat",user_id:a,company_id:n,visibility:"private"}).select("id").single();return r?(console.error("[AI Chat API] Error creating chat:",r),{id:t,isNew:!1,canPersist:!1}):(o&&o.trim()&&T(e,t,o).catch(e=>{console.error("[AI Chat API] Background title generation failed:",e)}),{id:s.id,isNew:!0,canPersist:!0})}async function N(e,t,a,n,o=[]){if(!e)return null;let{data:i,error:s}=await e.from("messages_v2").insert({chat_id:t,role:a,parts:n,attachments:o}).select("id").single();return s?(console.error("[AI Chat API] Error saving message:",s),null):i.id}let k=new Map;async function q(e){let t=await (0,S.createServiceSupabaseClient)();if(!t)return console.warn("[AI Chat API] Service client not configured, skipping AI settings"),null;let{data:a}=await t.from("ai_agent_settings").select("*").eq("company_id",e).single();return a}async function P(e){let t,a=(t=k.get(e))&&Date.now()-t.timestamp<3e5?t.data:null;if(a)return a;let n=await (0,S.createServiceSupabaseClient)();if(!n)return"## Company Context\nService client not configured - company context unavailable.";let[o,i,s,r,c,l,d,u,p,m]=await Promise.all([n.from("companies").select("name, industry, phone, email, address, city, state, zip_code, website, timezone, business_hours").eq("id",e).single(),n.from("customers").select("id",{count:"exact",head:!0}).eq("company_id",e).eq("status","active"),n.from("profiles").select("id, role").eq("company_id",e),n.from("vendors").select("id",{count:"exact",head:!0}).eq("company_id",e).eq("is_active",!0),n.from("jobs").select("id, status").eq("company_id",e).in("status",["pending","in_progress","scheduled"]).limit(500),n.from("invoices").select("id, status, total_amount").eq("company_id",e).in("status",["draft","sent","pending"]).limit(500),n.from("invoices").select("id, total_amount, due_date").eq("company_id",e).eq("status","pending").lt("due_date",new Date().toISOString()).limit(100),n.from("appointments").select("id, status").eq("company_id",e).gte("scheduled_start",new Date().toISOString().split("T")[0]).lt("scheduled_start",new Date(Date.now()+864e5).toISOString().split("T")[0]),n.from("equipment").select("id, next_service_date").eq("company_id",e).lt("next_service_date",new Date(Date.now()+2592e6).toISOString()),n.from("jobs").select("id, total_amount").eq("company_id",e).eq("status","completed").gte("completed_at",new Date(Date.now()-2592e6).toISOString()).limit(500)]),h=o.data,g=i.count||0,f=s.data||[],v=r.count||0,_=c.data||[],y=l.data||[],w=d.data||[],C=u.data||[],A=p.data||[],b=m.data||[],I=f.reduce((e,t)=>{let a=t.role||"staff";return e[a]=(e[a]||0)+1,e},{}),$=_.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{}),R=y.reduce((e,t)=>e+(t.total_amount||0),0),x=w.reduce((e,t)=>e+(t.total_amount||0),0),T=b.reduce((e,t)=>e+(t.total_amount||0),0),E=e=>`$${(e/100).toLocaleString("en-US",{minimumFractionDigits:2})}`,N=`
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
- Active Vendors: ${v}
- Active Jobs: ${_.length} (${Object.entries($).map(([e,t])=>`${t} ${e}`).join(", ")||"none"})
- Today's Appointments: ${C.length}
- Equipment Needing Service (next 30 days): ${A.length}

## Financial Overview
- Pending Invoices: ${y.length} (${E(R)})
- Overdue Invoices: ${w.length} (${E(x)})${w.length>0?" ⚠️ ATTENTION NEEDED":""}
- Last 30 Days Revenue: ${E(T)}

## Important Alerts
${w.length>0?`- ${w.length} overdue invoice(s) totaling ${E(x)} need attention`:""}
${A.length>0?`- ${A.length} piece(s) of equipment due for maintenance`:""}
${$.pending?`- ${$.pending} job(s) pending assignment`:""}
${!w.length&&!A.length&&!$.pending?"- No urgent issues at this time":""}
`;if(k.set(e,{data:N,timestamp:Date.now()}),k.size>100){let e=Date.now();for(let[t,a]of k)e-a.timestamp>3e5&&k.delete(t)}return N}let O=(0,w.tool)({description:"Request user approval before taking an action. Use this when you need permission to proceed.",inputSchema:C.z.object({action:C.z.string().describe("The action you want to take"),reason:C.z.string().describe("Why this action is beneficial"),details:C.z.string().describe("Specific details of what will happen")}),execute:async({action:e,reason:t,details:a})=>({requiresApproval:!0,action:e,reason:t,details:a,message:`I'd like to ${e}. ${t}. This will: ${a}. Do you approve?`})});async function D(t){try{var a;let n,o,i,s,{messages:r,companyId:c,userId:l,chatId:d,model:u}=await t.json();if(!(r&&Array.isArray(r)))return Response.json({error:"Messages are required"},{status:400});let p=c||process.env.DEFAULT_COMPANY_ID;if(!p)try{let{getActiveCompanyId:t}=await e.A(175702);p=await t()||p}catch(e){console.warn("[AI Chat API] Unable to read active company:",e)}if(!p)return Response.json({error:"Company ID required"},{status:400});let m=l||"anonymous",h=d||crypto.randomUUID(),g=crypto.randomUUID(),[f,v,_]=await Promise.all([q(p),P(p),(0,S.createServiceSupabaseClient)()]),C=r[r.length-1],R=C?.role==="user",x=R?"string"==typeof C.content?C.content:C.parts?.[0]?.text||"":"",T=await E(_,h,m,p,x);if(R&&_&&T.canPersist){let e=C.parts?C.parts:(a=C.content,Array.isArray(a)?a.map(e=>"string"==typeof e?{type:"text",text:e}:e):"string"==typeof a?[{type:"text",text:a}]:[{type:"text",text:String(a)}]);await N(_,h,"user",e,C.attachments||[])}let k=(i=f?.permission_mode||"ask_permission",s=[],f?.proactive_customer_outreach&&s.push("customer outreach"),f?.proactive_financial_advice&&s.push("financial advice"),f?.proactive_scheduling_suggestions&&s.push("scheduling optimization"),`You are an AI business manager assistant for a field service company. You act as a proactive manager helping owners and staff run their business efficiently.

${v}

## Your Role
- Help manage customers, jobs, invoices, and communications
- Provide business insights and recommendations
- ${s.length>0?`Proactively assist with: ${s.join(", ")}`:"Respond to user requests"}
- Be professional, helpful, and efficient

## Permission Level: ${i.toUpperCase()}
${({autonomous:"You can take actions directly without asking for permission. Execute tasks proactively to help the business.",ask_permission:"Always ask for confirmation before taking actions that modify data, send communications, or involve money. Explain what you plan to do and wait for approval.",manual_only:"Only respond to direct questions. Do not take any actions unless explicitly instructed by the user.",disabled:"You can only provide information and answer questions. You cannot execute any tools or take actions."})[i]}

## Available Capabilities
${f?`
### Customer Communication
- Send Emails to Customers: ${f.can_send_emails?"Yes":"No"}
- Send SMS to Customers: ${f.can_send_sms?"Yes":"No"}
- Make Calls: ${f.can_make_calls?"Yes":"No"}

### Team Communication
- Send Emails to Team: ${f.can_email_team?"Yes":"No"}
- Send SMS to Team: ${f.can_sms_team?"Yes":"No"}

### Vendor Communication
- Send Emails to Vendors: ${f.can_email_vendors?"Yes":"No"}
- Send SMS to Vendors: ${f.can_sms_vendors?"Yes":"No"}

### Scheduling & Reminders
- Create Appointments: ${f.can_create_appointments?"Yes":"No"}
- Schedule Reminders: ${f.can_schedule_reminders?"Yes":"No"}

### Financial
- Create Invoices: ${f.can_create_invoices?"Yes":"No"}
- Move Funds: ${f.can_move_funds?"Yes (max $${(settings.max_transaction_amount / 100).toFixed(2)})":"No"}

### Customer Management
- Create Customers: ${f.can_create_customers?"Yes":"No"}
- Update Customers: ${f.can_update_customers?"Yes":"No"}

### Data Access
- Access Properties: ${f.can_access_properties?"Yes":"No"}
- Access Equipment: ${f.can_access_equipment?"Yes":"No"}
- Detailed Reports (job costing, revenue breakdown, AR aging): ${f.can_access_detailed_reports?"Yes":"No"}
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

${f?.custom_system_prompt?`
## Additional Instructions
${f.custom_system_prompt}`:""}
${f?.company_context?`
## Business Context
${f.company_context}`:""}
`),D=function(e){if(!e)return b.aiAgentTools;let t=e.permission_mode;if("disabled"===t)return{};let a={};for(let[n,o]of Object.entries(b.aiAgentTools)){let i=b.toolCategories[n],s=e.action_permissions?.[i]||t;"listDatabaseTables"!==n&&"disabled"!==s&&("sendEmail"!==n||e.can_send_emails)&&("sendSms"!==n||e.can_send_sms)&&("initiateCall"!==n||e.can_make_calls)&&("sendTeamEmail"!==n||e.can_email_team)&&("sendTeamSms"!==n||e.can_sms_team)&&("sendVendorEmail"!==n||e.can_email_vendors)&&("sendVendorSms"!==n||e.can_sms_vendors)&&("createInvoice"!==n||e.can_create_invoices)&&("transferToBucket"!==n||e.can_move_funds)&&("createAppointment"!==n||e.can_create_appointments)&&("createCustomer"!==n||e.can_create_customers)&&("updateCustomer"!==n||e.can_update_customers)&&("scheduleReminder"!==n&&"cancelReminder"!==n&&"sendImmediateNotification"!==n||e.can_schedule_reminders)&&("getJobCostingReport"!==n&&"getRevenueBreakdown"!==n&&"getARAgingReport"!==n&&"getTeamPerformanceReport"!==n&&"getCustomerLifetimeValue"!==n||e.can_access_detailed_reports)&&("searchProperties"!==n&&"getPropertyDetails"!==n||e.can_access_properties)&&("searchEquipment"!==n&&"getMaintenanceDue"!==n||e.can_access_equipment)&&(a[n]=o)}return a}(f);D=function(e,t){let a={};for(let[n,o]of Object.entries(e)){let e=(0,b.getDestructiveToolMetadata)(n);if(e&&e.requiresOwnerApproval){let i="inputSchema"in o?o.inputSchema:o.parameters;a[n]=(0,w.tool)({description:o.description,inputSchema:i,execute:async a=>{let i=await (0,A.shouldInterceptTool)(n,a,{companyId:t.companyId,chatId:t.chatId,messageId:t.messageId,userId:t.userId});return i.intercept?i.error?{success:!1,requiresOwnerApproval:!0,error:i.error,message:`Failed to create approval request: ${i.error}`}:{success:!1,requiresOwnerApproval:!0,pendingActionId:i.pendingActionId,riskLevel:e.riskLevel,actionType:e.actionType,message:`⚠️ This action requires owner approval before it can be executed.

**Action:** ${e.description}
**Risk Level:** ${e.riskLevel.toUpperCase()}
**Affected:** ${e.affectedEntityType}

The action has been queued for owner review. Once a company owner approves this action, it will be executed automatically.

Pending Action ID: ${i.pendingActionId}`}:"function"==typeof o.execute?await o.execute(a):{success:!1,error:"Tool execution not available"}}})}else a[n]=o}return a}(D,{companyId:p,userId:m,chatId:h,messageId:g}),f?.permission_mode==="ask_permission"&&(D.requestApproval=O);let M=f?.model_temperature||.7,U=u||f?.preferred_model||"llama-3.3-70b-versatile",j="groq",Y=(0,I.createAIProvider)({provider:j,model:U});n=(n=r[0]?.parts!==void 0?(n=(0,y.convertToModelMessages)(r)).map(e=>("assistant"===e.role&&delete e.toolInvocations,e)):r.map(e=>({role:e.role,content:e.content}))).filter(e=>"tool"!==e.role&&"function"!==e.role);let F={model:Y,messages:n,temperature:M,system:k,maxOutputTokens:512};F.tools=D,F.stopWhen=(0,y.stepCountIs)(5),F.maxToolRoundtrips=2;let H=Date.now(),L=async e=>(e&&(console.warn("[AI Chat API] Falling back to model:",e),F.model=(0,I.createAIProvider)({provider:j,model:e})),(0,y.streamText)({...F,onError:t=>{console.error("[AI Chat API] Stream error:",{error:t.error,message:t.error?.message,stack:t.error?.stack,name:t.error?.name,modelMessages:n}),(0,$.trackExternalApiCall)({apiName:"groq",endpoint:`chat.${e||U}`,companyId:p,success:!1,responseTimeMs:Date.now()-H,estimatedCostCents:0,errorMessage:t.error instanceof Error?t.error.message:String(t.error)}).catch(()=>{})},onChunk:e=>{e.chunk.type},onToolCall:e=>{},onToolResult:e=>{},onFinish:async({text:t,toolCalls:a,toolResults:n,usage:o})=>{let i=Date.now()-H;if(o?.promptTokens,o?.completionTokens,(0,$.trackExternalApiCall)({apiName:"groq",endpoint:`chat.${e||U}`,companyId:p,success:!0,responseTimeMs:i,estimatedCostCents:0}).catch(()=>{}),t&&_&&T.canPersist){let e=[];if(t&&e.push({type:"text",text:t}),a&&a.length>0)for(let t of a){let a="toolName"in t?t.toolName:t.name||"unknown",o="input"in t?t.input:"args"in t?t.args:null;e.push({type:"tool-invocation",toolName:a,toolCallId:t.toolCallId,args:o});let i=n?.find(e=>e.toolCallId===t.toolCallId);if(i){let a="output"in i?i.output:i?.result;e.push({type:"tool-result",toolCallId:t.toolCallId,result:a})}}await N(_,h,"assistant",e,[])}},onStepFinish:async({toolCalls:e,toolResults:t})=>{if(e&&e.length>0){let a=await (0,S.createServiceSupabaseClient)();if(!a)return void console.warn("[AI Chat API] Service client not configured, skipping action log");for(let n of e){let e="toolName"in n?n.toolName:n.name||"unknown",o=b.toolCategories[e]||"system",i="input"in n?n.input:"args"in n?n.args:null,s=t?.find(e=>e.toolCallId===n.toolCallId),r=s&&"output"in s?s.output:s?.result,c=!!r&&"object"==typeof r&&"success"in r&&r.success;await a.from("ai_action_log").insert({company_id:p,action_type:o,action_name:e,action_description:JSON.stringify(i),permission_mode:f?.permission_mode||"ask_permission",permission_requested:f?.permission_mode==="ask_permission",permission_granted:f?.permission_mode==="autonomous",status:c?"executed":"failed",input_data:i,output_data:r,executed_at:new Date().toISOString()})}}}}));try{o=await L()}catch(t){let e=t?.message||"";if((e.includes("rate limit")||e.includes("Rate limit"))&&"llama-3.1-8b-instant"!==U)o=await L("llama-3.1-8b-instant");else throw t}return o.toUIMessageStreamResponse()}catch(a){console.error("[AI Chat API] Error:",a);let e=a instanceof Error?a.message:"Unknown error",t=a instanceof Error?a.name:"UnknownError";return Response.json({error:e,errorType:t,timestamp:new Date().toISOString()},{status:500})}}e.s(["POST",()=>D,"maxDuration",0,60],728366);var M=e.i(728366);let U=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/ai/chat/route",pathname:"/api/ai/chat",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/api/ai/chat/route.ts",nextConfigOutput:"",userland:M}),{workAsyncStorage:j,workUnitAsyncStorage:Y,serverHooks:F}=U;function H(){return(0,n.patchFetch)({workAsyncStorage:j,workUnitAsyncStorage:Y})}async function L(e,t,n){U.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/ai/chat/route";y=y.replace(/\/index$/,"")||"/";let w=await U.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:C,params:A,nextConfig:b,parsedUrl:I,isDraftMode:S,prerenderManifest:$,routerServerContext:R,isOnDemandRevalidate:x,revalidateOnlyGenerated:T,resolvedPathname:E,clientReferenceManifest:N,serverActionsManifest:k}=w,q=(0,c.normalizeAppPath)(y),P=!!($.dynamicRoutes[q]||$.routes[E]),O=async()=>((null==R?void 0:R.render404)?await R.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!S){let e=!!$.routes[E],t=$.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await O();throw new v.NoFallbackError}}let D=null;!P||U.isDev||S||(D="/index"===(D=E)?"/":D);let M=!0===U.isDev||!P,j=P&&!M;k&&N&&(0,s.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:N,serverActionsManifest:k,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:k})});let Y=e.method||"GET",F=(0,i.getTracer)(),H=F.getActiveScopeSpan(),L={params:A,prerenderManifest:$,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n)=>U.onRequestError(e,t,n,R)},sharedContext:{buildId:C}},z=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),K=d.NextRequestAdapter.fromNodeNextRequest(z,(0,d.signalFromNodeResponse)(t));try{let s=async e=>U.handle(K,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${Y} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${Y} ${y}`)}),r=!!(0,o.getRequestMeta)(e,"minimalMode"),c=async o=>{var i,c;let l=async({previousCacheEntry:a})=>{try{if(!r&&x&&T&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(o);e.fetchMetrics=L.renderOpts.fetchMetrics;let c=L.renderOpts.pendingWaitUntil;c&&n.waitUntil&&(n.waitUntil(c),c=void 0);let l=L.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(z,B,i,L.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,n=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:_.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await U.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:x})},R),t}},d=await U.handleResponse({req:e,nextConfig:b,cacheKey:D,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:r});if(!P)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==_.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});r||t.setHeader("x-nextjs-cache",x?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return r&&P||u.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,g.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(z,B,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};H?await c(H):await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${Y} ${y}`,kind:i.SpanKind.SERVER,attributes:{"http.method":Y,"http.target":e.url}},c))}catch(t){if(t instanceof v.NoFallbackError||await U.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:x})}),P)throw t;return await (0,m.sendResponse)(z,B,new Response(null,{status:500})),null}}e.s(["handler",()=>L,"patchFetch",()=>H,"routeModule",()=>U,"serverHooks",()=>F,"workAsyncStorage",()=>j,"workUnitAsyncStorage",()=>Y],389568)}];

//# sourceMappingURL=3c0ae_next_dist_esm_build_templates_app-route_ce2d4472.js.map