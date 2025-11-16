/**
 * Job Property Section
 * Displays service location/property information with link to property details
 */

"use client";

import { Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { updateEntityTags } from "@/actions/entity-tags";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type JobPropertyProps = {
	property: any;
};

export function JobProperty({ property }: JobPropertyProps) {
	const propertyTags =
		(property?.metadata?.tags && Array.isArray(property.metadata.tags) && property.metadata.tags) || [];

	return (
		<div className="space-y-6">
			{/* Property Header */}
			<div className="flex items-start gap-3">
				<Building2 className="size-5 text-muted-foreground" />
				<div className="flex-1">
					<h3 className="font-medium text-lg">{property.name || "Service Location"}</h3>
					{property.property_type && (
						<p className="text-muted-foreground text-sm capitalize">{property.property_type}</p>
					)}
				</div>
			</div>

			<Separator />

			{/* Property Tags */}
			<div className="flex flex-wrap items-center gap-2">
				<span className="font-medium text-muted-foreground text-xs">Tags:</span>
				<EntityTags
					entityId={property.id}
					entityType="property"
					onUpdateTags={(id, tags) => updateEntityTags("property", id, tags)}
					tags={propertyTags}
				/>
			</div>

			<Separator />

			{/* Address */}
			<div className="flex items-start gap-3">
				<MapPin className="size-4 text-muted-foreground" />
				<div className="flex-1">
					<Label>Address</Label>
					<p className="mt-2 text-sm">
						{property.address}
						{property.unit && `, ${property.unit}`}
					</p>
					<p className="text-muted-foreground text-sm">
						{property.city}, {property.state} {property.zip_code}
					</p>
				</div>
			</div>

			{/* Property Details */}
			{(property.square_footage || property.year_built || property.lot_size) && (
				<>
					<Separator />
					<div className="grid gap-4 md:grid-cols-3">
						{property.square_footage && (
							<div>
								<Label>Square Footage</Label>
								<p className="mt-2 text-sm">{property.square_footage.toLocaleString()} sq ft</p>
							</div>
						)}
						{property.year_built && (
							<div>
								<Label>Year Built</Label>
								<p className="mt-2 text-sm">{property.year_built}</p>
							</div>
						)}
						{property.lot_size && (
							<div>
								<Label>Lot Size</Label>
								<p className="mt-2 text-sm">{property.lot_size}</p>
							</div>
						)}
					</div>
				</>
			)}

			{/* Notes */}
			{property.notes && (
				<>
					<Separator />
					<div>
						<Label>Notes</Label>
						<p className="mt-2 whitespace-pre-wrap text-muted-foreground text-sm">{property.notes}</p>
					</div>
				</>
			)}

			<Separator />

			{/* Actions */}
			<div className="flex gap-2">
				<Button asChild className="flex-1" size="sm" variant="outline">
					<Link href={`/dashboard/work/properties/${property.id}`}>View Property Details</Link>
				</Button>
				<Button asChild className="flex-1" size="sm" variant="outline">
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
							`${property.address}, ${property.city}, ${property.state} ${property.zip_code}`
						)}`}
						rel="noopener noreferrer"
						target="_blank"
					>
						Open in Maps
					</a>
				</Button>
			</div>
		</div>
	);
}
