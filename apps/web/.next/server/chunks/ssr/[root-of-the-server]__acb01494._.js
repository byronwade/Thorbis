module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},997868,a=>{a.n(a.i(884849))},592581,a=>{a.n(a.i(596565))},134005,a=>{a.n(a.i(977930))},565165,a=>{a.n(a.i(728209))},147941,a=>{a.n(a.i(484103))},304434,a=>{a.n(a.i(632684))},407521,a=>{a.n(a.i(693094))},797797,a=>{a.n(a.i(977207))},290022,a=>{a.n(a.i(362735))},729157,a=>{a.n(a.i(470009))},712363,a=>{a.n(a.i(279732))},208120,a=>{a.n(a.i(52860))},863056,a=>{a.n(a.i(77721))},468729,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call WorkDataView() from the server but WorkDataView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/work-data-view.tsx <module evaluation>","WorkDataView");a.s(["WorkDataView",0,b])},750692,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call WorkDataView() from the server but WorkDataView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/work-data-view.tsx","WorkDataView");a.s(["WorkDataView",0,b])},310669,a=>{"use strict";a.i(468729);var b=a.i(750692);a.n(b)},443720,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call JobsKanban() from the server but JobsKanban is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/jobs-kanban.tsx <module evaluation>","JobsKanban");a.s(["JobsKanban",0,b])},747702,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call JobsKanban() from the server but JobsKanban is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/jobs-kanban.tsx","JobsKanban");a.s(["JobsKanban",0,b])},148501,a=>{"use strict";a.i(443720);var b=a.i(747702);a.n(b)},295722,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call JobsTable() from the server but JobsTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/jobs-table.tsx <module evaluation>","JobsTable");a.s(["JobsTable",0,b])},970632,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call JobsTable() from the server but JobsTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/jobs-table.tsx","JobsTable");a.s(["JobsTable",0,b])},850447,a=>{"use strict";a.i(295722);var b=a.i(970632);a.n(b)},451045,912664,a=>{"use strict";var b=a.i(504348);a.i(692167);var c=a.i(852596),d=a.i(148501),e=a.i(850447),f=a.i(310669),g=a.i(429969);a.i(467361);var h=a.i(445074),i=a.i(933427);let j=50,k=`
  id,
  company_id,
  property_id,
  customer_id,
  assigned_to,
  job_number,
  title,
  description,
  status,
  priority,
  job_type,
  service_type,
  scheduled_start,
  scheduled_end,
  notes,
  metadata,
  created_at,
  updated_at,
  archived_at,
  deleted_at,
  customers:customers!jobs_customer_id_customers_id_fk (
    first_name,
    last_name,
    email,
    phone
  ),
  properties:properties!jobs_property_id_properties_id_fk (
    address,
    city,
    state,
    zip_code
  ),
  financial:job_financial (
    total_amount,
    paid_amount
  ),
  timeTracking:job_time_tracking (
    actual_start,
    actual_end
  )
`;async function l(a,b=j,c="",d){let e=d??await (0,h.getActiveCompanyId)();if(!e)return{jobs:[],totalCount:0};let f=await (0,i.createServiceSupabaseClient)();if(!f)throw Error("Supabase client not configured");let g=(Math.max(a,1)-1)*b,m=f.from("jobs").select(k,{count:"exact"}).eq("company_id",e).is("deleted_at",null).order("created_at",{ascending:!1}).range(g,g+b-1),n=c.trim();if(n){let a=n.replace(/,/g,"\\,"),b=`%${a}%`;m=m.or(`job_number.ilike.${b},title.ilike.${b},description.ilike.${b},status.ilike.${b},priority.ilike.${b}`)}let{data:o,error:p,count:q}=await m;if(p)throw Error(`Failed to load jobs: ${p.message}`);return{jobs:(o??[]).map(a=>({...a,metadata:a.metadata&&"object"==typeof a.metadata&&!Array.isArray(a.metadata)?a.metadata:null})),totalCount:q??0}}(0,g.cache)(async(a,b,c,d=50)=>{let e=a??await (0,h.getActiveCompanyId)();if(!e)return[];let f=await (0,i.createServiceSupabaseClient)();if(!f)throw Error("Supabase client not configured");let{data:g,error:j}=await f.rpc("get_jobs_dashboard",{p_company_id:e,p_status:b||null,p_since:c||null,p_limit:d});return j?(console.error("Error fetching jobs via RPC:",j),[]):g||[]});let m=(0,g.cache)(async(a,b=j,c="",d=[])=>{let e=await (0,h.getActiveCompanyId)();if(!e)return{jobs:[],totalCount:0};let f=await (0,i.createServiceSupabaseClient)();if(!f)throw Error("Supabase client not configured");let g=(Math.max(a,1)-1)*b;if(0===d.length)return l(a,b,c);let m=f.from("jobs").select(`
        ${k},
        job_tags!inner(
          tag:tags!inner(
            id,
            name,
            slug,
            color,
            category
          )
        )
      `,{count:"exact"}).eq("company_id",e).is("deleted_at",null).in("job_tags.tag.slug",d).order("created_at",{ascending:!1}).range(g,g+b-1),n=c.trim();if(n){let a=n.replace(/,/g,"\\,"),b=`%${a}%`;m=m.or(`job_number.ilike.${b},title.ilike.${b},description.ilike.${b},status.ilike.${b},priority.ilike.${b}`)}let{data:o,error:p,count:q}=await m;if(p)throw Error(`Failed to load jobs with tags: ${p.message}`);return{jobs:(o??[]).map(a=>({...a,metadata:a.metadata&&"object"==typeof a.metadata&&!Array.isArray(a.metadata)?a.metadata:null})),totalCount:q??0}});async function n({searchParams:g}){let{getActiveCompanyId:h}=await a.A(37652),i=await h();if(!i)return(0,c.notFound)();let k=Number(g?.page)||1,n=g?.search??"",o=g?.tags?g.tags.split(","):[],{jobs:p,totalCount:q}=o.length>0?await m(k,j,n,o):await l(k,j,n,i),r=a=>a?new Date(a):null,s=a=>a?Array.isArray(a)?a[0]??null:a:null,t=(p??[]).map(a=>{let b=s(a.customers),c=s(a.properties),d=b?{display_name:b.display_name??null,company_name:b.company_name??null,first_name:b.first_name??null,last_name:b.last_name??null,email:b.email??null,phone:b.phone??null}:null,e=c?{display_name:c.display_name??null,address:c.address??null,city:c.city??null,state:c.state??null,zip_code:c.zip_code??null}:null,f=s(a.financial),g=s(a.timeTracking);return{id:a.id,companyId:a.company_id,propertyId:a.property_id,customerId:a.customer_id,assignedTo:a.assigned_to,jobNumber:a.job_number,title:a.title,description:a.description,status:a.status,priority:a.priority,jobType:a.job_type,scheduledStart:r(a.scheduled_start),scheduledEnd:r(a.scheduled_end),notes:a.notes,metadata:a.metadata,createdAt:new Date(a.created_at),updatedAt:new Date(a.updated_at),customers:d,properties:e,totalAmount:f?.total_amount??null,paidAmount:f?.paid_amount??null,actualStart:r(g?.actual_start??null),actualEnd:r(g?.actual_end??null)}});return(0,b.jsx)(f.WorkDataView,{kanban:(0,b.jsx)(d.JobsKanban,{jobs:t}),section:"jobs",table:(0,b.jsx)(e.JobsTable,{initialSearchQuery:n,itemsPerPage:j,jobs:t,totalCount:q||0,currentPage:k})})}(0,g.cache)(async(a,b)=>{let c=await (0,i.createServiceSupabaseClient)();if(!c)throw Error("Supabase client not configured");let{data:d,error:e}=await c.rpc("get_job_complete",{p_job_id:a,p_company_id:b});return e?(console.error("Error fetching job:",e),null):d?.[0]?.job_data||null}),a.s(["JobsData",()=>n],451045),a.i(250202);var o=a.i(709027);function p(){return(0,b.jsx)(o.DataTableListSkeleton,{})}a.s(["JobsSkeleton",()=>p],912664)},468781,a=>{"use strict";var b=a.i(504348),c=a.i(429969),d=a.i(451045),e=a.i(912664);async function f({searchParams:a}){let f=await a;return(0,b.jsx)("div",{className:"flex h-full flex-col",children:(0,b.jsx)("div",{className:"flex-1 overflow-hidden",children:(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)(e.JobsSkeleton,{}),children:(0,b.jsx)(d.JobsData,{searchParams:f})})})})}a.s(["default",()=>f])},37652,a=>{a.v(b=>Promise.all(["server/chunks/ssr/apps_web_src_lib_auth_company-context_ts_732d588b._.js"].map(b=>a.l(b))).then(()=>b(480513)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__acb01494._.js.map