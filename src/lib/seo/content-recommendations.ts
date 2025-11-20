import type { RelatedContentItem } from "@/components/seo/related-content";

/**
 * Content Recommendation Utilities
 *
 * Smart content recommendation engine for internal linking strategy.
 * Generates related content suggestions based on tags, categories, and content types.
 *
 * @see /docs/seo/INTERNAL_LINKING_STRATEGY.md
 */

/**
 * Calculate similarity score between two tag arrays
 *
 * Uses Jaccard similarity coefficient: |A ∩ B| / |A ∪ B|
 *
 * @param tags1 - First array of tags
 * @param tags2 - Second array of tags
 * @returns Similarity score between 0 and 1
 */
function calculateSimilarity(tags1: string[], tags2: string[]): number {
	if (!tags1.length || !tags2.length) return 0;

	const set1 = new Set(tags1.map((t) => t.toLowerCase()));
	const set2 = new Set(tags2.map((t) => t.toLowerCase()));

	const intersection = new Set([...set1].filter((tag) => set2.has(tag)));
	const union = new Set([...set1, ...set2]);

	return intersection.size / union.size;
}

/**
 * Get related items based on tag similarity
 *
 * @param currentItem - The current item to find recommendations for
 * @param allItems - Array of all available items
 * @param maxResults - Maximum number of recommendations
 * @returns Array of related items sorted by similarity
 */
export function getRelatedByTags(
	currentItem: RelatedContentItem,
	allItems: RelatedContentItem[],
	maxResults: number = 6,
): RelatedContentItem[] {
	if (!currentItem.tags || currentItem.tags.length === 0) {
		return [];
	}

	// Calculate similarity scores
	const itemsWithScores = allItems
		.filter((item) => item.id !== currentItem.id) // Exclude current item
		.filter((item) => item.tags && item.tags.length > 0) // Only items with tags
		.map((item) => ({
			item,
			score: calculateSimilarity(currentItem.tags!, item.tags!),
		}))
		.filter((entry) => entry.score > 0) // Only items with some similarity
		.sort((a, b) => b.score - a.score); // Sort by highest similarity

	return itemsWithScores.slice(0, maxResults).map((entry) => entry.item);
}

/**
 * Get related items by category
 *
 * @param currentCategory - The current category
 * @param allItems - Array of all available items
 * @param maxResults - Maximum number of recommendations
 * @returns Array of items in the same category
 */
export function getRelatedByCategory(
	currentCategory: string,
	allItems: RelatedContentItem[],
	maxResults: number = 6,
): RelatedContentItem[] {
	return allItems
		.filter((item) => item.category === currentCategory)
		.slice(0, maxResults);
}

/**
 * Feature Pages Data
 *
 * All feature pages with tags for smart recommendations.
 */
export const FEATURE_PAGES: RelatedContentItem[] = [
	{
		id: "scheduling",
		title: "Scheduling & Dispatch",
		description: "Drag-and-drop calendar with intelligent dispatching",
		href: "/features/scheduling",
		category: "Features",
		tags: ["scheduling", "calendar", "dispatch", "appointments", "routing"],
	},
	{
		id: "invoicing",
		title: "Invoicing & Payments",
		description: "Professional invoices with automated payment processing",
		href: "/features/invoicing",
		category: "Features",
		tags: ["invoicing", "payments", "billing", "accounting", "quickbooks"],
	},
	{
		id: "crm",
		title: "Customer Management",
		description: "360° customer view with complete history tracking",
		href: "/features/crm",
		category: "Features",
		tags: ["crm", "customers", "contacts", "properties", "history"],
	},
	{
		id: "customer-portal",
		title: "Customer Portal",
		description: "Self-service portal for bookings and payments",
		href: "/features/customer-portal",
		category: "Features",
		tags: ["portal", "self-service", "booking", "customers", "online"],
	},
	{
		id: "mobile-app",
		title: "Mobile App",
		description: "iOS and Android apps for field technicians",
		href: "/features/mobile-app",
		category: "Features",
		tags: ["mobile", "ios", "android", "field", "technicians", "offline"],
	},
	{
		id: "quickbooks",
		title: "QuickBooks Integration",
		description: "Seamless two-way sync with QuickBooks Online",
		href: "/features/quickbooks",
		category: "Features",
		tags: ["quickbooks", "accounting", "sync", "integration", "financial"],
	},
	{
		id: "marketing",
		title: "Marketing Automation",
		description: "Automated campaigns and customer engagement",
		href: "/features/marketing",
		category: "Features",
		tags: ["marketing", "campaigns", "email", "sms", "automation"],
	},
	{
		id: "ai-assistant",
		title: "AI Assistant",
		description: "Intelligent automation powered by AI",
		href: "/features/ai-assistant",
		category: "Features",
		tags: ["ai", "automation", "intelligence", "smart", "assistant"],
	},
];

/**
 * Industry Pages Data
 *
 * All industry-specific pages with tags for smart recommendations.
 */
