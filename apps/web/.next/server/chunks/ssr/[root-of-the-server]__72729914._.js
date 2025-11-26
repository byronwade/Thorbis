module.exports=[193695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},997868,a=>{a.n(a.i(884849))},592581,a=>{a.n(a.i(596565))},134005,a=>{a.n(a.i(977930))},565165,a=>{a.n(a.i(728209))},147941,a=>{a.n(a.i(484103))},304434,a=>{a.n(a.i(632684))},407521,a=>{a.n(a.i(693094))},797797,a=>{a.n(a.i(977207))},290022,a=>{a.n(a.i(362735))},729157,a=>{a.n(a.i(470009))},712363,a=>{a.n(a.i(279732))},208120,a=>{a.n(a.i(52860))},863056,a=>{a.n(a.i(77721))},468729,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call WorkDataView() from the server but WorkDataView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/work-data-view.tsx <module evaluation>","WorkDataView");a.s(["WorkDataView",0,b])},750692,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call WorkDataView() from the server but WorkDataView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/work-data-view.tsx","WorkDataView");a.s(["WorkDataView",0,b])},310669,a=>{"use strict";a.i(468729);var b=a.i(750692);a.n(b)},842784,a=>{a.n(a.i(514070))},590058,a=>{a.n(a.i(254692))},559290,a=>{"use strict";var b=a.i(429969);a.i(467361);var c=a.i(445074),d=a.i(933427);let e=`
  id,
  company_id,
  contract_number,
  title,
  status,
  contract_type,
  signer_name,
  signer_email,
  signer_company,
  signer_title,
  archived_at,
  deleted_at,
  created_at,
  updated_at,
  valid_from,
  valid_until,
  sent_at,
  signed_at,
  viewed_at,
  invoice:invoices!contracts_invoice_id_invoices_id_fk (
    id,
    invoice_number,
    customer:customers!invoices_customer_id_customers_id_fk (
      id,
      display_name,
      first_name,
      last_name,
      company_name,
      email
    )
  ),
  estimate:estimates!contracts_estimate_id_estimates_id_fk (
    id,
    estimate_number,
    customer:customers!estimates_customer_id_customers_id_fk (
      id,
      display_name,
      first_name,
      last_name,
      company_name,
      email
    )
  ),
  job:jobs!contracts_job_id_jobs_id_fk (
    id,
    job_number,
    title,
    customer:customers!jobs_customer_id_customers_id_fk (
      id,
      display_name,
      first_name,
      last_name,
      company_name,
      email
    )
  )
`;async function f(a,b=50,g){let h=g??await (0,c.getActiveCompanyId)();if(!h)return{contracts:[],totalCount:0};let i=await (0,d.createServiceSupabaseClient)();if(!i)throw Error("Supabase client not configured");let j=(Math.max(a,1)-1)*b,{data:k,error:l,count:m}=await i.from("contracts").select(e,{count:"exact"}).eq("company_id",h).order("created_at",{ascending:!1}).range(j,j+b-1);if(l)throw Error(`Failed to fetch contracts: ${l.message}`);return{contracts:k??[],totalCount:m??0}}(0,b.cache)(async a=>{let b=a??await (0,c.getActiveCompanyId)();if(!b)return[];let e=await (0,d.createServiceSupabaseClient)();if(!e)throw Error("Supabase client not configured");let{data:f,error:g}=await e.from("contracts").select("status, archived_at, deleted_at").eq("company_id",b);if(g)throw Error(`Failed to fetch contract stats: ${g.message}`);return f??[]});let g=(0,b.cache)(async(a,b)=>{let c=await (0,d.createServiceSupabaseClient)();if(!c)throw Error("Supabase client not configured");let{data:e,error:f}=await c.rpc("get_contract_complete",{p_contract_id:a,p_company_id:b});return f?(console.error("Error fetching contract:",f),null):e?.[0]?.contract_data||null});a.s(["CONTRACTS_PAGE_SIZE",0,50,"getContractComplete",0,g,"getContractsPageData",()=>f])},997961,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call ContractsKanban() from the server but ContractsKanban is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/contracts-kanban.tsx <module evaluation>","ContractsKanban");a.s(["ContractsKanban",0,b])},441860,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call ContractsKanban() from the server but ContractsKanban is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/contracts-kanban.tsx","ContractsKanban");a.s(["ContractsKanban",0,b])},721608,a=>{"use strict";a.i(997961);var b=a.i(441860);a.n(b)},785498,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call ContractsTable() from the server but ContractsTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/contracts-table.tsx <module evaluation>","ContractsTable");a.s(["ContractsTable",0,b])},255431,a=>{"use strict";let b=(0,a.i(742210).registerClientReference)(function(){throw Error("Attempted to call ContractsTable() from the server but ContractsTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/src/components/work/contracts-table.tsx","ContractsTable");a.s(["ContractsTable",0,b])},288812,a=>{"use strict";a.i(785498);var b=a.i(255431);a.n(b)},118238,a=>{"use strict";var b=a.i(504348),c=a.i(429969);a.i(692167);var d=a.i(852596),e=a.i(721608),f=a.i(288812),g=a.i(310669);a.i(467361);var h=a.i(445074);a.i(262820);var i=a.i(883385),j=a.i(559290);let k=a=>a?new Date(a).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"",l=a=>a?Array.isArray(a)?a[0]??null:a:null;async function m({searchParams:a}){let[c,m]=await Promise.all([(0,i.getCurrentUser)(),(0,h.getActiveCompanyId)()]);if(!c||!m)return(0,d.notFound)();let n=Number(a?.page)||1,{contracts:o,totalCount:p}=await (0,j.getContractsPageData)(n,j.CONTRACTS_PAGE_SIZE,m),q=(o??[]).map(a=>{let b=l(a.invoice?.customer),c=l(a.estimate?.customer),d=l(a.job?.customer),e=a.expires_at??a.valid_until;return{id:a.id,contractNumber:a.contract_number,customer:((a,b,c)=>{if(a?.display_name)return a.display_name;let d=`${a?.first_name??""} ${a?.last_name??""}`.trim();return d||(a?.company_name?a.company_name:a?.email?a.email:b||c||"Unknown")})(b??c??d??null,a.signer_name,a.signer_email),title:a.title,date:k(a.created_at),validUntil:k(e),status:a.status||"draft",contractType:a.contract_type||"custom",signerName:a.signer_name||null,archived_at:a.archived_at??null,deleted_at:a.deleted_at??null}});return(0,b.jsx)(g.WorkDataView,{kanban:(0,b.jsx)(e.ContractsKanban,{contracts:q}),section:"contracts",table:(0,b.jsx)(f.ContractsTable,{contracts:q,currentPage:n,itemsPerPage:j.CONTRACTS_PAGE_SIZE,totalCount:p})})}a.i(250202);var n=a.i(709027);function o(){return(0,b.jsx)(n.DataTableListSkeleton,{})}async function p({searchParams:a}){let d=await a;return(0,b.jsx)("div",{className:"flex h-full flex-col",children:(0,b.jsx)("div",{className:"flex-1 overflow-hidden",children:(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)(o,{}),children:(0,b.jsx)(m,{searchParams:d})})})})}a.s(["default",()=>p],118238)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__72729914._.js.map