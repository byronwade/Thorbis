/**
 * Advanced SEO Schema Types for 2025
 *
 * Based on latest SEO research:
 * - AI-powered search optimization (Google AI Overviews, SGE)
 * - Enhanced structured data for better visibility
 * - E-E-A-T signal optimization
 * - Voice search and semantic search support
 */

import { SEO_BRAND, SEO_URLS } from "./config";

/**
 * VideoObject Schema - Critical for AI Overviews
 * Videos are 50x more likely to appear in AI-generated responses
 */
export type VideoObjectSchemaOptions = {
	name: string;
	description: string;
	thumbnailUrl: string;
	uploadDate: string;
	contentUrl?: string;
	embedUrl?: string;
	duration?: string; // ISO 8601 format (e.g., "PT1M30S")
	transcript?: string; // Full transcript for AI understanding
	keywords?: string[];
};

export function createVideoObjectSchema(options: VideoObjectSchemaOptions) {
	const {
		name,
		description,
		thumbnailUrl,
		uploadDate,
		contentUrl,
		embedUrl,
		duration,
		transcript,
		keywords,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "VideoObject",
		name,
		description,
		thumbnailUrl,
		uploadDate,
		...(contentUrl && { contentUrl }),
		...(embedUrl && { embedUrl }),
		...(duration && { duration }),
		...(transcript && { transcript }),
		...(keywords && { keywords: keywords.join(", ") }),
		publisher: {
			"@type": "Organization",
			name: SEO_BRAND.company,
			logo: {
				"@type": "ImageObject",
				url: `${SEO_URLS.site}/logo.png`,
			},
		},
	};
}

/**
 * ItemList Schema - For feature pages, product listings
 * Helps AI understand page structure and relationships
 */
export type ItemListSchemaOptions = {
	name: string;
	description?: string;
	items: Array<{
		name: string;
		url: string;
		description?: string;
		image?: string;
	}>;
};

export function createItemListSchema(options: ItemListSchemaOptions) {
	const { name, description, items } = options;

	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name,
		...(description && { description }),
		numberOfItems: items.length,
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			url: item.url,
			...(item.description && { description: item.description }),
			...(item.image && {
				image: {
					"@type": "ImageObject",
					url: item.image,
				},
			}),
		})),
	};
}

/**
 * Product Schema - For SaaS products
 * Critical for Google Shopping and AI Overviews
 */
export type ProductSchemaOptions = {
	name: string;
	description: string;
	brand?: string;
	offers: {
		price: string;
		priceCurrency: string;
		priceValidUntil?: string;
		availability?: "InStock" | "OutOfStock" | "PreOrder";
		url?: string;
		billingInterval?: "DAY" | "WEEK" | "MONTH" | "YEAR";
	};
	aggregateRating?: {
		ratingValue: number;
		reviewCount: number;
		bestRating?: number;
	};
	image?: string;
	category?: string;
};

export function createProductSchema(options: ProductSchemaOptions) {
	const { name, description, brand, offers, aggregateRating, image, category } =
		options;

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name,
		description,
		brand: {
			"@type": "Brand",
			name: brand || SEO_BRAND.company,
		},
		...(image && {
			image: {
				"@type": "ImageObject",
				url: image,
			},
		}),
		...(category && { category }),
		offers: {
			"@type": "Offer",
			price: offers.price,
			priceCurrency: offers.priceCurrency,
			...(offers.priceValidUntil && {
				priceValidUntil: offers.priceValidUntil,
			}),
			availability: `https://schema.org/${offers.availability || "InStock"}`,
			...(offers.url && { url: offers.url }),
			...(offers.billingInterval && {
				priceSpecification: {
					"@type": "UnitPriceSpecification",
					price: offers.price,
					priceCurrency: offers.priceCurrency,
					unitText: offers.billingInterval,
				},
			}),
			seller: {
				"@type": "Organization",
				name: SEO_BRAND.company,
			},
		},
		...(aggregateRating && {
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: aggregateRating.ratingValue,
				reviewCount: aggregateRating.reviewCount,
				bestRating: aggregateRating.bestRating || 5,
			},
		}),
	};
}

