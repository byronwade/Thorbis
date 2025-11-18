/**
 * Property Info Hover Card
 * Shows property details on hover with quick copy functionality
 */

"use client";

import {
	Building2,
	Check,
	Clock,
	Copy,
	Home,
	Loader2,
	MapPin,
	Navigation,
	Route,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { updateEntityTags } from "@/actions/entity-tags";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type TravelTimeData = {
	duration: number; // seconds
	durationText: string;
	distance: number; // miles
	distanceText: string;
	origin: string;
	destination: string;
};

type PropertyInfoHoverCardProps = {
	property: {
		id: string;
		name?: string | null;
		address?: string | null;
		city?: string | null;
		state?: string | null;
		zip_code?: string | null;
		property_type?: string | null;
		square_footage?: number | null;
		year_built?: number | null;
		lat?: number | null;
		lon?: number | null;
		metadata?: {
			tags?: any[];
		} | null;
	};
};

export function PropertyInfoHoverCard({
	property,
}: PropertyInfoHoverCardProps) {
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const [travelTime, setTravelTime] = useState<TravelTimeData | null>(null);
	const [isLoadingTravel, setIsLoadingTravel] = useState(false);

	// Track if we've already fetched to prevent re-fetching on re-renders
	const hasFetchedRef = useRef(false);

	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	// Fetch travel time data
	useEffect(() => {
		// Only fetch once - use ref to prevent re-fetching on re-renders
		if (hasFetchedRef.current) {
			return;
		}

		const fetchTravelTime = async () => {
			// Only fetch if we have required address data
			if (!(property.address && property.city && property.state)) {
				return;
			}

			hasFetchedRef.current = true;
			setIsLoadingTravel(true);
			try {
				const params = new URLSearchParams();
				if (property.lat && property.lon) {
					params.set("destinationLat", property.lat.toString());
					params.set("destinationLon", property.lon.toString());
				} else {
					const destination = [
						property.address,
						property.city,
						property.state,
						property.zip_code,
					]
						.filter(Boolean)
						.join(", ");
					params.set("destination", destination);
				}

				const response = await fetch(`/api/travel-time?${params.toString()}`);
				if (response.ok) {
					const data: TravelTimeData = await response.json();
					setTravelTime(data);
				}
			} catch (_error) {
			} finally {
				setIsLoadingTravel(false);
			}
		};

		fetchTravelTime();
	}, [
		property.address,
		property.city,
		property.state,
		property.zip_code,
		property.lat,
		property.lon,
	]);

	const displayName = property.name || property.address || "Service Location";

	const fullAddress = [
		property.address,
		property.city,
		property.state,
		property.zip_code,
	]
		.filter(Boolean)
		.join(", ");

	const coordinates =
		property.lat && property.lon
			? `${property.lat.toFixed(6)}, ${property.lon.toFixed(6)}`
			: null;

	// Format duration for display
	const formatDuration = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger asChild>
				<Link
					className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
					href={`/dashboard/work/properties/${property.id}`}
				>
					<MapPin className="size-4" />
					<span className="font-medium">{displayName}</span>
				</Link>
			</HoverCardTrigger>
			<HoverCardContent align="start" className="w-80" side="bottom">
				<div className="space-y-3">
					{/* Header */}
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-2">
							<Building2 className="text-muted-foreground size-4" />
							<div>
								<h4 className="text-sm font-semibold">{displayName}</h4>
								{property.property_type && (
									<p className="text-muted-foreground text-xs capitalize">
										{property.property_type}
									</p>
								)}
							</div>
						</div>
					</div>

					<Separator />

					{/* Property Info */}
					<div className="space-y-2">
						{fullAddress && (
							<div className="group flex items-start justify-between gap-2">
								<div className="flex min-w-0 flex-1 items-start gap-2">
									<Home className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
									<p className="text-sm">{fullAddress}</p>
								</div>
								<Button
									className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
									onClick={(e) => {
										e.preventDefault();
										copyToClipboard(fullAddress, "address");
									}}
									size="icon"
									variant="ghost"
								>
									{copiedField === "address" ? (
										<Check className="size-3" />
									) : (
										<Copy className="size-3" />
									)}
								</Button>
							</div>
						)}

						{coordinates && (
							<div className="group flex items-center justify-between gap-2">
								<div className="flex min-w-0 flex-1 items-center gap-2">
									<Navigation className="text-muted-foreground size-3.5 shrink-0" />
									<p className="font-mono text-sm">{coordinates}</p>
								</div>
								<Button
									className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
									onClick={(e) => {
										e.preventDefault();
										copyToClipboard(coordinates, "coordinates");
									}}
									size="icon"
									variant="ghost"
								>
									{copiedField === "coordinates" ? (
										<Check className="size-3" />
									) : (
										<Copy className="size-3" />
									)}
								</Button>
							</div>
						)}
					</div>

					{/* Property Details */}
					{(property.square_footage || property.year_built) && (
						<>
							<Separator />
							<div className="flex flex-wrap items-center gap-2">
								{property.square_footage && (
									<Badge variant="secondary">
										{property.square_footage.toLocaleString()} sq ft
									</Badge>
								)}
								{property.year_built && (
									<Badge variant="secondary">Built {property.year_built}</Badge>
								)}
							</div>
						</>
					)}

					{/* Travel Time & Distance */}
					{(isLoadingTravel || travelTime) && (
						<>
							<Separator />
							<div className="space-y-2">
								<div className="text-muted-foreground flex items-center gap-2 text-xs">
									<Route className="size-3.5" />
									<span className="font-medium">Distance from HQ</span>
								</div>
								{isLoadingTravel && (
									<div className="bg-muted/50 flex items-center gap-2 rounded-md p-2">
										<Loader2 className="text-muted-foreground size-4 animate-spin" />
										<span className="text-muted-foreground text-sm">
											Calculating...
										</span>
									</div>
								)}
								{travelTime && !isLoadingTravel && (
									<div className="bg-muted/50 flex items-center gap-3 rounded-md p-2">
										<div className="flex items-center gap-1.5">
											<Clock className="text-muted-foreground size-4" />
											<span className="font-semibold tabular-nums">
												{formatDuration(travelTime.duration)}
											</span>
											<span className="text-muted-foreground text-xs">
												drive
											</span>
										</div>
										<Separator className="h-4" orientation="vertical" />
										<div className="flex items-center gap-1.5">
											<Route className="text-muted-foreground size-4" />
											<span className="font-semibold tabular-nums">
												{travelTime.distance.toFixed(1)} mi
											</span>
										</div>
									</div>
								)}
							</div>
						</>
					)}

					{/* Property Tags */}
					<Separator />
					<div className="space-y-2">
						<div className="text-muted-foreground flex items-center gap-2 text-xs">
							<span className="font-medium">Tags</span>
						</div>
						<EntityTags
							entityId={property.id}
							entityType="property"
							onUpdateTags={(id, tags) =>
								updateEntityTags("property", id, tags)
							}
							tags={property.metadata?.tags || []}
						/>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
