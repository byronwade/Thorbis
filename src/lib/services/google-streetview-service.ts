/**
 * Google Street View Service
 *
 * Generates Street View images of properties
 * - Static street view images
 * - Property visual confirmation
 * - Multiple viewing angles
 *
 * API: Google Street View Static API
 * Free Tier: 25,000 requests/month
 * Docs: https://developers.google.com/maps/documentation/streetview
 */

import { z } from "zod";

export const StreetViewSchema = z.object({
  mainView: z.string(), // URL to street view image
  alternateViews: z.array(z.string()).optional(), // URLs from different angles
  heading: z.number().optional(), // Camera heading (0-360)
  pitch: z.number().optional(), // Camera pitch (-90 to 90)
  fov: z.number().optional(), // Field of view (0-120)
  available: z.boolean(), // Whether street view is available for this location
  dataSource: z.string(),
  enrichedAt: z.string(),
});

export type StreetView = z.infer<typeof StreetViewSchema>;

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
export class GoogleStreetViewService {
  private readonly apiKey: string | undefined;
  private readonly cache: Map<string, { data: StreetView; timestamp: number }> =
    new Map();
  private readonly cacheTTL = CACHE_TTL_MS;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  }

  async getStreetView(
    lat: number,
    lon: number,
    address?: string
  ): Promise<StreetView | null> {
    if (!this.apiKey) {
      return null;
    }

    const cacheKey = `streetview:${lat.toFixed(6)},${lon.toFixed(6)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      // First, check if Street View is available for this location
      const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lon}&key=${this.apiKey}`;

      const metadataRes = await fetch(metadataUrl);

      if (!metadataRes.ok) {
        return null;
      }

      const metadata = await metadataRes.json();

      if (metadata.status !== "OK") {
        return {
          mainView: "",
          available: false,
          dataSource: "google-streetview",
          enrichedAt: new Date().toISOString(),
        };
      }

      // Generate Street View image URLs
      const size = "600x400"; // Width x Height
      const defaultHeading = 0; // North
      const defaultPitch = 0; // Straight ahead
      const defaultFov = 90; // Field of view

      // Use address if provided, otherwise use coordinates
      const locationParam = address
        ? `location=${encodeURIComponent(address)}`
        : `location=${lat},${lon}`;

      // Main view (street facing)
      const mainView = `https://maps.googleapis.com/maps/api/streetview?size=${size}&${locationParam}&heading=${defaultHeading}&pitch=${defaultPitch}&fov=${defaultFov}&key=${this.apiKey}`;

      // Alternate views (different angles)
      const alternateViews = [
        `https://maps.googleapis.com/maps/api/streetview?size=${size}&${locationParam}&heading=90&pitch=${defaultPitch}&fov=${defaultFov}&key=${this.apiKey}`, // Right side
        `https://maps.googleapis.com/maps/api/streetview?size=${size}&${locationParam}&heading=180&pitch=${defaultPitch}&fov=${defaultFov}&key=${this.apiKey}`, // Rear
        `https://maps.googleapis.com/maps/api/streetview?size=${size}&${locationParam}&heading=270&pitch=${defaultPitch}&fov=${defaultFov}&key=${this.apiKey}`, // Left side
      ];

      const streetView: StreetView = {
        mainView,
        alternateViews,
        heading: defaultHeading,
        pitch: defaultPitch,
        fov: defaultFov,
        available: true,
        dataSource: "google-streetview",
        enrichedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, { data: streetView, timestamp: Date.now() });

      return streetView;
    } catch (_error) {
      return null;
    }
  }

  /**
   * Get direct Street View image URL (for embedding)
   */
  getImageUrl(
    lat: number,
    lon: number,
    heading = 0,
    size = "600x400"
  ): string | null {
    if (!this.apiKey) {
      return null;
    }

    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lon}&heading=${heading}&key=${this.apiKey}`;
  }

  /**
   * Get Street View panorama URL (for interactive viewing)
   */
  getPanoramaUrl(lat: number, lon: number): string {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
  }
}

export const googleStreetViewService = new GoogleStreetViewService();
