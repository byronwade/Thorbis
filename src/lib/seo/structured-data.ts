/**
 * JSON-LD structured data builders for Thorbis marketing surfaces.
 *
 * Each helper returns a plain object that can be serialized with
 * `JSON.stringify` before being embedded via a `<script type="application/ld+json">`.
 */

import {
	buildShareImageUrl,
	SEO_BRAND,
	SEO_COPY,
	SEO_SOCIAL,
	SEO_URLS,
} from "./config";

// Re-export advanced schemas for convenience
export * from "./advanced-schemas";

export type OrganizationSchemaOptions = {
	name?: string;
	legalName?: string;
	url?: string;
	logoPath?: string;
	sameAs?: string[];
	contactEmail?: string;
	contactPhone?: string;
};

export function createOrganizationSchema(
	options: OrganizationSchemaOptions = {},
) {
	const {
		name = SEO_BRAND.company,
		legalName = SEO_BRAND.company,
		url = SEO_URLS.site,
		logoPath = "/logo.png",
		sameAs = [
			SEO_SOCIAL.profiles.facebook,
			SEO_SOCIAL.profiles.linkedin,
			SEO_SOCIAL.profiles.youtube,
			SEO_SOCIAL.profiles.instagram,
			SEO_SOCIAL.profiles.github,
		],
		contactEmail = SEO_URLS.supportEmail,
		contactPhone,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name,
		legalName,
		url,
		logo: {
			"@type": "ImageObject",
			url: buildShareImageUrl({ path: logoPath }),
		},
		description: SEO_COPY.defaultDescription,
		sameAs,
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			email: contactEmail,
			...(contactPhone ? { telephone: contactPhone } : {}),
		},
	};
}

export type WebSiteSchemaOptions = {
	url?: string;
	name?: string;
	description?: string;
	searchUrl?: string;
};

