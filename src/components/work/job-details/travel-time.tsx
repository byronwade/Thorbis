/**
 * Travel Time Component
 *
 * Displays real-time travel time from shop to job address
 * Updates automatically every 5 minutes
 */

"use client";

import { AlertCircle, ArrowRight, Clock, Loader2, MapPin, RefreshCw, Route } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

type TravelTimeData = {
	duration: number; // seconds
	durationText: string;
	distance: number; // miles
	distanceText: string;
	origin: string;
	destination: string;
};

type TravelTimeProps = {
	property?: {
		address?: string | null;
		address2?: string | null;
		city?: string | null;
		state?: string | null;
		zipCode?: string | null;
		zip_code?: string | null;
		lat?: number | null;
		lon?: number | null;
	};
	className?: string;
};

const REFRESH_INTERVAL_MINUTES = 5;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const REFRESH_INTERVAL_MS = REFRESH_INTERVAL_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const SECONDS_PER_HOUR = 3600;

const splitAddress = (address: string | null | undefined) => {
	if (!address) {
		return {
			primary: "Address unavailable",
			secondary: "",
		};
	}
	const parts = address.split(",").map((part) => part.trim());
	return {
		primary: parts[0] ?? address,
		secondary: parts.slice(1).join(", "),
	};
};

const buildDestinationAddress = (property: NonNullable<TravelTimeProps["property"]>) => {
	const cityState = [property.city, property.state]
		.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
		.join(", ");

	const segments = [
		property.address,
		property.address2,
		cityState || undefined,
		property.zipCode ?? property.zip_code ?? undefined,
	].filter(
		(segment): segment is string => typeof segment === "string" && segment.trim().length > 0
	);

	return segments.map((segment) => segment.trim()).join(", ");
};

const buildApiParams = (property: NonNullable<TravelTimeProps["property"]>) => {
	const params = new URLSearchParams();
	if (property.lat && property.lon) {
		params.set("destinationLat", property.lat.toString());
		params.set("destinationLon", property.lon.toString());
	} else {
		const destinationAddress = buildDestinationAddress(property);
		params.set("destination", destinationAddress);
	}
	return params;
};

