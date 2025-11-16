export type MarketingCTA = {
	label: string;
	href: string;
};

export type MarketingValueProp = {
	title: string;
	description: string;
	icon: string;
};

export type MarketingStat = {
	label: string;
	value: string;
	description: string;
};

export type MarketingWorkflow = {
	title: string;
	description: string;
	steps?: string[];
};

export type MarketingFAQ = {
	question: string;
	answer: string;
};

export type MarketingTestimonial = {
	quote: string;
	attribution: string;
	role?: string;
};

export type MarketingSEO = {
	title: string;
	description: string;
	keywords: string[];
	image?: string;
};

export type MarketingFeatureContent = {
	kind: "feature";
	slug: string;
	name: string;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage?: string;
	summary: string;
	primaryCta: MarketingCTA;
	secondaryCta?: MarketingCTA;
	seo: MarketingSEO;
	painPoints: string[];
	valueProps: MarketingValueProp[];
	workflows: MarketingWorkflow[];
	stats: MarketingStat[];
	integrations?: string[];
	testimonial?: MarketingTestimonial;
	faq: MarketingFAQ[];
};

export type MarketingIndustryContent = {
	kind: "industry";
	slug: string;
	name: string;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage?: string;
	summary: string;
	primaryCta: MarketingCTA;
	secondaryCta?: MarketingCTA;
	seo: MarketingSEO;
	fieldTypes: string[];
	painPoints: string[];
	valueProps: MarketingValueProp[];
	playbook: MarketingWorkflow[];
	stats: MarketingStat[];
	testimonial?: MarketingTestimonial;
	faq: MarketingFAQ[];
};

export type MarketingContent =
	| MarketingFeatureContent
	| MarketingIndustryContent
	| MarketingIntegrationContent;

export type IntegrationPartner = {
	name: string;
	website: string;
	logo?: string;
};

export type MarketingIntegrationContent = {
	kind: "integration";
	slug: string;
	name: string;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage?: string;
	summary: string;
	partner: IntegrationPartner;
	categories: string[];
	primaryCta: MarketingCTA;
	secondaryCta?: MarketingCTA;
	seo: MarketingSEO;
	valueProps: MarketingValueProp[];
	workflows: MarketingWorkflow[];
	stats?: MarketingStat[];
	requirements?: string[];
	resources?: MarketingCTA[];
	related?: string[];
	faq: MarketingFAQ[];
};
