/**
 * AI Artifacts System Tests
 *
 * Tests for @ai-sdk-tools/artifacts integration
 * Verifies artifact schemas, definitions, and type safety
 */

import { describe, it, expect, vi } from "vitest";
import { z } from "zod";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock @ai-sdk-tools/artifacts
vi.mock("@ai-sdk-tools/artifacts", () => ({
	artifact: vi.fn((config) => ({
		...config,
		_type: "artifact",
	})),
	getWriter: vi.fn(() => ({
		write: vi.fn(),
		close: vi.fn(),
	})),
}));

// Import after mocks
import {
	// Schemas
	customerCardSchema,
	jobSummarySchema,
	invoiceArtifactSchema,
	scheduleViewSchema,
	chartDataSchema,
	tableDataSchema,
	estimateArtifactSchema,
	// Artifacts
	customerCardArtifact,
	jobSummaryArtifact,
	invoiceArtifact,
	scheduleViewArtifact,
	chartDataArtifact,
	tableDataArtifact,
	estimateArtifact,
	stratosArtifacts,
	ARTIFACT_IDS,
	// Re-exports
	getWriter,
	// Types
	type CustomerCardArtifact,
	type JobSummaryArtifact,
	type InvoiceArtifact,
	type ScheduleViewArtifact,
	type ChartDataArtifact,
	type TableDataArtifact,
	type EstimateArtifact,
	type ArtifactId,
} from "../artifacts";

// =============================================================================
// SCHEMA VALIDATION TESTS
// =============================================================================