export function createWebsiteSchema(options: WebSiteSchemaOptions = {}) {
	const {
		url = SEO_URLS.site,
		name = SEO_BRAND.short,
		description = SEO_COPY.defaultDescription,
		searchUrl = `${SEO_URLS.site}/kb/search?q={search_term_string}`,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		url,
		name,
		description,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: searchUrl,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

export type BreadcrumbItem = {
	name: string;
	url: string;
};

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

export type FAQQuestion = {
	question: string;
	answer: string;
};

export function createFAQSchema(questions: FAQQuestion[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: questions.map((q) => ({
			"@type": "Question",
			name: q.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: q.answer,
			},
		})),
	};
}

export type SoftwareApplicationSchemaOptions = {
	name?: string;
	description?: string;
	operatingSystems?: string[];
	price?: {
		amount: string;
		currency: string;
		billingInterval?: "DAY" | "WEEK" | "MONTH" | "YEAR";
	};
	rating?: {
		ratingValue: string;
		reviewCount: string;
		bestRating?: string;
		worstRating?: string;
	};
	category?: string;
	applicationSuite?: string;
};

export function createSoftwareApplicationSchema(
	options: SoftwareApplicationSchemaOptions = {},
) {
	const {
		name = SEO_BRAND.product,
		description = SEO_COPY.defaultDescription,
		operatingSystems = ["Web"],
		price,
		rating,
		category = "BusinessApplication",
		applicationSuite = SEO_BRAND.product,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name,
		applicationCategory: category,
		applicationSuite,
		operatingSystem: operatingSystems.join(", "),
		description,
		offers: price && {
			"@type": "Offer",
			price: price.amount,
			priceCurrency: price.currency,
			priceSpecification:
				price.billingInterval === undefined
					? undefined
					: {
							"@type": "UnitPriceSpecification",
							price: price.amount,
							priceCurrency: price.currency,
							unitText: price.billingInterval,
						},
		},
		aggregateRating: rating && {
			"@type": "AggregateRating",
			ratingValue: rating.ratingValue,
			ratingCount: rating.reviewCount,
			...(rating.bestRating ? { bestRating: rating.bestRating } : {}),
			...(rating.worstRating ? { worstRating: rating.worstRating } : {}),
		},
		author: {
			"@type": "Organization",
			name: SEO_BRAND.company,
			url: SEO_URLS.site,
		},
	};
}

export type ServiceSchemaOptions = {
	name: string;
	description: string;
	serviceType?: string;
	areaServed?: string[];
	offers?: Array<{
		price: string;
		currency: string;
		description?: string;
	}>;
};

export function createServiceSchema(options: ServiceSchemaOptions) {
	const {
		name,
		description,
		serviceType = "Field Service Management",
		areaServed = ["United States"],
		offers,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name,
		description,
		serviceType,
		provider: {
			"@type": "Organization",
			name: SEO_BRAND.company,
			url: SEO_URLS.site,
			sameAs: [SEO_SOCIAL.twitterHandle],
		},
		areaServed: areaServed.map((name) => ({
			"@type": "AdministrativeArea",
			name,
		})),
		offers:
			offers?.map((offer) => ({
				"@type": "Offer",
				price: offer.price,
				priceCurrency: offer.currency,
				description: offer.description,
			})) ?? undefined,
	};
}

export type ArticleSchemaOptions = {
	title: string;
	description: string;
	url: string;
	image?: string;
	publishedTime?: string;
	modifiedTime?: string;
	authorName?: string;
	tags?: string[];
	section?: string;
	wordCount?: number;
	estimatedReadTime?: string;
};

export function createArticleSchema(options: ArticleSchemaOptions) {
	const {
		title,
		description,
		url,
		image,
		publishedTime,
		modifiedTime,
		authorName = SEO_BRAND.company,
		tags,
		section,
		wordCount,
		estimatedReadTime,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description,
		mainEntityOfPage: url,
		image: [buildShareImageUrl(image ? { path: image } : undefined)],
		datePublished: publishedTime,
		dateModified: modifiedTime ?? publishedTime,
		author: {
			"@type": "Person",
			name: authorName,
		},
		publisher: {
			"@type": "Organization",
			name: SEO_BRAND.company,
			logo: {
				"@type": "ImageObject",
				url: buildShareImageUrl({ path: "/logo.png" }),
			},
		},
		keywords: tags,
		articleSection: section,
		wordCount,
		timeRequired: estimatedReadTime,
	};
}

export type HowToStep = {
	name: string;
	text?: string;
	url?: string;
	image?: string;
};

export type HowToSchemaOptions = {
	name: string;
	description?: string;
	steps: HowToStep[];
	supplies?: string[];
	tools?: string[];
	estimatedCost?: {
		price: string;
		currency: string;
	};
	totalTime?: string;
};

export function createHowToSchema(options: HowToSchemaOptions) {
	const {
		name,
		description,
		steps,
		supplies,
		tools,
		estimatedCost,
		totalTime,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name,
		description,
		supply: supplies?.map((supply) => ({
			"@type": "HowToSupply",
			name: supply,
		})),
		tool: tools?.map((tool) => ({
			"@type": "HowToTool",
			name: tool,
		})),
		step: steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.name,
			text: step.text,
			url: step.url,
			image: step.image ? buildShareImageUrl({ path: step.image }) : undefined,
		})),
		totalTime,
		estimatedCost: estimatedCost && {
			"@type": "MonetaryAmount",
			currency: estimatedCost.currency,
			value: estimatedCost.price,
		},
	};
}

export type ReviewAggregateSchemaOptions = {
	item: {
		name: string;
		url?: string;
		image?: string;
		type?: "Product" | "Service" | "SoftwareApplication";
		applicationCategory?: string;
		operatingSystem?: string;
	};
	ratingValue: number;
	reviewCount: number;
	bestRating?: number;
	worstRating?: number;
};

export function createReviewAggregateSchema(
	options: ReviewAggregateSchemaOptions,
) {
	const {
		item,
		ratingValue,
		reviewCount,
		bestRating = 5,
		worstRating = 1,
	} = options;

	const itemReviewed: Record<string, unknown> = {
		"@type": item.type ?? "SoftwareApplication",
		name: item.name,
		url: item.url ?? SEO_URLS.site,
		image: item.image
			? buildShareImageUrl({ path: item.image })
			: buildShareImageUrl(),
	};

	// Add required SoftwareApplication properties if type is SoftwareApplication
	if (item.type === "SoftwareApplication" || !item.type) {
		itemReviewed.applicationCategory =
			item.applicationCategory ?? "BusinessApplication";
		itemReviewed.operatingSystem = item.operatingSystem ?? "Web";
	}

	return {
		"@context": "https://schema.org",
		"@type": "AggregateRating",
		ratingValue: ratingValue.toFixed(1),
		reviewCount: reviewCount.toString(),
		bestRating: bestRating.toString(),
		worstRating: worstRating.toString(),
		itemReviewed,
	};
}
