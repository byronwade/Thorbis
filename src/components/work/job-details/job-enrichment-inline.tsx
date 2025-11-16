/**
 * Inline Job Enrichment Component
 *
 * Displays critical operational intelligence inline with job details
 * No cards, minimal UI, important data only
 */

"use client";

import { AlertTriangle, Clock, Cloud, CloudRain, Route, Sun, Wind } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type EnrichmentData = {
	enrichmentStatus?: string;
	recommendations?: {
		shouldReschedule: boolean;
		rescheduleReason?: string;
		upsellOpportunities: string[];
		safetyWarnings: string[];
	};
	weather?: {
		hasActiveAlerts?: boolean;
		alerts?: Array<{
			event: string;
			headline: string;
			severity: string;
			urgency: string;
		}>;
		highestSeverity?: string;
		forecast?: {
			periods?: Array<{
				name: string;
				temperature: number;
				temperatureUnit: string;
				shortForecast: string;
				windSpeed: string;
			}>;
		};
	};
	traffic?: {
		incidents: Array<{
			type: "crash" | "construction" | "road_closed" | "police" | "congestion" | "other";
			severity: "minor" | "moderate" | "major";
			description: string;
			distance: number;
			affectsRoute: boolean;
		}>;
		nearbyIncidents: number;
		routeAffectingIncidents: number;
	};
	timeZone?: {
		timeZoneId: string;
		timeZoneName: string;
		currentLocalTime: string;
	};
	location?: {
		lat: number;
		lon: number;
		address: string;
	};
};

type TravelTimeData = {
	duration: number; // seconds
	durationText: string;
	distance: number; // miles
	distanceText: string;
	origin: string;
	destination: string;
};

type JobEnrichmentInlineProps = {
	enrichmentData?: EnrichmentData | null;
	jobId?: string;
	property?: {
		address?: string;
		city?: string;
		state?: string;
		zip_code?: string;
		lat?: number | null;
		lon?: number | null;
	};
};

