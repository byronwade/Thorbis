/**
 * Customer Management Server Actions
 *
 * Comprehensive customer relationship management with:
 * - Customer CRUD operations
 * - Customer portal invitation and access
 * - Customer metrics tracking (revenue, jobs, invoices)
 * - Communication preferences
 * - Soft delete/archive support
 * - Customer search and filtering
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { geocodeAddressSilent } from "@/lib/maps/geocoding";
import { createClient } from "@/lib/supabase/server";
import PortalInvitationEmail from "../../emails/templates/customer/portal-invitation";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const CUSTOMER_NAME_MAX_LENGTH = 100;
const CUSTOMER_COMPANY_MAX_LENGTH = 200;
const CUSTOMER_PHONE_MAX_LENGTH = 20;
const CUSTOMER_ADDRESS_MAX_LENGTH = 200;
const CUSTOMER_ADDRESS2_MAX_LENGTH = 100;
const CUSTOMER_CITY_MAX_LENGTH = 100;
const CUSTOMER_STATE_MAX_LENGTH = 50;

// HTTP Status codes
const HTTP_STATUS_FORBIDDEN = 403;

// Search defaults
const DEFAULT_SEARCH_LIMIT = 50;
const CUSTOMER_ZIP_MAX_LENGTH = 20;
const CUSTOMER_COUNTRY_MAX_LENGTH = 50;
const CUSTOMER_TAX_EXEMPT_NUMBER_MAX_LENGTH = 50;
const CENTS_PER_DOLLAR = 100;

const customerSchema = z.object({
	type: z.enum(["residential", "commercial", "industrial"]).default("residential"),
	firstName: z.string().min(1, "First name is required").max(CUSTOMER_NAME_MAX_LENGTH),
	lastName: z.string().min(1, "Last name is required").max(CUSTOMER_NAME_MAX_LENGTH),
	companyName: z.string().max(CUSTOMER_COMPANY_MAX_LENGTH).optional(),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone is required").max(CUSTOMER_PHONE_MAX_LENGTH),
	secondaryPhone: z.string().max(CUSTOMER_PHONE_MAX_LENGTH).optional(),
	address: z.string().max(CUSTOMER_ADDRESS_MAX_LENGTH).optional(),
	address2: z.string().max(CUSTOMER_ADDRESS2_MAX_LENGTH).optional(),
	city: z.string().max(CUSTOMER_CITY_MAX_LENGTH).optional(),
	state: z.string().max(CUSTOMER_STATE_MAX_LENGTH).optional(),
	zipCode: z.string().max(CUSTOMER_ZIP_MAX_LENGTH).optional(),
	country: z.string().max(CUSTOMER_COUNTRY_MAX_LENGTH).default("USA"),
	source: z.enum(["referral", "google", "facebook", "direct", "yelp", "other"]).optional(),
	referredBy: z.string().uuid().optional().nullable(),
	preferredContactMethod: z.enum(["email", "phone", "sms"]).default("email"),
	preferredTechnician: z.string().uuid().optional().nullable(),
	billingEmail: z.string().email().optional().nullable(),
	paymentTerms: z.enum(["due_on_receipt", "net_15", "net_30", "net_60"]).default("due_on_receipt"),
	creditLimit: z.number().int().min(0).default(0), // In cents
	taxExempt: z.boolean().default(false),
	taxExemptNumber: z.string().max(CUSTOMER_TAX_EXEMPT_NUMBER_MAX_LENGTH).optional(),
	tags: z.array(z.string()).optional(),
	notes: z.string().optional(),
	internalNotes: z.string().optional(),
});

const communicationPreferencesSchema = z.object({
	email: z.boolean().default(true),
	sms: z.boolean().default(true),
	phone: z.boolean().default(true),
	marketing: z.boolean().default(false),
});

// ============================================================================
// CUSTOMER CRUD OPERATIONS
// ============================================================================

/**
 * Create a new customer with multiple contacts and properties
 */
