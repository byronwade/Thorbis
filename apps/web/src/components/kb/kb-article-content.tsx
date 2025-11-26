/**
 * KB Article Content - Server Component
 *
 * Renders markdown content as HTML with proper styling
 * Uses server-side markdown parsing for performance
 */

import { markdownToHtml } from "@/lib/kb/markdown";
import { cn } from "@/lib/utils";

type KBArticleContentProps = {
	content: string;
	className?: string;
};

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
				"prose-strong:font-semibold prose-strong:text-foreground",
				"prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-primary prose-code:text-sm",
				"prose-pre:border prose-pre:border-border prose-pre:bg-muted",
				"prose-blockquote:border-l-primary prose-blockquote:bg-muted/50",
				"prose-img:rounded-lg prose-img:border prose-img:border-border",
				"prose-table:border-collapse prose-th:bg-muted prose-th:font-semibold",
				"prose-ol:list-decimal prose-ul:list-disc",
				className,
			)}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
