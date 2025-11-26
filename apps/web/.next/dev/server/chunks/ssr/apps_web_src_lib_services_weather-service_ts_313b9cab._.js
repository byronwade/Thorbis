module.exports = [
"[project]/apps/web/src/lib/services/weather-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Weather Service - NWS API Integration
 *
 * Provides weather forecasts and severe weather alerts for job scheduling
 * Uses free National Weather Service API (api.weather.gov)
 *
 * Features:
 * - 7-day forecast
 * - Hourly forecast
 * - Active weather alerts
 * - Severe weather notifications
 */ __turbopack_context__.s([
    "WeatherService",
    ()=>WeatherService,
    "weatherService",
    ()=>weatherService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";
// ============================================================================
// Types and Schemas
// ============================================================================
const WeatherAlertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    headline: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    severity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "Extreme",
        "Severe",
        "Moderate",
        "Minor",
        "Unknown"
    ]),
    urgency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "Immediate",
        "Expected",
        "Future",
        "Past",
        "Unknown"
    ]),
    onset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    expires: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    instruction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional()
});
const WeatherPeriodSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    temperature: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    temperatureUnit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    windSpeed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    windDirection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    shortForecast: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    detailedForecast: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    startTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    endTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const WeatherDataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        lon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        gridId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        gridX: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        gridY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
    }),
    forecast: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        periods: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(WeatherPeriodSchema),
        updated: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional(),
    hourly: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        periods: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(WeatherPeriodSchema),
        updated: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional(),
    alerts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(WeatherAlertSchema),
    hasActiveAlerts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    highestSeverity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "Extreme",
        "Severe",
        "Moderate",
        "Minor",
        "None"
    ]),
    enrichedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
