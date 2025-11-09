import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  "https://thorbis.com";

const KB_ROOT = path.join(process.cwd(), "content/kb");

async function walkKnowledgeBase(dir, segments = []) {
  const entries = [];
  let dirEntries = [];

  try {
    dirEntries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    return entries;
  }

  for (const entry of dirEntries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const childSegments = [...segments, entry.name];
      entries.push(...(await walkKnowledgeBase(entryPath, childSegments)));
      continue;
    }

    if (entry.isFile() && entry.name === "_category.json") {
      if (segments.length === 0) {
        continue;
      }

      const categoryPath = `/kb/${segments.join("/")}`;
      const fileStat = await stat(entryPath);

      entries.push({
        loc: `${SITE_URL}${categoryPath}`,
        lastmod: fileStat.mtime.toISOString(),
        changefreq: "daily",
        priority: 0.85,
      });
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      const slug = entry.name.replace(/\.md$/, "");
      const articleSegments = [...segments, slug];
      const articlePath = `/kb/${articleSegments.join("/")}`;

      const fileContents = await readFile(entryPath, "utf8");
      const { data } = matter(fileContents);
      const isDraft = data?.published === false;

      if (isDraft) {
        continue;
      }

      const publishedOrUpdated =
        data?.updatedAt ?? data?.publishedAt ?? (await stat(entryPath)).mtime;
      const lastmod =
        publishedOrUpdated instanceof Date
          ? publishedOrUpdated.toISOString()
          : new Date(publishedOrUpdated).toISOString();

      const featuredImage = data?.featuredImage
        ? data.featuredImage.startsWith("http")
          ? data.featuredImage
          : `${SITE_URL}${data.featuredImage}`
        : undefined;

      entries.push({
        loc: `${SITE_URL}${articlePath}`,
        lastmod,
        changefreq: "weekly",
        priority: data?.featured ? 0.9 : 0.8,
        img: featuredImage
          ? [
              {
                url: featuredImage,
                caption: data?.title ?? slug.replace(/-/g, " "),
              },
            ]
          : undefined,
      });
    }
  }

  return entries;
}

async function collectKnowledgeBaseEntries() {
  return walkKnowledgeBase(KB_ROOT);
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

function buildMarketingEntries(paths, changefreq = "weekly", priority = 0.8) {
  const lastmod = new Date().toISOString();
  return paths.map((path) => ({
    loc: `${SITE_URL}${path}`,
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
  changefreq: "daily",
  priority: 0.7,
  transform: async (config, pathname) => {
    if (pathname === "/") {
      return {
        loc: pathname,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    if (pathname === "/pricing") {
      return {
        loc: pathname,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    if (pathname.startsWith("/kb")) {
      return {
        loc: pathname,
        changefreq: "daily",
        priority: 0.85,
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
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      ...buildMarketingEntries(FEATURES_PATHS, "weekly", 0.85),
      ...buildMarketingEntries(INDUSTRY_PATHS, "weekly", 0.8),
      ...buildMarketingEntries(COMPARISON_PATHS, "weekly", 0.75),
      ...buildMarketingEntries(COMPANY_PATHS, "weekly", 0.8),
      ...knowledgeBaseEntries,
    ];
  },
  additionalSitemaps: [`${SITE_URL}/kb/sitemap.xml`, `${SITE_URL}/feed`],
};