/**
 * LocalBusiness Schema - Multi-location support
 * Essential for local SEO and voice search
 */
export type LocalBusinessSchemaOptions = {
	name: string;
	address: {
		streetAddress: string;
		addressLocality: string;
		addressRegion: string;
		postalCode: string;
		addressCountry: string;
	};
	telephone?: string;
	email?: string;
	openingHours?: string[]; // e.g., ["Mo-Fr 09:00-17:00"]
	priceRange?: string; // e.g., "$200-$2000"
	image?: string;
	latitude?: number;
	longitude?: number;
};

export function createLocalBusinessSchema(options: LocalBusinessSchemaOptions) {
	const {
		name,
		address,
		telephone,
		email,
		openingHours,
		priceRange,
		image,
		latitude,
		longitude,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name,
		address: {
			"@type": "PostalAddress",
			streetAddress: address.streetAddress,
			addressLocality: address.addressLocality,
			addressRegion: address.addressRegion,
			postalCode: address.postalCode,
			addressCountry: address.addressCountry,
		},
		...(telephone && { telephone }),
		...(email && { email }),
		...(openingHours && { openingHours }),
		...(priceRange && { priceRange }),
		...(image && { image }),
		...(latitude &&
			longitude && {
				geo: {
					"@type": "GeoCoordinates",
					latitude,
					longitude,
				},
			}),
	};
}

/**
 * Course/Tutorial Schema - For knowledge base and tutorials
 * Helps appear in Google's education features
 */
export type CourseSchemaOptions = {
	name: string;
	description: string;
	provider: string;
	url?: string;
	courseCode?: string;
	hasCourseInstance?: Array<{
		courseMode: string; // "online", "onsite", "blended"
		startDate?: string;
		endDate?: string;
	}>;
};

export function createCourseSchema(options: CourseSchemaOptions) {
	const { name, description, provider, url, courseCode, hasCourseInstance } =
		options;

	return {
		"@context": "https://schema.org",
		"@type": "Course",
		name,
		description,
		provider: {
			"@type": "Organization",
			name: provider || SEO_BRAND.company,
			url: SEO_URLS.site,
		},
		...(url && { url }),
		...(courseCode && { courseCode }),
		...(hasCourseInstance && {
			hasCourseInstance: hasCourseInstance.map((instance) => ({
				"@type": "CourseInstance",
				courseMode: instance.courseMode,
				...(instance.startDate && { startDate: instance.startDate }),
				...(instance.endDate && { endDate: instance.endDate }),
			})),
		}),
	};
}

/**
 * Person Schema with E-E-A-T signals
 * Critical for author authority and expert content
 */
export type PersonSchemaOptions = {
	name: string;
	jobTitle?: string;
	description?: string;
	image?: string;
	url?: string;
	sameAs?: string[]; // Social profiles
	expertise?: string[]; // Areas of expertise
	alumniOf?: string; // Educational background
	award?: string[]; // Awards and recognition
};

export function createPersonSchema(options: PersonSchemaOptions) {
	const {
		name,
		jobTitle,
		description,
		image,
		url,
		sameAs,
		expertise,
		alumniOf,
		award,
	} = options;

	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name,
		...(jobTitle && { jobTitle }),
		...(description && { description }),
		...(image && { image }),
		...(url && { url }),
		...(sameAs && { sameAs }),
		...(expertise && { knowsAbout: expertise }),
		...(alumniOf && {
			alumniOf: {
				"@type": "Organization",
				name: alumniOf,
			},
		}),
		...(award && { award }),
	};
}

/**
 * Speakable Schema - Voice search optimization
 * Helps Google identify content for voice responses
 */
export function createSpeakableSchema(sections: string[]) {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: sections, // e.g., [".intro", ".summary"]
		},
	};
}

/**
 * CollectionPage Schema - For category/topic pages
 * Helps organize content hierarchy for AI understanding
 */
