module.exports = [
"[project]/apps/web/src/lib/email/domain-validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Domain Validation Utilities for Multi-Tenant Email System
 *
 * Features:
 * - Subdomain enforcement for reputation isolation
 * - Domain ownership validation
 * - Blocked domain detection (public email providers)
 * - Tier-based domain allocation
 */ // Blocked domains - public email providers that shouldn't be registered
__turbopack_context__.s([
    "canRegisterMoreDomains",
    ()=>canRegisterMoreDomains,
    "generatePlatformSubdomain",
    ()=>generatePlatformSubdomain,
    "generateSendingAddress",
    ()=>generateSendingAddress,
    "getDomainConfig",
    ()=>getDomainConfig,
    "parseDomain",
    ()=>parseDomain,
    "suggestSubdomains",
    ()=>suggestSubdomains,
    "validateDomain",
    ()=>validateDomain,
    "validateEmailAddress",
    ()=>validateEmailAddress
]);
const BLOCKED_DOMAINS = new Set([
    // Major providers
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "msn.com",
    "aol.com",
    "icloud.com",
    "me.com",
    "mac.com",
    // Other common providers
    "protonmail.com",
    "proton.me",
    "zoho.com",
    "mail.com",
    "gmx.com",
    "yandex.com",
    "fastmail.com",
    // Temporary email services
    "tempmail.com",
    "guerrillamail.com",
    "mailinator.com",
    "10minutemail.com",
    "throwaway.email",
    // Big tech
    "google.com",
    "microsoft.com",
    "apple.com",
    "amazon.com",
    "facebook.com",
    "meta.com"
]);
// Reserved subdomains that companies cannot use
const RESERVED_SUBDOMAINS = new Set([
    "mail",
    "email",
    "smtp",
    "pop",
    "imap",
    "webmail",
    "mx",
    "ns",
    "dns",
    "www",
    "api",
    "app",
    "admin",
    "support",
    "help",
    "billing",
    "status"
]);
function getDomainConfig() {
    return {
        allowCustomDomain: true,
        requireSubdomain: false,
        maxDomainsAllowed: 10
    };
}
function parseDomain(domain) {
    const normalized = domain.toLowerCase().trim();
    const parts = normalized.split(".");
    if (parts.length < 2) {
        return {
            subdomain: null,
            rootDomain: normalized,
            tld: ""
        };
    }
    // Handle common multi-part TLDs (co.uk, com.au, etc.)
    const multiPartTlds = [
        "co.uk",
        "com.au",
        "co.nz",
        "com.br",
        "co.jp"
    ];
    const lastTwo = parts.slice(-2).join(".");
    if (multiPartTlds.includes(lastTwo) && parts.length > 2) {
        const tld = lastTwo;
        const rootDomain = parts.slice(-3).join(".");
        const subdomain = parts.length > 3 ? parts.slice(0, -3).join(".") : null;
        return {
            subdomain,
            rootDomain,
            tld
        };
    }
    const tld = parts[parts.length - 1];
    const rootDomain = parts.slice(-2).join(".");
    const subdomain = parts.length > 2 ? parts.slice(0, -2).join(".") : null;
    return {
        subdomain,
        rootDomain,
        tld
    };
}
function validateDomain(domain) {
    if (!domain || typeof domain !== "string") {
        return {
            valid: false,
            error: "Domain is required"
        };
    }
    const normalized = domain.toLowerCase().trim();
    // Basic format validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
    if (!domainRegex.test(normalized)) {
        return {
            valid: false,
            error: "Invalid domain format"
        };
    }
    // Check for blocked domains
    const { rootDomain, subdomain } = parseDomain(normalized);
    if (BLOCKED_DOMAINS.has(rootDomain)) {
        return {
            valid: false,
            error: `Cannot register public email provider domain: ${rootDomain}`
        };
    }
    // Check for reserved subdomains
    if (subdomain && RESERVED_SUBDOMAINS.has(subdomain.split(".")[0])) {
        return {
            valid: false,
            error: `Subdomain "${subdomain}" is reserved. Please use a different subdomain.`
        };
    }
    return {
        valid: true,
        normalizedDomain: normalized,
        isSubdomain: !!subdomain,
        rootDomain,
        subdomain: subdomain || undefined
    };
}
function generatePlatformSubdomain(companySlug) {
    const sanitized = companySlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const platformDomain = process.env.PLATFORM_EMAIL_DOMAIN || "mail.stratos.app";
    return `${sanitized}.${platformDomain}`;
}
function generateSendingAddress(companySlug, domain, type = "notifications") {
    return `${type}@${domain}`;
}
function canRegisterMoreDomains(currentDomainCount) {
    const config = getDomainConfig();
    if (currentDomainCount >= config.maxDomainsAllowed) {
        return {
            allowed: false,
            reason: `Maximum ${config.maxDomainsAllowed} domain(s) allowed. Contact support if you need more.`
        };
    }
    return {
        allowed: true
    };
}
function suggestSubdomains(rootDomain) {
    return [
        `mail.${rootDomain}`,
        `notifications.${rootDomain}`,
        `updates.${rootDomain}`,
        `alerts.${rootDomain}`,
        `messages.${rootDomain}`
    ];
}
function validateEmailAddress(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            valid: false,
            error: "Invalid email format"
        };
    }
    const [local, domain] = email.split("@");
    if (local.length > 64) {
        return {
            valid: false,
            error: "Local part of email is too long"
        };
    }
    if (domain.length > 255) {
        return {
            valid: false,
            error: "Domain part of email is too long"
        };
    }
    return {
        valid: true,
        local,
        domain
    };
}
}),
"[project]/apps/web/src/lib/email/resend-domains.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00034a51a320c0d5b7f54ee8d59e717a7e99ce617f":"listResendDomains","00509bf8dbdee843993cccfb8851f3317137b94977":"listInboundRoutes","4005ec866252400f4aaeb46de9d634a18448b2c356":"deleteResendDomain","4007018bfc795358d3a9a6d0d6d937c0a7991753fd":"createResendDomainWithValidation","4011e9cacf8d6155c1ee40d32cd9cd94f6177d36d6":"getReceivedEmail","401c96873c414c771c2ba5026eea55c296e064b1fd":"getResendDomainMetrics","4036495f31bf3f9140b8c9fe628d91d016dcd4a270":"verifyDomainDNS","4096a28b62c9710d8bfba23f608c0cf179ea514925":"verifyResendDomain","409e5323bedeb617a359f6b8a8be14be97ac9fcdad":"getResendDomain","40bd49dc437c730a7762caf74c74835647e426ebcd":"deleteInboundRoute","40bffafd1665af5bc0452006029b023b96c59418cc":"createResendDomain","40ca83b912200b8301c1887a09885cca8cabdd53a8":"verifyResendWebhookSignature","40d33335a81da2213f1f084c1d8a4dd228084c0b0b":"createInboundRoute","40dee78df261ed778ba766f7786fbad63b8bbe0cc6":"listReceivedEmailAttachments","6093c82d3d941a1f377f8191c95d6414161f28d14d":"getReceivedEmailAttachment","7f3be18bc4b87e5442b067543810626fe10d0007a3":"validateDomain","7fa57171dc8bc1fa6075f34f4d9e3cda6f46ccfa8c":"getDomainConfig","7fcdb2960bb56c59d182c55ec25686d1b6b2441be3":"canRegisterMoreDomains","7fdbff76d2cda13ad0e3edf867c0bd6f5a367d9797":"suggestSubdomains","7fe246402453c4e4f9810bdfad6dd7f9646cc53faa":"generatePlatformSubdomain"},"",""] */ __turbopack_context__.s([
    "createInboundRoute",
    ()=>createInboundRoute,
    "createResendDomain",
    ()=>createResendDomain,
    "createResendDomainWithValidation",
    ()=>createResendDomainWithValidation,
    "deleteInboundRoute",
    ()=>deleteInboundRoute,
    "deleteResendDomain",
    ()=>deleteResendDomain,
    "getReceivedEmail",
    ()=>getReceivedEmail,
    "getReceivedEmailAttachment",
    ()=>getReceivedEmailAttachment,
    "getResendDomain",
    ()=>getResendDomain,
    "getResendDomainMetrics",
    ()=>getResendDomainMetrics,
    "listInboundRoutes",
    ()=>listInboundRoutes,
    "listReceivedEmailAttachments",
    ()=>listReceivedEmailAttachments,
    "listResendDomains",
    ()=>listResendDomains,
    "verifyDomainDNS",
    ()=>verifyDomainDNS,
    "verifyResendDomain",
    ()=>verifyResendDomain,
    "verifyResendWebhookSignature",
    ()=>verifyResendWebhookSignature
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/domain-validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const RESEND_API_BASE = "https://api.resend.com";
async function resendRequest(path, init) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: "Resend API key is not configured"
        };
    }
    const response = await fetch(`${RESEND_API_BASE}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...init.headers
        }
    });
    if (!response.ok) {
        const message = (await response.json().catch(()=>null))?.message || response.statusText;
        return {
            success: false,
            error: message
        };
    }
    const data = await response.json().catch(()=>({}));
    return {
        success: true,
        data
    };
}
async function createResendDomainWithValidation(params) {
    const { domain, currentDomainCount } = params;
    // Check if company can register more domains
    const canRegister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canRegisterMoreDomains"])(currentDomainCount);
    if (!canRegister.allowed) {
        return {
            success: false,
            error: canRegister.reason || "Cannot register more domains"
        };
    }
    // Validate the domain
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateDomain"])(domain);
    if (!validation.valid) {
        return {
            success: false,
            error: validation.error || "Invalid domain",
            validation
        };
    }
    // Create domain in Resend
    const result = await resendRequest("/domains", {
        method: "POST",
        body: JSON.stringify({
            name: validation.normalizedDomain
        })
    });
    return {
        ...result,
        validation
    };
}
async function createResendDomain(name) {
    return resendRequest("/domains", {
        method: "POST",
        body: JSON.stringify({
            name
        })
    });
}
async function getResendDomain(domainId) {
    return resendRequest(`/domains/${domainId}`, {
        method: "GET"
    });
}
async function verifyResendDomain(domainId) {
    return resendRequest(`/domains/${domainId}/verify`, {
        method: "POST"
    });
}
async function deleteResendDomain(domainId) {
    return resendRequest(`/domains/${domainId}`, {
        method: "DELETE"
    });
}
async function listResendDomains() {
    return resendRequest("/domains", {
        method: "GET"
    });
}
async function createInboundRoute(params) {
    return resendRequest("/inbound", {
        method: "POST",
        body: JSON.stringify(params)
    });
}
async function deleteInboundRoute(routeId) {
    return resendRequest(`/inbound/${routeId}`, {
        method: "DELETE"
    });
}
async function listInboundRoutes() {
    return resendRequest("/inbound", {
        method: "GET"
    });
}
async function getResendDomainMetrics(domainId) {
    // Resend doesn't have a direct metrics endpoint per domain
    // We track metrics in our database via webhook events
    return resendRequest(`/domains/${domainId}`, {
        method: "GET"
    });
}
async function verifyResendWebhookSignature({ payload, headers }) {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    const { svixId, svixTimestamp, svixSignature } = headers;
    if (!secret || !svixId || !svixTimestamp || !svixSignature) {
        return false;
    }
    // Svix signature format: v1,<base64_signature>
    const signatures = svixSignature.split(" ");
    const signedPayload = `${svixId}.${svixTimestamp}.${payload}`;
    // Try to decode the secret (Svix uses whsec_ prefix)
    const secretBytes = secret.startsWith("whsec_") ? Buffer.from(secret.slice(6), "base64") : Buffer.from(secret);
    const computed = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].createHmac("sha256", secretBytes).update(signedPayload).digest("base64");
    // Check against all provided signatures
    for (const sig of signatures){
        const [version, expectedSig] = sig.split(",");
        if (version === "v1" && expectedSig === computed) {
            return true;
        }
    }
    return false;
}
async function getReceivedEmail(emailId) {
    return resendRequest(`/emails/${emailId}`, {
        method: "GET"
    });
}
async function listReceivedEmailAttachments(emailId) {
    return resendRequest(`/emails/${emailId}/attachments`, {
        method: "GET"
    });
}
async function getReceivedEmailAttachment(emailId, attachmentId) {
    return resendRequest(`/emails/${emailId}/attachments/${attachmentId}`, {
        method: "GET"
    });
}
async function verifyDomainDNS(domain) {
    try {
        // First, get all domains to find the one matching our domain
        const listResult = await listResendDomains();
        if (!listResult.success || !listResult.data) {
            return {
                success: false,
                records: [],
                error: "Failed to fetch domains from Resend"
            };
        }
        // Find the domain by name
        const domainData = listResult.data.data?.find((d)=>d.name === domain);
        if (!domainData) {
            return {
                success: false,
                records: [],
                error: `Domain ${domain} not found in Resend`
            };
        }
        // Trigger verification
        await verifyResendDomain(domainData.id);
        // Get fresh domain data after verification
        const verifyResult = await getResendDomain(domainData.id);
        if (!verifyResult.success || !verifyResult.data) {
            return {
                success: false,
                records: [],
                error: "Failed to verify domain"
            };
        }
        // Format records for the tracker
        const records = (verifyResult.data.records || []).map((record, index)=>({
                id: `${record.type.toLowerCase()}-${index}`,
                type: record.type,
                name: record.name,
                value: record.value,
                purpose: getPurposeLabel(record.type),
                verified: verifyResult.data.status === "verified"
            }));
        return {
            success: true,
            records
        };
    } catch (error) {
        return {
            success: false,
            records: [],
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
/**
 * Get purpose label for DNS record type
 */ function getPurposeLabel(type) {
    const purposes = {
        TXT: "SPF - Authorizes sending",
        CNAME: "DKIM - Email signing",
        MX: "Email routing",
        DMARC: "DMARC - Policy"
    };
    return purposes[type] || "Email authentication";
}
;
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createResendDomainWithValidation,
    createResendDomain,
    getResendDomain,
    verifyResendDomain,
    deleteResendDomain,
    listResendDomains,
    createInboundRoute,
    deleteInboundRoute,
    listInboundRoutes,
    getResendDomainMetrics,
    verifyResendWebhookSignature,
    getReceivedEmail,
    listReceivedEmailAttachments,
    getReceivedEmailAttachment,
    verifyDomainDNS,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateDomain"],
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generatePlatformSubdomain"],
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDomainConfig"],
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canRegisterMoreDomains"],
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestSubdomains"]
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createResendDomainWithValidation, "4007018bfc795358d3a9a6d0d6d937c0a7991753fd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createResendDomain, "40bffafd1665af5bc0452006029b023b96c59418cc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getResendDomain, "409e5323bedeb617a359f6b8a8be14be97ac9fcdad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyResendDomain, "4096a28b62c9710d8bfba23f608c0cf179ea514925", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteResendDomain, "4005ec866252400f4aaeb46de9d634a18448b2c356", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listResendDomains, "00034a51a320c0d5b7f54ee8d59e717a7e99ce617f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createInboundRoute, "40d33335a81da2213f1f084c1d8a4dd228084c0b0b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteInboundRoute, "40bd49dc437c730a7762caf74c74835647e426ebcd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listInboundRoutes, "00509bf8dbdee843993cccfb8851f3317137b94977", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getResendDomainMetrics, "401c96873c414c771c2ba5026eea55c296e064b1fd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyResendWebhookSignature, "40ca83b912200b8301c1887a09885cca8cabdd53a8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReceivedEmail, "4011e9cacf8d6155c1ee40d32cd9cd94f6177d36d6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listReceivedEmailAttachments, "40dee78df261ed778ba766f7786fbad63b8bbe0cc6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReceivedEmailAttachment, "6093c82d3d941a1f377f8191c95d6414161f28d14d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyDomainDNS, "4036495f31bf3f9140b8c9fe628d91d016dcd4a270", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateDomain"], "7f3be18bc4b87e5442b067543810626fe10d0007a3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generatePlatformSubdomain"], "7fe246402453c4e4f9810bdfad6dd7f9646cc53faa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDomainConfig"], "7fa57171dc8bc1fa6075f34f4d9e3cda6f46ccfa8c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canRegisterMoreDomains"], "7fcdb2960bb56c59d182c55ec25686d1b6b2441be3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestSubdomains"], "7fdbff76d2cda13ad0e3edf867c0bd6f5a367d9797", null);
}),
"[project]/apps/web/src/lib/email/resend-domains.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canRegisterMoreDomains",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canRegisterMoreDomains"],
    "createInboundRoute",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createInboundRoute"],
    "createResendDomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createResendDomain"],
    "createResendDomainWithValidation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createResendDomainWithValidation"],
    "deleteInboundRoute",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteInboundRoute"],
    "deleteResendDomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteResendDomain"],
    "generatePlatformSubdomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generatePlatformSubdomain"],
    "getDomainConfig",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDomainConfig"],
    "getReceivedEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getReceivedEmail"],
    "getReceivedEmailAttachment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getReceivedEmailAttachment"],
    "getResendDomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getResendDomain"],
    "getResendDomainMetrics",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getResendDomainMetrics"],
    "listInboundRoutes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["listInboundRoutes"],
    "listReceivedEmailAttachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["listReceivedEmailAttachments"],
    "listResendDomains",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["listResendDomains"],
    "suggestSubdomains",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestSubdomains"],
    "validateDomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateDomain"],
    "verifyDomainDNS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifyDomainDNS"],
    "verifyResendDomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifyResendDomain"],
    "verifyResendWebhookSignature",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifyResendWebhookSignature"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$domains$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-domains.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$domain$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/domain-validation.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=apps_web_src_lib_email_6b6a5c36._.js.map