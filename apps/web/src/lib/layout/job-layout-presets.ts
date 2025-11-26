/**
 * Job Details Layout Presets
 *
 * Pre-configured layouts for different construction industries.
 * Each preset is optimized for the specific needs of that trade.
 */

import type {
	IndustryType,
	JobWidget,
	LayoutPreset,
} from "@/lib/stores/job-details-layout-store";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a widget with default settings
 */
function createWidget(
	id: string,
	type: JobWidget["type"],
	title: string,
	x: number,
	y: number,
	width: number,
	height: number,
	options: Partial<JobWidget> = {},
): JobWidget {
	return {
		id,
		type,
		title,
		position: { x, y },
		size: { width, height },
		isVisible: true,
		isCollapsible: true,
		isCollapsed: false,
		isResizable: true,
		isDraggable: true,
		...options,
	} as JobWidget;
}

// ============================================================================
// Industry Presets
// ============================================================================

/**
 * HVAC Contractor Layout
 * Focus: Equipment specs, system sizing, property details
 */
const hvacPreset: LayoutPreset = {
	id: "hvac-preset",
	name: "HVAC Contractor",
	description:
		"Optimized for HVAC installation and repair jobs with equipment tracking",
	industry: "hvac",
	widgets: [
		// Row 1: Header (always first)
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),

		// Row 2: Main content (Timeline is permanent at top of page)
		createWidget(
			"hvac-equipment",
			"hvac-equipment",
			"HVAC Equipment",
			0,
			2,
			2,
			2,
		),
		createWidget(
			"property-enrichment",
			"property-enrichment",
			"Property Intelligence",
			2,
			2,
			2,
			2,
		),

		// Row 5-7: Financial and details
		createWidget(
			"job-financials",
			"job-financials",
			"Financial Summary",
			0,
			4,
			1,
			2,
		),
		createWidget("job-costing", "job-costing", "Job Costing", 1, 4, 1, 2),
		createWidget("job-details", "job-details", "Job Information", 2, 4, 2, 3),

		// Row 8-9: Photos and documents
		createWidget("photos", "photos", "Photo Gallery", 0, 7, 2, 2),
		createWidget("permits", "permits", "Permits", 2, 7, 1, 2),
		createWidget("customer-info", "customer-info", "Customer", 3, 7, 1, 2),
	],
};

/**
 * Plumbing Contractor Layout
 * Focus: Fixtures, permits, property details
 */
const plumbingPreset: LayoutPreset = {
	id: "plumbing-preset",
	name: "Plumbing Contractor",
	description: "Optimized for plumbing jobs with fixture and permit tracking",
	industry: "plumbing",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget(
			"plumbing-fixtures",
			"plumbing-fixtures",
			"Plumbing Fixtures",
			0,
			2,
			2,
			2,
		),
		createWidget(
			"property-details",
			"property-details",
			"Property Details",
			2,
			2,
			2,
			2,
		),
		createWidget("permits", "permits", "Permits & Inspections", 0, 4, 2, 2),
		createWidget("materials-list", "materials-list", "Materials", 2, 4, 2, 2),
		createWidget("job-financials", "job-financials", "Financials", 0, 6, 2, 2),
		createWidget("photos", "photos", "Photos", 2, 6, 2, 2),
	],
};

/**
 * Electrical Contractor Layout
 * Focus: Panels, circuits, permits, code compliance
 */
const electricalPreset: LayoutPreset = {
	id: "electrical-preset",
	name: "Electrical Contractor",
	description: "Optimized for electrical work with panel and circuit tracking",
	industry: "electrical",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget(
			"electrical-panels",
			"electrical-panels",
			"Electrical Panels",
			0,
			2,
			2,
			2,
		),
		createWidget("permits", "permits", "Permits & Inspections", 2, 2, 2, 2),
		createWidget(
			"property-details",
			"property-details",
			"Property Details",
			0,
			4,
			2,
			2,
		),
		createWidget("materials-list", "materials-list", "Materials", 2, 4, 2, 2),
		createWidget("job-financials", "job-financials", "Financials", 0, 6, 2, 2),
		createWidget("photos", "photos", "Photos", 2, 6, 2, 2),
	],
};

/**
 * Roofing Contractor Layout
 * Focus: Materials, weather, photos
 */
const roofingPreset: LayoutPreset = {
	id: "roofing-preset",
	name: "Roofing Contractor",
	description: "Optimized for roofing jobs with material and weather tracking",
	industry: "roofing",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget(
			"roofing-materials",
			"roofing-materials",
			"Roofing Materials",
			0,
			2,
			2,
			2,
		),
		createWidget(
			"property-enrichment",
			"property-enrichment",
			"Property Intelligence",
			2,
			2,
			2,
			2,
		),
		createWidget("photos", "photos", "Photo Gallery", 0, 4, 2, 3),
		createWidget("job-details", "job-details", "Job Information", 2, 4, 2, 3),
		createWidget("job-financials", "job-financials", "Financials", 0, 7, 2, 2),
		createWidget("permits", "permits", "Permits", 2, 7, 2, 2),
	],
};

/**
 * Landscaping Contractor Layout
 * Focus: Zones, materials, property details
 */
