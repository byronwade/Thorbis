"use client";

/**
 * Weather Dropdown for App Header
 *
 * Compact weather indicator that expands to show:
 * - Current conditions
 * - Weather alerts (severe weather warnings)
 * - Air quality index (AQI)
 * - Hourly forecast
 * - Outdoor work recommendations
 */

import {
	AlertTriangle,
	Cloud,
	CloudRain,
	CloudSnow,
	Droplets,
	Leaf,
	Sun,
	Thermometer,
	Wind,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getCompanyAirQuality } from "@/actions/air-quality";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AirQuality } from "@/lib/services/air-quality-service";
import type { WeatherData } from "@/lib/services/weather-service";
import { useWeatherStore } from "@/lib/stores/weather-store";
import { cn } from "@/lib/utils";

type WeatherDropdownProps = {
	initialWeather?: WeatherData | null;
};

// Get weather icon based on forecast description
function getWeatherIcon(forecast: string) {
	const lower = forecast.toLowerCase();
	if (lower.includes("rain") || lower.includes("shower")) {
		return CloudRain;
	}
	if (lower.includes("snow") || lower.includes("flurr")) {
		return CloudSnow;
	}
	if (lower.includes("cloud") || lower.includes("overcast")) {
		return Cloud;
	}
	if (lower.includes("wind")) {
		return Wind;
	}
	return Sun;
}

// Get severity styling
function getSeverityStyles(severity: string) {
	switch (severity) {
		case "Extreme":
			return {
				bg: "bg-red-500/15",
				border: "border-red-500/30",
				text: "text-red-600 dark:text-red-400",
				badge: "bg-red-600 text-white",
			};
		case "Severe":
			return {
				bg: "bg-orange-500/15",
				border: "border-orange-500/30",
				text: "text-orange-600 dark:text-orange-400",
				badge: "bg-orange-500 text-white",
			};
		case "Moderate":
			return {
				bg: "bg-yellow-500/15",
				border: "border-yellow-500/30",
				text: "text-yellow-600 dark:text-yellow-400",
				badge: "bg-yellow-500 text-black",
			};
		default:
			return {
				bg: "bg-blue-500/15",
				border: "border-blue-500/30",
				text: "text-blue-600 dark:text-blue-400",
				badge: "bg-blue-500 text-white",
			};
	}
}