describe("Artifact Schemas", () => {
	describe("customerCardSchema", () => {
		it("should validate a complete customer card", () => {
			const validCard: CustomerCardArtifact = {
				id: "cust-123",
				name: "John Doe",
				email: "john@example.com",
				phone: "555-1234",
				address: "123 Main St, City, ST 12345",
				totalJobs: 15,
				totalRevenue: 5000,
				lastServiceDate: "2024-01-15",
				status: "active",
			};

			expect(() => customerCardSchema.parse(validCard)).not.toThrow();
		});

		it("should validate with minimal required fields", () => {
			const minimalCard = {
				id: "cust-456",
				name: "Jane Smith",
			};

			const result = customerCardSchema.parse(minimalCard);
			expect(result.totalJobs).toBe(0); // default value
			expect(result.totalRevenue).toBe(0); // default value
			expect(result.status).toBe("active"); // default value
		});

		it("should validate status enum values", () => {
			const validStatuses = ["active", "inactive", "lead"];

			for (const status of validStatuses) {
				const card = { id: "test", name: "Test", status };
				expect(() => customerCardSchema.parse(card)).not.toThrow();
			}

			const invalidStatus = { id: "test", name: "Test", status: "deleted" };
			expect(() => customerCardSchema.parse(invalidStatus)).toThrow();
		});

		it("should allow optional fields to be undefined", () => {
			const card: CustomerCardArtifact = {
				id: "cust-789",
				name: "No Contact Info",
				totalJobs: 0,
				totalRevenue: 0,
				status: "lead",
			};

			expect(card.email).toBeUndefined();
			expect(card.phone).toBeUndefined();
			expect(() => customerCardSchema.parse(card)).not.toThrow();
		});
	});

	describe("jobSummarySchema", () => {
		it("should validate a complete job summary", () => {
			const validJob: JobSummaryArtifact = {
				id: "job-123",
				title: "HVAC Repair",
				status: "scheduled",
				customerId: "cust-456",
				customerName: "John Doe",
				scheduledDate: "2024-01-20",
				scheduledTime: "09:00",
				assignedTechnician: "tech-1",
				estimatedDuration: 120,
				address: "123 Main St",
			};

			expect(() => jobSummarySchema.parse(validJob)).not.toThrow();
		});

		it("should validate all status values", () => {
			const validStatuses = ["scheduled", "in_progress", "completed", "cancelled", "on_hold"];

			for (const status of validStatuses) {
				const job = {
					id: "job-1",
					title: "Test Job",
					status,
					customerId: "cust-1",
					customerName: "Test",
				};
				expect(() => jobSummarySchema.parse(job)).not.toThrow();
			}
		});

		it("should require mandatory fields", () => {
			const missingCustomerId = {
				id: "job-1",
				title: "Test",
				status: "scheduled",
				customerName: "Test",
			};

			expect(() => jobSummarySchema.parse(missingCustomerId)).toThrow();
		});
	});

	describe("invoiceArtifactSchema", () => {
		it("should validate a complete invoice", () => {
			const validInvoice: InvoiceArtifact = {
				id: "inv-123",
				invoiceNumber: "INV-2024-001",
				customerId: "cust-456",
				customerName: "John Doe",
				status: "sent",
				subtotal: 500,
				tax: 40,
				total: 540,
				dueDate: "2024-02-15",
				lineItems: [
					{ description: "HVAC Service Call", quantity: 1, unitPrice: 150, total: 150 },
					{ description: "Parts - Capacitor", quantity: 2, unitPrice: 75, total: 150 },
					{ description: "Labor", quantity: 2, unitPrice: 100, total: 200 },
				],
			};

			expect(() => invoiceArtifactSchema.parse(validInvoice)).not.toThrow();
		});

		it("should validate all invoice statuses", () => {
			const validStatuses = ["draft", "sent", "viewed", "paid", "overdue", "cancelled"];

			for (const status of validStatuses) {
				const invoice = {
					id: "inv-1",
					invoiceNumber: "INV-001",
					customerId: "cust-1",
					customerName: "Test",
					status,
					subtotal: 100,
					tax: 8,
					total: 108,
					lineItems: [],
				};
				expect(() => invoiceArtifactSchema.parse(invoice)).not.toThrow();
			}
		});

		it("should require line items array (can be empty)", () => {
			const withEmptyLineItems = {
				id: "inv-1",
				invoiceNumber: "INV-001",
				customerId: "cust-1",
				customerName: "Test",
				status: "draft",
				subtotal: 0,
				tax: 0,
				total: 0,
				lineItems: [],
			};

			expect(() => invoiceArtifactSchema.parse(withEmptyLineItems)).not.toThrow();
		});

		it("should validate line item structure", () => {
			const invalidLineItem = {
				id: "inv-1",
				invoiceNumber: "INV-001",
				customerId: "cust-1",
				customerName: "Test",
				status: "draft",
				subtotal: 100,
				tax: 8,
				total: 108,
				lineItems: [
					{ description: "Service", quantity: "one" }, // invalid - quantity should be number
				],
			};

			expect(() => invoiceArtifactSchema.parse(invalidLineItem)).toThrow();
		});
	});

	describe("scheduleViewSchema", () => {
		it("should validate a complete schedule view", () => {
			const validSchedule: ScheduleViewArtifact = {
				date: "2024-01-20",
				jobs: [
					{
						id: "job-1",
						title: "Morning Service",
						time: "09:00",
						duration: 60,
						technician: "John Smith",
						customer: "Acme Corp",
						address: "123 Business Ave",
						status: "scheduled",
					},
					{
						id: "job-2",
						title: "Afternoon Repair",
						time: "14:00",
						duration: 90,
						technician: "Jane Doe",
						customer: "Widget Inc",
						status: "in_progress",
					},
				],
				availableSlots: [
					{ time: "11:00", duration: 60, technicians: ["tech-1", "tech-2"] },
				],
			};

			expect(() => scheduleViewSchema.parse(validSchedule)).not.toThrow();
		});

		it("should validate job status within schedule", () => {
			const validStatuses = ["scheduled", "in_progress", "completed"];

			for (const status of validStatuses) {
				const schedule = {
					date: "2024-01-20",
					jobs: [{
						id: "job-1",
						title: "Test",
						time: "09:00",
						duration: 60,
						technician: "Tech",
						customer: "Customer",
						status,
					}],
					availableSlots: [],
				};
				expect(() => scheduleViewSchema.parse(schedule)).not.toThrow();
			}
		});
	});

	describe("chartDataSchema", () => {
		it("should validate chart data with all types", () => {
			const chartTypes = ["bar", "line", "pie", "area"];

			for (const type of chartTypes) {
				const chart: ChartDataArtifact = {
					title: `${type} Chart`,
					type: type as "bar" | "line" | "pie" | "area",
					data: [
						{ label: "January", value: 100, color: "#ff0000" },
						{ label: "February", value: 150 },
						{ label: "March", value: 120, color: "#00ff00" },
					],
					xAxisLabel: "Month",
					yAxisLabel: "Revenue",
				};

				expect(() => chartDataSchema.parse(chart)).not.toThrow();
			}
		});

		it("should allow optional axis labels", () => {
			const chart = {
				title: "Simple Chart",
				type: "bar",
				data: [{ label: "A", value: 10 }],
			};

			expect(() => chartDataSchema.parse(chart)).not.toThrow();
		});
	});

	describe("tableDataSchema", () => {
		it("should validate table data with columns and rows", () => {
			// Verify schema structure is correct
			expect(tableDataSchema).toBeDefined();
			expect(tableDataSchema.shape).toHaveProperty("title");
			expect(tableDataSchema.shape).toHaveProperty("columns");
			expect(tableDataSchema.shape).toHaveProperty("rows");
			expect(tableDataSchema.shape).toHaveProperty("totalRows");
		});

		it("should validate column type enum", () => {
			const validTypes = ["string", "number", "date", "currency", "badge"];

			for (const type of validTypes) {
				const table = {
					title: "Test",
					columns: [{ key: "col", label: "Column", type }],
					rows: [],
				};
				expect(() => tableDataSchema.parse(table)).not.toThrow();
			}
		});

		it("should use default column type", () => {
			const table = {
				title: "Test",
				columns: [{ key: "col", label: "Column" }], // no type specified
				rows: [],
			};

			const parsed = tableDataSchema.parse(table);
			expect(parsed.columns[0].type).toBe("string");
		});
	});

	describe("estimateArtifactSchema", () => {
		it("should validate a complete estimate", () => {
			const validEstimate: EstimateArtifact = {
				id: "est-123",
				estimateNumber: "EST-2024-001",
				customerId: "cust-456",
				customerName: "John Doe",
				status: "sent",
				subtotal: 1000,
				tax: 80,
				total: 1080,
				validUntil: "2024-02-28",
				lineItems: [
					{ description: "Full HVAC System Replacement", quantity: 1, unitPrice: 800, total: 800 },
					{ description: "Installation Labor", quantity: 1, unitPrice: 200, total: 200 },
				],
			};

			expect(() => estimateArtifactSchema.parse(validEstimate)).not.toThrow();
		});

		it("should validate all estimate statuses", () => {
			const validStatuses = ["draft", "sent", "accepted", "declined", "expired"];

			for (const status of validStatuses) {
				const estimate = {
					id: "est-1",
					estimateNumber: "EST-001",
					customerId: "cust-1",
					customerName: "Test",
					status,
					subtotal: 100,
					tax: 8,
					total: 108,
					lineItems: [],
				};
				expect(() => estimateArtifactSchema.parse(estimate)).not.toThrow();
			}
		});
	});
});

