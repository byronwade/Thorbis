module.exports = [
"[project]/apps/web/src/lib/payments/payrix-api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payrix API Client
 *
 * Integration with Payrix payment processing for merchant boarding,
 * payment processing, and account management.
 *
 * Documentation: https://resource.payrix.com/
 * API Base: https://api.payrix.com
 */ __turbopack_context__.s([
    "MERCHANT_CATEGORY_CODES",
    ()=>MERCHANT_CATEGORY_CODES,
    "getMCCForIndustry",
    ()=>getMCCForIndustry,
    "getMerchantStatus",
    ()=>getMerchantStatus,
    "submitMerchantBoarding",
    ()=>submitMerchantBoarding
]);
const PAYRIX_API_BASE = process.env.PAYRIX_API_URL || "https://api.payrix.com";
const PAYRIX_API_KEY = process.env.PAYRIX_API_KEY;
const PAYRIX_PARTNER_ID = process.env.PAYRIX_PARTNER_ID;
/**
 * Create headers for Payrix API requests
 */ function getPayrixHeaders() {
    if (!PAYRIX_API_KEY) {
        throw new Error("Payrix API key not configured");
    }
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYRIX_API_KEY}`,
        APIKEY: PAYRIX_API_KEY
    };
}
async function submitMerchantBoarding(request) {
    try {
        const response = await fetch(`${PAYRIX_API_BASE}/entities`, {
            method: "POST",
            headers: getPayrixHeaders(),
            body: JSON.stringify({
                type: request.entity.type,
                name: request.entity.name,
                dba: request.entity.dba,
                email: request.entity.email,
                phone: request.entity.phone,
                address: {
                    line1: request.entity.address1,
                    line2: request.entity.address2,
                    city: request.entity.city,
                    state: request.entity.state,
                    zip: request.entity.zip,
                    country: request.entity.country
                },
                website: request.entity.website,
                ein: request.entity.ein,
                merchant: {
                    status: request.merchant.status,
                    mcc: request.merchant.mcc,
                    established: request.merchant.established,
                    annualVolume: request.merchant.annualVolume,
                    averageTicket: request.merchant.averageTicket,
                    highTicket: request.merchant.highTicket,
                    refundPolicy: request.merchant.refundPolicy
                },
                members: request.members.map((member)=>({
                        first: member.firstName,
                        last: member.lastName,
                        title: member.title,
                        email: member.email,
                        phone: member.phone,
                        dob: member.dob,
                        ssn: member.ssn,
                        ownership: member.ownership,
                        address: {
                            line1: member.address1,
                            line2: member.address2,
                            city: member.city,
                            state: member.state,
                            zip: member.zip,
                            country: member.country
                        }
                    })),
                accounts: request.accounts.map((account)=>({
                        type: account.type,
                        number: account.number,
                        routing: account.routing
                    }))
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            return {
                success: false,
                error: errorData.message || "Failed to submit merchant boarding",
                details: errorData
            };
        }
        const data = await response.json();
        return {
            success: true,
            data: {
                entityId: data.response?.data?.[0]?.id,
                merchantId: data.response?.data?.[0]?.merchant?.[0]?.id,
                memberId: data.response?.data?.[0]?.members?.[0]?.id,
                status: data.response?.data?.[0]?.merchant?.[0]?.status,
                boardingStatus: data.response?.data?.[0]?.merchant?.[0]?.boardingStatus
            }
        };
    } catch (error) {
        console.error("Payrix boarding error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
async function getMerchantStatus(merchantId) {
    try {
        const response = await fetch(`${PAYRIX_API_BASE}/merchants/${merchantId}`, {
            method: "GET",
            headers: getPayrixHeaders()
        });
        if (!response.ok) {
            throw new Error("Failed to fetch merchant status");
        }
        const data = await response.json();
        return {
            success: true,
            data: {
                status: data.response?.data?.[0]?.status,
                boardingStatus: data.response?.data?.[0]?.boardingStatus,
                boardingSubstatus: data.response?.data?.[0]?.boardingSubstatus,
                active: data.response?.data?.[0]?.status === 1
            }
        };
    } catch (error) {
        console.error("Payrix status check error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
const MERCHANT_CATEGORY_CODES = {
    HVAC: "1711",
    PLUMBING: "1711",
    ELECTRICAL: "1731",
    PEST_CONTROL: "7342",
    LOCKSMITH: "7699",
    APPLIANCE_REPAIR: "7623",
    GARAGE_DOOR: "1799",
    LANDSCAPING: "0780",
    POOL_SERVICE: "7699",
    CLEANING: "7349",
    ROOFING: "1761",
    CARPENTRY: "1751",
    PAINTING: "1721",
    GENERAL_CONTRACTOR: "1520"
};
function getMCCForIndustry(industry) {
    const industryUpper = industry.toUpperCase().replace(/[^A-Z]/g, "_");
    return MERCHANT_CATEGORY_CODES[industryUpper] || MERCHANT_CATEGORY_CODES.GENERAL_CONTRACTOR;
}
}),
"[project]/packages/database/src/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.7.0_@supabase+supabase-js@2.81.0/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.7.0_@supabase+supabase-js@2.81.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
const createClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const supabaseUrl = ("TURBOPACK compile-time value", "https://togejqdwggezkxahomeh.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2VqcWR3Z2dlemt4YWhvbWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjAyOTUsImV4cCI6MjA3NzI5NjI5NX0.a74QOxiIcxeALZsTsNXNDiOls1MZDsFfyGFq992eBBM");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Dynamic import of next/headers to prevent bundling in client components
    const { cookies, headers } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    let cookieStore;
    // Check if we're in a prerendering context by looking at headers
    let headersStore;
    try {
        headersStore = await headers();
        // If we can get headers and there's no x-prerender header, we might be safe
        if (headersStore.get('x-prerender')) {
            return null;
        }
    } catch  {
        // If headers() fails, we're likely in prerendering
        return null;
    }
    try {
        cookieStore = await cookies();
    } catch (error) {
        // During prerendering, cookies() may reject - return null
        // This allows PPR to work correctly
        if (error instanceof Error && (error.message.includes("During prerendering") || error.message.includes("prerendering") || error.message.includes("cookies()"))) {
            return null;
        }
        // For other errors, rethrow
        throw error;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set(name, value, options);
                } catch  {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            },
            remove (name, _options) {
                try {
                    cookieStore.delete(name);
                } catch  {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
});
}),
"[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payrix Server Actions
 *
 * Server-side actions for Payrix merchant boarding and payment processing
 */ /* __next_internal_action_entry_do_not_use__ [{"400cd5cc69fe1c96a071edc469ae5a50ca96054a93":"getPayrixMerchantAccount"},"",""] */ __turbopack_context__.s([
    "getPayrixMerchantAccount",
    ()=>getPayrixMerchantAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$payments$2f$payrix$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/payments/payrix-api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
/**
 * Submit merchant boarding application to Payrix
 */ async function submitPayrixMerchantBoarding(data) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Get company information
        const { data: company, error: companyError } = await supabase.from("companies").select("*").eq("id", data.companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: "Company not found"
            };
        }
        // Parse company address
        const addressParts = company.address?.split(",").map((s)=>s.trim()) || [];
        const [street, city, state, zip] = addressParts;
        // Determine entity type based on company structure
        const entityType = company.company_size === "individual" || company.company_size === "1-5" ? 1 : company.legal_name?.includes("LLC") ? 3 : 2;
        // Get MCC code for industry
        const mccCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$payments$2f$payrix$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMCCForIndustry"])(company.industry || "general");
        // Calculate annual volume from monthly estimate
        const annualVolume = data.estimatedMonthlyVolume * 12;
        // Parse owner name
        const [firstName, ...lastNameParts] = data.ownerFullName.split(" ");
        const lastName = lastNameParts.join(" ");
        // Prepare Payrix boarding request
        const boardingRequest = {
            entity: {
                type: entityType,
                name: company.legal_name || company.name,
                dba: company.doing_business_as || company.name,
                email: company.email || "",
                phone: company.phone || "",
                address1: street || "",
                city: city || "",
                state: state || "",
                zip: zip || "",
                country: "US",
                website: company.website || data.businessDescription,
                ein: company.ein || undefined
            },
            merchant: {
                status: 1,
                mcc: mccCode,
                established: new Date(new Date().getFullYear() - data.yearsInBusiness, 0, 1).toISOString().split("T")[0],
                annualVolume,
                averageTicket: data.averageTicketAmount,
                highTicket: data.highestTicketAmount,
                refundPolicy: "30 days"
            },
            members: [
                {
                    firstName,
                    lastName,
                    title: data.ownerTitle,
                    email: company.email || "",
                    phone: company.phone || "",
                    dob: data.ownerDOB,
                    ssn: data.ownerSSN,
                    ownership: data.ownerOwnershipPercentage,
                    address1: data.ownerHomeAddress,
                    city: data.ownerCity,
                    state: data.ownerState,
                    zip: data.ownerZip,
                    country: "US"
                }
            ],
            accounts: [
                {
                    type: data.bankAccountType === "checking" ? 1 : 2,
                    number: data.bankAccountNumber,
                    routing: data.bankRoutingNumber
                }
            ]
        };
        // Submit to Payrix
        const payrixResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$payments$2f$payrix$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitMerchantBoarding"])(boardingRequest);
        if (!payrixResponse.success) {
            return {
                success: false,
                error: payrixResponse.error || "Failed to submit merchant application"
            };
        }
        // Save merchant account to database
        const { error: insertError } = await supabase.from("payrix_merchant_accounts").insert({
            company_id: data.companyId,
            payrix_entity_id: payrixResponse.data?.entityId,
            payrix_merchant_id: payrixResponse.data?.merchantId,
            payrix_member_id: payrixResponse.data?.memberId,
            status: "submitted",
            boarding_status: payrixResponse.data?.boardingStatus,
            years_in_business: data.yearsInBusiness,
            business_description: data.businessDescription,
            business_website: company.website,
            average_ticket_amount: data.averageTicketAmount,
            highest_ticket_amount: data.highestTicketAmount,
            estimated_monthly_volume: data.estimatedMonthlyVolume,
            estimated_annual_volume: annualVolume,
            accepts_credit_cards: data.acceptsCreditCards,
            accepts_debit_cards: data.acceptsDebitCards,
            accepts_ach: data.acceptsACH,
            accepts_recurring: data.acceptsRecurring,
            owner_full_name: data.ownerFullName,
            owner_ssn_encrypted: "***-**-****",
            owner_dob: new Date(data.ownerDOB),
            owner_home_address: data.ownerHomeAddress,
            owner_city: data.ownerCity,
            owner_state: data.ownerState,
            owner_zip: data.ownerZip,
            owner_ownership_percentage: data.ownerOwnershipPercentage,
            owner_title: data.ownerTitle,
            mcc_code: mccCode,
            payrix_response: payrixResponse.data,
            submitted_at: new Date().toISOString()
        });
        if (insertError) {
            console.error("Failed to save merchant account:", insertError);
            return {
                success: false,
                error: "Failed to save merchant account to database"
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/welcome");
        return {
            success: true,
            merchantId: payrixResponse.data?.merchantId,
            status: payrixResponse.data?.status
        };
    } catch (error) {
        console.error("Payrix boarding error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
/**
 * Check Payrix merchant account status
 */ async function checkPayrixMerchantStatus(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Get merchant account from database
        const { data: merchantAccount, error } = await supabase.from("payrix_merchant_accounts").select("*").eq("company_id", companyId).single();
        if (error || !merchantAccount) {
            return {
                success: false,
                error: "Merchant account not found"
            };
        }
        // If we have a Payrix merchant ID, check status
        if (merchantAccount.payrix_merchant_id) {
            const statusResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$payments$2f$payrix$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMerchantStatus"])(merchantAccount.payrix_merchant_id);
            if (statusResponse.success && statusResponse.data) {
                // Update database with latest status
                await supabase.from("payrix_merchant_accounts").update({
                    status: statusResponse.data.active ? "approved" : "under_review",
                    boarding_status: statusResponse.data.boardingStatus,
                    boarding_substatus: statusResponse.data.boardingSubstatus,
                    last_sync_at: new Date().toISOString(),
                    approved_at: statusResponse.data.active ? new Date().toISOString() : null
                }).eq("id", merchantAccount.id);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/welcome");
            }
            return statusResponse;
        }
        return {
            success: true,
            data: {
                status: merchantAccount.status,
                boardingStatus: merchantAccount.boarding_status,
                active: merchantAccount.status === "approved"
            }
        };
    } catch (error) {
        console.error("Payrix status check error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
async function getPayrixMerchantAccount(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: merchantAccount, error } = await supabase.from("payrix_merchant_accounts").select("*").eq("company_id", companyId).maybeSingle();
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            data: merchantAccount
        };
    } catch (error) {
        console.error("Get merchant account error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPayrixMerchantAccount
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPayrixMerchantAccount, "400cd5cc69fe1c96a071edc469ae5a50ca96054a93", null);
}),
"[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Structured Logger
 *
 * Provides structured JSON logging with PII redaction,
 * log levels, and correlation ID support.
 */ // =============================================================================
// TYPES
// =============================================================================
__turbopack_context__.s([
    "createRequestLogger",
    ()=>createRequestLogger,
    "redactPII",
    ()=>redactPII,
    "telnyxLogger",
    ()=>telnyxLogger
]);
// =============================================================================
// CONFIGURATION
// =============================================================================
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
// Default to 'info' in production, 'debug' in development
const currentLogLevel = process.env.TELNYX_LOG_LEVEL || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "debug");
// PII patterns to redact
const PII_PATTERNS = [
    // Phone numbers (various formats)
    /\+?1?\d{10,15}/g,
    // Email addresses
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
];
// Fields that should be redacted
const SENSITIVE_FIELDS = [
    "phone",
    "phoneNumber",
    "phone_number",
    "from",
    "to",
    "fromNumber",
    "toNumber",
    "from_number",
    "to_number",
    "apiKey",
    "api_key",
    "authToken",
    "auth_token",
    "password",
    "secret",
    "token"
];
// =============================================================================
// PII REDACTION
// =============================================================================
/**
 * Mask a phone number, keeping last 4 digits
 */ function maskPhoneNumber(phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) return "****";
    return `***${digits.slice(-4)}`;
}
/**
 * Mask an email address
 */ function maskEmail(email) {
    const [local, domain] = email.split("@");
    if (!domain) return "***@***";
    const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : "***";
    return `${maskedLocal}@${domain}`;
}
/**
 * Redact PII from a string
 */ function redactString(value) {
    let result = value;
    // Redact phone numbers
    result = result.replace(/\+?1?\d{10,15}/g, (match)=>maskPhoneNumber(match));
    // Redact email addresses
    result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match)=>maskEmail(match));
    return result;
}
/**
 * Recursively redact PII from an object
 */ function redactPII(obj, depth = 0) {
    // Prevent infinite recursion
    if (depth > 10) return "[MAX_DEPTH]";
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === "string") {
        return redactString(obj);
    }
    if (typeof obj === "number" || typeof obj === "boolean") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item)=>redactPII(item, depth + 1));
    }
    if (typeof obj === "object") {
        const result = {};
        for (const [key, value] of Object.entries(obj)){
            // Check if this is a sensitive field
            const isSensitive = SENSITIVE_FIELDS.some((field)=>key.toLowerCase().includes(field.toLowerCase()));
            if (isSensitive) {
                if (typeof value === "string") {
                    // Mask the value
                    if (value.includes("@")) {
                        result[key] = maskEmail(value);
                    } else if (/\d/.test(value)) {
                        result[key] = maskPhoneNumber(value);
                    } else {
                        result[key] = "[REDACTED]";
                    }
                } else {
                    result[key] = "[REDACTED]";
                }
            } else {
                result[key] = redactPII(value, depth + 1);
            }
        }
        return result;
    }
    return obj;
}
// =============================================================================
// LOGGER CLASS
// =============================================================================
class TelnyxLogger {
    service = "telnyx";
    defaultContext = {};
    /**
	 * Set default context for all log entries
	 */ setDefaultContext(context) {
        this.defaultContext = {
            ...this.defaultContext,
            ...context
        };
    }
    /**
	 * Clear default context
	 */ clearDefaultContext() {
        this.defaultContext = {};
    }
    /**
	 * Check if a log level should be output
	 */ shouldLog(level) {
        return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
    }
    /**
	 * Format and output a log entry
	 */ log(level, message, context) {
        if (!this.shouldLog(level)) return;
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            service: this.service,
            message
        };
        // Merge default context with provided context
        const fullContext = {
            ...this.defaultContext,
            ...context
        };
        if (Object.keys(fullContext).length > 0) {
            // Redact PII from context
            entry.context = redactPII(fullContext);
        }
        // Output as JSON in production, pretty print in development
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // Development: more readable format
            const contextStr = entry.context ? ` ${JSON.stringify(entry.context, null, 2)}` : "";
            const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.service}]`;
            switch(level){
                case "error":
                    console.error(`${prefix} ${message}${contextStr}`);
                    break;
                case "warn":
                    console.warn(`${prefix} ${message}${contextStr}`);
                    break;
                case "debug":
                    console.debug(`${prefix} ${message}${contextStr}`);
                    break;
                default:
                    console.log(`${prefix} ${message}${contextStr}`);
            }
        }
    }
    /**
	 * Log at debug level
	 */ debug(message, context) {
        this.log("debug", message, context);
    }
    /**
	 * Log at info level
	 */ info(message, context) {
        this.log("info", message, context);
    }
    /**
	 * Log at warn level
	 */ warn(message, context) {
        this.log("warn", message, context);
    }
    /**
	 * Log at error level
	 */ error(message, context) {
        this.log("error", message, context);
    }
    /**
	 * Create a child logger with additional default context
	 */ child(context) {
        return new TelnyxChildLogger(this, context);
    }
    /**
	 * Log a request start
	 */ logRequestStart(method, endpoint, context) {
        const correlationId = context?.correlationId || `tlx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        this.debug(`${method} ${endpoint} started`, {
            ...context,
            correlationId,
            endpoint
        });
        return {
            correlationId,
            startTime
        };
    }
    /**
	 * Log a request completion
	 */ logRequestEnd(method, endpoint, statusCode, startTime, context) {
        const latencyMs = Date.now() - startTime;
        const logFn = statusCode >= 400 ? this.warn.bind(this) : this.info.bind(this);
        logFn(`${method} ${endpoint} completed`, {
            ...context,
            endpoint,
            statusCode,
            latencyMs
        });
    }
    /**
	 * Log a request error
	 */ logRequestError(method, endpoint, error, startTime, context) {
        const latencyMs = Date.now() - startTime;
        this.error(`${method} ${endpoint} failed`, {
            ...context,
            endpoint,
            error: error.message,
            latencyMs
        });
    }
}
/**
 * Child logger with inherited context
 */ class TelnyxChildLogger {
    parent;
    context;
    constructor(parent, context){
        this.parent = parent;
        this.context = context;
    }
    debug(message, context) {
        this.parent.debug(message, {
            ...this.context,
            ...context
        });
    }
    info(message, context) {
        this.parent.info(message, {
            ...this.context,
            ...context
        });
    }
    warn(message, context) {
        this.parent.warn(message, {
            ...this.context,
            ...context
        });
    }
    error(message, context) {
        this.parent.error(message, {
            ...this.context,
            ...context
        });
    }
}
const telnyxLogger = new TelnyxLogger();
function createRequestLogger(correlationId) {
    return telnyxLogger.child({
        correlationId
    });
}
;
}),
"[project]/apps/web/src/lib/telnyx/retry.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Retry Logic
 *
 * Implements exponential backoff with jitter and circuit breaker pattern
 * for resilient API calls to Telnyx.
 */ __turbopack_context__.s([
    "DEFAULT_CIRCUIT_BREAKER_CONFIG",
    ()=>DEFAULT_CIRCUIT_BREAKER_CONFIG,
    "DEFAULT_RETRY_CONFIG",
    ()=>DEFAULT_RETRY_CONFIG,
    "calculateDelay",
    ()=>calculateDelay,
    "createRetryError",
    ()=>createRetryError,
    "generateCorrelationId",
    ()=>generateCorrelationId,
    "getCircuitBreakerStatus",
    ()=>getCircuitBreakerStatus,
    "isRetryable",
    ()=>isRetryable,
    "parseRetryAfter",
    ()=>parseRetryAfter,
    "resetAllCircuitBreakers",
    ()=>resetAllCircuitBreakers,
    "resetCircuitBreaker",
    ()=>resetCircuitBreaker,
    "sleep",
    ()=>sleep,
    "withBulkRetry",
    ()=>withBulkRetry,
    "withRetry",
    ()=>withRetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)");
;
const DEFAULT_RETRY_CONFIG = {
    maxRetries: 5,
    baseDelayMs: 1000,
    maxDelayMs: 32000,
    jitterFactor: 0.3,
    retryableStatusCodes: [
        408,
        429,
        500,
        502,
        503,
        504
    ],
    retryableErrorCodes: [
        "ECONNRESET",
        "ETIMEDOUT",
        "ECONNREFUSED",
        "EPIPE",
        "ENOTFOUND",
        "ENETUNREACH",
        "EAI_AGAIN"
    ]
};
const DEFAULT_CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 5,
    resetTimeoutMs: 60000,
    halfOpenRequests: 3
};
// Per-endpoint circuit breakers
const circuitBreakers = new Map();
function getCircuitBreaker(endpoint) {
    if (!circuitBreakers.has(endpoint)) {
        circuitBreakers.set(endpoint, {
            state: "closed",
            failures: 0,
            lastFailureTime: 0,
            halfOpenSuccesses: 0,
            halfOpenFailures: 0
        });
    }
    return circuitBreakers.get(endpoint);
}
function updateCircuitState(endpoint, success, config = DEFAULT_CIRCUIT_BREAKER_CONFIG) {
    const breaker = getCircuitBreaker(endpoint);
    const now = Date.now();
    if (success) {
        if (breaker.state === "half-open") {
            breaker.halfOpenSuccesses++;
            if (breaker.halfOpenSuccesses >= config.halfOpenRequests) {
                // Enough successes, close the circuit
                breaker.state = "closed";
                breaker.failures = 0;
                breaker.halfOpenSuccesses = 0;
                breaker.halfOpenFailures = 0;
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Circuit breaker closed", {
                    endpoint
                });
            }
        } else if (breaker.state === "closed") {
            // Reset failure count on success
            breaker.failures = 0;
        }
    } else {
        breaker.lastFailureTime = now;
        if (breaker.state === "half-open") {
            breaker.halfOpenFailures++;
            // Any failure in half-open reopens the circuit
            breaker.state = "open";
            breaker.halfOpenSuccesses = 0;
            breaker.halfOpenFailures = 0;
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Circuit breaker reopened", {
                endpoint
            });
        } else if (breaker.state === "closed") {
            breaker.failures++;
            if (breaker.failures >= config.failureThreshold) {
                breaker.state = "open";
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Circuit breaker opened", {
                    endpoint,
                    failures: breaker.failures
                });
            }
        }
    }
}
function canAttempt(endpoint, config = DEFAULT_CIRCUIT_BREAKER_CONFIG) {
    const breaker = getCircuitBreaker(endpoint);
    const now = Date.now();
    if (breaker.state === "closed") {
        return true;
    }
    if (breaker.state === "open") {
        // Check if reset timeout has passed
        if (now - breaker.lastFailureTime >= config.resetTimeoutMs) {
            breaker.state = "half-open";
            breaker.halfOpenSuccesses = 0;
            breaker.halfOpenFailures = 0;
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Circuit breaker half-open", {
                endpoint
            });
            return true;
        }
        return false;
    }
    // Half-open: allow limited requests
    return true;
}
function createRetryError(message, options) {
    const error = new Error(message);
    error.name = "RetryError";
    error.statusCode = options.statusCode;
    error.errorCode = options.errorCode;
    error.retryable = options.retryable;
    error.attempts = options.attempts;
    error.lastError = options.lastError;
    return error;
}
function isRetryable(error, config = DEFAULT_RETRY_CONFIG) {
    if (!error) return false;
    // Check for network errors
    if (error instanceof Error) {
        const errorCode = error.code;
        if (errorCode && config.retryableErrorCodes.includes(errorCode)) {
            return true;
        }
        // Check for fetch/network errors
        if (error.message.includes("fetch failed") || error.message.includes("network") || error.message.includes("timeout") || error.message.includes("ECONNRESET")) {
            return true;
        }
    }
    // Check for HTTP status codes
    if (typeof error === "object" && error !== null) {
        const statusCode = error.statusCode || error.status;
        if (statusCode && config.retryableStatusCodes.includes(statusCode)) {
            return true;
        }
    }
    return false;
}
function calculateDelay(attempt, config = DEFAULT_RETRY_CONFIG) {
    // Exponential backoff: baseDelay * 2^attempt
    const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
    // Cap at max delay
    const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
    // Add jitter (randomness to spread out retries)
    const jitter = cappedDelay * config.jitterFactor * Math.random();
    return Math.floor(cappedDelay + jitter);
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function parseRetryAfter(response) {
    const retryAfter = response.headers.get("Retry-After");
    if (!retryAfter) return null;
    // Check if it's a number (seconds)
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) {
        return seconds * 1000;
    }
    // Check if it's a date
    const date = Date.parse(retryAfter);
    if (!isNaN(date)) {
        return Math.max(0, date - Date.now());
    }
    return null;
}
async function withRetry(fn, options = {}) {
    const config = {
        ...DEFAULT_RETRY_CONFIG,
        ...options.config
    };
    const circuitConfig = {
        ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
        ...options.circuitBreakerConfig
    };
    const endpoint = options.endpoint || "default";
    const correlationId = options.correlationId || generateCorrelationId();
    // Check circuit breaker
    if (!canAttempt(endpoint, circuitConfig)) {
        const error = createRetryError(`Circuit breaker open for endpoint: ${endpoint}`, {
            retryable: false,
            attempts: 0
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Request blocked by circuit breaker", {
            endpoint,
            correlationId
        });
        throw error;
    }
    let lastError;
    let attempt = 0;
    while(attempt <= config.maxRetries){
        try {
            const result = await fn();
            // Success - update circuit breaker
            updateCircuitState(endpoint, true, circuitConfig);
            if (attempt > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Request succeeded after retry", {
                    endpoint,
                    attempt,
                    correlationId
                });
            }
            return result;
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            const retryable = isRetryable(error, config);
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Request failed", {
                endpoint,
                attempt,
                retryable,
                error: lastError.message,
                correlationId
            });
            // Update circuit breaker on failure
            updateCircuitState(endpoint, false, circuitConfig);
            // Don't retry if not retryable or max retries reached
            if (!retryable || attempt >= config.maxRetries) {
                throw createRetryError(`Request failed after ${attempt + 1} attempt(s): ${lastError.message}`, {
                    retryable,
                    attempts: attempt + 1,
                    lastError,
                    statusCode: error.statusCode,
                    errorCode: error.code
                });
            }
            // Calculate delay
            let delayMs = calculateDelay(attempt, config);
            // Check for Retry-After header (if error has response)
            if (typeof error === "object" && error !== null && "response" in error) {
                const response = error.response;
                if (response) {
                    const retryAfter = parseRetryAfter(response);
                    if (retryAfter) {
                        delayMs = Math.min(retryAfter, config.maxDelayMs);
                    }
                }
            }
            // Call onRetry callback
            if (options.onRetry) {
                options.onRetry(attempt, lastError, delayMs);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Retrying request", {
                endpoint,
                attempt: attempt + 1,
                delayMs,
                correlationId
            });
            await sleep(delayMs);
            attempt++;
        }
    }
    // Should never reach here, but just in case
    throw createRetryError(`Request failed after ${config.maxRetries + 1} attempts`, {
        retryable: false,
        attempts: config.maxRetries + 1,
        lastError
    });
}
async function withBulkRetry(options) {
    const { items, operation, concurrency = 10, retryOptions, onProgress } = options;
    const successful = [];
    const failed = [];
    let completed = 0;
    // Process in batches
    for(let i = 0; i < items.length; i += concurrency){
        const batch = items.slice(i, i + concurrency);
        const results = await Promise.allSettled(batch.map(async (item)=>{
            const result = await withRetry(()=>operation(item), retryOptions);
            return {
                item,
                result
            };
        }));
        for (const result of results){
            completed++;
            if (result.status === "fulfilled") {
                successful.push(result.value);
            } else {
                const item = batch[results.indexOf(result)];
                failed.push({
                    item,
                    error: result.reason instanceof Error ? result.reason : new Error(String(result.reason))
                });
            }
        }
        if (onProgress) {
            onProgress(completed, items.length, failed.length);
        }
        // Small delay between batches to avoid rate limiting
        if (i + concurrency < items.length) {
            await sleep(100);
        }
    }
    return {
        successful,
        failed
    };
}
function generateCorrelationId() {
    return `tlx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
function getCircuitBreakerStatus(endpoint) {
    const endpoints = {};
    if (endpoint) {
        const breaker = circuitBreakers.get(endpoint);
        if (breaker) {
            endpoints[endpoint] = breaker;
        }
    } else {
        circuitBreakers.forEach((state, ep)=>{
            endpoints[ep] = state;
        });
    }
    const states = Object.values(endpoints);
    return {
        endpoints,
        summary: {
            total: states.length,
            open: states.filter((s)=>s.state === "open").length,
            halfOpen: states.filter((s)=>s.state === "half-open").length,
            closed: states.filter((s)=>s.state === "closed").length
        }
    };
}
function resetCircuitBreaker(endpoint) {
    circuitBreakers.delete(endpoint);
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Circuit breaker reset", {
        endpoint
    });
}
function resetAllCircuitBreakers() {
    circuitBreakers.clear();
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("All circuit breakers reset");
}
}),
"[project]/apps/web/src/lib/telnyx/calls.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Calls Service - Call Control & Management
 *
 * Production-ready call control with:
 * - Retry logic with exponential backoff
 * - Request timeouts (prevents hanging)
 * - Circuit breaker protection
 * - Structured logging
 *
 * Handles all call-related operations including:
 * - Initiating outbound calls
 * - Answering incoming calls
 * - Call control (mute, hold, transfer)
 * - Call recording
 * - Hangup operations
 */ __turbopack_context__.s([
    "answerCall",
    ()=>answerCall,
    "gatherInput",
    ()=>gatherInput,
    "hangupCall",
    ()=>hangupCall,
    "initiateCall",
    ()=>initiateCall,
    "playAudio",
    ()=>playAudio,
    "rejectCall",
    ()=>rejectCall,
    "sendDTMF",
    ()=>sendDTMF,
    "speakText",
    ()=>speakText,
    "startRecording",
    ()=>startRecording,
    "stopRecording",
    ()=>stopRecording,
    "transferCall",
    ()=>transferCall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/retry.ts [app-rsc] (ecmascript)");
;
;
const TELNYX_API_BASE = "https://api.telnyx.com/v2";
// Request timeout for call control operations (15 seconds)
const REQUEST_TIMEOUT_MS = 15000;
/**
 * Make a direct HTTP request to Telnyx REST API with retry and timeout
 */ async function telnyxCallRequest(endpoint, body, options) {
    const apiKey = process.env.TELNYX_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: "TELNYX_API_KEY is not configured"
        };
    }
    const operation = options?.operation || endpoint;
    const timeout = options?.timeout ?? REQUEST_TIMEOUT_MS;
    const makeRequest = async ()=>{
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), timeout);
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("Call API request", {
                endpoint,
                operation
            });
            const response = await fetch(`${TELNYX_API_BASE}${endpoint}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await response.json();
            if (!response.ok) {
                const errorMessage = result?.errors?.[0]?.detail || result?.errors?.[0] || response.statusText;
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Call API error response", {
                    endpoint,
                    operation,
                    status: response.status,
                    error: errorMessage
                });
                // Throw for retry logic to catch
                const error = new Error(`Telnyx ${response.status}: ${errorMessage}`);
                error.statusCode = response.status;
                throw error;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("Call API success", {
                endpoint,
                operation
            });
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === "AbortError") {
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Call API timeout", {
                    endpoint,
                    operation,
                    timeoutMs: timeout
                });
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            throw error;
        }
    };
    try {
        // Use retry logic unless skipped
        if (options?.skipRetry) {
            return await makeRequest();
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withRetry"])(makeRequest, {
            endpoint: `calls:${operation}`,
            config: {
                maxRetries: 2,
                baseDelayMs: 500,
                maxDelayMs: 2000
            },
            onRetry: (attempt, error, delayMs)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Retrying call API request", {
                    endpoint,
                    operation,
                    attempt,
                    error: error.message,
                    delayMs
                });
            }
        });
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Call API request failed", {
            endpoint,
            operation,
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Request failed"
        };
    }
}
async function initiateCall(params) {
    const result = await telnyxCallRequest("/calls", {
        to: params.to,
        from: params.from,
        connection_id: params.connectionId,
        webhook_url: params.webhookUrl,
        answering_machine_detection: params.answeringMachineDetection || "disabled",
        custom_headers: params.customHeaders
    }, {
        operation: "initiate"
    });
    if (!(result.success && result.data)) {
        return {
            success: false,
            error: result.error || "Failed to initiate call"
        };
    }
    return {
        success: true,
        callControlId: result.data.call_control_id,
        callSessionId: result.data.call_session_id,
        data: result.data
    };
}
async function answerCall(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/answer`, {
        webhook_url: params.webhookUrl,
        client_state: params.clientState
    }, {
        operation: "answer",
        skipRetry: true
    } // Time-sensitive, no retry
    );
}
async function rejectCall(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/reject`, {
        cause: params.cause || "CALL_REJECTED"
    }, {
        operation: "reject",
        skipRetry: true
    });
}
async function hangupCall(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/hangup`, {}, {
        operation: "hangup"
    });
}
async function startRecording(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/record_start`, {
        format: params.format || "mp3",
        channels: params.channels || "single"
    }, {
        operation: "record_start"
    });
}
async function stopRecording(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/record_stop`, {}, {
        operation: "record_stop"
    });
}
async function playAudio(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/playback_start`, {
        audio_url: params.audioUrl,
        loop: params.loop
    }, {
        operation: "playback_start"
    });
}
async function speakText(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/speak`, {
        payload: params.text,
        voice: params.voice || "female",
        language: params.language || "en-US"
    }, {
        operation: "speak"
    });
}
async function transferCall(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/transfer`, {
        to: params.to,
        from: params.from
    }, {
        operation: "transfer"
    });
}
async function sendDTMF(params) {
    return telnyxCallRequest(`/calls/${params.callControlId}/actions/send_dtmf`, {
        digits: params.digits
    }, {
        operation: "send_dtmf"
    });
}
async function gatherInput(params) {
    const useAudio = !!params.audioUrl;
    const endpoint = useAudio ? `/calls/${params.callControlId}/actions/gather_using_audio` : `/calls/${params.callControlId}/actions/gather_using_speak`;
    const body = useAudio ? {
        audio_url: params.audioUrl,
        valid_digits: params.validDigits,
        max: params.maxDigits,
        min: params.minDigits,
        timeout_millis: params.timeout,
        terminating_digit: params.terminatingDigit || "#"
    } : {
        payload: params.speakText || "",
        valid_digits: params.validDigits,
        max: params.maxDigits,
        min: params.minDigits,
        timeout_millis: params.timeout,
        terminating_digit: params.terminatingDigit || "#"
    };
    return telnyxCallRequest(endpoint, body, {
        operation: useAudio ? "gather_audio" : "gather_speak"
    });
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Client - Authenticated API Client
 *
 * Provides a singleton Telnyx client instance with proper authentication.
 * This client is used across all Telnyx service modules.
 */ __turbopack_context__.s([
    "TELNYX_CONFIG",
    ()=>TELNYX_CONFIG,
    "telnyxClient",
    ()=>telnyxClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__Telnyx__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/client.mjs [app-rsc] (ecmascript) <export Telnyx as default>");
;
if (!process.env.TELNYX_API_KEY) {
    throw new Error("TELNYX_API_KEY environment variable is required");
}
const telnyxClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__Telnyx__as__default$3e$__["default"]({
    apiKey: process.env.TELNYX_API_KEY
});
const TELNYX_CONFIG = {
    apiKey: process.env.TELNYX_API_KEY,
    webhookSecret: process.env.TELNYX_WEBHOOK_SECRET || "",
    connectionId: ("TURBOPACK compile-time value", "2819380451880208084") || "",
    publicKey: process.env.TELNYX_PUBLIC_KEY || "",
    messagingProfileId: process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID || process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID || ""
};
}),
"[project]/apps/web/src/lib/telnyx/config-validator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Configuration Validator
 *
 * Validates all required Telnyx environment variables and configuration.
 * Provides clear error messages for missing or invalid configuration.
 */ __turbopack_context__.s([
    "validateCallConfig",
    ()=>validateCallConfig,
    "validateSmsConfig",
    ()=>validateSmsConfig,
    "validateTelnyxConfig",
    ()=>validateTelnyxConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
;
function isLocalUrl(url) {
    const lowered = url.toLowerCase();
    return lowered.includes("localhost") || lowered.includes("127.0.0.1") || lowered.includes("0.0.0.0") || lowered.endsWith(".local") || lowered.includes("://local");
}
function getBaseAppUrl() {
    const candidates = [
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.SITE_URL,
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.APP_URL
    ];
    for (const candidate of candidates){
        if (candidate && candidate.trim()) {
            const trimmed = candidate.trim();
            if (!isLocalUrl(trimmed)) {
                return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
            }
        }
    }
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl && !isLocalUrl(vercelUrl)) {
        return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    }
    return undefined;
}
function validateTelnyxConfig() {
    const errors = [];
    const warnings = [];
    const config = {
        apiKey: false,
        connectionId: false,
        messagingProfileId: false,
        webhookSecret: false,
        publicKey: false,
        siteUrl: false
    };
    // Check API Key (required)
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].apiKey || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].apiKey.trim() === "") {
        errors.push("TELNYX_API_KEY is not set. This is required for all Telnyx operations.");
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].apiKey.length < 20) {
        errors.push("TELNYX_API_KEY appears to be invalid (too short). Get your API key from https://portal.telnyx.com");
    } else {
        config.apiKey = true;
    }
    // Check Connection ID (required for voice calls)
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].connectionId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].connectionId.trim() === "") {
        errors.push("NEXT_PUBLIC_TELNYX_CONNECTION_ID is not set. This is required for phone calls. Get it from Telnyx Portal → Mission Control → Connections.");
    } else {
        config.connectionId = true;
    }
    // Check Messaging Profile ID (required for SMS)
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].messagingProfileId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].messagingProfileId.trim() === "") {
        errors.push("TELNYX_DEFAULT_MESSAGING_PROFILE_ID or NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID is not set. This is required for SMS/MMS. Run getDefaultMessagingProfile() to fetch it automatically from Telnyx.");
    } else {
        config.messagingProfileId = true;
    }
    // Check Webhook Secret (recommended for production)
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].webhookSecret || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].webhookSecret.trim() === "") {
        warnings.push("TELNYX_WEBHOOK_SECRET is not set. Webhook signature verification will be disabled. Set this in production for security.");
    } else {
        config.webhookSecret = true;
    }
    // Check Public Key (recommended for production)
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].publicKey || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].publicKey.trim() === "") {
        warnings.push("TELNYX_PUBLIC_KEY is not set. Webhook signature verification may not work correctly. Get it from Telnyx Portal → API Keys.");
    } else {
        config.publicKey = true;
    }
    // Check Site URL (required for webhooks)
    const siteUrl = getBaseAppUrl();
    if (!siteUrl) {
        errors.push("NEXT_PUBLIC_SITE_URL or SITE_URL is not set to a valid production URL. This is required for webhook callbacks. Set it to your production domain (e.g., https://thorbis.co).");
    } else if (isLocalUrl(siteUrl)) {
        const isProduction = process.env.VERCEL_ENV === "production" || process.env.DEPLOYMENT_ENV === "production";
        if (isProduction) {
            errors.push(`Site URL is set to localhost (${siteUrl}) but you're in production. Set NEXT_PUBLIC_SITE_URL to your production domain.`);
        } else {
            warnings.push(`Site URL is set to localhost (${siteUrl}). This will not work in production.`);
        }
    } else {
        config.siteUrl = true;
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        config
    };
}
async function validateSmsConfig() {
    const validation = validateTelnyxConfig();
    if (!validation.config.apiKey) {
        return {
            valid: false,
            error: "TELNYX_API_KEY is required for SMS operations"
        };
    }
    if (!validation.config.messagingProfileId) {
        // Try to fetch messaging profile automatically
        try {
            const { getDefaultMessagingProfile } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/messaging-profile-fetcher.ts [app-rsc] (ecmascript, async loader)");
            const profileResult = await getDefaultMessagingProfile();
            if (profileResult.success && profileResult.profile) {
                return {
                    valid: false,
                    error: "TELNYX_DEFAULT_MESSAGING_PROFILE_ID is required for SMS operations.",
                    suggestedProfileId: profileResult.profile.id
                };
            }
        } catch  {
        // If fetch fails, return generic error
        }
        return {
            valid: false,
            error: "TELNYX_DEFAULT_MESSAGING_PROFILE_ID is required for SMS operations. Run getDefaultMessagingProfile() to fetch it automatically from Telnyx."
        };
    }
    if (!validation.config.siteUrl) {
        return {
            valid: false,
            error: "NEXT_PUBLIC_SITE_URL must be set to a valid production URL for SMS webhooks."
        };
    }
    return {
        valid: true
    };
}
function validateCallConfig() {
    const validation = validateTelnyxConfig();
    if (!validation.config.apiKey) {
        return {
            valid: false,
            error: "TELNYX_API_KEY is required for phone calls"
        };
    }
    if (!validation.config.connectionId) {
        return {
            valid: false,
            error: "NEXT_PUBLIC_TELNYX_CONNECTION_ID is required for phone calls. Get it from Telnyx Portal → Mission Control → Connections."
        };
    }
    if (!validation.config.siteUrl) {
        return {
            valid: false,
            error: "NEXT_PUBLIC_SITE_URL must be set to a valid production URL for call webhooks."
        };
    }
    return {
        valid: true
    };
}
/**
 * Get formatted error message for display to users
 */ function getFormattedErrorMessage(validation) {
    if (validation.valid) {
        return "";
    }
    const lines = [
        "Telnyx configuration errors:"
    ];
    validation.errors.forEach((error, index)=>{
        lines.push(`${index + 1}. ${error}`);
    });
    if (validation.warnings.length > 0) {
        lines.push("");
        lines.push("Warnings:");
        validation.warnings.forEach((warning, index)=>{
            lines.push(`${index + 1}. ${warning}`);
        });
    }
    return lines.join("\n");
}
}),
"[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0065abb4e4ef4b97e2016c1b54c8d9b3a9ff7b955e":"createServiceSupabaseClient"},"",""] */ __turbopack_context__.s([
    "createServiceSupabaseClient",
    ()=>createServiceSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.81.0/node_modules/@supabase/supabase-js/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function createServiceSupabaseClient() {
    // Prefer pooler URL for Transaction Mode (better performance)
    const supabaseUrl = process.env.SUPABASE_POOLER_URL || ("TURBOPACK compile-time value", "https://togejqdwggezkxahomeh.supabase.co");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        return null;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        },
        db: {
            schema: "public"
        },
        global: {
            headers: {
                "x-my-custom-header": "service-role"
            }
        }
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createServiceSupabaseClient
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createServiceSupabaseClient, "0065abb4e4ef4b97e2016c1b54c8d9b3a9ff7b955e", null);
}),
"[project]/apps/web/src/lib/telnyx/messaging.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Messaging Service - SMS & MMS
 *
 * Production-ready messaging with:
 * - 10DLC compliance verification (required for US A2P SMS as of Dec 2024)
 * - Per-company rate limiting
 * - Retry logic with exponential backoff
 * - Multi-tenant support
 * - Structured logging
 */ __turbopack_context__.s([
    "check10DLCStatus",
    ()=>check10DLCStatus,
    "checkSMSRateLimit",
    ()=>checkSMSRateLimit,
    "formatPhoneNumber",
    ()=>formatPhoneNumber,
    "getMessage",
    ()=>getMessage,
    "isUSPhoneNumber",
    ()=>isUSPhoneNumber,
    "listMessages",
    ()=>listMessages,
    "sendBulkSMS",
    ()=>sendBulkSMS,
    "sendMMS",
    ()=>sendMMS,
    "sendSMS",
    ()=>sendSMS,
    "validatePhoneNumber",
    ()=>validatePhoneNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/retry.ts [app-rsc] (ecmascript)");
;
;
;
const TELNYX_API_BASE = "https://api.telnyx.com/v2";
// =============================================================================
// CONFIGURATION
// =============================================================================
const MESSAGING_CONFIG = {
    // Default rate limits per company (messages per minute)
    defaultRateLimitPerMinute: 60,
    // Max concurrent sends for bulk operations
    maxConcurrentSends: 5,
    // Warn if 10DLC not configured
    warnOn10DLCMissing: true,
    // Request timeout in milliseconds
    requestTimeoutMs: 30000
};
// =============================================================================
// API CLIENT
// =============================================================================
function assertTelnyxApiKey() {
    const apiKey = process.env.TELNYX_API_KEY;
    if (!apiKey) {
        throw new Error("TELNYX_API_KEY is not configured");
    }
    return apiKey;
}
async function telnyxRequest(path, init) {
    const apiKey = assertTelnyxApiKey();
    const url = new URL(`${TELNYX_API_BASE}${path}`);
    if (init?.query) {
        for (const [key, value] of Object.entries(init.query)){
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        }
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("Telnyx API request", {
        method: init?.method || "GET",
        path
    });
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeout = init?.timeout ?? MESSAGING_CONFIG.requestTimeoutMs;
    const timeoutId = setTimeout(()=>controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
                ...init?.headers || {}
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const data = await response.json();
        if (!response.ok) {
            const detail = data?.errors?.[0]?.detail || response.statusText;
            const errorCode = data?.errors?.[0]?.code;
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Telnyx API error", {
                status: response.status,
                detail,
                errorCode,
                path
            });
            throw new Error(`Telnyx ${response.status}: ${detail}`);
        }
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Telnyx API timeout", {
                path,
                timeoutMs: timeout
            });
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}
async function telnyxMessageRequest(body) {
    return telnyxRequest("/messages", {
        method: "POST",
        body: JSON.stringify(body)
    });
}
async function check10DLCStatus(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) {
            return {
                isConfigured: false,
                warnings: [
                    "Database not available - cannot verify 10DLC status"
                ]
            };
        }
        const { data: settings, error } = await supabase.from("company_telnyx_settings").select("ten_dlc_brand_id, ten_dlc_campaign_id, messaging_profile_id, status").eq("company_id", companyId).maybeSingle();
        if (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Failed to check 10DLC status", {
                companyId,
                error: error.message
            });
            return {
                isConfigured: false,
                warnings: [
                    "Failed to verify 10DLC status"
                ]
            };
        }
        if (!settings) {
            return {
                isConfigured: false,
                warnings: [
                    "No Telnyx settings configured for company"
                ]
            };
        }
        const warnings = [];
        if (!settings.ten_dlc_brand_id) {
            warnings.push("10DLC brand not registered - US SMS may be filtered");
        }
        if (!settings.ten_dlc_campaign_id) {
            warnings.push("10DLC campaign not registered - US SMS may be filtered");
        }
        if (!settings.messaging_profile_id) {
            warnings.push("Messaging profile not configured");
        }
        const isConfigured = !!settings.ten_dlc_brand_id && !!settings.ten_dlc_campaign_id && !!settings.messaging_profile_id;
        return {
            isConfigured,
            brandId: settings.ten_dlc_brand_id || undefined,
            campaignId: settings.ten_dlc_campaign_id || undefined,
            messagingProfileId: settings.messaging_profile_id || undefined,
            warnings
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("10DLC check error", {
            companyId,
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return {
            isConfigured: false,
            warnings: [
                "Error checking 10DLC status"
            ]
        };
    }
}
async function checkSMSRateLimit(companyId, identifier = "default") {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) {
            // Allow in development without database
            return {
                allowed: true,
                currentCount: 0,
                limit: MESSAGING_CONFIG.defaultRateLimitPerMinute
            };
        }
        // Use the database function for atomic increment
        const { data, error } = await supabase.rpc("increment_rate_limit", {
            p_company_id: companyId,
            p_resource: "sms",
            p_identifier: identifier,
            p_window_size_seconds: 60
        });
        if (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Rate limit check failed", {
                companyId,
                error: error.message
            });
            // Fail open on database errors
            return {
                allowed: true,
                currentCount: 0,
                limit: MESSAGING_CONFIG.defaultRateLimitPerMinute
            };
        }
        const result = data?.[0] || {
            current_count: 1
        };
        const currentCount = result.current_count;
        const limit = MESSAGING_CONFIG.defaultRateLimitPerMinute;
        const allowed = currentCount <= limit;
        if (!allowed) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("SMS rate limit exceeded", {
                companyId,
                currentCount,
                limit
            });
        }
        return {
            allowed,
            currentCount,
            limit
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("Rate limit error", {
            companyId,
            error: error instanceof Error ? error.message : "Unknown error"
        });
        // Fail open
        return {
            allowed: true,
            currentCount: 0,
            limit: MESSAGING_CONFIG.defaultRateLimitPerMinute
        };
    }
}
async function sendSMS(params) {
    const warnings = [];
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Sending SMS", {
            companyId: params.companyId,
            to: params.to.substring(0, 6) + "****",
            textLength: params.text.length
        });
        // 1. Check 10DLC compliance (unless skipped)
        if (!params.skip10DLCCheck && MESSAGING_CONFIG.warnOn10DLCMissing) {
            const tenDLCStatus = await check10DLCStatus(params.companyId);
            if (!tenDLCStatus.isConfigured) {
                warnings.push(...tenDLCStatus.warnings);
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("SMS sent without 10DLC registration", {
                    companyId: params.companyId,
                    warnings: tenDLCStatus.warnings
                });
            }
            // Use company's messaging profile if not provided
            if (!params.messagingProfileId && tenDLCStatus.messagingProfileId) {
                params.messagingProfileId = tenDLCStatus.messagingProfileId;
            }
        }
        // 2. Check rate limit (unless skipped)
        if (!params.skipRateLimit) {
            const rateLimit = await checkSMSRateLimit(params.companyId);
            if (!rateLimit.allowed) {
                return {
                    success: false,
                    error: `Rate limit exceeded: ${rateLimit.currentCount}/${rateLimit.limit} messages per minute`,
                    warnings
                };
            }
        }
        // 3. Send with retry logic
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withRetry"])(async ()=>{
            const requestBody = {
                to: params.to,
                from: params.from,
                text: params.text,
                messaging_profile_id: params.messagingProfileId,
                webhook_url: params.webhookUrl,
                webhook_failover_url: params.webhookFailoverUrl,
                use_profile_webhooks: params.useProfileWebhooks ?? true
            };
            return telnyxMessageRequest(requestBody);
        }, {
            endpoint: "messaging:send_sms",
            config: {
                maxRetries: 3,
                baseDelayMs: 500,
                maxDelayMs: 5000
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("SMS sent successfully", {
            companyId: params.companyId,
            messageId: result.data.id,
            status: result.data.status
        });
        return {
            success: true,
            messageId: result.data.id,
            data: result.data,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("SMS send failed", {
            companyId: params.companyId,
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send SMS",
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }
}
async function sendMMS(params) {
    try {
        // Check rate limit
        const rateLimit = await checkSMSRateLimit(params.companyId);
        if (!rateLimit.allowed) {
            return {
                success: false,
                error: `Rate limit exceeded: ${rateLimit.currentCount}/${rateLimit.limit} messages per minute`
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withRetry"])(async ()=>{
            return telnyxMessageRequest({
                to: params.to,
                from: params.from,
                text: params.text,
                media_urls: params.mediaUrls,
                messaging_profile_id: params.messagingProfileId,
                webhook_url: params.webhookUrl,
                webhook_failover_url: params.webhookFailoverUrl,
                subject: params.subject,
                type: "MMS"
            });
        }, {
            endpoint: "messaging:send_mms",
            config: {
                maxRetries: 3,
                baseDelayMs: 500
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("MMS sent successfully", {
            companyId: params.companyId,
            messageId: result.data.id,
            mediaCount: params.mediaUrls.length
        });
        return {
            success: true,
            messageId: result.data.id,
            data: result.data
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("MMS send failed", {
            companyId: params.companyId,
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send MMS"
        };
    }
}
async function sendBulkSMS(params) {
    const results = [];
    let successful = 0;
    let failed = 0;
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Starting bulk SMS", {
        companyId: params.companyId,
        recipientCount: params.to.length
    });
    // Process in batches to respect rate limits
    const batchSize = MESSAGING_CONFIG.maxConcurrentSends;
    for(let i = 0; i < params.to.length; i += batchSize){
        const batch = params.to.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(async (recipient)=>{
            const result = await sendSMS({
                companyId: params.companyId,
                to: recipient,
                from: params.from,
                text: params.text,
                webhookUrl: params.webhookUrl,
                messagingProfileId: params.messagingProfileId,
                // Skip 10DLC check for each message in bulk (already checked once)
                skip10DLCCheck: i > 0
            });
            return {
                to: recipient,
                result
            };
        }));
        for (const r of batchResults){
            results.push(r);
            if (r.result.success) {
                successful++;
            } else {
                failed++;
            }
        }
        // Small delay between batches to smooth out rate limiting
        if (i + batchSize < params.to.length) {
            await new Promise((resolve)=>setTimeout(resolve, 100));
        }
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Bulk SMS completed", {
        companyId: params.companyId,
        total: params.to.length,
        successful,
        failed
    });
    return {
        success: failed === 0,
        total: params.to.length,
        successful,
        failed,
        results
    };
}
async function getMessage(messageId) {
    try {
        const message = await telnyxRequest(`/messages/${messageId}`);
        return {
            success: true,
            data: message.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to retrieve message"
        };
    }
}
async function listMessages(params) {
    try {
        const messages = await telnyxRequest("/messages", {
            query: {
                "page[size]": params?.pageSize ?? 20,
                "page[number]": params?.pageNumber ?? 1,
                "filter[from]": params?.filterFrom,
                "filter[to]": params?.filterTo,
                "filter[direction]": params?.filterDirection
            }
        });
        return {
            success: true,
            data: messages.data,
            meta: messages.meta
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to list messages"
        };
    }
}
function validatePhoneNumber(phoneNumber) {
    try {
        // Remove any formatting from phone number
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        // Check if it's a valid length (10-15 digits)
        if (cleanNumber.length < 10 || cleanNumber.length > 15) {
            return {
                success: false,
                error: "Invalid phone number length (must be 10-15 digits)"
            };
        }
        // Format to E.164
        const formattedNumber = formatPhoneNumber(cleanNumber);
        return {
            success: true,
            formattedNumber
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to validate phone number"
        };
    }
}
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters except leading +
    const digits = phoneNumber.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    // Already has + prefix
    if (digits.startsWith("+")) {
        return digits;
    }
    // If it starts with 1 and is 11 digits, it's a US number
    if (digits.length === 11 && digits.startsWith("1")) {
        return `+${digits}`;
    }
    // If it's 10 digits, assume US and add +1
    if (digits.length === 10) {
        return `+1${digits}`;
    }
    // Otherwise, add + prefix
    return `+${digits}`;
}
function isUSPhoneNumber(phoneNumber) {
    const formatted = formatPhoneNumber(phoneNumber);
    return formatted.startsWith("+1") && formatted.length === 12;
}
}),
"[project]/apps/web/src/lib/telnyx/messaging-profile-setup.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Messaging Profile Setup & Verification
 *
 * Verifies messaging profile configuration and can auto-update webhook URLs.
 */ __turbopack_context__.s([
    "fixMessagingProfile",
    ()=>fixMessagingProfile,
    "verifyMessagingProfile",
    ()=>verifyMessagingProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
;
function getWebhookUrl() {
    const candidates = [
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.SITE_URL,
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.APP_URL
    ];
    const isDevelopment = ("TURBOPACK compile-time value", "development") === "development" || process.env.VERCEL_ENV !== "production" || process.env.DEPLOYMENT_ENV !== "production";
    for (const candidate of candidates){
        if (candidate && candidate.trim()) {
            const trimmed = candidate.trim();
            const isLocal = trimmed.includes("localhost") || trimmed.includes("127.0.0.1") || trimmed.includes("0.0.0.0");
            // In development, allow localhost URLs (useful for testing with ngrok or similar)
            // In production, reject localhost
            if (isLocal && !isDevelopment) {
                continue; // Skip localhost in production
            }
            const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
            return `${normalized.replace(/\/+$/, "")}/api/webhooks/telnyx`;
        }
    }
    return undefined;
}
async function verifyMessagingProfile(messagingProfileId) {
    const profileId = messagingProfileId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].messagingProfileId;
    const status = {
        exists: false,
        isActive: false,
        hasWebhookUrl: false,
        webhookUrl: null,
        webhookFailoverUrl: null,
        webhookApiVersion: null,
        needsFix: false,
        issues: []
    };
    if (!profileId || profileId.trim() === "") {
        status.issues.push("Messaging profile ID is not configured");
        status.needsFix = true;
        return status;
    }
    try {
        const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].messagingProfiles.retrieve(profileId);
        const profileData = profile.data;
        if (!profileData) {
            status.issues.push(`Messaging profile ${profileId} not found in Telnyx`);
            status.needsFix = true;
            return status;
        }
        status.exists = true;
        status.isActive = profileData.enabled !== false;
        status.webhookUrl = profileData.webhook_url || null;
        status.webhookFailoverUrl = profileData.webhook_failover_url || null;
        status.webhookApiVersion = profileData.webhook_api_version || null;
        // Check webhook URL
        const expectedWebhookUrl = getWebhookUrl();
        if (!expectedWebhookUrl) {
            const isDevelopment = ("TURBOPACK compile-time value", "development") === "development" || process.env.VERCEL_ENV !== "production" || process.env.DEPLOYMENT_ENV !== "production";
            if ("TURBOPACK compile-time truthy", 1) {
                status.issues.push("NEXT_PUBLIC_SITE_URL is not set. Set it to your production URL (e.g., https://yourdomain.com) or use a tool like ngrok for local testing.");
            } else //TURBOPACK unreachable
            ;
            status.needsFix = true;
        } else if (!status.webhookUrl) {
            status.issues.push(`Webhook URL is not set. Expected: ${expectedWebhookUrl} (with optional ?company=... for multi-tenant)`);
            status.needsFix = true;
        } else {
            // Accept both base webhook URL and company-specific URLs (with query params)
            const baseUrl = status.webhookUrl.split("?")[0];
            if (baseUrl === expectedWebhookUrl || status.webhookUrl === expectedWebhookUrl) {
                status.hasWebhookUrl = true;
            } else {
                status.issues.push(`Webhook URL base is not set correctly. Expected: ${expectedWebhookUrl}, Current: ${baseUrl}`);
                status.needsFix = true;
            }
        }
        // Check webhook API version
        if (status.webhookApiVersion !== "2") {
            status.issues.push(`Webhook API version should be "2", but is "${status.webhookApiVersion || "not set"}"`);
            status.needsFix = true;
        }
        // Check if profile is active
        if (!status.isActive) {
            status.issues.push("Messaging profile is not enabled");
            status.needsFix = true;
        }
        return status;
    } catch (error) {
        if (error?.statusCode === 404) {
            status.issues.push(`Messaging profile ${profileId} not found in Telnyx`);
        } else {
            status.issues.push(error?.message || "Failed to retrieve messaging profile");
        }
        status.needsFix = true;
        return status;
    }
}
async function fixMessagingProfile(messagingProfileId, options) {
    const profileId = messagingProfileId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].messagingProfileId;
    const changes = [];
    if (!profileId || profileId.trim() === "") {
        return {
            success: false,
            fixed: false,
            error: "Messaging profile ID is not configured",
            changes: []
        };
    }
    try {
        // Get current status
        const status = await verifyMessagingProfile(profileId);
        if (!status.needsFix) {
            return {
                success: true,
                fixed: false,
                changes: []
            };
        }
        // Get expected webhook URL
        const expectedWebhookUrl = options?.webhookUrl || getWebhookUrl();
        if (!expectedWebhookUrl) {
            return {
                success: false,
                fixed: false,
                error: "NEXT_PUBLIC_SITE_URL must be set to a valid production URL to configure webhooks",
                changes: []
            };
        }
        // Prepare update
        const updateData = {};
        // Fix webhook URL
        if (status.webhookUrl !== expectedWebhookUrl) {
            updateData.webhook_url = expectedWebhookUrl;
            changes.push(`Updated webhook URL to ${expectedWebhookUrl}`);
        }
        // Fix webhook failover URL
        const expectedFailoverUrl = options?.webhookFailoverUrl || process.env.TELNYX_WEBHOOK_FAILOVER_URL || null;
        if (status.webhookFailoverUrl !== expectedFailoverUrl) {
            updateData.webhook_failover_url = expectedFailoverUrl;
            if (expectedFailoverUrl) {
                changes.push(`Updated webhook failover URL to ${expectedFailoverUrl}`);
            } else {
                changes.push("Removed webhook failover URL");
            }
        }
        // Fix webhook API version
        if (status.webhookApiVersion !== "2") {
            updateData.webhook_api_version = "2";
            changes.push("Updated webhook API version to 2");
        }
        // Fix profile enabled status
        if (!status.isActive) {
            updateData.enabled = true;
            changes.push("Enabled messaging profile");
        }
        // Apply updates if needed
        if (Object.keys(updateData).length > 0) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].messagingProfiles.update(profileId, updateData);
        }
        return {
            success: true,
            fixed: changes.length > 0,
            changes
        };
    } catch (error) {
        return {
            success: false,
            fixed: false,
            error: error?.message || "Failed to update messaging profile",
            changes
        };
    }
}
/**
 * Get messaging profile details
 */ async function getMessagingProfileDetails(messagingProfileId) {
    const profileId = messagingProfileId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].messagingProfileId;
    if (!profileId || profileId.trim() === "") {
        return {
            success: false,
            error: "Messaging profile ID is not configured"
        };
    }
    try {
        const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].messagingProfiles.retrieve(profileId);
        return {
            success: true,
            data: profile.data
        };
    } catch (error) {
        return {
            success: false,
            error: error?.message || "Failed to retrieve messaging profile"
        };
    }
}
}),
"[project]/apps/web/src/lib/telnyx/numbers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Phone Numbers Service - Number Management
 *
 * Handles all phone number operations including:
 * - Searching available numbers
 * - Purchasing numbers
 * - Porting numbers
 * - Configuring number settings
 * - Releasing numbers
 */ __turbopack_context__.s([
    "getNumberDetails",
    ()=>getNumberDetails,
    "initiatePorting",
    ()=>initiatePorting,
    "listOwnedNumbers",
    ()=>listOwnedNumbers,
    "purchaseNumber",
    ()=>purchaseNumber,
    "releaseNumber",
    ()=>releaseNumber,
    "searchAvailableNumbers",
    ()=>searchAvailableNumbers,
    "updateNumber",
    ()=>updateNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
;
async function searchAvailableNumbers(params) {
    try {
        const numbers = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].availablePhoneNumbers.list({
            filter: {
                country_code: params.countryCode || "US",
                national_destination_code: params.areaCode,
                features: params.features,
                limit: params.limit || 10,
                starts_with: params.startsWith,
                ends_with: params.endsWith,
                contains: params.contains
            }
        });
        return {
            success: true,
            data: numbers.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to search numbers"
        };
    }
}
async function purchaseNumber(params) {
    try {
        const number = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].numberOrders.create({
            phone_numbers: [
                {
                    phone_number: params.phoneNumber
                }
            ],
            messaging_profile_id: params.messagingProfileId,
            connection_id: params.connectionId,
            billing_group_id: params.billingGroupId,
            customer_reference: params.customerReference
        });
        return {
            success: true,
            orderId: number.data?.id,
            data: number.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to purchase number"
        };
    }
}
async function listOwnedNumbers(params) {
    try {
        const numbers = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].phoneNumbers.list({
            page: {
                size: params?.pageSize || 20,
                number: params?.pageNumber || 1
            },
            filter: {
                tag: params?.filterTag,
                status: params?.filterStatus
            }
        });
        return {
            success: true,
            data: numbers.data,
            meta: numbers.meta
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to list numbers"
        };
    }
}
async function getNumberDetails(phoneNumberId) {
    try {
        const number = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].phoneNumbers.retrieve(phoneNumberId);
        return {
            success: true,
            data: number.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to retrieve number"
        };
    }
}
async function updateNumber(params) {
    try {
        const number = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].phoneNumbers.update(params.phoneNumberId, {
            connection_id: params.connectionId,
            messaging_profile_id: params.messagingProfileId,
            billing_group_id: params.billingGroupId,
            tags: params.tags,
            customer_reference: params.customerReference
        });
        return {
            success: true,
            data: number.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update number"
        };
    }
}
async function releaseNumber(phoneNumberId) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].phoneNumbers.del(phoneNumberId);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to release number"
        };
    }
}
async function initiatePorting(params) {
    try {
        const portingOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].numberPortouts.create({
            phone_numbers: params.phoneNumbers,
            billing_group_id: params.billingGroupId,
            fast_port_eligible: params.fastPortEligible,
            customer_reference: {
                account_number: params.accountNumber,
                account_pin: params.accountPin,
                authorized_person: params.authorizedPerson
            },
            service_address: {
                address_line_1: params.addressLine1,
                city: params.city,
                state_or_province: params.stateOrProvince,
                zip_or_postal_code: params.zipOrPostalCode,
                country_code: params.countryCode || "US"
            }
        });
        return {
            success: true,
            portingOrderId: portingOrder.data.id,
            data: portingOrder.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to initiate porting"
        };
    }
}
/**
 * Get porting order status
 */ async function getPortingStatus(portingOrderId) {
    try {
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].numberPortouts.retrieve(portingOrderId);
        return {
            success: true,
            status: order.data.status,
            data: order.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get porting status"
        };
    }
}
/**
 * Estimate number costs
 */ async function estimateNumberCost(params) {
    // Cost estimates based on Telnyx pricing (as of 2025)
    const costs = {
        US: {
            local: {
                monthly: 1.0,
                setup: 0.0
            },
            "toll-free": {
                monthly: 2.0,
                setup: 0.0
            },
            mobile: {
                monthly: 5.0,
                setup: 0.0
            }
        },
        CA: {
            local: {
                monthly: 1.5,
                setup: 0.0
            },
            "toll-free": {
                monthly: 2.5,
                setup: 0.0
            }
        },
        GB: {
            local: {
                monthly: 2.0,
                setup: 0.0
            },
            "toll-free": {
                monthly: 3.0,
                setup: 0.0
            }
        }
    };
    const countryCode = params.countryCode.toUpperCase();
    const pricing = costs[countryCode];
    if (!pricing) {
        return {
            success: false,
            error: `Pricing not available for country: ${countryCode}`
        };
    }
    const typePricing = pricing[params.numberType];
    if (!typePricing) {
        return {
            success: false,
            error: `Number type ${params.numberType} not available in ${countryCode}`
        };
    }
    return {
        success: true,
        costs: {
            monthly: typePricing.monthly,
            setup: typePricing.setup,
            currency: "USD"
        }
    };
}
/**
 * Validate if a number can be ported
 */ async function validatePortability(phoneNumber) {
    try {
        // This would typically call Telnyx's LNP (Local Number Portability) check API
        // For now, we'll do basic validation
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        // Must be at least 10 digits
        if (cleanNumber.length < 10) {
            return {
                success: false,
                portable: false,
                reason: "Phone number must be at least 10 digits"
            };
        }
        // In a real implementation, you would check with Telnyx's LNP API
        return {
            success: true,
            portable: true,
            estimatedPortingDays: 7,
            fastPortEligible: false
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to validate portability"
        };
    }
}
}),
"[project]/apps/web/src/lib/telnyx/phone-number-setup.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Phone Number Setup & Verification
 *
 * Verifies phone numbers are properly configured in Telnyx and can auto-fix issues.
 */ __turbopack_context__.s([
    "fixPhoneNumber",
    ()=>fixPhoneNumber,
    "verifyPhoneNumber",
    ()=>verifyPhoneNumber,
    "verifySmsCapability",
    ()=>verifySmsCapability,
    "verifyVoiceCapability",
    ()=>verifyVoiceCapability
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/numbers.ts [app-rsc] (ecmascript)");
;
;
/**
 * Find phone number ID by phone number string
 */ async function findPhoneNumberId(phoneNumber) {
    try {
        // Normalize phone number (E.164 format)
        const normalized = phoneNumber.replace(/\D/g, "");
        const e164 = normalized.startsWith("+") ? phoneNumber : normalized.startsWith("1") && normalized.length === 11 ? `+${normalized}` : `+1${normalized}`;
        // List all owned numbers and find matching one
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listOwnedNumbers"])({
            pageSize: 100
        });
        if (!result.success || !result.data) {
            return {
                success: false,
                error: "Failed to list phone numbers from Telnyx"
            };
        }
        const numbers = Array.isArray(result.data) ? result.data : [
            result.data
        ];
        const matching = numbers.find((num)=>num.phone_number === e164 || num.phone_number === phoneNumber || num.phone_number?.replace(/\D/g, "") === normalized);
        if (!matching) {
            return {
                success: false,
                error: `Phone number ${phoneNumber} not found in Telnyx account`
            };
        }
        return {
            success: true,
            phoneNumberId: matching.id
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to find phone number"
        };
    }
}
async function verifyPhoneNumber(phoneNumber) {
    const status = {
        exists: false,
        hasMessagingProfile: false,
        hasConnection: false,
        capabilities: {
            sms: false,
            voice: false,
            mms: false
        },
        needsFix: false,
        issues: []
    };
    try {
        // Find phone number ID
        const findResult = await findPhoneNumberId(phoneNumber);
        if (!findResult.success || !findResult.phoneNumberId) {
            status.issues.push(findResult.error || "Phone number not found in Telnyx");
            status.needsFix = true;
            return status;
        }
        status.exists = true;
        // Get phone number details
        const detailsResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNumberDetails"])(findResult.phoneNumberId);
        if (!detailsResult.success || !detailsResult.data) {
            status.issues.push("Failed to retrieve phone number details");
            status.needsFix = true;
            return status;
        }
        const numberData = detailsResult.data;
        // Check messaging profile
        if (numberData.messaging_profile_id) {
            status.hasMessagingProfile = true;
        } else {
            status.issues.push("Phone number is not associated with a messaging profile");
            status.needsFix = true;
        }
        // Check connection
        if (numberData.connection_id) {
            status.hasConnection = true;
        } else {
            status.issues.push("Phone number is not associated with a connection");
            status.needsFix = true;
        }
        // Check capabilities from phone number features
        const features = numberData.features || [];
        const hasFeaturesSms = features.includes("sms");
        const hasFeaturesVoice = features.includes("voice");
        const hasFeaturesMms = features.includes("mms");
        // Also check messaging settings endpoint for SMS/MMS status
        let messagingEnabled = false;
        try {
            const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
            if (TELNYX_API_KEY) {
                const messagingResponse = await fetch(`https://api.telnyx.com/v2/phone_numbers/${findResult.phoneNumberId}/messaging`, {
                    headers: {
                        Authorization: `Bearer ${TELNYX_API_KEY}`
                    }
                });
                if (messagingResponse.ok) {
                    const messagingData = await messagingResponse.json();
                    const messagingFeatures = messagingData?.data?.features;
                    if (messagingFeatures?.sms?.domestic_two_way || messagingFeatures?.mms?.domestic_two_way) {
                        messagingEnabled = true;
                    }
                }
            }
        } catch  {
        // Ignore errors - fall back to features check
        }
        // Consider SMS enabled if either features include it OR messaging settings confirm it
        status.capabilities.sms = hasFeaturesSms || messagingEnabled;
        status.capabilities.voice = hasFeaturesVoice;
        status.capabilities.mms = hasFeaturesMms || messagingEnabled;
        if (!status.capabilities.sms) {
            status.issues.push("Phone number does not have SMS capability");
        }
        if (!status.capabilities.voice) {
            status.issues.push("Phone number does not have voice capability");
        }
        return status;
    } catch (error) {
        status.issues.push(error instanceof Error ? error.message : "Unknown error");
        status.needsFix = true;
        return status;
    }
}
async function fixPhoneNumber(phoneNumber, options) {
    const changes = [];
    try {
        // Find phone number ID
        const findResult = await findPhoneNumberId(phoneNumber);
        if (!findResult.success || !findResult.phoneNumberId) {
            return {
                success: false,
                fixed: false,
                error: findResult.error || "Phone number not found",
                changes: []
            };
        }
        // Get current status
        const status = await verifyPhoneNumber(phoneNumber);
        if (!status.needsFix) {
            return {
                success: true,
                fixed: false,
                changes: []
            };
        }
        // Prepare update parameters
        const updateParams = {
            phoneNumberId: findResult.phoneNumberId
        };
        // Fix messaging profile
        if (!status.hasMessagingProfile) {
            const messagingProfileId = options?.messagingProfileId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].messagingProfileId;
            if (messagingProfileId) {
                updateParams.messagingProfileId = messagingProfileId;
                changes.push(`Assigned messaging profile ${messagingProfileId} to phone number`);
            } else {
                return {
                    success: false,
                    fixed: false,
                    error: "Messaging profile ID is required but not configured. Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID.",
                    changes: []
                };
            }
        }
        // Fix connection
        if (!status.hasConnection) {
            const connectionId = options?.connectionId || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].connectionId;
            if (connectionId) {
                updateParams.connectionId = connectionId;
                changes.push(`Assigned connection ${connectionId} to phone number`);
            } else {
                return {
                    success: false,
                    fixed: false,
                    error: "Connection ID is required but not configured. Set NEXT_PUBLIC_TELNYX_CONNECTION_ID.",
                    changes: []
                };
            }
        }
        // Apply updates if needed
        if (updateParams.messagingProfileId || updateParams.connectionId) {
            const updateResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateNumber"])(updateParams);
            if (!updateResult.success) {
                return {
                    success: false,
                    fixed: false,
                    error: updateResult.error || "Failed to update phone number",
                    changes
                };
            }
        }
        return {
            success: true,
            fixed: changes.length > 0,
            changes
        };
    } catch (error) {
        return {
            success: false,
            fixed: false,
            error: error instanceof Error ? error.message : "Unknown error",
            changes
        };
    }
}
async function verifySmsCapability(phoneNumber) {
    const status = await verifyPhoneNumber(phoneNumber);
    if (!status.exists) {
        return {
            hasSms: false,
            error: "Phone number not found in Telnyx"
        };
    }
    if (!status.capabilities.sms) {
        return {
            hasSms: false,
            error: "Phone number does not have SMS capability"
        };
    }
    if (!status.hasMessagingProfile) {
        return {
            hasSms: false,
            error: "Phone number is not associated with a messaging profile"
        };
    }
    return {
        hasSms: true
    };
}
async function verifyVoiceCapability(phoneNumber) {
    const status = await verifyPhoneNumber(phoneNumber);
    if (!status.exists) {
        return {
            hasVoice: false,
            error: "Phone number not found in Telnyx"
        };
    }
    if (!status.capabilities.voice) {
        return {
            hasVoice: false,
            error: "Phone number does not have voice capability"
        };
    }
    if (!status.hasConnection) {
        return {
            hasVoice: false,
            error: "Phone number is not associated with a connection"
        };
    }
    return {
        hasVoice: true
    };
}
}),
"[project]/apps/web/src/lib/telnyx/provision-company.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureCompanyTelnyxSetup",
    ()=>ensureCompanyTelnyxSetup,
    "fetchCompanyTelnyxSettings",
    ()=>fetchCompanyTelnyxSettings,
    "purchaseAdditionalNumbers",
    ()=>purchaseAdditionalNumbers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/numbers.ts [app-rsc] (ecmascript)");