export async function createCustomer(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
		const { contacts, properties, tags } = parseCustomerContactsPropertiesAndTags(formData);
		const primaryContact = getPrimaryContactOrThrow(contacts);
		const primaryProperty = getPrimaryProperty(properties);

		await assertCustomerEmailNotDuplicate(supabase, teamMember.company_id, primaryContact.email);

		const customerType = formData.get("type") || "residential";
		const companyName = formData.get("companyName");
		const displayName = buildCustomerDisplayName(customerType, companyName, primaryContact);

		const communicationPreferences = buildDefaultCommunicationPreferences();
		const customerMetadata = buildCustomerMetadata(contacts);

		const { lat: customerLat, lon: customerLon } = await geocodePrimaryPropertyIfAvailable(primaryProperty);

		const customer = await insertCustomerRecord(supabase, {
			companyId: teamMember.company_id,
			customerType,
			primaryContact,
			companyName,
			displayName,
			primaryProperty,
			customerLat,
			customerLon,
			formData,
			tags,
			communicationPreferences,
			customerMetadata,
		});

		await insertAdditionalPropertiesIfAny(supabase, teamMember.company_id, customer.id, properties);

		revalidatePath("/dashboard/customers");
		return customer.id;
	});
}

type ParsedCustomerContact = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	role: string;
	isPrimary: boolean;
};

type ParsedCustomerProperty = {
	name: string;
	address: string;
	address2: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	propertyType: string;
	isPrimary: boolean;
	notes: string;
};

type ParsedCustomerFormCollections = {
	contacts: ParsedCustomerContact[];
	properties: ParsedCustomerProperty[];
	tags?: string[];
};

async function requireCustomerCompanyMembership(
	supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
	userId: string
) {
	const { data: teamMember } = await supabase.from("team_members").select("company_id").eq("user_id", userId).single();

	if (!teamMember?.company_id) {
		throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
	}

	return teamMember;
}

function parseCustomerContactsPropertiesAndTags(formData: FormData): ParsedCustomerFormCollections {
	const contacts = parseContacts(formData.get("contacts"));
	const properties = parseProperties(formData.get("properties"));
	const tags = parseTagsField(formData.get("tags"));

	return { contacts, properties, tags };
}

function parseContacts(value: FormDataEntryValue | null): ParsedCustomerContact[] {
	if (!value || typeof value !== "string") {
		return [];
	}

	try {
		return JSON.parse(value) as ParsedCustomerContact[];
	} catch {
		throw new ActionError("Invalid contacts data", ERROR_CODES.VALIDATION_FAILED);
	}
}

function parseProperties(value: FormDataEntryValue | null): ParsedCustomerProperty[] {
	if (!value || typeof value !== "string") {
		return [];
	}

	try {
		return JSON.parse(value) as ParsedCustomerProperty[];
	} catch {
		throw new ActionError("Invalid properties data", ERROR_CODES.VALIDATION_FAILED);
	}
}

function parseTagsField(value: FormDataEntryValue | null): string[] | undefined {
	if (!value || typeof value !== "string") {
		return;
	}

	try {
		return JSON.parse(value) as string[];
	} catch {
		return value.split(",").map((t) => t.trim());
	}
}

function getPrimaryContactOrThrow(contacts: ParsedCustomerContact[]): ParsedCustomerContact {
	const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];
	if (!primaryContact) {
		throw new ActionError("At least one contact is required", ERROR_CODES.VALIDATION_FAILED);
	}
	return primaryContact;
}

function getPrimaryProperty(properties: ParsedCustomerProperty[]): ParsedCustomerProperty | undefined {
	return properties.find((p) => p.isPrimary) || properties[0];
}

