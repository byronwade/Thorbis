/**
 * Knowledge Base Search Page - Server Component
 *
 * Displays search results with filters
 */

import { Suspense } from "react";
import { searchKBArticles, getKBArticles, getKBCategories } from "@/actions/kb";
import { KBSearch } from "@/components/kb/kb-search";
import { KBArticleCard } from "@/components/kb/kb-article-card";
import { KBSidebarWrapper } from "@/components/kb/kb-sidebar-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic'; // Search params are dynamic

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}

function SearchResults({
  query,
  category,
  tag,
}: {
  query?: string;
  category?: string;
  tag?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      }
    >
      <SearchResultsContent query={query} category={category} tag={tag} />
    </Suspense>
  );
}

async function SearchResultsContent({
  query,
  category,
  tag,
}: {
  query?: string;
  category?: string;
  tag?: string;
}) {
  const result = query
    ? await searchKBArticles(query, { category, tag, limit: 20 })
    : await getKBArticles({ category, tag, limit: 20 });

  const articles =
    result.success && result.articles ? result.articles : [];
  const total = result.total || 0;

  if (!query && !category && !tag) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Start Searching</CardTitle>
          <CardDescription>
            Enter a search query above to find articles in our knowledge base.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No results found</CardTitle>
          <CardDescription>
            Try adjusting your search terms or browse by category.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {total} {total === 1 ? "result" : "results"}
          {query && ` for "${query}"`}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <KBArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query, category, tag } = await searchParams;

  return (
    <KBSidebarWrapper>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Search</h1>
          <div className="max-w-2xl">
            <KBSearch showButton={true} />
          </div>
        </div>

        {/* Search Results */}
        <SearchResults query={query} category={category} tag={tag} />
      </div>
    </KBSidebarWrapper>
  );
}

