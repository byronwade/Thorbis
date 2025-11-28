/**
 * API Endpoint Maps
 *
 * Centralized action-to-endpoint mapping for consistent API usage tracking.
 * These maps are used across multiple API routes to convert user-friendly
 * action names to internal endpoint names for tracking and analytics.
 */

// ============================================================================
// FBI Crime Data Endpoints
// ============================================================================

const FBI_CRIME_ENDPOINTS = {
	"state-stats": "state_stats",
	"national-stats": "national_stats",
	trends: "crime_trends",
	agencies: "agencies",
	"safety-report": "safety_report",
	"evening-safety": "evening_safety",
	"equipment-theft-risk": "equipment_theft_risk",
	"compare-areas": "compare_areas",
} as const;

export type FbiCrimeAction = keyof typeof FBI_CRIME_ENDPOINTS;

// ============================================================================
// FEMA Flood Data Endpoints
// ============================================================================

const FEMA_FLOOD_ENDPOINTS = {
	zone: "flood_zone",
	panel: "map_panel",
	community: "community_info",
	bfe: "base_flood_elevation",
	report: "flood_report",
	"property-data": "property_data",
	"equipment-compliance": "equipment_compliance",
	"estimate-considerations": "estimate_considerations",
	"insurance-discount": "insurance_discount",
} as const;

export type FemaFloodAction = keyof typeof FEMA_FLOOD_ENDPOINTS;

// ============================================================================
// Shovels API Endpoints
// ============================================================================

const SHOVELS_ENDPOINTS = {
	search: "search_permits",
	permits: "permits_by_address",
	contractor: "contractor",
	"verify-license": "verify_license",
	"hvac-history": "hvac_history",
	"plumbing-history": "plumbing_history",
	"equipment-timeline": "equipment_timeline",
	"service-leads": "service_leads",
	competitors: "competitors",
} as const;

export type ShovelsAction = keyof typeof SHOVELS_ENDPOINTS;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get endpoint name from action for a given service
 */
export function getEndpointName(
	service: "fbi_crime",
	action: FbiCrimeAction,
): string;
export function getEndpointName(
	service: "fema_flood",
	action: FemaFloodAction,
): string;
export function getEndpointName(
	service: "shovels",
	action: ShovelsAction,
): string;
export function getEndpointName(
	service: "fbi_crime" | "fema_flood" | "shovels",
	action: string,
): string | null {
	switch (service) {
		case "fbi_crime":
			return FBI_CRIME_ENDPOINTS[action as FbiCrimeAction] || null;
		case "fema_flood":
			return FEMA_FLOOD_ENDPOINTS[action as FemaFloodAction] || null;
		case "shovels":
			return SHOVELS_ENDPOINTS[action as ShovelsAction] || null;
		default:
			return null;
	}
}

/**
 * Validate action name for a given service
 */
export function isValidAction(
	service: "fbi_crime",
	action: string,
): action is FbiCrimeAction;
export function isValidAction(
	service: "fema_flood",
	action: string,
): action is FemaFloodAction;
export function isValidAction(
	service: "shovels",
	action: string,
): action is ShovelsAction;
export function isValidAction(
	service: "fbi_crime" | "fema_flood" | "shovels",
	action: string,
): boolean {
	return getEndpointName(service, action) !== null;
}