export const INDUSTRY_PAGES: RelatedContentItem[] = [
	{
		id: "hvac",
		title: "HVAC Software",
		description: "Complete solution for HVAC contractors",
		href: "/industries/hvac",
		category: "Industries",
		tags: ["hvac", "heating", "cooling", "ac", "furnace", "residential"],
	},
	{
		id: "plumbing",
		title: "Plumbing Software",
		description: "Built for plumbing professionals",
		href: "/industries/plumbing",
		category: "Industries",
		tags: ["plumbing", "pipes", "water", "residential", "commercial"],
	},
	{
		id: "electrical",
		title: "Electrical Software",
		description: "Electrical contractor management",
		href: "/industries/electrical",
		category: "Industries",
		tags: ["electrical", "wiring", "circuits", "residential", "commercial"],
	},
	{
		id: "landscaping",
		title: "Landscaping Software",
		description: "Landscape and lawn care management",
		href: "/industries/landscaping",
		category: "Industries",
		tags: ["landscaping", "lawn", "garden", "outdoor", "maintenance"],
	},
	{
		id: "pest-control",
		title: "Pest Control Software",
		description: "Pest management and treatment tracking",
		href: "/industries/pest-control",
		category: "Industries",
		tags: ["pest", "exterminator", "treatment", "residential", "commercial"],
	},
	{
		id: "garage-door",
		title: "Garage Door Software",
		description: "Installation and repair management",
		href: "/industries/garage-door",
		category: "Industries",
		tags: ["garage", "doors", "installation", "repair", "residential"],
	},
	{
		id: "roofing",
		title: "Roofing Software",
		description: "Roofing contractor solutions",
		href: "/industries/roofing",
		category: "Industries",
		tags: ["roofing", "shingles", "repair", "residential", "commercial"],
	},
	{
		id: "cleaning",
		title: "Cleaning Software",
		description: "Commercial and residential cleaning",
		href: "/industries/cleaning",
		category: "Industries",
		tags: ["cleaning", "janitorial", "maid", "residential", "commercial"],
	},
	{
		id: "locksmith",
		title: "Locksmith Software",
		description: "Lock and security service management",
		href: "/industries/locksmith",
		category: "Industries",
		tags: ["locksmith", "security", "keys", "residential", "commercial"],
	},
	{
		id: "appliance-repair",
		title: "Appliance Repair Software",
		description: "Appliance service and repair tracking",
		href: "/industries/appliance-repair",
		category: "Industries",
		tags: ["appliance", "repair", "service", "residential", "warranty"],
	},
	{
		id: "handyman",
		title: "Handyman Software",
		description: "Multi-trade service management",
		href: "/industries/handyman",
		category: "Industries",
		tags: ["handyman", "multi-trade", "residential", "repair", "maintenance"],
	},
	{
		id: "pool-service",
		title: "Pool Service Software",
		description: "Pool maintenance and cleaning",
		href: "/industries/pool-service",
		category: "Industries",
		tags: ["pool", "swimming", "maintenance", "cleaning", "residential"],
	},
];

/**
 * Get related features for a specific feature page
 *
 * @param currentFeatureId - ID of the current feature
 * @param maxResults - Maximum number of recommendations
 * @returns Array of related feature pages
 */
export function getRelatedFeatures(
	currentFeatureId: string,
	maxResults: number = 3,
): RelatedContentItem[] {
	const currentFeature = FEATURE_PAGES.find((f) => f.id === currentFeatureId);
	if (!currentFeature) return [];

	return getRelatedByTags(currentFeature, FEATURE_PAGES, maxResults);
}

/**
 * Get related industries for a specific industry page
 *
 * @param currentIndustryId - ID of the current industry
 * @param maxResults - Maximum number of recommendations
 * @returns Array of related industry pages
 */
export function getRelatedIndustries(
	currentIndustryId: string,
	maxResults: number = 3,
): RelatedContentItem[] {
	const currentIndustry = INDUSTRY_PAGES.find(
		(i) => i.id === currentIndustryId,
	);
	if (!currentIndustry) return [];

	return getRelatedByTags(currentIndustry, INDUSTRY_PAGES, maxResults);
}

/**
 * Get popular features (most commonly linked)
 *
 * @param maxResults - Maximum number of items
 * @returns Array of popular feature pages
 */
export function getPopularFeatures(
	maxResults: number = 4,
): RelatedContentItem[] {
	// Return most important features in priority order
	return [
		FEATURE_PAGES.find((f) => f.id === "scheduling")!,
		FEATURE_PAGES.find((f) => f.id === "invoicing")!,
		FEATURE_PAGES.find((f) => f.id === "crm")!,
		FEATURE_PAGES.find((f) => f.id === "mobile-app")!,
	].slice(0, maxResults);
}

/**
 * Get popular industries (most commonly searched)
 *
 * @param maxResults - Maximum number of items
 * @returns Array of popular industry pages
 */
export function getPopularIndustries(
	maxResults: number = 4,
): RelatedContentItem[] {
	// Return most important industries in priority order
	return [
		INDUSTRY_PAGES.find((i) => i.id === "hvac")!,
		INDUSTRY_PAGES.find((i) => i.id === "plumbing")!,
		INDUSTRY_PAGES.find((i) => i.id === "electrical")!,
		INDUSTRY_PAGES.find((i) => i.id === "landscaping")!,
	].slice(0, maxResults);
}
