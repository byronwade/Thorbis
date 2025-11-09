/**
 * Address Validation Service
 *
 * Validates and standardizes addresses using USPS API
 * Reduces dispatch errors and failed service calls
 *
 * Features:
 * - Address standardization
 * - Delivery point validation (DPV)
 * - ZIP+4 completion
 * - Error detection
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

export const AddressValidationSchema = z.object({
  isValid: z.boolean(),
  input: z.object({
    address1: z.string().optional(),
    address2: z.string(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip5: z.string().optional(),
    zip4: z.string().optional(),
  }),
  standardized: z
    .object({
      address1: z.string().optional(),
      address2: z.string(),
      city: z.string(),
      state: z.string(),
      zip5: z.string(),
      zip4: z.string().optional(),
      deliveryPoint: z.string().optional(),
    })
    .optional(),
  error: z.string().optional(),
  suggestions: z.array(z.string()).optional(),
  enrichedAt: z.string(),
});

export type AddressValidation = z.infer<typeof AddressValidationSchema>;

// ============================================================================
// Address Validation Service
// ============================================================================

export class AddressValidationService {
  private uspsUserId: string | undefined;

  constructor() {
    this.uspsUserId = process.env.USPS_USER_ID;
  }

  /**
   * Validate and standardize an address
   *
   * Note: USPS Web Tools API is being sunset Jan 2026
   * Migrate to USPS "Addresses 3.0" API before then
   */
  async validateAddress(address: {
    address1?: string; // Apt/Suite
    address2: string; // Street
    city?: string;
    state?: string;
    zip5?: string;
    zip4?: string;
  }): Promise<AddressValidation> {
    if (!this.uspsUserId) {
      console.log("[USPS] API not configured, skipping address validation");
      return {
        isValid: false,
        input: address,
        error: "USPS API not configured",
        enrichedAt: new Date().toISOString(),
      };
    }

    try {
      // Build USPS XML request
      const xml = this.buildUSPSXML(address);

      // Call USPS API
      const url = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURIComponent(xml)}`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        throw new Error(`USPS API failed: ${res.status}`);
      }

      const xmlResponse = await res.text();

      // Parse XML response
      const result = this.parseUSPSResponse(xmlResponse, address);

      return AddressValidationSchema.parse(result);
    } catch (error) {
      console.error("Address validation error:", error);
      return {
        isValid: false,
        input: address,
        error:
          error instanceof Error ? error.message : "Unknown validation error",
        enrichedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Build USPS XML request
   */
  private buildUSPSXML(address: {
    address1?: string;
    address2: string;
    city?: string;
    state?: string;
    zip5?: string;
    zip4?: string;
  }): string {
    return (
      `<AddressValidateRequest USERID="${this.uspsUserId}">` +
      "<Revision>1</Revision>" +
      `<Address ID="0">` +
      `<Address1>${this.escapeXML(address.address1 || "")}</Address1>` +
      `<Address2>${this.escapeXML(address.address2)}</Address2>` +
      `<City>${this.escapeXML(address.city || "")}</City>` +
      `<State>${this.escapeXML(address.state || "")}</State>` +
      `<Zip5>${address.zip5 || ""}</Zip5>` +
      `<Zip4>${address.zip4 || ""}</Zip4>` +
      "</Address>" +
      "</AddressValidateRequest>"
    );
  }

  /**
   * Parse USPS XML response
   */
  private parseUSPSResponse(
    xml: string,
    input: any
  ): Omit<AddressValidation, "enrichedAt"> {
    // Check for error
    if (xml.includes("<Error>")) {
      const errorMatch = xml.match(/<Description>(.*?)<\/Description>/);
      const errorMsg = errorMatch ? errorMatch[1] : "Unknown USPS error";

      return {
        isValid: false,
        input,
        error: errorMsg,
        suggestions: this.extractSuggestions(errorMsg),
      };
    }

    // Extract standardized address
    try {
      const address1Match = xml.match(/<Address1>(.*?)<\/Address1>/);
      const address2Match = xml.match(/<Address2>(.*?)<\/Address2>/);
      const cityMatch = xml.match(/<City>(.*?)<\/City>/);
      const stateMatch = xml.match(/<State>(.*?)<\/State>/);
      const zip5Match = xml.match(/<Zip5>(.*?)<\/Zip5>/);
      const zip4Match = xml.match(/<Zip4>(.*?)<\/Zip4>/);
      const dpvMatch = xml.match(/<DPVConfirmation>(.*?)<\/DPVConfirmation>/);

      if (!(address2Match && cityMatch && stateMatch && zip5Match)) {
        return {
          isValid: false,
          input,
          error: "Incomplete address data from USPS",
        };
      }

      return {
        isValid: true,
        input,
        standardized: {
          address1: address1Match ? address1Match[1] : undefined,
          address2: address2Match[1],
          city: cityMatch[1],
          state: stateMatch[1],
          zip5: zip5Match[1],
          zip4: zip4Match ? zip4Match[1] : undefined,
          deliveryPoint: dpvMatch ? dpvMatch[1] : undefined,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        input,
        error: "Failed to parse USPS response",
      };
    }
  }

  /**
   * Extract suggestions from error message
   */
  private extractSuggestions(errorMsg: string): string[] {
    const suggestions: string[] = [];

    if (errorMsg.toLowerCase().includes("invalid")) {
      suggestions.push("Check street address spelling");
      suggestions.push("Verify city and state");
    }

    if (errorMsg.toLowerCase().includes("zip")) {
      suggestions.push("Verify ZIP code is correct for this city/state");
    }

    if (
      errorMsg.toLowerCase().includes("apartment") ||
      errorMsg.toLowerCase().includes("unit")
    ) {
      suggestions.push("Include apartment or unit number if applicable");
    }

    return suggestions;
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * Quick check if address appears valid (without API call)
   */
  isAddressComplete(address: {
    address2: string;
    city?: string;
    state?: string;
    zip5?: string;
  }): boolean {
    return !!(
      address.address2 &&
      address.city &&
      address.state &&
      address.zip5 &&
      address.zip5.length === 5
    );
  }
}

// Singleton instance
export const addressValidationService = new AddressValidationService();
