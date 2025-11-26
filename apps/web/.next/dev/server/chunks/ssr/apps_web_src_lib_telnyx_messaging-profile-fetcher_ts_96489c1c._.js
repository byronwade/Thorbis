module.exports = [
"[project]/apps/web/src/lib/telnyx/messaging-profile-fetcher.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Messaging Profile Fetcher
 *
 * Fetches messaging profiles from Telnyx API to help with configuration.
 */ __turbopack_context__.s([
    "getDefaultMessagingProfile",
    ()=>getDefaultMessagingProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/client.ts [app-rsc] (ecmascript)");
;
/**
 * List all messaging profiles from Telnyx
 */ async function listMessagingProfiles() {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].messagingProfiles.list();
        const profiles = response.data || [];
        const formattedProfiles = profiles.map((profile)=>({
                id: profile.id,
                name: profile.name || "Unnamed Profile",
                enabled: profile.enabled !== false,
                webhook_url: profile.webhook_url || null,
                webhook_failover_url: profile.webhook_failover_url || null,
                webhook_api_version: profile.webhook_api_version || null
            }));
        return {
            success: true,
            profiles: formattedProfiles
        };
    } catch (error) {
        return {
            success: false,
            error: error?.message || "Failed to list messaging profiles"
        };
    }
}
async function getDefaultMessagingProfile() {
    const result = await listMessagingProfiles();
    if (!result.success || !result.profiles) {
        return {
            success: false,
            error: result.error || "Failed to fetch messaging profiles"
        };
    }
    if (result.profiles.length === 0) {
        return {
            success: false,
            error: "No messaging profiles found in Telnyx account",
            recommendation: "Create a messaging profile in Telnyx Portal → Messaging → Profiles"
        };
    }
    // Prefer enabled profiles
    const enabledProfiles = result.profiles.filter((p)=>p.enabled);
    const selectedProfile = enabledProfiles.length > 0 ? enabledProfiles[0] : result.profiles[0];
    let recommendation;
    if (result.profiles.length > 1) {
        recommendation = `Found ${result.profiles.length} messaging profiles. Using "${selectedProfile.name}" (ID: ${selectedProfile.id}). To use a different profile, set TELNYX_DEFAULT_MESSAGING_PROFILE_ID to the desired profile ID.`;
    }
    return {
        success: true,
        profile: selectedProfile,
        recommendation
    };
}
/**
 * Get messaging profile by ID
 */ async function getMessagingProfileById(profileId) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxClient"].messagingProfiles.retrieve(profileId);
        const profileData = response.data;
        if (!profileData) {
            return {
                success: false,
                error: `Messaging profile ${profileId} not found`
            };
        }
        const profile = {
            id: profileData.id,
            name: profileData.name || "Unnamed Profile",
            enabled: profileData.enabled !== false,
            webhook_url: profileData.webhook_url || null,
            webhook_failover_url: profileData.webhook_failover_url || null,
            webhook_api_version: profileData.webhook_api_version || null
        };
        return {
            success: true,
            profile
        };
    } catch (error) {
        return {
            success: false,
            error: error?.message || "Failed to retrieve messaging profile"
        };
    }
}
}),
];

//# sourceMappingURL=apps_web_src_lib_telnyx_messaging-profile-fetcher_ts_96489c1c._.js.map