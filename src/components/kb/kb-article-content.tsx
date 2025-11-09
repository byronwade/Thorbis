/**
 * KB Article Content - Server Component
 *
 * Renders markdown content as HTML with proper styling
 * Uses server-side markdown parsing for performance
 */

import { markdownToHtml } from "@/lib/kb/markdown";
import { cn } from "@/lib/utils";

interface KBArticleContentProps {
  content: string;
  className?: string;
}

export async function KBArticleContent({
  content,
  className,
}: KBArticleContentProps) {
  const html = await markdownToHtml(content);

  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50",
        "prose-img:rounded-lg prose-img:border prose-img:border-border",
        "prose-table:border-collapse prose-th:bg-muted prose-th:font-semibold",
        "prose-ul:list-disc prose-ol:list-decimal",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

