/**
 * Billing Integration Tests
 *
 * Tests for the complete billing system integration.
 * Ensures all 8 billable items work together correctly for accurate invoicing.
 */

import { describe, it, expect } from "vitest";
import {
	BASE_FEE_CENTS,
	MARKUP_MULTIPLIER,
	EMAIL_PRICING,
	SMS_PRICING,
	CALL_PRICING,
	AI_CHAT_PRICING,
	AI_PHONE_PRICING,
	STORAGE_PRICING,
	AUTOMATION_PRICING,
	calculateBilling,
	formatCentsToDollars,
	type BillingUsage,
} from "../pricing";
import { calculateStorageCost } from "@/lib/analytics/storage-tracker";
import { calculateAutomationCost } from "@/lib/analytics/automation-tracker";
import { calculateVoiceAICost } from "@/lib/analytics/ai-tracker";

describe("Billing Integration", () => {
	describe("Marketing Page Consistency", () => {
		/**
		 * These tests verify that our pricing matches exactly what's shown
		 * on the marketing pricing page.
		 */

		it("should have $200/month base fee", () => {
			expect(BASE_FEE_CENTS).toBe(20000);
			expect(formatCentsToDollars(BASE_FEE_CENTS)).toBe("$200.00");
		});

		it("should have 3x markup (200% markup)", () => {
			expect(MARKUP_MULTIPLIER).toBe(3);
		});

		it("should have correct email pricing ($0.0003/email)", () => {
			// $0.0003 = 0.03 cents
			expect(EMAIL_PRICING.customerPricePerEmail).toBe(0.03);
			expect(formatCentsToDollars(0.03)).toBe("$0.00"); // Too small to display
		});

		it("should have correct SMS pricing ($0.024/text)", () => {
			// $0.024 = 2.4 cents
			expect(SMS_PRICING.customerPricePerSms).toBe(2.4);
		});

		it("should have correct inbound call pricing ($0.012/min)", () => {
			// $0.012 = 1.2 cents
			expect(CALL_PRICING.inbound.customerPricePerMinute).toBe(1.2);
		});

		it("should have correct outbound call pricing ($0.03/min)", () => {
			// $0.03 = 3.0 cents
			expect(CALL_PRICING.outbound.customerPricePerMinute).toBe(3.0);
		});

		it("should have correct AI chat pricing ($0.15/chat)", () => {
			// $0.15 = 15 cents
			expect(AI_CHAT_PRICING.customerPricePerChat).toBe(15);
		});

		it("should have correct AI phone pricing ($0.18/min)", () => {
			// $0.18 = 18 cents
			expect(AI_PHONE_PRICING.customerPricePerMinute).toBe(18);
		});

		it("should have correct storage pricing ($0.27/GB)", () => {
			// $0.27 = 27 cents
			expect(STORAGE_PRICING.customerPricePerGb).toBe(27);
		});

		it("should have correct automation pricing ($9/unit)", () => {
			// $9.00 = 900 cents
			expect(AUTOMATION_PRICING.customerPricePerMonth).toBe(900);
		});
	});

	describe("3x Markup Verification", () => {
		/**
		 * Verify all billable items maintain the 3x markup ratio
		 */

		it("Email: 3x markup", () => {
			expect(EMAIL_PRICING.customerPricePerEmail).toBe(
				EMAIL_PRICING.providerCostPerEmail * MARKUP_MULTIPLIER
			);
		});

		it("SMS: 3x markup", () => {
			expect(SMS_PRICING.customerPricePerSms).toBeCloseTo(
				SMS_PRICING.providerCostPerSms * MARKUP_MULTIPLIER,
				10
			);
		});

		it("Inbound Calls: 3x markup", () => {
			expect(CALL_PRICING.inbound.customerPricePerMinute).toBeCloseTo(
				CALL_PRICING.inbound.providerCostPerMinute * MARKUP_MULTIPLIER,
				10
			);
		});

		it("Outbound Calls: 3x markup", () => {
			expect(CALL_PRICING.outbound.customerPricePerMinute).toBe(
				CALL_PRICING.outbound.providerCostPerMinute * MARKUP_MULTIPLIER
			);
		});

		it("AI Chat: 3x markup", () => {
			expect(AI_CHAT_PRICING.customerPricePerChat).toBe(
				AI_CHAT_PRICING.providerCostPerChat * MARKUP_MULTIPLIER
			);
		});

		it("AI Phone: 3x markup", () => {
			expect(AI_PHONE_PRICING.customerPricePerMinute).toBe(
				AI_PHONE_PRICING.providerCostPerMinute * MARKUP_MULTIPLIER
			);
		});

		it("Storage: 3x markup", () => {
			expect(STORAGE_PRICING.customerPricePerGb).toBe(
				STORAGE_PRICING.providerCostPerGb * MARKUP_MULTIPLIER
			);
		});

		it("Automation: 3x markup", () => {
			expect(AUTOMATION_PRICING.customerPricePerMonth).toBe(
				AUTOMATION_PRICING.providerCostPerMonth * MARKUP_MULTIPLIER
			);
		});
	});

	describe("Real-World Billing Scenarios", () => {
		describe("Small Business (Startup)", () => {
			it("should calculate correct monthly bill for light usage", () => {
				const usage: BillingUsage = {
					emailsSent: 500,
					smsSent: 50,
					callMinutesInbound: 30,
					callMinutesOutbound: 20,
					aiChats: 20,
					aiPhoneMinutes: 0,
					storageBytes: 1024 * 1024 * 1024, // 1 GB
					automationUnits: 0,
				};

				const bill = calculateBilling(usage);

				// Base fee: $200
				expect(bill.baseFee).toBe(20000);

				// Email: 500 * 0.03 = 15 cents
				expect(bill.emails.billableCost).toBe(15);

				// SMS: 50 * 2.4 = 120 cents = $1.20
				expect(bill.sms.billableCost).toBe(120);

				// Inbound calls: 30 * 1.2 = 36 cents
				expect(bill.callsInbound.billableCost).toBe(36);

				// Outbound calls: 20 * 3.0 = 60 cents
				expect(bill.callsOutbound.billableCost).toBe(60);

				// AI chats: 20 * 15 = 300 cents = $3.00
				expect(bill.aiChats.billableCost).toBe(300);

				// Storage: 1 GB * 27 = 27 cents
				expect(bill.storage.billableCost).toBe(27);

				// Total usage: 15 + 120 + 36 + 60 + 300 + 27 = 558 cents = $5.58
				expect(bill.totalBillableCost).toBe(558);

				// Grand total: $200 + $5.58 = $205.58
				expect(bill.grandTotal).toBe(20558);
				expect(formatCentsToDollars(bill.grandTotal)).toBe("$205.58");
			});
		});

		describe("Medium Business", () => {
			it("should calculate correct monthly bill for moderate usage", () => {
				const usage: BillingUsage = {
					emailsSent: 5000,
					smsSent: 500,
					callMinutesInbound: 200,
					callMinutesOutbound: 150,
					aiChats: 100,
					aiPhoneMinutes: 30,
					storageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
					automationUnits: 1,
				};

				const bill = calculateBilling(usage);

				// Base fee: $200
				expect(bill.baseFee).toBe(20000);

				// Email: 5000 * 0.03 = 150 cents = $1.50
				expect(bill.emails.billableCost).toBe(150);

				// SMS: 500 * 2.4 = 1200 cents = $12.00
				expect(bill.sms.billableCost).toBe(1200);

				// Inbound calls: 200 * 1.2 = 240 cents = $2.40
				expect(bill.callsInbound.billableCost).toBe(240);

				// Outbound calls: 150 * 3.0 = 450 cents = $4.50
				expect(bill.callsOutbound.billableCost).toBe(450);

				// AI chats: 100 * 15 = 1500 cents = $15.00
				expect(bill.aiChats.billableCost).toBe(1500);

				// AI phone: 30 * 18 = 540 cents = $5.40
				expect(bill.aiPhone.billableCost).toBe(540);

				// Storage: 10 GB * 27 = 270 cents = $2.70
				expect(bill.storage.billableCost).toBe(270);

				// Automation: 1 * 900 = 900 cents = $9.00
				expect(bill.automation.billableCost).toBe(900);

				// Total usage: 150 + 1200 + 240 + 450 + 1500 + 540 + 270 + 900 = 5250 cents = $52.50
				expect(bill.totalBillableCost).toBe(5250);

				// Grand total: $200 + $52.50 = $252.50
				expect(bill.grandTotal).toBe(25250);
				expect(formatCentsToDollars(bill.grandTotal)).toBe("$252.50");
			});
		});

		describe("Enterprise Business", () => {
			it("should calculate correct monthly bill for heavy usage", () => {
				const usage: BillingUsage = {
					emailsSent: 100000,
					smsSent: 5000,
					callMinutesInbound: 2000,
					callMinutesOutbound: 1500,
					aiChats: 500,
					aiPhoneMinutes: 300,
					storageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
					automationUnits: 5,
				};

				const bill = calculateBilling(usage);

				// Base fee: $200
				expect(bill.baseFee).toBe(20000);

				// Email: 100000 * 0.03 = 3000 cents = $30.00
				expect(bill.emails.billableCost).toBe(3000);

				// SMS: 5000 * 2.4 = 12000 cents = $120.00
				expect(bill.sms.billableCost).toBe(12000);

				// Inbound calls: 2000 * 1.2 = 2400 cents = $24.00
				expect(bill.callsInbound.billableCost).toBe(2400);

				// Outbound calls: 1500 * 3.0 = 4500 cents = $45.00
				expect(bill.callsOutbound.billableCost).toBe(4500);

				// AI chats: 500 * 15 = 7500 cents = $75.00
				expect(bill.aiChats.billableCost).toBe(7500);

				// AI phone: 300 * 18 = 5400 cents = $54.00
				expect(bill.aiPhone.billableCost).toBe(5400);

				// Storage: 100 GB * 27 = 2700 cents = $27.00
				expect(bill.storage.billableCost).toBe(2700);

				// Automation: 5 * 900 = 4500 cents = $45.00
				expect(bill.automation.billableCost).toBe(4500);

				// Total usage: 3000 + 12000 + 2400 + 4500 + 7500 + 5400 + 2700 + 4500 = 42000 cents = $420.00
				expect(bill.totalBillableCost).toBe(42000);

				// Grand total: $200 + $420 = $620.00
				expect(bill.grandTotal).toBe(62000);
				expect(formatCentsToDollars(bill.grandTotal)).toBe("$620.00");
			});
		});
	});

	describe("Cross-Module Consistency", () => {
		/**
		 * Test that different modules calculate costs consistently
		 */

		it("storage tracker matches pricing module", () => {
			const storageBytes = 5 * 1024 * 1024 * 1024; // 5 GB

			// From storage-tracker
			const trackerCosts = calculateStorageCost(storageBytes);

			// From pricing module
			const gb = storageBytes / STORAGE_PRICING.bytesPerGb;
			const pricingCost = Math.round(gb * STORAGE_PRICING.customerPricePerGb);

			expect(trackerCosts.customerPriceCents).toBe(pricingCost);
		});

		it("automation tracker matches pricing module", () => {
			const executions = 50000;

			// From automation-tracker
			const trackerCosts = calculateAutomationCost(executions);

			// Calculate expected: 0.5 units * 900 cents = 450 cents
			const expectedUnits = executions / AUTOMATION_PRICING.invocationsPerUnit;
			const expectedCost = Math.round(expectedUnits * AUTOMATION_PRICING.customerPricePerMonth);

			expect(trackerCosts.customerPriceCents).toBe(expectedCost);
		});

		it("voice AI tracker matches pricing module", () => {
			const durationSeconds = 300; // 5 minutes

			// From ai-tracker
			const trackerCosts = calculateVoiceAICost(durationSeconds);

			// Calculate expected: 5 minutes * 18 cents = 90 cents
			const minutes = durationSeconds / 60;
			const expectedCost = Math.round(minutes * AI_PHONE_PRICING.customerPricePerMinute * 100) / 100;

			expect(trackerCosts.customerPriceCents).toBe(expectedCost);
		});
	});

	describe("Billing Data Aggregation", () => {
		/**
		 * Test that the billing calculation matches billing_usage table structure
		 */

		it("should produce all required fields for billing_usage table", () => {
			const usage: BillingUsage = {
				emailsSent: 1000,
				smsSent: 100,
				callMinutesInbound: 50,
				callMinutesOutbound: 50,
				aiChats: 50,
				aiPhoneMinutes: 30,
				storageBytes: 5 * 1024 * 1024 * 1024,
				automationUnits: 1,
			};

			const bill = calculateBilling(usage);

			// Verify all fields exist
			expect(bill.baseFee).toBeDefined();
			expect(bill.emails.quantity).toBeDefined();
			expect(bill.emails.providerCost).toBeDefined();
			expect(bill.emails.billableCost).toBeDefined();
			expect(bill.sms.quantity).toBeDefined();
			expect(bill.sms.providerCost).toBeDefined();
			expect(bill.sms.billableCost).toBeDefined();
			expect(bill.callsInbound.quantity).toBeDefined();
			expect(bill.callsInbound.providerCost).toBeDefined();
			expect(bill.callsInbound.billableCost).toBeDefined();
			expect(bill.callsOutbound.quantity).toBeDefined();
			expect(bill.callsOutbound.providerCost).toBeDefined();
			expect(bill.callsOutbound.billableCost).toBeDefined();
			expect(bill.aiChats.quantity).toBeDefined();
			expect(bill.aiChats.providerCost).toBeDefined();
			expect(bill.aiChats.billableCost).toBeDefined();
			expect(bill.aiPhone.quantity).toBeDefined();
			expect(bill.aiPhone.providerCost).toBeDefined();
			expect(bill.aiPhone.billableCost).toBeDefined();
			expect(bill.storage.quantity).toBeDefined();
			expect(bill.storage.providerCost).toBeDefined();
			expect(bill.storage.billableCost).toBeDefined();
			expect(bill.automation.quantity).toBeDefined();
			expect(bill.automation.providerCost).toBeDefined();
			expect(bill.automation.billableCost).toBeDefined();
			expect(bill.totalProviderCost).toBeDefined();
			expect(bill.totalBillableCost).toBeDefined();
			expect(bill.grandTotal).toBeDefined();
		});

		it("should have integer values for database storage", () => {
			const usage: BillingUsage = {
				emailsSent: 1234,
				smsSent: 567,
				callMinutesInbound: 89,
				callMinutesOutbound: 123,
				aiChats: 45,
				aiPhoneMinutes: 67,
				storageBytes: 3 * 1024 * 1024 * 1024,
				automationUnits: 2,
			};

			const bill = calculateBilling(usage);

			// All costs should be integers (cents)
			expect(Number.isInteger(bill.baseFee)).toBe(true);
			expect(Number.isInteger(bill.emails.providerCost)).toBe(true);
			expect(Number.isInteger(bill.emails.billableCost)).toBe(true);
			expect(Number.isInteger(bill.sms.providerCost)).toBe(true);
			expect(Number.isInteger(bill.sms.billableCost)).toBe(true);
			expect(Number.isInteger(bill.callsInbound.providerCost)).toBe(true);
			expect(Number.isInteger(bill.callsInbound.billableCost)).toBe(true);
			expect(Number.isInteger(bill.callsOutbound.providerCost)).toBe(true);
			expect(Number.isInteger(bill.callsOutbound.billableCost)).toBe(true);
			expect(Number.isInteger(bill.aiChats.providerCost)).toBe(true);
			expect(Number.isInteger(bill.aiChats.billableCost)).toBe(true);
			expect(Number.isInteger(bill.aiPhone.providerCost)).toBe(true);
			expect(Number.isInteger(bill.aiPhone.billableCost)).toBe(true);
			expect(Number.isInteger(bill.storage.providerCost)).toBe(true);
			expect(Number.isInteger(bill.storage.billableCost)).toBe(true);
			expect(Number.isInteger(bill.automation.providerCost)).toBe(true);
			expect(Number.isInteger(bill.automation.billableCost)).toBe(true);
			expect(Number.isInteger(bill.totalProviderCost)).toBe(true);
			expect(Number.isInteger(bill.totalBillableCost)).toBe(true);
			expect(Number.isInteger(bill.grandTotal)).toBe(true);
		});
	});

	describe("Revenue Calculations", () => {
		/**
		 * Test profit margin calculations for business analytics
		 */

		it("should calculate correct profit margin", () => {
			const usage: BillingUsage = {
				emailsSent: 10000,
				smsSent: 1000,
				callMinutesInbound: 500,
				callMinutesOutbound: 500,
				aiChats: 200,
				aiPhoneMinutes: 100,
				storageBytes: 50 * 1024 * 1024 * 1024,
				automationUnits: 3,
			};

			const bill = calculateBilling(usage);

			// Profit = Customer Price - Provider Cost
			const profit = bill.totalBillableCost - bill.totalProviderCost;

			// With 3x markup, profit should be ~66.67% of revenue (2x cost = profit)
			const profitMargin = (profit / bill.totalBillableCost) * 100;

			// Profit margin should be approximately 66.67%
			expect(profitMargin).toBeCloseTo(66.67, 0);
		});

		it("should have provider cost as 1/3 of customer price", () => {
			const usage: BillingUsage = {
				emailsSent: 5000,
				smsSent: 500,
				callMinutesInbound: 200,
				callMinutesOutbound: 200,
				aiChats: 100,
				aiPhoneMinutes: 50,
				storageBytes: 20 * 1024 * 1024 * 1024,
				automationUnits: 2,
			};

			const bill = calculateBilling(usage);

			// Provider cost should be ~1/3 of billable cost
			const ratio = bill.totalProviderCost / bill.totalBillableCost;
			expect(ratio).toBeCloseTo(0.333, 1);
		});
	});

	describe("Edge Cases", () => {
		it("should handle all zeros correctly", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const bill = calculateBilling(usage);

			expect(bill.totalProviderCost).toBe(0);
			expect(bill.totalBillableCost).toBe(0);
			expect(bill.grandTotal).toBe(BASE_FEE_CENTS);
		});

		it("should handle very large numbers", () => {
			const usage: BillingUsage = {
				emailsSent: 10000000, // 10 million
				smsSent: 100000,
				callMinutesInbound: 100000,
				callMinutesOutbound: 100000,
				aiChats: 10000,
				aiPhoneMinutes: 10000,
				storageBytes: 1024 * 1024 * 1024 * 1024, // 1 TB
				automationUnits: 100,
			};

			const bill = calculateBilling(usage);

			// Just verify it doesn't crash and produces valid numbers
			expect(bill.grandTotal).toBeGreaterThan(BASE_FEE_CENTS);
			expect(Number.isFinite(bill.grandTotal)).toBe(true);
		});
	});
});