export function JobEnrichmentInline({ enrichmentData: initialData, jobId, property }: JobEnrichmentInlineProps) {
	const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(initialData || null);
	const [isLoading, setIsLoading] = useState(!initialData);
	const [hasFetched, setHasFetched] = useState(false);
	const [travelTime, setTravelTime] = useState<TravelTimeData | null>(null);
	const [isLoadingTravel, setIsLoadingTravel] = useState(false);

	const fetchEnrichment = useCallback(async () => {
		if (!(jobId && property?.address && property?.city && property?.state)) {
			setIsLoading(false);
			return;
		}

		// Prevent re-fetching if already fetched
		if (hasFetched) {
			return;
		}

		setHasFetched(true);

		try {
			const params = new URLSearchParams({
				jobId,
				address: property.address,
				city: property.city,
				state: property.state,
				zipCode: property.zip_code || "",
			});

			if (property.lat && property.lon) {
				params.set("lat", property.lat.toString());
				params.set("lon", property.lon.toString());
			}

			const response = await fetch(`/api/job-enrichment?${params.toString()}`);

			if (response.ok) {
				const data = await response.json();
				setEnrichmentData(data);
			}
		} catch (_error) {
			// Silently fail - enrichment is non-critical
		} finally {
			setIsLoading(false);
		}
	}, [
		jobId,
		property?.address,
		property?.city,
		property?.state,
		property?.zip_code,
		property?.lat,
		property?.lon,
		hasFetched,
	]);

	useEffect(() => {
		// Only fetch once on mount if no initial data
		if (!(initialData || hasFetched) && jobId && property) {
			fetchEnrichment();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchEnrichment, hasFetched, initialData, jobId, property]); // Run once on mount only

	// Fetch travel time data
	useEffect(() => {
		const fetchTravelTime = async () => {
			// Only fetch if we have required address data
			if (!(property?.address && property?.city && property?.state)) {
				return;
			}

			setIsLoadingTravel(true);
			try {
				const params = new URLSearchParams();
				if (property.lat && property.lon) {
					params.set("destinationLat", property.lat.toString());
					params.set("destinationLon", property.lon.toString());
				} else {
					const destination = [property.address, property.city, property.state, property.zip_code]
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
				console.error("Error:", _error);
			} finally {
				setIsLoadingTravel(false);
			}
		};

		fetchTravelTime();
	}, [property?.address, property?.city, property?.state, property?.zip_code, property?.lat, property?.lon]);

	if (isLoading || !enrichmentData || enrichmentData.enrichmentStatus === "failed") {
		return null;
	}

	const { weather, traffic, recommendations, timeZone } = enrichmentData;

	// Log full data to console for debugging
	if (enrichmentData) {
		// TODO: Handle error case
	}

	const hasWeatherAlerts = weather?.hasActiveAlerts && weather?.alerts && weather.alerts.length > 0;
	const hasTrafficIncidents = traffic?.incidents && traffic.incidents.length > 0;
	const todayForecast = weather?.forecast?.periods?.[0];
	const shouldReschedule = recommendations?.shouldReschedule;
	const hasSafetyWarnings = recommendations?.safetyWarnings && recommendations.safetyWarnings.length > 0;

	// If no important data, don't render anything
	if (
		!(hasWeatherAlerts || hasTrafficIncidents || todayForecast || shouldReschedule || hasSafetyWarnings || timeZone)
	) {
		return null;
	}

	// Deduplicate alerts by event type
	const uniqueAlerts =
		hasWeatherAlerts && weather.alerts
			? weather.alerts.filter((alert, index, self) => index === self.findIndex((a) => a.event === alert.event))
			: [];

	const _getSeverityVariant = (severity: string) => {
		switch (severity) {
			case "Extreme":
				return "destructive";
			case "Severe":
				return "default";
			default:
				return "secondary";
		}
	};

	const _getTrafficIcon = (_type: string) => {
		// Using AlertTriangle for all types for now, could customize
		return AlertTriangle;
	};

	const _getTrafficVariant = (severity: string) => {
		switch (severity) {
			case "major":
				return "destructive";
			case "moderate":
				return "default";
			default:
				return "secondary";
		}
	};

	const getTrafficLabel = (type: string) => {
		switch (type) {
			case "crash":
				return "Crash";
			case "construction":
				return "Construction";
			case "road_closed":
				return "Road Closed";
			case "police":
				return "Police Activity";
			case "congestion":
				return "Heavy Traffic";
			default:
				return "Incident";
		}
	};

	const formatDuration = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	const getWeatherIcon = (forecast: string) => {
		const lower = forecast.toLowerCase();
		if (lower.includes("rain") || lower.includes("shower")) {
			return CloudRain;
		}
		if (lower.includes("cloud") || lower.includes("overcast")) {
			return Cloud;
		}
		if (lower.includes("wind")) {
			return Wind;
		}
		return Sun;
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			{/* Travel Time & Distance */}
			{!isLoadingTravel && travelTime && (
				<HoverCard openDelay={200}>
					<HoverCardTrigger asChild>
						<div className="inline-flex cursor-help items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
							<Route className="size-4" />
							{formatDuration(travelTime.duration)} • {travelTime.distance.toFixed(1)} mi
						</div>
					</HoverCardTrigger>
					<HoverCardContent className="w-80">
						<div className="space-y-3">
							<div>
								<h4 className="font-semibold text-sm">Distance from HQ</h4>
								<p className="text-muted-foreground text-xs">Real-time driving info</p>
							</div>
							<div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
								<div className="flex items-center gap-2">
									<Clock className="size-4 text-muted-foreground" />
									<span className="font-semibold tabular-nums">{formatDuration(travelTime.duration)}</span>
									<span className="text-muted-foreground text-xs">drive</span>
								</div>
								<div className="h-4 w-px bg-border" />
								<div className="flex items-center gap-2">
									<Route className="size-4 text-muted-foreground" />
									<span className="font-semibold tabular-nums">{travelTime.distance.toFixed(1)} mi</span>
								</div>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
			)}

			{/* Weather Forecast */}
			{todayForecast &&
				(() => {
					const WeatherIcon = getWeatherIcon(todayForecast.shortForecast);
					const weekForecast = weather?.forecast?.periods?.slice(0, 14) || []; // Get up to 14 periods (7 days, day+night)
					return (
						<HoverCard openDelay={200}>
							<HoverCardTrigger asChild>
								<div className="inline-flex cursor-help items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
									<WeatherIcon className="size-4" />
									{todayForecast.temperature}°{todayForecast.temperatureUnit}
								</div>
							</HoverCardTrigger>
							<HoverCardContent align="start" className="w-[420px]" side="bottom">
								<div className="space-y-3">
									<div>
										<h4 className="font-semibold text-sm">7-Day Weather Forecast</h4>
										<p className="text-muted-foreground text-xs">Plan ahead for your service visit</p>
									</div>
									<div className="max-h-[400px] space-y-1.5 overflow-y-auto">
										{weekForecast.map((period, idx) => {
											const PeriodIcon = getWeatherIcon(period.shortForecast);
											return (
												<div
													className="flex items-center justify-between gap-3 rounded-md bg-muted/50 p-2.5 transition-colors hover:bg-muted"
													key={idx}
												>
													<div className="flex min-w-0 flex-1 items-center gap-2">
														<PeriodIcon className="size-4 shrink-0 text-muted-foreground" />
														<div className="min-w-0 flex-1">
															<p className="truncate font-medium text-sm">{period.name}</p>
															<p className="truncate text-muted-foreground text-xs">{period.shortForecast}</p>
														</div>
													</div>
													<div className="flex shrink-0 items-center gap-3">
														<span className="font-semibold text-sm tabular-nums">
															{period.temperature}°{period.temperatureUnit}
														</span>
														<span className="min-w-[60px] text-right text-muted-foreground text-xs">
															{period.windSpeed}
														</span>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</HoverCardContent>
						</HoverCard>
					);
				})()}

			{/* Safety Warnings */}
			{hasSafetyWarnings && recommendations?.safetyWarnings && (
				<HoverCard openDelay={200}>
					<HoverCardTrigger asChild>
						<div className="inline-flex cursor-help items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-700 text-sm transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-900/40 dark:hover:bg-red-900/30">
							<AlertTriangle className="size-4" />
							{recommendations.safetyWarnings.length} Safety Warning
							{recommendations.safetyWarnings.length > 1 ? "s" : ""}
						</div>
					</HoverCardTrigger>
					<HoverCardContent className="w-96">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<AlertTriangle className="size-4" />
								<h4 className="font-semibold text-sm">Safety Warnings</h4>
							</div>
							<ul className="space-y-2">
								{recommendations.safetyWarnings.map((warning, idx) => (
									<li className="text-muted-foreground text-xs leading-relaxed" key={idx}>
										• {warning}
									</li>
								))}
							</ul>
						</div>
					</HoverCardContent>
				</HoverCard>
			)}

			{/* Weather Alerts */}
			{uniqueAlerts.map((alert, index) => (
				<HoverCard key={index} openDelay={200}>
					<HoverCardTrigger asChild>
						<div
							className={`inline-flex cursor-help items-center gap-2 rounded-full border px-4 py-2 font-medium text-sm transition-colors ${
								alert.severity === "Extreme"
									? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-900/40 dark:hover:bg-red-900/30"
									: alert.severity === "Severe"
										? "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:border-amber-900/40 dark:hover:bg-amber-900/30"
										: "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5"
							}`}
						>
							<AlertTriangle className="size-4" />
							{alert.event}
						</div>
					</HoverCardTrigger>
					<HoverCardContent className="w-96">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<AlertTriangle className="size-4" />
								<h4 className="font-semibold text-sm">{alert.event}</h4>
								<span className="ml-auto rounded-full border px-2 py-0.5 text-xs">{alert.severity}</span>
							</div>
							<p className="text-muted-foreground text-xs leading-relaxed">{alert.headline}</p>
							{alert.urgency && (
								<p className="text-muted-foreground text-xs">
									<span className="font-medium">Urgency:</span> {alert.urgency}
								</p>
							)}
						</div>
					</HoverCardContent>
				</HoverCard>
			))}

			{/* Traffic Incidents */}
			{hasTrafficIncidents &&
				traffic.incidents.map((incident, index) => (
					<HoverCard key={`traffic-${index}`} openDelay={200}>
						<HoverCardTrigger asChild>
							<div
								className={`inline-flex cursor-help items-center gap-2 rounded-full border px-4 py-2 font-medium text-sm transition-colors ${
									incident.severity === "major"
										? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-900/40 dark:hover:bg-red-900/30"
										: incident.severity === "moderate"
											? "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:border-amber-900/40 dark:hover:bg-amber-900/30"
											: "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5"
								}`}
							>
								<AlertTriangle className="size-4" />
								{getTrafficLabel(incident.type)}
								{incident.affectsRoute && " (On Route)"}
							</div>
						</HoverCardTrigger>
						<HoverCardContent className="w-96">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<AlertTriangle className="size-4" />
									<h4 className="font-semibold text-sm">{getTrafficLabel(incident.type)}</h4>
									<span className="ml-auto rounded-full border px-2 py-0.5 text-xs">{incident.severity}</span>
								</div>
								<p className="text-muted-foreground text-xs leading-relaxed">{incident.description}</p>
								<div className="flex items-center gap-4 text-muted-foreground text-xs">
									<span>
										<span className="font-medium">Distance:</span> {incident.distance.toFixed(1)} mi
									</span>
									{incident.affectsRoute && (
										<span className="font-medium text-amber-600 dark:text-amber-400">Affects your route</span>
									)}
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
				))}
		</div>
	);
}
