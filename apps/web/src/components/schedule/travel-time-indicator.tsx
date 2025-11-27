"use client";

import { Car, MapPin, Navigation } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TravelTimeIndicatorProps = {
	fromLocation?: { lat: number; lng: number } | null;
	toLocation?: { lat: number; lng: number } | null;
	className?: string;
	size?: "sm" | "md" | "lg";
	showLabel?: boolean;
};

type TravelData = {
	durationSeconds: number;
	durationText: string;
	distanceMeters: number;
	distanceText: string;
};

// Format duration in human-readable form
function formatDuration(seconds: number): string {
	if (seconds < 60) return `${Math.round(seconds)}s`;
	if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
	const hours = Math.floor(seconds / 3600);
	const mins = Math.round((seconds % 3600) / 60);
	return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Get travel time severity color
function getTravelTimeColor(seconds: number): string {
	if (seconds <= 600) return "text-green-600"; // Under 10 min
	if (seconds <= 1200) return "text-yellow-600"; // 10-20 min
	if (seconds <= 1800) return "text-orange-600"; // 20-30 min
	return "text-red-600"; // Over 30 min
}

// Calculate straight-line distance (Haversine formula) as fallback
function calculateStraightLineDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const R = 6371e3; // Earth radius in meters
	const φ1 = (lat1 * Math.PI) / 180;
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

// Estimate travel time from distance (avg 40 km/h in city)
function estimateTravelTime(distanceMeters: number): number {
	return (distanceMeters / 40000) * 3600;
}

export const TravelTimeIndicator = memo(function TravelTimeIndicator({
	fromLocation,
	toLocation,
	className,
	size = "sm",
	showLabel = true,
}: TravelTimeIndicatorProps) {
	const [travelData, setTravelData] = useState<TravelData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!fromLocation || !toLocation) {
			setTravelData(null);
			return;
		}

		// Calculate fallback first (instant)
		const distance = calculateStraightLineDistance(
			fromLocation.lat,
			fromLocation.lng,
			toLocation.lat,
			toLocation.lng
		);
		const estimatedDuration = estimateTravelTime(distance);

		// Set fallback data immediately
		setTravelData({
			durationSeconds: estimatedDuration,
			durationText: formatDuration(estimatedDuration),
			distanceMeters: distance,
			distanceText:
				distance < 1000
					? `${Math.round(distance)}m`
					: `${(distance / 1000).toFixed(1)}km`,
		});

		// Try to fetch accurate travel time in background
		const controller = new AbortController();
		setIsLoading(true);

		fetch("/api/distance", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				action: "single",
				origin: { latitude: fromLocation.lat, longitude: fromLocation.lng },
				destination: { latitude: toLocation.lat, longitude: toLocation.lng },
				options: { mode: "driving", departureTime: "now" },
			}),
			signal: controller.signal,
		})
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed to fetch travel time");
				const data = await res.json();
				if (data.success && data.data) {
					setTravelData({
						durationSeconds: data.data.durationSeconds,
						durationText: data.data.durationText,
						distanceMeters: data.data.distanceMeters,
						distanceText: data.data.distanceText,
					});
				}
			})
			.catch((err) => {
				if (err.name !== "AbortError") {
					// Keep fallback data, just log error
					console.debug("Travel time fetch failed, using estimate:", err);
				}
			})
			.finally(() => setIsLoading(false));

		return () => controller.abort();
	}, [fromLocation, toLocation]);

	if (!travelData) return null;

	const colorClass = getTravelTimeColor(travelData.durationSeconds);
	const sizeClasses = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-base",
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							"flex items-center gap-1",
							sizeClasses[size],
							colorClass,
							className
						)}
					>
						<Car className={cn("size-3", size === "lg" && "size-4")} />
						<span className={cn("font-medium", isLoading && "animate-pulse")}>
							{travelData.durationText}
						</span>
						{showLabel && (
							<span className="text-muted-foreground hidden sm:inline">
								({travelData.distanceText})
							</span>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<div className="space-y-1">
						<p className="font-medium">Travel Time</p>
						<p className="text-muted-foreground text-sm">
							<Car className="mr-1 inline size-3" />
							{travelData.durationText} drive
						</p>
						<p className="text-muted-foreground text-sm">
							<MapPin className="mr-1 inline size-3" />
							{travelData.distanceText} distance
						</p>
						{isLoading && (
							<p className="text-muted-foreground text-xs italic">
								Calculating actual route...
							</p>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
});

// Compact badge version for job cards
export function TravelTimeBadge({
	durationSeconds,
	className,
}: {
	durationSeconds: number;
	className?: string;
}) {
	const colorClass = getTravelTimeColor(durationSeconds);

	return (
		<Badge
			variant="secondary"
			className={cn("gap-1 px-1.5 py-0.5 text-xs", colorClass, className)}
		>
			<Car className="size-3" />
			{formatDuration(durationSeconds)}
		</Badge>
	);
}

// Travel time between two consecutive jobs in timeline
export function JobTravelConnector({
	fromLocation,
	toLocation,
	className,
}: {
	fromLocation?: { lat: number; lng: number } | null;
	toLocation?: { lat: number; lng: number } | null;
	className?: string;
}) {
	const [duration, setDuration] = useState<number | null>(null);

	useEffect(() => {
		if (!fromLocation || !toLocation) return;

		// Quick estimate
		const distance = calculateStraightLineDistance(
			fromLocation.lat,
			fromLocation.lng,
			toLocation.lat,
			toLocation.lng
		);
		setDuration(estimateTravelTime(distance));
	}, [fromLocation, toLocation]);

	if (!duration) return null;

	return (
		<div
			className={cn(
				"text-muted-foreground flex items-center gap-1 text-xs",
				className
			)}
		>
			<Navigation className="size-3 rotate-90" />
			<span>{formatDuration(duration)}</span>
		</div>
	);
}
