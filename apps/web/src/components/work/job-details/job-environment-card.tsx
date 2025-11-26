/**
 * Job Environment Card
 *
 * Displays weather, air quality, pollen, and environmental data
 * for the job location using Google APIs
 */

"use client";

import {
	AlertTriangle,
	CloudRain,
	Droplets,
	Leaf,
	Loader2,
	RefreshCw,
	Sun,
	Thermometer,
	Wind,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type WeatherData = {
	temperature: number;
	feelsLike: number;
	humidity: number;
	windSpeed: number;
	conditions: string;
	icon: string;
	alerts: Array<{ headline: string; severity: string }>;
};

type AirQualityData = {
	aqi: number;
	category: string;
	dominantPollutant: string;
	healthRecommendation?: string;
};

type PollenData = {
	tree: { level: string; index: number };
	grass: { level: string; index: number };
	weed: { level: string; index: number };
	overallLevel: string;
};

type EnvironmentData = {
	weather?: WeatherData;
	airQuality?: AirQualityData;
	pollen?: PollenData;
	recommendations: {
		safetyWarnings: string[];
		hvacRecommendations: Array<{
			type: string;
			reason: string;
			urgency: "low" | "medium" | "high";
		}>;
	};
};

type JobEnvironmentCardProps = {
	property?: {
		lat?: number | null;
		lon?: number | null;
		address?: string | null;
		city?: string | null;
		state?: string | null;
	};
	className?: string;
	compact?: boolean;
};

const AQI_COLORS: Record<string, { bg: string; text: string }> = {
	Good: { bg: "bg-green-500/20", text: "text-green-600" },
	Moderate: { bg: "bg-yellow-500/20", text: "text-yellow-600" },
	"Unhealthy for Sensitive Groups": {
		bg: "bg-orange-500/20",
		text: "text-orange-600",
	},
	Unhealthy: { bg: "bg-red-500/20", text: "text-red-600" },
	"Very Unhealthy": { bg: "bg-purple-500/20", text: "text-purple-600" },
	Hazardous: { bg: "bg-rose-800/20", text: "text-rose-800" },
};

const POLLEN_COLORS: Record<string, string> = {
	none: "bg-green-500",
	low: "bg-green-400",
	moderate: "bg-yellow-500",
	high: "bg-orange-500",
	very_high: "bg-red-500",
};

export function JobEnvironmentCard({
	property,
	className,
	compact = false,
}: JobEnvironmentCardProps) {
	const [data, setData] = useState<EnvironmentData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const hasFetchedRef = useRef(false);

	const fetchEnvironmentData = useCallback(async () => {
		if (!property?.lat || !property?.lon) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/job-environment?lat=${property.lat}&lon=${property.lon}`,
				{ credentials: "same-origin" },
			);

			if (!response.ok) {
				throw new Error("Failed to fetch environment data");
			}

			const result = await response.json();
			setData(result);
			setLastUpdated(new Date());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch data");
		} finally {
			setIsLoading(false);
		}
	}, [property?.lat, property?.lon]);

	const fetchRef = useRef(fetchEnvironmentData);
	useEffect(() => {
		fetchRef.current = fetchEnvironmentData;
	}, [fetchEnvironmentData]);

	useEffect(() => {
		if (!property?.lat || !property?.lon) {
			setIsLoading(false);
			return;
		}

		if (!hasFetchedRef.current) {
			hasFetchedRef.current = true;
			fetchRef.current();

			// Refresh every 15 minutes
			const interval = setInterval(
				() => {
					fetchRef.current();
				},
				15 * 60 * 1000,
			);

			return () => {
				clearInterval(interval);
				hasFetchedRef.current = false;
			};
		}
	}, [property?.lat, property?.lon]);

	if (!property?.lat || !property?.lon) {
		return null;
	}

	if (isLoading) {
		return (
			<Card className={cn("animate-pulse", className)}>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm flex items-center gap-2">
						<Sun className="h-4 w-4" />
						Environment
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	if (error || !data) {
		return (
			<Card className={className}>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm flex items-center gap-2">
						<Sun className="h-4 w-4" />
						Environment
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{error || "Environmental data unavailable"}
					</p>
				</CardContent>
			</Card>
		);
	}

	const { weather, airQuality, pollen, recommendations } = data;
	const aqiColors = airQuality
		? AQI_COLORS[airQuality.category] || AQI_COLORS.Good
		: null;

	if (compact) {
		return (
			<HoverCard>
				<HoverCardTrigger asChild>
					<div
						className={cn(
							"flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors",
							className,
						)}
					>
						{weather && (
							<>
								{weather.conditions.toLowerCase().includes("rain") ? (
									<CloudRain className="h-4 w-4 text-blue-500" />
								) : (
									<Sun className="h-4 w-4 text-amber-500" />
								)}
								<span className="font-medium">
									{Math.round(weather.temperature)}°F
								</span>
							</>
						)}
						{airQuality && (
							<Badge
								variant="outline"
								className={cn("text-xs", aqiColors?.bg, aqiColors?.text)}
							>
								AQI {airQuality.aqi}
							</Badge>
						)}
						{recommendations.safetyWarnings.length > 0 && (
							<AlertTriangle className="h-4 w-4 text-amber-500" />
						)}
					</div>
				</HoverCardTrigger>
				<HoverCardContent className="w-80">
					<FullEnvironmentDisplay
						weather={weather}
						airQuality={airQuality}
						pollen={pollen}
						recommendations={recommendations}
						aqiColors={aqiColors}
						lastUpdated={lastUpdated}
						onRefresh={fetchEnvironmentData}
					/>
				</HoverCardContent>
			</HoverCard>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm flex items-center gap-2">
						<Sun className="h-4 w-4" />
						Environment
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={fetchEnvironmentData}
					>
						<RefreshCw className="h-3 w-3" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<FullEnvironmentDisplay
					weather={weather}
					airQuality={airQuality}
					pollen={pollen}
					recommendations={recommendations}
					aqiColors={aqiColors}
					lastUpdated={lastUpdated}
					onRefresh={fetchEnvironmentData}
				/>
			</CardContent>
		</Card>
	);
}

function FullEnvironmentDisplay({
	weather,
	airQuality,
	pollen,
	recommendations,
	aqiColors,
	lastUpdated,
	onRefresh,
}: {
	weather?: WeatherData;
	airQuality?: AirQualityData;
	pollen?: PollenData;
	recommendations: EnvironmentData["recommendations"];
	aqiColors: { bg: string; text: string } | null;
	lastUpdated: Date | null;
	onRefresh: () => void;
}) {
	return (
		<div className="space-y-4">
			{/* Weather Section */}
			{weather && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{weather.conditions.toLowerCase().includes("rain") ||
							weather.conditions.toLowerCase().includes("storm") ? (
								<CloudRain className="h-8 w-8 text-blue-500" />
							) : weather.conditions.toLowerCase().includes("cloud") ? (
								<CloudRain className="h-8 w-8 text-gray-500" />
							) : (
								<Sun className="h-8 w-8 text-amber-500" />
							)}
							<div>
								<div className="text-2xl font-bold">
									{Math.round(weather.temperature)}°F
								</div>
								<div className="text-sm text-muted-foreground">
									{weather.conditions}
								</div>
							</div>
						</div>
						<div className="text-right text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Thermometer className="h-3 w-3" />
								Feels {Math.round(weather.feelsLike)}°F
							</div>
							<div className="flex items-center gap-1">
								<Droplets className="h-3 w-3" />
								{weather.humidity}% humidity
							</div>
							<div className="flex items-center gap-1">
								<Wind className="h-3 w-3" />
								{Math.round(weather.windSpeed)} mph
							</div>
						</div>
					</div>

					{weather.alerts.length > 0 && (
						<div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
							<div className="flex items-center gap-2 text-amber-600 text-xs font-medium">
								<AlertTriangle className="h-3 w-3" />
								{weather.alerts[0].headline}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Air Quality Section */}
			{airQuality && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Air Quality
						</span>
						<Badge
							variant="outline"
							className={cn("text-xs", aqiColors?.bg, aqiColors?.text)}
						>
							{airQuality.category}
						</Badge>
					</div>
					<div className="flex items-center gap-2">
						<Progress
							value={Math.min(airQuality.aqi / 3, 100)}
							className="flex-1"
						/>
						<span className="text-sm font-medium w-12 text-right">
							AQI {airQuality.aqi}
						</span>
					</div>
					{airQuality.healthRecommendation && (
						<p className="text-xs text-muted-foreground">
							{airQuality.healthRecommendation}
						</p>
					)}
				</div>
			)}

			{/* Pollen Section */}
			{pollen && (
				<div className="space-y-2">
					<div className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
						<Leaf className="h-3 w-3" />
						Pollen Levels
					</div>
					<div className="grid grid-cols-3 gap-2">
						<PollenIndicator
							label="Tree"
							level={pollen.tree.level}
							index={pollen.tree.index}
						/>
						<PollenIndicator
							label="Grass"
							level={pollen.grass.level}
							index={pollen.grass.index}
						/>
						<PollenIndicator
							label="Weed"
							level={pollen.weed.level}
							index={pollen.weed.index}
						/>
					</div>
				</div>
			)}

			{/* Recommendations */}
			{(recommendations.safetyWarnings.length > 0 ||
				recommendations.hvacRecommendations.length > 0) && (
				<div className="space-y-2 pt-2 border-t">
					{recommendations.safetyWarnings.map((warning, i) => (
						<div
							key={i}
							className="flex items-start gap-2 text-xs text-amber-600"
						>
							<AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
							{warning}
						</div>
					))}
					{recommendations.hvacRecommendations.map((rec, i) => (
						<div
							key={i}
							className={cn(
								"flex items-start gap-2 text-xs",
								rec.urgency === "high"
									? "text-red-600"
									: rec.urgency === "medium"
										? "text-amber-600"
										: "text-blue-600",
							)}
						>
							<Leaf className="h-3 w-3 mt-0.5 flex-shrink-0" />
							<span>
								<span className="font-medium">{rec.type}:</span> {rec.reason}
							</span>
						</div>
					))}
				</div>
			)}

			{/* Last Updated */}
			{lastUpdated && (
				<div className="text-[10px] text-muted-foreground text-right">
					Updated {lastUpdated.toLocaleTimeString()}
				</div>
			)}
		</div>
	);
}

function PollenIndicator({
	label,
	level,
	index,
}: {
	label: string;
	level: string;
	index: number;
}) {
	const color = POLLEN_COLORS[level] || POLLEN_COLORS.low;

	return (
		<div className="text-center">
			<div className="text-[10px] text-muted-foreground mb-1">{label}</div>
			<div className={cn("h-2 w-2 rounded-full mx-auto mb-1", color)} />
			<div className="text-xs font-medium capitalize">
				{level.replace("_", " ")}
			</div>
		</div>
	);
}