async function assertCustomerEmailNotDuplicate(
	supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
	companyId: string,
	email: string
) {
	const { data: existingEmail } = await supabase
		.from("customers")
		.select("id")
		.eq("company_id", companyId)
		.eq("email", email)
		.is("deleted_at", null)
		.single();

	if (existingEmail) {
		throw new ActionError("A customer with this email already exists", ERROR_CODES.DB_DUPLICATE_ENTRY);
	}
}

function buildCustomerDisplayName(
	customerType: FormDataEntryValue | null,
	companyNameValue: FormDataEntryValue | null,
	primaryContact: ParsedCustomerContact
): string {
	const companyName = companyNameValue ? String(companyNameValue) : null;

	if (customerType === "commercial" && companyName) {
		return companyName;
	}

	return `${primaryContact.firstName} ${primaryContact.lastName}`;
}

function buildDefaultCommunicationPreferences() {
	return {
		email: true,
		sms: true,
		phone: true,
		marketing: false,
	};
}

function buildCustomerMetadata(contacts: ParsedCustomerContact[]) {
	return {
		contacts: contacts.map((c) => ({
			firstName: c.firstName,
			lastName: c.lastName,
			email: c.email,
			phone: c.phone,
			role: c.role,
			isPrimary: c.isPrimary,
		})),
	};
}

async function geocodePrimaryPropertyIfAvailable(
	primaryProperty: ParsedCustomerProperty | undefined
): Promise<{ lat: number | null; lon: number | null }> {
	if (!(primaryProperty?.address && primaryProperty.city && primaryProperty.state && primaryProperty.zipCode)) {
		return { lat: null, lon: null };
	}

	const geocodeResult = await geocodeAddressSilent(
		primaryProperty.address,
		primaryProperty.city,
		primaryProperty.state,
		primaryProperty.zipCode,
		primaryProperty.country || "USA"
	);

	if (!geocodeResult) {
		return { lat: null, lon: null };
	}

	return { lat: geocodeResult.lat, lon: geocodeResult.lon };
}

type InsertCustomerParams = {
	supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
	companyId: string;
	customerType: FormDataEntryValue | null;
	primaryContact: ParsedCustomerContact;
	companyNameValue: FormDataEntryValue | null;
	displayName: string;
	primaryProperty?: ParsedCustomerProperty;
	customerLat: number | null;
	customerLon: number | null;
	formData: FormData;
	tags?: string[];
	communicationPreferences: {
		email: boolean;
		sms: boolean;
		phone: boolean;
		marketing: boolean;
	};
	customerMetadata: Record<string, unknown>;
};

async function insertCustomerRecord(
	supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
	params: InsertCustomerParams
) {
	const payload = buildCustomerInsertPayload(params);

	const { data: customer, error: createError } = await supabase.from("customers").insert(payload).select("id").single();

	if (createError || !customer) {
		throw new ActionError(ERROR_MESSAGES.operationFailed("create customer"), ERROR_CODES.DB_QUERY_ERROR);
	}

	return customer;
}