export type CollectionPageSchemaOptions = {
	name: string;
	description: string;
	url: string;
	about?: string[];
	hasPart?: Array<{
		"@type": string;
		name: string;
		url: string;
	}>;
};

export function createCollectionPageSchema(
	options: CollectionPageSchemaOptions,
) {
	const { name, description, url, about, hasPart } = options;

	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name,
		description,
		url,
		...(about && { about }),
		...(hasPart && { hasPart }),
	};
}

/**
 * QAPage Schema - For Q&A content
 * Better than FAQ for specific question pages
 */
export type QAPageSchemaOptions = {
	question: {
		name: string;
		text: string;
		dateCreated?: string;
		author?: string;
	};
	acceptedAnswer: {
		text: string;
		dateCreated?: string;
		upvoteCount?: number;
		author?: string;
	};
};

export function createQAPageSchema(options: QAPageSchemaOptions) {
	const { question, acceptedAnswer } = options;

	return {
		"@context": "https://schema.org",
		"@type": "QAPage",
		mainEntity: {
			"@type": "Question",
			name: question.name,
			text: question.text,
			...(question.dateCreated && { dateCreated: question.dateCreated }),
			...(question.author && {
				author: {
					"@type": "Person",
					name: question.author,
				},
			}),
			acceptedAnswer: {
				"@type": "Answer",
				text: acceptedAnswer.text,
				...(acceptedAnswer.dateCreated && {
					dateCreated: acceptedAnswer.dateCreated,
				}),
				...(acceptedAnswer.upvoteCount && {
					upvoteCount: acceptedAnswer.upvoteCount,
				}),
				...(acceptedAnswer.author && {
					author: {
						"@type": "Person",
						name: acceptedAnswer.author,
					},
				}),
			},
		},
	};
}

/**
 * Enhanced Review Schema - Individual reviews with rich data
 * More comprehensive than AggregateRating, provides better E-E-A-T signals
 */
export type IndividualReview = {
	author: string;
	datePublished: string;
	reviewBody: string;
	ratingValue: number;
	jobTitle?: string;
	company?: string;
	location?: string;
	verifiedPurchase?: boolean;
	bestRating?: number;
	worstRating?: number;
};

export type EnhancedReviewSchemaOptions = {
	itemReviewed: {
		name: string;
		url?: string;
		image?: string;
		type?: "Product" | "Service" | "SoftwareApplication";
	};
	reviews: IndividualReview[];
	aggregateRating: {
		ratingValue: number;
		reviewCount: number;
		bestRating?: number;
		worstRating?: number;
	};
};

export function createEnhancedReviewSchema(
	options: EnhancedReviewSchemaOptions,
) {
	const { itemReviewed, reviews, aggregateRating } = options;

	return {
		"@context": "https://schema.org",
		"@type": itemReviewed.type || "SoftwareApplication",
		name: itemReviewed.name,
		...(itemReviewed.url && { url: itemReviewed.url }),
		...(itemReviewed.image && {
			image: {
				"@type": "ImageObject",
				url: itemReviewed.image,
			},
		}),
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: aggregateRating.ratingValue.toFixed(1),
			reviewCount: aggregateRating.reviewCount,
			bestRating: aggregateRating.bestRating || 5,
			worstRating: aggregateRating.worstRating || 1,
		},
		review: reviews.map((review) => ({
			"@type": "Review",
			author: {
				"@type": "Person",
				name: review.author,
				...(review.jobTitle && { jobTitle: review.jobTitle }),
				...(review.company && {
					worksFor: {
						"@type": "Organization",
						name: review.company,
					},
				}),
				...(review.location && {
					address: {
						"@type": "PostalAddress",
						addressLocality: review.location,
					},
				}),
			},
			datePublished: review.datePublished,
			reviewBody: review.reviewBody,
			...(review.verifiedPurchase !== undefined && {
				itemReviewed: {
					"@type": "Thing",
					name: itemReviewed.name,
				},
			}),
			reviewRating: {
				"@type": "Rating",
				ratingValue: review.ratingValue,
				bestRating: review.bestRating || 5,
				worstRating: review.worstRating || 1,
			},
		})),
	};
}
