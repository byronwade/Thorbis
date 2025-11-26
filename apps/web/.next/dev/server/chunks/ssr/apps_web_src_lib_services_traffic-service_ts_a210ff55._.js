module.exports = [
"[project]/apps/web/src/lib/services/traffic-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Traffic Service
 *
 * Fetches real-time traffic incidents using Google Maps APIs
 * Includes: crashes, construction, road closures, police activity
 */ __turbopack_context__.s([
    "trafficService",
    ()=>trafficService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
// ============================================================================
// Types and Schemas
// ============================================================================
const TrafficIncidentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "crash",
        "construction",
        "road_closed",
        "police",
        "congestion",
        "other"
    ]),
    severity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "minor",
        "moderate",
        "major"
    ]),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        lon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }),
    distance: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    affectsRoute: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    startTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    endTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    enrichedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const TrafficDataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    incidents: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(TrafficIncidentSchema),
    totalIncidents: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    nearbyIncidents: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    routeAffectingIncidents: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    dataSource: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    enrichedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
// ============================================================================
// Traffic Service
// ============================================================================
class TrafficService {
    /**
	 * Get traffic incidents near a location
	 */ async getTrafficIncidents(lat, lon, shopLat, shopLon) {
        try {
            // For now, we'll use Google Maps Directions API with traffic model
            // to detect incidents along the route
            const apiKey = ("TURBOPACK compile-time value", "AIzaSyCVKN0pddG230vvjT0EMP9sSIR31j1q2t0") || ("TURBOPACK compile-time value", "AIzaSyCVKN0pddG230vvjT0EMP9sSIR31j1q2t0");
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const incidents = [];
            // If we have shop coordinates, check for incidents on the route
            if (shopLat && shopLon) {
                const routeIncidents = await this.getRouteIncidents(shopLat, shopLon, lat, lon, apiKey);
                incidents.push(...routeIncidents);
            }
            // Get nearby incidents using Google Maps Places API
            const nearbyIncidents = await this.getNearbyIncidents(lat, lon, apiKey);
            incidents.push(...nearbyIncidents);
            const nearbyCount = incidents.filter((i)=>i.distance <= 5).length;
            const routeAffectingCount = incidents.filter((i)=>i.affectsRoute).length;
            const trafficData = {
                incidents,
                totalIncidents: incidents.length,
                nearbyIncidents: nearbyCount,
                routeAffectingIncidents: routeAffectingCount,
                dataSource: "google-maps",
                enrichedAt: new Date().toISOString()
            };
            return TrafficDataSchema.parse(trafficData);
        } catch (_error) {
            return null;
        }
    }
    /**
	 * Get incidents along the route from shop to job
	 */ async getRouteIncidents(originLat, originLon, destLat, destLon, apiKey) {
        try {
            const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
            url.searchParams.set("origin", `${originLat},${originLon}`);
            url.searchParams.set("destination", `${destLat},${destLon}`);
            url.searchParams.set("departure_time", "now");
            url.searchParams.set("traffic_model", "best_guess");
            url.searchParams.set("key", apiKey);
            const response = await fetch(url.toString());
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            if (data.status !== "OK" || !data.routes?.[0]) {
                return [];
            }
            const route = data.routes[0];
            const incidents = [];
            // Check for warnings (construction, closures, etc.)
            if (route.warnings) {
                for (const warning of route.warnings){
                    incidents.push({
                        type: this.categorizeWarning(warning),
                        severity: "moderate",
                        description: warning,
                        location: {
                            lat: destLat,
                            lon: destLon
                        },
                        distance: 0,
                        affectsRoute: true,
                        enrichedAt: new Date().toISOString()
                    });
                }
            }
            // Analyze traffic conditions
            const leg = route.legs[0];
            if (leg.duration_in_traffic && leg.duration) {
                const trafficDelay = leg.duration_in_traffic.value - leg.duration.value;
                const delayMinutes = Math.floor(trafficDelay / 60);
                if (delayMinutes > 10) {
                    incidents.push({
                        type: "congestion",
                        severity: delayMinutes > 30 ? "major" : "moderate",
                        description: `Heavy traffic causing ${delayMinutes} minute delay`,
                        location: {
                            lat: destLat,
                            lon: destLon
                        },
                        distance: 0,
                        affectsRoute: true,
                        enrichedAt: new Date().toISOString()
                    });
                }
            }
            return incidents;
        } catch (_error) {
            return [];
        }
    }
    /**
	 * Search for incidents using Google Places API
	 */ async getNearbyIncidents(_lat, _lon, _apiKey) {
        // Note: Google Places API doesn't directly provide traffic incidents
        // In production, you'd want to use a dedicated traffic API like:
        // - TomTom Traffic API
        // - HERE Traffic API
        // - Waze Traffic API
        // For now, we'll return empty array
        return [];
    }
    /**
	 * Categorize a warning string into incident type
	 */ categorizeWarning(warning) {
        const lower = warning.toLowerCase();
        if (lower.includes("construction") || lower.includes("work")) {
            return "construction";
        }
        if (lower.includes("closed") || lower.includes("closure")) {
            return "road_closed";
        }
        if (lower.includes("accident") || lower.includes("crash")) {
            return "crash";
        }
        return "other";
    }
}
const trafficService = new TrafficService();
}),
];

//# sourceMappingURL=apps_web_src_lib_services_traffic-service_ts_a210ff55._.js.map