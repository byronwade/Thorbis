import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ??
	process.env.NEXT_PUBLIC_BASE_URL ??
	"https://thorbis.com";

const KB_ROOT = path.join(process.cwd(), "content/kb");
const KB_CATEGORY_FILENAME = "_category.json";
const MARKDOWN_EXTENSION_REGEX = /\.md$/;
const SLUG_SEPARATOR_REGEX = /-/g;
const CHANGEFREQ_DAILY = "daily";
const CHANGEFREQ_WEEKLY = "weekly";
const PRIORITY_HOME = 1;
const PRIORITY_PRICING = 0.9;
const PRIORITY_KB_CATEGORY = 0.85;
const PRIORITY_KB_ARTICLE_FEATURED = 0.9;
const PRIORITY_KB_ARTICLE_STANDARD = 0.8;
const PRIORITY_KB_ROOT = 0.9;
const PRIORITY_MARKETING_DEFAULT = 0.8;
const PRIORITY_MARKETING_FEATURES = 0.85;
const PRIORITY_MARKETING_COMPARISON = 0.75;
const PRIORITY_DEFAULT_SITEMAP = 0.7;

async function walkKnowledgeBase(dir, segments = []) {
	const entries = [];
	const dirEntries = await safeReadDir(dir);

	for (const entry of dirEntries) {
		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			const childSegments = [...segments, entry.name];
			const childEntries = await walkKnowledgeBase(entryPath, childSegments);
			entries.push(...childEntries);
			continue;
		}

		if (!entry.isFile()) {
			continue;
		}

		if (entry.name === KB_CATEGORY_FILENAME) {
			const categoryEntry = await createCategoryEntry(entryPath, segments);
			if (categoryEntry) {
				entries.push(categoryEntry);
			}
			continue;
		}

		if (MARKDOWN_EXTENSION_REGEX.test(entry.name)) {
			const slug = entry.name.replace(MARKDOWN_EXTENSION_REGEX, "");
			const articleEntry = await createArticleEntry(entryPath, segments, slug);
			if (articleEntry) {
				entries.push(articleEntry);
			}
		}
	}

	return entries;
}

function collectKnowledgeBaseEntries() {
	return walkKnowledgeBase(KB_ROOT);
}

