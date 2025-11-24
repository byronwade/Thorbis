/**
 * OG Image Generation System
 *
 * Next.js 16 programmatic OG image generation.
 * Dark mode first, bold & minimalistic design.
 */

export { OG_CONFIG, OG_MESSAGING, SOCIAL_CONFIGS, type OGPageType } from "./og-config";
export { loadOGFonts, loadSingleFont, loadInterFont } from "./og-fonts";
export {
	OGBaseLayout,
	PricingBadge,
	CategoryBadge,
	HomepageTemplate,
	FeatureTemplate,
	IndustryTemplate,
	CompetitorTemplate,
	PricingTemplate,
	BlogTemplate,
	KBTemplate,
	IntegrationTemplate,
	CalculatorTemplate,
	DefaultTemplate,
} from "./og-templates";
