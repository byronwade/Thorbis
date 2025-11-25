/**
 * OG Image Generation System v2.0
 *
 * Next.js 16 programmatic OG image generation.
 * Eye-catching designs with bold gradients and strong visual hierarchy.
 */

// Config & Types
export {
	OG_CONFIG,
	OG_MESSAGING,
	OG_PATTERNS,
	type OGPageType,
	type FeatureSlug,
	type IndustrySlug,
	type CompetitorSlug,
} from "./og-config";

// Font Loading
export { loadOGFonts, loadSingleFont, loadInterFont } from "./og-fonts";

// Templates
export {
	// Utility
	getLogoDataUrl,
	// Page Templates
	HomepageTemplate,
	PricingTemplate,
	FeatureTemplate,
	IndustryTemplate,
	CompetitorTemplate,
	BlogTemplate,
	KBTemplate,
	IntegrationTemplate,
	CalculatorTemplate,
	GenericTemplate,
	DefaultTemplate,
} from "./og-templates";
