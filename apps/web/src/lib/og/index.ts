/**
 * OG Image Generation System v2.0
 *
 * Next.js 16 programmatic OG image generation.
 * Eye-catching designs with bold gradients and strong visual hierarchy.
 */

// Config & Types
export {
	type CompetitorSlug,
	type FeatureSlug,
	type IndustrySlug,
	OG_CONFIG,
	OG_MESSAGING,
	OG_PATTERNS,
	type OGPageType,
} from "./og-config";

// Font Loading
export { loadInterFont, loadOGFonts, loadSingleFont } from "./og-fonts";

// Templates
export {
	BlogTemplate,
	CalculatorTemplate,
	CompetitorTemplate,
	DefaultTemplate,
	FeatureTemplate,
	GenericTemplate,
	// Utility
	getLogoDataUrl,
	// Page Templates
	HomepageTemplate,
	IndustryTemplate,
	IntegrationTemplate,
	KBTemplate,
	PricingTemplate,
} from "./og-templates";
