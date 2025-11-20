import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type RelatedContentItem = {
	id: string;
	title: string;
	description: string;
	href: string;
	category?: string;
	tags?: string[];
};

type RelatedContentProps = {
	title: string;
	description?: string;
	items: RelatedContentItem[];
	variant?: "grid" | "list";
	showDescription?: boolean;
	className?: string;
};

export function RelatedContent({
	title,
	description,
	items,
	variant = "grid",
	showDescription = true,
	className,
}: RelatedContentProps) {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<div className={cn("space-y-6", className)}>
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">{title}</h2>
				{description && (
					<p className="text-muted-foreground text-sm leading-relaxed">
						{description}
					</p>
				)}
			</div>
			{variant === "grid" ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => (
						<Card
							key={item.id}
							className="group transition-shadow hover:shadow-md"
						>
							<CardHeader>
								<CardTitle className="text-lg">
									<Link
										href={item.href}
										className="hover:text-primary transition-colors"
									>
										{item.title}
									</Link>
								</CardTitle>
								{showDescription && item.description && (
									<CardDescription>{item.description}</CardDescription>
								)}
							</CardHeader>
						</Card>
					))}
				</div>
			) : (
				<div className="space-y-3">
					{items.map((item) => (
						<Card
							key={item.id}
							className="group transition-shadow hover:shadow-md"
						>
							<CardContent className="pt-6">
								<Link
									href={item.href}
									className="hover:text-primary block font-semibold transition-colors"
								>
									{item.title}
								</Link>
								{showDescription && item.description && (
									<p className="text-muted-foreground mt-1 text-sm">
										{item.description}
									</p>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
