/**
 * Google Places Service
 *
 * Fetches nearby businesses with reviews, ratings, and photos
 * - Nearby suppliers (Home Depot, Lowe's, etc.)
 * - Business ratings and reviews
 * - Operating hours
 * - Photos
 * - Contact information
 *
 * API: Google Places API (Nearby Search + Place Details)
 * Free Tier: $200/month credit = ~8,000 requests
 * Docs: https://developers.google.com/maps/documentation/places/web-service
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

export const PlaceSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  rating: z.number().optional(), // 1.0 to 5.0
  userRatingsTotal: z.number().optional(),
  vicinity: z.string(), // Address
  distance: z.number(), // meters
  lat: z.number(),
  lon: z.number(),
  types: z.array(z.string()).optional(), // Business types
  openNow: z.boolean().optional(),
  businessStatus: z.string().optional(), // OPERATIONAL, CLOSED_TEMPORARILY, CLOSED_PERMANENTLY
  priceLevel: z.number().optional(), // 0-4 (free to very expensive)
  photoUrl: z.string().optional(), // URL to main photo
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
});

export const GooglePlacesSchema = z.object({
  places: z.array(PlaceSchema),
  totalResults: z.number(),
  dataSource: z.string(),
  enrichedAt: z.string(),
});

export type Place = z.infer<typeof PlaceSchema>;
export type GooglePlaces = z.infer<typeof GooglePlacesSchema>;

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const _EARTH_RADIUS_METERS = 6_371_000;

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
export class GooglePlacesService {
  private readonly apiKey: string | undefined;
  private readonly cache: Map<
    string,
    { data: GooglePlaces; timestamp: number }
  > = new Map();
  private readonly cacheTTL = CACHE_TTL_MS;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  }

  /**
   * Find nearby home improvement stores with reviews and ratings
   */
  async findNearbySuppliers(
    lat: number,
    lon: number,
    radius = 8000
  ): Promise<GooglePlaces | null> {
    if (!this.apiKey) {
      return null;
    }

    const cacheKey = `places:${lat.toFixed(4)},${lon.toFixed(4)}:${radius}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      // Search for home improvement stores, hardware stores
      // Using keyword search for better results
      const keywords = [
        "home depot",
        "lowes",
        "hardware store",
        "lumber yard",
        "building supplies",
      ];
      const allPlaces: Place[] = [];

      for (const keyword of keywords) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${this.apiKey}`;

        const res = await fetch(url, {
          headers: { "User-Agent": USER_AGENT },
        });

        if (!res.ok) {
          continue;
        }

        const data = await res.json();

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
          continue;
        }

        if (data.results && data.results.length > 0) {
          for (const result of data.results) {
            const distance = this.calculateDistance(
              lat,
              lon,
              result.geometry.location.lat,
              result.geometry.location.lng
            );

            // Get photo URL if available
            let photoUrl: string | undefined;
            if (result.photos && result.photos.length > 0) {
              const photoReference = result.photos[0].photo_reference;
              photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${this.apiKey}`;
            }

            const place: Place = {
              name: result.name,
              placeId: result.place_id,
              rating: result.rating,
              userRatingsTotal: result.user_ratings_total,
              vicinity: result.vicinity,
              distance: Math.round(distance),
              lat: result.geometry.location.lat,
              lon: result.geometry.location.lng,
              types: result.types,
              openNow: result.opening_hours?.open_now,
              businessStatus: result.business_status,
              priceLevel: result.price_level,
              photoUrl,
            };

            // Avoid duplicates
            if (!allPlaces.find((p) => p.placeId === place.placeId)) {
              allPlaces.push(place);
            }
          }
        }
      }

      // Sort by distance
      allPlaces.sort((a, b) => a.distance - b.distance);

      // Get additional details for top 5 places (phone, website, etc.)
      const topPlaces = allPlaces.slice(0, 5);
      const enrichedPlaces = await Promise.all(
        topPlaces.map((place) => this.enrichPlaceDetails(place))
      );

      const googlePlaces: GooglePlaces = {
        places: enrichedPlaces,
        totalResults: allPlaces.length,
        dataSource: "google-places",
        enrichedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, { data: googlePlaces, timestamp: Date.now() });

      return googlePlaces;
    } catch (_error) {
      return null;
    }
  }

  /**
   * Enrich place with additional details (phone, website, etc.)
   */
  private async enrichPlaceDetails(place: Place): Promise<Place> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.placeId}&fields=formatted_phone_number,website&key=${this.apiKey}`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        return place;
      }

      const data = await res.json();

      if (data.status === "OK" && data.result) {
        return {
          ...place,
          phoneNumber: data.result.formatted_phone_number,
          website: data.result.website,
        };
      }

      return place;
    } catch (_error) {
      return place;
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6_371_000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Get Google Maps link for a place
   */
  getPlaceMapUrl(placeId: string): string {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  }

  /**
   * Get directions to a place
   */
  getDirectionsUrl(lat: number, lon: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  }
}

export const googlePlacesService = new GooglePlacesService();
