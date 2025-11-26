module.exports = [
"[project]/apps/web/.next-internal/server/app/(dashboard)/dashboard/ai/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/apps/web/src/actions/email-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/apps/web/src/actions/support-sessions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE10 => \"[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE11 => \"[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE12 => \"[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE13 => \"[project]/apps/web/src/actions/notifications.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE14 => \"[project]/apps/web/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE15 => \"[project]/apps/web/src/actions/company-context.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE16 => \"[project]/apps/web/src/actions/user-status.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE17 => \"[project]/apps/web/src/actions/ai-approval.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE18 => \"[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE19 => \"[project]/apps/web/src/actions/customers.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE20 => \"[project]/apps/web/src/actions/email-folders.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE21 => \"[project]/apps/web/src/actions/sms-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE22 => \"[project]/apps/web/src/actions/vendors.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/email-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/support-sessions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/notifications.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$user$2d$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/user-status.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/ai-approval.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/customers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/email-folders.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$sms$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/sms-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$vendors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/vendors.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/.next-internal/server/app/(dashboard)/dashboard/ai/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/apps/web/src/actions/email-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/apps/web/src/actions/support-sessions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE10 => \"[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE11 => \"[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE12 => \"[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE13 => \"[project]/apps/web/src/actions/notifications.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE14 => \"[project]/apps/web/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE15 => \"[project]/apps/web/src/actions/company-context.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE16 => \"[project]/apps/web/src/actions/user-status.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE17 => \"[project]/apps/web/src/actions/ai-approval.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE18 => \"[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE19 => \"[project]/apps/web/src/actions/customers.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE20 => \"[project]/apps/web/src/actions/email-folders.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE21 => \"[project]/apps/web/src/actions/sms-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE22 => \"[project]/apps/web/src/actions/vendors.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "00205bdcfa50bc0588da90d86d40b50a2b710c766d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$sms$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSmsFolderCountsAction"],
    "0020a1d15ae77f64582de2c225d74b37bc9b2a8829",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resetHourlyCounters"],
    "00337bf9ccf6d7f5002dfdd1c39a50a1925fa9cd70",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCustomersForDialer"],
    "0038f75aa39d15eb18c5c68052266488d280f74485",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markAllAsRead"],
    "004241027febea2f30c3534c791cf4abf0b187afa3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWebRTCCredentials"],
    "00465270d3bffebed3c4f6194507dd54b9dddb7ac3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resetDailyCounters"],
    "005a48890fa7863395276cf2f0eee59386df8294ad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"],
    "0065abb4e4ef4b97e2016c1b54c8d9b3a9ff7b955e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"],
    "0077b5d695a6e4bd1ec48ffe0a639d5f7737bedd9a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isGmailIntegrationEnabled"],
    "007ac1f2ec6b09cd36e4a3e4cc595b494ec49ec2d7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUserRole"],
    "007e3ac5636eb12e5c32067b03bc3f57069cf25e65",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmailFoldersAction"],
    "00892ae3dc26e893f6e8f855ffbcbb3236013a3063",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmailFolderCountsAction"],
    "00a35b9d088292bb54d357cd06416e3d415487c89b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkTelnyxVerificationStatus"],
    "00b83d20602d045512eefed4896ab81b399955d9af",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTotalUnreadCountAction"],
    "00bc8d38f46bac1b451fa040652bdbf7b6d05c4235",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPendingSupportSessions"],
    "00c2f5e409473c5be2f2fff972322d09ee38ad10a7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveSupportSessions"],
    "00c33d6af75b179c3e5fb2a253ea5a10b9f9653dff",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runHealthCheckForAllDomains"],
    "00db090f1561cd2d77f6fcc5f3c799a97aa1a51daf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkIsCompanyOwner"],
    "00faa648440817b6eb791efa3ac3f6799aadfc9c34",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProviderHealthDashboard"],
    "40012be04999490b3a8f8ee0e26fe3cfea793d7855",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendMMSMessage"],
    "400caff3b7aa2d01f050d0c957d62d3a92e63f1504",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$vendors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchVendors"],
    "400cd5cc69fe1c96a071edc469ae5a50ca96054a93",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPayrixMerchantAccount"],
    "4017edba3139fb44e6e281ece4fc8cd9455c636be2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerCompanyFor10DLC"],
    "401e5e42656c806de2a6d0269511c6eaa52a9ff0cb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["endActiveSupportSession"],
    "4023a6f3546ea5f35e67810da9438db269e6791107",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitAutomatedVerification"],
    "40259eeac04557a955e11bfd26ce80f5e72f4ecf77",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCallRoutingRules"],
    "402df083194dc791ac0abbcd344b35a396096a15b3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["transcribeCallRecording"],
    "402e7af979456c6169a23490efd5611eedb77b7f8d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserGmailTokens"],
    "4035496a233e28ec394eae2146957ccf9f344cb802",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeCall"],
    "403e591ad4fb452eef9adfd77242abc86364b2744d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementEmailCounter"],
    "40403f075dde1b08a909eead4279652620ac8d96b4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canDeleteTeamMember"],
    "4045fd66fd12d1ad15f17f3d1f2568de874cc6fe03",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"],
    "4048e2e9f024fac21b381ed351553fd4d64d78f5d6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyPhoneNumbers"],
    "404d09adf2fb9f5cfb17315943fa77e053c340c75d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyPendingActions"],
    "4061912faba61aa4780a560a519048767cb9ddc45c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyActiveDomain"],
    "4063a33d571d6985e25da4111beb44c82ca57cb53a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchPhoneNumbers"],
    "40668734ac0715444771ef63df4ce2328f9e9144e1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["disconnectUserGmail"],
    "406bce7fa085d3cdc2f5aebf07b01ac78a96de1c51",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["switchCompany"],
    "40703cc80f332fb0d2865d96ada3ac45791ca0d136",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCallRoutingRule"],
    "4071d2fab292ee04db9b66589b9b28bb9e2a475117",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$user$2d$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserStatus"],
    "40728dee28044e99744d89471c4d25c5882738a125",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectAIAction"],
    "407f3abd7521af716b17126cab115727d0f9d2d93c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDomainHealth"],
    "40872808aec1a4f1b129010a366e6a68870ce0df8d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processResendWebhookEvent"],
    "4093292a46f282093734eae84e8bdd79e58274f64f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["disconnectCompanyGmail"],
    "409934449f04afd07f8e18e61e8d34e1bab7ad530a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveAIAction"],
    "409b5721717e9390fdc0497fb59a8e8288ce7e42eb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordProviderEvent"],
    "409c8641fcd4f7b2db25c834d3da962a5bd66b4798",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyDomainsHealth"],
    "409fd913f4a9df89acb91012593a14f1e8b4179ca8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteNotification"],
    "40a8248de9409aa878e0944497faaa0fba5a84e97b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["purchasePhoneNumber"],
    "40b125991185ef24f09bd02dc43e2aa44f415f71f9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateDeliverabilityReport"],
    "40b277f535f8a989546d6c7e3a1af8abe77de6c459",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCustomer"],
    "40b41f81fe9259fafce704bbd3935f68276fc4e2ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyEmailProvider"],
    "40b8d713ea0a1ff9c9961eb1d6e32fbd00001de582",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stopCallRecording"],
    "40c2b4df5c915e0d2dea73d2b793e09f294ca0427f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markAsRead"],
    "40c47f4aacde57fa2d2f7b15353f5b7277f571d970",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteEmailFolderAction"],
    "40c65805cd77cf6cd7eae148fa7901b55f8b6c304b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordDeliveryEvent"],
    "40cc98b523af2697e773d1f6877af0bf64071f040d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendTextMessage"],
    "40d259c746bf68bfc52ee1035f65b7d5d348fb2beb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["transferActiveCall"],
    "40d6b5a49526496d26f8f0860050ed9b122ddb4229",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getChatPendingActions"],
    "40e70ff533f92b7e4f1d73f0ee5ca1fb5976d2a7b7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkProviderAlert"],
    "40e9b4592b7430c75572741960a36336d9be9f7ae0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startCallRecording"],
    "40eb9b5dc8fc719648117169eca131590fddc21657",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"],
    "40f32c0cfb7780293a18cf77271d2770c0d61fe547",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyGmailTokens"],
    "40f3cc88585848239c5b2dd062369b4217c03e2854",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmailFolderAction"],
    "40f62a25c31b2883789933798d9582364eb2054b33",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cleanupOldEvents"],
    "600a8f58eaf0d1362927476e3fef9c4afead820e40",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectSupportSessionRequest"],
    "600d8ab2284910a9b02d01729982f3d70069af430f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProviderStats"],
    "6028c8a328b5f7616873329b038fce472d56c751d5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkCompanyGmailHealth"],
    "602d4348165cf80204b8b72cb3eaa8589cc71135f9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureMessagingBranding"],
    "6034c4a4b3c4dea02619bf6b784012d8307475751a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleCallRoutingRule"],
    "6048659199289e27e8a29c146dcc920a7afc8ad29e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchCustomers"],
    "604ac8c079e9497e74d11dd7c17f442078174db43f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCustomerByPhone"],
    "605f35c197a79197cf2e4c607de39464ecc7c51b7a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCallRoutingRule"],
    "60666d082731fc0da1ea78000a7b22b3afbbc989b7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendCompanyGmailEmail"],
    "606b9ecbf77951fa1ec76cb2b2d919f43a5335a5f2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncUserInbox"],
    "607bbb8ec456319d6f212db11b0dad6d62ec6e5cdc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshUserGmailToken"],
    "608b8cea30b154a6249cb5b55846e7aa8fbb731076",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveSupportSessionRequest"],
    "60afa4f94f55ff80042f81a76c673e75545d27872d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshCompanyGmailToken"],
    "60f3c70ab599823c9a6057a8809a3f49da02ad41ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleComplaintWebhook"],
    "701eda529738b7cb8db9c89a5a499d69941ede094c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setCompanyEmailProvider"],
    "708c57de6d594fa79052a4de84abea6851344763b5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureMessagingCampaign"],
    "70b8ccf02d177c82841b8a8e25abfece8615b480cf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchUserInbox"],
    "70ee6c0c90bbedfc55720dd1229b710f17eaa1141d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendVerificationSubmittedEmail"],
    "781dfc9673db486fe6aca86ae42d62ed8772859573",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordFallbackTriggered"],
    "784c581679ff185a1c20eb49054e2d9cb65647d043",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordSendSuccess"],
    "7856b878a603663b87a02cbc0e54b6231beee483cb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordSendFailure"],
    "786c50dbddde0ade87252ff3556bd12a05815d3db8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleBounceWebhook"],
    "78ce69226fb0c4303ba3e078a1534c86a000dbb744",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["storeGmailMessage"],
    "7e684d0fcd64a86c227a3635ab611c4c140250b6fb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["storeUserGmailTokens"],
    "7fa9d4af88bd605b13c48fb4e2937bda4ef2ce0a20",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["storeCompanyGmailTokens"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$dashboard$2f$ai$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE10__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE11__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE12__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE13__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE14__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE15__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE16__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$user$2d$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE17__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE18__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE19__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE20__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE21__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$sms$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE22__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$vendors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(dashboard)/dashboard/ai/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/apps/web/src/actions/email-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE8 => "[project]/apps/web/src/actions/support-sessions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE9 => "[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)", ACTIONS_MODULE10 => "[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)", ACTIONS_MODULE11 => "[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)", ACTIONS_MODULE12 => "[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)", ACTIONS_MODULE13 => "[project]/apps/web/src/actions/notifications.ts [app-rsc] (ecmascript)", ACTIONS_MODULE14 => "[project]/apps/web/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE15 => "[project]/apps/web/src/actions/company-context.ts [app-rsc] (ecmascript)", ACTIONS_MODULE16 => "[project]/apps/web/src/actions/user-status.ts [app-rsc] (ecmascript)", ACTIONS_MODULE17 => "[project]/apps/web/src/actions/ai-approval.ts [app-rsc] (ecmascript)", ACTIONS_MODULE18 => "[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)", ACTIONS_MODULE19 => "[project]/apps/web/src/actions/customers.ts [app-rsc] (ecmascript)", ACTIONS_MODULE20 => "[project]/apps/web/src/actions/email-folders.ts [app-rsc] (ecmascript)", ACTIONS_MODULE21 => "[project]/apps/web/src/actions/sms-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE22 => "[project]/apps/web/src/actions/vendors.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/payrix.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/telnyx.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/messaging-branding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/email-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/support-sessions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/notifications.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$user$2d$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/user-status.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/ai-approval.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/customers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/email-folders.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$sms$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/sms-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$vendors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/vendors.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$dashboard$2f$ai$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE10__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE11__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE12__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE13__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE14__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE15__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE16__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$user$2d$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE17__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE18__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE19__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE20__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE21__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$sms$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE22__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$vendors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$dashboard$2f$ai$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$payrix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$telnyx$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$messaging$2d$branding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$support$2d$sessions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE10__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE11__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE12__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE13__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$notifications$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE14__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE15__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE16__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$user$2d$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE17__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ai$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE18__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE19__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE20__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$email$2d$folders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE21__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$sms$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE22__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$vendors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$ten$2d$dlc$2d$registration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=0da96_web__next-internal_server_app_%28dashboard%29_dashboard_ai_page_actions_0b9c223d.js.map