const landscapingPreset: LayoutPreset = {
	id: "landscaping-preset",
	name: "Landscaping Contractor",
	description:
		"Optimized for landscaping projects with zone and material tracking",
	industry: "landscaping",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget(
			"landscape-zones",
			"landscape-zones",
			"Landscape Zones",
			0,
			2,
			2,
			2,
		),
		createWidget("location-map", "location-map", "Location Map", 2, 2, 2, 2),
		createWidget("materials-list", "materials-list", "Materials", 0, 4, 2, 2),
		createWidget("photos", "photos", "Photos", 2, 4, 2, 2),
		createWidget("job-financials", "job-financials", "Financials", 0, 6, 2, 2),
		createWidget("job-details", "job-details", "Job Information", 2, 6, 2, 2),
	],
};

/**
 * General Contractor Layout
 * Focus: Comprehensive overview with all key information
 */
const generalContractorPreset: LayoutPreset = {
	id: "general-contractor-preset",
	name: "General Contractor",
	description: "Comprehensive layout for general construction projects",
	industry: "general_contractor",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget("job-details", "job-details", "Job Information", 0, 2, 2, 3),
		createWidget(
			"property-enrichment",
			"property-enrichment",
			"Property Intelligence",
			2,
			2,
			2,
			3,
		),
		createWidget("job-costing", "job-costing", "Job Costing", 0, 5, 2, 2),
		createWidget("profitability", "profitability", "Profitability", 2, 5, 2, 2),
		createWidget("schedule", "schedule", "Schedule", 0, 7, 2, 2),
		createWidget("team-assignments", "team-assignments", "Team", 2, 7, 2, 2),
		createWidget("photos", "photos", "Photos", 0, 9, 2, 2),
		createWidget("documents", "documents", "Documents", 2, 9, 2, 2),
	],
};

/**
 * Remodeling Contractor Layout
 * Focus: Before/after photos, change orders, detailed costing
 */
const remodelingPreset: LayoutPreset = {
	id: "remodeling-preset",
	name: "Remodeling Contractor",
	description: "Optimized for remodeling projects with detailed photo tracking",
	industry: "remodeling",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget("photos", "photos", "Photo Gallery", 0, 2, 2, 3),
		createWidget("job-details", "job-details", "Job Information", 2, 2, 2, 3),
		createWidget("change-orders", "change-orders", "Change Orders", 0, 5, 2, 2),
		createWidget("job-costing", "job-costing", "Job Costing", 2, 5, 2, 2),
		createWidget("materials-list", "materials-list", "Materials", 0, 7, 2, 2),
		createWidget("permits", "permits", "Permits", 2, 7, 2, 2),
	],
};

/**
 * Commercial Construction Layout
 * Focus: Complex project management, multiple teams, detailed tracking
 */
const commercialPreset: LayoutPreset = {
	id: "commercial-preset",
	name: "Commercial Construction",
	description: "Comprehensive layout for large commercial projects",
	industry: "commercial",
	widgets: [
		createWidget("header", "job-header", "Job Header", 0, 0, 4, 1, {
			isCollapsible: false,
			isResizable: false,
			isDraggable: false,
		}),
		createWidget("job-details", "job-details", "Job Information", 0, 2, 2, 3),
		createWidget(
			"property-enrichment",
			"property-enrichment",
			"Property Intelligence",
			2,
			2,
			2,
			3,
		),
		createWidget("schedule", "schedule", "Project Schedule", 0, 5, 2, 2),
		createWidget("team-assignments", "team-assignments", "Teams", 2, 5, 2, 2),
		createWidget("job-costing", "job-costing", "Job Costing", 0, 7, 2, 2),
		createWidget("profitability", "profitability", "Profitability", 2, 7, 2, 2),
		createWidget(
			"purchase-orders",
			"purchase-orders",
			"Purchase Orders",
			0,
			9,
			2,
			2,
		),
		createWidget("permits", "permits", "Permits & Inspections", 2, 9, 2, 2),
		createWidget("photos", "photos", "Photos", 0, 11, 2, 2),
		createWidget("documents", "documents", "Documents", 2, 11, 2, 2),
	],
};

// ============================================================================
// Export All Presets
// ============================================================================

export const ALL_PRESETS: LayoutPreset[] = [
	hvacPreset,
	plumbingPreset,
	electricalPreset,
	roofingPreset,
	landscapingPreset,
	generalContractorPreset,
	remodelingPreset,
	commercialPreset,
];

/**
 * Get preset by industry type
 */
function getPresetByIndustry(industry: IndustryType): LayoutPreset | undefined {
	return ALL_PRESETS.find((preset) => preset.industry === industry);
}

/**
 * Get all presets for a specific category
 */
function getPresetsByCategory(
	category: "residential" | "commercial" | "specialty",
): LayoutPreset[] {
	const residentialIndustries: IndustryType[] = [
		"hvac",
		"plumbing",
		"electrical",
		"roofing",
		"landscaping",
		"remodeling",
	];
	const commercialIndustries: IndustryType[] = [
		"commercial",
		"general_contractor",
	];

	if (category === "residential") {
		return ALL_PRESETS.filter((preset) =>
			residentialIndustries.includes(preset.industry),
		);
	}

	if (category === "commercial") {
		return ALL_PRESETS.filter((preset) =>
			commercialIndustries.includes(preset.industry),
		);
	}

	return ALL_PRESETS;
}
