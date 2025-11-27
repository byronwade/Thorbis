module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},19858,a=>{a.n(a.i(23227))},87845,a=>{a.n(a.i(45043))},6187,a=>{a.n(a.i(72013))},49386,a=>{a.n(a.i(39730))},68279,a=>{a.n(a.i(14898))},36585,a=>{a.n(a.i(49655))},54508,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},9890,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(64460);a.n(d("[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js <module evaluation>"))},74723,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(64460);a.n(d("[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js"))},55845,a=>{"use strict";a.i(9890);var b=a.i(74723);a.n(b)},52973,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={default:function(){return i},useLinkStatus:function(){return h.useLinkStatus}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(54508),g=a.r(15596),h=f._(a.r(55845));function i(a){let b=a.legacyBehavior,c="string"==typeof a.children||"number"==typeof a.children||"string"==typeof a.children?.type,d=a.children?.type?.$$typeof===Symbol.for("react.client.reference");return!b||c||d||(a.children?.type?.$$typeof===Symbol.for("react.lazy")?console.error("Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag."):console.error("Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag.")),(0,g.jsx)(h.default,{...a})}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},240,a=>{"use strict";var b=a.i(38734),c=a.i(13206);async function d(a,e,f=1,g=50,h=""){let i=await (0,c.getImpersonatedCompanyId)();if(!i)return{data:[],totalCount:0};let j=(0,b.createWebClient)(),k=(Math.max(f,1)-1)*g,l=j.from(a).select(e,{count:"exact"}).eq("company_id",i).is("deleted_at",null).order("created_at",{ascending:!1});h&&(l=l.or(`title.ilike.%${h}%,description.ilike.%${h}%`));let{data:m,error:n,count:o}=await l.range(k,k+g-1);if(n)throw Error(`Failed to load ${a}: ${n.message}`);return{data:m??[],totalCount:o??0}}async function e(a=1,b=50){return d("invoices",`
      id,
      invoice_number,
      status,
      total_amount,
      paid_amount,
      balance_amount,
      created_at,
      due_date,
      archived_at,
      customers!invoices_customer_id_customers_id_fk (
        display_name,
        first_name,
        last_name
      )
    `,a,b)}async function f(a=1,b=50){return d("payments",`
      id,
      payment_number,
      amount,
      payment_method,
      status,
      created_at,
      customers!payments_customer_id_customers_id_fk (
        display_name
      ),
      invoices!payments_invoice_id_invoices_id_fk (
        invoice_number
      )
    `,a,b)}async function g(a=1,b=50){return d("estimates",`
      id,
      estimate_number,
      title,
      status,
      total_amount,
      created_at,
      valid_until,
      customers!estimates_customer_id_customers_id_fk (
        display_name
      )
    `,a,b)}async function h(a=1,b=50){return d("contracts",`
      id,
      contract_number,
      title,
      status,
      total_value,
      start_date,
      end_date,
      created_at,
      customers!contracts_customer_id_customers_id_fk (
        display_name
      )
    `,a,b)}async function i(a=1,b=50){return d("appointments",`
      id,
      title,
      status,
      scheduled_start,
      scheduled_end,
      created_at,
      customers!appointments_customer_id_customers_id_fk (
        display_name
      )
    `,a,b)}async function j(a=1,d=50){let e=await (0,c.getImpersonatedCompanyId)();if(!e)return{data:[],totalCount:0};let f=(0,b.createWebClient)(),g=(Math.max(a,1)-1)*d,{data:h,error:i,count:k}=await f.from("team_members").select(`
        id,
        display_name,
        email,
        phone,
        role,
        status,
        created_at,
        users!team_members_user_id_users_id_fk (
          email,
          phone
        )
      `,{count:"exact"}).eq("company_id",e).order("created_at",{ascending:!1}).range(g,g+d-1);if(i)throw Error(`Failed to load team members: ${i.message}`);return{data:h??[],totalCount:k??0}}async function k(a=1,b=50){return d("equipment",`
      id,
      name,
      type,
      status,
      serial_number,
      purchase_date,
      created_at
    `,a,b)}async function l(a=1,b=50){return d("materials",`
      id,
      name,
      sku,
      category,
      quantity_on_hand,
      unit_cost,
      created_at
    `,a,b)}a.s(["getViewAsAppointments",()=>i,"getViewAsContracts",()=>h,"getViewAsEquipment",()=>k,"getViewAsEstimates",()=>g,"getViewAsInvoices",()=>e,"getViewAsMaterials",()=>l,"getViewAsPayments",()=>f,"getViewAsTeamMembers",()=>j])},48945,a=>{"use strict";a.i(30154),a.s([])},52057,87648,a=>{"use strict";a.i(30154),a.s([],52057),a.i(52057);var b=a.i(63914),c=a.i(69637),d=a.i(61107),e=a.i(75976),f=a.i(36326),g=a.i(26954),h=a.i(36028),i=a.i(76977),j=a.i(68553),k=a.i(36705),l=a.i(96149),m=a.i(5991),n=a.i(2193),o=a.i(93107),p=a.i(25708),q=a.i(80558),r=a.i(27632),s=a.i(23762),t=a.i(33096),u=a.i(77394),v=a.i(30104),w=a.i(88159),x=a.i(51374),y=a.i(91888),z=a.i(68073),A=a.i(47072),B=a.i(46108),C=a.i(61203),D=a.i(28811),E=a.i(50872),F=a.i(97053),G=a.i(58289),H=a.i(19187),I=a.i(63683),J=a.i(74749),K=a.i(20235),L=a.i(90965),M=a.i(68335),N=a.i(71631),O=a.i(39724),P=a.i(36977),Q=a.i(9027),R=a.i(43953),S=a.i(20224),T=a.i(76419),U=a.i(20334),V=a.i(38239),W=a.i(90199),X=a.i(38825),Y=a.i(65296),Z=a.i(9604),$=a.i(92054),_=a.i(33387),aa=a.i(38468),ab=a.i(52495);a.i(22792);var ac=a.i(99049),ad=a.i(74235),ae=a.i(65831),af=a.i(71288);a.s(["Alert",()=>c.Alert,"AlertDescription",()=>c.AlertDescription,"AlertTitle",()=>c.AlertTitle,"Badge",()=>h.Badge,"Breadcrumb",()=>i.Breadcrumb,"BreadcrumbItem",()=>i.BreadcrumbItem,"BreadcrumbLink",()=>i.BreadcrumbLink,"BreadcrumbList",()=>i.BreadcrumbList,"BreadcrumbPage",()=>i.BreadcrumbPage,"BreadcrumbSeparator",()=>i.BreadcrumbSeparator,"Button",()=>j.Button,"ButtonGroup",()=>k.ButtonGroup,"ButtonGroupText",()=>k.ButtonGroupText,"Card",()=>m.Card,"CardContent",()=>m.CardContent,"CardDescription",()=>m.CardDescription,"CardFooter",()=>m.CardFooter,"CardHeader",()=>m.CardHeader,"CardListSkeleton",()=>Q.CardListSkeleton,"CardTitle",()=>m.CardTitle,"ChartSkeleton",()=>Q.ChartSkeleton,"ComingSoonShell",()=>q.ComingSoonShell,"DashboardSkeleton",()=>Q.DashboardSkeleton,"DataTableListSkeleton",()=>Q.DataTableListSkeleton,"FormSkeleton",()=>Q.FormSkeleton,"GenericStatusBadge",()=>y.GenericStatusBadge,"Input",()=>A.Input,"KPICardSkeleton",()=>Q.KPICardSkeleton,"PageHeaderSkeleton",()=>Q.PageHeaderSkeleton,"RowActionsDropdown",()=>J.RowActionsDropdown,"Skeleton",()=>P.Skeleton,"StatsCardsSkeleton",()=>S.StatsCardsSkeleton,"TableSkeleton",()=>Q.TableSkeleton,"Textarea",()=>X.Textarea,"WorkDetailSkeleton",()=>Q.WorkDetailSkeleton,"WorkflowTimeline",()=>af.WorkflowTimeline,"buttonVariants",()=>j.buttonVariants,"cn",()=>ad.cn],97096),a.j(b,97096),a.j(d,97096),a.j(e,97096),a.j(f,97096),a.j(g,97096),a.j(l,97096),a.j(n,97096),a.j(o,97096),a.j(p,97096),a.j(r,97096),a.j(s,97096),a.j(t,97096),a.j(u,97096),a.j(v,97096),a.j(w,97096),a.j(x,97096),a.j(z,97096),a.j(B,97096),a.j(C,97096),a.j(D,97096),a.j(E,97096),a.j(F,97096),a.j(G,97096),a.j(H,97096),a.j(I,97096),a.j(K,97096),a.j(L,97096),a.j(M,97096),a.j(N,97096),a.j(O,97096),a.j(R,97096),a.j(T,97096),a.j(U,97096),a.j(V,97096),a.j(W,97096),a.j(Y,97096),a.j(Z,97096),a.j($,97096),a.j(_,97096),a.j(aa,97096),a.j(ab,97096),a.j(ac,97096),a.j(ae,97096);var ag=a.i(97096);a.s([],87648),a.j(ag,87648)},57317,a=>{"use strict";a.i(30154),a.s([])},89822,a=>{"use strict";let b=(0,a.i(64460).registerClientReference)(function(){throw Error("Attempted to call RowActionsDropdown() from the server but RowActionsDropdown is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/admin/src/components/view-as/row-actions-dropdown.tsx <module evaluation>","RowActionsDropdown");a.s(["RowActionsDropdown",0,b])},33622,a=>{"use strict";let b=(0,a.i(64460).registerClientReference)(function(){throw Error("Attempted to call RowActionsDropdown() from the server but RowActionsDropdown is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/admin/src/components/view-as/row-actions-dropdown.tsx","RowActionsDropdown");a.s(["RowActionsDropdown",0,b])},50870,a=>{"use strict";a.i(89822);var b=a.i(33622);a.n(b)},88854,a=>{"use strict";var b=a.i(15596),c=a.i(26358),d=a.i(240);a.i(48945);var e=a.i(36028);a.i(52057);var f=a.i(87648);a.i(57317);var g=a.i(36977),h=a.i(50870);async function i({page:a}){let{data:c,totalCount:g}=await (0,d.getViewAsPayments)(a);return(0,b.jsxs)("div",{className:"rounded-md border",children:[(0,b.jsxs)(f.Table,{children:[(0,b.jsx)(f.TableHeader,{children:(0,b.jsxs)(f.TableRow,{children:[(0,b.jsx)(f.TableHead,{children:"Payment #"}),(0,b.jsx)(f.TableHead,{children:"Customer"}),(0,b.jsx)(f.TableHead,{children:"Invoice #"}),(0,b.jsx)(f.TableHead,{children:"Method"}),(0,b.jsx)(f.TableHead,{children:"Status"}),(0,b.jsx)(f.TableHead,{className:"text-right",children:"Amount"}),(0,b.jsx)(f.TableHead,{children:"Date"}),(0,b.jsx)(f.TableHead,{className:"w-[50px]",children:"Actions"})]})}),(0,b.jsx)(f.TableBody,{children:0===c.length?(0,b.jsx)(f.TableRow,{children:(0,b.jsx)(f.TableCell,{colSpan:8,className:"text-center py-8 text-muted-foreground",children:"No payments found"})}):c.map(a=>{var c,d;let g,i=Array.isArray(a.customers)?a.customers[0]:a.customers,j=Array.isArray(a.invoices)?a.invoices[0]:a.invoices,k=(a.amount||0)-(a.refunded_amount||0);return(0,b.jsxs)(f.TableRow,{children:[(0,b.jsx)(f.TableCell,{className:"font-medium",children:a.payment_number||"—"}),(0,b.jsx)(f.TableCell,{children:i?.display_name||"Unknown"}),(0,b.jsx)(f.TableCell,{children:j?.invoice_number||"—"}),(0,b.jsx)(f.TableCell,{className:"capitalize",children:a.payment_method||"—"}),(0,b.jsx)(f.TableCell,{children:(g=({pending:{variant:"secondary",label:"Pending"},completed:{variant:"outline",label:"Completed"},failed:{variant:"destructive",label:"Failed"},refunded:{variant:"secondary",label:"Refunded"}})[(c=a.status)||"pending"]||{variant:"outline",label:c||"Unknown"},(0,b.jsx)(e.Badge,{variant:g.variant,children:g.label}))}),(0,b.jsx)(f.TableCell,{className:"text-right font-mono",children:null===(d=a.amount)?"$0.00":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(d/100)}),(0,b.jsx)(f.TableCell,{children:a.created_at?new Date(a.created_at).toLocaleDateString():"—"}),(0,b.jsx)(f.TableCell,{children:(0,b.jsx)(h.RowActionsDropdown,{resourceType:"payment",resourceId:a.id,resourceData:{maxRefundAmount:k}})})]},a.id)})})]}),(0,b.jsxs)("div",{className:"p-4 text-sm text-muted-foreground",children:["Showing ",c.length," of ",g," payments"]})]})}function j(){return(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(g.Skeleton,{className:"h-10 w-full"}),(0,b.jsx)(g.Skeleton,{className:"h-64 w-full"})]})}async function k({searchParams:a}){let d=Number((await a).page)||1;return(0,b.jsxs)("div",{className:"p-6 space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold",children:"Payments"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"View customer payments"})]}),(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)(j,{}),children:(0,b.jsx)(i,{page:d})})]})}a.s(["default",()=>k])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__78163746._.js.map