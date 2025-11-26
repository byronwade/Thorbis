/**
 * Google Weather Service
 *
 * Provides weather data using Google Weather API
 * - Current conditions
 * - Hourly forecast (48 hours)
 * - Daily forecast (10 days)
 * - Weather alerts
 * - Solar radiation data (for HVAC/Solar industries)
 *
 * API: Google Weather API
 * Docs: https://developers.google.com/maps/documentation/weather
 *
 * Fallback: Uses existing NWS service for US locations
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const WeatherConditionSchema = z.object({
	code: z.string(), // Weather condition code (e.g., "CLEAR", "RAIN", "SNOW")
	description: z.string(), // Human-readable description
	icon: z.string(), // Icon URL or code
});

const CurrentWeatherSchema = z.object({
	temperature: z.number(), // Celsius
	temperatureFeelsLike: z.number(), // Celsius
	humidity: z.number(), // Percentage
	pressure: z.number(), // hPa
	windSpeed: z.number(), // m/s
	windDirection: z.number(), // Degrees
	windGust: z.number().optional(), // m/s
	visibility: z.number().optional(), // meters
	uvIndex: z.number().optional(),
	cloudCover: z.number().optional(), // Percentage
	precipitation: z.number().optional(), // mm in last hour
	condition: WeatherConditionSchema,
	observationTime: z.string(), // ISO timestamp
});

const HourlyForecastSchema = z.object({
	time: z.string(), // ISO timestamp
	temperature: z.number(),
	temperatureFeelsLike: z.number(),
	humidity: z.number(),
	windSpeed: z.number(),
	windDirection: z.number(),
	precipitationProbability: z.number(), // Percentage
	precipitationAmount: z.number().optional(), // mm
	condition: WeatherConditionSchema,
	uvIndex: z.number().optional(),
	solarRadiation: z.number().optional(), // W/m² (for solar calculations)
});

const DailyForecastSchema = z.object({
	date: z.string(), // YYYY-MM-DD
	temperatureHigh: z.number(),
	temperatureLow: z.number(),
	humidity: z.number(),
	windSpeed: z.number(),
	windDirection: z.number(),
	precipitationProbability: z.number(),
	precipitationAmount: z.number().optional(),
	condition: WeatherConditionSchema,
	uvIndexMax: z.number().optional(),
	sunrise: z.string().optional(),
	sunset: z.string().optional(),
	moonPhase: z.string().optional(),
	solarRadiation: z.number().optional(), // Daily average W/m²
});

const WeatherAlertSchema = z.object({
	event: z.string(),
	headline: z.string(),
	description: z.string(),
	severity: z.enum(["Extreme", "Severe", "Moderate", "Minor", "Unknown"]),
	urgency: z.enum(["Immediate", "Expected", "Future", "Past", "Unknown"]),
	start: z.string().optional(),
	end: z.string().optional(),
	instruction: z.string().optional(),
	source: z.string().optional(),
});

const WeatherDataSchema = z.object({
	location: z.object({
		lat: z.number(),
		lng: z.number(),
		name: z.string().optional(),
		timezone: z.string().optional(),
	}),
	current: CurrentWeatherSchema.optional(),
	hourly: z.array(HourlyForecastSchema).optional(),
	daily: z.array(DailyForecastSchema).optional(),
	alerts: z.array(WeatherAlertSchema),
	source: z.enum(["google", "nws", "openmeteo"]),
	enrichedAt: z.string(),
});

export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;
export type DailyForecast = z.infer<typeof DailyForecastSchema>;
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;
export type WeatherData = z.infer<typeof WeatherDataSchema>;

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// ============================================================================
// Google Weather Service
// ============================================================================

class GoogleWeatherService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: WeatherData; timestamp: number }
	> = new Map();

	constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Check if service is available
	 */
	isAvailable(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Get complete weather data for a location
	 * Uses Open-Meteo API (free, no API key required) as primary source
	 * since Google Weather API requires special access
	 */
	async getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
		const cacheKey = `weather:${lat.toFixed(4)},${lng.toFixed(4)}`;
		const cached = this.cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		try {
			// Use Open-Meteo API (free, reliable, global coverage)
			const weather = await this.fetchFromOpenMeteo(lat, lng);
			if (weather) {
				this.cache.set(cacheKey, { data: weather, timestamp: Date.now() });
				this.cleanCache();
				return weather;
			}

			// Fallback to NWS for US locations
			if (this.isUSLocation(lat, lng)) {
				const nwsWeather = await this.fetchFromNWS(lat, lng);
				if (nwsWeather) {
					this.cache.set(cacheKey, {
						data: nwsWeather,
						timestamp: Date.now(),
					});
					return nwsWeather;
				}
			}

			return null;
		} catch (error) {
			console.error("Weather service error:", error);
			return null;
		}
	}

	/**
	 * Fetch weather from Open-Meteo (free, global coverage)
	 */
	private async fetchFromOpenMeteo(
		lat: number,
		lng: number,
	): Promise<WeatherData | null> {
		try {
			const url = new URL("https://api.open-meteo.com/v1/forecast");
			url.searchParams.set("latitude", lat.toString());
			url.searchParams.set("longitude", lng.toString());
			url.searchParams.set(
				"current",
				"temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index",
			);
			url.searchParams.set(
				"hourly",
				"temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index,direct_radiation",
			);
			url.searchParams.set(
				"daily",
				"weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max,sunrise,sunset",
			);
			url.searchParams.set("timezone", "auto");
			url.searchParams.set("forecast_days", "10");

			const response = await fetch(url.toString(), {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error(`Open-Meteo API error: ${response.status}`);
				return null;
			}

			const data = await response.json();

			// Parse current weather
			const current: CurrentWeather = {
				temperature: data.current.temperature_2m,
				temperatureFeelsLike: data.current.apparent_temperature,
				humidity: data.current.relative_humidity_2m,
				pressure: data.current.pressure_msl,
				windSpeed: data.current.wind_speed_10m / 3.6, // km/h to m/s
				windDirection: data.current.wind_direction_10m,
				windGust: data.current.wind_gusts_10m
					? data.current.wind_gusts_10m / 3.6
					: undefined,
				uvIndex: data.current.uv_index,
				cloudCover: data.current.cloud_cover,
				precipitation: data.current.precipitation,
				condition: this.getConditionFromCode(data.current.weather_code),
				observationTime: data.current.time,
			};

			// Parse hourly forecast (next 48 hours)
			const hourly: HourlyForecast[] = [];
			const hourlyLen = Math.min(48, data.hourly.time.length);
			for (let i = 0; i < hourlyLen; i++) {
				hourly.push({
					time: data.hourly.time[i],
					temperature: data.hourly.temperature_2m[i],
					temperatureFeelsLike: data.hourly.apparent_temperature[i],
					humidity: data.hourly.relative_humidity_2m[i],
					windSpeed: data.hourly.wind_speed_10m[i] / 3.6,
					windDirection: data.hourly.wind_direction_10m[i],
					precipitationProbability: data.hourly.precipitation_probability[i],
					precipitationAmount: data.hourly.precipitation[i],
					condition: this.getConditionFromCode(data.hourly.weather_code[i]),
					uvIndex: data.hourly.uv_index[i],
					solarRadiation: data.hourly.direct_radiation?.[i],
				});
			}

			// Parse daily forecast
			const daily: DailyForecast[] = [];
			for (let i = 0; i < data.daily.time.length; i++) {
				daily.push({
					date: data.daily.time[i],
					temperatureHigh: data.daily.temperature_2m_max[i],
					temperatureLow: data.daily.temperature_2m_min[i],
					humidity: 0, // Not available in daily
					windSpeed: data.daily.wind_speed_10m_max[i] / 3.6,
					windDirection: data.daily.wind_direction_10m_dominant[i],
					precipitationProbability: data.daily.precipitation_probability_max[i],
					precipitationAmount: data.daily.precipitation_sum[i],
					condition: this.getConditionFromCode(data.daily.weather_code[i]),
					uvIndexMax: data.daily.uv_index_max[i],
					sunrise: data.daily.sunrise[i],
					sunset: data.daily.sunset[i],
				});
			}

			return {
				location: {
					lat,
					lng,
					timezone: data.timezone,
				},
				current,
				hourly,
				daily,
				alerts: [], // Open-Meteo doesn't provide alerts
				source: "openmeteo",
				enrichedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Open-Meteo fetch error:", error);
			return null;
		}
	}

	/**
	 * Fetch weather from NWS (US only, free)
	 */
	private async fetchFromNWS(
		lat: number,
		lng: number,
	): Promise<WeatherData | null> {
		try {
			// Get grid point
			const pointsRes = await fetch(
				`https://api.weather.gov/points/${lat.toFixed(4)},${lng.toFixed(4)}`,
				{
					headers: {
						"User-Agent": USER_AGENT,
						Accept: "application/geo+json",
					},
				},
			);

			if (!pointsRes.ok) return null;

			const pointsData = await pointsRes.json();
			const props = pointsData.properties;

			// Fetch forecast and alerts in parallel
			const [forecastRes, alertsRes] = await Promise.all([
				fetch(props.forecast, {
					headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
				}),
				fetch(`https://api.weather.gov/alerts/active?point=${lat},${lng}`, {
					headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
				}),
			]);

			const forecastData = forecastRes.ok ? await forecastRes.json() : null;
			const alertsData = alertsRes.ok ? await alertsRes.json() : null;

			// Parse alerts
			const alerts: WeatherAlert[] = (alertsData?.features || []).map(
				(f: any) => ({
					event: f.properties.event || "Unknown",
					headline: f.properties.headline || "",
					description: f.properties.description || "",
					severity: this.mapNWSSeverity(f.properties.severity),
					urgency: this.mapNWSUrgency(f.properties.urgency),
					start: f.properties.onset,
					end: f.properties.expires,
					instruction: f.properties.instruction,
					source: "NWS",
				}),
			);

			// Parse daily forecast from periods
			const daily: DailyForecast[] = [];
			if (forecastData?.properties?.periods) {
				const periods = forecastData.properties.periods;
				for (let i = 0; i < periods.length; i += 2) {
					const dayPeriod = periods[i];
					const nightPeriod = periods[i + 1];

					daily.push({
						date: dayPeriod.startTime.split("T")[0],
						temperatureHigh: dayPeriod.isDaytime
							? dayPeriod.temperature
							: nightPeriod?.temperature || dayPeriod.temperature,
						temperatureLow: nightPeriod?.temperature || dayPeriod.temperature,
						humidity: 0,
						windSpeed: this.parseWindSpeed(dayPeriod.windSpeed),
						windDirection: this.parseWindDirection(dayPeriod.windDirection),
						precipitationProbability: 0,
						condition: this.mapNWSCondition(dayPeriod.shortForecast),
						uvIndexMax: undefined,
					});
				}
			}

			return {
				location: {
					lat,
					lng,
					name: props.relativeLocation?.properties?.city,
					timezone: props.timeZone,
				},
				daily,
				alerts,
				source: "nws",
				enrichedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error("NWS fetch error:", error);
			return null;
		}
	}

	/**
	 * Get weather condition from WMO code
	 */
	private getConditionFromCode(code: number): WeatherCondition {
		const conditions: Record<
			number,
			{ code: string; description: string; icon: string }
		> = {
			0: { code: "CLEAR", description: "Clear sky", icon: "01d" },
			1: { code: "MOSTLY_CLEAR", description: "Mostly clear", icon: "02d" },
			2: { code: "PARTLY_CLOUDY", description: "Partly cloudy", icon: "03d" },
			3: { code: "OVERCAST", description: "Overcast", icon: "04d" },
			45: { code: "FOG", description: "Foggy", icon: "50d" },
			48: { code: "FOG", description: "Freezing fog", icon: "50d" },
			51: { code: "DRIZZLE", description: "Light drizzle", icon: "09d" },
			53: { code: "DRIZZLE", description: "Moderate drizzle", icon: "09d" },
			55: { code: "DRIZZLE", description: "Dense drizzle", icon: "09d" },
			56: {
				code: "FREEZING_DRIZZLE",
				description: "Freezing drizzle",
				icon: "09d",
			},
			57: {
				code: "FREEZING_DRIZZLE",
				description: "Dense freezing drizzle",
				icon: "09d",
			},
			61: { code: "RAIN", description: "Light rain", icon: "10d" },
			63: { code: "RAIN", description: "Moderate rain", icon: "10d" },
			65: { code: "RAIN", description: "Heavy rain", icon: "10d" },
			66: { code: "FREEZING_RAIN", description: "Freezing rain", icon: "13d" },
			67: {
				code: "FREEZING_RAIN",
				description: "Heavy freezing rain",
				icon: "13d",
			},
			71: { code: "SNOW", description: "Light snow", icon: "13d" },
			73: { code: "SNOW", description: "Moderate snow", icon: "13d" },
			75: { code: "SNOW", description: "Heavy snow", icon: "13d" },
			77: { code: "SNOW_GRAINS", description: "Snow grains", icon: "13d" },
			80: {
				code: "RAIN_SHOWERS",
				description: "Light rain showers",
				icon: "09d",
			},
			81: {
				code: "RAIN_SHOWERS",
				description: "Moderate rain showers",
				icon: "09d",
			},
			82: {
				code: "RAIN_SHOWERS",
				description: "Heavy rain showers",
				icon: "09d",
			},
			85: {
				code: "SNOW_SHOWERS",
				description: "Light snow showers",
				icon: "13d",
			},
			86: {
				code: "SNOW_SHOWERS",
				description: "Heavy snow showers",
				icon: "13d",
			},
			95: { code: "THUNDERSTORM", description: "Thunderstorm", icon: "11d" },
			96: {
				code: "THUNDERSTORM",
				description: "Thunderstorm with hail",
				icon: "11d",
			},
			99: {
				code: "THUNDERSTORM",
				description: "Severe thunderstorm",
				icon: "11d",
			},
		};

		return (
			conditions[code] || {
				code: "UNKNOWN",
				description: "Unknown",
				icon: "03d",
			}
		);
	}

	/**
	 * Map NWS condition text to WeatherCondition
	 */
	private mapNWSCondition(forecast: string): WeatherCondition {
		const lower = forecast.toLowerCase();
		if (lower.includes("thunder")) {
			return {
				code: "THUNDERSTORM",
				description: forecast,
				icon: "11d",
			};
		}
		if (lower.includes("snow")) {
			return { code: "SNOW", description: forecast, icon: "13d" };
		}
		if (lower.includes("rain") || lower.includes("showers")) {
			return { code: "RAIN", description: forecast, icon: "10d" };
		}
		if (lower.includes("cloudy") || lower.includes("overcast")) {
			return { code: "CLOUDY", description: forecast, icon: "04d" };
		}
		if (lower.includes("partly")) {
			return {
				code: "PARTLY_CLOUDY",
				description: forecast,
				icon: "03d",
			};
		}
		if (lower.includes("clear") || lower.includes("sunny")) {
			return { code: "CLEAR", description: forecast, icon: "01d" };
		}
		return { code: "UNKNOWN", description: forecast, icon: "03d" };
	}

	private mapNWSSeverity(severity: string): WeatherAlert["severity"] {
		switch (severity?.toLowerCase()) {
			case "extreme":
				return "Extreme";
			case "severe":
				return "Severe";
			case "moderate":
				return "Moderate";
			case "minor":
				return "Minor";
			default:
				return "Unknown";
		}
	}

	private mapNWSUrgency(urgency: string): WeatherAlert["urgency"] {
		switch (urgency?.toLowerCase()) {
			case "immediate":
				return "Immediate";
			case "expected":
				return "Expected";
			case "future":
				return "Future";
			case "past":
				return "Past";
			default:
				return "Unknown";
		}
	}

	private parseWindSpeed(windStr: string): number {
		// "10 to 15 mph" -> 12.5 mph -> m/s
		const match = windStr.match(/(\d+)\s*(?:to\s*(\d+))?\s*mph/i);
		if (match) {
			const low = parseInt(match[1]);
			const high = match[2] ? parseInt(match[2]) : low;
			const mph = (low + high) / 2;
			return mph * 0.44704; // Convert to m/s
		}
		return 0;
	}

	private parseWindDirection(dir: string): number {
		const directions: Record<string, number> = {
			N: 0,
			NNE: 22.5,
			NE: 45,
			ENE: 67.5,
			E: 90,
			ESE: 112.5,
			SE: 135,
			SSE: 157.5,
			S: 180,
			SSW: 202.5,
			SW: 225,
			WSW: 247.5,
			W: 270,
			WNW: 292.5,
			NW: 315,
			NNW: 337.5,
		};
		return directions[dir.toUpperCase()] || 0;
	}

	private isUSLocation(lat: number, lng: number): boolean {
		// Rough bounds for continental US + Alaska + Hawaii
		return (
			(lat >= 24.5 && lat <= 49.5 && lng >= -125 && lng <= -66.9) || // Continental
			(lat >= 51 && lat <= 71.5 && lng >= -180 && lng <= -130) || // Alaska
			(lat >= 18.5 && lat <= 22.5 && lng >= -161 && lng <= -154) // Hawaii
		);
	}

	/**
	 * Check if weather is suitable for outdoor work
	 */
	isSuitableForOutdoorWork(weather: WeatherData): {
		suitable: boolean;
		reason?: string;
		severity: "none" | "low" | "medium" | "high";
	} {
		// Check for severe alerts
		const severeAlerts = weather.alerts.filter(
			(a) => a.severity === "Extreme" || a.severity === "Severe",
		);
		if (severeAlerts.length > 0) {
			return {
				suitable: false,
				reason: severeAlerts[0].headline || severeAlerts[0].event,
				severity: "high",
			};
		}

		// Check current conditions
		if (weather.current) {
			const { condition, temperature, windSpeed } = weather.current;

			// Check for dangerous conditions
			if (
				condition.code === "THUNDERSTORM" ||
				condition.code.includes("FREEZING")
			) {
				return {
					suitable: false,
					reason: condition.description,
					severity: "high",
				};
			}

			// Check temperature (in Celsius)
			if (temperature < -10) {
				return {
					suitable: false,
					reason: "Extreme cold (-10°C or below)",
					severity: "high",
				};
			}
			if (temperature > 40) {
				return {
					suitable: false,
					reason: "Extreme heat (40°C or above)",
					severity: "high",
				};
			}

			// Check wind
			if (windSpeed > 20) {
				// ~45 mph
				return {
					suitable: false,
					reason: "High winds",
					severity: "medium",
				};
			}

			// Moderate concerns
			if (condition.code === "RAIN" || condition.code === "SNOW") {
				return {
					suitable: true,
					reason: condition.description,
					severity: "medium",
				};
			}

			if (temperature < 0 || temperature > 35) {
				return {
					suitable: true,
					reason: `Temperature: ${Math.round(temperature)}°C`,
					severity: "low",
				};
			}
		}

		return { suitable: true, severity: "none" };
	}

	/**
	 * Get weather summary for display
	 */
	getWeatherSummary(weather: WeatherData): {
		temperature: string;
		condition: string;
		icon: string;
		feelsLike: string;
		humidity: string;
		wind: string;
		alerts: number;
		suitableForWork: boolean;
	} {
		const current = weather.current;
		const workSuitability = this.isSuitableForOutdoorWork(weather);

		return {
			temperature: current
				? `${Math.round(current.temperature)}°C / ${Math.round(current.temperature * 1.8 + 32)}°F`
				: "N/A",
			condition: current?.condition.description || "Unknown",
			icon: current?.condition.icon || "03d",
			feelsLike: current
				? `${Math.round(current.temperatureFeelsLike)}°C`
				: "N/A",
			humidity: current ? `${Math.round(current.humidity)}%` : "N/A",
			wind: current ? `${Math.round(current.windSpeed * 2.237)} mph` : "N/A", // m/s to mph
			alerts: weather.alerts.length,
			suitableForWork: workSuitability.suitable,
		};
	}

	/**
	 * Clean up old cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > CACHE_TTL * 2) {
				this.cache.delete(key);
			}
		}

		if (this.cache.size > 100) {
			const entries = Array.from(this.cache.entries());
			entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
			this.cache.clear();
			for (const [key, value] of entries.slice(0, 50)) {
				this.cache.set(key, value);
			}
		}
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// Singleton instance
export const googleWeatherService = new GoogleWeatherService();