function buildCustomerInsertPayload(params: InsertCustomerParams): Record<string, unknown> {
	const {
		companyId,
		customerType,
		primaryContact,
		companyNameValue,
		displayName,
		primaryProperty,
		customerLat,
		customerLon,
		formData,
		tags,
		communicationPreferences,
		customerMetadata,
	} = params;

	const companyName = companyNameValue ? String(companyNameValue) : null;

	return {
		company_id: companyId,
		type: String(customerType || "residential"),
		first_name: primaryContact.firstName,
		last_name: primaryContact.lastName,
		company_name: companyName,
		display_name: displayName,
		email: primaryContact.email,
		phone: primaryContact.phone,
		secondary_phone: null,
		address: primaryProperty?.address || null,
		address2: primaryProperty?.address2 || null,
		city: primaryProperty?.city || null,
		state: primaryProperty?.state || null,
		zip_code: primaryProperty?.zipCode || null,
		country: primaryProperty?.country || "USA",
		lat: customerLat,
		lon: customerLon,
		source: formData.get("source") ? String(formData.get("source")) : null,
		referred_by: formData.get("referredBy") ? String(formData.get("referredBy")) : null,
		preferred_contact_method: String(formData.get("preferredContactMethod")) || "email",
		preferred_technician: formData.get("preferredTechnician") ? String(formData.get("preferredTechnician")) : null,
		billing_email: formData.get("billingEmail") ? String(formData.get("billingEmail")) : null,
		payment_terms: String(formData.get("paymentTerms")) || "due_on_receipt",
		credit_limit: formData.get("creditLimit") ? Number(formData.get("creditLimit")) * CENTS_PER_DOLLAR : 0,
		tax_exempt: formData.get("taxExempt") === "on",
		tax_exempt_number: formData.get("taxExemptNumber") ? String(formData.get("taxExemptNumber")) : null,
		tags: tags || null,
		communication_preferences: communicationPreferences,
		notes: formData.get("notes") ? String(formData.get("notes")) : null,
		internal_notes: formData.get("internalNotes") ? String(formData.get("internalNotes")) : null,
		metadata: customerMetadata,
		status: "active",
		portal_enabled: false,
		total_revenue: 0,
		total_jobs: 0,
		total_invoices: 0,
		average_job_value: 0,
		outstanding_balance: 0,
	};
}

async function insertAdditionalPropertiesIfAny(
	supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
	companyId: string,
	customerId: string,
	properties: ParsedCustomerProperty[]
) {
	const additionalProperties = properties.filter((p) => !p.isPrimary);
	if (additionalProperties.length === 0) {
		return;
	}

	const propertiesToInsert = await Promise.all(
		additionalProperties.map(async (prop) => {
			let propLat: number | null = null;
			let propLon: number | null = null;

			if (prop.address && prop.city && prop.state && prop.zipCode) {
				const geocodeResult = await geocodeAddressSilent(
					prop.address,
					prop.city,
					prop.state,
					prop.zipCode,
					prop.country || "USA"
				);

				if (geocodeResult) {
					propLat = geocodeResult.lat;
					propLon = geocodeResult.lon;
				}
			}

			return {
				company_id: companyId,
				customer_id: customerId,
				name: prop.name || "Additional Property",
				address: prop.address,
				address2: prop.address2 || null,
				city: prop.city,
				state: prop.state,
				zip_code: prop.zipCode,
				country: prop.country || "USA",
				property_type: prop.propertyType || "residential",
				notes: prop.notes || null,
				lat: propLat,
				lon: propLon,
			};
		})
	);

	await supabase.from("properties").insert(propertiesToInsert);
}

/**
 * Update existing customer
 */
