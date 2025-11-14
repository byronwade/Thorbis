/**
 * Elevation Service
 *
 * Fetches elevation data from USGS Elevation Point Query Service
 * - Elevation in feet/meters
 * - Useful for drainage, flooding, and foundation assessments
 *
 * API: FREE, no key required
 * Docs: https://nationalmap.gov/epqs/
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

export const ElevationSchema = z.object({
  elevationFeet: z.number(),
  elevationMeters: z.number(),
  dataSource: z.string(),
  enrichedAt: z.string(),
});

export type Elevation = z.infer<typeof ElevationSchema>;

export class ElevationService {
  private cache: Map<string, { data: Elevation; timestamp: number }> =
    new Map();
  private cacheTTL = 1000 * 60 * 60 * 24 * 365; // 1 year (elevation doesn't change)

  async getElevation(lat: number, lon: number): Promise<Elevation | null> {
    const cacheKey = `elevation:${lat.toFixed(6)},${lon.toFixed(6)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      // USGS Elevation Point Query Service
      const url = `https://epqs.nationalmap.gov/v1/json?x=${lon}&y=${lat}&units=Feet&includeDate=false`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        console.warn(`[Elevation] API request failed: ${res.status}`);
        return null;
      }

      const text = await res.text();
      if (!text || text.trim() === "") {
        console.log("[Elevation] API returned empty response");
        return null;
      }

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("[Elevation] Invalid JSON response");
        return null;
      }

      if (!data || typeof data !== "object" || !("value" in data)) {
        console.log("[Elevation] No elevation data available");
        return null;
      }

      const elevationData = data as { value: string };
      if (!elevationData.value) {
        console.log("[Elevation] No elevation data available");
        return null;
      }

      const elevationFeet = Number.parseFloat(elevationData.value);
      const elevationMeters = elevationFeet * 0.3048;

      const elevation: Elevation = {
        elevationFeet: Math.round(elevationFeet),
        elevationMeters: Math.round(elevationMeters * 10) / 10,
        dataSource: "usgs",
        enrichedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, { data: elevation, timestamp: Date.now() });
      console.log(
        `[Elevation] ${elevation.elevationFeet} ft (${elevation.elevationMeters} m)`
      );

      return elevation;
    } catch (error) {
      console.error("[Elevation] Error:", error);
      return null;
    }
  }
}

export const elevationService = new ElevationService();
