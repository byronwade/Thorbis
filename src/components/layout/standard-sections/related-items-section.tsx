"use client";

import { ChevronRight, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";

type RelatedItem = {
	id: string;
	type: string;
	title: string;
	subtitle?: string;
	href: string;
	badge?: {
		label: string;
		variant?: "default" | "secondary" | "destructive" | "outline";
	};
};

type RelatedItemsSectionProps = {
	relatedItems: RelatedItem[];
};

export function RelatedItemsSection({ relatedItems }: RelatedItemsSectionProps) {
	if (!relatedItems || relatedItems.length === 0) {
		return (
			<UnifiedAccordionContent>
				<div className="flex h-32 items-center justify-center">
					<div className="text-center">
						<LinkIcon className="text-muted-foreground/50 mx-auto size-8" />
						<p className="text-muted-foreground mt-2 text-sm">No related items</p>
					</div>
				</div>
			</UnifiedAccordionContent>
		);
	}

	return (
		<UnifiedAccordionContent>
			<div className="space-y-2">
				{relatedItems.map((item) => (
					<Link
						className="group hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
						href={item.href}
						key={item.id}
					>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<p className="truncate text-sm font-medium">{item.title}</p>
								{item.badge && (
									<Badge className="flex-shrink-0" variant={item.badge.variant || "default"}>
										{item.badge.label}
									</Badge>
								)}
							</div>
							{item.subtitle && (
								<p className="text-muted-foreground truncate text-xs">{item.subtitle}</p>
							)}
						</div>
						<ChevronRight className="text-muted-foreground size-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
					</Link>
				))}
			</div>
		</UnifiedAccordionContent>
	);
}