export function WeatherDropdown({ initialWeather }: WeatherDropdownProps) {
	const { weather, setWeather, fetchWeather } = useWeatherStore();
	const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
		new Set()
	);
	const [open, setOpen] = useState(false);
	const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
	const [airQualityLoading, setAirQualityLoading] = useState(false);
	const airQualityFetchedRef = useRef(false);

	// Initialize weather from server data
	useEffect(() => {
		if (initialWeather && !weather) {
			setWeather(initialWeather);
		} else if (!weather) {
			fetchWeather();
		}
	}, [initialWeather, weather, setWeather, fetchWeather]);

	// Fetch air quality when dropdown opens (only once)
	useEffect(() => {
		if (open && !airQualityFetchedRef.current) {
			airQualityFetchedRef.current = true;
			setAirQualityLoading(true);
			getCompanyAirQuality()
				.then((result) => {
					if (result.success) {
						setAirQuality(result.data);
					}
				})
				.finally(() => setAirQualityLoading(false));
		}
	}, [open]);

	const currentWeather = weather;

	// Get current conditions
	const currentConditions = currentWeather?.hourly?.periods?.[0];
	const WeatherIcon = currentConditions
		? getWeatherIcon(currentConditions.shortForecast)
		: Cloud;

	// Get active alerts
	const activeAlerts = (currentWeather?.alerts || []).filter(
		(alert) => !dismissedAlerts.has(alert.headline)
	);

	const hasActiveAlerts = activeAlerts.length > 0;
	const hasSevereAlerts = activeAlerts.some(
		(a) => a.severity === "Extreme" || a.severity === "Severe"
	);

	// Dismiss alert
	const dismissAlert = (headline: string) => {
		setDismissedAlerts((prev) => new Set([...prev, headline]));
	};

	// Check for outdoor work concerns
	const getWorkConcerns = () => {
		if (!currentConditions) return [];
		const concerns: { label: string; severity: "warning" | "danger" }[] = [];

		if (currentConditions.temperature < 32) {
			concerns.push({ label: "Freezing conditions", severity: "warning" });
		}
		if (currentConditions.temperature > 95) {
			concerns.push({ label: "Extreme heat", severity: "danger" });
		}
		if (
			currentConditions.shortForecast.toLowerCase().includes("rain") ||
			currentConditions.shortForecast.toLowerCase().includes("storm")
		) {
			concerns.push({ label: "Rain expected", severity: "warning" });
		}
		if (currentConditions.shortForecast.toLowerCase().includes("snow")) {
			concerns.push({ label: "Snow expected", severity: "warning" });
		}

		// Add air quality concerns
		if (airQuality) {
			if (airQuality.categoryNumber >= 4) {
				concerns.push({ label: `Poor air quality (${airQuality.category})`, severity: "danger" });
			} else if (airQuality.categoryNumber === 3) {
				concerns.push({ label: `Moderate air quality`, severity: "warning" });
			}
		}

		return concerns;
	};

	const workConcerns = getWorkConcerns();

	// If no weather data, show loading state
	if (!currentWeather || !currentConditions) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							className="focus-visible:ring-ring/50 relative inline-flex h-8 shrink-0 w-8 items-center justify-center rounded-md transition-all duration-150 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
							type="button"
							disabled
						>
							<Cloud className="size-4 animate-pulse" />
						</button>
					</TooltipTrigger>
					<TooltipContent>Loading weather...</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<button
								className={cn(
									"focus-visible:ring-ring/50 relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-2 transition-all duration-150 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
									hasSevereAlerts
										? "text-destructive bg-destructive/10"
										: hasActiveAlerts
											? "text-warning bg-warning/10"
											: "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
								)}
								type="button"
							>
								<WeatherIcon className="size-4" />
								<span className="text-xs font-medium tabular-nums">
									{currentConditions.temperature}°
								</span>
								{hasActiveAlerts && (
									<span className="relative flex size-2">
										<span
											className={cn(
												"absolute inline-flex size-full animate-ping rounded-full opacity-75",
												hasSevereAlerts ? "bg-red-400" : "bg-orange-400"
											)}
										/>
										<span
											className={cn(
												"relative inline-flex size-2 rounded-full",
												hasSevereAlerts ? "bg-red-500" : "bg-orange-500"
											)}
										/>
									</span>
								)}
							</button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>
							{currentConditions.shortForecast} · {currentConditions.temperature}°
							{currentConditions.temperatureUnit}
						</p>
						{hasActiveAlerts && (
							<p className="text-orange-400">
								{activeAlerts.length} weather alert{activeAlerts.length !== 1 ? "s" : ""}
							</p>
						)}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<PopoverContent
				side="bottom"
				align="end"
				className="w-[340px] p-0"
				sideOffset={8}
				alignOffset={0}
				collisionPadding={{ top: 16, bottom: 16, left: 16, right: 24 }}
				avoidCollisions={true}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<WeatherIcon className="text-primary size-5" />
						<div>
							<h4 className="text-sm font-semibold">Weather</h4>
							<p className="text-muted-foreground text-xs">
								{currentWeather.location?.city || "Current location"}
							</p>
						</div>
					</div>
					<div className="text-right">
						<div className="text-lg font-bold">
							{currentConditions.temperature}°{currentConditions.temperatureUnit}
						</div>
						<div className="text-muted-foreground text-xs">
							{currentConditions.shortForecast}
						</div>
					</div>
				</div>

				<ScrollArea className="max-h-[400px]">
					{/* Weather Alerts */}
					{activeAlerts.length > 0 && (
						<div className="p-3 space-y-2">
							<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								<AlertTriangle className="size-3" />
								Weather Alerts
							</div>
							{activeAlerts.map((alert, idx) => {
								const styles = getSeverityStyles(alert.severity);
								return (
									<div
										key={`${alert.headline}-${idx}`}
										className={cn(
											"relative rounded-lg border p-3",
											styles.bg,
											styles.border
										)}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 flex-wrap">
													<span className={cn("font-medium text-sm", styles.text)}>
														{alert.event}
													</span>
													<Badge className={cn("text-[10px]", styles.badge)}>
														{alert.severity}
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs mt-1 line-clamp-2">
													{alert.headline}
												</p>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="size-6 shrink-0"
												onClick={() => dismissAlert(alert.headline)}
											>
												<X className="size-3" />
											</Button>
										</div>
									</div>
								);
							})}
						</div>
					)}

					{activeAlerts.length > 0 && <Separator />}

					{/* Current Conditions */}
					<div className="p-3">
						<div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
							Current Conditions
						</div>
						<div className="grid grid-cols-3 gap-3">
							<div className="flex flex-col items-center rounded-lg bg-muted/50 p-2">
								<Thermometer className="size-4 text-muted-foreground mb-1" />
								<span className="text-sm font-medium">
									{currentConditions.temperature}°
								</span>
								<span className="text-[10px] text-muted-foreground">Temp</span>
							</div>
							<div className="flex flex-col items-center rounded-lg bg-muted/50 p-2">
								<Wind className="size-4 text-muted-foreground mb-1" />
								<span className="text-sm font-medium">
									{currentConditions.windSpeed?.split(" ")[0] || "0"}
								</span>
								<span className="text-[10px] text-muted-foreground">
									{currentConditions.windDirection || "mph"}
								</span>
							</div>
							<div className="flex flex-col items-center rounded-lg bg-muted/50 p-2">
								<Droplets className="size-4 text-muted-foreground mb-1" />
								<span className="text-sm font-medium">
									{currentConditions.probabilityOfPrecipitation?.value || 0}%
								</span>
								<span className="text-[10px] text-muted-foreground">Rain</span>
							</div>
						</div>
					</div>

					{/* Air Quality */}
					<Separator />
					<div className="p-3">
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
							<Leaf className="size-3" />
							Air Quality
						</div>
						{airQualityLoading ? (
							<div className="flex items-center justify-center py-2">
								<div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
							</div>
						) : airQuality ? (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"size-8 rounded-lg flex items-center justify-center font-bold text-sm",
												airQuality.categoryNumber <= 1
													? "bg-green-500/15 text-green-600"
													: airQuality.categoryNumber === 2
														? "bg-yellow-500/15 text-yellow-600"
														: airQuality.categoryNumber === 3
															? "bg-orange-500/15 text-orange-600"
															: airQuality.categoryNumber === 4
																? "bg-red-500/15 text-red-600"
																: "bg-purple-500/15 text-purple-600"
											)}
										>
											{airQuality.aqi}
										</div>
										<div>
											<div className="text-sm font-medium">{airQuality.category}</div>
											{airQuality.primaryPollutant && (
												<div className="text-[10px] text-muted-foreground">
													Primary: {airQuality.primaryPollutant}
												</div>
											)}
										</div>
									</div>
								</div>
								{airQuality.healthRecommendations?.outdoorWorkers && (
									<p className="text-xs text-muted-foreground leading-relaxed">
										{airQuality.healthRecommendations.outdoorWorkers}
									</p>
								)}
							</div>
						) : (
							<p className="text-xs text-muted-foreground">Air quality data unavailable</p>
						)}
					</div>

					{/* Work Concerns */}
					{workConcerns.length > 0 && (
						<>
							<Separator />
							<div className="p-3">
								<div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
									Outdoor Work Advisory
								</div>
								<div className="space-y-1.5">
									{workConcerns.map((concern) => (
										<div
											key={concern.label}
											className={cn(
												"flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
												concern.severity === "danger"
													? "bg-red-500/10 text-red-600"
													: "bg-orange-500/10 text-orange-600"
											)}
										>
											<AlertTriangle className="size-3.5" />
											{concern.label}
										</div>
									))}
								</div>
							</div>
						</>
					)}

					{/* Hourly Forecast Preview */}
					{currentWeather.hourly?.periods && currentWeather.hourly.periods.length > 1 && (
						<>
							<Separator />
							<div className="p-3">
								<div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
									Next Few Hours
								</div>
								<div className="flex gap-2 overflow-x-auto pb-1">
									{currentWeather.hourly.periods.slice(1, 7).map((period, idx) => {
										const HourIcon = getWeatherIcon(period.shortForecast);
										const hour = new Date(period.startTime).getHours();
										const hourLabel =
											hour === 0
												? "12am"
												: hour < 12
													? `${hour}am`
													: hour === 12
														? "12pm"
														: `${hour - 12}pm`;

										return (
											<div
												key={idx}
												className="flex flex-col items-center shrink-0 rounded-lg bg-muted/30 px-2 py-1.5 min-w-[48px]"
											>
												<span className="text-[10px] text-muted-foreground">
													{hourLabel}
												</span>
												<HourIcon className="size-4 my-1 text-muted-foreground" />
												<span className="text-xs font-medium">
													{period.temperature}°
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</>
					)}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
