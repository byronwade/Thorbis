/**
 * Knowledge Base Category Page - Server Component
 *
 * Displays all articles in a category
 */

import { notFound } from "next/navigation";
import Script from "next/script";
import { getKBArticles, getKBCategories } from "@/actions/kb";
import { KBArticleCard } from "@/components/kb/kb-article-card";
import { KBSidebarWrapper } from "@/components/kb/kb-sidebar-wrapper";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateCategoryMetadata } from "@/lib/kb/metadata";
import { SEO_URLS } from "@/lib/seo/config";
import { createBreadcrumbSchema } from "@/lib/seo/structured-data";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categoriesResult = await getKBCategories();
  const category = categoriesResult.success
    ? categoriesResult.categories
        ?.flatMap((cat) => [cat, ...(cat.children || [])])
        .find((cat) => cat.slug === categorySlug)
    : null;

  if (!category) {
    return {};
  }

  return generateCategoryMetadata({
    title: category.title as string,
    slug: category.slug as string,
    description: category.description as string | undefined,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const [categoriesResult, articlesResult] = await Promise.all([
    getKBCategories(),
    getKBArticles({ category: categorySlug }),
  ]);

  const categories = categoriesResult.success
    ? categoriesResult.categories
    : [];
  const category = (categories || [])
    .flatMap((cat) => [cat, ...(cat.children || [])])
    .find((cat) => cat.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const articles =
    articlesResult.success && articlesResult.articles
      ? articlesResult.articles
      : [];

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <Script
        id={`kb-category-breadcrumb-${category.slug}`}
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(
          createBreadcrumbSchema([
            { name: "Home", url: SEO_URLS.site },
            { name: "Knowledge Base", url: `${SEO_URLS.site}/kb` },
            {
              name: String(category.title),
              url: `${SEO_URLS.site}/kb/${category.slug}`,
            },
          ])
        )}
      </Script>
      <KBSidebarWrapper currentCategory={String(category.slug)}>
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Category Header */}
          <div className="mb-8">
            {category.icon ? (
              <span className="mb-4 block text-4xl">
                {String(category.icon)}
              </span>
            ) : null}
            <h1 className="mb-2 font-bold text-4xl tracking-tight">
              {String(category.title)}
            </h1>
            {category.description ? (
              <p className="text-lg text-muted-foreground">
                {String(category.description)}
              </p>
            ) : null}
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <KBArticleCard article={article} key={article.id} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No articles yet</CardTitle>
                <CardDescription>
                  Articles in this category will appear here once published.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </KBSidebarWrapper>
    </>
  );
}
