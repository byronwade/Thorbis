/**
 * AI Artifacts System
 *
 * Type-safe streaming artifacts from AI tools to React components
 * Uses @ai-sdk-tools/artifacts for structured data streaming
 */

import { artifact, getWriter } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

/**
 * Stratos Artifact Schemas
 *
 * Define the structure of data that can be streamed from AI tools
 */

// Customer card artifact
export const customerCardSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	totalJobs: z.number().default(0),
	totalRevenue: z.number().default(0),
	lastServiceDate: z.string().optional(),
	status: z.enum(["active", "inactive", "lead"]).default("active"),
});

// Job summary artifact
export const jobSummarySchema = z.object({
	id: z.string(),
	title: z.string(),
	status: z.enum([
		"scheduled",
		"in_progress",
		"completed",
		"cancelled",
		"on_hold",
	]),
	customerId: z.string(),
	customerName: z.string(),
	scheduledDate: z.string().optional(),
	scheduledTime: z.string().optional(),
	assignedTechnician: z.string().optional(),
	estimatedDuration: z.number().optional(),
	address: z.string().optional(),
});

// Invoice artifact
export const invoiceArtifactSchema = z.object({
	id: z.string(),
	invoiceNumber: z.string(),
	customerId: z.string(),
	customerName: z.string(),
	status: z.enum(["draft", "sent", "viewed", "paid", "overdue", "cancelled"]),
	subtotal: z.number(),
	tax: z.number(),
	total: z.number(),
	dueDate: z.string().optional(),
	lineItems: z.array(
		z.object({
			description: z.string(),
			quantity: z.number(),
			unitPrice: z.number(),
			total: z.number(),
		}),
	),
});

// Schedule view artifact
export const scheduleViewSchema = z.object({
	date: z.string(),
	jobs: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			time: z.string(),
			duration: z.number(),
			technician: z.string(),
			customer: z.string(),
			address: z.string().optional(),
			status: z.enum(["scheduled", "in_progress", "completed"]),
		}),
	),
	availableSlots: z.array(
		z.object({
			time: z.string(),
			duration: z.number(),
			technicians: z.array(z.string()),
		}),
	),
});

// Chart data artifact
export const chartDataSchema = z.object({
	title: z.string(),
	type: z.enum(["bar", "line", "pie", "area"]),
	data: z.array(
		z.object({
			label: z.string(),
			value: z.number(),
			color: z.string().optional(),
		}),
	),
	xAxisLabel: z.string().optional(),
	yAxisLabel: z.string().optional(),
});

// Table data artifact
export const tableDataSchema = z.object({
	title: z.string(),
	columns: z.array(
		z.object({
			key: z.string(),
			label: z.string(),
			type: z
				.enum(["string", "number", "date", "currency", "badge"])
				.default("string"),
		}),
	),
	rows: z.array(z.record(z.unknown())),
	totalRows: z.number().optional(),
});

// Estimate artifact
export const estimateArtifactSchema = z.object({
	id: z.string(),
	estimateNumber: z.string(),
	customerId: z.string(),
	customerName: z.string(),
	status: z.enum(["draft", "sent", "accepted", "declined", "expired"]),
	subtotal: z.number(),
	tax: z.number(),
	total: z.number(),
	validUntil: z.string().optional(),
	lineItems: z.array(
		z.object({
			description: z.string(),
			quantity: z.number(),
			unitPrice: z.number(),
			total: z.number(),
		}),
	),
});

/**
 * Artifact type definitions
 */
export type CustomerCardArtifact = z.infer<typeof customerCardSchema>;
export type JobSummaryArtifact = z.infer<typeof jobSummarySchema>;
export type InvoiceArtifact = z.infer<typeof invoiceArtifactSchema>;
export type ScheduleViewArtifact = z.infer<typeof scheduleViewSchema>;
export type ChartDataArtifact = z.infer<typeof chartDataSchema>;
export type TableDataArtifact = z.infer<typeof tableDataSchema>;
export type EstimateArtifact = z.infer<typeof estimateArtifactSchema>;

/**
 * Create artifact tools for streaming structured data
 */

export const customerCardArtifact = artifact({
	id: "customer-card",
	displayName: "Customer Card",
	description: "Display a customer profile card with key information",
	schema: customerCardSchema,
});

export const jobSummaryArtifact = artifact({
	id: "job-summary",
	displayName: "Job Summary",
	description: "Display a job summary card",
	schema: jobSummarySchema,
});

export const invoiceArtifact = artifact({
	id: "invoice",
	displayName: "Invoice",
	description: "Display an invoice with line items",
	schema: invoiceArtifactSchema,
});

export const scheduleViewArtifact = artifact({
	id: "schedule-view",
	displayName: "Schedule View",
	description: "Display a day's schedule with jobs and availability",
	schema: scheduleViewSchema,
});

export const chartDataArtifact = artifact({
	id: "chart",
	displayName: "Chart",
	description: "Display a data visualization chart",
	schema: chartDataSchema,
});

export const tableDataArtifact = artifact({
	id: "table",
	displayName: "Data Table",
	description: "Display tabular data with columns and rows",
	schema: tableDataSchema,
});

export const estimateArtifact = artifact({
	id: "estimate",
	displayName: "Estimate",
	description: "Display an estimate/quote with line items",
	schema: estimateArtifactSchema,
});

/**
 * All Stratos artifacts bundled together
 */
export const stratosArtifacts = {
	customerCard: customerCardArtifact,
	jobSummary: jobSummaryArtifact,
	invoice: invoiceArtifact,
	scheduleView: scheduleViewArtifact,
	chart: chartDataArtifact,
	table: tableDataArtifact,
	estimate: estimateArtifact,
};

/**
 * Artifact IDs for reference
 */
export const ARTIFACT_IDS = {
	CUSTOMER_CARD: "customer-card",
	JOB_SUMMARY: "job-summary",
	INVOICE: "invoice",
	SCHEDULE_VIEW: "schedule-view",
	CHART: "chart",
	TABLE: "table",
	ESTIMATE: "estimate",
} as const;

export type ArtifactId = (typeof ARTIFACT_IDS)[keyof typeof ARTIFACT_IDS];

// Re-export getWriter for use in tools
export { getWriter };
