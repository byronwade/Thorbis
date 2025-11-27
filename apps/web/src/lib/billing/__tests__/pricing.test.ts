/**
 * Pricing Module Tests
 *
 * Tests for pricing constants and billing calculations.
 * Ensures all billable items are calculated correctly with 3x markup.
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
	getCurrentMonthYear,
	type BillingUsage,
} from "../pricing";

describe("Pricing Constants", () => {
	describe("Base Fee", () => {
		it("should be $200/month (20000 cents)", () => {
			expect(BASE_FEE_CENTS).toBe(20000);
		});

		it("should format correctly as dollars", () => {
			expect(formatCentsToDollars(BASE_FEE_CENTS)).toBe("$200.00");
		});
	});

	describe("Markup Multiplier", () => {
		it("should be 3x (200% markup)", () => {
			expect(MARKUP_MULTIPLIER).toBe(3);
		});
	});

	describe("Email Pricing", () => {
		it("should have correct provider cost ($0.0001/email = 0.01 cents)", () => {
			expect(EMAIL_PRICING.providerCostPerEmail).toBe(0.01);
		});

		it("should have correct customer price ($0.0003/email = 0.03 cents)", () => {
			expect(EMAIL_PRICING.customerPricePerEmail).toBe(0.03);
		});

		it("should maintain 3x markup ratio", () => {
			expect(EMAIL_PRICING.customerPricePerEmail).toBe(
				EMAIL_PRICING.providerCostPerEmail * MARKUP_MULTIPLIER
			);
		});

		it("should have SendGrid as provider", () => {
			expect(EMAIL_PRICING.provider).toBe("SendGrid");
		});
	});

	describe("SMS Pricing", () => {
		it("should have correct provider cost ($0.008/SMS = 0.8 cents)", () => {
			expect(SMS_PRICING.providerCostPerSms).toBe(0.8);
		});

		it("should have correct customer price ($0.024/SMS = 2.4 cents)", () => {
			expect(SMS_PRICING.customerPricePerSms).toBe(2.4);
		});

		it("should maintain 3x markup ratio", () => {
			expect(SMS_PRICING.customerPricePerSms).toBeCloseTo(
				SMS_PRICING.providerCostPerSms * MARKUP_MULTIPLIER,
				10
			);
		});

		it("should have Twilio as provider", () => {
			expect(SMS_PRICING.provider).toBe("Twilio");
		});
	});

	describe("Call Pricing", () => {
		it("should have correct inbound provider cost ($0.004/min = 0.4 cents)", () => {
			expect(CALL_PRICING.inbound.providerCostPerMinute).toBe(0.4);
		});

		it("should have correct inbound customer price ($0.012/min = 1.2 cents)", () => {
			expect(CALL_PRICING.inbound.customerPricePerMinute).toBe(1.2);
		});

		it("should have correct outbound provider cost ($0.01/min = 1.0 cents)", () => {
			expect(CALL_PRICING.outbound.providerCostPerMinute).toBe(1.0);
		});

		it("should have correct outbound customer price ($0.03/min = 3.0 cents)", () => {
			expect(CALL_PRICING.outbound.customerPricePerMinute).toBe(3.0);
		});

		it("should maintain 3x markup ratio for inbound", () => {
			expect(CALL_PRICING.inbound.customerPricePerMinute).toBeCloseTo(
				CALL_PRICING.inbound.providerCostPerMinute * MARKUP_MULTIPLIER,
				10
			);
		});

		it("should maintain 3x markup ratio for outbound", () => {
			expect(CALL_PRICING.outbound.customerPricePerMinute).toBe(
				CALL_PRICING.outbound.providerCostPerMinute * MARKUP_MULTIPLIER
			);
		});
	});

	describe("AI Chat Pricing", () => {
		it("should have correct provider cost ($0.05/chat = 5 cents)", () => {
			expect(AI_CHAT_PRICING.providerCostPerChat).toBe(5);
		});

		it("should have correct customer price ($0.15/chat = 15 cents)", () => {
			expect(AI_CHAT_PRICING.customerPricePerChat).toBe(15);
		});

		it("should maintain 3x markup ratio", () => {
			expect(AI_CHAT_PRICING.customerPricePerChat).toBe(
				AI_CHAT_PRICING.providerCostPerChat * MARKUP_MULTIPLIER
			);
		});

		it("should have Anthropic as provider", () => {
			expect(AI_CHAT_PRICING.provider).toBe("Anthropic");
		});
	});

	describe("AI Phone Pricing", () => {
		it("should have correct provider cost ($0.06/min = 6 cents)", () => {
			expect(AI_PHONE_PRICING.providerCostPerMinute).toBe(6);
		});

		it("should have correct customer price ($0.18/min = 18 cents)", () => {
			expect(AI_PHONE_PRICING.customerPricePerMinute).toBe(18);
		});

		it("should maintain 3x markup ratio", () => {
			expect(AI_PHONE_PRICING.customerPricePerMinute).toBe(
				AI_PHONE_PRICING.providerCostPerMinute * MARKUP_MULTIPLIER
			);
		});

		it("should list all providers", () => {
			expect(AI_PHONE_PRICING.providers).toContain("Twilio");
			expect(AI_PHONE_PRICING.providers).toContain("Deepgram");
			expect(AI_PHONE_PRICING.providers).toContain("Anthropic");
			expect(AI_PHONE_PRICING.providers).toContain("ElevenLabs");
		});
	});

	describe("Storage Pricing", () => {
		it("should have correct provider cost ($0.09/GB = 9 cents)", () => {
			expect(STORAGE_PRICING.providerCostPerGb).toBe(9);
		});

		it("should have correct customer price ($0.27/GB = 27 cents)", () => {
			expect(STORAGE_PRICING.customerPricePerGb).toBe(27);
		});

		it("should maintain 3x markup ratio", () => {
			expect(STORAGE_PRICING.customerPricePerGb).toBe(
				STORAGE_PRICING.providerCostPerGb * MARKUP_MULTIPLIER
			);
		});

		it("should have correct bytes per GB", () => {
			expect(STORAGE_PRICING.bytesPerGb).toBe(1024 * 1024 * 1024);
		});
	});

	describe("Automation Pricing", () => {
		it("should have correct provider cost ($3/unit = 300 cents)", () => {
			expect(AUTOMATION_PRICING.providerCostPerMonth).toBe(300);
		});

		it("should have correct customer price ($9/unit = 900 cents)", () => {
			expect(AUTOMATION_PRICING.customerPricePerMonth).toBe(900);
		});

		it("should maintain 3x markup ratio", () => {
			expect(AUTOMATION_PRICING.customerPricePerMonth).toBe(
				AUTOMATION_PRICING.providerCostPerMonth * MARKUP_MULTIPLIER
			);
		});

		it("should define invocations per unit as 100,000", () => {
			expect(AUTOMATION_PRICING.invocationsPerUnit).toBe(100000);
		});
	});
});

describe("calculateBilling", () => {
	describe("Zero Usage", () => {
		it("should return base fee only when no usage", () => {
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

			const result = calculateBilling(usage);

			expect(result.baseFee).toBe(BASE_FEE_CENTS);
			expect(result.totalProviderCost).toBe(0);
			expect(result.totalBillableCost).toBe(0);
			expect(result.grandTotal).toBe(BASE_FEE_CENTS);
		});
	});

	describe("Email Billing", () => {
		it("should calculate email costs correctly for 1000 emails", () => {
			const usage: BillingUsage = {
				emailsSent: 1000,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.emails.quantity).toBe(1000);
			expect(result.emails.providerCost).toBe(10); // 1000 * 0.01 = 10 cents
			expect(result.emails.billableCost).toBe(30); // 1000 * 0.03 = 30 cents
		});

		it("should calculate email costs for 100,000 emails", () => {
			const usage: BillingUsage = {
				emailsSent: 100000,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.emails.quantity).toBe(100000);
			expect(result.emails.providerCost).toBe(1000); // $10.00
			expect(result.emails.billableCost).toBe(3000); // $30.00
		});
	});

	describe("SMS Billing", () => {
		it("should calculate SMS costs correctly for 500 messages", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 500,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.sms.quantity).toBe(500);
			expect(result.sms.providerCost).toBe(400); // 500 * 0.8 = 400 cents ($4.00)
			expect(result.sms.billableCost).toBe(1200); // 500 * 2.4 = 1200 cents ($12.00)
		});
	});

	describe("Call Billing", () => {
		it("should calculate inbound call costs correctly", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 100,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.callsInbound.quantity).toBe(100);
			expect(result.callsInbound.providerCost).toBe(40); // 100 * 0.4 = 40 cents
			expect(result.callsInbound.billableCost).toBe(120); // 100 * 1.2 = 120 cents
		});

		it("should calculate outbound call costs correctly", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 100,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.callsOutbound.quantity).toBe(100);
			expect(result.callsOutbound.providerCost).toBe(100); // 100 * 1.0 = 100 cents
			expect(result.callsOutbound.billableCost).toBe(300); // 100 * 3.0 = 300 cents
		});
	});

	describe("AI Chat Billing", () => {
		it("should calculate AI chat costs correctly for 50 chats", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 50,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.aiChats.quantity).toBe(50);
			expect(result.aiChats.providerCost).toBe(250); // 50 * 5 = 250 cents ($2.50)
			expect(result.aiChats.billableCost).toBe(750); // 50 * 15 = 750 cents ($7.50)
		});
	});

	describe("AI Phone Billing", () => {
		it("should calculate AI phone costs correctly for 30 minutes", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 30,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.aiPhone.quantity).toBe(30);
			expect(result.aiPhone.providerCost).toBe(180); // 30 * 6 = 180 cents ($1.80)
			expect(result.aiPhone.billableCost).toBe(540); // 30 * 18 = 540 cents ($5.40)
		});
	});

	describe("Storage Billing", () => {
		it("should calculate storage costs correctly for 1 GB", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 1024 * 1024 * 1024, // 1 GB
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.storage.quantity).toBe(1);
			expect(result.storage.providerCost).toBe(9); // 1 * 9 = 9 cents
			expect(result.storage.billableCost).toBe(27); // 1 * 27 = 27 cents
		});

		it("should calculate storage costs correctly for 10 GB", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.storage.quantity).toBe(10);
			expect(result.storage.providerCost).toBe(90); // 10 * 9 = 90 cents
			expect(result.storage.billableCost).toBe(270); // 10 * 27 = 270 cents
		});

		it("should handle fractional GB correctly", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 512 * 1024 * 1024, // 0.5 GB
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.storage.quantity).toBe(0.5);
			expect(result.storage.providerCost).toBe(5); // ~4.5 rounded
			expect(result.storage.billableCost).toBe(14); // ~13.5 rounded
		});
	});

	describe("Automation Billing", () => {
		it("should calculate automation costs correctly for 1 unit", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 1,
			};

			const result = calculateBilling(usage);

			expect(result.automation.quantity).toBe(1);
			expect(result.automation.providerCost).toBe(300); // $3.00
			expect(result.automation.billableCost).toBe(900); // $9.00
		});

		it("should calculate automation costs correctly for 5 units", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 5,
			};

			const result = calculateBilling(usage);

			expect(result.automation.quantity).toBe(5);
			expect(result.automation.providerCost).toBe(1500); // $15.00
			expect(result.automation.billableCost).toBe(4500); // $45.00
		});
	});

	describe("Combined Usage", () => {
		it("should calculate grand total correctly with all usage types", () => {
			const usage: BillingUsage = {
				emailsSent: 1000, // 10 cents provider, 30 cents billable
				smsSent: 100, // 80 cents provider, 240 cents billable
				callMinutesInbound: 50, // 20 cents provider, 60 cents billable
				callMinutesOutbound: 50, // 50 cents provider, 150 cents billable
				aiChats: 10, // 50 cents provider, 150 cents billable
				aiPhoneMinutes: 10, // 60 cents provider, 180 cents billable
				storageBytes: 1024 * 1024 * 1024, // 9 cents provider, 27 cents billable
				automationUnits: 1, // 300 cents provider, 900 cents billable
			};

			const result = calculateBilling(usage);

			// Verify totals
			const expectedProviderCost = 10 + 80 + 20 + 50 + 50 + 60 + 9 + 300; // 579
			const expectedBillableCost = 30 + 240 + 60 + 150 + 150 + 180 + 27 + 900; // 1737
			const expectedGrandTotal = BASE_FEE_CENTS + expectedBillableCost; // 20000 + 1737 = 21737

			expect(result.totalProviderCost).toBe(expectedProviderCost);
			expect(result.totalBillableCost).toBe(expectedBillableCost);
			expect(result.grandTotal).toBe(expectedGrandTotal);
		});

		it("should always include base fee in grand total", () => {
			const usage: BillingUsage = {
				emailsSent: 100,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.grandTotal).toBe(BASE_FEE_CENTS + result.totalBillableCost);
			expect(result.grandTotal).toBeGreaterThan(BASE_FEE_CENTS);
		});
	});

	describe("Large Scale Usage", () => {
		it("should handle high volume email correctly", () => {
			const usage: BillingUsage = {
				emailsSent: 1000000, // 1 million emails
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 0,
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.emails.providerCost).toBe(10000); // $100
			expect(result.emails.billableCost).toBe(30000); // $300
		});

		it("should handle large storage correctly (100 GB)", () => {
			const usage: BillingUsage = {
				emailsSent: 0,
				smsSent: 0,
				callMinutesInbound: 0,
				callMinutesOutbound: 0,
				aiChats: 0,
				aiPhoneMinutes: 0,
				storageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
				automationUnits: 0,
			};

			const result = calculateBilling(usage);

			expect(result.storage.providerCost).toBe(900); // $9.00
			expect(result.storage.billableCost).toBe(2700); // $27.00
		});
	});
});

describe("formatCentsToDollars", () => {
	it("should format zero correctly", () => {
		expect(formatCentsToDollars(0)).toBe("$0.00");
	});

	it("should format cents correctly", () => {
		expect(formatCentsToDollars(1)).toBe("$0.01");
		expect(formatCentsToDollars(99)).toBe("$0.99");
	});

	it("should format dollars correctly", () => {
		expect(formatCentsToDollars(100)).toBe("$1.00");
		expect(formatCentsToDollars(1000)).toBe("$10.00");
		expect(formatCentsToDollars(20000)).toBe("$200.00");
	});

	it("should format large amounts correctly", () => {
		expect(formatCentsToDollars(100000)).toBe("$1000.00");
		expect(formatCentsToDollars(1000000)).toBe("$10000.00");
	});

	it("should always show two decimal places", () => {
		expect(formatCentsToDollars(500)).toBe("$5.00");
		expect(formatCentsToDollars(550)).toBe("$5.50");
	});
});

describe("getCurrentMonthYear", () => {
	it("should return current month in YYYY-MM format", () => {
		const result = getCurrentMonthYear();
		expect(result).toMatch(/^\d{4}-\d{2}$/);
	});

	it("should return correct year", () => {
		const result = getCurrentMonthYear();
		const [year] = result.split("-");
		const currentYear = new Date().getFullYear();
		expect(parseInt(year)).toBe(currentYear);
	});

	it("should return correct month", () => {
		const result = getCurrentMonthYear();
		const [, month] = result.split("-");
		const currentMonth = new Date().getMonth() + 1;
		expect(parseInt(month)).toBe(currentMonth);
	});

	it("should pad single-digit months", () => {
		const result = getCurrentMonthYear();
		const [, month] = result.split("-");
		expect(month.length).toBe(2);
	});
});
