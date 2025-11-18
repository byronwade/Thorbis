"use client";

/**
 * Category Card Component
 *
 * Beautiful cards for drill-down navigation:
 * - Two versions: with full background image or gradient
 * - Same height for consistency
 * - Overlay effect for readability on images
 * - Smooth hover transitions
 */

import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
	name: string;
	count: number;
	description?: string;
	imageUrl?: string | null;
	onClick: () => void;
	variant?: "default" | "add";
};

export function CategoryCard({
	name,
	count,
	description,
	imageUrl,
	onClick,
	variant = "default",
}: CategoryCardProps) {
	const hasImage = imageUrl && variant === "default";

	return (
		<Card
			className={cn(
				"group relative h-40 cursor-pointer overflow-hidden transition-all hover:shadow-xl",
				variant === "add"
					? "hover:border-primary/50 border-dashed"
					: "hover:border-primary/50",
			)}
			onClick={onClick}
		>
			{/* Background Image or Gradient */}
			{hasImage ? (
				<>
					{/* Full Background Image */}
					<div
						className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
						style={{ backgroundImage: `url(${imageUrl})` }}
					/>
					{/* Dark Overlay for readability */}
					<div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
				</>
			) : (
				// Gradient Background (no image)
				<div
					className={cn(
						"absolute inset-0 bg-gradient-to-br transition-opacity",
						variant === "add"
							? "from-muted/50 to-muted/30"
							: "from-primary/10 via-primary/5 to-background",
					)}
				/>
			)}

			{/* Content Overlay */}
			<div className="relative flex h-full flex-col justify-end p-6">
				{/* Text and Arrow */}
				<div className="flex items-end justify-between gap-4">
					<div className="flex-1">
						<h3
							className={cn(
								"mb-1 text-lg leading-tight font-semibold",
								hasImage ? "text-white" : "text-foreground",
							)}
						>
							{name}
						</h3>
						{description ? (
							<p
								className={cn(
									"text-sm",
									hasImage ? "text-white/80" : "text-muted-foreground",
								)}
							>
								{description}
							</p>
						) : (
							variant === "default" && (
								<p
									className={cn(
										"text-sm",
										hasImage ? "text-white/80" : "text-muted-foreground",
									)}
								>
									{count} {count === 1 ? "item" : "items"}
								</p>
							)
						)}
					</div>

					{/* Arrow Icon */}
					<ChevronRight
						className={cn(
							"size-6 shrink-0 transition-transform group-hover:translate-x-1",
							hasImage ? "text-white/80" : "text-muted-foreground",
						)}
					/>
				</div>
			</div>
		</Card>
	);
}
