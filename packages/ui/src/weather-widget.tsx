"use client";

import {
	AlertTriangle,
	ChevronDown,
	ChevronUp,
	Cloud,
	CloudDrizzle,
	CloudFog,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	Droplets,
	Sun,
	Thermometer,
	Wind,
} from "lucide-react";
import type * as React from "react";
import { Badge } from "./badge";
import { cn } from "./utils";

// ============================================================================
// Types
// ============================================================================

export interface WeatherWidgetProps {
	temperature?: number;
	temperatureUnit?: "C" | "F";
	feelsLike?: number;
	condition?: string;
	conditionCode?: string;
	humidity?: number;
	windSpeed?: number;
	windUnit?: "mph" | "km/h" | "m/s";
	uvIndex?: number;
	alerts?: Array<{
		event: string;
		severity: "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
	}>;
	forecast?: Array<{
		day: string;
		high: number;
		low: number;
		condition: string;
		conditionCode?: string;
		precipProbability?: number;
	}>;
	suitableForWork?: boolean;
	workConcern?: string;
	className?: string;
	variant?: "compact" | "default" | "expanded";
	showForecast?: boolean;
	onExpandToggle?: () => void;
}

// ============================================================================
// Weather Icons
// ============================================================================

function WeatherIcon({
	code,
	className,
}: {
	code?: string;
	className?: string;
}) {
	const iconClass = cn("h-8 w-8", className);

	switch (code?.toUpperCase()) {
		case "CLEAR":
		case "SUNNY":
			return <Sun className={cn(iconClass, "text-yellow-500")} />;
		case "MOSTLY_CLEAR":
		case "PARTLY_CLOUDY":
			return <CloudSun className={cn(iconClass, "text-yellow-400")} />;
		case "CLOUDY":
		case "OVERCAST":
			return <Cloud className={cn(iconClass, "text-gray-400")} />;
		case "FOG":
			return <CloudFog className={cn(iconClass, "text-gray-300")} />;
		case "DRIZZLE":
		case "FREEZING_DRIZZLE":
			return <CloudDrizzle className={cn(iconClass, "text-blue-300")} />;
		case "RAIN":
		case "RAIN_SHOWERS":
		case "FREEZING_RAIN":
			return <CloudRain className={cn(iconClass, "text-blue-500")} />;
		case "SNOW":
		case "SNOW_SHOWERS":
		case "SNOW_GRAINS":
			return <CloudSnow className={cn(iconClass, "text-blue-200")} />;
		case "THUNDERSTORM":
			return <CloudLightning className={cn(iconClass, "text-purple-500")} />;
		default:
			return <CloudSun className={cn(iconClass, "text-gray-400")} />;
	}
}

function SmallWeatherIcon({
	code,
	className,
}: {
	code?: string;
	className?: string;
}) {
	return <WeatherIcon code={code} className={cn("h-4 w-4", className)} />;
}

// ============================================================================
// Temperature Display
// ============================================================================

function TemperatureDisplay({
	value,
	unit = "F",
	className,
}: {
	value?: number;
	unit?: "C" | "F";
	className?: string;
}) {
	if (value === undefined) return <span className={className}>--°</span>;

	const displayValue =
		unit === "F" ? Math.round(value * 1.8 + 32) : Math.round(value);

	return (
		<span className={className}>
			{displayValue}°{unit}
		</span>
	);
}

// ============================================================================
// Alert Badge
// ============================================================================

function AlertBadge({ alerts }: { alerts?: WeatherWidgetProps["alerts"] }) {
	if (!alerts || alerts.length === 0) return null;

	const highestSeverity = alerts.reduce((highest, alert) => {
		const severityOrder = ["Extreme", "Severe", "Moderate", "Minor", "Unknown"];
		return severityOrder.indexOf(alert.severity) <
			severityOrder.indexOf(highest)
			? alert.severity
			: highest;
	}, "Unknown" as string);

	const badgeVariant =
		highestSeverity === "Extreme" || highestSeverity === "Severe"
			? "destructive"
			: highestSeverity === "Moderate"
				? "default"
				: "secondary";

	return (
		<Badge variant={badgeVariant} className="gap-1">
			<AlertTriangle className="h-3 w-3" />
			{alerts.length} Alert{alerts.length > 1 ? "s" : ""}
		</Badge>
	);
}

