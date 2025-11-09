/**
 * Business Intelligence Enrichment Service
 *
 * Integrates with business data APIs:
 * - Google Places API ($200 free credit/month)
 * - OpenCorporates API (free tier)
 *
 * Features:
 * - Business details and verification
 * - Reviews and ratings
 * - Company registration data
 * - Business hours and contact info
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

export const BusinessEnrichmentSchema = z.object({
  // Basic info
  businessName: z.string(),
  businessType: z.string().optional(),

  // Contact info
  phone: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),

  // Location
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),

  // Business details
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  priceLevel: z.number().min(1).max(4).optional(), // 1-4 dollar signs

  // Reviews and ratings
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().optional(),
  reviews: z
    .array(
      z.object({
        author: z.string(),
        rating: z.number(),
        text: z.string(),
        time: z.string(),
      })
    )
    .optional(),

  // Operating hours
  hours: z
    .object({
      monday: z.string().optional(),
      tuesday: z.string().optional(),
      wednesday: z.string().optional(),
      thursday: z.string().optional(),
      friday: z.string().optional(),
      saturday: z.string().optional(),
      sunday: z.string().optional(),
    })
    .optional(),

  // Photos
  photos: z.array(z.string().url()).optional(),

  // Company registration (from OpenCorporates)
  registration: z
    .object({
      companyNumber: z.string().optional(),
      jurisdiction: z.string().optional(),
      incorporationDate: z.string().optional(),
      companyType: z.string().optional(),
      status: z.string().optional(),
      registeredAddress: z.string().optional(),
    })
    .optional(),

  // Metadata
  source: z.enum(["google_places", "opencorporates", "combined"]),
  confidence: z.number().min(0).max(100),
  enrichedAt: z.string(),
});

export type BusinessEnrichment = z.infer<typeof BusinessEnrichmentSchema>;

// ============================================================================
// Business Enrichment Service
// ============================================================================

export class BusinessEnrichmentService {
  private googlePlacesApiKey: string | undefined;
  private openCorporatesApiKey: string | undefined;

  constructor() {
    this.googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;
    this.openCorporatesApiKey = process.env.OPENCORPORATES_API_KEY;
  }

  /**
   * Enrich business data
   */
  async enrichBusiness(
    businessName: string,
    address?: string,
    city?: string,
    state?: string
  ): Promise<BusinessEnrichment | null> {
    let placesData: any = null;
    let corporatesData: any = null;

    // Try Google Places first
    try {
      placesData = await this.enrichWithGooglePlaces(
        businessName,
        address,
        city,
        state
      );
    } catch (error) {
      console.error("Error with Google Places:", error);
    }

    // Try OpenCorporates for registration data
    try {
      corporatesData = await this.enrichWithOpenCorporates(businessName, state);
    } catch (error) {
      console.error("Error with OpenCorporates:", error);
    }

    // Combine results
    if (!(placesData || corporatesData)) {
      return null;
    }

    // Merge data from both sources
    return BusinessEnrichmentSchema.parse({
      businessName:
        placesData?.businessName ||
        corporatesData?.businessName ||
        businessName,
      businessType: placesData?.businessType || corporatesData?.businessType,
      phone: placesData?.phone,
      website: placesData?.website,
      email: placesData?.email,
      address: placesData?.address,
      description: placesData?.description,
      categories: placesData?.categories,
      priceLevel: placesData?.priceLevel,
      rating: placesData?.rating,
      reviewCount: placesData?.reviewCount,
      reviews: placesData?.reviews,
      hours: placesData?.hours,
      photos: placesData?.photos,
      registration: corporatesData?.registration,
      source:
        placesData && corporatesData
          ? "combined"
          : placesData
            ? "google_places"
            : "opencorporates",
      confidence: placesData ? 90 : 70,
      enrichedAt: new Date().toISOString(),
    });
  }

  /**
   * Enrich using Google Places API
   */
  private async enrichWithGooglePlaces(
    businessName: string,
    address?: string,
    city?: string,
    state?: string
  ): Promise<Partial<BusinessEnrichment> | null> {
    if (!this.googlePlacesApiKey) {
      console.log("Google Places API key not configured");
      return null;
    }

    // Build search query
    const query = [businessName, address, city, state]
      .filter(Boolean)
      .join(", ");

    // Step 1: Find place
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${this.googlePlacesApiKey}`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(
        `Google Places search error: ${searchResponse.statusText}`
      );
    }

    const searchData = await searchResponse.json();
    if (!searchData.candidates?.length) {
      return null;
    }

    const placeId = searchData.candidates[0].place_id;

    // Step 2: Get place details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,formatted_address,geometry,rating,user_ratings_total,reviews,opening_hours,photos,types,price_level,business_status&key=${this.googlePlacesApiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(
        `Google Places details error: ${detailsResponse.statusText}`
      );
    }

    const detailsData = await detailsResponse.json();
    const place = detailsData.result;

    if (!place) {
      return null;
    }

    // Parse address components
    const addressParts = place.formatted_address?.split(", ") || [];

    // Parse opening hours
    const hours = place.opening_hours?.weekday_text
      ? {
          monday: place.opening_hours.weekday_text[0]?.split(": ")[1],
          tuesday: place.opening_hours.weekday_text[1]?.split(": ")[1],
          wednesday: place.opening_hours.weekday_text[2]?.split(": ")[1],
          thursday: place.opening_hours.weekday_text[3]?.split(": ")[1],
          friday: place.opening_hours.weekday_text[4]?.split(": ")[1],
          saturday: place.opening_hours.weekday_text[5]?.split(": ")[1],
          sunday: place.opening_hours.weekday_text[6]?.split(": ")[1],
        }
      : undefined;

    // Get photo URLs (first 5)
    const photos = place.photos
      ?.slice(0, 5)
      .map(
        (photo: any) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${this.googlePlacesApiKey}`
      );

    return {
      businessName: place.name,
      businessType: place.types?.[0],
      phone: place.formatted_phone_number,
      website: place.website,
      address: {
        street: addressParts[0],
        city: addressParts[1],
        state: addressParts[2]?.split(" ")[0],
        zipCode: addressParts[2]?.split(" ")[1],
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
      },
      categories: place.types,
      priceLevel: place.price_level,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      reviews: place.reviews?.slice(0, 5).map((review: any) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: new Date(review.time * 1000).toISOString(),
      })),
      hours,
      photos,
    };
  }

  /**
   * Enrich using OpenCorporates API
   */
  private async enrichWithOpenCorporates(
    businessName: string,
    state?: string
  ): Promise<Partial<BusinessEnrichment> | null> {
    // OpenCorporates has a free tier, no API key required for basic searches
    const jurisdiction = state ? `us_${state.toLowerCase()}` : "us";
    const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(businessName)}&jurisdiction_code=${jurisdiction}`;

    const response = await fetch(url, {
      headers: {
        ...(this.openCorporatesApiKey && {
          "X-API-Key": this.openCorporatesApiKey,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`OpenCorporates API error: ${response.statusText}`);
    }

    const data = await response.json();
    const company = data.results?.companies?.[0]?.company;

    if (!company) {
      return null;
    }

    return {
      businessName: company.name,
      registration: {
        companyNumber: company.company_number,
        jurisdiction: company.jurisdiction_code,
        incorporationDate: company.incorporation_date,
        companyType: company.company_type,
        status: company.current_status,
        registeredAddress: company.registered_address_in_full,
      },
    };
  }
}

// Singleton instance
export const businessEnrichmentService = new BusinessEnrichmentService();