// =============================================================================
// ARTIFACT DEFINITION TESTS
// =============================================================================

describe("Artifact Definitions", () => {
	it("should define customerCardArtifact with correct properties", () => {
		expect(customerCardArtifact).toMatchObject({
			id: "customer-card",
			displayName: "Customer Card",
			description: expect.stringContaining("customer profile"),
			schema: customerCardSchema,
		});
	});

	it("should define jobSummaryArtifact with correct properties", () => {
		expect(jobSummaryArtifact).toMatchObject({
			id: "job-summary",
			displayName: "Job Summary",
			description: expect.stringContaining("job summary"),
			schema: jobSummarySchema,
		});
	});

	it("should define invoiceArtifact with correct properties", () => {
		expect(invoiceArtifact).toMatchObject({
			id: "invoice",
			displayName: "Invoice",
			description: expect.stringContaining("invoice"),
			schema: invoiceArtifactSchema,
		});
	});

	it("should define scheduleViewArtifact with correct properties", () => {
		expect(scheduleViewArtifact).toMatchObject({
			id: "schedule-view",
			displayName: "Schedule View",
			description: expect.stringContaining("schedule"),
			schema: scheduleViewSchema,
		});
	});

	it("should define chartDataArtifact with correct properties", () => {
		expect(chartDataArtifact).toMatchObject({
			id: "chart",
			displayName: "Chart",
			description: expect.stringContaining("chart"),
			schema: chartDataSchema,
		});
	});

	it("should define tableDataArtifact with correct properties", () => {
		expect(tableDataArtifact).toMatchObject({
			id: "table",
			displayName: "Data Table",
			description: expect.stringContaining("tabular"),
			schema: tableDataSchema,
		});
	});

	it("should define estimateArtifact with correct properties", () => {
		expect(estimateArtifact).toMatchObject({
			id: "estimate",
			displayName: "Estimate",
			description: expect.stringContaining("estimate"),
			schema: estimateArtifactSchema,
		});
	});
});

// =============================================================================
// STRATOS ARTIFACTS BUNDLE TESTS
// =============================================================================

describe("stratosArtifacts Bundle", () => {
	it("should contain all defined artifacts", () => {
		expect(stratosArtifacts).toHaveProperty("customerCard");
		expect(stratosArtifacts).toHaveProperty("jobSummary");
		expect(stratosArtifacts).toHaveProperty("invoice");
		expect(stratosArtifacts).toHaveProperty("scheduleView");
		expect(stratosArtifacts).toHaveProperty("chart");
		expect(stratosArtifacts).toHaveProperty("table");
		expect(stratosArtifacts).toHaveProperty("estimate");
	});

	it("should have exactly 7 artifacts", () => {
		expect(Object.keys(stratosArtifacts)).toHaveLength(7);
	});

	it("should reference the same artifact instances", () => {
		expect(stratosArtifacts.customerCard).toBe(customerCardArtifact);
		expect(stratosArtifacts.jobSummary).toBe(jobSummaryArtifact);
		expect(stratosArtifacts.invoice).toBe(invoiceArtifact);
		expect(stratosArtifacts.scheduleView).toBe(scheduleViewArtifact);
		expect(stratosArtifacts.chart).toBe(chartDataArtifact);
		expect(stratosArtifacts.table).toBe(tableDataArtifact);
		expect(stratosArtifacts.estimate).toBe(estimateArtifact);
	});
});

