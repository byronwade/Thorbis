/**
 * Storage Tracker Tests
 *
 * Tests for storage usage tracking and cost calculation.
 * Ensures accurate metering of Supabase Storage for billing.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	calculateStorageCost,
	formatBytes,
} from "../storage-tracker";
import { STORAGE_PRICING } from "@/lib/billing/pricing";

describe("Storage Tracker", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("calculateStorageCost", () => {
		it("should return zero costs for zero bytes", () => {
			const result = calculateStorageCost(0);

			expect(result.gb).toBe(0);
			expect(result.providerCostCents).toBe(0);
			expect(result.customerPriceCents).toBe(0);
		});

		it("should calculate cost correctly for 1 GB", () => {
			const oneGb = 1024 * 1024 * 1024; // 1 GB in bytes
			const result = calculateStorageCost(oneGb);

			expect(result.gb).toBe(1);
			expect(result.providerCostCents).toBe(9); // $0.09
			expect(result.customerPriceCents).toBe(27); // $0.27
		});

		it("should calculate cost correctly for 10 GB", () => {
			const tenGb = 10 * 1024 * 1024 * 1024;
			const result = calculateStorageCost(tenGb);

			expect(result.gb).toBe(10);
			expect(result.providerCostCents).toBe(90); // $0.90
			expect(result.customerPriceCents).toBe(270); // $2.70
		});

		it("should calculate cost correctly for 100 GB", () => {
			const hundredGb = 100 * 1024 * 1024 * 1024;
			const result = calculateStorageCost(hundredGb);

			expect(result.gb).toBe(100);
			expect(result.providerCostCents).toBe(900); // $9.00
			expect(result.customerPriceCents).toBe(2700); // $27.00
		});

		it("should handle fractional GB correctly (500 MB)", () => {
			const halfGb = 512 * 1024 * 1024; // 512 MB
			const result = calculateStorageCost(halfGb);

			expect(result.gb).toBe(0.5);
			expect(result.providerCostCents).toBe(5); // ~$0.045 rounded
			expect(result.customerPriceCents).toBe(14); // ~$0.135 rounded
		});

		it("should handle small amounts correctly (1 MB)", () => {
			const oneMb = 1024 * 1024; // 1 MB
			const result = calculateStorageCost(oneMb);

			expect(result.gb).toBeLessThan(0.01);
			expect(result.providerCostCents).toBe(0); // Too small to register
			expect(result.customerPriceCents).toBe(0);
		});

		it("should maintain 3x markup ratio", () => {
			const oneGb = 1024 * 1024 * 1024;
			const result = calculateStorageCost(oneGb);

			expect(result.customerPriceCents).toBe(result.providerCostCents * 3);
		});

		it("should round GB to 2 decimal places", () => {
			const weirdAmount = 1234567890; // ~1.15 GB
			const result = calculateStorageCost(weirdAmount);

			// Check that GB is rounded to 2 decimal places
			const decimals = result.gb.toString().split(".")[1];
			expect(!decimals || decimals.length <= 2).toBe(true);
		});

		it("should use correct bytes per GB constant", () => {
			expect(STORAGE_PRICING.bytesPerGb).toBe(1073741824); // 1024^3
		});

		it("should handle large storage (1 TB)", () => {
			const oneTb = 1024 * 1024 * 1024 * 1024; // 1 TB
			const result = calculateStorageCost(oneTb);

			expect(result.gb).toBe(1024);
			expect(result.providerCostCents).toBe(9216); // $92.16
			expect(result.customerPriceCents).toBe(27648); // $276.48
		});
	});

	describe("formatBytes", () => {
		it("should format 0 bytes correctly", () => {
			expect(formatBytes(0)).toBe("0 Bytes");
		});

		it("should format bytes correctly", () => {
			expect(formatBytes(500)).toBe("500 Bytes");
		});

		it("should format kilobytes correctly", () => {
			expect(formatBytes(1024)).toBe("1 KB");
			expect(formatBytes(2048)).toBe("2 KB");
		});

		it("should format megabytes correctly", () => {
			expect(formatBytes(1024 * 1024)).toBe("1 MB");
			expect(formatBytes(5 * 1024 * 1024)).toBe("5 MB");
		});

		it("should format gigabytes correctly", () => {
			expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
			expect(formatBytes(10 * 1024 * 1024 * 1024)).toBe("10 GB");
		});

		it("should format terabytes correctly", () => {
			expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe("1 TB");
		});

		it("should format with decimals for non-round numbers", () => {
			expect(formatBytes(1536 * 1024 * 1024)).toBe("1.5 GB");
		});
	});

	describe("Storage Pricing Constants", () => {
		it("should have Supabase as provider", () => {
			expect(STORAGE_PRICING.provider).toBe("Supabase");
		});

		it("should have correct provider cost ($0.09/GB = 9 cents)", () => {
			expect(STORAGE_PRICING.providerCostPerGb).toBe(9);
		});

		it("should have correct customer price ($0.27/GB = 27 cents)", () => {
			expect(STORAGE_PRICING.customerPricePerGb).toBe(27);
		});

		it("should have GB as unit", () => {
			expect(STORAGE_PRICING.unit).toBe("GB");
		});
	});

	describe("Edge Cases", () => {
		it("should handle exactly 1024 bytes", () => {
			const result = calculateStorageCost(1024);
			expect(result.gb).toBeLessThan(0.01);
		});

		it("should handle negative bytes gracefully", () => {
			// Negative bytes shouldn't happen but should not crash
			// Due to rounding, very small negative values become 0
			const result = calculateStorageCost(-1000);
			expect(result.gb).toBeLessThanOrEqual(0);
		});

		it("should handle very large numbers", () => {
			const petabyte = 1024 * 1024 * 1024 * 1024 * 1024;
			const result = calculateStorageCost(petabyte);
			expect(result.gb).toBe(1048576); // 1 PB = 1,048,576 GB
		});
	});

	describe("Cost Accuracy", () => {
		it("should match marketing pricing page values", () => {
			// Marketing page shows: $0.27/GB (customer price)
			// That's 27 cents per GB
			const oneGb = 1024 * 1024 * 1024;
			const result = calculateStorageCost(oneGb);

			expect(result.customerPriceCents).toBe(27);
		});

		it("should calculate annual storage cost correctly", () => {
			// If company stores 50 GB for a year
			const fiftyGb = 50 * 1024 * 1024 * 1024;
			const monthlyCost = calculateStorageCost(fiftyGb);

			// Monthly customer cost: 50 * 27 = 1350 cents = $13.50
			expect(monthlyCost.customerPriceCents).toBe(1350);

			// Annual cost: 12 * $13.50 = $162.00
			const annualCost = monthlyCost.customerPriceCents * 12;
			expect(annualCost).toBe(16200); // $162.00
		});
	});

	describe("Integration with Billing", () => {
		it("should produce values compatible with billing aggregation", () => {
			const storageBytes = 5 * 1024 * 1024 * 1024; // 5 GB
			const costs = calculateStorageCost(storageBytes);

			// These values should be integers (cents) for database storage
			expect(Number.isInteger(costs.providerCostCents)).toBe(true);
			expect(Number.isInteger(costs.customerPriceCents)).toBe(true);

			// GB should be a reasonable decimal
			expect(costs.gb).toBe(5);
		});
	});
});
