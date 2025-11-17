/**
 * Customer Enrichment Service Tests
 *
 * Tests for the enrichment orchestrator that coordinates all enrichment providers
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { businessEnrichmentService } from "../business-enrichment";
import { customerEnrichmentService } from "../customer-enrichment";
import { personEnrichmentService } from "../person-enrichment";
import { propertyEnrichmentService } from "../property-enrichment";
import { socialEnrichmentService } from "../social-enrichment";

// Mock all enrichment services
jest.mock("../person-enrichment");
jest.mock("../business-enrichment");
jest.mock("../social-enrichment");
jest.mock("../property-enrichment");

const mockedPersonEnrichment = personEnrichmentService as jest.Mocked<
	typeof personEnrichmentService
>;
const mockedBusinessEnrichment = businessEnrichmentService as jest.Mocked<
	typeof businessEnrichmentService
>;
const mockedSocialEnrichment = socialEnrichmentService as jest.Mocked<
	typeof socialEnrichmentService
>;
const mockedPropertyEnrichment = propertyEnrichmentService as jest.Mocked<
	typeof propertyEnrichmentService
>;

describe("CustomerEnrichmentService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("enrichCustomer", () => {
		it("should enrich customer with person data", async () => {
			const mockPersonData = {
				email: "test@example.com",
				firstName: "John",
				lastName: "Doe",
				jobTitle: "Software Engineer",
				company: {
					name: "Acme Corp",
				},
				source: "hunter" as const,
				confidence: 90,
				enrichedAt: new Date().toISOString(),
			};

			mockedPersonEnrichment.enrichPerson.mockResolvedValue(mockPersonData);
			mockedBusinessEnrichment.enrichBusiness.mockResolvedValue(null);
			mockedSocialEnrichment.enrichSocial.mockResolvedValue(null);
			mockedPropertyEnrichment.enrichProperty.mockResolvedValue(null);

			const result = await customerEnrichmentService.enrichCustomer({
				id: "test-id",
				email: "test@example.com",
				firstName: "John",
				lastName: "Doe",
			});

			expect(result.enrichmentStatus).toBe("completed");
			expect(result.person).toEqual(mockPersonData);
			expect(result.sources).toContain("hunter");
			expect(result.overallConfidence).toBeGreaterThan(0);
		});

		it("should handle enrichment failures gracefully", async () => {
			mockedPersonEnrichment.enrichPerson.mockRejectedValue(new Error("API error"));
			mockedBusinessEnrichment.enrichBusiness.mockResolvedValue(null);
			mockedSocialEnrichment.enrichSocial.mockResolvedValue(null);
			mockedPropertyEnrichment.enrichProperty.mockResolvedValue(null);

			const result = await customerEnrichmentService.enrichCustomer({
				id: "test-id",
				email: "test@example.com",
			});

			expect(result.enrichmentStatus).toBe("failed");
			expect(result.sources).toHaveLength(0);
		});

		it("should enrich with multiple sources", async () => {
			const mockPersonData = {
				email: "test@example.com",
				source: "hunter" as const,
				confidence: 90,
				enrichedAt: new Date().toISOString(),
			};

			const mockBusinessData = {
				businessName: "Acme Corp",
				source: "google_places" as const,
				confidence: 85,
				enrichedAt: new Date().toISOString(),
			};

			mockedPersonEnrichment.enrichPerson.mockResolvedValue(mockPersonData);
			mockedBusinessEnrichment.enrichBusiness.mockResolvedValue(mockBusinessData);
			mockedSocialEnrichment.enrichSocial.mockResolvedValue(null);
			mockedPropertyEnrichment.enrichProperty.mockResolvedValue(null);

			const result = await customerEnrichmentService.enrichCustomer({
				id: "test-id",
				email: "test@example.com",
				companyName: "Acme Corp",
			});

			expect(result.enrichmentStatus).toBe("completed");
			expect(result.sources).toContain("hunter");
			expect(result.sources).toContain("google_places");
			expect(result.person).toEqual(mockPersonData);
			expect(result.business).toEqual(mockBusinessData);
		});

		it("should calculate overall confidence score", async () => {
			const mockPersonData = {
				email: "test@example.com",
				source: "hunter" as const,
				confidence: 90,
				enrichedAt: new Date().toISOString(),
			};

			const mockBusinessData = {
				businessName: "Acme Corp",
				source: "google_places" as const,
				confidence: 80,
				enrichedAt: new Date().toISOString(),
			};

			mockedPersonEnrichment.enrichPerson.mockResolvedValue(mockPersonData);
			mockedBusinessEnrichment.enrichBusiness.mockResolvedValue(mockBusinessData);
			mockedSocialEnrichment.enrichSocial.mockResolvedValue(null);
			mockedPropertyEnrichment.enrichProperty.mockResolvedValue(null);

			const result = await customerEnrichmentService.enrichCustomer({
				id: "test-id",
				email: "test@example.com",
				companyName: "Acme Corp",
			});

			// Average of 90 and 80 = 85
			expect(result.overallConfidence).toBe(85);
		});
	});

	describe("isEnrichmentValid", () => {
		it("should return true for valid enrichment", () => {
			const enrichment = {
				customerId: "test-id",
				enrichmentStatus: "completed" as const,
				sources: ["hunter"],
				overallConfidence: 90,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
			};

			expect(customerEnrichmentService.isEnrichmentValid(enrichment)).toBe(true);
		});

		it("should return false for expired enrichment", () => {
			const enrichment = {
				customerId: "test-id",
				enrichmentStatus: "completed" as const,
				sources: ["hunter"],
				overallConfidence: 90,
				expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
			};

			expect(customerEnrichmentService.isEnrichmentValid(enrichment)).toBe(false);
		});

		it("should return false when expiresAt is missing", () => {
			const enrichment = {
				customerId: "test-id",
				enrichmentStatus: "completed" as const,
				sources: ["hunter"],
				overallConfidence: 90,
			};

			expect(customerEnrichmentService.isEnrichmentValid(enrichment)).toBe(false);
		});
	});

	describe("setCacheTTL", () => {
		it("should update cache TTL", () => {
			const newTTL = 1000 * 60 * 60 * 24 * 3; // 3 days
			customerEnrichmentService.setCacheTTL(newTTL);
			expect(customerEnrichmentService.getCacheTTL()).toBe(newTTL);
		});
	});
});