// =============================================================================
// ARTIFACT IDS TESTS
// =============================================================================

describe("ARTIFACT_IDS Constants", () => {
	it("should define all artifact IDs", () => {
		expect(ARTIFACT_IDS.CUSTOMER_CARD).toBe("customer-card");
		expect(ARTIFACT_IDS.JOB_SUMMARY).toBe("job-summary");
		expect(ARTIFACT_IDS.INVOICE).toBe("invoice");
		expect(ARTIFACT_IDS.SCHEDULE_VIEW).toBe("schedule-view");
		expect(ARTIFACT_IDS.CHART).toBe("chart");
		expect(ARTIFACT_IDS.TABLE).toBe("table");
		expect(ARTIFACT_IDS.ESTIMATE).toBe("estimate");
	});

	it("should have 7 artifact IDs", () => {
		expect(Object.keys(ARTIFACT_IDS)).toHaveLength(7);
	});

	it("should match artifact definition IDs", () => {
		expect(ARTIFACT_IDS.CUSTOMER_CARD).toBe(customerCardArtifact.id);
		expect(ARTIFACT_IDS.JOB_SUMMARY).toBe(jobSummaryArtifact.id);
		expect(ARTIFACT_IDS.INVOICE).toBe(invoiceArtifact.id);
		expect(ARTIFACT_IDS.SCHEDULE_VIEW).toBe(scheduleViewArtifact.id);
		expect(ARTIFACT_IDS.CHART).toBe(chartDataArtifact.id);
		expect(ARTIFACT_IDS.TABLE).toBe(tableDataArtifact.id);
		expect(ARTIFACT_IDS.ESTIMATE).toBe(estimateArtifact.id);
	});
});

// =============================================================================
// TYPE SAFETY TESTS
// =============================================================================

describe("Type Safety", () => {
	it("should correctly type ArtifactId union", () => {
		const validIds: ArtifactId[] = [
			"customer-card",
			"job-summary",
			"invoice",
			"schedule-view",
			"chart",
			"table",
			"estimate",
		];

		expect(validIds).toHaveLength(7);
		// This is a compile-time check - if types are wrong, this won't compile
		const _assertType: ArtifactId = "customer-card";
		expect(_assertType).toBe("customer-card");
	});

	it("should infer correct types from schemas", () => {
		// CustomerCardArtifact type inference
		const customerCard: z.infer<typeof customerCardSchema> = {
			id: "c1",
			name: "Test",
			totalJobs: 0,
			totalRevenue: 0,
			status: "active",
		};
		const _typedCustomer: CustomerCardArtifact = customerCard;
		expect(_typedCustomer.status).toBe("active");

		// JobSummaryArtifact type inference
		const jobSummary: z.infer<typeof jobSummarySchema> = {
			id: "j1",
			title: "Test Job",
			status: "scheduled",
			customerId: "c1",
			customerName: "Test",
		};
		const _typedJob: JobSummaryArtifact = jobSummary;
		expect(_typedJob.status).toBe("scheduled");
	});
});

// =============================================================================
// AI SDK TOOLS INTEGRATION TESTS
// =============================================================================

describe("@ai-sdk-tools/artifacts Integration", () => {
	it("should export getWriter from @ai-sdk-tools/artifacts", () => {
		expect(getWriter).toBeDefined();
		expect(typeof getWriter).toBe("function");
	});

	it("should use artifact function to create artifacts", () => {
		// Each artifact should have been created with artifact()
		// Our mock adds _type: "artifact" to verify this
		expect(customerCardArtifact).toHaveProperty("_type", "artifact");
		expect(jobSummaryArtifact).toHaveProperty("_type", "artifact");
		expect(invoiceArtifact).toHaveProperty("_type", "artifact");
	});

	it("should create artifact with required config", () => {
		// Verify artifacts have all required properties
		const requiredProperties = ["id", "displayName", "description", "schema"];

		for (const prop of requiredProperties) {
			expect(customerCardArtifact).toHaveProperty(prop);
			expect(jobSummaryArtifact).toHaveProperty(prop);
			expect(invoiceArtifact).toHaveProperty(prop);
			expect(scheduleViewArtifact).toHaveProperty(prop);
			expect(chartDataArtifact).toHaveProperty(prop);
			expect(tableDataArtifact).toHaveProperty(prop);
			expect(estimateArtifact).toHaveProperty(prop);
		}
	});
});
