"use client";

/**
 * Property Intelligence Component
 *
 * Comprehensive property information using multiple Google APIs:
 * - Street View imagery
 * - Weather conditions
 * - Air quality
 * - Elevation analysis
 * - Timezone
 *
 * Useful for job planning and property assessment.
 */

import {
	AlertTriangle,
	Camera,
	CheckCircle,
	Clock,
	Droplets,
	ExternalLink,
	Loader2,
	MapPin,
	Mountain,
	RefreshCw,
	Thermometer,
	Wind,
	XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface PropertyLocation {
	latitude: number;
	longitude: number;
	address?: string;
}

export interface PropertyIntelligenceProps {
	location: PropertyLocation;
	className?: string;
	showStreetView?: boolean;
	showWeather?: boolean;
	showAirQuality?: boolean;
	showElevation?: boolean;
	showTimezone?: boolean;
	compact?: boolean;
}

interface WeatherData {
	temperature: number;
	feelsLike: number;
	humidity: number;
	description: string;
	windSpeed: number;
	windDirection: string;
	icon?: string;
}

interface AirQualityData {
	aqi: number;
	category: string;
	dominantPollutant: string;
	color: string;
}

interface ElevationData {
	elevationMeters: number;
	elevationFeet: number;
	isHighPoint: boolean;
	isLowPoint: boolean;
	drainageDirection?: string;
	slopePercent?: number;
}

interface TimezoneData {
	timeZoneId: string;
	timeZoneName: string;
	localTime: string;
	utcOffset: string;
}

interface StreetViewData {
	available: boolean;
	imageUrl?: string;
	interactiveUrl?: string;
	captureDate?: string;
}

export function PropertyIntelligence({
	location,
	className,
	showStreetView = true,
	showWeather = true,
	showAirQuality = true,
	showElevation = true,
	showTimezone = true,
	compact = false,
}: PropertyIntelligenceProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [streetView, setStreetView] = useState<StreetViewData | null>(null);
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
	const [elevation, setElevation] = useState<ElevationData | null>(null);
	const [timezone, setTimezone] = useState<TimezoneData | null>(null);

	const fetchPropertyData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const promises: Promise<void>[] = [];

			// Fetch Street View
			if (showStreetView) {
				promises.push(
					fetch(
						`/api/street-view?lat=${location.latitude}&lon=${location.longitude}`,
					)
						.then((res) => res.json())
						.then((data) => {
							if (data.success) {
								setStreetView(data.data);
							}
						})
						.catch(() => setStreetView({ available: false })),
				);
			}

			// Fetch Weather
			if (showWeather) {
				promises.push(
					fetch("/api/weather", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "current",
							lat: location.latitude,
							lon: location.longitude,
						}),
					})
						.then((res) => res.json())
						.then((data) => {
							if (data.success && data.data) {
								setWeather({
									temperature: Math.round(data.data.temperature),
									feelsLike: Math.round(data.data.feelsLike),
									humidity: data.data.humidity,
									description: data.data.description || "Unknown",
									windSpeed: Math.round(data.data.windSpeed),
									windDirection: data.data.windDirection || "N",
								});
							}
						})
						.catch(() => setWeather(null)),
				);
			}

			// Fetch Air Quality
			if (showAirQuality) {
				promises.push(
					fetch("/api/air-quality", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "current",
							latitude: location.latitude,
							longitude: location.longitude,
						}),
					})
						.then((res) => res.json())
						.then((data) => {
							if (data.success && data.data) {
								const aqi = data.data.aqi || data.data.indexes?.[0]?.aqi || 0;
								setAirQuality({
									aqi,
									category: data.data.category || getAqiCategory(aqi),
									dominantPollutant: data.data.dominantPollutant || "PM2.5",
									color: getAqiColor(aqi),
								});
							}
						})
						.catch(() => setAirQuality(null)),
				);
			}

			// Fetch Elevation
			if (showElevation) {
				promises.push(
					fetch("/api/elevation", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "property",
							location: {
								latitude: location.latitude,
								longitude: location.longitude,
							},
						}),
					})
						.then((res) => res.json())
						.then((data) => {
							if (data.success && data.data) {
								setElevation({
									elevationMeters: Math.round(
										data.data.propertyElevation.elevationMeters,
									),
									elevationFeet: Math.round(
										data.data.propertyElevation.elevationFeet,
									),
									isHighPoint: data.data.isHighPoint,
									isLowPoint: data.data.isLowPoint,
									drainageDirection: data.data.drainageDirection,
									slopePercent: data.data.slopePercent,
								});
							}
						})
						.catch(() => setElevation(null)),
				);
			}

			// Fetch Timezone
			if (showTimezone) {
				promises.push(
					fetch(
						`/api/timezone?lat=${location.latitude}&lng=${location.longitude}`,
					)
						.then((res) => res.json())
						.then((data) => {
							if (data.success && data.data) {
								setTimezone({
									timeZoneId: data.data.timeZoneId,
									timeZoneName: data.data.timeZoneName,
									localTime: new Date(data.data.localTime).toLocaleTimeString(),
									utcOffset: data.data.utcOffsetString,
								});
							}
						})
						.catch(() => setTimezone(null)),
				);
			}

			await Promise.all(promises);
		} catch (err) {
			setError("Failed to load property data");
			console.error("Property intelligence error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [
		location,
		showStreetView,
		showWeather,
		showAirQuality,
		showElevation,
		showTimezone,
	]);

	useEffect(() => {
		fetchPropertyData();
	}, [fetchPropertyData]);

	const getAqiCategory = (aqi: number): string => {
		if (aqi <= 50) return "Good";
		if (aqi <= 100) return "Moderate";
		if (aqi <= 150) return "Unhealthy for Sensitive";
		if (aqi <= 200) return "Unhealthy";
		if (aqi <= 300) return "Very Unhealthy";
		return "Hazardous";
	};

	const getAqiColor = (aqi: number): string => {
		if (aqi <= 50) return "bg-green-500";
		if (aqi <= 100) return "bg-yellow-500";
		if (aqi <= 150) return "bg-orange-500";
		if (aqi <= 200) return "bg-red-500";
		if (aqi <= 300) return "bg-purple-500";
		return "bg-rose-900";
	};

	if (compact) {
		return (
			<Card className={className}>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						Property Intelligence
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center gap-4">
							<Skeleton className="h-10 w-10 rounded" />
							<div className="space-y-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-16" />
							</div>
						</div>
					) : (
						<div className="flex items-center gap-4 text-sm">
							{weather && (
								<div className="flex items-center gap-1">
									<Thermometer className="h-4 w-4 text-orange-500" />
									<span>{weather.temperature}°F</span>
								</div>
							)}
							{airQuality && (
								<div className="flex items-center gap-1">
									<Wind className="h-4 w-4 text-blue-500" />
									<Badge
										variant="secondary"
										className={cn("text-xs", airQuality.color, "text-white")}
									>
										AQI {airQuality.aqi}
									</Badge>
								</div>
							)}
							{elevation && (
								<div className="flex items-center gap-1">
									<Mountain className="h-4 w-4 text-green-500" />
									<span>{elevation.elevationFeet} ft</span>
								</div>
							)}
							{timezone && (
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4 text-purple-500" />
									<span>{timezone.localTime}</span>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<MapPin className="h-5 w-5" />
							Property Intelligence
						</CardTitle>
						<CardDescription>
							{location.address ||
								`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
						</CardDescription>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={fetchPropertyData}
						disabled={isLoading}
					>
						<RefreshCw
							className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
						/>
						Refresh
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{error && (
					<div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 mb-4">
						<AlertTriangle className="h-4 w-4" />
						{error}
					</div>
				)}

				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="environment">Environment</TabsTrigger>
						<TabsTrigger value="imagery">Imagery</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4 mt-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{/* Weather Card */}
							{showWeather && (
								<div className="p-4 rounded-lg bg-muted">
									{isLoading ? (
										<Skeleton className="h-16 w-full" />
									) : weather ? (
										<div className="text-center">
											<Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
											<p className="text-2xl font-bold">
												{weather.temperature}°F
											</p>
											<p className="text-xs text-muted-foreground">
												Feels like {weather.feelsLike}°F
											</p>
										</div>
									) : (
										<div className="text-center text-muted-foreground">
											<XCircle className="h-6 w-6 mx-auto mb-2" />
											<p className="text-xs">No weather data</p>
										</div>
									)}
								</div>
							)}

							{/* Air Quality Card */}
							{showAirQuality && (
								<div className="p-4 rounded-lg bg-muted">
									{isLoading ? (
										<Skeleton className="h-16 w-full" />
									) : airQuality ? (
										<div className="text-center">
											<Wind className="h-6 w-6 mx-auto mb-2 text-blue-500" />
											<p className="text-2xl font-bold">{airQuality.aqi}</p>
											<Badge
												className={cn(
													"text-xs",
													airQuality.color,
													"text-white",
												)}
											>
												{airQuality.category}
											</Badge>
										</div>
									) : (
										<div className="text-center text-muted-foreground">
											<XCircle className="h-6 w-6 mx-auto mb-2" />
											<p className="text-xs">No air quality data</p>
										</div>
									)}
								</div>
							)}

							{/* Elevation Card */}
							{showElevation && (
								<div className="p-4 rounded-lg bg-muted">
									{isLoading ? (
										<Skeleton className="h-16 w-full" />
									) : elevation ? (
										<div className="text-center">
											<Mountain className="h-6 w-6 mx-auto mb-2 text-green-500" />
											<p className="text-2xl font-bold">
												{elevation.elevationFeet} ft
											</p>
											<p className="text-xs text-muted-foreground">
												{elevation.isHighPoint && "High point"}
												{elevation.isLowPoint && "Low point"}
												{!elevation.isHighPoint &&
													!elevation.isLowPoint &&
													`${elevation.slopePercent?.toFixed(1)}% slope`}
											</p>
										</div>
									) : (
										<div className="text-center text-muted-foreground">
											<XCircle className="h-6 w-6 mx-auto mb-2" />
											<p className="text-xs">No elevation data</p>
										</div>
									)}
								</div>
							)}

							{/* Timezone Card */}
							{showTimezone && (
								<div className="p-4 rounded-lg bg-muted">
									{isLoading ? (
										<Skeleton className="h-16 w-full" />
									) : timezone ? (
										<div className="text-center">
											<Clock className="h-6 w-6 mx-auto mb-2 text-purple-500" />
											<p className="text-2xl font-bold">{timezone.localTime}</p>
											<p className="text-xs text-muted-foreground">
												{timezone.utcOffset}
											</p>
										</div>
									) : (
										<div className="text-center text-muted-foreground">
											<XCircle className="h-6 w-6 mx-auto mb-2" />
											<p className="text-xs">No timezone data</p>
										</div>
									)}
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="environment" className="space-y-4 mt-4">
						{/* Detailed Weather */}
						{showWeather && weather && (
							<div className="p-4 rounded-lg border">
								<h4 className="font-medium mb-3 flex items-center gap-2">
									<Thermometer className="h-4 w-4" />
									Weather Conditions
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">Temperature</p>
										<p className="font-medium">{weather.temperature}°F</p>
									</div>
									<div>
										<p className="text-muted-foreground">Feels Like</p>
										<p className="font-medium">{weather.feelsLike}°F</p>
									</div>
									<div>
										<p className="text-muted-foreground">Humidity</p>
										<p className="font-medium">{weather.humidity}%</p>
									</div>
									<div>
										<p className="text-muted-foreground">Wind</p>
										<p className="font-medium">
											{weather.windSpeed} mph {weather.windDirection}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Detailed Air Quality */}
						{showAirQuality && airQuality && (
							<div className="p-4 rounded-lg border">
								<h4 className="font-medium mb-3 flex items-center gap-2">
									<Wind className="h-4 w-4" />
									Air Quality
								</h4>
								<div className="flex items-center gap-4">
									<div
										className={cn(
											"w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl",
											airQuality.color,
										)}
									>
										{airQuality.aqi}
									</div>
									<div>
										<p className="font-medium">{airQuality.category}</p>
										<p className="text-sm text-muted-foreground">
											Dominant pollutant: {airQuality.dominantPollutant}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Detailed Elevation */}
						{showElevation && elevation && (
							<div className="p-4 rounded-lg border">
								<h4 className="font-medium mb-3 flex items-center gap-2">
									<Mountain className="h-4 w-4" />
									Elevation Analysis
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">Elevation</p>
										<p className="font-medium">
											{elevation.elevationFeet} ft ({elevation.elevationMeters}{" "}
											m)
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">Terrain</p>
										<p className="font-medium flex items-center gap-1">
											{elevation.isHighPoint && (
												<>
													<CheckCircle className="h-3 w-3 text-green-500" />{" "}
													High Point
												</>
											)}
											{elevation.isLowPoint && (
												<>
													<AlertTriangle className="h-3 w-3 text-yellow-500" />{" "}
													Low Point
												</>
											)}
											{!elevation.isHighPoint &&
												!elevation.isLowPoint &&
												"Normal"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">Drainage</p>
										<p className="font-medium capitalize">
											{elevation.drainageDirection || "Flat"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">Slope</p>
										<p className="font-medium">
											{elevation.slopePercent?.toFixed(1) || 0}%
										</p>
									</div>
								</div>
							</div>
						)}
					</TabsContent>

					<TabsContent value="imagery" className="mt-4">
						{showStreetView && (
							<div className="space-y-4">
								{isLoading ? (
									<Skeleton className="h-64 w-full rounded-lg" />
								) : streetView?.available ? (
									<div className="space-y-2">
										<div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={streetView.imageUrl}
												alt="Street View"
												className="w-full h-full object-cover"
											/>
											{streetView.captureDate && (
												<Badge
													className="absolute bottom-2 left-2"
													variant="secondary"
												>
													<Camera className="h-3 w-3 mr-1" />
													{streetView.captureDate}
												</Badge>
											)}
										</div>
										{streetView.interactiveUrl && (
											<Button variant="outline" size="sm" asChild>
												<a
													href={streetView.interactiveUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="h-4 w-4 mr-2" />
													Open in Google Maps
												</a>
											</Button>
										)}
									</div>
								) : (
									<div className="h-64 rounded-lg bg-muted flex items-center justify-center">
										<div className="text-center text-muted-foreground">
											<Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
											<p>Street View not available for this location</p>
										</div>
									</div>
								)}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

export default PropertyIntelligence;
