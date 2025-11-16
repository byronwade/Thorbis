/**
 * Person/Contact Data Enrichment Service
 *
 * Integrates with person data APIs to provide comprehensive contact information:
 * - Hunter.io (25 free/month)
 *
 * Features:
 * - Email verification
 * - Job title and company
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

export const PersonEnrichmentSchema = z.object({
	// Basic info
	fullName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().email(),
	emailVerified: z.boolean().optional(),

	// Professional info
	jobTitle: z.string().optional(),
	seniority: z.string().optional(), // 'executive', 'director', 'manager', 'individual'

	// Company info
	company: z
		.object({
			name: z.string().optional(),
			domain: z.string().optional(),
			industry: z.string().optional(),
			size: z.string().optional(),
			location: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),

	// Social profiles
	socialProfiles: z
		.object({
			linkedin: z.string().url().optional(),
			twitter: z.string().url().optional(),
			facebook: z.string().url().optional(),
			github: z.string().url().optional(),
		})
		.optional(),

	// Contact info
	phone: z.string().optional(),
	location: z
		.object({
			city: z.string().optional(),
			state: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),

	// Metadata
	source: z.enum(["hunter"]),
	confidence: z.number().min(0).max(100),
	enrichedAt: z.string(),
});

export type PersonEnrichment = z.infer<typeof PersonEnrichmentSchema>;

// ============================================================================
// Person Enrichment Service
// ============================================================================

export class PersonEnrichmentService {
	private readonly hunterApiKey: string | undefined;

	constructor() {
		this.hunterApiKey = process.env.HUNTER_API_KEY;
	}

	/**
	 * Enrich person data from email address
	 */
	async enrichPerson(email: string): Promise<PersonEnrichment | null> {
		try {
			return await this.enrichWithHunter(email);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * Enrich using Hunter.io API
	 * https://hunter.io/api-documentation
	 */
	private async enrichWithHunter(email: string): Promise<PersonEnrichment | null> {
		if (!this.hunterApiKey) {
			return null;
		}

		const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${this.hunterApiKey}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Hunter API error: ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.data) {
			return null;
		}

		// Hunter gives us limited info, mainly email verification
		return PersonEnrichmentSchema.parse({
			email,
			emailVerified: data.data.status === "valid",
			firstName: data.data.first_name,
			lastName: data.data.last_name,
			company: data.data.organization
				? {
						name: data.data.organization,
					}
				: undefined,
			socialProfiles: data.data.sources?.length
				? {
						linkedin: data.data.sources.find((s: any) => s.uri?.includes("linkedin"))?.uri,
					}
				: undefined,
			source: "hunter",
			confidence: data.data.score || 50,
			enrichedAt: new Date().toISOString(),
		});
	}
}

// Singleton instance
export const personEnrichmentService = new PersonEnrichmentService();
