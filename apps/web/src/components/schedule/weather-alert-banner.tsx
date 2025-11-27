"use client";

import {
	AlertTriangle,
	Cloud,
	CloudRain,
	CloudSnow,
	Sun,
	Thermometer,
	Wind,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeatherData } from "@/lib/services/weather-service";
import { useWeatherStore } from "@/lib/stores/weather-store";
import { cn } from "@/lib/utils";

type WeatherAlertBannerProps = {
	initialWeather?: WeatherData | null;
	className?: string;
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

// Get severity color
function getSeverityColor(severity: string) {
	switch (severity) {
		case "Extreme":
			return "bg-red-600 text-white border-red-700";
		case "Severe":
			return "bg-orange-500 text-white border-orange-600";
		case "Moderate":
			return "bg-yellow-500 text-black border-yellow-600";
		case "Minor":
			return "bg-blue-500 text-white border-blue-600";
		default:
			return "bg-muted text-foreground border-border";
	}
}

export function WeatherAlertBanner({
	initialWeather,
	className,
}: WeatherAlertBannerProps) {
	const { weather, setWeather, fetchWeather } = useWeatherStore();
	const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
		new Set()
	);

	// Initialize weather from server data
	useEffect(() => {
		if (initialWeather && !weather) {
			setWeather(initialWeather);
		} else if (!weather) {
			fetchWeather();
		}
	}, [initialWeather, weather, setWeather, fetchWeather]);

	const currentWeather = weather;
	if (!currentWeather) return null;

	// Get active alerts that haven't been dismissed
	const activeAlerts = (currentWeather.alerts || []).filter(
		(alert) => !dismissedAlerts.has(alert.headline)
	);

	// Get current conditions
	const currentConditions = currentWeather.hourly?.periods?.[0];
	const WeatherIcon = currentConditions
		? getWeatherIcon(currentConditions.shortForecast)
		: Sun;

	// Dismiss an alert
	const dismissAlert = (headline: string) => {
		setDismissedAlerts((prev) => new Set([...prev, headline]));
	};

	return (
		<div className={cn("space-y-2", className)}>
			{/* Severe Weather Alerts */}
			{activeAlerts.length > 0 && (
				<div className="space-y-2">
					{activeAlerts.map((alert, idx) => (
						<Alert
							key={`${alert.headline}-${idx}`}
							className={cn(
								"relative pr-10",
								alert.severity === "Extreme" || alert.severity === "Severe"
									? "border-destructive bg-destructive/10"
									: "border-warning bg-warning/10"
							)}
						>
							<AlertTriangle className="size-4" />
							<AlertTitle className="flex items-center gap-2">
								{alert.event}
								<Badge
									variant="secondary"
									className={cn("text-xs", getSeverityColor(alert.severity))}
								>
									{alert.severity}
								</Badge>
							</AlertTitle>
							<AlertDescription className="text-sm">
								{alert.headline}
							</AlertDescription>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2 size-6"
								onClick={() => dismissAlert(alert.headline)}
							>
								<X className="size-4" />
								<span className="sr-only">Dismiss alert</span>
							</Button>
						</Alert>
					))}
				</div>
			)}

			{/* Current Conditions Bar */}
			{currentConditions && (
				<TooltipProvider>
					<div className="bg-muted/50 flex items-center gap-4 rounded-lg border px-3 py-2 text-sm">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-2">
									<WeatherIcon className="text-muted-foreground size-4" />
									<span className="font-medium">
										{currentConditions.temperature}°
										{currentConditions.temperatureUnit}
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{currentConditions.shortForecast}</p>
							</TooltipContent>
						</Tooltip>

						<div className="text-muted-foreground flex items-center gap-1">
							<Wind className="size-3" />
							<span>{currentConditions.windSpeed}</span>
						</div>

						<span className="text-muted-foreground">
							{currentConditions.shortForecast}
						</span>

						{/* Outdoor work suitability */}
						{currentConditions.temperature < 32 && (
							<Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
								<Thermometer className="mr-1 size-3" />
								Freezing
							</Badge>
						)}
						{currentConditions.temperature > 95 && (
							<Badge
								variant="secondary"
								className="bg-orange-500/20 text-orange-700 dark:text-orange-300"
							>
								<Thermometer className="mr-1 size-3" />
								Extreme Heat
							</Badge>
						)}
						{(currentConditions.shortForecast.toLowerCase().includes("rain") ||
							currentConditions.shortForecast.toLowerCase().includes("storm")) && (
							<Badge
								variant="secondary"
								className="bg-blue-500/20 text-blue-700 dark:text-blue-300"
							>
								<CloudRain className="mr-1 size-3" />
								Rain Expected
							</Badge>
						)}
					</div>
				</TooltipProvider>
			)}
		</div>
	);
}

// Compact weather indicator for job cards
export function JobWeatherIndicator({
	jobDate,
	className,
}: {
	jobDate: Date;
	className?: string;
}) {
	const { weather } = useWeatherStore();

	if (!weather?.hourly?.periods) return null;

	// Find the forecast for this job's hour
	const jobHour = jobDate.getHours();
	const jobDateStr = jobDate.toDateString();

	const forecast = weather.hourly.periods.find((period) => {
		const periodStart = new Date(period.startTime);
		return (
			periodStart.getHours() === jobHour &&
			periodStart.toDateString() === jobDateStr
		);
	});

	if (!forecast) return null;

	const WeatherIcon = getWeatherIcon(forecast.shortForecast);
	const isBadWeather =
		forecast.shortForecast.toLowerCase().includes("rain") ||
		forecast.shortForecast.toLowerCase().includes("storm") ||
		forecast.shortForecast.toLowerCase().includes("snow") ||
		forecast.temperature < 32 ||
		forecast.temperature > 100;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							"flex items-center gap-1 text-xs",
							isBadWeather ? "text-orange-500 dark:text-orange-400" : "text-muted-foreground",
							className
						)}
					>
						<WeatherIcon className="size-3" />
						<span>
							{forecast.temperature}°{forecast.temperatureUnit.charAt(0)}
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{forecast.shortForecast} - {forecast.temperature}°
						{forecast.temperatureUnit}
					</p>
					<p className="text-muted-foreground text-xs">
						Wind: {forecast.windSpeed} {forecast.windDirection}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
