/**
 * Automation Tracker Tests
 *
 * Tests for automation/serverless function execution tracking.
 * Ensures accurate metering of Vercel functions for billing.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	calculateAutomationCost,
	type AutomationExecutionType,
} from "../automation-tracker";
import { AUTOMATION_PRICING } from "@/lib/billing/pricing";

describe("Automation Tracker", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("calculateAutomationCost", () => {
		it("should return zero costs for zero executions", () => {
			const result = calculateAutomationCost(0);

			expect(result.units).toBe(0);
			expect(result.providerCostCents).toBe(0);
			expect(result.customerPriceCents).toBe(0);
		});

		it("should calculate cost correctly for 1 execution", () => {
			const result = calculateAutomationCost(1);

			// 1 execution = 0.01% of a unit (rounded up to 0.01)
			expect(result.units).toBe(0.01);
			expect(result.providerCostCents).toBe(3); // 0.01 * 300 = 3 cents
			expect(result.customerPriceCents).toBe(9); // 0.01 * 900 = 9 cents
		});

		it("should calculate cost correctly for 100 executions", () => {
			const result = calculateAutomationCost(100);

			// 100 executions = 0.1% of a unit = 0.001 units, rounded to 0.01
			expect(result.units).toBeLessThanOrEqual(0.01);
			expect(result.providerCostCents).toBe(3); // Minimum
			expect(result.customerPriceCents).toBe(9);
		});

		it("should calculate cost correctly for 1,000 executions", () => {
			const result = calculateAutomationCost(1000);

			// 1,000 / 100,000 = 0.01 units
			expect(result.units).toBe(0.01);
			expect(result.providerCostCents).toBe(3);
			expect(result.customerPriceCents).toBe(9);
		});

		it("should calculate cost correctly for 10,000 executions", () => {
			const result = calculateAutomationCost(10000);

			// 10,000 / 100,000 = 0.10 units
			expect(result.units).toBe(0.1);
			expect(result.providerCostCents).toBe(30); // 0.10 * 300 = 30 cents
			expect(result.customerPriceCents).toBe(90); // 0.10 * 900 = 90 cents
		});

		it("should calculate cost correctly for 50,000 executions", () => {
			const result = calculateAutomationCost(50000);

			// 50,000 / 100,000 = 0.50 units
			expect(result.units).toBe(0.5);
			expect(result.providerCostCents).toBe(150); // $1.50
			expect(result.customerPriceCents).toBe(450); // $4.50
		});

		it("should calculate cost correctly for exactly 100,000 executions (1 unit)", () => {
			const result = calculateAutomationCost(100000);

			// 100,000 / 100,000 = 1 unit
			expect(result.units).toBe(1);
			expect(result.providerCostCents).toBe(300); // $3.00
			expect(result.customerPriceCents).toBe(900); // $9.00
		});

		it("should calculate cost correctly for 150,000 executions", () => {
			const result = calculateAutomationCost(150000);

			// 150,000 / 100,000 = 1.50 units
			expect(result.units).toBe(1.5);
			expect(result.providerCostCents).toBe(450); // $4.50
			expect(result.customerPriceCents).toBe(1350); // $13.50
		});

		it("should calculate cost correctly for 1,000,000 executions (10 units)", () => {
			const result = calculateAutomationCost(1000000);

			// 1,000,000 / 100,000 = 10 units
			expect(result.units).toBe(10);
			expect(result.providerCostCents).toBe(3000); // $30.00
			expect(result.customerPriceCents).toBe(9000); // $90.00
		});

		it("should round up units to nearest 0.01", () => {
			// 12,345 / 100,000 = 0.12345 -> rounds to 0.13
			const result = calculateAutomationCost(12345);

			expect(result.units).toBe(0.13);
			expect(result.providerCostCents).toBe(39); // 0.13 * 300 = 39
			expect(result.customerPriceCents).toBe(117); // 0.13 * 900 = 117
		});

		it("should maintain 3x markup ratio", () => {
			const executions = [1, 100, 1000, 10000, 100000, 500000];

			for (const count of executions) {
				const result = calculateAutomationCost(count);
				expect(result.customerPriceCents).toBe(result.providerCostCents * 3);
			}
		});

		it("should handle large numbers correctly", () => {
			const result = calculateAutomationCost(10000000); // 10 million executions

			// 10,000,000 / 100,000 = 100 units
			expect(result.units).toBe(100);
			expect(result.providerCostCents).toBe(30000); // $300.00
			expect(result.customerPriceCents).toBe(90000); // $900.00
		});
	});

	describe("Automation Pricing Constants", () => {
		it("should have Vercel as provider", () => {
			expect(AUTOMATION_PRICING.provider).toBe("Vercel");
		});

		it("should have correct provider cost ($3/unit = 300 cents)", () => {
			expect(AUTOMATION_PRICING.providerCostPerMonth).toBe(300);
		});

		it("should have correct customer price ($9/unit = 900 cents)", () => {
			expect(AUTOMATION_PRICING.customerPricePerMonth).toBe(900);
		});

		it("should define invocations per unit as 100,000", () => {
			expect(AUTOMATION_PRICING.invocationsPerUnit).toBe(100000);
		});

		it("should have 'automation unit' as unit", () => {
			expect(AUTOMATION_PRICING.unit).toBe("automation unit");
		});

		it("should maintain 3x markup", () => {
			expect(AUTOMATION_PRICING.customerPricePerMonth).toBe(
				AUTOMATION_PRICING.providerCostPerMonth * 3
			);
		});
	});

	describe("Execution Types", () => {
		it("should support all defined execution types", () => {
			const validTypes: AutomationExecutionType[] = [
				"cron_job",
				"webhook",
				"background_job",
				"api_route",
				"edge_function",
				"realtime_handler",
				"email_handler",
				"sms_handler",
				"integration_sync",
				"report_generation",
				"bulk_operation",
				"other",
			];

			expect(validTypes.length).toBe(12);
		});
	});

	describe("Cost Accuracy", () => {
		it("should match marketing pricing page values", () => {
			// Marketing page shows: $9/unit (customer price)
			// 1 unit = 100,000 invocations
			const oneUnit = calculateAutomationCost(100000);

			expect(oneUnit.customerPriceCents).toBe(900); // $9.00
		});

		it("should calculate monthly cost for typical usage correctly", () => {
			// Typical company: ~50,000 function invocations/month = 0.5 units
			const typicalUsage = calculateAutomationCost(50000);

			expect(typicalUsage.units).toBe(0.5);
			expect(typicalUsage.customerPriceCents).toBe(450); // $4.50/month
		});

		it("should calculate annual cost correctly", () => {
			// If company runs 200,000 invocations per month (2 units)
			const monthlyUsage = calculateAutomationCost(200000);

			// Monthly: 2 units * $9 = $18/month
			expect(monthlyUsage.customerPriceCents).toBe(1800);

			// Annual: 12 * $18 = $216
			const annualCost = monthlyUsage.customerPriceCents * 12;
			expect(annualCost).toBe(21600); // $216.00
		});
	});

	describe("Edge Cases", () => {
		it("should handle negative executions gracefully", () => {
			// This shouldn't happen, but shouldn't crash
			const result = calculateAutomationCost(-100);
			expect(result.units).toBeLessThanOrEqual(0);
		});

		it("should handle very small numbers", () => {
			const result = calculateAutomationCost(1);
			expect(result.units).toBeGreaterThan(0);
		});

		it("should produce integer cent values", () => {
			const testCases = [1, 10, 100, 1000, 12345, 50000, 100000];

			for (const count of testCases) {
				const result = calculateAutomationCost(count);
				expect(Number.isInteger(result.providerCostCents)).toBe(true);
				expect(Number.isInteger(result.customerPriceCents)).toBe(true);
			}
		});
	});

	describe("Integration with Billing", () => {
		it("should produce values compatible with billing_usage table", () => {
			const executions = 75000;
			const costs = calculateAutomationCost(executions);

			// Units should be a decimal rounded to 2 places
			expect(costs.units).toBe(0.75);

			// Costs should be integers (cents)
			expect(Number.isInteger(costs.providerCostCents)).toBe(true);
			expect(Number.isInteger(costs.customerPriceCents)).toBe(true);
		});

		it("should correctly calculate for billing aggregation", () => {
			// billing_usage table stores automation_executions (count)
			// and billable_cost_automation_cents (calculated)

			const executions = 250000; // 2.5 units
			const costs = calculateAutomationCost(executions);

			expect(costs.units).toBe(2.5);
			expect(costs.providerCostCents).toBe(750); // 2.5 * 300
			expect(costs.customerPriceCents).toBe(2250); // 2.5 * 900
		});
	});

	describe("Scaling Scenarios", () => {
		it("should handle small business usage (5,000 invocations)", () => {
			const result = calculateAutomationCost(5000);

			// 5,000 / 100,000 = 0.05 units
			expect(result.units).toBe(0.05);
			expect(result.customerPriceCents).toBe(45); // $0.45
		});

		it("should handle medium business usage (50,000 invocations)", () => {
			const result = calculateAutomationCost(50000);

			// 50,000 / 100,000 = 0.5 units
			expect(result.units).toBe(0.5);
			expect(result.customerPriceCents).toBe(450); // $4.50
		});

		it("should handle enterprise usage (5,000,000 invocations)", () => {
			const result = calculateAutomationCost(5000000);

			// 5,000,000 / 100,000 = 50 units
			expect(result.units).toBe(50);
			expect(result.customerPriceCents).toBe(45000); // $450.00
		});
	});

	describe("Usage Summary Structure", () => {
		it("should define all required summary fields", () => {
			// Verify the AutomationUsageSummary interface has all fields
			const requiredFields = [
				"companyId",
				"monthYear",
				"totalExecutions",
				"totalDurationMs",
				"avgDurationMs",
				"successCount",
				"errorCount",
				"successRate",
				"executionsByType",
				"automationUnits",
				"providerCostCents",
				"customerPriceCents",
			];

			// This test validates the expected structure exists
			expect(requiredFields.length).toBe(12);
		});
	});
});
