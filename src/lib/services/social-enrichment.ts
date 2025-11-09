/**
 * Social Media Enrichment Service
 *
 * Integrates with social media APIs:
 * - LinkedIn (via RapidAPI)
 * - Twitter/X API
 * - Facebook Graph API
 *
 * Features:
 * - Find social profiles by name/email
 * - Extract profile information
 * - Get follower counts and engagement
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

export const SocialEnrichmentSchema = z.object({
  profiles: z.object({
    linkedin: z.object({
      url: z.string().url().optional(),
      headline: z.string().optional(),
      connections: z.number().optional(),
      verified: z.boolean().optional(),
    }).optional(),
    
    twitter: z.object({
      url: z.string().url().optional(),
      username: z.string().optional(),
      followers: z.number().optional(),
      verified: z.boolean().optional(),
      bio: z.string().optional(),
    }).optional(),
    
    facebook: z.object({
      url: z.string().url().optional(),
      name: z.string().optional(),
      verified: z.boolean().optional(),
    }).optional(),
  }),
  
  // Metadata
  confidence: z.number().min(0).max(100),
  enrichedAt: z.string(),
});

export type SocialEnrichment = z.infer<typeof SocialEnrichmentSchema>;

// ============================================================================
// Social Enrichment Service
// ============================================================================

export class SocialEnrichmentService {
  private rapidApiKey: string | undefined;
  private twitterBearerToken: string | undefined;
  private facebookAppId: string | undefined;
  private facebookAppSecret: string | undefined;

  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
    this.facebookAppId = process.env.FACEBOOK_APP_ID;
    this.facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  }

  /**
   * Enrich social media profiles
   */
  async enrichSocial(
    email: string,
    fullName?: string
  ): Promise<SocialEnrichment | null> {
    const profiles: SocialEnrichment["profiles"] = {};

    // Try to find profiles on each platform
    try {
      const linkedinProfile = await this.findLinkedInProfile(email, fullName);
      if (linkedinProfile) {
        profiles.linkedin = linkedinProfile;
      }
    } catch (error) {
      console.error("Error finding LinkedIn profile:", error);
    }

    try {
      const twitterProfile = await this.findTwitterProfile(fullName);
      if (twitterProfile) {
        profiles.twitter = twitterProfile;
      }
    } catch (error) {
      console.error("Error finding Twitter profile:", error);
    }

    try {
      const facebookProfile = await this.findFacebookProfile(email);
      if (facebookProfile) {
        profiles.facebook = facebookProfile;
      }
    } catch (error) {
      console.error("Error finding Facebook profile:", error);
    }

    // Return null if no profiles found
    if (Object.keys(profiles).length === 0) {
      return null;
    }

    return SocialEnrichmentSchema.parse({
      profiles,
      confidence: Object.keys(profiles).length * 30, // More profiles = higher confidence
      enrichedAt: new Date().toISOString(),
    });
  }

  /**
   * Find LinkedIn profile using RapidAPI
   */
  private async findLinkedInProfile(
    email: string,
    fullName?: string
  ): Promise<SocialEnrichment["profiles"]["linkedin"] | null> {
    if (!this.rapidApiKey) {
      console.log("RapidAPI key not configured");
      return null;
    }

    // Use LinkedIn Profile Scraper API from RapidAPI
    // Note: This is a placeholder - actual implementation depends on the specific API
    const searchQuery = fullName || email;
    const url = `https://linkedin-data-api.p.rapidapi.com/search?keywords=${encodeURIComponent(searchQuery)}`;

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": this.rapidApiKey,
        "X-RapidAPI-Host": "linkedin-data-api.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const data = await response.json();
    const profile = data.data?.[0];

    if (!profile) {
      return null;
    }

    return {
      url: profile.url,
      headline: profile.headline,
      connections: profile.connections,
      verified: profile.verified || false,
    };
  }

  /**
   * Find Twitter profile using Twitter API v2
   */
  private async findTwitterProfile(
    fullName?: string
  ): Promise<SocialEnrichment["profiles"]["twitter"] | null> {
    if (!this.twitterBearerToken) {
      console.log("Twitter bearer token not configured");
      return null;
    }

    if (!fullName) {
      return null;
    }

    // Search for user by name
    const url = `https://api.twitter.com/2/users/by?usernames=${encodeURIComponent(fullName.replace(" ", ""))}&user.fields=public_metrics,description,verified`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.twitterBearerToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const user = data.data?.[0];

    if (!user) {
      return null;
    }

    return {
      url: `https://twitter.com/${user.username}`,
      username: user.username,
      followers: user.public_metrics?.followers_count,
      verified: user.verified,
      bio: user.description,
    };
  }

  /**
   * Find Facebook profile using Facebook Graph API
   */
  private async findFacebookProfile(
    email: string
  ): Promise<SocialEnrichment["profiles"]["facebook"] | null> {
    if (!this.facebookAppId || !this.facebookAppSecret) {
      console.log("Facebook credentials not configured");
      return null;
    }

    // Get app access token
    const tokenUrl = `https://graph.facebook.com/oauth/access_token?client_id=${this.facebookAppId}&client_secret=${this.facebookAppSecret}&grant_type=client_credentials`;

    const tokenResponse = await fetch(tokenUrl);
    if (!tokenResponse.ok) {
      throw new Error(`Facebook token error: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Note: Facebook's public search capabilities are very limited
    // This is a placeholder - actual implementation would require user consent
    // or business verification for more detailed searches

    // For now, we can only check if a user has a public profile
    // Real implementation would need Facebook Login integration
    return null;
  }

  /**
   * Extract username from social media URLs
   */
  extractUsername(url: string, platform: "linkedin" | "twitter" | "facebook"): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      switch (platform) {
        case "linkedin":
          // Extract from /in/username or /company/companyname
          const linkedinMatch = pathname.match(/\/(in|company)\/([^\/]+)/);
          return linkedinMatch?.[2] || null;
        
        case "twitter":
          // Extract from /username
          const twitterMatch = pathname.match(/\/([^\/]+)/);
          return twitterMatch?.[1] || null;
        
        case "facebook":
          // Extract from /username or /profile.php?id=
          const facebookMatch = pathname.match(/\/([^\/\?]+)/);
          return facebookMatch?.[1] || null;
        
        default:
          return null;
      }
    } catch {
      return null;
    }
  }
}

// Singleton instance
export const socialEnrichmentService = new SocialEnrichmentService();

