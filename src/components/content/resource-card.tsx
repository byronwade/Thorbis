import { BookOpen, Calendar, Clock, Download, ExternalLink, PlayCircle, Users } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResourceItem, ResourceType } from "@/lib/content";
import { cn } from "@/lib/utils";

const RESOURCE_LABELS: Record<ResourceType, string> = {
	case_study: "Case Study",
	webinar: "Webinar",
	template: "Template",
	guide: "Guide",
	community: "Community",
	status_update: "Status Update",
};

const RESOURCE_ICONS: Record<ResourceType, ComponentType<{ className?: string }>> = {
	case_study: BookOpen,
	webinar: PlayCircle,
	template: Download,
	guide: BookOpen,
	community: Users,
	status_update: Clock,
};

function formatDate(input?: string | null, options?: Intl.DateTimeFormatOptions) {
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
		...options,
	});
}

type ResourceCardProps = {
	item: ResourceItem;
	className?: string;
	showImage?: boolean;
};

export function ResourceCard({ item, className, showImage = true }: ResourceCardProps) {
	const basePath =
		item.type === "webinar"
			? "/webinars"
			: item.type === "case_study"
				? "/case-studies"
				: item.type === "template"
					? "/templates"
					: "/resources";
	const fallbackHref = item.slug ? `${basePath}/${item.slug}` : basePath;
	const primaryHref = item.ctaUrl ?? item.downloadUrl ?? fallbackHref;

	const Icon = RESOURCE_ICONS[item.type];
	const publishedLabel = formatDate(item.publishedAt);
	const eventDate =
		item.type === "webinar"
			? formatDate(item.eventStartAt, {
					weekday: "short",
					month: "short",
					day: "numeric",
				})
			: null;

	const isUpcoming =
		item.type === "webinar" && item.eventStartAt ? new Date(item.eventStartAt).getTime() > Date.now() : false;

	const fallbackCtaLabel =
		item.type === "webinar"
			? isUpcoming
				? "Save your seat"
				: "Watch on-demand"
			: item.type === "case_study"
				? "View Case Study"
				: "View Resource";
	const ctaLabel = item.ctaLabel ?? fallbackCtaLabel;

	return (
		<Card className={cn("group relative overflow-hidden transition-shadow hover:shadow-md", className)}>
			{showImage && item.heroImageUrl ? (
				<div className="relative h-48 w-full overflow-hidden">
					<Image
						alt={item.seoTitle ?? item.title}
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						fill
						priority={item.featured}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						src={item.heroImageUrl}
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
				</div>
			) : null}
			<CardHeader className="gap-3">
				<div className="flex flex-wrap items-center gap-2 font-medium text-primary text-xs uppercase tracking-wide">
					<Badge className="inline-flex items-center gap-1" variant="secondary">
						<Icon aria-hidden="true" className="size-3" />
						{RESOURCE_LABELS[item.type]}
					</Badge>
					{item.featured ? (
						<Badge className="uppercase" variant="outline">
							Featured
						</Badge>
					) : null}
				</div>
				<CardTitle className="line-clamp-2 text-balance text-2xl">
					<Link className="before:absolute before:inset-0" href={primaryHref}>
						{item.title}
					</Link>
				</CardTitle>
				{item.excerpt ? <CardDescription className="line-clamp-3 text-base">{item.excerpt}</CardDescription> : null}
			</CardHeader>
			<CardContent className="space-y-4 text-muted-foreground text-sm">
				{item.type === "webinar" && (eventDate || isUpcoming) ? (
					<div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-primary">
						<Calendar aria-hidden="true" className="size-4" />
						{isUpcoming ? <span>Live on {eventDate}</span> : <span>Available on-demand</span>}
					</div>
				) : null}
				<div className="flex flex-wrap gap-2">
					{item.author?.name ? <span>By {item.author.name}</span> : null}
					{publishedLabel ? <span aria-label="Published date">{publishedLabel}</span> : null}
					{item.tags.slice(0, 3).map((tag) => (
						<Link
							className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs leading-none transition-colors hover:border-primary hover:text-primary"
							href={`${basePath}?tag=${tag.slug}`}
							key={tag.id}
						>
							#{tag.name}
						</Link>
					))}
				</div>
			</CardContent>
			<CardFooter className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
					{item.downloadUrl ? (
						<span className="inline-flex items-center gap-1">
							<Download aria-hidden="true" className="size-3" />
							Downloadable
						</span>
					) : null}
					{item.registrationUrl ? (
						<span className="inline-flex items-center gap-1">
							<ExternalLink aria-hidden="true" className="size-3" />
							Registration required
						</span>
					) : null}
				</div>
				<Link className="font-medium text-primary text-sm transition-colors hover:text-primary/80" href={primaryHref}>
					{ctaLabel} →
				</Link>
			</CardFooter>
		</Card>
	);
}