;
;
const DEFAULT_FEATURES = [
    "sms",
    "mms",
    "voice"
];
const COMPANY_SETTINGS_TABLE = "company_telnyx_settings";
async function getBaseAppUrl() {
    const candidates = [
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.SITE_URL,
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.APP_URL
    ];
    for (const candidate of candidates){
        if (!candidate) continue;
        const trimmed = candidate.trim();
        if (!trimmed) continue;
        const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(trimmed);
        if (isLocal) {
            continue;
        }
        if (trimmed.startsWith("http")) {
            return trimmed.replace(/\/+$/, "");
        }
        return `https://${trimmed.replace(/\/+$/, "")}`;
    }
    return undefined;
}
async function buildCompanyWebhookUrl(companyId) {
    const base = await getBaseAppUrl();
    if (!base) {
        return undefined;
    }
    return `${base}/api/webhooks/telnyx?company=${companyId}`;
}
function formatDisplay(phoneNumber) {
    const digits = phoneNumber.replace(/[^0-9]/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
        return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phoneNumber;
}
async function ensurePhoneNumbersInserted(supabase, companyId, phoneNumbers, defaults) {
    if (phoneNumbers.length === 0) {
        return;
    }
    for (const number of phoneNumbers){
        const digits = number.phoneNumber.replace(/[^0-9]/g, "");
        const e164 = digits.startsWith("+") ? digits : digits.startsWith("1") && digits.length === 11 ? `+${digits}` : `+1${digits}`;
        const row = {
            company_id: companyId,
            phone_number: e164,
            formatted_number: formatDisplay(e164),
            area_code: number.areaCode || e164.slice(2, 5),
            country_code: number.countryCode || "US",
            number_type: number.numberType || "local",
            status: "active",
            features: DEFAULT_FEATURES,
            telnyx_phone_number_id: number.telnyxPhoneNumberId || null,
            telnyx_messaging_profile_id: defaults.messagingProfileId,
            telnyx_connection_id: defaults.connectionId
        };
        const { data: existing } = await supabase.from("phone_numbers").select("id").eq("company_id", companyId).eq("phone_number", e164).maybeSingle();
        if (existing?.id) {
            await supabase.from("phone_numbers").update(row).eq("id", existing.id);
        } else {
            await supabase.from("phone_numbers").insert(row);
        }
    }
}
async function createMessagingProfile(companyName, webhookUrl) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].messagingProfiles.create({
        name: `${companyName} - Thorbis`,
        enabled: true,
        webhook_url: webhookUrl,
        webhook_api_version: "2"
    });
    return response.data;
}
async function createCallControlApplication(companyName, webhookUrl) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].callControlApplications.create({
        application_name: `${companyName} - Thorbis`,
        webhook_event_url: webhookUrl,
        webhook_api_version: "2",
        answering_machine_detection: "premium"
    });
    return response.data;
}
async function purchaseNumbers(companyId, options) {
    const search = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchAvailableNumbers"])({
        areaCode: options.areaCode,
        features: options.features || DEFAULT_FEATURES,
        limit: Math.max(options.quantity * 2, options.quantity)
    });
    if (!search.success || !search.data || search.data.length === 0) {
        throw new Error("No available phone numbers found for requested criteria");
    }
    const purchased = [];
    const candidates = search.data;
    for (const candidate of candidates){
        if (purchased.length >= options.quantity) {
            break;
        }
        const number = candidate.phone_number;
        const purchaseResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["purchaseNumber"])({
            phoneNumber: number,
            messagingProfileId: options.messagingProfileId,
            connectionId: options.connectionId,
            customerReference: `company:${companyId}`
        });
        if (!purchaseResult.success) {
            throw new Error(purchaseResult.error || `Failed to purchase number ${number} from Telnyx`);
        }
        purchased.push({
            phoneNumber: number,
            areaCode: candidate.national_destination_code || candidate.area_code,
            telnyxPhoneNumberId: candidate.id || candidate.phone_number,
            numberType: candidate.number_type
        });
    }
    if (purchased.length === 0) {
        throw new Error("Failed to purchase any phone numbers");
    }
    // Enable messaging on all purchased numbers
    for (const number of purchased){
        if (number.telnyxPhoneNumberId) {
            try {
                const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
                if (!TELNYX_API_KEY) {
                    throw new Error("TELNYX_API_KEY not configured");
                }
                await fetch(`https://api.telnyx.com/v2/phone_numbers/${number.telnyxPhoneNumberId}/messaging`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TELNYX_API_KEY}`
                    },
                    body: JSON.stringify({
                        messaging_profile_id: options.messagingProfileId
                    })
                });
            } catch (error) {
                // Log but don't fail - messaging can be enabled later
                console.warn(`Failed to enable messaging on ${number.phoneNumber}:`, error);
            }
        }
    }
    return purchased;
}
async function fetchCompanyTelnyxSettings(supabase, companyId) {
    const { data } = await supabase.from(COMPANY_SETTINGS_TABLE).select("*").eq("company_id", companyId).maybeSingle();
    return data ?? null;
}
async function ensureCompanyTelnyxSetup(options) {
    const { supabase, companyId } = options;
    const log = [];
    const existing = await fetchCompanyTelnyxSettings(supabase, companyId);
    if (existing && existing.status === "ready" && existing.messaging_profile_id && existing.call_control_application_id) {
        log.push("Existing Telnyx configuration found");
        return {
            success: true,
            settings: existing,
            log
        };
    }
    const { data: company } = await supabase.from("companies").select("id, name").eq("id", companyId).maybeSingle();
    if (!company) {
        return {
            success: false,
            error: "Company not found",
            log
        };
    }
    const webhookUrl = await buildCompanyWebhookUrl(companyId);
    if (!webhookUrl) {
        return {
            success: false,
            error: "NEXT_PUBLIC_SITE_URL must be configured with a public URL to provision Telnyx resources",
            log
        };
    }
    try {
        log.push("Creating messaging profile");
        const messagingProfile = await createMessagingProfile(company.name || "Company", webhookUrl);
        const messagingProfileId = messagingProfile?.id;
        log.push("Creating call control application");
        const callApplication = await createCallControlApplication(company.name || "Company", webhookUrl);
        const connectionId = callApplication?.id;
        if (!messagingProfileId || !connectionId) {
            throw new Error("Failed to provision messaging profile or call control application");
        }
        log.push("Purchasing phone numbers");
        const purchasedNumbers = await purchaseNumbers(companyId, {
            quantity: Math.max(options.numberQuantity || 1, 1),
            areaCode: options.areaCode,
            features: options.features || DEFAULT_FEATURES,
            messagingProfileId,
            connectionId
        });
        await ensurePhoneNumbersInserted(supabase, companyId, purchasedNumbers, {
            messagingProfileId,
            connectionId
        });
        const defaultNumber = purchasedNumbers.find((n)=>n.numberType === "toll-free") || purchasedNumbers[0];
        const upsertResult = await supabase.from(COMPANY_SETTINGS_TABLE).upsert({
            company_id: companyId,
            status: "ready",
            messaging_profile_id: messagingProfileId,
            call_control_application_id: connectionId,
            default_outbound_number: defaultNumber?.phoneNumber || null,
            default_outbound_phone_number_id: defaultNumber?.telnyxPhoneNumberId || null,
            metadata: {
                log,
                purchased_numbers: purchasedNumbers.map((n)=>n.phoneNumber)
            },
            last_provisioned_at: new Date().toISOString()
        }, {
            onConflict: "company_id"
        }).select("*").single();
        return {
            success: true,
            settings: upsertResult.data,
            log
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to provision Telnyx resources",
            log
        };
    }
}
async function purchaseAdditionalNumbers(options) {
    const { supabase, companyId, quantity } = options;
    const log = [];
    const settings = await fetchCompanyTelnyxSettings(supabase, companyId);
    if (!settings || settings.status !== "ready" || !settings.messaging_profile_id || !settings.call_control_application_id) {
        return {
            success: false,
            error: "Company Telnyx configuration is not ready. Run ensureCompanyTelnyxSetup first.",
            log
        };
    }
    try {
        log.push(`Purchasing ${quantity} additional numbers`);
        const purchasedNumbers = await purchaseNumbers(companyId, {
            quantity,
            areaCode: options.areaCode,
            features: options.features || DEFAULT_FEATURES,
            messagingProfileId: settings.messaging_profile_id,
            connectionId: settings.call_control_application_id
        });
        await ensurePhoneNumbersInserted(supabase, companyId, purchasedNumbers, {
            messagingProfileId: settings.messaging_profile_id,
            connectionId: settings.call_control_application_id
        });
        // Prefer toll-free numbers as the default outbound if available
        const tollFreeNumber = purchasedNumbers.find((n)=>n.numberType === "toll-free");
        if (tollFreeNumber && settings.default_outbound_number !== tollFreeNumber.phoneNumber) {
            await supabase.from(COMPANY_SETTINGS_TABLE).update({
                default_outbound_number: tollFreeNumber.phoneNumber,
                default_outbound_phone_number_id: tollFreeNumber.telnyxPhoneNumberId || null
            }).eq("company_id", companyId);
        }
        return {
            success: true,
            settings,
            log
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to purchase phone numbers",
            log
        };
    }
}
}),
"[project]/apps/web/src/lib/telnyx/rate-limiter.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Rate Limiter
 *
 * Implements token bucket algorithm with per-company and per-endpoint
 * rate limiting to prevent API rate limit errors.
 */ __turbopack_context__.s([
    "RATE_LIMIT_CONFIGS",
    ()=>RATE_LIMIT_CONFIGS,
    "acquireRateLimit",
    ()=>acquireRateLimit,
    "checkRateLimit",
    ()=>checkRateLimit,
    "getRateLimitStatus",
    ()=>getRateLimitStatus,
    "handle429Response",
    ()=>handle429Response,
    "processBatchWithRateLimit",
    ()=>processBatchWithRateLimit,
    "resetRateLimits",
    ()=>resetRateLimits,
    "withRateLimit",
    ()=>withRateLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/retry.ts [app-rsc] (ecmascript)");
;
;
const RATE_LIMIT_CONFIGS = {
    // General API: 100 requests per minute
    default: {
        maxTokens: 100,
        refillRate: 100 / 60,
        refillInterval: 1000
    },
    // SMS: 1 message per second per number (aggregate)
    sms: {
        maxTokens: 60,
        refillRate: 1,
        refillInterval: 1000
    },
    // Voice: more relaxed
    voice: {
        maxTokens: 30,
        refillRate: 0.5,
        refillInterval: 1000
    },
    // Lookup: can be higher
    lookup: {
        maxTokens: 200,
        refillRate: 200 / 60,
        refillInterval: 1000
    },
    // Webhook (incoming): protect against floods
    webhook: {
        maxTokens: 1000,
        refillRate: 100,
        refillInterval: 1000
    }
};
// =============================================================================
// TOKEN BUCKET IMPLEMENTATION
// =============================================================================
class TokenBucketLimiter {
    buckets = new Map();
    processingQueue = new Map();
    /**
	 * Get or create a bucket for a key
	 */ getBucket(key, config) {
        if (!this.buckets.has(key)) {
            this.buckets.set(key, {
                tokens: config.maxTokens,
                lastRefill: Date.now(),
                queue: []
            });
        }
        return this.buckets.get(key);
    }
    /**
	 * Refill tokens based on elapsed time
	 */ refillTokens(bucket, config) {
        const now = Date.now();
        const elapsed = now - bucket.lastRefill;
        const intervalsElapsed = Math.floor(elapsed / config.refillInterval);
        if (intervalsElapsed > 0) {
            const tokensToAdd = intervalsElapsed * config.refillRate;
            bucket.tokens = Math.min(config.maxTokens, bucket.tokens + tokensToAdd);
            bucket.lastRefill = now;
        }
    }
    /**
	 * Process queued requests
	 */ async processQueue(key, config) {
        if (this.processingQueue.get(key)) return;
        this.processingQueue.set(key, true);
        const bucket = this.getBucket(key, config);
        while(bucket.queue.length > 0){
            this.refillTokens(bucket, config);
            if (bucket.tokens >= 1) {
                const request = bucket.queue.shift();
                if (request) {
                    bucket.tokens -= 1;
                    const waitTime = Date.now() - request.requestedAt;
                    request.resolve({
                        allowed: true,
                        remainingTokens: bucket.tokens,
                        waitTime
                    });
                }
            } else {
                // Calculate time until next token
                const timeUntilToken = config.refillInterval / config.refillRate;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(Math.ceil(timeUntilToken));
            }
        }
        this.processingQueue.set(key, false);
    }
    /**
	 * Attempt to acquire a token (immediate, no queue)
	 */ tryAcquire(key, config = RATE_LIMIT_CONFIGS.default) {
        const bucket = this.getBucket(key, config);
        this.refillTokens(bucket, config);
        if (bucket.tokens >= 1) {
            bucket.tokens -= 1;
            return {
                allowed: true,
                remainingTokens: bucket.tokens
            };
        }
        // Calculate retry after
        const timeUntilToken = Math.ceil(config.refillInterval / config.refillRate);
        return {
            allowed: false,
            remainingTokens: 0,
            retryAfterMs: timeUntilToken
        };
    }
    /**
	 * Acquire a token, waiting in queue if necessary
	 */ async acquire(key, config = RATE_LIMIT_CONFIGS.default, maxWaitMs = 30000) {
        // Try immediate acquisition
        const immediate = this.tryAcquire(key, config);
        if (immediate.allowed) {
            return immediate;
        }
        // Queue the request
        const bucket = this.getBucket(key, config);
        return new Promise((resolve, reject)=>{
            const requestedAt = Date.now();
            const timeoutId = setTimeout(()=>{
                // Remove from queue on timeout
                const index = bucket.queue.findIndex((r)=>r.requestedAt === requestedAt);
                if (index !== -1) {
                    bucket.queue.splice(index, 1);
                }
                resolve({
                    allowed: false,
                    remainingTokens: 0,
                    retryAfterMs: maxWaitMs
                });
            }, maxWaitMs);
            bucket.queue.push({
                resolve: (result)=>{
                    clearTimeout(timeoutId);
                    resolve(result);
                },
                requestedAt
            });
            // Start processing queue
            this.processQueue(key, config);
        });
    }
    /**
	 * Get current bucket status
	 */ getStatus(key, config = RATE_LIMIT_CONFIGS.default) {
        const bucket = this.getBucket(key, config);
        this.refillTokens(bucket, config);
        return {
            tokens: Math.floor(bucket.tokens),
            maxTokens: config.maxTokens,
            queueLength: bucket.queue.length,
            utilizationPercent: Math.round((config.maxTokens - bucket.tokens) / config.maxTokens * 100)
        };
    }
    /**
	 * Reset a bucket (for testing)
	 */ reset(key) {
        this.buckets.delete(key);
    }
    /**
	 * Reset all buckets
	 */ resetAll() {
        this.buckets.clear();
    }
}
// =============================================================================
// RATE LIMITER INSTANCES
// =============================================================================
// Global rate limiter
const globalLimiter = new TokenBucketLimiter();
// Per-company rate limiters
const companyLimiters = new Map();
function getCompanyLimiter(companyId) {
    if (!companyLimiters.has(companyId)) {
        companyLimiters.set(companyId, new TokenBucketLimiter());
    }
    return companyLimiters.get(companyId);
}
function checkRateLimit(endpoint = "default", companyId) {
    const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;
    // Check global rate limit
    const globalKey = `global:${endpoint}`;
    const globalResult = globalLimiter.tryAcquire(globalKey, config);
    if (!globalResult.allowed) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Global rate limit hit", {
            endpoint,
            retryAfterMs: globalResult.retryAfterMs
        });
        return globalResult;
    }
    // Check per-company rate limit if provided
    if (companyId) {
        const companyLimiter = getCompanyLimiter(companyId);
        const companyResult = companyLimiter.tryAcquire(endpoint, config);
        if (!companyResult.allowed) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Company rate limit hit", {
                endpoint,
                companyId,
                retryAfterMs: companyResult.retryAfterMs
            });
            return companyResult;
        }
    }
    return globalResult;
}
async function acquireRateLimit(endpoint = "default", companyId, maxWaitMs = 30000) {
    const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;
    // Acquire global token
    const globalKey = `global:${endpoint}`;
    const globalResult = await globalLimiter.acquire(globalKey, config, maxWaitMs);
    if (!globalResult.allowed) {
        return globalResult;
    }
    // Acquire per-company token if provided
    if (companyId) {
        const companyLimiter = getCompanyLimiter(companyId);
        const companyResult = await companyLimiter.acquire(endpoint, config, maxWaitMs);
        if (!companyResult.allowed) {
            return companyResult;
        }
        // Return the longer wait time
        return {
            ...companyResult,
            waitTime: Math.max(globalResult.waitTime || 0, companyResult.waitTime || 0)
        };
    }
    return globalResult;
}
function withRateLimit(fn, options = {}) {
    const { endpoint = "default", companyId, maxWaitMs = 30000, correlationId } = options;
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await acquireRateLimit(endpoint, companyId, maxWaitMs);
            if (!result.allowed) {
                const error = new Error(`Rate limit exceeded. Retry after ${result.retryAfterMs}ms`);
                error.code = "RATE_LIMIT_EXCEEDED";
                error.retryAfterMs = result.retryAfterMs;
                reject(error);
                return;
            }
            if (result.waitTime && result.waitTime > 100) {
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("Request waited for rate limit", {
                    endpoint,
                    companyId,
                    waitTime: result.waitTime,
                    correlationId
                });
            }
            const response = await fn();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}
function getRateLimitStatus(endpoint, companyId) {
    const endpoints = endpoint ? [
        endpoint
    ] : Object.keys(RATE_LIMIT_CONFIGS);
    const global = {};
    for (const ep of endpoints){
        const config = RATE_LIMIT_CONFIGS[ep];
        global[ep] = globalLimiter.getStatus(`global:${ep}`, config);
    }
    let company;
    if (companyId) {
        const limiter = companyLimiters.get(companyId);
        if (limiter) {
            company = {};
            for (const ep of endpoints){
                const config = RATE_LIMIT_CONFIGS[ep];
                company[ep] = limiter.getStatus(ep, config);
            }
        }
    }
    return {
        global,
        company
    };
}
function resetRateLimits(companyId) {
    if (companyId) {
        companyLimiters.delete(companyId);
    } else {
        globalLimiter.resetAll();
        companyLimiters.clear();
    }
}
async function processBatchWithRateLimit(items, processor, options) {
    const { endpoint, companyId, batchSize = 10, batchDelayMs = 1000 } = options;
    const results = [];
    for(let i = 0; i < items.length; i += batchSize){
        const batch = items.slice(i, i + batchSize);
        // Process batch with rate limiting
        const batchResults = await Promise.all(batch.map(async (item)=>{
            try {
                const result = await withRateLimit(()=>processor(item), {
                    endpoint,
                    companyId
                });
                return {
                    item,
                    result
                };
            } catch (error) {
                return {
                    item,
                    error: error instanceof Error ? error : new Error(String(error))
                };
            }
        }));
        results.push(...batchResults);
        // Delay between batches
        if (i + batchSize < items.length) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(batchDelayMs);
        }
    }
    return results;
}
function handle429Response(response) {
    const retryAfter = response.headers.get("Retry-After");
    let retryAfterMs = 60000; // Default 60 seconds
    if (retryAfter) {
        // Check if it's a number (seconds)
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds)) {
            retryAfterMs = seconds * 1000;
        } else {
            // Try parsing as a date
            const date = Date.parse(retryAfter);
            if (!isNaN(date)) {
                retryAfterMs = Math.max(0, date - Date.now());
            }
        }
    }
    // Don't retry if wait is too long (> 5 minutes)
    const shouldRetry = retryAfterMs <= 300000;
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Rate limit response received", {
        retryAfterMs,
        shouldRetry
    });
    return {
        retryAfterMs,
        shouldRetry
    };
}
}),
"[project]/apps/web/src/lib/telnyx/errors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Custom Error Classes
 *
 * Provides typed error classes for different failure scenarios
 * with error codes, metadata, and retry information.
 */ // =============================================================================
// ERROR CODES
// =============================================================================
__turbopack_context__.s([
    "TelnyxAuthError",
    ()=>TelnyxAuthError,
    "TelnyxCallError",
    ()=>TelnyxCallError,
    "TelnyxCircuitBreakerError",
    ()=>TelnyxCircuitBreakerError,
    "TelnyxError",
    ()=>TelnyxError,
    "TelnyxErrorCode",
    ()=>TelnyxErrorCode,
    "TelnyxNetworkError",
    ()=>TelnyxNetworkError,
    "TelnyxPhoneNumberError",
    ()=>TelnyxPhoneNumberError,
    "TelnyxRateLimitError",
    ()=>TelnyxRateLimitError,
    "TelnyxSmsError",
    ()=>TelnyxSmsError,
    "TelnyxTimeoutError",
    ()=>TelnyxTimeoutError,
    "TelnyxValidationError",
    ()=>TelnyxValidationError,
    "TelnyxWebhookError",
    ()=>TelnyxWebhookError,
    "createErrorFromException",
    ()=>createErrorFromException,
    "createErrorFromResponse",
    ()=>createErrorFromResponse,
    "isRetryableError",
    ()=>isRetryableError,
    "isTelnyxError",
    ()=>isTelnyxError,
    "wrapError",
    ()=>wrapError
]);
var TelnyxErrorCode = /*#__PURE__*/ function(TelnyxErrorCode) {
    // Network errors
    TelnyxErrorCode["NETWORK_ERROR"] = "TELNYX_NETWORK_ERROR";
    TelnyxErrorCode["TIMEOUT"] = "TELNYX_TIMEOUT";
    TelnyxErrorCode["CONNECTION_REFUSED"] = "TELNYX_CONNECTION_REFUSED";
    // Authentication errors
    TelnyxErrorCode["INVALID_API_KEY"] = "TELNYX_INVALID_API_KEY";
    TelnyxErrorCode["UNAUTHORIZED"] = "TELNYX_UNAUTHORIZED";
    TelnyxErrorCode["FORBIDDEN"] = "TELNYX_FORBIDDEN";
    // Rate limiting
    TelnyxErrorCode["RATE_LIMIT_EXCEEDED"] = "TELNYX_RATE_LIMIT_EXCEEDED";
    // Validation errors
    TelnyxErrorCode["INVALID_PHONE_NUMBER"] = "TELNYX_INVALID_PHONE_NUMBER";
    TelnyxErrorCode["INVALID_REQUEST"] = "TELNYX_INVALID_REQUEST";
    TelnyxErrorCode["MISSING_REQUIRED_FIELD"] = "TELNYX_MISSING_REQUIRED_FIELD";
    // Resource errors
    TelnyxErrorCode["NOT_FOUND"] = "TELNYX_NOT_FOUND";
    TelnyxErrorCode["RESOURCE_CONFLICT"] = "TELNYX_RESOURCE_CONFLICT";
    // Provider errors
    TelnyxErrorCode["PROVIDER_ERROR"] = "TELNYX_PROVIDER_ERROR";
    TelnyxErrorCode["CARRIER_ERROR"] = "TELNYX_CARRIER_ERROR";
    TelnyxErrorCode["DELIVERY_FAILED"] = "TELNYX_DELIVERY_FAILED";
    // Call-specific errors
    TelnyxErrorCode["CALL_REJECTED"] = "TELNYX_CALL_REJECTED";
    TelnyxErrorCode["CALL_BUSY"] = "TELNYX_CALL_BUSY";
    TelnyxErrorCode["CALL_NO_ANSWER"] = "TELNYX_CALL_NO_ANSWER";
    TelnyxErrorCode["CALL_FAILED"] = "TELNYX_CALL_FAILED";
    // SMS-specific errors
    TelnyxErrorCode["SMS_DELIVERY_FAILED"] = "TELNYX_SMS_DELIVERY_FAILED";
    TelnyxErrorCode["SMS_BLOCKED"] = "TELNYX_SMS_BLOCKED";
    TelnyxErrorCode["SMS_SPAM_DETECTED"] = "TELNYX_SMS_SPAM_DETECTED";
    // Webhook errors
    TelnyxErrorCode["WEBHOOK_VALIDATION_FAILED"] = "TELNYX_WEBHOOK_VALIDATION_FAILED";
    TelnyxErrorCode["WEBHOOK_SIGNATURE_INVALID"] = "TELNYX_WEBHOOK_SIGNATURE_INVALID";
    TelnyxErrorCode["WEBHOOK_TIMESTAMP_INVALID"] = "TELNYX_WEBHOOK_TIMESTAMP_INVALID";
    TelnyxErrorCode["WEBHOOK_REPLAY_DETECTED"] = "TELNYX_WEBHOOK_REPLAY_DETECTED";
    // Circuit breaker
    TelnyxErrorCode["CIRCUIT_BREAKER_OPEN"] = "TELNYX_CIRCUIT_BREAKER_OPEN";
    // Generic
    TelnyxErrorCode["UNKNOWN_ERROR"] = "TELNYX_UNKNOWN_ERROR";
    TelnyxErrorCode["INTERNAL_ERROR"] = "TELNYX_INTERNAL_ERROR";
    return TelnyxErrorCode;
}({});
class TelnyxError extends Error {
    code;
    metadata;
    timestamp;
    retryable;
    retryAfterMs;
    constructor(message, code = "TELNYX_UNKNOWN_ERROR", metadata = {}){
        super(message);
        this.name = "TelnyxError";
        this.code = code;
        this.metadata = metadata;
        this.timestamp = new Date();
        this.retryable = metadata.retryable ?? this.isRetryableCode(code);
        this.retryAfterMs = metadata.retryAfterMs;
        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TelnyxError);
        }
    }
    isRetryableCode(code) {
        const retryableCodes = [
            "TELNYX_NETWORK_ERROR",
            "TELNYX_TIMEOUT",
            "TELNYX_CONNECTION_REFUSED",
            "TELNYX_RATE_LIMIT_EXCEEDED",
            "TELNYX_PROVIDER_ERROR",
            "TELNYX_INTERNAL_ERROR"
        ];
        return retryableCodes.includes(code);
    }
    /**
	 * Convert to JSON for logging/serialization
	 */ toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            metadata: this.metadata,
            timestamp: this.timestamp.toISOString(),
            retryable: this.retryable,
            retryAfterMs: this.retryAfterMs,
            stack: this.stack
        };
    }
    /**
	 * Create a user-friendly error message
	 */ toUserMessage() {
        switch(this.code){
            case "TELNYX_INVALID_PHONE_NUMBER":
                return "The phone number provided is invalid. Please check and try again.";
            case "TELNYX_RATE_LIMIT_EXCEEDED":
                return "Too many requests. Please wait a moment and try again.";
            case "TELNYX_CALL_BUSY":
                return "The number is busy. Please try again later.";
            case "TELNYX_CALL_NO_ANSWER":
                return "No answer. The call was not picked up.";
            case "TELNYX_SMS_BLOCKED":
                return "Message could not be delivered. The recipient may have blocked messages.";
            case "TELNYX_UNAUTHORIZED":
            case "TELNYX_INVALID_API_KEY":
                return "Authentication failed. Please contact support.";
            case "TELNYX_NETWORK_ERROR":
            case "TELNYX_TIMEOUT":
                return "Connection issue. Please try again.";
            default:
                return "An error occurred. Please try again or contact support.";
        }
    }
}
class TelnyxNetworkError extends TelnyxError {
    constructor(message, metadata = {}){
        super(message, "TELNYX_NETWORK_ERROR", {
            ...metadata,
            retryable: true
        });
        this.name = "TelnyxNetworkError";
    }
}
class TelnyxTimeoutError extends TelnyxError {
    timeoutMs;
    constructor(message, timeoutMs, metadata = {}){
        super(message, "TELNYX_TIMEOUT", {
            ...metadata,
            retryable: true
        });
        this.name = "TelnyxTimeoutError";
        this.timeoutMs = timeoutMs;
    }
}
class TelnyxRateLimitError extends TelnyxError {
    constructor(message, retryAfterMs, metadata = {}){
        super(message, "TELNYX_RATE_LIMIT_EXCEEDED", {
            ...metadata,
            retryable: true,
            retryAfterMs
        });
        this.name = "TelnyxRateLimitError";
    }
}
class TelnyxAuthError extends TelnyxError {
    constructor(message, metadata = {}){
        const code = metadata.statusCode === 403 ? "TELNYX_FORBIDDEN" : "TELNYX_UNAUTHORIZED";
        super(message, code, {
            ...metadata,
            retryable: false
        });
        this.name = "TelnyxAuthError";
    }
}
class TelnyxValidationError extends TelnyxError {
    field;
    validationDetails;
    constructor(message, metadata = {}){
        super(message, "TELNYX_INVALID_REQUEST", {
            ...metadata,
            retryable: false
        });
        this.name = "TelnyxValidationError";
        this.field = metadata.field;
        this.validationDetails = metadata.validationDetails;
    }
}
class TelnyxPhoneNumberError extends TelnyxError {
    phoneNumber;
    constructor(message, phoneNumber, metadata = {}){
        super(message, "TELNYX_INVALID_PHONE_NUMBER", {
            ...metadata,
            phoneNumber,
            retryable: false
        });
        this.name = "TelnyxPhoneNumberError";
        this.phoneNumber = phoneNumber;
    }
}
class TelnyxWebhookError extends TelnyxError {
    constructor(message, code = "TELNYX_WEBHOOK_VALIDATION_FAILED", metadata = {}){
        super(message, code, {
            ...metadata,
            retryable: false
        });
        this.name = "TelnyxWebhookError";
    }
}
class TelnyxCircuitBreakerError extends TelnyxError {
    endpoint;
    constructor(endpoint, metadata = {}){
        super(`Circuit breaker is open for endpoint: ${endpoint}`, "TELNYX_CIRCUIT_BREAKER_OPEN", {
            ...metadata,
            endpoint,
            retryable: false
        });
        this.name = "TelnyxCircuitBreakerError";
        this.endpoint = endpoint;
    }
}
class TelnyxCallError extends TelnyxError {
    callControlId;
    constructor(message, code, metadata = {}){
        super(message, code, metadata);
        this.name = "TelnyxCallError";
        this.callControlId = metadata.callControlId;
    }
}
class TelnyxSmsError extends TelnyxError {
    messageSid;
    constructor(message, code, metadata = {}){
        super(message, code, metadata);
        this.name = "TelnyxSmsError";
        this.messageSid = metadata.messageSid;
    }
}
function createErrorFromResponse(statusCode, body, metadata = {}) {
    const errorBody = body;
    const errorDetail = errorBody?.errors?.[0]?.detail || errorBody?.error || errorBody?.message || "Unknown error";
    const telnyxErrorCode = errorBody?.errors?.[0]?.code;
    const fullMetadata = {
        ...metadata,
        statusCode,
        telnyxErrorCode,
        telnyxErrorDetail: errorDetail
    };
    switch(statusCode){
        case 400:
            return new TelnyxValidationError(errorDetail, fullMetadata);
        case 401:
            return new TelnyxAuthError("Invalid API key or unauthorized", fullMetadata);
        case 403:
            return new TelnyxAuthError("Access forbidden", fullMetadata);
        case 404:
            return new TelnyxError("Resource not found", "TELNYX_NOT_FOUND", {
                ...fullMetadata,
                retryable: false
            });
        case 409:
            return new TelnyxError("Resource conflict", "TELNYX_RESOURCE_CONFLICT", {
                ...fullMetadata,
                retryable: false
            });
        case 429:
            const retryAfter = parseInt(body?.retry_after || "60", 10) * 1000;
            return new TelnyxRateLimitError("Rate limit exceeded", retryAfter, fullMetadata);
        case 500:
        case 502:
        case 503:
        case 504:
            return new TelnyxError("Telnyx service error", "TELNYX_PROVIDER_ERROR", {
                ...fullMetadata,
                retryable: true
            });
        default:
            return new TelnyxError(errorDetail, "TELNYX_UNKNOWN_ERROR", fullMetadata);
    }
}
function createErrorFromException(error, metadata = {}) {
    if (error instanceof TelnyxError) {
        return error;
    }
    const originalError = error instanceof Error ? error : new Error(String(error));
    const errorCode = originalError.code;
    const fullMetadata = {
        ...metadata,
        originalError
    };
    // Check for specific error types
    if (originalError.name === "AbortError" || originalError.message.includes("timeout")) {
        return new TelnyxTimeoutError("Request timed out", metadata.timeout || 30000, fullMetadata);
    }
    if (errorCode === "ECONNRESET" || errorCode === "ECONNREFUSED" || errorCode === "ENOTFOUND" || errorCode === "ENETUNREACH" || originalError.message.includes("fetch failed") || originalError.message.includes("network")) {
        return new TelnyxNetworkError(`Network error: ${originalError.message}`, fullMetadata);
    }
    return new TelnyxError(originalError.message, "TELNYX_UNKNOWN_ERROR", fullMetadata);
}
function isTelnyxError(error) {
    return error instanceof TelnyxError;
}
function isRetryableError(error) {
    if (error instanceof TelnyxError) {
        return error.retryable;
    }
    // Check for network errors
    if (error instanceof Error) {
        const errorCode = error.code;
        const retryableErrorCodes = [
            "ECONNRESET",
            "ETIMEDOUT",
            "ECONNREFUSED",
            "EPIPE",
            "ENOTFOUND",
            "ENETUNREACH",
            "EAI_AGAIN"
        ];
        if (errorCode && retryableErrorCodes.includes(errorCode)) {
            return true;
        }
    }
    return false;
}
function wrapError(error, metadata = {}) {
    if (error instanceof TelnyxError) {
        // Merge metadata
        return new TelnyxError(error.message, error.code, {
            ...error.metadata,
            ...metadata
        });
    }
    return createErrorFromException(error, metadata);
}
}),
"[project]/apps/web/src/lib/telnyx/metrics.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Metrics & Monitoring
 *
 * Tracks API performance, error rates, and usage statistics.
 */ __turbopack_context__.s([
    "formatMetricsForLogging",
    ()=>formatMetricsForLogging,
    "getMetricsSummary",
    ()=>getMetricsSummary,
    "startRequestTimer",
    ()=>startRequestTimer,
    "telnyxMetrics",
    ()=>telnyxMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)");
;
// =============================================================================
// METRICS COLLECTOR
// =============================================================================
class MetricsCollector {
    requests = [];
    operations = {
        smsSent: 0,
        smsDelivered: 0,
        smsFailed: 0,
        callsInitiated: 0,
        callsCompleted: 0,
        callsFailed: 0,
        webhooksReceived: 0,
        webhooksProcessed: 0,
        webhooksFailed: 0
    };
    retentionMs = 60 * 60 * 1000;
    maxEntries = 10000;
    cleanupInterval;
    constructor(){
        this.startCleanup();
    }
    /**
	 * Start periodic cleanup
	 */ startCleanup() {
        this.cleanupInterval = setInterval(()=>{
            this.cleanup();
        }, 60000); // Every minute
        if (this.cleanupInterval.unref) {
            this.cleanupInterval.unref();
        }
    }
    /**
	 * Clean up old metrics
	 */ cleanup() {
        const cutoff = Date.now() - this.retentionMs;
        const initialCount = this.requests.length;
        this.requests = this.requests.filter((r)=>r.timestamp.getTime() > cutoff);
        // Also trim if over max entries
        if (this.requests.length > this.maxEntries) {
            this.requests = this.requests.slice(-this.maxEntries);
        }
        const removed = initialCount - this.requests.length;
        if (removed > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("Metrics cleanup", {
                removed
            });
        }
    }
    /**
	 * Record a request
	 */ recordRequest(metrics) {
        this.requests.push(metrics);
        // Log slow requests
        if (metrics.latencyMs > 2000) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("Slow request detected", {
                endpoint: metrics.endpoint,
                latencyMs: metrics.latencyMs,
                correlationId: metrics.correlationId
            });
        }
    }
    /**
	 * Record SMS sent
	 */ recordSmsSent(success) {
        this.operations.smsSent++;
        if (!success) {
            this.operations.smsFailed++;
        }
    }
    /**
	 * Record SMS delivered
	 */ recordSmsDelivered() {
        this.operations.smsDelivered++;
    }
    /**
	 * Record call initiated
	 */ recordCallInitiated(success) {
        this.operations.callsInitiated++;
        if (!success) {
            this.operations.callsFailed++;
        }
    }
    /**
	 * Record call completed
	 */ recordCallCompleted() {
        this.operations.callsCompleted++;
    }
    /**
	 * Record webhook received
	 */ recordWebhook(processed) {
        this.operations.webhooksReceived++;
        if (processed) {
            this.operations.webhooksProcessed++;
        } else {
            this.operations.webhooksFailed++;
        }
    }
    /**
	 * Get aggregated metrics for a time window
	 */ getAggregatedMetrics(windowMs = 5 * 60 * 1000) {
        const cutoff = Date.now() - windowMs;
        const filtered = this.requests.filter((r)=>r.timestamp.getTime() > cutoff);
        const successfulRequests = filtered.filter((r)=>r.success).length;
        const failedRequests = filtered.length - successfulRequests;
        const latencies = filtered.map((r)=>r.latencyMs).sort((a, b)=>a - b);
        // Calculate percentiles
        const getPercentile = (arr, p)=>{
            if (arr.length === 0) return 0;
            const index = Math.ceil(p / 100 * arr.length) - 1;
            return arr[Math.max(0, index)];
        };
        // Group by endpoint
        const byEndpoint = {};
        for (const r of filtered){
            if (!byEndpoint[r.endpoint]) {
                byEndpoint[r.endpoint] = {
                    count: 0,
                    errors: 0,
                    totalLatency: 0
                };
            }
            byEndpoint[r.endpoint].count++;
            byEndpoint[r.endpoint].totalLatency += r.latencyMs;
            if (!r.success) {
                byEndpoint[r.endpoint].errors++;
            }
        }
        // Group by status code
        const byStatusCode = {};
        for (const r of filtered){
            byStatusCode[r.statusCode] = (byStatusCode[r.statusCode] || 0) + 1;
        }
        return {
            totalRequests: filtered.length,
            successfulRequests,
            failedRequests,
            errorRate: filtered.length > 0 ? failedRequests / filtered.length : 0,
            latency: {
                p50: getPercentile(latencies, 50),
                p95: getPercentile(latencies, 95),
                p99: getPercentile(latencies, 99),
                avg: latencies.length > 0 ? latencies.reduce((a, b)=>a + b, 0) / latencies.length : 0,
                min: latencies[0] || 0,
                max: latencies[latencies.length - 1] || 0
            },
            byEndpoint: Object.fromEntries(Object.entries(byEndpoint).map(([ep, data])=>[
                    ep,
                    {
                        count: data.count,
                        errors: data.errors,
                        avgLatency: data.totalLatency / data.count
                    }
                ])),
            byStatusCode
        };
    }
    /**
	 * Get operation metrics
	 */ getOperationMetrics() {
        return {
            ...this.operations
        };
    }
    /**
	 * Get health score (0-100)
	 */ getHealthScore(windowMs = 5 * 60 * 1000) {
        const metrics = this.getAggregatedMetrics(windowMs);
        if (metrics.totalRequests === 0) {
            return 100; // No requests, assume healthy
        }
        // Factors:
        // - Error rate (weight: 50%)
        // - Latency (weight: 30%)
        // - 5xx errors (weight: 20%)
        // Error rate score (0 = 100%, 10%+ = 0)
        const errorScore = Math.max(0, 100 - metrics.errorRate * 1000);
        // Latency score (0ms = 100, 3000ms+ = 0)
        const latencyScore = Math.max(0, 100 - metrics.latency.p95 / 3000 * 100);
        // 5xx score
        const total5xx = Object.entries(metrics.byStatusCode).filter(([code])=>parseInt(code) >= 500).reduce((sum, [, count])=>sum + count, 0);
        const rate5xx = total5xx / metrics.totalRequests;
        const score5xx = Math.max(0, 100 - rate5xx * 1000);
        return Math.round(errorScore * 0.5 + latencyScore * 0.3 + score5xx * 0.2);
    }
    /**
	 * Reset metrics
	 */ reset() {
        this.requests = [];
        this.operations = {
            smsSent: 0,
            smsDelivered: 0,
            smsFailed: 0,
            callsInitiated: 0,
            callsCompleted: 0,
            callsFailed: 0,
            webhooksReceived: 0,
            webhooksProcessed: 0,
            webhooksFailed: 0
        };
    }
    /**
	 * Stop cleanup interval
	 */ stop() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}
const telnyxMetrics = new MetricsCollector();
function startRequestTimer(endpoint, method, companyId, correlationId) {
    const startTime = Date.now();
    return {
        end: (statusCode, success)=>{
            telnyxMetrics.recordRequest({
                endpoint,
                method,
                statusCode,
                latencyMs: Date.now() - startTime,
                success,
                timestamp: new Date(),
                companyId,
                correlationId
            });
        }
    };
}
function getMetricsSummary() {
    return {
        health: telnyxMetrics.getHealthScore(),
        metrics: telnyxMetrics.getAggregatedMetrics(),
        operations: telnyxMetrics.getOperationMetrics()
    };
}
function formatMetricsForLogging() {
    const summary = getMetricsSummary();
    const { metrics, operations, health } = summary;
    return [
        `Health Score: ${health}/100`,
        `Requests: ${metrics.totalRequests} (${metrics.failedRequests} failed)`,
        `Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%`,
        `Latency: p50=${metrics.latency.p50}ms p95=${metrics.latency.p95}ms`,
        `SMS: ${operations.smsSent} sent, ${operations.smsDelivered} delivered, ${operations.smsFailed} failed`,
        `Calls: ${operations.callsInitiated} initiated, ${operations.callsCompleted} completed`,
        `Webhooks: ${operations.webhooksReceived} received, ${operations.webhooksFailed} failed`
    ].join(" | ");
}
}),
"[project]/apps/web/src/lib/telnyx/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx API Client
 *
 * Production-ready API client with:
 * - Configurable timeouts
 * - Automatic retries with exponential backoff
 * - Rate limiting
 * - Circuit breaker protection
 * - Structured logging
 * - Metrics collection
 */ __turbopack_context__.s([
    "TIMEOUT_CONFIG",
    ()=>TIMEOUT_CONFIG,
    "telnyxDelete",
    ()=>telnyxDelete,
    "telnyxGet",
    ()=>telnyxGet,
    "telnyxLookupRequest",
    ()=>telnyxLookupRequest,
    "telnyxPatch",
    ()=>telnyxPatch,
    "telnyxPost",
    ()=>telnyxPost,
    "telnyxPut",
    ()=>telnyxPut,
    "telnyxRequest",
    ()=>telnyxRequest,
    "telnyxSmsRequest",
    ()=>telnyxSmsRequest,
    "telnyxVoiceRequest",
    ()=>telnyxVoiceRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/logger.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/retry.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/errors.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/metrics.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
// =============================================================================
// CONFIGURATION
// =============================================================================
const TELNYX_BASE_URL = "https://api.telnyx.com/v2";
const TELNYX_PUBLIC_BASE_URL = "https://api.telnyx.com";
const TIMEOUT_CONFIG = {
    default: 30000,
    sms: 10000,
    voice: 30000,
    lookup: 5000,
    webhook: 2000,
    balance: 5000
};
async function telnyxRequest(path, options = {}) {
    const { method = "GET", body, timeout, timeoutType = "default", rateLimitEndpoint = "default", companyId, correlationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateCorrelationId"])(), skipRetry = false, skipRateLimit = false, retryOptions = {} } = options;
    const apiKey = process.env.TELNYX_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: "TELNYX_API_KEY is not configured",
            errorCode: "CONFIG_ERROR",
            correlationId
        };
    }
    // Build request URL
    const hasProtocol = /^https?:\/\//i.test(path);
    const normalizedPath = hasProtocol || path.startsWith("/") ? path : `/${path}`;
    const requestUrl = hasProtocol ? normalizedPath : normalizedPath.startsWith("/public/") ? `${TELNYX_PUBLIC_BASE_URL}${normalizedPath}` : `${TELNYX_BASE_URL}${normalizedPath}`;
    // Determine timeout
    const effectiveTimeout = timeout || TIMEOUT_CONFIG[timeoutType];
    // Log request start
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("API request started", {
        correlationId,
        endpoint: path,
        method,
        companyId
    });
    // Start metrics timer
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startRequestTimer"])(path, method, companyId, correlationId);
    // Create the actual fetch function
    const executeFetch = async ()=>{
        const startTime = Date.now();
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), effectiveTimeout);
        try {
            const response = await fetch(requestUrl, {
                method,
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "X-Correlation-ID": correlationId
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                // Enable keep-alive for connection reuse
                keepalive: true
            });
            clearTimeout(timeoutId);
            const latencyMs = Date.now() - startTime;
            // Parse response
            const payload = await response.json().catch(()=>({}));
            if (!response.ok) {
                // Record failure metric
                timer.end(response.status, false);
                // Create typed error
                const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createErrorFromResponse"])(response.status, payload, {
                    correlationId,
                    endpoint: path,
                    method,
                    companyId
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].warn("API request failed", {
                    correlationId,
                    endpoint: path,
                    statusCode: response.status,
                    error: error.message,
                    latencyMs
                });
                // Throw to trigger retry if retryable
                if (error.retryable) {
                    throw error;
                }
                return {
                    success: false,
                    error: error.message,
                    errorCode: error.code,
                    correlationId,
                    latencyMs
                };
            }
            // Record success metric
            timer.end(response.status, true);
            // Telnyx API sometimes wraps response in "data", sometimes returns directly
            const responseData = payload?.data || payload;
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].debug("API request completed", {
                correlationId,
                endpoint: path,
                statusCode: response.status,
                latencyMs
            });
            return {
                success: true,
                data: responseData,
                correlationId,
                latencyMs
            };
        } catch (error) {
            clearTimeout(timeoutId);
            const latencyMs = Date.now() - startTime;
            // Handle timeout
            if (error instanceof Error && error.name === "AbortError") {
                timer.end(0, false);
                const timeoutError = new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxTimeoutError"](`Request timed out after ${effectiveTimeout}ms`, effectiveTimeout, {
                    correlationId,
                    endpoint: path,
                    method
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("API request timed out", {
                    correlationId,
                    endpoint: path,
                    timeoutMs: effectiveTimeout,
                    latencyMs
                });
                throw timeoutError; // Throw to trigger retry
            }
            // Handle TelnyxError (already processed)
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"]) {
                throw error;
            }
            // Handle network/other errors
            timer.end(0, false);
            const wrappedError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createErrorFromException"])(error, {
                correlationId,
                endpoint: path,
                method
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].error("API request error", {
                correlationId,
                endpoint: path,
                error: wrappedError.message,
                latencyMs
            });
            throw wrappedError;
        }
    };
    // Apply rate limiting and retry logic
    try {
        let fetchFn = executeFetch;
        // Wrap with retry logic if not skipped
        if (!skipRetry) {
            const originalFn = fetchFn;
            fetchFn = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$retry$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withRetry"])(originalFn, {
                    endpoint: path,
                    correlationId,
                    config: retryOptions.config,
                    onRetry: (attempt, error, delayMs)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxLogger"].info("Retrying request", {
                            correlationId,
                            endpoint: path,
                            attempt,
                            delayMs,
                            error: error.message
                        });
                    }
                });
        }
        // Wrap with rate limiting if not skipped
        if (!skipRateLimit) {
            const fnWithRetry = fetchFn;
            fetchFn = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withRateLimit"])(fnWithRetry, {
                    endpoint: rateLimitEndpoint,
                    companyId,
                    correlationId
                });
        }
        return await fetchFn();
    } catch (error) {
        // Convert any remaining errors to response format
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"]) {
            return {
                success: false,
                error: error.message,
                errorCode: error.code,
                correlationId
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            correlationId
        };
    }
}
async function telnyxGet(path, options = {}) {
    return telnyxRequest(path, {
        ...options,
        method: "GET"
    });
}
async function telnyxPost(path, body, options = {}) {
    return telnyxRequest(path, {
        ...options,
        method: "POST",
        body
    });
}
async function telnyxPut(path, body, options = {}) {
    return telnyxRequest(path, {
        ...options,
        method: "PUT",
        body
    });
}
async function telnyxPatch(path, body, options = {}) {
    return telnyxRequest(path, {
        ...options,
        method: "PATCH",
        body
    });
}
async function telnyxDelete(path, options = {}) {
    return telnyxRequest(path, {
        ...options,
        method: "DELETE"
    });
}
async function telnyxSmsRequest(path, options = {}) {
    return telnyxRequest(path, {
        ...options,
        timeoutType: "sms",
        rateLimitEndpoint: "sms"
    });
}
async function telnyxVoiceRequest(path, options = {}) {
    return telnyxRequest(path, {
        ...options,
        timeoutType: "voice",
        rateLimitEndpoint: "voice"
    });
}
async function telnyxLookupRequest(path, options = {}) {
    return telnyxRequest(path, {
        ...options,
        timeoutType: "lookup",
        rateLimitEndpoint: "lookup"
    });
}
}),
"[project]/apps/web/src/lib/telnyx/ten-dlc.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attachNumberToCampaign",
    ()=>attachNumberToCampaign,
    "createTenDlcBrand",
    ()=>createTenDlcBrand,
    "createTenDlcCampaign",
    ()=>createTenDlcCampaign,
    "getTenDlcBrand",
    ()=>getTenDlcBrand,
    "getTenDlcCampaign",
    ()=>getTenDlcCampaign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/api.ts [app-rsc] (ecmascript)");
;
;
async function createTenDlcBrand(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])("/10dlc/brand", {
        method: "POST",
        body: payload
    });
}
async function getTenDlcBrand(brandId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])(`/10dlc/brand/${brandId}`);
}
async function createTenDlcCampaign(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])("/10dlc/campaignBuilder", {
        method: "POST",
        body: payload
    });
}
async function getTenDlcCampaign(campaignId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])(`/10dlc/campaign/${campaignId}`);
}
async function attachNumberToCampaign(campaignId, phoneNumber) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])(`/10dlc/campaigns/${campaignId}/phone_numbers`, {
        method: "POST",
        body: {
            phone_numbers: [
                {
                    phone_number: phoneNumber
                }
            ]
        }
    });
}
}),
"[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"602d4348165cf80204b8b72cb3eaa8589cc71135f9":"ensureMessagingBranding","708c57de6d594fa79052a4de84abea6851344763b5":"ensureMessagingCampaign"},"",""] */ __turbopack_context__.s([
    "ensureMessagingBranding",
    ()=>ensureMessagingBranding,
    "ensureMessagingCampaign",
    ()=>ensureMessagingCampaign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/ten-dlc.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const DEFAULT_MESSAGING_PROFILE_ID = process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID || process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID || "";
const NANP_WITH_COUNTRY_DIGITS = 11;
const NANP_LOCAL_DIGITS = 10;
const WHITESPACE_SPLIT_REGEX = /\s+/;
function formatPhone(phone) {
    if (!phone) {
        return null;
    }
    const digits = phone.replace(/\D/g, "");
    if (!digits) {
        return null;
    }
    if (digits.length === NANP_WITH_COUNTRY_DIGITS && digits.startsWith("1")) {
        return `+${digits}`;
    }
    if (digits.length === NANP_LOCAL_DIGITS) {
        return `+1${digits}`;
    }
    return phone.startsWith("+") ? phone : `+${digits}`;
}
function splitName(fullName) {
    if (!fullName) {
        return {
            first: "Support",
            last: "Team"
        };
    }
    const parts = fullName.trim().split(WHITESPACE_SPLIT_REGEX);
    if (parts.length === 1) {
        return {
            first: parts[0],
            last: "Team"
        };
    }
    return {
        first: parts[0],
        last: parts.slice(1).join(" ")
    };
}
function mapIndustryToVertical(industry) {
    if (!industry) {
        return "PROFESSIONAL";
    }
    const normalized = industry.toLowerCase();
    if (normalized.includes("plumb")) {
        return "HOME_SERVICES";
    }
    if (normalized.includes("hvac")) {
        return "HOME_SERVICES";
    }
    if (normalized.includes("electric")) {
        return "HOME_SERVICES";
    }
    if (normalized.includes("clean")) {
        return "PROFESSIONAL";
    }
    return "PROFESSIONAL";
}
async function upsertBrandRecord(supabase, data) {
    const { data: existing } = await supabase.from("messaging_brands").select("id").eq("company_id", data.company_id).maybeSingle();
    if (existing) {
        await supabase.from("messaging_brands").update({
            ...data,
            updated_at: new Date().toISOString()
        }).eq("id", existing.id);
    } else {
        await supabase.from("messaging_brands").insert(data);
    }
}
async function upsertCampaignRecord(supabase, data) {
    const { data: existing } = await supabase.from("messaging_campaigns").select("id").eq("messaging_brand_id", data.messaging_brand_id).eq("usecase", data.usecase).maybeSingle();
    if (existing) {
        await supabase.from("messaging_campaigns").update({
            ...data,
            updated_at: new Date().toISOString()
        }).eq("id", existing.id);
        return existing.id;
    }
    const { data: inserted } = await supabase.from("messaging_campaigns").insert(data).select("id").single();
    return inserted?.id ?? null;
}
async function ensureMessagingBranding(companyId, options) {
    const supabase = options?.supabase ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            success: false,
            error: "Supabase unavailable"
        };
    }
    const { data: company, error } = await supabase.from("companies").select("id, name, legal_name, doing_business_as, phone, support_email, support_phone, website, website_url, brand_color, industry, address, city, state, zip_code, owner_id, ein, tax_id").eq("id", companyId).single();
    if (error || !company) {
        return {
            success: false,
            error: error?.message || "Company not found"
        };
    }
    const { data: ownerContact } = await supabase.from("profiles").select("full_name, email, phone").eq("id", company.owner_id).maybeSingle();
    const contactName = splitName(ownerContact?.full_name);
    const contactEmail = ownerContact?.email || company.support_email || "support@example.com";
    const contactPhone = formatPhone(ownerContact?.phone) || formatPhone(company.support_phone) || formatPhone(company.phone) || "+18314280176";
    const { data: brandRow } = await supabase.from("messaging_brands").select("*").eq("company_id", companyId).maybeSingle();
    if (brandRow?.telnyx_brand_id) {
        const brandStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenDlcBrand"])(brandRow.telnyx_brand_id);
        if (brandStatus.success && brandStatus.data) {
            await supabase.from("messaging_brands").update({
                status: brandStatus.data.status,
                updated_at: new Date().toISOString()
            }).eq("id", brandRow.id);
        }
    }
    if (!brandRow?.telnyx_brand_id) {
        const brandPayload = {
            customer_reference: companyId,
            brand_name: company.legal_name || company.name,
            ein: company.ein || company.tax_id || process.env.FALLBACK_TEST_EIN || "00-0000000",
            ein_issuing_country: "US",
            vertical: mapIndustryToVertical(company.industry),
            website: company.website || company.website_url || null,
            company_type: "PRIVATE_PROFIT",
            address: {
                line1: company.address || "115 Flintlock Lane",
                city: company.city || "Ben Lomond",
                state: company.state || "CA",
                postal_code: company.zip_code || "95005",
                country: "US"
            },
            contact: {
                first_name: contactName.first,
                last_name: contactName.last,
                email: contactEmail,
                phone: contactPhone
            },
            optional_attributes: {
                doing_business_as: company.doing_business_as || company.name
            }
        };
        const brandResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTenDlcBrand"])(brandPayload);
        if (!(brandResult.success && brandResult.data)) {
            return {
                success: false,
                error: brandResult.error || "Failed to create 10DLC brand"
            };
        }
        await upsertBrandRecord(supabase, {
            company_id: companyId,
            telnyx_brand_id: brandResult.data.id,
            status: "submitted",
            legal_name: brandPayload.brand_name,
            doing_business_as: company.doing_business_as || company.name,
            ein: brandPayload.ein,
            vertical: brandPayload.vertical,
            website: brandPayload.website,
            support_email: contactEmail,
            support_phone: contactPhone,
            address_line1: brandPayload.address.line1,
            city: brandPayload.address.city,
            state: brandPayload.address.state,
            postal_code: brandPayload.address.postal_code,
            brand_color: company.brand_color
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/brand");
    return {
        success: true
    };
}
async function ensureMessagingCampaign(companyId, phoneNumber, options) {
    const supabase = options?.supabase ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            success: false,
            error: "Supabase unavailable"
        };
    }
    const { data: brand } = await supabase.from("messaging_brands").select("*").eq("company_id", companyId).maybeSingle();
    if (!brand?.telnyx_brand_id) {
        const brandResult = await ensureMessagingBranding(companyId, {
            supabase
        });
        if (!brandResult.success) {
            return brandResult;
        }
        return ensureMessagingCampaign(companyId, phoneNumber);
    }
    const usecase = "CUSTOMER_CARE";
    const { data: campaignRow } = await supabase.from("messaging_campaigns").select("*").eq("messaging_brand_id", brand.id).eq("usecase", usecase).maybeSingle();
    if (campaignRow?.telnyx_campaign_id) {
        const campaignStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenDlcCampaign"])(campaignRow.telnyx_campaign_id);
        if (campaignStatus.success && campaignStatus.data) {
            await supabase.from("messaging_campaigns").update({
                status: campaignStatus.data.status,
                updated_at: new Date().toISOString()
            }).eq("id", campaignRow.id);
        }
    }
    let campaignId = campaignRow?.id ?? null;
    let telnyxCampaignId = campaignRow?.telnyx_campaign_id ?? null;
    if (!campaignRow?.telnyx_campaign_id) {
        if (!DEFAULT_MESSAGING_PROFILE_ID) {
            return {
                success: false,
                error: "TELNYX_DEFAULT_MESSAGING_PROFILE_ID not configured"
            };
        }
        const description = `${brand.doing_business_as || brand.legal_name} provides appointment updates, reminders, and service notifications to existing customers.`;
        const sampleMessage = `Hi {{customer_name}}, this is ${brand.doing_business_as || brand.legal_name} confirming your upcoming appointment. Reply HELP for assistance or STOP to opt out.`;
        const campaignPayload = {
            brand_id: brand.telnyx_brand_id,
            campaign_alias: `${companyId}-customer-care`,
            usecase,
            description,
            sample_messages: [
                sampleMessage
            ],
            message_flow: "Customers opt in during onboarding or by texting our business line. They receive service updates and can opt out by replying STOP.",
            terms_and_conditions: "Msg & data rates may apply. Reply STOP to opt out, HELP for help.",
            help_message: `Thanks for contacting ${brand.doing_business_as || brand.legal_name}. Reply STOP to unsubscribe.`,
            help_phone_number: brand.support_phone || "+18314280176",
            help_email: brand.support_email || "support@example.com",
            auto_renewal: true,
            message_fee_credits: 0,
            opt_in_keywords: [
                "START",
                "YES"
            ],
            opt_out_keywords: [
                "STOP",
                "UNSUBSCRIBE"
            ],
            opt_in_message: "Thanks for opting in to receive messages from us. Reply STOP to opt out.",
            opt_out_message: "You have successfully been unsubscribed and will no longer receive messages. Reply START to opt in again."
        };
        const campaignResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTenDlcCampaign"])(campaignPayload);
        if (!(campaignResult.success && campaignResult.data)) {
            return {
                success: false,
                error: campaignResult.error || "Failed to create 10DLC campaign"
            };
        }
        campaignId = await upsertCampaignRecord(supabase, {
            messaging_brand_id: brand.id,
            telnyx_campaign_id: campaignResult.data.id,
            status: "submitted",
            usecase,
            description,
            sample_messages: campaignPayload.sample_messages,
            messaging_profile_id: DEFAULT_MESSAGING_PROFILE_ID
        }) || campaignRow?.id || null;
        telnyxCampaignId = campaignResult.data.id;
    }
    if (!(campaignId && telnyxCampaignId)) {
        return {
            success: false,
            error: "Campaign not ready"
        };
    }
    const { data: linkRecord } = await supabase.from("messaging_campaign_phone_numbers").select("*").eq("messaging_campaign_id", campaignId).eq("phone_number_id", phoneNumber.id).maybeSingle();
    if (!linkRecord?.telnyx_relationship_id) {
        const attachResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["attachNumberToCampaign"])(telnyxCampaignId, phoneNumber.e164);
        if (!(attachResult.success && attachResult.data)) {
            return {
                success: false,
                error: attachResult.error || "Failed to link number to campaign"
            };
        }
        if (linkRecord) {
            await supabase.from("messaging_campaign_phone_numbers").update({
                telnyx_relationship_id: attachResult.data.id,
                status: "submitted"
            }).eq("id", linkRecord.id);
        } else {
            await supabase.from("messaging_campaign_phone_numbers").insert({
                messaging_campaign_id: campaignId,
                phone_number_id: phoneNumber.id,
                telnyx_relationship_id: attachResult.data.id,
                status: "submitted"
            });
        }
    }
    await supabase.from("phone_numbers").update({
        telnyx_messaging_profile_id: DEFAULT_MESSAGING_PROFILE_ID,
        metadata: {
            ten_dlc_campaign_id: telnyxCampaignId
        }
    }).eq("id", phoneNumber.id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/phone-numbers");
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    ensureMessagingBranding,
    ensureMessagingCampaign
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(ensureMessagingBranding, "602d4348165cf80204b8b72cb3eaa8589cc71135f9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(ensureMessagingCampaign, "708c57de6d594fa79052a4de84abea6851344763b5", null);
}),
"[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Server Actions
 *
 * Server-side actions for Telnyx VoIP operations:
 * - Phone number management
 * - Call operations
 * - SMS operations
 * - Voicemail operations
 *
 * All actions include proper authentication and authorization checks.
 */ /* __next_internal_action_entry_do_not_use__ [{"004241027febea2f30c3534c791cf4abf0b187afa3":"getWebRTCCredentials","40012be04999490b3a8f8ee0e26fe3cfea793d7855":"sendMMSMessage","40259eeac04557a955e11bfd26ce80f5e72f4ecf77":"getCallRoutingRules","402df083194dc791ac0abbcd344b35a396096a15b3":"transcribeCallRecording","4035496a233e28ec394eae2146957ccf9f344cb802":"makeCall","4048e2e9f024fac21b381ed351553fd4d64d78f5d6":"getCompanyPhoneNumbers","4063a33d571d6985e25da4111beb44c82ca57cb53a":"searchPhoneNumbers","40703cc80f332fb0d2865d96ada3ac45791ca0d136":"updateCallRoutingRule","40a8248de9409aa878e0944497faaa0fba5a84e97b":"purchasePhoneNumber","40b8d713ea0a1ff9c9961eb1d6e32fbd00001de582":"stopCallRecording","40cc98b523af2697e773d1f6877af0bf64071f040d":"sendTextMessage","40d259c746bf68bfc52ee1035f65b7d5d348fb2beb":"transferActiveCall","40e9b4592b7430c75572741960a36336d9be9f7ae0":"startCallRecording","6034c4a4b3c4dea02619bf6b784012d8307475751a":"toggleCallRoutingRule","605f35c197a79197cf2e4c607de39464ecc7c51b7a":"deleteCallRoutingRule"},"",""] */ __turbopack_context__.s([
    "deleteCallRoutingRule",
    ()=>deleteCallRoutingRule,
    "getCallRoutingRules",
    ()=>getCallRoutingRules,
    "getCompanyPhoneNumbers",
    ()=>getCompanyPhoneNumbers,
    "getWebRTCCredentials",
    ()=>getWebRTCCredentials,
    "makeCall",
    ()=>makeCall,
    "purchasePhoneNumber",
    ()=>purchasePhoneNumber,
    "searchPhoneNumbers",
    ()=>searchPhoneNumbers,
    "sendMMSMessage",
    ()=>sendMMSMessage,
    "sendTextMessage",
    ()=>sendTextMessage,
    "startCallRecording",
    ()=>startCallRecording,
    "stopCallRecording",
    ()=>stopCallRecording,
    "toggleCallRoutingRule",
    ()=>toggleCallRoutingRule,
    "transcribeCallRecording",
    ()=>transcribeCallRecording,
    "transferActiveCall",
    ()=>transferActiveCall,
    "updateCallRoutingRule",
    ()=>updateCallRoutingRule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/calls.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$config$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/config-validator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/messaging.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2d$profile$2d$setup$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/messaging-profile-setup.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/numbers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$phone$2d$number$2d$setup$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/phone-number-setup.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$provision$2d$company$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/provision-company.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
function normalizePhoneNumber(phoneNumber) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatPhoneNumber"])(phoneNumber);
}
function extractAreaCode(phoneNumber) {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
        return digits.slice(1, 4);
    }
    if (digits.length === 10) {
        return digits.slice(0, 3);
    }
    return null;
}
const DEFAULT_MESSAGING_PROFILE_ID = process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID || process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID || "";
const DEFAULT_PHONE_NUMBER_FEATURES = [
    "voice",
    "sms",
    "mms"
];
function formatDisplayPhoneNumber(phoneNumber) {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phoneNumber;
}
async function getCompanyTelnyxSettings(supabase, companyId1) {
    if (!companyId1) {
        return null;
    }
    const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$provision$2d$company$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchCompanyTelnyxSettings"])(supabase, companyId1);
    if (existing && existing.status === "ready") {
        return existing;
    }
    const provisionResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$provision$2d$company$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureCompanyTelnyxSetup"])({
        companyId: companyId1,
        supabase
    });
    if (!provisionResult.success) {
        return null;
    }
    return provisionResult.settings ?? null;
}
function normalizeBaseUrl(url) {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (/^https?:\/\//i.test(trimmed)) {
        if (/^http:\/\//i.test(trimmed) && !isLocalUrl(trimmed)) {
            return trimmed.replace(/^http:\/\//i, "https://");
        }
        return trimmed;
    }
    return `https://${trimmed}`;
}
function isLocalUrl(url) {
    const lowered = url.toLowerCase();
    return lowered.includes("localhost") || lowered.includes("127.0.0.1") || lowered.includes("0.0.0.0") || lowered.endsWith(".local") || lowered.includes("://local");
}
function shouldUseUrl(url) {
    if (!url) {
        return false;
    }
    const trimmed = url.trim();
    if (!trimmed) {
        return false;
    }
    const isHostedProduction = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production" || process.env.DEPLOYMENT_ENV === "production";
    if (isHostedProduction && isLocalUrl(trimmed)) {
        return false;
    }
    return true;
}
async function getBaseAppUrl() {
    const candidates = [
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.SITE_URL,
        ("TURBOPACK compile-time value", "http://localhost:3000"),
        process.env.APP_URL
    ];
    for (const candidate of candidates){
        if (candidate && shouldUseUrl(candidate)) {
            return normalizeBaseUrl(candidate);
        }
    }
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl && shouldUseUrl(vercelUrl)) {
        return normalizeBaseUrl(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`);
    }
    try {
        const hdrs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
        const origin = hdrs.get("origin");
        if (origin && shouldUseUrl(origin)) {
            return normalizeBaseUrl(origin);
        }
        const host = hdrs.get("host");
        if (host && shouldUseUrl(host)) {
            const protocol = host.includes("localhost") ? "http" : "https";
            return normalizeBaseUrl(`${protocol}://${host}`);
        }
    } catch  {
    // headers() not available outside of a request context
    }
    return undefined;
}
async function buildAbsoluteUrl(path) {
    const base = await getBaseAppUrl();
    if (!base) {
        return undefined;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
}
async function getTelnyxWebhookUrl(companyId1) {
    if (companyId1) {
        return buildAbsoluteUrl(`/api/webhooks/telnyx?company=${companyId1}`);
    }
    return buildAbsoluteUrl("/api/webhooks/telnyx");
}
async function getPhoneNumberId(supabase, phoneNumber) {
    const normalized = normalizePhoneNumber(phoneNumber);
    const { data } = await supabase.from("phone_numbers").select("id").eq("phone_number", normalized).is("deleted_at", null).maybeSingle();
    return data?.id ?? null;
}
async function ensurePhoneNumberRecordExists(supabase, companyId1, phoneNumber) {
    if (!phoneNumber) {
        return;
    }
    const normalized = normalizePhoneNumber(phoneNumber);
    const { data } = await supabase.from("phone_numbers").select("id").eq("company_id", companyId1).eq("phone_number", normalized).limit(1);
    if (data && data.length > 0) {
        return;
    }
    await supabase.from("phone_numbers").insert({
        company_id: companyId1,
        phone_number: normalized,
        formatted_number: formatDisplayPhoneNumber(normalized),
        country_code: "US",
        area_code: extractAreaCode(normalized),
        number_type: "local",
        status: "active",
        features: DEFAULT_PHONE_NUMBER_FEATURES
    });
}
async function resolveOutboundPhoneNumber(supabase, companyId1, explicitFrom, defaultNumber) {
    if (explicitFrom) {
        return normalizePhoneNumber(explicitFrom);
    }
    const normalizedDefault = defaultNumber ? normalizePhoneNumber(defaultNumber) : null;
    try {
        const { data } = await supabase.from("phone_numbers").select("phone_number, number_type").eq("company_id", companyId1).eq("status", "active");
        if (data && data.length > 0) {
            const tollFree = data.find((n)=>n.number_type === "toll-free");
            if (tollFree) {
                return normalizePhoneNumber(tollFree.phone_number);
            }
            if (normalizedDefault) {
                const defaultExists = data.some((n)=>normalizePhoneNumber(n.phone_number) === normalizedDefault);
                if (defaultExists) {
                    return normalizedDefault;
                }
            }
            return normalizePhoneNumber(data[0].phone_number);
        }
    } catch (error) {
        console.warn("Failed to load company phone numbers for outbound selection:", error);
    }
    return normalizedDefault;
}
async function mergeProviderMetadata(supabase, communicationId, patch) {
    const { data } = await supabase.from("communications").select("provider_metadata").eq("id", communicationId).maybeSingle();
    const currentMetadata = data?.provider_metadata ?? {};
    const mergedMetadata = {
        ...currentMetadata,
        ...patch
    };
    await supabase.from("communications").update({
        provider_metadata: mergedMetadata
    }).eq("id", communicationId);
}
async function searchPhoneNumbers(params) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchAvailableNumbers"])({
            countryCode: "US",
            areaCode: params.areaCode,
            numberType: params.numberType,
            features: params.features,
            limit: params.limit || 10
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to search phone numbers"
        };
    }
}
async function purchasePhoneNumber(params) {
    try {
        // Validate configuration
        const smsConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$config$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateSmsConfig"])();
        const callConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$config$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateCallConfig"])();
        if (!smsConfig.valid || !callConfig.valid) {
            let errorMessage = "Telnyx configuration is incomplete. Please configure all required environment variables.";
            // If we have a suggested profile ID, include it in the error
            if (smsConfig.suggestedProfileId) {
                errorMessage += ` Found messaging profile "${smsConfig.suggestedProfileId}" in your Telnyx account. Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID=${smsConfig.suggestedProfileId} to use it.`;
            }
            return {
                success: false,
                error: errorMessage
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const normalizedPhoneNumber = normalizePhoneNumber(params.phoneNumber);
        const formattedNumber = formatDisplayPhoneNumber(normalizedPhoneNumber);
        const areaCode = extractAreaCode(normalizedPhoneNumber);
        // Purchase number from Telnyx
        const messagingProfileId = DEFAULT_MESSAGING_PROFILE_ID || undefined;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["purchaseNumber"])({
            phoneNumber: normalizedPhoneNumber,
            connectionId: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].connectionId,
            messagingProfileId,
            billingGroupId: params.billingGroupId,
            customerReference: `company_${params.companyId}`
        });
        if (!result.success) {
            return result;
        }
        // Store in database
        const { data, error } = await supabase.from("phone_numbers").insert({
            company_id: params.companyId,
            telnyx_phone_number_id: result.orderId,
            telnyx_connection_id: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].connectionId,
            phone_number: normalizedPhoneNumber,
            formatted_number: formattedNumber,
            country_code: "US",
            area_code: areaCode,
            number_type: "local",
            features: [
                "voice",
                "sms"
            ],
            status: "pending"
        }).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/phone-numbers");
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureMessagingCampaign"])(params.companyId, {
                id: data.id,
                e164: normalizedPhoneNumber
            }, {
                supabase
            });
        } catch (_campaignError) {}
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to purchase phone number"
        };
    }
}
async function getCompanyPhoneNumbers(companyId1) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("phone_numbers").select("*").eq("company_id", companyId1).is("deleted_at", null).order("created_at", {
            ascending: false
        });
        if (error) {
            throw error;
        }
        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get phone numbers"
        };
    }
}
/**
 * Update phone number configuration
 */ async function updatePhoneNumber(params) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("phone_numbers").update({
            call_routing_rule_id: params.routingRuleId,
            forward_to_number: params.forwardToNumber,
            voicemail_enabled: params.voicemailEnabled
        }).eq("id", params.phoneNumberId).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/phone-numbers");
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update phone number"
        };
    }
}
/**
 * Release (delete) a phone number
 */ async function deletePhoneNumber(phoneNumberId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        // Get phone number details
        const { data: phoneNumber } = await supabase.from("phone_numbers").select("*").eq("id", phoneNumberId).single();
        if (!phoneNumber) {
            return {
                success: false,
                error: "Phone number not found"
            };
        }
        // Release from Telnyx if we have the ID
        if (phoneNumber.telnyx_phone_number_id) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$numbers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["releaseNumber"])(phoneNumber.telnyx_phone_number_id);
        }
        // Soft delete in database
        const { error } = await supabase.from("phone_numbers").update({
            deleted_at: new Date().toISOString(),
            status: "deleted"
        }).eq("id", phoneNumberId);
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/phone-numbers");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete phone number"
        };
    }
}
async function makeCall(params) {
    try {
        console.log("📞 makeCall called with params:", params);
        const callConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$config$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateCallConfig"])();
        console.log("🔍 Call config validation:", callConfig);
        if (!callConfig.valid) {
            return {
                success: false,
                error: callConfig.error || "Call configuration is invalid"
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const companySettings = await getCompanyTelnyxSettings(supabase, params.companyId);
        await ensurePhoneNumberRecordExists(supabase, params.companyId, companySettings?.default_outbound_number || null);
        const connectionOverride = companySettings?.call_control_application_id || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TELNYX_CONFIG"].connectionId;
        const fromAddress = await resolveOutboundPhoneNumber(supabase, params.companyId, params.from, companySettings?.default_outbound_number || null);
        if (!connectionOverride) {
            return {
                success: false,
                error: "No Telnyx connection configured for this company."
            };
        }
        if (!fromAddress) {
            return {
                success: false,
                error: "Company does not have a default outbound phone number configured. Please provision numbers first."
            };
        }
        // TEMP: Skip connection verification - Level 2 required for API access
        // const connectionStatus = await verifyConnection(connectionOverride);
        // if (connectionStatus.needsFix) {
        // 	return {
        // 		success: false,
        // 		error: `Connection configuration issue: ${connectionStatus.issues.join(", ")}. Run fixConnection() to auto-fix.`,
        // 	};
        // }
        const toAddress = normalizePhoneNumber(params.to);
        // TEMP: Skip voice capability check - Level 2 required for API access
        // const voiceCapability = await verifyVoiceCapability(fromAddress);
        // if (!voiceCapability.hasVoice) {
        // 	return {
        // 		success: false,
        // 		error:
        // 			voiceCapability.error || "Phone number does not support voice calls",
        // 	};
        // }
        const telnyxWebhookUrl = await getTelnyxWebhookUrl(params.companyId);
        console.log("🔗 Webhook URL:", telnyxWebhookUrl);
        if (!telnyxWebhookUrl) {
            return {
                success: false,
                error: "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL or SITE_URL to a public https domain."
            };
        }
        console.log("📤 Initiating call:", {
            to: toAddress,
            from: fromAddress,
            connectionId: connectionOverride,
            webhookUrl: telnyxWebhookUrl
        });
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initiateCall"])({
            to: toAddress,
            from: fromAddress,
            connectionId: connectionOverride,
            webhookUrl: telnyxWebhookUrl,
            answeringMachineDetection: "premium"
        });
        console.log("📥 Telnyx API response:", result);
        if (!result.success) {
            return result;
        }
        const phoneNumberId = await getPhoneNumberId(supabase, fromAddress);
        const { data, error } = await supabase.from("communications").insert({
            company_id: companyId,
            customer_id: params.customerId,
            job_id: params.jobId ?? null,
            property_id: params.propertyId ?? null,
            invoice_id: params.invoiceId ?? null,
            estimate_id: params.estimateId ?? null,
            type: "phone",
            channel: "telnyx",
            direction: "outbound",
            from_address: fromAddress,
            to_address: toAddress,
            body: "",
            status: "queued",
            priority: "normal",
            phone_number_id: phoneNumberId,
            is_archived: false,
            is_automated: false,
            is_internal: false,
            is_thread_starter: true,
            telnyx_call_control_id: result.callControlId,
            telnyx_call_session_id: result.callSessionId
        }).select().single();
        if (error) {
            throw error;
        }
        console.log("✅ Call created successfully:", {
            callControlId: result.callControlId,
            communicationId: data.id
        });
        return {
            success: true,
            callControlId: result.callControlId,
            data
        };
    } catch (error) {
        console.error("❌ makeCall error:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to make call"
        };
    }
}
/**
 * Answer an incoming call
/**
 * Answer an incoming call
 */ async function acceptCall(callControlId) {
    try {
        const telnyxWebhookUrl = await getTelnyxWebhookUrl();
        if (!telnyxWebhookUrl) {
            return {
                success: false,
                error: "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL or SITE_URL to a public https domain."
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["answerCall"])({
            callControlId,
            webhookUrl: telnyxWebhookUrl
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to answer call"
        };
    }
}
/**
 * Reject an incoming call
 */ async function declineCall(callControlId) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectCall"])({
            callControlId,
            cause: "CALL_REJECTED"
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to reject call"
        };
    }
}
/**
 * End an active call
 */ async function endCall(callControlId) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hangupCall"])({
            callControlId
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to end call"
        };
    }
}
async function startCallRecording(callControlId) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startRecording"])({
            callControlId,
            format: "mp3",
            channels: "single"
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to start recording"
        };
    }
}
async function stopCallRecording(callControlId) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$calls$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stopRecording"])({
            callControlId
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to stop recording"
        };
    }
}
async function transferActiveCall(params) {
    try {
        const { transferCall } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/calls.ts [app-rsc] (ecmascript, async loader)");
        const result = await transferCall({
            callControlId: params.callControlId,
            to: params.to,
            from: params.from
        });
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to transfer call"
        };
    }
}
async function transcribeCallRecording(params) {
    try {
        const { submitTranscription } = await __turbopack_context__.A("[project]/apps/web/src/lib/assemblyai/client.ts [app-rsc] (ecmascript, async loader)");
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const webhookUrl = await buildAbsoluteUrl("/api/webhooks/assemblyai");
        if (!webhookUrl) {
            return {
                success: false,
                error: "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL or SITE_URL."
            };
        }
        // Submit to AssemblyAI
        const result = await submitTranscription({
            audio_url: params.recordingUrl,
            speaker_labels: true,
            webhook_url: webhookUrl
        });
        if (!(result.success && result.data)) {
            return {
                success: false,
                error: result.error || "Failed to submit transcription"
            };
        }
        // Store transcription job ID in database
        await mergeProviderMetadata(supabase, params.communicationId, {
            assemblyai_transcription_id: result.data.id,
            assemblyai_status: result.data.status
        });
        return {
            success: true,
            transcriptionId: result.data.id,
            status: result.data.status
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to transcribe recording"
        };
    }
}
async function sendTextMessage(params) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            console.error("❌ Supabase client unavailable");
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        // Get company ID if not provided
        let companyId1 = params.companyId;
        if (!companyId1) {
            const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
            companyId1 = await getActiveCompanyId();
            if (!companyId1) {
                return {
                    success: false,
                    error: "No active company found"
                };
            }
        }
        console.log("📱 SMS Send Request:", {
            to: params.to,
            from: params.from,
            companyId: companyId1
        });
        const companySettings = await getCompanyTelnyxSettings(supabase, companyId1);
        if (!companySettings) {
            console.error("❌ Company settings not found");
            return {
                success: false,
                error: "Unable to provision Telnyx resources for this company. Please verify the company's onboarding is complete and try again."
            };
        }
        console.log("✅ Company settings loaded:", {
            messagingProfileId: companySettings.messaging_profile_id,
            defaultNumber: companySettings.default_outbound_number
        });
        await ensurePhoneNumberRecordExists(supabase, companyId1, companySettings.default_outbound_number);
        const smsConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$config$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateSmsConfig"])();
        if (!smsConfig.valid && !companySettings?.messaging_profile_id) {
            let errorMessage = smsConfig.error || "SMS configuration is invalid";
            if (smsConfig.suggestedProfileId) {
                errorMessage += ` Found messaging profile "${smsConfig.suggestedProfileId}" in your Telnyx account. Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID=${smsConfig.suggestedProfileId} or provision company-specific settings.`;
            }
            console.error("❌ SMS config invalid:", errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
        console.log("✅ SMS config valid");
        const messagingProfileId = companySettings?.messaging_profile_id || DEFAULT_MESSAGING_PROFILE_ID;
        if (!messagingProfileId) {
            console.error("❌ No messaging profile ID");
            return {
                success: false,
                error: "Messaging profile is not configured for this company. Please provision communications before sending SMS."
            };
        }
        console.log("✅ Using messaging profile:", messagingProfileId);
        if (messagingProfileId) {
            const messagingProfileStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2d$profile$2d$setup$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyMessagingProfile"])(messagingProfileId);
            if (messagingProfileStatus.needsFix) {
                console.error("❌ Messaging profile needs fix:", messagingProfileStatus.issues);
                return {
                    success: false,
                    error: `Messaging profile configuration issue: ${messagingProfileStatus.issues.join(", ")}. Run fixMessagingProfile() or reprovision the company.`
                };
            }
            console.log("✅ Messaging profile verified");
        }
        const fromAddress = await resolveOutboundPhoneNumber(supabase, companyId1, params.from, companySettings.default_outbound_number);
        if (!fromAddress) {
            console.error("❌ No from number available");
            return {
                success: false,
                error: "Company does not have a default outbound phone number configured. Please provision numbers first."
            };
        }
        const toAddress = normalizePhoneNumber(params.to);
        console.log("✅ Phone numbers normalized:", {
            from: fromAddress,
            to: toAddress
        });
        // Verify phone number has SMS capability
        console.log("🔍 Verifying SMS capability for:", fromAddress);
        const smsCapability = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$phone$2d$number$2d$setup$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifySmsCapability"])(fromAddress);
        if (!smsCapability.hasSms) {
            console.error("❌ SMS capability check failed:", smsCapability.error);
            return {
                success: false,
                error: smsCapability.error || "Phone number does not support SMS"
            };
        }
        console.log("✅ SMS capability verified");
        const webhookUrl = await getTelnyxWebhookUrl(companyId1);
        if (!webhookUrl) {
            console.error("❌ No webhook URL");
            return {
                success: false,
                error: "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL or SITE_URL to a public https domain."
            };
        }
        console.log("✅ Webhook URL:", webhookUrl);
        // Send SMS via Telnyx
        console.log("📤 Sending SMS via Telnyx API...");
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendSMS"])({
            to: toAddress,
            from: fromAddress,
            text: params.text,
            webhookUrl,
            messagingProfileId
        });
        if (!result.success) {
            console.error("❌ Telnyx API failed:", result.error);
            // Check if error is 10DLC registration required
            if (result.error && (result.error.includes("10DLC") || result.error.includes("Not 10DLC registered") || result.error.includes("A2P"))) {
                console.log("🔄 Detected 10DLC registration required, attempting auto-registration...");
                // Import 10DLC registration function
                const { registerCompanyFor10DLC } = await __turbopack_context__.A("[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript, async loader)");
                const registrationResult = await registerCompanyFor10DLC(companyId1);
                if (registrationResult.success) {
                    console.log("✅ 10DLC registration successful, retrying SMS send...");
                    // Retry the SMS send now that 10DLC is registered
                    const retryResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendSMS"])({
                        to: toAddress,
                        from: fromAddress,
                        text: params.text,
                        webhookUrl,
                        messagingProfileId
                    });
                    if (!retryResult.success) {
                        return {
                            success: false,
                            error: `10DLC registration completed but SMS still failed: ${retryResult.error}. The campaign may need additional approval time.`
                        };
                    }
                    // Update result with retry success
                    result.success = true;
                    result.messageId = retryResult.messageId;
                    console.log("✅ SMS retry successful after 10DLC registration");
                } else {
                    return {
                        success: false,
                        error: `10DLC registration failed: ${registrationResult.error}. Original error: ${result.error}`
                    };
                }
            } else {
                return result;
            }
        }
        console.log("✅ Telnyx API success:", result.messageId);
        // Create communication record
        console.log("💾 Creating communication record in database...");
        const phoneNumberId = await getPhoneNumberId(supabase, fromAddress);
        const { data, error } = await supabase.from("communications").insert({
            company_id: companyId1,
            customer_id: params.customerId,
            job_id: params.jobId ?? null,
            invoice_id: params.invoiceId ?? null,
            estimate_id: params.estimateId ?? null,
            type: "sms",
            channel: "telnyx",
            direction: "outbound",
            from_address: fromAddress,
            to_address: toAddress,
            body: params.text,
            status: "queued",
            priority: "normal",
            phone_number_id: phoneNumberId,
            is_archived: false,
            is_automated: false,
            is_internal: false,
            is_thread_starter: true,
            telnyx_message_id: result.messageId
        }).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/communication");
        return {
            success: true,
            messageId: result.messageId,
            data
        };
    } catch (error) {
        console.error("SMS send error:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            type: typeof error,
            stringified: JSON.stringify(error, null, 2)
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : `Failed to send SMS: ${String(error)}`
        };
    }
}
async function sendMMSMessage(params) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        // Get company ID if not provided
        let companyId1 = params.companyId;
        if (!companyId1) {
            const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
            companyId1 = await getActiveCompanyId();
            if (!companyId1) {
                return {
                    success: false,
                    error: "No active company found"
                };
            }
        }
        const companySettings = await getCompanyTelnyxSettings(supabase, companyId1);
        if (!companySettings) {
            return {
                success: false,
                error: "Unable to provision Telnyx resources for this company. Please verify onboarding is complete."
            };
        }
        await ensurePhoneNumberRecordExists(supabase, companyId1, companySettings.default_outbound_number);
        const smsConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$config$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateSmsConfig"])();
        if (!smsConfig.valid && !companySettings.messaging_profile_id) {
            let errorMessage = smsConfig.error || "SMS configuration is invalid";
            if (smsConfig.suggestedProfileId) {
                errorMessage += ` Found messaging profile "${smsConfig.suggestedProfileId}" in your Telnyx account. Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID=${smsConfig.suggestedProfileId} or reprovision the company.`;
            }
            return {
                success: false,
                error: errorMessage
            };
        }
        const messagingProfileId = companySettings.messaging_profile_id || DEFAULT_MESSAGING_PROFILE_ID;
        if (!messagingProfileId) {
            return {
                success: false,
                error: "Messaging profile is not configured for this company. Please provision communications before sending MMS."
            };
        }
        const fromAddress = await resolveOutboundPhoneNumber(supabase, companyId1, params.from, companySettings.default_outbound_number);
        if (!fromAddress) {
            return {
                success: false,
                error: "Company does not have a default outbound phone number configured."
            };
        }
        const toAddress = normalizePhoneNumber(params.to);
        const webhookUrl = await getTelnyxWebhookUrl(companyId1);
        if (!webhookUrl) {
            return {
                success: false,
                error: "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL or SITE_URL to a public https domain."
            };
        }
        if (messagingProfileId) {
            const messagingProfileStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2d$profile$2d$setup$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyMessagingProfile"])(messagingProfileId);
            if (messagingProfileStatus.needsFix) {
                return {
                    success: false,
                    error: `Messaging profile configuration issue: ${messagingProfileStatus.issues.join(", ")}. Run fixMessagingProfile() or reprovision the company.`
                };
            }
        }
        const smsCapability = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$phone$2d$number$2d$setup$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifySmsCapability"])(fromAddress);
        if (!smsCapability.hasSms) {
            return {
                success: false,
                error: smsCapability.error || "Phone number does not support SMS/MMS"
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$messaging$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendMMS"])({
            to: toAddress,
            from: fromAddress,
            text: params.text,
            mediaUrls: params.mediaUrls,
            webhookUrl,
            messagingProfileId
        });
        if (!result.success) {
            return result;
        }
        const phoneNumberId = await getPhoneNumberId(supabase, fromAddress);
        const { data, error } = await supabase.from("communications").insert({
            company_id: companyId1,
            customer_id: params.customerId,
            job_id: params.jobId ?? null,
            property_id: params.propertyId ?? null,
            invoice_id: params.invoiceId ?? null,
            estimate_id: params.estimateId ?? null,
            type: "sms",
            channel: "telnyx",
            direction: "outbound",
            from_address: fromAddress,
            to_address: toAddress,
            body: params.text || "",
            attachments: params.mediaUrls.map((url)=>({
                    url,
                    type: "image"
                })),
            attachment_count: params.mediaUrls.length,
            status: "queued",
            priority: "normal",
            phone_number_id: phoneNumberId,
            is_archived: false,
            is_automated: false,
            is_internal: false,
            is_thread_starter: true,
            telnyx_message_id: result.messageId
        }).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/communication");
        return {
            success: true,
            messageId: result.messageId,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send MMS"
        };
    }
}
async function getWebRTCCredentials() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return {
                success: false,
                error: "User not authenticated"
            };
        }
        // OPTION 1: Use static credentials from environment (recommended for production)
        const staticUsername = process.env.TELNYX_WEBRTC_USERNAME;
        const staticPassword = process.env.TELNYX_WEBRTC_PASSWORD;
        if (staticUsername && staticPassword) {
            const credential = {
                username: staticUsername,
                password: staticPassword,
                expires_at: Date.now() + 86_400 * 1000,
                realm: "sip.telnyx.com",
                sip_uri: `sip:${staticUsername}@sip.telnyx.com`,
                stun_servers: [
                    "stun:stun.telnyx.com:3478",
                    "stun:stun.telnyx.com:3479"
                ],
                turn_servers: [
                    {
                        urls: [
                            "turn:turn.telnyx.com:3478?transport=udp",
                            "turn:turn.telnyx.com:3478?transport=tcp"
                        ],
                        username: staticUsername,
                        credential: staticPassword
                    }
                ]
            };
            return {
                success: true,
                credential
            };
        }
        const { generateWebRTCToken } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/webrtc.ts [app-rsc] (ecmascript, async loader)");
        const result = await generateWebRTCToken({
            username: user.email || user.id,
            ttl: 86_400
        });
        if (!result.success) {
            return result;
        }
        return {
            success: true,
            credential: result.credential
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get WebRTC credentials"
        };
    }
}
// =====================================================================================
// VOICEMAIL OPERATIONS ACTIONS
// =====================================================================================
/**
 * Get all voicemails for a company
 */ async function getVoicemails(companyId1) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("voicemails").select(`
        *,
        customer:customers(id, first_name, last_name, email, phone),
        phone_number:phone_numbers(phone_number, formatted_number)
      `).eq("company_id", companyId1).is("deleted_at", null).order("received_at", {
            ascending: false
        });
        if (error) {
            throw error;
        }
        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get voicemails"
        };
    }
}
/**
 * Mark voicemail as read
 */ async function markVoicemailAsRead(voicemailId, userId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("voicemails").update({
            is_read: true,
            read_at: new Date().toISOString(),
            read_by: userId
        }).eq("id", voicemailId).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/communication");
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to mark voicemail as read"
        };
    }
}
/**
 * Delete voicemail
 */ async function deleteVoicemail(voicemailId, userId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { error } = await supabase.from("voicemails").update({
            deleted_at: new Date().toISOString(),
            deleted_by: userId
        }).eq("id", voicemailId);
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/communication");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete voicemail"
        };
    }
}
async function getCallRoutingRules(companyId1) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("call_routing_rules").select(`
        *,
        created_by_user:users!call_routing_rules_created_by_fkey(id, name, email),
        forward_to_user:users!call_routing_rules_forward_to_user_id_fkey(id, name, email)
      `).eq("company_id", companyId1).is("deleted_at", null).order("priority", {
            ascending: false
        });
        if (error) {
            throw error;
        }
        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get call routing rules"
        };
    }
}
/**
 * Create a new call routing rule
 */ async function createCallRoutingRule(params) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("call_routing_rules").insert({
            company_id: params.companyId,
            created_by: params.userId,
            name: params.name,
            description: params.description,
            routing_type: params.routingType,
            priority: params.priority || 0,
            business_hours: params.businessHours,
            timezone: params.timezone || "America/Los_Angeles",
            after_hours_action: params.afterHoursAction,
            after_hours_forward_to: params.afterHoursForwardTo,
            team_members: params.teamMembers,
            ring_timeout: params.ringTimeout || 20,
            ivr_menu: params.ivrMenu,
            ivr_greeting_url: params.ivrGreetingUrl,
            forward_to_number: params.forwardToNumber,
            forward_to_user_id: params.forwardToUserId,
            enable_voicemail: params.enableVoicemail !== false,
            voicemail_greeting_url: params.voicemailGreetingUrl,
            voicemail_transcription_enabled: params.voicemailTranscriptionEnabled !== false,
            voicemail_email_notifications: params.voicemailEmailNotifications !== false,
            record_calls: params.recordCalls,
            is_active: true
        }).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/call-routing");
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create call routing rule"
        };
    }
}
async function updateCallRoutingRule(params) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const updateData = {};
        if (params.name !== undefined) {
            updateData.name = params.name;
        }
        if (params.description !== undefined) {
            updateData.description = params.description;
        }
        if (params.priority !== undefined) {
            updateData.priority = params.priority;
        }
        if (params.businessHours !== undefined) {
            updateData.business_hours = params.businessHours;
        }
        if (params.timezone !== undefined) {
            updateData.timezone = params.timezone;
        }
        if (params.afterHoursAction !== undefined) {
            updateData.after_hours_action = params.afterHoursAction;
        }
        if (params.afterHoursForwardTo !== undefined) {
            updateData.after_hours_forward_to = params.afterHoursForwardTo;
        }
        if (params.teamMembers !== undefined) {
            updateData.team_members = params.teamMembers;
        }
        if (params.ringTimeout !== undefined) {
            updateData.ring_timeout = params.ringTimeout;
        }
        if (params.ivrMenu !== undefined) {
            updateData.ivr_menu = params.ivrMenu;
        }
        if (params.ivrGreetingUrl !== undefined) {
            updateData.ivr_greeting_url = params.ivrGreetingUrl;
        }
        if (params.forwardToNumber !== undefined) {
            updateData.forward_to_number = params.forwardToNumber;
        }
        if (params.forwardToUserId !== undefined) {
            updateData.forward_to_user_id = params.forwardToUserId;
        }
        if (params.enableVoicemail !== undefined) {
            updateData.enable_voicemail = params.enableVoicemail;
        }
        if (params.voicemailGreetingUrl !== undefined) {
            updateData.voicemail_greeting_url = params.voicemailGreetingUrl;
        }
        if (params.voicemailTranscriptionEnabled !== undefined) {
            updateData.voicemail_transcription_enabled = params.voicemailTranscriptionEnabled;
        }
        if (params.voicemailEmailNotifications !== undefined) {
            updateData.voicemail_email_notifications = params.voicemailEmailNotifications;
        }
        if (params.recordCalls !== undefined) {
            updateData.record_calls = params.recordCalls;
        }
        if (params.isActive !== undefined) {
            updateData.is_active = params.isActive;
        }
        const { data, error } = await supabase.from("call_routing_rules").update(updateData).eq("id", params.ruleId).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/call-routing");
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update call routing rule"
        };
    }
}
async function deleteCallRoutingRule(ruleId, userId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { error } = await supabase.from("call_routing_rules").update({
            deleted_at: new Date().toISOString(),
            deleted_by: userId
        }).eq("id", ruleId);
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/call-routing");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete call routing rule"
        };
    }
}
async function toggleCallRoutingRule(ruleId, isActive) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const { data, error } = await supabase.from("call_routing_rules").update({
            is_active: isActive
        }).eq("id", ruleId).select().single();
        if (error) {
            throw error;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/communications/call-routing");
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle call routing rule"
        };
    }
}
// =====================================================================================
// PHONE NUMBER USAGE STATISTICS ACTIONS
// =====================================================================================
/**
 * Get usage statistics for a phone number
 */ async function getPhoneNumberUsageStats(phoneNumberId, days = 30) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        // Get call statistics
        const { data: callStats, error: callError } = await supabase.from("communications").select("type, direction, status, call_duration, created_at").eq("type", "phone").eq("phone_number_id", phoneNumberId).gte("created_at", startDate.toISOString());
        if (callError) {
            throw callError;
        }
        // Get SMS statistics
        const { data: smsStats, error: smsError } = await supabase.from("communications").select("type, direction, status, created_at").eq("type", "sms").eq("phone_number_id", phoneNumberId).gte("created_at", startDate.toISOString());
        if (smsError) {
            throw smsError;
        }
        // Calculate aggregates
        const calls = callStats || [];
        const sms = smsStats || [];
        const incomingCalls = calls.filter((c)=>c.direction === "inbound").length;
        const outgoingCalls = calls.filter((c)=>c.direction === "outbound").length;
        const totalCallDuration = calls.reduce((sum, c)=>sum + (c.call_duration || 0), 0);
        const incomingSms = sms.filter((s)=>s.direction === "inbound").length;
        const outgoingSms = sms.filter((s)=>s.direction === "outbound").length;
        return {
            success: true,
            data: {
                incomingCalls,
                outgoingCalls,
                totalCalls: incomingCalls + outgoingCalls,
                totalCallDuration,
                incomingSms,
                outgoingSms,
                totalSms: incomingSms + outgoingSms,
                dailyStats: aggregateDailyStats([
                    ...calls,
                    ...sms
                ], days)
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get usage statistics"
        };
    }
}
/**
 * Get company-wide usage statistics
 */ async function getCompanyUsageStats(companyId1, days = 30) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service unavailable"
            };
        }
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        // Get all communications for the company
        const { data: communications, error } = await supabase.from("communications").select("type, direction, status, call_duration, created_at").eq("company_id", companyId1).in("type", [
            "phone",
            "sms"
        ]).gte("created_at", startDate.toISOString());
        if (error) {
            throw error;
        }
        const items = communications || [];
        const calls = items.filter((i)=>i.type === "phone");
        const sms = items.filter((i)=>i.type === "sms");
        const incomingCalls = calls.filter((c)=>c.direction === "inbound").length;
        const outgoingCalls = calls.filter((c)=>c.direction === "outbound").length;
        const totalCallDuration = calls.reduce((sum, c)=>sum + (c.call_duration || 0), 0);
        const incomingSms = sms.filter((s)=>s.direction === "inbound").length;
        const outgoingSms = sms.filter((s)=>s.direction === "outbound").length;
        return {
            success: true,
            data: {
                incomingCalls,
                outgoingCalls,
                totalCalls: incomingCalls + outgoingCalls,
                totalCallDuration,
                averageCallDuration: calls.length > 0 ? totalCallDuration / calls.length : 0,
                incomingSms,
                outgoingSms,
                totalSms: incomingSms + outgoingSms,
                dailyStats: aggregateDailyStats(items, days)
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get usage statistics"
        };
    }
}
/**
 * Helper function to aggregate daily statistics
 */ function aggregateDailyStats(items, days) {
    const dailyStats = {};
    // Initialize all days
    for(let i = 0; i < days; i++){
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        dailyStats[dateStr] = {
            date: dateStr,
            calls: 0,
            sms: 0,
            duration: 0
        };
    }
    // Aggregate data
    items.forEach((item)=>{
        const dateStr = item.created_at.split("T")[0];
        if (dailyStats[dateStr]) {
            if (item.type === "phone") {
                dailyStats[dateStr].calls += 1;
                dailyStats[dateStr].duration += item.call_duration || 0;
            } else if (item.type === "sms") {
                dailyStats[dateStr].sms += 1;
            }
        }
    });
    return Object.values(dailyStats).sort((a, b)=>a.date.localeCompare(b.date));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    searchPhoneNumbers,
    purchasePhoneNumber,
    getCompanyPhoneNumbers,
    makeCall,
    startCallRecording,
    stopCallRecording,
    transferActiveCall,
    transcribeCallRecording,
    sendTextMessage,
    sendMMSMessage,
    getWebRTCCredentials,
    getCallRoutingRules,
    updateCallRoutingRule,
    deleteCallRoutingRule,
    toggleCallRoutingRule
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchPhoneNumbers, "4063a33d571d6985e25da4111beb44c82ca57cb53a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(purchasePhoneNumber, "40a8248de9409aa878e0944497faaa0fba5a84e97b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyPhoneNumbers, "4048e2e9f024fac21b381ed351553fd4d64d78f5d6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(makeCall, "4035496a233e28ec394eae2146957ccf9f344cb802", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(startCallRecording, "40e9b4592b7430c75572741960a36336d9be9f7ae0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(stopCallRecording, "40b8d713ea0a1ff9c9961eb1d6e32fbd00001de582", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(transferActiveCall, "40d259c746bf68bfc52ee1035f65b7d5d348fb2beb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(transcribeCallRecording, "402df083194dc791ac0abbcd344b35a396096a15b3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendTextMessage, "40cc98b523af2697e773d1f6877af0bf64071f040d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendMMSMessage, "40012be04999490b3a8f8ee0e26fe3cfea793d7855", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWebRTCCredentials, "004241027febea2f30c3534c791cf4abf0b187afa3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCallRoutingRules, "40259eeac04557a955e11bfd26ce80f5e72f4ecf77", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCallRoutingRule, "40703cc80f332fb0d2865d96ada3ac45791ca0d136", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCallRoutingRule, "605f35c197a79197cf2e4c607de39464ecc7c51b7a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleCallRoutingRule, "6034c4a4b3c4dea02619bf6b784012d8307475751a", null);
}),
"[project]/packages/shared/src/onboarding.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utilities for determining onboarding completion across server components
 * and API routes. Keeps the logic centralized so we can evolve the rules
 * (e.g. adding new steps) without hunting down scattered checks.
 */ __turbopack_context__.s([
    "getCurrentOnboardingStep",
    ()=>getCurrentOnboardingStep,
    "getMissingRequiredSteps",
    ()=>getMissingRequiredSteps,
    "getOnboardingProgress",
    ()=>getOnboardingProgress,
    "isOnboardingComplete",
    ()=>isOnboardingComplete
]);
// Must match STEPS_ORDER from onboarding-store.ts
const REQUIRED_STEPS = [
    "welcome",
    "company"
];
const FINAL_STEP = "complete";
function isOnboardingComplete(options) {
    const { progress, completedAt } = options;
    // Primary check: completedAt timestamp from database
    if (completedAt) {
        return true;
    }
    if (!progress || typeof progress !== "object") {
        return false;
    }
    const progressRecord = progress;
    // Check onboardingCompleted flag
    if (progressRecord.onboardingCompleted === true) {
        return true;
    }
    // Check if completedSteps array includes the final step
    const completedSteps = progressRecord.completedSteps;
    if (Array.isArray(completedSteps) && completedSteps.includes(FINAL_STEP)) {
        return true;
    }
    return false;
}
function getOnboardingProgress(options) {
    const { progress } = options;
    if (!progress || typeof progress !== "object") {
        return 0;
    }
    const progressRecord = progress;
    const completedSteps = progressRecord.completedSteps;
    const skippedSteps = progressRecord.skippedSteps;
    if (!Array.isArray(completedSteps)) {
        return 0;
    }
    const totalSteps = 14; // Total steps in onboarding
    const finishedCount = completedSteps.length + (Array.isArray(skippedSteps) ? skippedSteps.length : 0);
    return Math.round(finishedCount / totalSteps * 100);
}
function getMissingRequiredSteps(options) {
    const { progress } = options;
    if (!progress || typeof progress !== "object") {
        return [
            ...REQUIRED_STEPS
        ];
    }
    const progressRecord = progress;
    const completedSteps = progressRecord.completedSteps;
    if (!Array.isArray(completedSteps)) {
        return [
            ...REQUIRED_STEPS
        ];
    }
    return REQUIRED_STEPS.filter((step)=>!completedSteps.includes(step));
}
function getCurrentOnboardingStep(options) {
    const { progress } = options;
    if (!progress || typeof progress !== "object") {
        return "welcome";
    }
    const progressRecord = progress;
    const currentStep = progressRecord.currentStep;
    if (typeof currentStep === "string" && currentStep.length > 0) {
        return currentStep;
    }
    return "welcome";
}
}),
"[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Session Management Utilities - Server Component Helpers
 *
 * Features:
 * - Get current authenticated user
 * - Get current session
 * - Require authentication (throw error if not authenticated)
 * - Check user permissions and roles
 * - Server Component compatible
 */ __turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "requireUser",
    ()=>requireUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
