import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { MarketingIntegrationContent } from "@/lib/marketing/types";
import { cn } from "@/lib/utils";
import { getMarketingIcon } from "./marketing-icons";

type IntegrationCardProps = {
	integration: MarketingIntegrationContent;
	className?: string;
};

export function IntegrationCard({
	integration,
	className,
}: IntegrationCardProps) {
	const Icon = getMarketingIcon(integration.valueProps[0]?.icon ?? "sparkles");

	return (
		<Link className="block h-full" href={`/integrations/${integration.slug}`}>
			<Card
				className={cn(
					"h-full transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
					className,
				)}
			>
				<CardHeader className="space-y-4">
					<div className="flex items-center gap-3">
						<span className="rounded-lg bg-muted p-2">
							<Icon aria-hidden="true" className="size-6 text-primary" />
						</span>
						<div>
							<CardTitle className="text-xl">{integration.name}</CardTitle>
							<p className="text-muted-foreground text-sm">
								{integration.partner.name}
							</p>
						</div>
					</div>
					<CardDescription>{integration.summary}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-wrap gap-2">
						{integration.categories.slice(0, 3).map((category) => (
							<Badge key={category} variant="secondary">
								{category}
							</Badge>
						))}
					</div>
					<p className="font-medium text-primary text-sm">
						Explore integration →
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