export async function updateCustomer(customerId: string, formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id, email")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError("Customer not found", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Parse tags if provided
		let tags: string[] | undefined;
		const tagsString = formData.get("tags");
		if (tagsString && typeof tagsString === "string") {
			try {
				tags = JSON.parse(tagsString);
			} catch {
				tags = tagsString.split(",").map((t) => t.trim());
			}
		}

		// Validate input
		const data = customerSchema.parse({
			type: formData.get("type") || "residential",
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			companyName: formData.get("companyName") || undefined,
			email: formData.get("email"),
			phone: formData.get("phone"),
			secondaryPhone: formData.get("secondaryPhone") || undefined,
			address: formData.get("address") || undefined,
			address2: formData.get("address2") || undefined,
			city: formData.get("city") || undefined,
			state: formData.get("state") || undefined,
			zipCode: formData.get("zipCode") || undefined,
			country: formData.get("country") || "USA",
			source: formData.get("source") || undefined,
			referredBy: formData.get("referredBy") || null,
			preferredContactMethod: formData.get("preferredContactMethod") || "email",
			preferredTechnician: formData.get("preferredTechnician") || null,
			billingEmail: formData.get("billingEmail") || null,
			paymentTerms: formData.get("paymentTerms") || "due_on_receipt",
			creditLimit: formData.get("creditLimit") ? Number(formData.get("creditLimit")) : 0,
			taxExempt: formData.get("taxExempt") === "true",
			taxExemptNumber: formData.get("taxExemptNumber") || undefined,
			tags,
			notes: formData.get("notes") || undefined,
			internalNotes: formData.get("internalNotes") || undefined,
		});

		// Check if email already exists (excluding current customer)
		if (data.email !== customer.email) {
			const { data: existingEmail } = await supabase
				.from("customers")
				.select("id")
				.eq("company_id", teamMember.company_id)
				.eq("email", data.email)
				.neq("id", customerId)
				.is("deleted_at", null)
				.single();

			if (existingEmail) {
				throw new ActionError("A customer with this email already exists", ERROR_CODES.DB_DUPLICATE_ENTRY);
			}
		}

		// Generate display name
		const displayName =
			data.type === "commercial" && data.companyName ? data.companyName : `${data.firstName} ${data.lastName}`;

		// Update customer
		const { error: updateError } = await supabase
			.from("customers")
			.update({
				type: data.type,
				first_name: data.firstName,
				last_name: data.lastName,
				company_name: data.companyName,
				display_name: displayName,
				email: data.email,
				phone: data.phone,
				secondary_phone: data.secondaryPhone,
				address: data.address,
				address2: data.address2,
				city: data.city,
				state: data.state,
				zip_code: data.zipCode,
				country: data.country,
				source: data.source,
				referred_by: data.referredBy,
				preferred_contact_method: data.preferredContactMethod,
				preferred_technician: data.preferredTechnician,
				billing_email: data.billingEmail,
				payment_terms: data.paymentTerms,
				credit_limit: data.creditLimit,
				tax_exempt: data.taxExempt,
				tax_exempt_number: data.taxExemptNumber,
				tags: data.tags,
				notes: data.notes,
				internal_notes: data.internalNotes,
			})
			.eq("id", customerId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update customer"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

/**
 * Delete customer (soft delete/archive)
 */
export async function deleteCustomer(customerId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id, outstanding_balance")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError("Customer not found", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Prevent deletion if customer has outstanding balance
		if (customer.outstanding_balance > 0) {
			throw new ActionError(
				"Cannot delete customer with outstanding balance. Collect payment first.",
				ERROR_CODES.BUSINESS_RULE_VIOLATION
			);
		}

		// Soft delete
		const { error: deleteError } = await supabase
			.from("customers")
			.update({
				deleted_at: new Date().toISOString(),
				deleted_by: user.id,
				status: "archived",
			})
			.eq("id", customerId);

		if (deleteError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete customer"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/customers");
	});
}

// ============================================================================
// CUSTOMER STATUS & PREFERENCES
// ============================================================================

/**
 * Update customer status
 */
