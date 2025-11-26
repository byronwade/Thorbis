/**
 * KB Article Card - Server Component
 *
 * Displays article preview card with title, excerpt, and metadata
 */

import { Calendar, Eye, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { KBArticleWithRelations } from "@/lib/kb/types";
import { cn } from "@/lib/utils";

type KBArticleCardProps = {
	article: KBArticleWithRelations;
	featured?: boolean;
	className?: string;
};

export function KBArticleCard({
	article,
	featured = false,
	className,
}: KBArticleCardProps) {
	const url = `/kb/${article.category.slug}/${article.slug}`;
	const publishedDate = article.published_at
		? new Date(String(article.published_at))
		: null;

	return (
		<Link className={cn("block", className)} href={url}>
			<Card
				className={cn(
					"h-full transition-all hover:shadow-md",
					featured && "border-primary/50",
				)}
			>
				{article.featured_image ? (
					<div className="relative h-48 w-full overflow-hidden rounded-t-xl">
						<Image
							alt={String(article.title)}
							className="object-cover"
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							src={String(article.featured_image)}
						/>
					</div>
				) : null}
				<CardHeader>
					<div className="flex items-start justify-between gap-2">
						<CardTitle className="line-clamp-2">
							{String(article.title)}
						</CardTitle>
						{featured ? (
							<Badge className="shrink-0" variant="default">
								Featured
							</Badge>
						) : null}
					</div>
					{article.excerpt ? (
						<CardDescription className="line-clamp-2">
							{String(article.excerpt)}
						</CardDescription>
					) : null}
				</CardHeader>
				<CardContent>
					<div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
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
						{Number(article.views) > 0 ? (
							<div className="flex items-center gap-1">
								<Eye className="size-4" />
								<span>{Number(article.views).toLocaleString()} views</span>
							</div>
						) : null}
					</div>
					{article.tags && article.tags.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{article.tags.slice(0, 3).map((tag) => (
								<Badge className="text-xs" key={tag.id} variant="secondary">
									<Tag className="mr-1 size-3" />
									{(tag as any).name || tag.id}
								</Badge>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