class WeatherService {
    cache = new Map();
    cacheTTL = 1000 * 60 * 30;
    /**
	 * Get complete weather data for a location
	 */ async getWeatherData(lat, lon) {
        const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        // Check cache
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.data;
        }
        try {
            // Step 1: Get NWS grid point metadata
            const pointsRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, {
                headers: {
                    "User-Agent": USER_AGENT,
                    Accept: "application/geo+json"
                }
            });
            if (!pointsRes.ok) {
                return null;
            }
            const pointsData = await pointsRes.json();
            const properties = pointsData.properties;
            // Step 2: Fetch forecast, hourly, and alerts in parallel
            const [forecastData, hourlyData, alertsData] = await Promise.all([
                properties.forecast ? this.fetchJson(properties.forecast) : Promise.resolve(null),
                properties.forecastHourly ? this.fetchJson(properties.forecastHourly) : Promise.resolve(null),
                this.fetchJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`)
            ]);
            // Parse alerts
            const alerts = [];
            let highestSeverity = "None";
            if (alertsData?.features) {
                for (const feature of alertsData.features){
                    const props = feature.properties;
                    const alert = {
                        event: props.event || "Unknown Event",
                        headline: props.headline || "",
                        description: props.description || "",
                        severity: this.normalizeSeverity(props.severity),
                        urgency: this.normalizeUrgency(props.urgency),
                        onset: props.onset,
                        expires: props.expires,
                        instruction: props.instruction
                    };
                    alerts.push(alert);
                    // Track highest severity
                    if (alert.severity !== "Unknown" && this.severityRank(alert.severity) > this.severityRank(highestSeverity)) {
                        highestSeverity = alert.severity;
                    }
                }
            }
            const weatherData = {
                location: {
                    lat,
                    lon,
                    gridId: properties.gridId,
                    gridX: properties.gridX,
                    gridY: properties.gridY
                },
                forecast: forecastData ? {
                    periods: forecastData.properties.periods.map((p)=>({
                            number: p.number,
                            name: p.name,
                            temperature: p.temperature,
                            temperatureUnit: p.temperatureUnit,
                            windSpeed: p.windSpeed,
                            windDirection: p.windDirection,
                            shortForecast: p.shortForecast,
                            detailedForecast: p.detailedForecast,
                            startTime: p.startTime,
                            endTime: p.endTime
                        })),
                    updated: forecastData.properties.updated || forecastData.properties.generatedAt
                } : undefined,
                hourly: hourlyData ? {
                    periods: hourlyData.properties.periods.slice(0, 24).map((p)=>({
                            number: p.number,
                            name: p.name,
                            temperature: p.temperature,
                            temperatureUnit: p.temperatureUnit,
                            windSpeed: p.windSpeed,
                            windDirection: p.windDirection,
                            shortForecast: p.shortForecast,
                            detailedForecast: p.detailedForecast,
                            startTime: p.startTime,
                            endTime: p.endTime
                        })),
                    updated: hourlyData.properties.updated || hourlyData.properties.generatedAt
                } : undefined,
                alerts,
                hasActiveAlerts: alerts.length > 0,
                highestSeverity,
                enrichedAt: new Date().toISOString()
            };
            // Cache the result
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            return WeatherDataSchema.parse(weatherData);
        } catch (_error) {
            return null;
        }
    }
    /**
	 * Get only active alerts for a location (faster)
	 */ async getActiveAlerts(lat, lon) {
        try {
            const alertsData = await this.fetchJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`);
            if (!alertsData?.features) {
                return [];
            }
            return alertsData.features.map((feature)=>({
                    event: feature.properties.event || "Unknown Event",
                    headline: feature.properties.headline || "",
                    description: feature.properties.description || "",
                    severity: this.normalizeSeverity(feature.properties.severity),
                    urgency: this.normalizeUrgency(feature.properties.urgency),
                    onset: feature.properties.onset,
                    expires: feature.properties.expires,
                    instruction: feature.properties.instruction
                }));
        } catch (_error) {
            return [];
        }
    }
    /**
	 * Check if weather is suitable for outdoor work
	 */ isSuitableForOutdoorWork(weather) {
        // Check for severe weather alerts
        if (weather.highestSeverity === "Extreme" || weather.highestSeverity === "Severe") {
            return {
                suitable: false,
                reason: "Severe weather alert in effect"
            };
        }
        // Check current/upcoming conditions
        if (weather.hourly?.periods?.[0]) {
            const current = weather.hourly.periods[0];
            // Check for precipitation
            if (current.shortForecast.toLowerCase().includes("rain") || current.shortForecast.toLowerCase().includes("storm") || current.shortForecast.toLowerCase().includes("snow")) {
                return {
                    suitable: false,
                    reason: `${current.shortForecast} expected`
                };
            }
            // Check for extreme temperatures
            if (current.temperature < 32) {
                return {
                    suitable: false,
                    reason: "Freezing temperatures"
                };
            }
            if (current.temperature > 100) {
                return {
                    suitable: false,
                    reason: "Extreme heat"
                };
            }
        }
        return {
            suitable: true
        };
    }
    /**
	 * Helper to fetch JSON with proper headers
	 */ async fetchJson(url) {
        const res = await fetch(url, {
            headers: {
                "User-Agent": USER_AGENT,
                Accept: "application/geo+json"
            }
        });
        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status} ${url}`);
        }
        return res.json();
    }
    /**
	 * Normalize severity values
	 */ normalizeSeverity(severity) {
        if (!severity) {
            return "Unknown";
        }
        const s = severity.toLowerCase();
        if (s.includes("extreme")) {
            return "Extreme";
        }
        if (s.includes("severe")) {
            return "Severe";
        }
        if (s.includes("moderate")) {
            return "Moderate";
        }
        if (s.includes("minor")) {
            return "Minor";
        }
        return "Unknown";
    }
    /**
	 * Normalize urgency values
	 */ normalizeUrgency(urgency) {
        if (!urgency) {
            return "Unknown";
        }
        const u = urgency.toLowerCase();
        if (u.includes("immediate")) {
            return "Immediate";
        }
        if (u.includes("expected")) {
            return "Expected";
        }
        if (u.includes("future")) {
            return "Future";
        }
        if (u.includes("past")) {
            return "Past";
        }
        return "Unknown";
    }
    /**
	 * Get numeric rank for severity comparison
	 */ severityRank(severity) {
        switch(severity){
            case "Extreme":
                return 4;
            case "Severe":
                return 3;
            case "Moderate":
                return 2;
            case "Minor":
                return 1;
            default:
                return 0;
        }
    }
    /**
	 * Clear cache
	 */ clearCache() {
        this.cache.clear();
    }
}
const weatherService = new WeatherService();
}),
];

//# sourceMappingURL=apps_web_src_lib_services_weather-service_ts_313b9cab._.js.map