export async function updateCustomerStatus(
	customerId: string,
	status: "active" | "inactive" | "archived" | "blocked"
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError("Customer not found", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Update status
		const { error: updateError } = await supabase.from("customers").update({ status }).eq("id", customerId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update customer status"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

/**
 * Update communication preferences
 */
export async function updateCommunicationPreferences(
	customerId: string,
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError("Customer not found", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Validate input
		const preferences = communicationPreferencesSchema.parse({
			email: formData.get("email") === "true",
			sms: formData.get("sms") === "true",
			phone: formData.get("phone") === "true",
			marketing: formData.get("marketing") === "true",
		});

		// Update preferences
		const { error: updateError } = await supabase
			.from("customers")
			.update({ communication_preferences: preferences })
			.eq("id", customerId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update communication preferences"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

// ============================================================================
// CUSTOMER PORTAL
// ============================================================================

/**
 * Invite customer to portal
 * TODO: Implement email sending
 */
export async function inviteToPortal(customerId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id, email, display_name, portal_enabled")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError("Customer not found", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		if (customer.portal_enabled) {
			throw new ActionError("Customer is already invited to portal", ERROR_CODES.BUSINESS_RULE_VIOLATION);
		}

		// Generate secure portal invitation token
		const inviteToken = Buffer.from(`${customerId}:${Date.now()}:${Math.random()}`).toString("base64url");

		// Update customer
		const { error: updateError } = await supabase
			.from("customers")
			.update({
				portal_enabled: true,
				portal_invited_at: new Date().toISOString(),
			})
			.eq("id", customerId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("invite customer to portal"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Send invitation email
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const portalUrl = `${siteUrl}/portal/setup?token=${inviteToken}`;

		const emailResult = await sendEmail({
			to: customer.email,
			subject: "You've been invited to your Customer Portal",
			template: PortalInvitationEmail({
				customerName: customer.display_name,
				portalUrl,
				expiresInHours: 168, // 7 days
				supportEmail: process.env.RESEND_FROM_EMAIL || "support@thorbis.com",
				supportPhone: "(555) 123-4567",
			}),
			templateType: EmailTemplate.PORTAL_INVITATION,
		});

		if (!emailResult.success) {
			return;
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

/**
 * Revoke portal access
 */
export async function revokePortalAccess(customerId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const teamMember = await requireCustomerCompanyMembership(supabase, user.id);

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError("Customer not found", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Revoke access
		const { error: updateError } = await supabase
			.from("customers")
			.update({ portal_enabled: false })
			.eq("id", customerId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("revoke portal access"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

// ============================================================================
// SEARCH & REPORTING
// ============================================================================

/**
 * Get customer by phone number
 * Used for incoming call lookups
 */
export async function getCustomerByPhone(phoneNumber: string, companyId: string): Promise<ActionResult<unknown>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Normalize phone number (remove formatting)
		const normalizedPhone = phoneNumber.replace(/\D/g, "");

		// Search by primary phone or secondary phone
		const { data: customer, error } = await supabase
			.from("customers")
			.select(`
        *,
        properties:properties(*)
      `)
			.eq("company_id", companyId)
			.or(
				`phone.eq.${phoneNumber},phone.eq.${normalizedPhone},secondary_phone.eq.${phoneNumber},secondary_phone.eq.${normalizedPhone}`
			)
			.single();

		if (error && error.code !== "PGRST116") {
			// PGRST116 = no rows found
			throw new ActionError(`Failed to find customer: ${error.message}`, ERROR_CODES.DB_QUERY_ERROR);
		}

		return customer || null;
	});
}

/**
 * Search customers by name, email, phone, or company
 */
export async function searchCustomers(
	searchTerm: string,
	options?: { limit?: number; offset?: number }
): Promise<ActionResult<unknown[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Use full-text search with ranking for best matches
		// Searches across: first_name, last_name, display_name, email, phone,
		// secondary_phone, company_name, address, city, state
		// Returns results ordered by relevance (weighted: name > contact > address)
		const { searchCustomersFullText } = await import("@/lib/search/full-text-search");

		const customers = await searchCustomersFullText(supabase, teamMember.company_id, searchTerm, {
			limit: options?.limit || DEFAULT_SEARCH_LIMIT,
			offset: options?.offset || 0,
		});

		return customers;
	});
}

/**
 * Get top customers by revenue
 */
export async function getTopCustomers(limit = 10): Promise<ActionResult<unknown[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		const { data: customers, error } = await supabase
			.from("customers")
			.select("*")
			.eq("company_id", teamMember.company_id)
			.eq("status", "active")
			.is("deleted_at", null)
			.order("total_revenue", { ascending: false })
			.limit(limit);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch top customers"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return customers || [];
	});
}

/**
 * Get customers with outstanding balance
 */
type CustomerWithBalance = {
	id: string;
	display_name: string;
	balance: number;
};

export async function getCustomersWithBalance(): Promise<ActionResult<CustomerWithBalance[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		const { data: customers, error } = await supabase
			.from("customers")
			.select("*")
			.eq("company_id", teamMember.company_id)
			.is("deleted_at", null)
			.gt("outstanding_balance", 0)
			.order("outstanding_balance", { ascending: false });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch customers with balance"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return customers || [];
	});
}

type CustomerRecord = {
	id: string;
	company_id: string;
	type: string;
	first_name: string;
	last_name: string;
	display_name: string;
	company_name?: string | null;
	email: string;
	phone: string;
	secondary_phone?: string;
	address?: string;
	address2?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	status: string;
	total_revenue?: number;
	total_jobs?: number;
	total_invoices?: number;
	outstanding_balance?: number;
	last_job_date?: string;
	next_scheduled_job?: string;
	created_at: string;
	updated_at: string;
	archived_at?: string | null;
	deleted_at?: string | null;
};

/**
 * Get all customers for the current company
 */
export async function getAllCustomers(): Promise<ActionResult<CustomerRecord[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get active company ID (from cookie or first available)
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const activeCompanyId = await getActiveCompanyId();

		const FORBIDDEN_STATUS_CODE = 403;
		if (!activeCompanyId) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, FORBIDDEN_STATUS_CODE);
		}

		// Verify user has access to the active company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("company_id", activeCompanyId)
			.eq("status", "active")
			.maybeSingle();

		if (!teamMember?.company_id) {
			throw new ActionError("You don't have access to this company", ERROR_CODES.AUTH_FORBIDDEN, FORBIDDEN_STATUS_CODE);
		}

		const { data: customers, error } = await supabase
			.from("customers")
			.select("*")
			.eq("company_id", activeCompanyId)
			.is("deleted_at", null)
			.order("display_name", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch customers"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Enrich customers with real job data
		const enrichedCustomers = await Promise.all(
			(customers || []).map(async (customer) => {
				// Get last completed job date
				const { data: lastJob } = await supabase
					.from("jobs")
					.select("created_at, scheduled_end, actual_end")
					.eq("customer_id", customer.id)
					.eq("company_id", teamMember.company_id)
					.eq("status", "completed")
					.order("created_at", { ascending: false })
					.limit(1)
					.maybeSingle();

				// Get next scheduled job
				const { data: nextJob } = await supabase
					.from("jobs")
					.select("scheduled_start")
					.eq("customer_id", customer.id)
					.eq("company_id", teamMember.company_id)
					.in("status", ["quoted", "scheduled"])
					.not("scheduled_start", "is", null)
					.order("scheduled_start", { ascending: true })
					.limit(1)
					.maybeSingle();

				// Get total revenue and job count
				const { data: jobStats } = await supabase
					.from("jobs")
					.select("total_amount")
					.eq("customer_id", customer.id)
					.eq("company_id", teamMember.company_id);

				const total_jobs = jobStats?.length || 0;
				const total_revenue = jobStats?.reduce((sum, job) => sum + (job.total_amount || 0), 0) || 0;

				return {
					...customer,
					last_job_date: lastJob?.actual_end || lastJob?.scheduled_end || lastJob?.created_at,
					next_scheduled_job: nextJob?.scheduled_start,
					total_jobs,
					total_revenue,
				};
			})
		);

		return enrichedCustomers as CustomerRecord[];
	});
}

/**
 * Update customer page content (Novel/Tiptap JSON)
 *
 * Saves the customer's editable page layout and content
 * Used by the Novel editor for auto-save functionality
 */
export async function updateCustomerPageContent(
	customerId: string,
	pageContent: Record<string, unknown>
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError(ERROR_MESSAGES.forbidden("customer"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
		}

		// Update page content
		const { error: updateError } = await supabase
			.from("customers")
			.update({
				page_content: pageContent,
				content_updated_by: user.id,
			})
			.eq("id", customerId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update customer page"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}