export function TravelTime({ property, className }: TravelTimeProps) {
	const [travelTime, setTravelTime] = useState<TravelTimeData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	// Track if we've already fetched to prevent re-fetching on re-renders
	const hasFetchedRef = useRef(false);

	const fetchTravelTime = useCallback(async () => {
		const hasRequiredFields = property?.address && property?.city && property?.state;

		if (!hasRequiredFields) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const params = buildApiParams(property);
			const response = await fetch(`/api/travel-time?${params.toString()}`, {
				credentials: "same-origin",
			});

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ error: "Failed to fetch travel time" }));
				throw new Error(errorData.error || "Failed to fetch travel time");
			}

			const data: TravelTimeData = await response.json();
			setTravelTime(data);
			setLastUpdated(new Date());
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch travel time");
			setTravelTime(null);
		} finally {
			setIsLoading(false);
		}
	}, [
		property?.address,
		property?.address2,
		property?.city,
		property?.state,
		property?.zipCode,
		property?.zip_code,
		property?.lat,
		property?.lon,
		// property removed - redundant and causes infinite loops
	]);

	// Use ref to always get latest fetchTravelTime without triggering effect
	const fetchTravelTimeRef = useRef(fetchTravelTime);
	useEffect(() => {
		fetchTravelTimeRef.current = fetchTravelTime;
	}, [fetchTravelTime]);

	// Fetch on mount and set up periodic refresh (every 5 minutes)
	useEffect(() => {
		// Don't do anything if no property
		if (!property?.address) {
			setIsLoading(false);
			return;
		}

		// Only fetch and setup interval once per component mount
		if (!hasFetchedRef.current) {
			hasFetchedRef.current = true;

			// Fetch immediately on mount
			fetchTravelTimeRef.current();

			// Set up periodic refresh interval (every 5 minutes)
			const interval = setInterval(() => {
				fetchTravelTimeRef.current();
			}, REFRESH_INTERVAL_MS);

			// CRITICAL: Store interval ID for cleanup
			return () => {
				clearInterval(interval);
				hasFetchedRef.current = false; // Reset for next mount
			};
		}
	}, []); // Empty deps - only run once on mount, prevents multiple intervals

	if (!property?.address) {
		// Empty deps - only run once on mount, never re-run

		return null;
	}

	// Format duration for display
	const formatDuration = (seconds: number): string => {
		const hours = Math.floor(seconds / SECONDS_PER_HOUR);
		const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	const formatRelativeTime = (date: Date | null) => {
		if (!date) {
			return null;
		}
		const diffMs = date.getTime() - Date.now();
		const diffMinutes = Math.round(diffMs / (1000 * 60));
		const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

		if (Math.abs(diffMinutes) < 60) {
			return rtf.format(diffMinutes, "minute");
		}

		const diffHours = Math.round(diffMinutes / 60);
		if (Math.abs(diffHours) < 24) {
			return rtf.format(diffHours, "hour");
		}

		const diffDays = Math.round(diffHours / 24);
		return rtf.format(diffDays, "day");
	};

	const origin = travelTime ? splitAddress(travelTime.origin) : null;
	const destination = travelTime ? splitAddress(travelTime.destination) : null;

	if (isLoading || error || !travelTime) {
		// If loading, error, or no data - show simple state without hover
		return (
			<div
				className={cn(
					"bg-muted/50 flex h-7 items-center gap-2 rounded-md px-2.5 text-xs",
					className
				)}
			>
				{isLoading && (
					<>
						<Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />
						<span className="text-muted-foreground">Calculating...</span>
					</>
				)}

				{error && (
					<>
						<AlertCircle className="text-destructive h-3 w-3" />
						<span className="text-destructive">Travel time unavailable</span>
					</>
				)}

				{!(error || travelTime || isLoading) && (
					<span className="text-muted-foreground">No travel data</span>
				)}
			</div>
		);
	}

	// Show detailed hover card when data is available
	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger asChild>
				<div
					className={cn(
						"bg-muted/50 hover:bg-muted flex h-7 cursor-help items-center gap-2 rounded-md px-2.5 text-xs transition-colors",
						className
					)}
				>
					<Clock className="text-muted-foreground h-3 w-3" />
					<span className="font-medium tabular-nums">{formatDuration(travelTime.duration)}</span>
					<span className="text-muted-foreground">•</span>
					<Route className="text-muted-foreground h-3 w-3" />
					<span className="text-muted-foreground">{travelTime.distance.toFixed(1)} mi</span>
					<button
						aria-label="Refresh travel time"
						className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-1 transition"
						onClick={fetchTravelTime}
						type="button"
					>
						<RefreshCw className="h-3 w-3" />
					</button>
				</div>
			</HoverCardTrigger>
			<HoverCardContent align="start" className="w-80">
				<div className="space-y-3">
					{/* Header */}
					<div className="flex items-center gap-2">
						<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
							<Clock className="text-primary h-4 w-4" />
						</div>
						<div>
							<div className="text-sm font-semibold">Travel Time</div>
							<div className="text-muted-foreground text-xs">From company HQ</div>
						</div>
					</div>

					{/* Main Stats */}
					<div className="grid grid-cols-2 gap-3">
						<div className="border-border/50 bg-muted/20 rounded-lg border p-3">
							<div className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
								Duration
							</div>
							<div className="text-foreground mt-1 text-2xl font-bold tabular-nums">
								{formatDuration(travelTime.duration)}
							</div>
							<div className="text-muted-foreground mt-0.5 text-xs">{travelTime.durationText}</div>
						</div>
						<div className="border-border/50 bg-muted/20 rounded-lg border p-3">
							<div className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
								Distance
							</div>
							<div className="text-foreground mt-1 text-2xl font-bold tabular-nums">
								{travelTime.distance.toFixed(1)} mi
							</div>
							<div className="text-muted-foreground mt-0.5 text-xs">{travelTime.distanceText}</div>
						</div>
					</div>

					{/* Route */}
					<div className="border-border/50 bg-muted/20 space-y-1.5 rounded-lg border p-3">
						<div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium tracking-wide uppercase">
							<Route className="h-3 w-3" />
							Route
						</div>
						<div className="flex items-start gap-2 text-sm">
							<ArrowRight className="text-muted-foreground mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
							<div className="min-w-0 flex-1">
								<div className="text-foreground font-medium">{origin?.primary}</div>
								{origin?.secondary && (
									<div className="text-muted-foreground text-xs">{origin.secondary}</div>
								)}
							</div>
						</div>
						<div className="flex items-start gap-2 text-sm">
							<MapPin className="text-primary mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
							<div className="min-w-0 flex-1">
								<div className="text-foreground font-medium">{destination?.primary}</div>
								{destination?.secondary && (
									<div className="text-muted-foreground text-xs">{destination.secondary}</div>
								)}
							</div>
						</div>
					</div>

					{/* Live Traffic Badge */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1">
							<span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
							<span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
								Live traffic data
							</span>
						</div>
						{lastUpdated && (
							<div className="text-muted-foreground text-xs">
								Updated {formatRelativeTime(lastUpdated)}
							</div>
						)}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