;
;
const getCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        // Use getUser() to authenticate with Supabase Auth server
        // This verifies the session is valid and not tampered with
        const { data: { user }, error } = await supabase.auth.getUser();
        // Handle error - could be AuthSessionMissingError or network error
        if (error) {
            // AuthSessionMissingError is expected when user is not authenticated
            // Don't log this as an error, just return null
            if (error.name === "AuthSessionMissingError") {
                return null;
            }
            return null;
        }
        return user;
    } catch (error) {
        // Catch any unexpected errors (network issues, etc.)
        // The error might be thrown instead of returned in some cases
        if (error && typeof error === "object" && "name" in error && error.name === "AuthSessionMissingError") {
            return null;
        }
        return null;
    }
});
/**
 * Get Session - Cached for performance
 *
 * Returns the current session or null if not authenticated.
 * Cached per request to avoid multiple database calls.
 */ const getSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            return null;
        }
        return session;
    } catch (_error) {
        return null;
    }
});
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Authentication required. Please log in to continue.");
    }
    return user;
}
/**
 * Require Session - Throw error if no session
 *
 * Use this when you need both user and session data (e.g., access token).
 */ async function requireSession() {
    const session = await getSession();
    if (!session) {
        throw new Error("Active session required. Please log in to continue.");
    }
    return session;
}
/**
 * Check if user is authenticated
 *
 * Returns true if user is authenticated, false otherwise.
 * Useful for conditional rendering in Server Components.
 */ async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}
