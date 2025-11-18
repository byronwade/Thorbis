"use client";

/**
 * Price Book Card Component
 *
 * Visual card for displaying price book items in grid view:
 * - Image thumbnail
 * - Item name and SKU
 * - Price (prominent)
 * - Type badge
 * - Category breadcrumb
 * - Quick actions on hover
 */

import { Box, Edit, Package, Plus, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { PriceBookItem } from "@/components/work/price-book-table";

type PriceBookCardProps = {
	item: PriceBookItem;
	onEdit?: (id: string) => void;
	onAddToEstimate?: (id: string) => void;
};

const itemTypeConfig = {
	service: {
		icon: Wrench,
		label: "Service",
		color: "bg-primary/10 text-primary border-primary/20",
	},
	material: {
		icon: Package,
		label: "Material",
		color: "bg-accent/10 text-accent-foreground border-border/20",
	},
	equipment: {
		icon: Box,
		label: "Equipment",
		color: "bg-warning/10 text-warning border-warning/20",
	},
};

export function PriceBookCard({
	item,
	onEdit,
	onAddToEstimate,
}: PriceBookCardProps) {
	const config = itemTypeConfig[item.itemType];
	const TypeIcon = config.icon;

	return (
		<Card className="group relative overflow-hidden transition-all hover:shadow-lg">
			<Link href={`/dashboard/work/pricebook/${item.id}`}>
				{/* Image */}
				<div className="bg-muted relative aspect-square w-full overflow-hidden">
					{item.imageUrl ? (
						<Image
							alt={item.name}
							className="object-cover transition-transform group-hover:scale-105"
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							src={item.imageUrl}
						/>
					) : (
						<div className="flex h-full items-center justify-center">
							<TypeIcon className="text-muted-foreground/30 h-16 w-16" />
						</div>
					)}

					{/* Quick Actions - Show on Hover */}
					<div className="absolute right-0 bottom-0 left-0 flex gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							className="flex-1"
							onClick={(e) => {
								e.preventDefault();
								onEdit?.(item.id);
							}}
							size="sm"
							variant="secondary"
						>
							<Edit className="mr-1 size-3" />
							Edit
						</Button>
						<Button
							className="flex-1"
							onClick={(e) => {
								e.preventDefault();
								onAddToEstimate?.(item.id);
							}}
							size="sm"
							variant="default"
						>
							<Plus className="mr-1 size-3" />
							Add
						</Button>
					</div>
				</div>

				{/* Content */}
				<CardHeader className="space-y-1 p-4 pb-2">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 space-y-1">
							{/* Title with pricing tier */}
							<h3 className="line-clamp-2 leading-tight font-medium">
								{item.name}
								{item.priceTier && item.priceTier !== "standard" && (
									<span className="text-muted-foreground ml-2 text-xs font-normal">
										- {item.priceTier === "good" && "Good"}
										{item.priceTier === "better" && "Better"}
										{item.priceTier === "best" && "Best"}
									</span>
								)}
							</h3>
							{/* SKU and Type in one line */}
							<div className="text-muted-foreground flex items-center gap-2 text-xs">
								<span>SKU: {item.sku}</span>
								<span>•</span>
								<span className="flex items-center gap-1">
									<TypeIcon className="size-3" />
									{config.label}
								</span>
								{item.isFlatRate && (
									<>
										<span>•</span>
										<span>Flat Rate</span>
									</>
								)}
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-4 pt-0">
					{/* Category Breadcrumb */}
					<div className="text-muted-foreground mb-2 flex flex-wrap gap-1 text-xs">
						<span>{item.category}</span>
						{item.subcategory && (
							<>
								<span>›</span>
								<span>{item.subcategory}</span>
							</>
						)}
					</div>

					{/* Price */}
					<div className="flex items-baseline gap-2">
						<span className="text-2xl font-semibold">
							${item.price.toFixed(2)}
						</span>
						{item.cost && item.cost < item.price && (
							<span className="text-muted-foreground text-sm">
								({item.markupPercent}% markup)
							</span>
						)}
					</div>

					{/* Labor Hours for Services */}
					{item.itemType === "service" && item.laborHours && (
						<div className="text-muted-foreground mt-1 text-xs">
							{item.laborHours} {item.laborHours === 1 ? "hour" : "hours"}
						</div>
					)}

					{/* Unit */}
					{item.unit && item.unit !== "each" && (
						<div className="text-muted-foreground mt-1 text-xs">
							per {item.unit}
						</div>
					)}
				</CardContent>

				{/* Footer */}
				{item.supplierName && (
					<CardFooter className="bg-muted/30 border-t p-3">
						<div className="text-muted-foreground flex items-center gap-2 text-xs">
							<Package className="size-3" />
							<span>{item.supplierName}</span>
						</div>
					</CardFooter>
				)}
			</Link>
		</Card>
	);
}