async function safeReadDir(dir) {
	try {
		return await readdir(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}

async function createCategoryEntry(entryPath, segments) {
	if (segments.length === 0) {
		return null;
	}

	const categoryPath = `/kb/${segments.join("/")}`;
	const fileStat = await stat(entryPath);

	return {
		loc: `${SITE_URL}${categoryPath}`,
		lastmod: fileStat.mtime.toISOString(),
		changefreq: CHANGEFREQ_DAILY,
		priority: PRIORITY_KB_CATEGORY,
	};
}

async function createArticleEntry(entryPath, segments, slug) {
	const fileContents = await readFile(entryPath, "utf8");
	const { data } = matter(fileContents);

	if (data?.published === false) {
		return null;
	}

	const lastmod = await getArticleLastModifiedDate(data, entryPath);
	const featuredImage = resolveFeaturedImage(data?.featuredImage);
	const priority = data?.featured
		? PRIORITY_KB_ARTICLE_FEATURED
		: PRIORITY_KB_ARTICLE_STANDARD;

	return {
		loc: `${SITE_URL}/kb/${[...segments, slug].join("/")}`,
		lastmod,
		changefreq: CHANGEFREQ_WEEKLY,
		priority,
		img: featuredImage
			? [
					{
						url: featuredImage,
						caption: data?.title ?? slug.replace(SLUG_SEPARATOR_REGEX, " "),
					},
				]
			: undefined,
	};
}

async function getArticleLastModifiedDate(data, entryPath) {
	const publishedOrUpdated =
		data?.updatedAt ?? data?.publishedAt ?? (await stat(entryPath)).mtime;

	return publishedOrUpdated instanceof Date
		? publishedOrUpdated.toISOString()
		: new Date(publishedOrUpdated).toISOString();
}

function resolveFeaturedImage(featuredImage) {
	if (!featuredImage) {
		return;
	}

	return featuredImage.startsWith("http")
		? featuredImage
		: `${SITE_URL}${featuredImage}`;
}

const FEATURES_PATHS = [
	"/features",
	"/features/ai-assistant",
	"/features/crm",
	"/features/online-booking",
	"/features/marketing",
	"/features/customer-portal",
	"/features/scheduling",
	"/features/mobile-app",
	"/features/routing",
	"/features/inventory",
	"/features/team-management",
	"/features/invoicing",
	"/features/quickbooks",
	"/features/estimates",
	"/features/financing",
	"/features/payroll",
];

const INDUSTRY_PATHS = [
	"/industries",
	"/industries/hvac",
	"/industries/plumbing",
	"/industries/electrical",
	"/industries/handyman",
	"/industries/landscaping",
	"/industries/pool-service",
	"/industries/pest-control",
	"/industries/appliance-repair",
	"/industries/roofing",
	"/industries/cleaning",
	"/industries/locksmith",
	"/industries/garage-door",
];

const INTEGRATION_PATHS = [
	"/integrations",
	"/integrations/quickbooks",
	"/integrations/stripe",
	"/integrations/zapier",
];

const COMPARISON_PATHS = [
	"/vs",
	"/vs/servicetitan",
	"/vs/housecall-pro",
	"/vs/jobber",
	"/vs/fieldedge",
	"/vs/servicem8",
	"/vs/workiz",
];

const COMPANY_PATHS = [
	"/about",
	"/careers",
	"/partners",
	"/press",
	"/contact",
	"/demo",
	"/switch",
	"/roi",
	"/free-tools",
	"/implementation",
	"/reviews",
	"/security",
	"/privacy",
	"/terms",
	"/cookies",
	"/gdpr",
	"/accessibility",
	"/sitemap",
	"/status",
	"/community",
	"/api-docs",
	"/blog",
	"/case-studies",
	"/webinars",
	"/templates",
	"/help",
];

function buildMarketingEntries(
	paths,
	changefreq = CHANGEFREQ_WEEKLY,
	priority = PRIORITY_MARKETING_DEFAULT,
) {
	const lastmod = new Date().toISOString();
	return paths.map((targetPath) => ({
		loc: `${SITE_URL}${targetPath}`,
		changefreq,
		priority,
		lastmod,
	}));
}

export default {
	siteUrl: SITE_URL,
	generateRobotsTxt: false,
	generateIndexSitemap: true,
	sitemapBaseFileName: "thorbis-sitemap",
	outDir: "./public/seo",
	exclude: ["/contracts/sign/*", "/contracts/download/*"],
	autoLastmod: true,
	changefreq: CHANGEFREQ_DAILY,
	priority: PRIORITY_DEFAULT_SITEMAP,
	transform: (config, pathname) => {
		if (pathname === "/") {
			return {
				loc: pathname,
				changefreq: CHANGEFREQ_DAILY,
				priority: PRIORITY_HOME,
				lastmod: new Date().toISOString(),
			};
		}

		if (pathname === "/pricing") {
			return {
				loc: pathname,
				changefreq: CHANGEFREQ_WEEKLY,
				priority: PRIORITY_PRICING,
				lastmod: new Date().toISOString(),
			};
		}

		if (pathname.startsWith("/kb")) {
			return {
				loc: pathname,
				changefreq: CHANGEFREQ_DAILY,
				priority: PRIORITY_KB_CATEGORY,
				lastmod: new Date().toISOString(),
			};
		}

		return config.defaultTransform(config, pathname);
	},
	additionalPaths: async () => {
		const knowledgeBaseEntries = await collectKnowledgeBaseEntries();

		return [
			{
				loc: `${SITE_URL}/kb`,
				changefreq: CHANGEFREQ_DAILY,
				priority: PRIORITY_KB_ROOT,
				lastmod: new Date().toISOString(),
			},
			...buildMarketingEntries(
				INTEGRATION_PATHS,
				CHANGEFREQ_WEEKLY,
				PRIORITY_MARKETING_DEFAULT,
			),
			...buildMarketingEntries(
				FEATURES_PATHS,
				CHANGEFREQ_WEEKLY,
				PRIORITY_MARKETING_FEATURES,
			),
			...buildMarketingEntries(
				INDUSTRY_PATHS,
				CHANGEFREQ_WEEKLY,
				PRIORITY_MARKETING_DEFAULT,
			),
			...buildMarketingEntries(
				COMPARISON_PATHS,
				CHANGEFREQ_WEEKLY,
				PRIORITY_MARKETING_COMPARISON,
			),
			...buildMarketingEntries(
				COMPANY_PATHS,
				CHANGEFREQ_WEEKLY,
				PRIORITY_MARKETING_DEFAULT,
			),
			...knowledgeBaseEntries,
		];
	},
	additionalSitemaps: [`${SITE_URL}/kb/sitemap.xml`, `${SITE_URL}/feed`],
};