// ============================================================================
// Compact Weather Widget
// ============================================================================

function CompactWeatherWidget({
	temperature,
	temperatureUnit = "F",
	condition,
	conditionCode,
	alerts,
	suitableForWork,
	className,
}: WeatherWidgetProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5",
				!suitableForWork && "border-amber-500/50 bg-amber-500/10",
				className,
			)}
		>
			<WeatherIcon code={conditionCode} className="h-5 w-5" />
			<TemperatureDisplay
				value={temperature}
				unit={temperatureUnit}
				className="font-medium"
			/>
			<span className="text-muted-foreground text-sm truncate max-w-[100px]">
				{condition}
			</span>
			{!suitableForWork && <AlertTriangle className="h-4 w-4 text-amber-500" />}
			{alerts && alerts.length > 0 && <AlertBadge alerts={alerts} />}
		</div>
	);
}

// ============================================================================
// Default Weather Widget
// ============================================================================

function DefaultWeatherWidget({
	temperature,
	temperatureUnit = "F",
	feelsLike,
	condition,
	conditionCode,
	humidity,
	windSpeed,
	windUnit = "mph",
	alerts,
	suitableForWork,
	workConcern,
	className,
}: WeatherWidgetProps) {
	return (
		<div
			className={cn(
				"rounded-xl border bg-card p-4 shadow-sm",
				!suitableForWork && "border-amber-500/50",
				className,
			)}
		>
			{/* Header with alerts */}
			{alerts && alerts.length > 0 && (
				<div className="mb-3 flex flex-wrap gap-2">
					{alerts.slice(0, 2).map((alert, i) => (
						<Badge
							key={i}
							variant={
								alert.severity === "Extreme" || alert.severity === "Severe"
									? "destructive"
									: "secondary"
							}
							className="gap-1"
						>
							<AlertTriangle className="h-3 w-3" />
							{alert.event}
						</Badge>
					))}
				</div>
			)}

			{/* Main weather display */}
			<div className="flex items-center gap-4">
				<WeatherIcon code={conditionCode} className="h-12 w-12" />
				<div className="flex-1">
					<div className="flex items-baseline gap-2">
						<TemperatureDisplay
							value={temperature}
							unit={temperatureUnit}
							className="text-3xl font-bold"
						/>
						{feelsLike !== undefined && (
							<span className="text-muted-foreground text-sm">
								Feels{" "}
								<TemperatureDisplay value={feelsLike} unit={temperatureUnit} />
							</span>
						)}
					</div>
					<p className="text-muted-foreground">{condition}</p>
				</div>
			</div>

			{/* Details row */}
			<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
				{humidity !== undefined && (
					<div className="flex items-center gap-1">
						<Droplets className="h-4 w-4" />
						<span>{Math.round(humidity)}%</span>
					</div>
				)}
				{windSpeed !== undefined && (
					<div className="flex items-center gap-1">
						<Wind className="h-4 w-4" />
						<span>
							{Math.round(windSpeed)} {windUnit}
						</span>
					</div>
				)}
			</div>

			{/* Work suitability warning */}
			{!suitableForWork && workConcern && (
				<div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 p-2 text-sm text-amber-600 dark:text-amber-400">
					<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{workConcern}</span>
				</div>
			)}
		</div>
	);
}

// ============================================================================
// Expanded Weather Widget (with forecast)
// ============================================================================