/**
 * Get User Metadata
 *
 * Returns user metadata from Supabase Auth.
 * Useful for accessing additional user properties stored in auth.users.
 */ async function getUserMetadata() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    return user.user_metadata || null;
}
/**
 * Check User Email Verified
 *
 * Returns true if user's email is verified, false otherwise.
 */ async function isEmailVerified() {
    const user = await getCurrentUser();
    if (!user) {
        return false;
    }
    return user.email_confirmed_at !== undefined;
}
/**
 * Get User ID
 *
 * Returns the user's ID or null if not authenticated.
 * Convenient helper for getting just the user ID.
 */ async function getUserId() {
    const user = await getCurrentUser();
    return user?.id || null;
}
/**
 * Get User Email
 *
 * Returns the user's email or null if not authenticated.
 */ async function getUserEmail() {
    const user = await getCurrentUser();
    return user?.email || null;
}
/**
 * Get Access Token
 *
 * Returns the current access token for API calls.
 * Useful for calling external APIs that require authentication.
 */ async function getAccessToken() {
    const session = await getSession();
    return session?.access_token || null;
}
/**
 * Refresh Session
 *
 * Manually refresh the session to get a new access token.
 * Usually not needed as Supabase handles this automatically.
 */ async function refreshSession() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) {
            return null;
        }
        return session;
    } catch (_error) {
        return null;
    }
}
}),
"[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Company Context Management
 *
 * Handles multi-tenancy by tracking and switching between companies
 * for users who may be members of multiple companies.
 *
 * Features:
 * - Active company stored in HTTP-only cookie
 * - Falls back to first available company
 * - Validates access before switching
 * - Server-side only (no client-side state)
 *
 * PERFORMANCE: All functions wrapped with React.cache() to prevent
 * redundant database queries across components in the same request.
 */ __turbopack_context__.s([
    "clearActiveCompany",
    ()=>clearActiveCompany,
    "getActiveCompany",
    ()=>getActiveCompany,
    "getActiveCompanyId",
    ()=>getActiveCompanyId,
    "getActiveTeamMemberId",
    ()=>getActiveTeamMemberId,
    "getUserCompanies",
    ()=>getUserCompanies,
    "isActiveCompanyOnboardingComplete",
    ()=>isActiveCompanyOnboardingComplete,
    "requireActiveCompany",
    ()=>requireActiveCompany,
    "setActiveCompany",
    ()=>setActiveCompany
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$onboarding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/onboarding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const ACTIVE_COMPANY_COOKIE = "active_company_id";
const getActiveCompanyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    let cookieStore;
    try {
        cookieStore = await cookies();
    } catch (error) {
        // During prerendering, cookies() may reject - return null
        // This allows PPR to work correctly
        if (error instanceof Error && (error.message.includes("During prerendering") || error.message.includes("prerendering") || error.message.includes("cookies()"))) {
            return null;
        }
        throw error;
    }
    const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;
    if (activeCompanyId) {
        // Verify user still has access to this company
        const hasAccess = await verifyCompanyAccess(activeCompanyId);
        if (hasAccess) {
            return activeCompanyId;
        }
    }
    // Fall back to first available company
    const companies = await getUserCompanies();
    return companies[0]?.id || null;
});
const getActiveCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const companyId = await getActiveCompanyId();
    if (!companyId) {
        return null;
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return null;
    }
    const { data: company } = await supabase.from("companies").select("id, name, logo, phone, email").eq("id", companyId).is("deleted_at", null) // Exclude archived companies
    .single();
    return company;
});
async function setActiveCompany(companyId) {
    // Verify access before switching
    const hasAccess = await verifyCompanyAccess(companyId);
    if (!hasAccess) {
        throw new Error("You don't have access to this company");
    }
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
    });
}
async function clearActiveCompany() {
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    const cookieStore = await cookies();
    cookieStore.delete(ACTIVE_COMPANY_COOKIE);
}
const getUserCompanies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return [];
    }
    // Use service role to bypass RLS recursion on JOIN
    // Query is safe: explicitly filtered to user's own records
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    if (!supabase) {
        return [];
    }
    const { data: memberships } = await supabase.from("company_memberships").select(`
      company_id,
      companies!inner (
        id,
        name,
        logo,
        deleted_at,
        onboarding_completed_at
      )
    `).eq("user_id", user.id).eq("status", "active").is("companies.deleted_at", null); // Exclude archived companies
    if (!memberships) {
        return [];
    }
    // Sort companies: prioritize completed onboarding over incomplete
    const sorted = memberships.sort((a, b)=>{
        const aCompleted = !!a.companies.onboarding_completed_at;
        const bCompleted = !!b.companies.onboarding_completed_at;
        // Completed companies first
        if (aCompleted && !bCompleted) return -1;
        if (!aCompleted && bCompleted) return 1;
        // Then by name alphabetically
        return a.companies.name.localeCompare(b.companies.name);
    });
    return sorted.map((m)=>({
            id: m.companies.id,
            name: m.companies.name,
            logo: m.companies.logo
        }));
});
/**
 * Verify Company Access
 *
 * Checks if user has access to a company.
 *
 * @param companyId - Company ID to verify
 * @returns true if user has access, false otherwise
 */ const verifyCompanyAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (companyId)=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return false;
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return false;
    }
    // Parallel queries instead of sequential (saves 20-30ms)
    const [companyResult, memberResult] = await Promise.all([
        // Check if company exists and is not archived
        supabase.from("companies").select("id").eq("id", companyId).is("deleted_at", null).single(),
        // Check if user has active membership
        supabase.from("company_memberships").select("id").eq("user_id", user.id).eq("company_id", companyId).eq("status", "active").single()
    ]);
    // Both must succeed
    return !!(companyResult.data && memberResult.data);
});
const getActiveTeamMemberId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return null;
    }
    const companyId = await getActiveCompanyId();
    if (!companyId) {
        return null;
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return null;
    }
    const { data: teamMember } = await supabase.from("team_members").select("id").eq("user_id", user.id).eq("company_id", companyId).eq("status", "active").single();
    return teamMember?.id || null;
});
async function requireActiveCompany() {
    const companyId = await getActiveCompanyId();
    if (!companyId) {
        throw new Error("No active company selected. Please select a company.");
    }
    return companyId;
}
/**
 * Check if User Has Multiple Companies
 *
 * Useful for conditionally showing company switcher UI.
 *
 * @returns true if user has 2+ companies, false otherwise
 */ async function hasMultipleCompanies() {
    const companies = await getUserCompanies();
    return companies.length > 1;
}
async function isActiveCompanyOnboardingComplete() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return false;
    }
    const activeCompanyId = await getActiveCompanyId();
    if (!activeCompanyId) {
        return false;
    }
    // Use service role to bypass RLS recursion on JOIN
    // Query is safe: explicitly filtered to user's own record
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    if (!supabase) {
        return false;
    }
    // Check the ACTIVE company's payment status
    const { data: teamMember } = await supabase.from("company_memberships").select("company_id, companies!inner(stripe_subscription_status, onboarding_progress, onboarding_completed_at)").eq("user_id", user.id).eq("company_id", activeCompanyId).eq("status", "active").maybeSingle();
    if (!teamMember) {
        return false;
    }
    const companies = Array.isArray(teamMember.companies) ? teamMember.companies[0] : teamMember.companies;
    const subscriptionStatus = companies?.stripe_subscription_status;
    const subscriptionActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";
    const onboardingProgress = companies?.onboarding_progress || null;
    const onboardingFinished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$onboarding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOnboardingComplete"])({
        progress: onboardingProgress,
        completedAt: companies?.onboarding_completed_at ?? null
    });
    return subscriptionActive && onboardingFinished || ("TURBOPACK compile-time value", "development") === "development";
}
}),
"[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/auth package for backwards compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
;
}),
"[project]/packages/auth/src/user-data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * User Data Utilities - Secure, Cached User Data Retrieval
 *
 * Performance optimizations:
 * - React cache() for request-level memoization
 * - Supabase RLS enforces security at database level
 * - Type-safe with full TypeScript support
 * - Automatic avatar generation if none provided
 */ __turbopack_context__.s([
    "getUserCompaniesWithStatus",
    ()=>getUserCompaniesWithStatus,
    "getUserCompanyId",
    ()=>getUserCompanyId,
    "getUserProfile",
    ()=>getUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$onboarding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/onboarding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const getUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        // Get authenticated user from Supabase Auth
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return null;
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            // Return mock user for development
            return {
                id: "dev-user-1",
                full_name: "Development User",
                email: "dev@example.com",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
                emailVerified: true,
                createdAt: new Date()
            };
        }
        // Fetch user profile from public.users table (with RLS)
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (error) {
            return getUserProfileFromAuth(user);
        }
        // Merge auth data with profile data
        return {
            id: user.id,
            full_name: profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email || profile?.email || "",
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || generateAvatar(user.email || profile?.email),
            bio: profile?.bio || undefined,
            phone: profile?.phone || undefined,
            status: profile?.status || "online",
            emailVerified: !!user.email_confirmed_at,
            createdAt: new Date(profile?.created_at || user.created_at)
        };
    } catch (_error) {
        return {
            id: "dev-user-1",
            full_name: "Development User",
            email: "dev@example.com",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
            emailVerified: true,
            createdAt: new Date()
        };
    }
});
/**
 * Get User Profile from Auth Only
 *
 * Fallback when public.users table doesn't have the profile yet
 */ function getUserProfileFromAuth(user) {
    return {
        id: user.id,
        full_name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar_url: user.user_metadata?.avatar_url || generateAvatar(user.email),
        emailVerified: !!user.email_confirmed_at,
        createdAt: new Date(user.created_at)
    };
}
/**
 * Generate Avatar URL
 *
 * Creates a unique avatar based on user email using DiceBear API
 * Falls back to initials if no email provided
 */ function generateAvatar(email) {
    if (!email) {
        return "https://api.dicebear.com/7.x/initials/svg?seed=User";
    }
    // Use email as seed for consistent avatar
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=0ea5e9&textColor=ffffff`;
}
/**
 * Get User Initials
 *
 * Extracts initials from user name for avatar fallback
 */ function getUserInitials(name) {
    return name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0, 2);
}
/**
 * Format User Display Name
 *
 * Returns first name only for compact display
 */ function getUserDisplayName(name) {
    return name.split(" ")[0] || name;
}
/**
 * Check if User Email is Verified
 *
 * Security check for features that require verified email
 */ const isUserEmailVerified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return false;
    }
    return !!user.email_confirmed_at;
});
const getUserCompaniesWithStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return [];
        }
        // Use service role to bypass RLS recursion on JOIN
        // Query is safe: explicitly filtered to user's own records
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) {
            return [];
        }
        // Fetch user's companies via team_members join
        // Exclude archived companies (deleted_at IS NULL)
        const { data: memberships, error } = await supabase.from("company_memberships").select(`
        company_id,
        companies!inner (
          id,
          name,
          logo,
          stripe_subscription_status,
          onboarding_progress,
          onboarding_completed_at,
          deleted_at
        )
      `).eq("user_id", user.id).eq("status", "active").is("companies.deleted_at", null); // Exclude archived companies
        if (error) {
            return [];
        }
        // Map to simplified structure with onboarding status
        // Deduplicate by company ID in case of multiple team_member records
        const companyMap = new Map();
        memberships?.forEach((m)=>{
            const companyId = m.companies.id;
            if (!companyMap.has(companyId)) {
                const subscriptionStatus = m.companies.stripe_subscription_status;
                const onboardingProgress = m.companies.onboarding_progress || null;
                const onboardingComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$onboarding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOnboardingComplete"])({
                    progress: onboardingProgress,
                    completedAt: m.companies.onboarding_completed_at ?? null
                });
                const hasPayment = subscriptionStatus === "active" || subscriptionStatus === "trialing";
                let planLabel = "Active";
                if (!(hasPayment && onboardingComplete)) {
                    planLabel = subscriptionStatus === "incomplete" ? "Incomplete Onboarding" : "Setup Required";
                }
                companyMap.set(companyId, {
                    id: companyId,
                    name: m.companies.name,
                    logo: m.companies.logo,
                    plan: planLabel,
                    onboardingComplete,
                    hasPayment
                });
            }
        });
        return Array.from(companyMap.values());
    } catch (_error) {
        return [];
    }
});
const getUserCompanyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return null;
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        // Get first active company membership
        const { data: membership, error } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").limit(1).single();
        if (error) {
            return null;
        }
        return membership?.company_id || null;
    } catch (_error) {
        return null;
    }
});
/**
 * Update User Profile
 *
 * Securely updates user profile data
 * RLS ensures users can only update their own profile
 */ async function updateUserProfile(updates) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return {
                success: false,
                error: "Not authenticated"
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Service not available"
            };
        }
        // Update profiles table (RLS enforced)
        const { error } = await supabase.from("profiles").update({
            ...updates,
            updated_at: new Date().toISOString()
        }).eq("id", user.id);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        // If updating full_name or avatar_url, also update auth metadata
        if (updates.full_name || updates.avatar_url) {
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    name: updates.full_name,
                    avatar_url: updates.avatar_url
                }
            });
            if (authError) {
            // Don't fail the whole operation if auth update fails
            }
        }
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Update failed"
        };
    }
}
}),
"[project]/apps/web/src/lib/auth/user-data.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/auth package for backwards compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$user$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/user-data.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/web/src/components/layout/app-header-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AppHeaderClient",
    ()=>AppHeaderClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppHeaderClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppHeaderClient() from the server but AppHeaderClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/app-header-client.tsx <module evaluation>", "AppHeaderClient");
}),
"[project]/apps/web/src/components/layout/app-header-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AppHeaderClient",
    ()=>AppHeaderClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppHeaderClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppHeaderClient() from the server but AppHeaderClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/app-header-client.tsx", "AppHeaderClient");
}),
"[project]/apps/web/src/components/layout/app-header-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/layout/app-header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppHeader",
    ()=>AppHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$user$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/user-data.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$user$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/user-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header-client.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function AppHeader() {
    // For now, always pass null - the client component will handle sub-header detection
    const subHeaderComponent = null;
    // Fetch user profile and companies on server (cached with React cache())
    // This runs on server BEFORE sending HTML to client
    // Handle prerender cookie access gracefully
    let userProfile;
    let companies;
    let activeCompanyId;
    try {
        [userProfile, companies, activeCompanyId] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$user$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserCompanies"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])()
        ]);
    } catch (error) {
        // During prerendering, cookies() may reject - this is expected
        // Return null and let the client-side handle it
        if (error instanceof Error && error.message.includes("prerendering")) {
            return null;
        }
        // Log error for monitoring but don't expose details to user
        console.error("AppHeader: Failed to fetch user data", error);
        throw error; // Let error boundary handle it
    }
    // If no user, this should never happen because dashboard is protected by middleware
    // But we handle it gracefully anyway
    if (!userProfile) {
        return null; // Middleware will redirect to login
    }
    // Fetch ONLY company phone numbers on server
    // PERFORMANCE: Customer data is lazy-loaded on client when dialer opens
    // This saves 400-800ms per page load by not fetching ALL customers upfront
    let companyPhones = [];
    let hasPhoneNumbers = false;
    let hasPayrixAccount = false;
    let payrixStatus = null;
    if (activeCompanyId) {
        try {
            const [phonesResult, payrixResult] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyPhoneNumbers"])(activeCompanyId),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPayrixMerchantAccount"])(activeCompanyId)
            ]);
            if (phonesResult.success && phonesResult.data) {
                companyPhones = phonesResult.data.map((p)=>({
                        id: p.id,
                        number: p.phone_number,
                        label: p.formatted_number || p.phone_number
                    }));
                hasPhoneNumbers = phonesResult.data.length > 0;
            }
            if (payrixResult.success && payrixResult.data) {
                hasPayrixAccount = true;
                payrixStatus = payrixResult.data.status;
            }
        } catch (_error) {
        // Continue without phone/payrix data - component will handle empty array
        }
    }
    // Pass server-fetched data to client component for interactivity
    // Customers will be lazy-loaded on client side when dialer is opened
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppHeaderClient"], {
        activeCompanyId: activeCompanyId,
        companies: companies,
        companyPhones: companyPhones,
        userProfile: userProfile,
        hasPhoneNumbers: hasPhoneNumbers,
        hasPayrixAccount: hasPayrixAccount,
        payrixStatus: payrixStatus,
        subHeader: subHeaderComponent
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/app-header.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/web/src/components/layout/app-header-error-boundary.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AppHeaderErrorBoundary",
    ()=>AppHeaderErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppHeaderErrorBoundary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppHeaderErrorBoundary() from the server but AppHeaderErrorBoundary is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/app-header-error-boundary.tsx <module evaluation>", "AppHeaderErrorBoundary");
}),
"[project]/apps/web/src/components/layout/app-header-error-boundary.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AppHeaderErrorBoundary",
    ()=>AppHeaderErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppHeaderErrorBoundary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppHeaderErrorBoundary() from the server but AppHeaderErrorBoundary is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/app-header-error-boundary.tsx", "AppHeaderErrorBoundary");
}),
"[project]/apps/web/src/components/layout/app-header-error-boundary.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$error$2d$boundary$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header-error-boundary.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$error$2d$boundary$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header-error-boundary.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$error$2d$boundary$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/lib/auth/session.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/auth package for backwards compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/web/src/components/layout/dashboard-auth-wrapper.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardAuthWrapper",
    ()=>DashboardAuthWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/session.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)");
;
;
async function DashboardAuthWrapper() {
    // Check authentication - redirect to login if not authenticated
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login?message=Please log in to access the dashboard");
    }
    // NOTE: Onboarding redirect logic temporarily disabled
    // Users can access any dashboard page regardless of onboarding status
    // The welcome/onboarding page is available at /dashboard/welcome
    // This component renders nothing - it only performs auth checks and redirects
    return null;
}
}),
"[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "IncomingCallNotificationWrapper",
    ()=>IncomingCallNotificationWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const IncomingCallNotificationWrapper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call IncomingCallNotificationWrapper() from the server but IncomingCallNotificationWrapper is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx <module evaluation>", "IncomingCallNotificationWrapper");
}),
"[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "IncomingCallNotificationWrapper",
    ()=>IncomingCallNotificationWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const IncomingCallNotificationWrapper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call IncomingCallNotificationWrapper() from the server but IncomingCallNotificationWrapper is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx", "IncomingCallNotificationWrapper");
}),
"[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$incoming$2d$call$2d$notification$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$incoming$2d$call$2d$notification$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$incoming$2d$call$2d$notification$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "MobileBottomTabsWrapper",
    ()=>MobileBottomTabsWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const MobileBottomTabsWrapper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call MobileBottomTabsWrapper() from the server but MobileBottomTabsWrapper is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx <module evaluation>", "MobileBottomTabsWrapper");
}),
"[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "MobileBottomTabsWrapper",
    ()=>MobileBottomTabsWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const MobileBottomTabsWrapper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call MobileBottomTabsWrapper() from the server but MobileBottomTabsWrapper is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx", "MobileBottomTabsWrapper");
}),
"[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$tabs$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$tabs$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$tabs$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/layout/notifications-initializer.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "NotificationsInitializer",
    ()=>NotificationsInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NotificationsInitializer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NotificationsInitializer() from the server but NotificationsInitializer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/notifications-initializer.tsx <module evaluation>", "NotificationsInitializer");
}),
"[project]/apps/web/src/components/layout/notifications-initializer.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "NotificationsInitializer",
    ()=>NotificationsInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NotificationsInitializer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NotificationsInitializer() from the server but NotificationsInitializer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/layout/notifications-initializer.tsx", "NotificationsInitializer");
}),
"[project]/apps/web/src/components/layout/notifications-initializer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$notifications$2d$initializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/notifications-initializer.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$notifications$2d$initializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/notifications-initializer.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$notifications$2d$initializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/support/support-session-provider.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "SupportSessionProvider",
    ()=>SupportSessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SupportSessionProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SupportSessionProvider() from the server but SupportSessionProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/support/support-session-provider.tsx <module evaluation>", "SupportSessionProvider");
}),
"[project]/apps/web/src/components/support/support-session-provider.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "SupportSessionProvider",
    ()=>SupportSessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SupportSessionProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SupportSessionProvider() from the server but SupportSessionProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/support/support-session-provider.tsx", "SupportSessionProvider");
}),
"[project]/apps/web/src/components/support/support-session-provider.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$support$2f$support$2d$session$2d$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/support/support-session-provider.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$support$2f$support$2d$session$2d$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/support/support-session-provider.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$support$2f$support$2d$session$2d$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/app/(dashboard)/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$error$2d$boundary$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/app-header-error-boundary.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$dashboard$2d$auth$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/dashboard-auth-wrapper.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$incoming$2d$call$2d$notification$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/incoming-call-notification-wrapper.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$tabs$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/mobile-bottom-tabs-wrapper.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$notifications$2d$initializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/notifications-initializer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$support$2f$support$2d$session$2d$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/support/support-session-provider.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
function DashboardLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-dashboard-layout": true,
        className: "flex h-full flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2d$error$2d$boundary$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppHeaderErrorBoundary"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
                    fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(HeaderSkeleton, {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                        lineNumber: 32,
                        columnNumber: 25
                    }, void 0),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$app$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppHeader"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                        lineNumber: 33,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                    lineNumber: 32,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                lineNumber: 31,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$notifications$2d$initializer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NotificationsInitializer"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                lineNumber: 38,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$incoming$2d$call$2d$notification$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IncomingCallNotificationWrapper"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                lineNumber: 41,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: null,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$dashboard$2d$auth$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardAuthWrapper"], {}, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                    lineNumber: 45,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                lineNumber: 44,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$support$2f$support$2d$session$2d$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SupportSessionProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    id: "main-content",
                    className: "flex-1 flex flex-col overflow-y-auto pb-16 lg:pb-0",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                    lineNumber: 51,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                lineNumber: 50,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$mobile$2d$bottom$2d$tabs$2d$wrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MobileBottomTabsWrapper"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                lineNumber: 57,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, this);
}
// Header skeleton - renders instantly while header loads
function HeaderSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-14 items-center px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-muted h-8 w-32 animate-pulse rounded"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                            lineNumber: 69,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex md:gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted h-8 w-20 animate-pulse rounded"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                                    lineNumber: 73,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted h-8 w-20 animate-pulse rounded"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                                    lineNumber: 74,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted h-8 w-20 animate-pulse rounded"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                                    lineNumber: 75,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                            lineNumber: 72,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                    lineNumber: 67,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-muted size-8 animate-pulse rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                            lineNumber: 81,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-muted size-8 animate-pulse rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                            lineNumber: 82,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
                    lineNumber: 80,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
            lineNumber: 66,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/layout.tsx",
        lineNumber: 65,
        columnNumber: 3
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__070d8254._.js.map