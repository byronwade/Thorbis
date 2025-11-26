/**
 * Property Data Services Index
 *
 * Central export file for all property data API services.
 *
 * Services included:
 *
 * PROPERTY DATA:
 * - ATTOM Property - Comprehensive property data for 158M+ US properties
 *   - Property profiles, valuations, sales history
 *   - Tax assessments, ownership info
 *   - Building characteristics, lot details
 *
 * - Shovels - Building permit data and contractor intelligence
 *   - Permit history by address
 *   - Contractor verification
 *   - Equipment installation timelines
 *   - Service opportunity leads
 *
 * Usage:
 * ```typescript
 * import {
 *   attomPropertyService,
 *   shovelsService,
 * } from "@/lib/services/property-services-index";
 *
 * // Get property data for a service call
 * const propertyReport = await attomPropertyService.getServiceCallPropertyReport({
 *   address1: "123 Main St",
 *   locality: "Sacramento",
 *   stateOrProvince: "CA",
 * });
 *
 * // Get permit history for HVAC equipment
 * const hvacHistory = await shovelsService.getHVACPermitHistory(
 *   "123 Main St", "Sacramento", "CA", "95814"
 * );
 * ```
 */

// ============================================
// ATTOM Property Data
// ============================================

export type {
	ComparableProperty,
	EquipmentRelevantInfo,
	MaintenanceRelevantInfo,
	OwnerInfo,
	PropertyAddress,
	PropertyProfile,
	PropertyValuation,
	SalesHistoryRecord,
	ServiceCallPropertyReport,
	TaxAssessment,
} from "./attom-property-service";
export { attomPropertyService } from "./attom-property-service";

// ============================================
// Shovels Permit Data
// ============================================

export type {
	CompetitorContractor,
	Contractor,
	EquipmentTimeline,
	HVACPermitHistory,
	Permit,
	PermitSearchParams,
	PermitSearchResult,
	PlumbingPermitHistory,
	ServiceOpportunityLead,
} from "./shovels-service";
export { shovelsService } from "./shovels-service";

// ============================================
// Configuration Checker
// ============================================

/**
 * Check if property data services are configured
 */
export function checkPropertyServicesConfig(): {
	configured: string[];
	notConfigured: string[];
	summary: string;
} {
	const attomKey = process.env.ATTOM_API_KEY;
	const shovelsKey = process.env.SHOVELS_API_KEY;

	const services = [
		{ name: "ATTOM Property", check: () => !!attomKey },
		{ name: "Shovels Permits", check: () => !!shovelsKey },
	];

	const configured: string[] = [];
	const notConfigured: string[] = [];

	for (const service of services) {
		if (service.check()) {
			configured.push(service.name);
		} else {
			notConfigured.push(service.name);
		}
	}

	return {
		configured,
		notConfigured,
		summary: `${configured.length}/${services.length} property data services configured`,
	};
}

/**
 * Get a summary of property data services
 */
export function getPropertyServicesSummary(): {
	total: number;
	services: {
		name: string;
		description: string;
		features: string[];
	}[];
} {
	return {
		total: 2,
		services: [
			{
				name: "ATTOM Property",
				description: "Comprehensive property data for 158M+ US properties",
				features: [
					"Property profiles and characteristics",
					"Automated valuation models (AVM)",
					"Sales history and transactions",
					"Tax assessments and ownership",
					"Comparable property analysis",
					"Service call property reports",
				],
			},
			{
				name: "Shovels",
				description: "Building permit data and contractor intelligence",
				features: [
					"Permit search by location",
					"HVAC/Plumbing permit history",
					"Contractor verification",
					"Equipment installation timelines",
					"Service opportunity leads",
					"Competitor analysis",
				],
			},
		],
	};
}