function ExpandedWeatherWidget({
	temperature,
	temperatureUnit = "F",
	feelsLike,
	condition,
	conditionCode,
	humidity,
	windSpeed,
	windUnit = "mph",
	uvIndex,
	alerts,
	forecast,
	suitableForWork,
	workConcern,
	className,
}: WeatherWidgetProps) {
	return (
		<div
			className={cn(
				"rounded-xl border bg-card shadow-sm",
				!suitableForWork && "border-amber-500/50",
				className,
			)}
		>
			{/* Alerts banner */}
			{alerts && alerts.length > 0 && (
				<div className="border-b bg-destructive/10 p-3">
					<div className="flex flex-wrap gap-2">
						{alerts.map((alert, i) => (
							<div
								key={i}
								className={cn(
									"flex items-center gap-2 text-sm",
									alert.severity === "Extreme" || alert.severity === "Severe"
										? "text-destructive"
										: "text-amber-600 dark:text-amber-400",
								)}
							>
								<AlertTriangle className="h-4 w-4" />
								<span className="font-medium">{alert.event}</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="p-4">
				{/* Main weather display */}
				<div className="flex items-start gap-4">
					<WeatherIcon code={conditionCode} className="h-16 w-16" />
					<div className="flex-1">
						<div className="flex items-baseline gap-3">
							<TemperatureDisplay
								value={temperature}
								unit={temperatureUnit}
								className="text-4xl font-bold"
							/>
							{feelsLike !== undefined && (
								<span className="text-muted-foreground">
									Feels{" "}
									<TemperatureDisplay
										value={feelsLike}
										unit={temperatureUnit}
									/>
								</span>
							)}
						</div>
						<p className="text-lg text-muted-foreground">{condition}</p>
					</div>
				</div>

				{/* Details grid */}
				<div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
					{humidity !== undefined && (
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-blue-500/10 p-2">
								<Droplets className="h-4 w-4 text-blue-500" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Humidity</p>
								<p className="font-medium">{Math.round(humidity)}%</p>
							</div>
						</div>
					)}
					{windSpeed !== undefined && (
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-gray-500/10 p-2">
								<Wind className="h-4 w-4 text-gray-500" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Wind</p>
								<p className="font-medium">
									{Math.round(windSpeed)} {windUnit}
								</p>
							</div>
						</div>
					)}
					{uvIndex !== undefined && (
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-yellow-500/10 p-2">
								<Sun className="h-4 w-4 text-yellow-500" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">UV Index</p>
								<p className="font-medium">{Math.round(uvIndex)}</p>
							</div>
						</div>
					)}
					{feelsLike !== undefined && (
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-red-500/10 p-2">
								<Thermometer className="h-4 w-4 text-red-500" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Feels Like</p>
								<TemperatureDisplay
									value={feelsLike}
									unit={temperatureUnit}
									className="font-medium"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Work suitability */}
				{!suitableForWork && workConcern && (
					<div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
						<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
						<div>
							<p className="font-medium">Weather Advisory</p>
							<p className="text-sm">{workConcern}</p>
						</div>
					</div>
				)}

				{/* 5-day forecast */}
				{forecast && forecast.length > 0 && (
					<div className="mt-4 border-t pt-4">
						<p className="mb-3 text-sm font-medium text-muted-foreground">
							5-Day Forecast
						</p>
						<div className="grid grid-cols-5 gap-2">
							{forecast.slice(0, 5).map((day, i) => (
								<div
									key={i}
									className="flex flex-col items-center rounded-lg bg-muted/50 p-2 text-center"
								>
									<span className="text-xs font-medium">{day.day}</span>
									<SmallWeatherIcon
										code={day.conditionCode}
										className="my-1 h-6 w-6"
									/>
									<div className="text-xs">
										<span className="font-medium">
											{temperatureUnit === "F"
												? Math.round(day.high * 1.8 + 32)
												: Math.round(day.high)}
											°
										</span>
										<span className="text-muted-foreground">
											{" / "}
											{temperatureUnit === "F"
												? Math.round(day.low * 1.8 + 32)
												: Math.round(day.low)}
											°
										</span>
									</div>
									{day.precipProbability !== undefined &&
										day.precipProbability > 0 && (
											<span className="text-xs text-blue-500">
												{Math.round(day.precipProbability)}%
											</span>
										)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// ============================================================================
// Main Weather Widget Export
// ============================================================================

export function WeatherWidget(props: WeatherWidgetProps) {
	const { variant = "default", ...rest } = props;

	switch (variant) {
		case "compact":
			return <CompactWeatherWidget {...rest} />;
		case "expanded":
			return <ExpandedWeatherWidget {...rest} />;
		default:
			return <DefaultWeatherWidget {...rest} />;
	}
}

// ============================================================================
// Weather Strip (for schedule headers)
// ============================================================================

export interface WeatherStripProps {
	days: Array<{
		date: string;
		dayName: string;
		high: number;
		low: number;
		conditionCode?: string;
		precipProbability?: number;
		isBadDay?: boolean;
	}>;
	temperatureUnit?: "C" | "F";
	className?: string;
}

export function WeatherStrip({
	days,
	temperatureUnit = "F",
	className,
}: WeatherStripProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-1 overflow-x-auto rounded-lg border bg-card p-2",
				className,
			)}
		>
			{days.map((day, i) => (
				<div
					key={i}
					className={cn(
						"flex flex-col items-center min-w-[60px] rounded-md px-2 py-1.5 text-center",
						day.isBadDay && "bg-amber-500/10",
					)}
				>
					<span className="text-xs font-medium">{day.dayName}</span>
					<SmallWeatherIcon code={day.conditionCode} className="my-0.5" />
					<div className="text-xs">
						<span className="font-medium">
							{temperatureUnit === "F"
								? Math.round(day.high * 1.8 + 32)
								: Math.round(day.high)}
						</span>
						<span className="text-muted-foreground">
							/
							{temperatureUnit === "F"
								? Math.round(day.low * 1.8 + 32)
								: Math.round(day.low)}
						</span>
					</div>
					{day.precipProbability !== undefined &&
						day.precipProbability > 20 && (
							<div className="flex items-center gap-0.5 text-xs text-blue-500">
								<Droplets className="h-3 w-3" />
								{Math.round(day.precipProbability)}%
							</div>
						)}
					{day.isBadDay && <AlertTriangle className="h-3 w-3 text-amber-500" />}
				</div>
			))}
		</div>
	);
}

// ============================================================================
// Collapsible Weather Card
// ============================================================================

export interface CollapsibleWeatherCardProps extends WeatherWidgetProps {
	isExpanded?: boolean;
	onToggle?: () => void;
}

export function CollapsibleWeatherCard({
	isExpanded = false,
	onToggle,
	...props
}: CollapsibleWeatherCardProps) {
	return (
		<div className="rounded-xl border bg-card shadow-sm">
			{/* Always visible header */}
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between p-3 hover:bg-muted/50"
			>
				<div className="flex items-center gap-3">
					<WeatherIcon code={props.conditionCode} className="h-8 w-8" />
					<div className="text-left">
						<div className="flex items-baseline gap-2">
							<TemperatureDisplay
								value={props.temperature}
								unit={props.temperatureUnit}
								className="text-xl font-bold"
							/>
							<span className="text-sm text-muted-foreground">
								{props.condition}
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{props.alerts && props.alerts.length > 0 && (
						<AlertBadge alerts={props.alerts} />
					)}
					{!props.suitableForWork && (
						<AlertTriangle className="h-4 w-4 text-amber-500" />
					)}
					{isExpanded ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</button>

			{/* Expandable content */}
			{isExpanded && (
				<div className="border-t p-4">
					<DefaultWeatherWidget
						{...props}
						className="border-0 p-0 shadow-none"
					/>
				</div>
			)}
		</div>
	);
}
