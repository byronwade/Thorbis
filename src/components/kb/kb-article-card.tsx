/**
 * KB Article Card - Server Component
 *
 * Displays article preview card with title, excerpt, and metadata
 */

import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KBArticleWithRelations } from "@/lib/kb/types";

interface KBArticleCardProps {
  article: KBArticleWithRelations;
  featured?: boolean;
  className?: string;
}

export function KBArticleCard({
  article,
  featured = false,
  className,
}: KBArticleCardProps) {
  const url = `/kb/${article.category.slug}/${article.slug}`;
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : null;

  return (
    <Link href={url} className={cn("block", className)}>
      <Card
        className={cn(
          "h-full transition-all hover:shadow-md",
          featured && "border-primary/50"
        )}
      >
        {article.featuredImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
            {featured && (
              <Badge variant="default" className="shrink-0">
                Featured
              </Badge>
            )}
          </div>
          {article.excerpt && (
            <CardDescription className="line-clamp-2">
              {article.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
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
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag: { id: string; slug: string; name: string }) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs"
                >
                  <Tag className="mr-1 size-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

