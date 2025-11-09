/**
 * Knowledge Base Article Page - Server Component
 *
 * Displays individual article with content, TOC, and related articles
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import { getKBArticle, getKBRelatedArticles, incrementArticleViews } from "@/actions/kb";
import { generateArticleMetadata, generateArticleStructuredData, generateBreadcrumbStructuredData } from "@/lib/kb/metadata";
import { KBArticleContent } from "@/components/kb/kb-article-content";
import { KBFeedback } from "@/components/kb/kb-feedback";
import { KBSidebarWrapper } from "@/components/kb/kb-sidebar-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markdownToHtml } from "@/lib/kb/markdown";

export const revalidate = 3600; // Revalidate every hour

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { category: categorySlug, slug: articleSlug } = await params;
  const result = await getKBArticle(categorySlug, articleSlug);

  if (!result.success || !result.article) {
    return {};
  }

  return generateArticleMetadata(result.article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug: articleSlug } = await params;

  const articleResult = await getKBArticle(categorySlug, articleSlug);

  if (!articleResult.success || !articleResult.article) {
    notFound();
  }

  const article = articleResult.article;
  const htmlContent = await markdownToHtml(article.content);

  // Track view (fire and forget)
  incrementArticleViews(article.id).catch(console.error);

  // Get related articles
  const relatedArticlesResult = await getKBRelatedArticles(article.id, 5);
  const relatedArticles =
    relatedArticlesResult.success && relatedArticlesResult.articles
      ? relatedArticlesResult.articles
      : [];

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : null;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleStructuredData(article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData(article.category, {
              slug: article.slug,
              title: article.title,
            })
          ),
        }}
      />

      <KBSidebarWrapper
        currentCategory={article.category.slug}
        currentArticleId={article.id}
        htmlContent={htmlContent}
        relatedArticles={relatedArticles}
      >
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link
              href="/kb"
              className="text-muted-foreground hover:text-foreground"
            >
              Knowledge Base
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/kb/${article.category.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {article.category.title}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{article.title}</span>
          </nav>

          {/* Main Content */}
          <article className="max-w-4xl">
            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Link href={`/kb/${article.category.slug}`}>
                  <Badge variant="secondary">{article.category.title}</Badge>
                </Link>
                {article.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-muted-foreground mb-6 text-xl">
                  {article.excerpt}
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
                {article.viewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="size-4" />
                    <span>{article.viewCount.toLocaleString()} views</span>
                  </div>
                )}
                {article.author && (
                  <div>
                    <span>By {article.author}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            {/* Article Content */}
            <KBArticleContent content={article.content} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag: { id: string; slug: string; name: string }) => (
                  <Link
                    key={tag.id}
                    href={`/kb/search?tag=${tag.slug}`}
                    className="text-primary hover:underline text-sm"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Feedback */}
            <KBFeedback
              articleId={article.id}
              helpfulCount={article.helpfulCount}
              notHelpfulCount={article.notHelpfulCount}
            />

            {/* Back to Category */}
            <div className="mt-8">
              <Link href={`/kb/${article.category.slug}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to {article.category.title}
                </Button>
              </Link>
            </div>
          </article>
        </div>
      </KBSidebarWrapper>
    </>
  );
}

