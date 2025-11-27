module.exports=[651484,e=>{"use strict";var t=e.i(755535),a=e.i(377233),r=e.i(490003),n=e.i(492991),s=e.i(241970),i=e.i(357699),o=e.i(212454),l=e.i(48717),u=e.i(798301),c=e.i(986366),d=e.i(983537),p=e.i(147475),m=e.i(561930),f=e.i(803747),g=e.i(368557),h=e.i(42037),v=e.i(193695);e.i(432036);var y=e.i(573881),R=e.i(297676),b=e.i(289353),w=e.i(928624),C=e.i(443608);let E=C.z.object({platform:C.z.enum(["servicetitan","housecall","jobber","csv","generic"]),confidence:C.z.number().min(0).max(1),entityType:C.z.enum(["customers","jobs","invoices","estimates","equipment","properties","team","communications","payments","contracts"]),reasoning:C.z.string(),suggestedMappings:C.z.array(C.z.object({sourceField:C.z.string(),targetField:C.z.string(),transformation:C.z.enum(["direct","split","join","convert","lookup","custom"]),confidence:C.z.number(),required:C.z.boolean(),transformationParams:C.z.record(C.z.unknown()).optional()})),qualityIssues:C.z.array(C.z.object({type:C.z.enum(["missing_required","invalid_format","duplicate","outlier","inconsistent"]),field:C.z.string(),count:C.z.number(),severity:C.z.enum(["low","medium","high","critical"]),suggestion:C.z.string()}))});async function N(e){let{headers:t,sampleData:a,fileName:r,fileSize:n,rowCount:s}=e;try{var i,o,l,u,c;let e,d=(i=t,o=a,l=r,u=n,c=s,e=JSON.stringify(o.slice(0,10),null,2),`You are an expert at analyzing field service management data exports. Analyze this CSV/data file and determine:

1. **Source Platform** - Which platform exported this data?
   - ServiceTitan: Look for fields like "jobNumber", "tenantId", "modifiedOn", nested address objects
   - Housecall Pro: Look for tab-separated format, "Customer Name", "Tags" (comma-separated)
   - Jobber: Look for "Client Name", "Property Notes", "Province" (Canadian)
   - Generic/CSV: Data doesn't match known platforms

2. **Entity Type** - What type of records does this file contain?
   - customers: Name, email, phone, address fields
   - jobs: Job number, status, technician, completion date
   - invoices: Invoice number, total, balance, due date
   - equipment: Equipment type, serial number, location
   - etc.

3. **Data Quality** - Identify issues:
   - Missing required fields (email, phone for customers)
   - Invalid formats (malformed emails, phone numbers)
   - Potential duplicates (similar names/emails)
   - Outliers (unusual values)
   - Inconsistencies (state/ZIP mismatches)

4. **Field Mappings** - Suggest mappings to Stratos schema:
   - Stratos Customer Schema:
     * first_name, last_name, display_name (REQUIRED)
     * email (REQUIRED)
     * phone (REQUIRED)
     * address, city, state, zip
     * type: 'residential' | 'commercial' | 'industrial'
     * tags: string[]
     * notes: string

   - Common transformations:
     * "Customer Name" → split to first_name + last_name
     * "Phone" → normalize to E.164 format
     * "Tags" (comma-separated string) → array of strings
     * "Address 1", "Address 2" → join to address field

## File Metadata
${l?`File Name: ${l}`:""}
${u?`File Size: ${u} bytes`:""}
${c?`Row Count: ${c}`:""}

## Headers
${i.join(", ")}

## Sample Data (first 10 records)
${e}

## Instructions
Provide high-confidence analysis. If uncertain about platform, mark as 'generic'.
For field mappings, suggest transformations where needed (e.g., splitting full names).
Identify ALL data quality issues with severity and actionable suggestions.

Focus on:
1. Platform identification (95%+ confidence required for specific platform)
2. Practical field mappings that preserve data integrity
3. Critical quality issues that could cause import failures
4. Suggestions for fixing or handling problematic data

Your analysis will be used to:
- Auto-configure import settings
- Pre-validate data before import
- Suggest fixes to users
- Ensure high import success rates`),{object:p}=await (0,w.generateObject)({model:(0,b.anthropic)("claude-3-5-sonnet-20241022"),schema:E,prompt:d,temperature:.1});return{platform:p.platform,confidence:p.confidence,entityType:p.entityType,reasoning:p.reasoning,suggestedMappings:p.suggestedMappings.map(e=>({sourceField:e.sourceField,targetField:e.targetField,transformation:e.transformation,transformationParams:e.transformationParams,confidence:e.confidence,required:e.required,validationRules:[],defaultValue:void 0})),qualityIssues:p.qualityIssues.map(e=>({type:e.type,field:e.field,count:e.count,severity:e.severity,suggestion:e.suggestion}))}}catch(t){return console.error("AI format detection failed:",t),function(e){let{headers:t,sampleData:a}=e,r="generic",n="customers",s=.5;return t.some(e=>["jobNumber","tenantId","modifiedOn"].includes(e))?(r="servicetitan",s=.8):t.some(e=>["Customer Name","Created Date"].includes(e))?(r="housecall",s=.7):t.some(e=>["Client Name","Province"].includes(e))&&(r="jobber",s=.7),t.some(e=>["jobNumber","job_number","status"].includes(e))?n="jobs":t.some(e=>["invoice","total","balance"].includes(e))&&(n="invoices"),{platform:r,confidence:s,entityType:n,reasoning:"Fallback heuristic detection (AI unavailable)",suggestedMappings:t.map(e=>({sourceField:e,targetField:e.toLowerCase().replace(/\s+/g,"_"),transformation:"direct",confidence:.5,required:!1})),qualityIssues:[]}}(e)}}var A=e.i(333389);async function x(e){try{let t,a,r,n=await e.formData(),s=n.get("file"),i=n.get("sampleData");if(!s&&!i)return R.NextResponse.json({error:"Either file or sampleData must be provided"},{status:400});let o=[],l=[];if(s){t=s.name,a=s.size;let e=await s.text(),n=new A.GenericCSVConnector({platform:"csv",credentials:{platform:"csv"},companyId:"temp",userId:"temp"},{fileContent:e,hasHeaders:!0});o=(await n.getSchema("customers")).fields.map(e=>e.name),l=await n.preview(10),r=await n.estimateRecordCount("customers")}else if(i)try{let e=JSON.parse(i);if(!Array.isArray(e)||!(e.length>0))return R.NextResponse.json({error:"sampleData must be a non-empty array of objects"},{status:400});l=e,o=Object.keys(e[0])}catch(e){return R.NextResponse.json({error:"Invalid JSON in sampleData"},{status:400})}let u=await N({headers:o,sampleData:l,fileName:t,fileSize:a,rowCount:r});return R.NextResponse.json({success:!0,data:u})}catch(e){return console.error("Format detection error:",e),R.NextResponse.json({success:!1,error:{message:e instanceof Error?e.message:"Format detection failed",code:"FORMAT_DETECTION_ERROR"}},{status:500})}}async function P(){return new R.NextResponse(null,{status:204,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}})}e.s(["OPTIONS",()=>P,"POST",()=>x],523979);var S=e.i(523979);let I=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/import/detect-format/route",pathname:"/api/import/detect-format",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/api/import/detect-format/route.ts",nextConfigOutput:"",userland:S}),{workAsyncStorage:O,workUnitAsyncStorage:T,serverHooks:j}=I;function _(){return(0,r.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:T})}async function q(e,t,r){I.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/import/detect-format/route";R=R.replace(/\/index$/,"")||"/";let b=await I.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:w,params:C,nextConfig:E,parsedUrl:N,isDraftMode:A,prerenderManifest:x,routerServerContext:P,isOnDemandRevalidate:S,revalidateOnlyGenerated:O,resolvedPathname:T,clientReferenceManifest:j,serverActionsManifest:_}=b,q=(0,l.normalizeAppPath)(R),z=!!(x.dynamicRoutes[q]||x.routes[T]),D=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,N,!1):t.end("This page could not be found"),null);if(z&&!A){let e=!!x.routes[T],t=x.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await D();throw new v.NoFallbackError}}let F=null;!z||I.isDev||A||(F="/index"===(F=T)?"/":F);let M=!0===I.isDev||!z,k=z&&!M;_&&j&&(0,i.setReferenceManifestsSingleton)({page:R,clientReferenceManifest:j,serverActionsManifest:_,serverModuleMap:(0,o.createServerModuleMap)({serverActionsManifest:_})});let H=e.method||"GET",U=(0,s.getTracer)(),$=U.getActiveScopeSpan(),L={params:C,prerenderManifest:x,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>I.onRequestError(e,t,r,P)},sharedContext:{buildId:w}},K=new u.NodeNextRequest(e),V=new u.NodeNextResponse(t),B=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i=async e=>I.handle(B,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${R}`)}),o=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let u=async({previousCacheEntry:a})=>{try{if(!o&&S&&O&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=L.renderOpts.fetchMetrics;let l=L.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let u=L.renderOpts.collectedTags;if(!z)return await (0,m.sendResponse)(K,V,s,L.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(s.headers);u&&(t[h.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,r=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:S})},P),t}},c=await I.handleResponse({req:e,nextConfig:E,cacheKey:F,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:x,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:O,responseGenerator:u,waitUntil:r.waitUntil,isMinimalMode:o});if(!z)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",S?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,f.fromNodeOutgoingHttpHeaders)(c.value.headers);return o&&z||d.delete(h.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,g.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(K,V,new Response(c.value.body,{headers:d,status:c.value.status||200})),null};$?await l($):await U.withPropagatedContext(e.headers,()=>U.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${R}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof v.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:S})}),z)throw t;return await (0,m.sendResponse)(K,V,new Response(null,{status:500})),null}}e.s(["handler",()=>q,"patchFetch",()=>_,"routeModule",()=>I,"serverHooks",()=>j,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>T],651484)}];

//# sourceMappingURL=3c0ae_next_dist_esm_build_templates_app-route_6462b76d.js.map