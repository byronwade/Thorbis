/**
 * Location Services
 *
 * Provides location intelligence:
 * - Geocoding (address to lat/lon)
 * - Reverse geocoding (lat/lon to address)
 * - County/FIPS data for permit requirements
 * - Flood zone risk assessment
 *
 * APIs Used:
 * - Nominatim (OSM) for geocoding
 * - FCC Census Block API for county/FIPS
 * - FEMA NFHL for flood zones
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

export const GeocodingResultSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  displayName: z.string(),
  address: z
    .object({
      house_number: z.string().optional(),
      road: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postcode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const CountyDataSchema = z.object({
  countyFips: z.string(),
  countyName: z.string(),
  stateFips: z.string(),
  stateCode: z.string(),
  blockFips: z.string().optional(),
});

export const FloodZoneSchema = z.object({
  inFloodZone: z.boolean(),
  zone: z.string().optional(),
  floodway: z.boolean().optional(),
  riskLevel: z.enum(["high", "moderate", "minimal", "unknown"]),
  description: z.string(),
});

export const LocationIntelligenceSchema = z.object({
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  county: CountyDataSchema.optional(),
  floodZone: FloodZoneSchema.optional(),
  enrichedAt: z.string(),
});

export type GeocodingResult = z.infer<typeof GeocodingResultSchema>;
export type CountyData = z.infer<typeof CountyDataSchema>;
export type FloodZone = z.infer<typeof FloodZoneSchema>;
export type LocationIntelligence = z.infer<typeof LocationIntelligenceSchema>;

// ============================================================================
// Location Services
// ============================================================================

export class LocationServices {
  private readonly cache: Map<string, { data: any; timestamp: number }> =
    new Map();
  private readonly cacheTTL = 1000 * 60 * 60 * 24 * 7; // 7 days

  /**
   * Geocode using Google Geocoding API (more accurate than Nominatim)
   */
  private async geocodeWithGoogle(
    address: string
  ): Promise<GeocodingResult | null> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return null;
    }

    try {
      const params = new URLSearchParams({
        address,
        key: apiKey,
      });

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params}`,
        {
          signal: AbortSignal.timeout(10_000), // 10 second timeout
        }
      );

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        return null;
      }

      const first = data.results[0];
      const location = first.geometry.location;

      // Parse address components
      const addressComponents = first.address_components || [];
      const getComponent = (type: string) =>
        addressComponents.find((c: any) => c.types.includes(type))?.long_name;
      const getComponentShort = (type: string) =>
        addressComponents.find((c: any) => c.types.includes(type))?.short_name;

      const result: GeocodingResult = {
        lat: location.lat,
        lon: location.lng,
        displayName: first.formatted_address,
        address: {
          house_number: getComponent("street_number"),
          road: getComponent("route"),
          city:
            getComponent("locality") ||
            getComponent("sublocality") ||
            getComponent("postal_town"),
          state: getComponentShort("administrative_area_level_1"),
          postcode: getComponent("postal_code"),
          country: getComponent("country"),
        },
      };
      return GeocodingResultSchema.parse(result);
    } catch (error: any) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
      } else {
      }
      return null;
    }
  }

  /**
   * Geocode using Nominatim (OpenStreetMap) - fallback option
   */
  private async geocodeWithNominatim(
    address: string
  ): Promise<GeocodingResult | null> {
    try {
      const params = new URLSearchParams({
        q: address,
        format: "jsonv2",
        addressdetails: "1",
        limit: "1",
      });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: { "User-Agent": USER_AGENT },
          signal: AbortSignal.timeout(15_000), // 15 second timeout
        }
      );

      if (!res.ok) {
        if (res.status === 429) {
        }

        return null;
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const first = data[0];
      const result: GeocodingResult = {
        lat: Number.parseFloat(first.lat),
        lon: Number.parseFloat(first.lon),
        displayName: first.display_name,
        address: first.address
          ? {
              house_number: first.address.house_number,
              road: first.address.road,
              city:
                first.address.city ||
                first.address.town ||
                first.address.village,
              state: first.address.state,
              postcode: first.address.postcode,
              country: first.address.country,
            }
          : undefined,
      };
      return GeocodingResultSchema.parse(result);
    } catch (error: any) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
      } else {
      }
      return null;
    }
  }

  /**
   * Geocode an address to coordinates
   * Tries Google first (more accurate), falls back to Nominatim
   */
  async geocode(address: string): Promise<GeocodingResult | null> {
    const cacheKey = `geocode:${address}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    // Try Google first (more accurate for US addresses)
    let result = await this.geocodeWithGoogle(address);

    // Fall back to Nominatim if Google fails
    if (!result) {
      result = await this.geocodeWithNominatim(address);
    }

    if (result) {
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return result;
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<GeocodingResult | null> {
    const cacheKey = `reverse:${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: "jsonv2",
        addressdetails: "1",
      });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`,
        {
          headers: { "User-Agent": USER_AGENT },
        }
      );

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      const result: GeocodingResult = {
        lat: Number.parseFloat(data.lat),
        lon: Number.parseFloat(data.lon),
        displayName: data.display_name,
        address: data.address
          ? {
              house_number: data.address.house_number,
              road: data.address.road,
              city:
                data.address.city || data.address.town || data.address.village,
              state: data.address.state,
              postcode: data.address.postcode,
              country: data.address.country,
            }
          : undefined,
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return GeocodingResultSchema.parse(result);
    } catch (_error) {
      return null;
    }
  }

  /**
   * Get county and FIPS data from coordinates
   */
  async getCountyData(lat: number, lon: number): Promise<CountyData | null> {
    const cacheKey = `county:${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const url = `https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      const result: CountyData = {
        countyFips: data.County?.FIPS || "",
        countyName: data.County?.name || "",
        stateFips: data.State?.FIPS || "",
        stateCode: data.State?.code || "",
        blockFips: data.Block?.FIPS,
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return CountyDataSchema.parse(result);
    } catch (_error) {
      return null;
    }
  }

  /**
   * Check if location is in a flood zone
   */
  async getFloodZoneData(lat: number, lon: number): Promise<FloodZone | null> {
    const cacheKey = `flood:${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const params = new URLSearchParams({
        f: "json",
        geometry: JSON.stringify({
          x: lon,
          y: lat,
          spatialReference: { wkid: 4326 },
        }),
        geometryType: "esriGeometryPoint",
        sr: "4326",
        layers: "all:28",
        tolerance: "1",
        mapExtent: `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`,
        imageDisplay: "800,600,96",
        returnGeometry: "false",
      });

      const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/identify?${params.toString()}`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        // 404 just means no flood zone data available for this location (expected)
        if (res.status === 404) {
        } else {
        }
        return null;
      }

      const data = await res.json();
      const features: any[] = data.results || [];

      // Check for Special Flood Hazard Area
      const floodFeature = features.find((f) =>
        /Zone [A|AE|AO|AH|VE|V]/i.test(f.attributes?.FLD_ZONE || "")
      );

      if (floodFeature) {
        const zone = floodFeature.attributes.FLD_ZONE;
        const isFloodway = floodFeature.attributes.FLOODWAY === "FLOODWAY";

        let riskLevel: FloodZone["riskLevel"] = "high";
        let description = "";

        if (zone.startsWith("V")) {
          riskLevel = "high";
          description = "High-risk coastal flood zone with wave action.";
        } else if (zone.startsWith("A")) {
          riskLevel = "high";
          description = "High-risk flood zone. Flood insurance required.";
        } else if (zone.startsWith("X")) {
          riskLevel = "moderate";
          description = "Moderate flood risk area.";
        }

        if (isFloodway) {
          description += " Located in regulatory floodway.";
        }

        const result: FloodZone = {
          inFloodZone: true,
          zone,
          floodway: isFloodway,
          riskLevel,
          description,
        };

        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return FloodZoneSchema.parse(result);
      }

      // No flood zone found
      const result: FloodZone = {
        inFloodZone: false,
        riskLevel: "minimal",
        description: "Not in a mapped flood zone.",
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return FloodZoneSchema.parse(result);
    } catch (_error) {
      return null;
    }
  }

  /**
   * Get complete location intelligence for a point
   */
  async getLocationIntelligence(
    lat: number,
    lon: number
  ): Promise<LocationIntelligence> {
    const [county, floodZone] = await Promise.all([
      this.getCountyData(lat, lon),
      this.getFloodZoneData(lat, lon),
    ]);

    return {
      coordinates: { lat, lon },
      county: county || undefined,
      floodZone: floodZone || undefined,
      enrichedAt: new Date().toISOString(),
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const locationServices = new LocationServices();
