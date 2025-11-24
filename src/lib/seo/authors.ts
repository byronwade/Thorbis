/**
 * Author Configuration for E-E-A-T
 *
 * Pre-configured author profiles with expertise signals
 * for use in blog posts and content.
 */

import { SEO_URLS } from "./config";
import type { AuthorInfo } from "./structured-data";

/**
 * Default Thorbis Team author - used when no specific author
 */
export const THORBIS_TEAM_AUTHOR: AuthorInfo = {
	name: "Thorbis Team",
	jobTitle: "Field Service Software Experts",
	description:
		"The Thorbis team brings decades of combined experience in field service management, software development, and contractor operations. We're passionate about helping service businesses grow.",
	url: `${SEO_URLS.site}/about`,
	image: `${SEO_URLS.site}/images/team/thorbis-team.jpg`,
	sameAs: [
		"https://linkedin.com/company/thorbis",
		"https://twitter.com/thorbis",
		"https://youtube.com/@thorbis",
	],
	expertise: [
		"Field Service Management",
		"HVAC Software",
		"Plumbing Software",
		"Electrical Contractor Software",
		"Service Business Operations",
		"Scheduling Optimization",
		"Invoicing & Payments",
		"Customer Relationship Management",
		"AI for Service Businesses",
	],
	worksFor: {
		name: "Thorbis",
		url: SEO_URLS.site,
	},
};

/**
 * Known authors with full E-E-A-T profiles
 * Add team members here as they create content
 */
export const AUTHORS: Record<string, AuthorInfo> = {
	"thorbis-team": THORBIS_TEAM_AUTHOR,

	// Example individual author - add real team members as needed
	// "john-smith": {
	//   name: "John Smith",
	//   jobTitle: "Head of Product",
	//   description: "John has 15 years of experience in field service software...",
	//   url: `${SEO_URLS.site}/about/team/john-smith`,
	//   image: `${SEO_URLS.site}/images/team/john-smith.jpg`,
	//   sameAs: ["https://linkedin.com/in/johnsmith"],
	//   expertise: ["Product Management", "Field Service", "SaaS"],
	//   worksFor: { name: "Thorbis", url: SEO_URLS.site },
	// },
};

/**
 * Get author info by name or slug
 * Falls back to Thorbis Team if not found
 */
export function getAuthorInfo(authorNameOrSlug?: string | null): AuthorInfo {
	if (!authorNameOrSlug) {
		return THORBIS_TEAM_AUTHOR;
	}

	// Try exact match by slug
	const slug = authorNameOrSlug.toLowerCase().replace(/\s+/g, "-");
	if (AUTHORS[slug]) {
		return AUTHORS[slug];
	}

	// Try match by name
	const byName = Object.values(AUTHORS).find(
		(author) => author.name.toLowerCase() === authorNameOrSlug.toLowerCase()
	);
	if (byName) {
		return byName;
	}

	// Return custom author with basic E-E-A-T signals
	return {
		name: authorNameOrSlug,
		jobTitle: "Contributor",
		expertise: ["Field Service Management"],
		worksFor: {
			name: "Thorbis",
			url: SEO_URLS.site,
		},
	};
}

/**
 * Industry-specific expertise tags for content categorization
 */
export const EXPERTISE_BY_CATEGORY: Record<string, string[]> = {
	hvac: [
		"HVAC Software",
		"HVAC Business Management",
		"Heating and Cooling Services",
		"Service Agreement Management",
	],
	plumbing: [
		"Plumbing Software",
		"Plumbing Business Management",
		"Drain Cleaning Services",
		"Water Heater Installation",
	],
	electrical: [
		"Electrical Contractor Software",
		"Electrical Business Management",
		"Commercial Electrical Services",
	],
	general: [
		"Field Service Management",
		"Service Business Operations",
		"Contractor Management",
	],
	scheduling: [
		"Scheduling Optimization",
		"Dispatch Management",
		"Route Optimization",
	],
	invoicing: [
		"Invoicing Best Practices",
		"Payment Processing",
		"Accounts Receivable",
	],
	crm: [
		"Customer Relationship Management",
		"Customer Retention",
		"Service History Tracking",
	],
};
