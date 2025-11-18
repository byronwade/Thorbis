import type {
	AggregateRating,
	Article,
	BreadcrumbList,
	FAQPage,
	HowTo,
	Organization,
	Service,
	SoftwareApplication,
	WebSite,
	WithContext,
} from "schema-dts";
import { SEO_BRAND, SEO_URLS } from "@/lib/seo/config";
import {
	createArticleSchema,
	createBreadcrumbSchema,
	createFAQSchema,
	createHowToSchema,
	createOrganizationSchema,
	createReviewAggregateSchema,
	createServiceSchema,
	createSoftwareApplicationSchema,
	createWebsiteSchema,
} from "@/lib/seo/structured-data";

type ValidationTarget =
	| WithContext<Organization>
	| WithContext<WebSite>
	| WithContext<BreadcrumbList>
	| WithContext<FAQPage>
	| WithContext<SoftwareApplication>
	| WithContext<Service>
	| WithContext<Article>
	| WithContext<HowTo>
	| WithContext<AggregateRating>;

const siteUrl = SEO_URLS.site;

const schemas: Array<{ name: string; schema: ValidationTarget }> = [
	{ name: "Organization", schema: createOrganizationSchema() },
	{ name: "Website", schema: createWebsiteSchema() },
	{
		name: "Breadcrumb",
		schema: createBreadcrumbSchema([
			{ name: "Home", url: siteUrl },
			{ name: "Knowledge Base", url: `${siteUrl}/kb` },
		]),
	},
	{
		name: "FAQ",
		schema: createFAQSchema([
			{
				question: "How do I get started with Thorbis?",
				answer:
					"Visit the Thorbis knowledge base to explore onboarding guides and tutorials.",
			},
			{
				question: "Does Thorbis support technician scheduling?",
				answer:
					"Yes. Thorbis includes end-to-end scheduling, dispatch, and job tracking features.",
			},
		]),
	},
	{
		name: "SoftwareApplication",
		schema: createSoftwareApplicationSchema({
			price: { amount: "100", currency: "USD", billingInterval: "MONTH" },
			rating: { ratingValue: "4.9", reviewCount: "327", bestRating: "5" },
			operatingSystems: ["Web"],
		}),
	},
	{
		name: "Service",
		schema: createServiceSchema({
			name: SEO_BRAND.product,
			description:
				"End-to-end field management platform for service companies.",
		}),
	},
	{
		name: "Article",
		schema: createArticleSchema({
			title: "Thorbis Knowledge Base Overview",
			description:
				"Learn how Thorbis helps you deliver world-class service operations.",
			url: `${siteUrl}/kb/getting-started/welcome`,
			publishedTime: new Date().toISOString(),
			authorName: SEO_BRAND.company,
			tags: ["knowledge base", "support"],
			section: "Knowledge Base",
		}),
	},
	{
		name: "HowTo",
		schema: createHowToSchema({
			name: "Configure a Thorbis workspace",
			steps: [
				{
					name: "Invite your team",
					text: "Add technicians and dispatchers from the admin panel.",
				},
				{
					name: "Customize job types",
					text: "Define workflows, durations, and required tools.",
				},
				{
					name: "Connect billing",
					text: "Integrate payments to invoice customers automatically.",
				},
			],
			supplies: ["Thorbis subscription"],
			tools: ["Thorbis web app"],
			totalTime: "PT15M",
		}),
	},
	{
		name: "AggregateRating",
		schema: createReviewAggregateSchema({
			item: {
				name: SEO_BRAND.product,
				url: siteUrl,
				type: "SoftwareApplication",
			},
			ratingValue: 4.9,
			reviewCount: 327,
		}),
	},
].map(({ name, schema }) => ({
	name,
	schema: schema as ValidationTarget,
}));

const errors: string[] = [];

for (const { name, schema } of schemas) {
	if (!(schema["@context"] && schema["@type"])) {
		errors.push(`${name} schema is missing '@context' or '@type'.`);
	}
}

if (errors.length > 0) {
	process.stderr.write(
		`SEO structured data validation failed:\\n${errors.map((message) => `- ${message}`).join("\\n")}\\n`,
	);
	process.exit(1);
}

process.stdout.write("SEO structured data validation passed\\n");
