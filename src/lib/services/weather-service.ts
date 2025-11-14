/**
 * Weather Service - NWS API Integration
 *
 * Provides weather forecasts and severe weather alerts for job scheduling
 * Uses free National Weather Service API (api.weather.gov)
 *
 * Features:
 * - 7-day forecast
 * - Hourly forecast
 * - Active weather alerts
 * - Severe weather notifications
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

export const WeatherAlertSchema = z.object({
  event: z.string(),
  headline: z.string(),
  description: z.string(),
  severity: z.enum(["Extreme", "Severe", "Moderate", "Minor", "Unknown"]),
  urgency: z.enum(["Immediate", "Expected", "Future", "Past", "Unknown"]),
  onset: z.string().optional(),
  expires: z.string().optional(),
  instruction: z.string().nullable().optional(),
});

export const WeatherPeriodSchema = z.object({
  number: z.number(),
  name: z.string(),
  temperature: z.number(),
  temperatureUnit: z.string(),
  windSpeed: z.string(),
  windDirection: z.string(),
  shortForecast: z.string(),
  detailedForecast: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const WeatherDataSchema = z.object({
  location: z.object({
    lat: z.number(),
    lon: z.number(),
    gridId: z.string().optional(),
    gridX: z.number().optional(),
    gridY: z.number().optional(),
  }),
  forecast: z
    .object({
      periods: z.array(WeatherPeriodSchema),
      updated: z.string().optional(), // Made optional as API doesn't always return it
    })
    .optional(),
  hourly: z
    .object({
      periods: z.array(WeatherPeriodSchema),
      updated: z.string().optional(), // Made optional as API doesn't always return it
    })
    .optional(),
  alerts: z.array(WeatherAlertSchema),
  hasActiveAlerts: z.boolean(),
  highestSeverity: z.enum(["Extreme", "Severe", "Moderate", "Minor", "None"]),
  enrichedAt: z.string(),
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;
export type WeatherPeriod = z.infer<typeof WeatherPeriodSchema>;

// ============================================================================
// Weather Service
// ============================================================================

export class WeatherService {
  private cache: Map<string, { data: WeatherData; timestamp: number }> =
    new Map();
  private cacheTTL = 1000 * 60 * 30; // 30 minutes

  /**
   * Get complete weather data for a location
   */
  async getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      // Step 1: Get NWS grid point metadata
      const pointsRes = await fetch(
        `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
        {
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/geo+json",
          },
        }
      );

      if (!pointsRes.ok) {
        console.error(`NWS points API failed: ${pointsRes.status}`);
        return null;
      }

      const pointsData = await pointsRes.json();
      const properties = pointsData.properties;

      // Step 2: Fetch forecast, hourly, and alerts in parallel
      const [forecastData, hourlyData, alertsData] = await Promise.all([
        properties.forecast
          ? this.fetchJson(properties.forecast)
          : Promise.resolve(null),
        properties.forecastHourly
          ? this.fetchJson(properties.forecastHourly)
          : Promise.resolve(null),
        this.fetchJson(
          `https://api.weather.gov/alerts/active?point=${lat},${lon}`
        ),
      ]);

      // Parse alerts
      const alerts: WeatherAlert[] = [];
      let highestSeverity: WeatherData["highestSeverity"] = "None";

      if (alertsData?.features) {
        for (const feature of alertsData.features) {
          const props = feature.properties;
          const alert: WeatherAlert = {
            event: props.event || "Unknown Event",
            headline: props.headline || "",
            description: props.description || "",
            severity: this.normalizeSeverity(props.severity),
            urgency: this.normalizeUrgency(props.urgency),
            onset: props.onset,
            expires: props.expires,
            instruction: props.instruction,
          };
          alerts.push(alert);

          // Track highest severity
          if (
            alert.severity !== "Unknown" &&
            this.severityRank(alert.severity) >
              this.severityRank(highestSeverity)
          ) {
            highestSeverity = alert.severity as WeatherData["highestSeverity"];
          }
        }
      }

      const weatherData: WeatherData = {
        location: {
          lat,
          lon,
          gridId: properties.gridId,
          gridX: properties.gridX,
          gridY: properties.gridY,
        },
        forecast: forecastData
          ? {
              periods: forecastData.properties.periods.map((p: any) => ({
                number: p.number,
                name: p.name,
                temperature: p.temperature,
                temperatureUnit: p.temperatureUnit,
                windSpeed: p.windSpeed,
                windDirection: p.windDirection,
                shortForecast: p.shortForecast,
                detailedForecast: p.detailedForecast,
                startTime: p.startTime,
                endTime: p.endTime,
              })),
              updated:
                forecastData.properties.updated ||
                forecastData.properties.generatedAt,
            }
          : undefined,
        hourly: hourlyData
          ? {
              periods: hourlyData.properties.periods
                .slice(0, 24)
                .map((p: any) => ({
                  number: p.number,
                  name: p.name,
                  temperature: p.temperature,
                  temperatureUnit: p.temperatureUnit,
                  windSpeed: p.windSpeed,
                  windDirection: p.windDirection,
                  shortForecast: p.shortForecast,
                  detailedForecast: p.detailedForecast,
                  startTime: p.startTime,
                  endTime: p.endTime,
                })),
              updated:
                hourlyData.properties.updated ||
                hourlyData.properties.generatedAt,
            }
          : undefined,
        alerts,
        hasActiveAlerts: alerts.length > 0,
        highestSeverity,
        enrichedAt: new Date().toISOString(),
      };

      // Cache the result
      this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

      return WeatherDataSchema.parse(weatherData);
    } catch (error) {
      console.error("Weather service error:", error);
      return null;
    }
  }

  /**
   * Get only active alerts for a location (faster)
   */
  async getActiveAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    try {
      const alertsData = await this.fetchJson(
        `https://api.weather.gov/alerts/active?point=${lat},${lon}`
      );

      if (!alertsData?.features) {
        return [];
      }

      return alertsData.features.map((feature: any) => ({
        event: feature.properties.event || "Unknown Event",
        headline: feature.properties.headline || "",
        description: feature.properties.description || "",
        severity: this.normalizeSeverity(feature.properties.severity),
        urgency: this.normalizeUrgency(feature.properties.urgency),
        onset: feature.properties.onset,
        expires: feature.properties.expires,
        instruction: feature.properties.instruction,
      }));
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return [];
    }
  }

  /**
   * Check if weather is suitable for outdoor work
   */
  isSuitableForOutdoorWork(weather: WeatherData): {
    suitable: boolean;
    reason?: string;
  } {
    // Check for severe weather alerts
    if (
      weather.highestSeverity === "Extreme" ||
      weather.highestSeverity === "Severe"
    ) {
      return {
        suitable: false,
        reason: "Severe weather alert in effect",
      };
    }

    // Check current/upcoming conditions
    if (weather.hourly?.periods?.[0]) {
      const current = weather.hourly.periods[0];

      // Check for precipitation
      if (
        current.shortForecast.toLowerCase().includes("rain") ||
        current.shortForecast.toLowerCase().includes("storm") ||
        current.shortForecast.toLowerCase().includes("snow")
      ) {
        return {
          suitable: false,
          reason: `${current.shortForecast} expected`,
        };
      }

      // Check for extreme temperatures
      if (current.temperature < 32) {
        return {
          suitable: false,
          reason: "Freezing temperatures",
        };
      }

      if (current.temperature > 100) {
        return {
          suitable: false,
          reason: "Extreme heat",
        };
      }
    }

    return { suitable: true };
  }

  /**
   * Helper to fetch JSON with proper headers
   */
  private async fetchJson(url: string): Promise<any> {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/geo+json",
      },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${url}`);
    }

    return res.json();
  }

  /**
   * Normalize severity values
   */
  private normalizeSeverity(
    severity: string | undefined
  ): WeatherAlert["severity"] {
    if (!severity) return "Unknown";
    const s = severity.toLowerCase();
    if (s.includes("extreme")) return "Extreme";
    if (s.includes("severe")) return "Severe";
    if (s.includes("moderate")) return "Moderate";
    if (s.includes("minor")) return "Minor";
    return "Unknown";
  }

  /**
   * Normalize urgency values
   */
  private normalizeUrgency(
    urgency: string | undefined
  ): WeatherAlert["urgency"] {
    if (!urgency) return "Unknown";
    const u = urgency.toLowerCase();
    if (u.includes("immediate")) return "Immediate";
    if (u.includes("expected")) return "Expected";
    if (u.includes("future")) return "Future";
    if (u.includes("past")) return "Past";
    return "Unknown";
  }

  /**
   * Get numeric rank for severity comparison
   */
  private severityRank(severity: string): number {
    switch (severity) {
      case "Extreme":
        return 4;
      case "Severe":
        return 3;
      case "Moderate":
        return 2;
      case "Minor":
        return 1;
      default:
        return 0;
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
export const weatherService = new WeatherService();
