import { Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BlogPost } from "@/lib/content";
import { cn } from "@/lib/utils";

function formatDate(input?: string | null): string | null {
  if (!input) {
    return null;
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type BlogCardProps = {
  post: BlogPost;
  className?: string;
  showImage?: boolean;
  variant?: "default" | "compact";
};

export function BlogCard({
  post,
  className,
  showImage = true,
  variant = "default",
}: BlogCardProps) {
  const publishedLabel = formatDate(post.publishedAt);
  const href = `/blog/${post.slug}`;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-shadow hover:shadow-md",
        variant === "compact" && "flex-row gap-4",
        className
      )}
    >
      {showImage && post.heroImageUrl ? (
        <div
          className={cn(
            "relative w-full overflow-hidden",
            variant === "compact"
              ? "max-w-[220px] rounded-l-xl"
              : "rounded-t-xl"
          )}
        >
          <Image
            alt={post.seoTitle ?? post.title}
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              variant === "compact"
                ? "h-full min-h-[180px] w-full"
                : "h-48 w-full"
            )}
            height={360}
            priority={post.featured}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={post.heroImageUrl}
            width={640}
          />
        </div>
      ) : null}
      <div
        className={cn("flex flex-1 flex-col", variant === "compact" && "py-6")}
      >
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2 font-medium text-primary text-xs uppercase tracking-wide">
            {post.category?.name ? (
              <Badge className="uppercase" variant="secondary">
                {post.category.name}
              </Badge>
            ) : null}
            {post.featured ? (
              <Badge className="uppercase" variant="outline">
                Featured
              </Badge>
            ) : null}
            {post.pinned ? (
              <Badge className="uppercase" variant="outline">
                Spotlight
              </Badge>
            ) : null}
          </div>
          <CardTitle className="line-clamp-2 text-balance text-2xl">
            <Link className="before:absolute before:inset-0" href={href}>
              {post.title}
            </Link>
          </CardTitle>
          {post.excerpt ? (
            <CardDescription className="line-clamp-3 text-base">
              {post.excerpt}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-4">
          <div className="flex flex-wrap gap-2 text-muted-foreground text-sm">
            {publishedLabel ? (
              <span className="flex items-center gap-1">
                <Calendar aria-hidden="true" className="size-4" />
                <time dateTime={post.publishedAt ?? undefined}>
                  {publishedLabel}
                </time>
              </span>
            ) : null}
            {post.readingTime > 0 ? (
              <span className="flex items-center gap-1">
                <Clock aria-hidden="true" className="size-4" />
                <span>{post.readingTime} min read</span>
              </span>
            ) : null}
            {post.author?.name ? (
              <span className="truncate">By {post.author.name}</span>
            ) : null}
          </div>
          {post.tags.length ? (
            <ul className="flex flex-wrap gap-2 text-muted-foreground text-xs">
              {post.tags.slice(0, 4).map((tag) => (
                <li key={tag.id}>
                  <Link
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 leading-none transition-colors hover:border-primary hover:text-primary"
                    href={`/blog?tag=${tag.slug}`}
                  >
                    <Tag aria-hidden="true" className="size-3" />#{tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
        <CardFooter className="mt-auto">
          <Link
            className="font-medium text-primary text-sm transition-colors hover:text-primary/80"
            href={href}
          >
            Read article →
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
