/**
 * Knowledge Base Article Page - Server Component
 *
 * Displays individual article with content, TOC, and related articles
 */

import { ArrowLeft, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  getKBArticle,
  getKBRelatedArticles,
  incrementArticleViews,
} from "@/actions/kb";
import { KBArticleContent } from "@/components/kb/kb-article-content";
import { KBFeedback } from "@/components/kb/kb-feedback";
import { KBSidebarWrapper } from "@/components/kb/kb-sidebar-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markdownToHtml } from "@/lib/kb/markdown";
import {
  generateArticleMetadata,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/kb/metadata";

const RELATED_ARTICLE_LIMIT = 5;

type ArticlePageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps) {
  const { category: categorySlug, slug: articleSlug } = await params;
  const result = await getKBArticle(categorySlug, articleSlug);

  if (!(result.success && result.article)) {
    return {};
  }

  return generateArticleMetadata(result.article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug: articleSlug } = await params;

  const articleResult = await getKBArticle(categorySlug, articleSlug);

  if (!(articleResult.success && articleResult.article)) {
    notFound();
  }

  const article = articleResult.article as any;
  const htmlContent = await markdownToHtml(article.content);

  // Track view (fire and forget)
  incrementArticleViews(article.id).catch(() => {
    /* noop */
  });

  // Get related articles
  const relatedArticlesResult = await getKBRelatedArticles(
    article.id,
    RELATED_ARTICLE_LIMIT
  );
  const relatedArticles =
    relatedArticlesResult.success && relatedArticlesResult.articles
      ? relatedArticlesResult.articles
      : [];

  const publishedDate = article.published_at
    ? new Date(article.published_at as string)
    : null;

  return (
    <>
      {/* Structured Data */}
      <Script
        id={`kb-article-schema-${article.id}`}
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(generateArticleStructuredData(article))}
      </Script>
      <Script
        id={`kb-article-breadcrumb-${article.id}`}
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(
          generateBreadcrumbStructuredData(
            { slug: article.category.slug, title: article.category.title } as {
              slug: string;
              title: string;
            },
            {
              slug: article.slug as string,
              title: article.title as string,
            }
          )
        )}
      </Script>

      <KBSidebarWrapper
        currentArticleId={article.id as string}
        currentCategory={article.category.slug as string}
        htmlContent={htmlContent}
        relatedArticles={relatedArticles}
      >
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/kb"
            >
              Knowledge Base
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href={`/kb/${article.category.slug}`}
            >
              {String(article.category.title)}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{String(article.title)}</span>
          </nav>

          {/* Main Content */}
          <article className="max-w-4xl">
            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Link href={`/kb/${article.category.slug}`}>
                  <Badge variant="secondary">
                    {String(article.category.title)}
                  </Badge>
                </Link>
                {Boolean(article.featured) && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <h1 className="mb-4 font-bold text-4xl tracking-tight">
                {String(article.title)}
              </h1>
              {article.excerpt && (
                <p className="mb-6 text-muted-foreground text-xl">
                  {String(article.excerpt)}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                {publishedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <time dateTime={publishedDate.toISOString()}>
                      {publishedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                )}
                {(article.viewCount as number) > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="size-4" />
                    <span>
                      {(article.viewCount as number).toLocaleString()} views
                    </span>
                  </div>
                )}
                {article.author && (
                  <div>
                    <span>By {String(article.author)}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  alt={String(article.title)}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  src={String(article.featured_image)}
                />
              </div>
            )}

            {/* Article Content */}
            <KBArticleContent content={article.content as string} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map(
                  (tag: { id: string; slug: string; name: string }) => (
                    <Link
                      className="text-primary text-sm hover:underline"
                      href={`/kb/search?tag=${tag.slug}`}
                      key={tag.id}
                    >
                      #{tag.name}
                    </Link>
                  )
                )}
              </div>
            )}

            {/* Feedback */}
            <KBFeedback
              articleId={article.id as string}
              helpfulCount={article.helpfulCount as number}
              notHelpfulCount={article.notHelpfulCount as number}
            />

            {/* Back to Category */}
            <div className="mt-8">
              <Link href={`/kb/${article.category.slug}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to {String(article.category.title)}
                </Button>
              </Link>
            </div>
          </article>
        </div>
      </KBSidebarWrapper>
    </>
  );
}
