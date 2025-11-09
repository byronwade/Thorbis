/**
 * Knowledge Base Homepage - Server Component
 *
 * Displays categories, featured articles, and search
 */

import { BookOpen, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { getKBArticles, getKBCategories } from "@/actions/kb";
import { KBArticleCard } from "@/components/kb/kb-article-card";
import { KBSearch } from "@/components/kb/kb-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateKBHomeMetadata } from "@/lib/kb/metadata";
import { SEO_URLS } from "@/lib/seo/config";
import {
  createBreadcrumbSchema,
  createWebsiteSchema,
} from "@/lib/seo/structured-data";

export const revalidate = 3600; // Revalidate every hour

export const metadata = generateKBHomeMetadata();

export default async function KBHomePage() {
  const [categoriesResult, featuredResult] = await Promise.all([
    getKBCategories(),
    getKBArticles({ featured: true, limit: 6 }),
  ]);

  const categories = categoriesResult.success
    ? categoriesResult.categories
    : [];
  const featuredArticles =
    featuredResult.success && featuredResult.articles
      ? featuredResult.articles
      : [];

  return (
    <>
      {/* Breadcrumb and WebSite Structured Data */}
      <Script
        id="kb-home-breadcrumb"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(
          createBreadcrumbSchema([
            { name: "Home", url: SEO_URLS.site },
            { name: "Knowledge Base", url: `${SEO_URLS.site}/kb` },
          ])
        )}
      </Script>
      <Script
        id="kb-home-website"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(createWebsiteSchema())}
      </Script>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl tracking-tight sm:text-5xl">
            Knowledge Base
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Find answers, guides, and documentation for all features of Thorbis.
          </p>
          <div className="mx-auto max-w-2xl">
            <KBSearch showButton={true} />
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-semibold text-2xl">Featured Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <KBArticleCard
                  article={article}
                  featured={true}
                  key={article.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section>
          <h2 className="mb-6 font-semibold text-2xl">Browse by Category</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(categories || []).map((category) => (
              <Link
                className="block"
                href={`/kb/${category.slug}`}
                key={category.id}
              >
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      {category.icon && (
                        <span className="text-2xl">{category.icon}</span>
                      )}
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 font-medium text-primary text-sm">
                      Browse articles
                      <BookOpen className="size-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? We're here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link
                  className="flex items-center gap-2 text-primary hover:underline"
                  href="/support"
                >
                  <HelpCircle className="size-4" />
                  Contact Support
                </Link>
                <Link
                  className="flex items-center gap-2 text-primary hover:underline"
                  href="/kb/search"
                >
                  <Search className="size-4" />
                  Advanced Search
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
