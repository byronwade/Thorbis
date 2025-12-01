/**
 * Form Validation Schemas
 *
 * Centralized Zod schemas for form validation across the application.
 * These schemas are used in Server Actions and form components.
 */

import { z } from "zod";
import { VALIDATION_LIMITS } from "@stratos/shared/constants";

// ============================================================================
// Common Field Schemas (Reusable)
// ============================================================================

export const nameSchema = z
	.string()
	.trim()
	.min(VALIDATION_LIMITS.name.min, "Name must be at least 2 characters")
	.max(VALIDATION_LIMITS.name.max, "Name is too long");

export const companyNameSchema = z
	.string()
	.trim()
	.min(VALIDATION_LIMITS.companyName.min, "Company name must be at least 2 characters")
	.max(VALIDATION_LIMITS.companyName.max, "Company name is too long");

export const emailSchema = z.string().email("Invalid email address");

export const phoneSchema = z
	.string()
	.trim()
	.min(VALIDATION_LIMITS.phone.minDigits, "Phone number is required")
	.refine(
		(value) => value.replace(/\D/g, "").length >= VALIDATION_LIMITS.phone.minDigits,
		"Enter a valid phone number",
	);

export const passwordSchema = z
	.string()
	.min(VALIDATION_LIMITS.password.min, "Password must be at least 8 characters")
	.max(VALIDATION_LIMITS.password.max, "Password is too long")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
		"Password must contain uppercase, lowercase, and number",
	);

export const uuidSchema = z.string().uuid("Invalid ID format");

export const descriptionSchema = z
	.string()
	.max(VALIDATION_LIMITS.description.max, "Description is too long")
	.optional();

export const notesSchema = z
	.string()
	.max(VALIDATION_LIMITS.notes.max, "Notes are too long")
	.optional();

// ============================================================================
// Authentication Schemas
// ============================================================================

export const signUpSchema = z.object({
	name: nameSchema,
	email: emailSchema,
	phone: phoneSchema,
	password: passwordSchema,
	companyName: companyNameSchema.optional(),
	terms: z
		.boolean()
		.refine((val) => val === true, "You must accept the terms and conditions"),
});

export const signInSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

// ============================================================================
// Customer Schemas
// ============================================================================

export const customerSchema = z.object({
	displayName: z.string().min(1, "Display name is required").max(200).optional(),
	firstName: nameSchema.optional(),
	lastName: nameSchema.optional(),
	email: emailSchema.optional(),
	phone: phoneSchema.optional(),
	companyName: companyNameSchema.optional(),
	notes: notesSchema,
});

// ============================================================================
// Property Schemas
// ============================================================================

export const propertySchema = z.object({
	customerId: uuidSchema,
	name: z.string().min(1, "Property name is required").max(200),
	address: z.string().min(1, "Address is required").max(200),
	address2: z.string().max(100).optional(),
	city: z.string().min(1, "City is required").max(100),
	state: z.string().min(1, "State is required").max(50),
	zipCode: z.string().min(1, "ZIP code is required").max(20),
	country: z.string().max(50).default("USA"),
	propertyType: z.enum(["residential", "commercial", "industrial"]).optional(),
	squareFootage: z.number().int().min(0).optional(),
	yearBuilt: z
		.number()
		.int()
		.min(1800)
		.max(new Date().getFullYear() + 5)
		.optional(),
	notes: notesSchema,
	lat: z.number().optional(),
	lon: z.number().optional(),
});

// ============================================================================
// Job Schemas
// ============================================================================

export const jobSchema = z.object({
	customerId: uuidSchema,
	propertyId: uuidSchema.optional(),
	title: z.string().min(1, "Job title is required"),
	description: descriptionSchema,
	status: z
		.enum(["scheduled", "in_progress", "completed", "cancelled", "on_hold"])
		.optional(),
	priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
	scheduledStart: z.string().min(1, "Start time is required").optional(),
	scheduledEnd: z.string().min(1, "End time is required").optional(),
	assignedTo: uuidSchema.optional(),
	notes: notesSchema,
});

// ============================================================================
// Invoice Schemas
// ============================================================================

export const lineItemSchema = z.object({
	description: z.string().min(1, "Description is required"),
	quantity: z.number().min(0.01, "Quantity must be greater than 0"),
	unitPrice: z.number().min(0, "Price must be positive"),
	total: z.number().min(0, "Total must be positive"),
});

export const createInvoiceSchema = z.object({
	customerId: uuidSchema,
	jobId: uuidSchema.optional(),
	title: z.string().min(1, "Invoice title is required"),
	description: descriptionSchema,
	lineItems: z
		.array(lineItemSchema)
		.min(1, "At least one line item is required"),
	taxRate: z.number().min(0).max(100).default(0),
	discountAmount: z.number().min(0).default(0),
	dueDays: z.number().min(0).default(30),
	terms: z.string().optional(),
	notes: notesSchema,
});

// ============================================================================
// Estimate Schemas
// ============================================================================

export const createEstimateSchema = z.object({
	customerId: uuidSchema,
	propertyId: uuidSchema.optional(),
	title: z.string().min(1, "Estimate title is required"),
	description: descriptionSchema,
	lineItems: z
		.array(lineItemSchema)
		.min(1, "At least one line item is required"),
	taxRate: z.number().min(0).max(100).default(0),
	discountAmount: z.number().min(0).default(0),
	validUntil: z.string().optional(),
	notes: notesSchema,
});

// ============================================================================
// Appointment Schemas
// ============================================================================

export const createAppointmentSchema = z.object({
	customerId: uuidSchema,
	propertyId: uuidSchema.optional(),
	jobId: uuidSchema.optional(),
	assignedTo: uuidSchema.optional(),
	title: z.string().min(1, "Appointment title is required"),
	description: descriptionSchema,
	category: z
		.enum([
			"job_appointment",
			"estimate_appointment",
			"event",
			"meeting",
			"follow_up",
			"recurring_service",
		])
		.default("job_appointment"),
	type: z
		.enum([
			"service_call",
			"installation",
			"maintenance",
			"inspection",
			"repair",
			"estimate",
			"follow_up",
			"winterization",
			"emergency",
		])
		.optional(),
	priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
	scheduledStart: z.string().min(1, "Start time is required"),
	scheduledEnd: z.string().min(1, "End time is required"),
	notes: notesSchema,
	travelTimeMinutes: z.number().int().min(0).optional(),
});

// ============================================================================
// Waitlist Schema
// ============================================================================

export const waitlistSchema = z.object({
	name: nameSchema,
	email: emailSchema,
});

// Export types
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;




