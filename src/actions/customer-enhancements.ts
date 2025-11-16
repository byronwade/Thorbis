/**
 * Customer Enhancement Server Actions
 *
 * Manages business customer features:
 * - Multiple contacts per business customer
 * - Multiple addresses per customer (billing, service, shipping)
 * - Service flags and directions
 * - Sales context and internal notes
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// CONSTANTS
// ============================================================================

const HTTP_STATUS = {
	forbidden: 403,
} as const;

const NAME_MAX_LENGTH = 100;
const PHONE_MAX_LENGTH = 20;
const ADDRESS_LINE_MAX_LENGTH = 255;
const CITY_MAX_LENGTH = 100;
const STATE_MAX_LENGTH = 50;
const ZIP_CODE_MAX_LENGTH = 20;
const COUNTRY_MAX_LENGTH = 50;
const GATE_CODE_MAX_LENGTH = 50;

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

type PreferredContactMethod = "email" | "phone" | "sms";

type AddressType = "billing" | "shipping" | "service" | "mailing" | "other";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const customerContactSchema = z.object({
	customerId: z.string().uuid("Invalid customer ID"),
	firstName: z.string().min(1, "First name is required").max(NAME_MAX_LENGTH),
	lastName: z.string().min(1, "Last name is required").max(NAME_MAX_LENGTH),
	title: z.string().max(NAME_MAX_LENGTH).optional(),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone is required").max(PHONE_MAX_LENGTH),
	secondaryPhone: z.string().max(PHONE_MAX_LENGTH).optional(),
	isPrimary: z.boolean().default(false),
	isBillingContact: z.boolean().default(false),
	isEmergencyContact: z.boolean().default(false),
	preferredContactMethod: z.enum(["email", "phone", "sms"]).default("email"),
	notes: z.string().optional(),
});

const customerAddressSchema = z.object({
	customerId: z.string().uuid("Invalid customer ID"),
	addressType: z.enum(["billing", "shipping", "service", "mailing", "other"]),
	isDefault: z.boolean().default(false),
	label: z.string().max(NAME_MAX_LENGTH).optional(),
	addressLine1: z.string().min(1, "Address is required").max(ADDRESS_LINE_MAX_LENGTH),
	addressLine2: z.string().max(ADDRESS_LINE_MAX_LENGTH).optional(),
	city: z.string().min(1, "City is required").max(CITY_MAX_LENGTH),
	state: z.string().min(1, "State is required").max(STATE_MAX_LENGTH),
	zipCode: z.string().min(1, "ZIP code is required").max(ZIP_CODE_MAX_LENGTH),
	country: z.string().max(COUNTRY_MAX_LENGTH).default("USA"),
	directions: z.string().optional(),
	accessNotes: z.string().optional(),
	parkingInstructions: z.string().optional(),
	gateCode: z.string().max(GATE_CODE_MAX_LENGTH).optional(),
});

// ============================================================================
// CUSTOMER CONTACTS
// ============================================================================

/**
 * Get authenticated user and company context
 */
async function getAuthContext(supabase: SupabaseServerClient): Promise<{ userId: string; companyId: string }> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	assertAuthenticated(user?.id);

	const { data: teamMember } = await supabase.from("team_members").select("company_id").eq("user_id", user.id).single();

	if (!teamMember?.company_id) {
		throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
	}

	return { userId: user.id, companyId: teamMember.company_id };
}

/**
 * Verify customer belongs to company
 */
async function verifyCustomerAccess(
	supabase: SupabaseServerClient,
	customerId: string,
	companyId: string
): Promise<void> {
	const { data: customer } = await supabase
		.from("customers")
		.select("company_id, is_business")
		.eq("id", customerId)
		.single();

	assertExists(customer, "Customer");

	if (customer.company_id !== companyId) {
		throw new ActionError(ERROR_MESSAGES.forbidden("customer"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
	}
}

/**
 * Parse contact form data
 */
function parseContactFormData(formData: FormData): z.infer<typeof customerContactSchema> {
	const preferredContactMethodValue = formData.get("preferredContactMethod");
	const preferredContactMethod: PreferredContactMethod =
		preferredContactMethodValue === "phone" || preferredContactMethodValue === "sms"
			? (preferredContactMethodValue as PreferredContactMethod)
			: "email";

	return customerContactSchema.parse({
		customerId: formData.get("customerId"),
		firstName: formData.get("firstName"),
		lastName: formData.get("lastName"),
		title: formData.get("title") || undefined,
		email: formData.get("email"),
		phone: formData.get("phone"),
		secondaryPhone: formData.get("secondaryPhone") || undefined,
		isPrimary: formData.get("isPrimary") === "true",
		isBillingContact: formData.get("isBillingContact") === "true",
		isEmergencyContact: formData.get("isEmergencyContact") === "true",
		preferredContactMethod,
		notes: formData.get("notes") || undefined,
	});
}

/**
 * Add contact to business customer
 */
export async function addCustomerContact(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);
		const data = parseContactFormData(formData);

		await verifyCustomerAccess(typedSupabase, data.customerId, companyId);

		// Ensure customer is marked as business
		const { data: customer } = await typedSupabase
			.from("customers")
			.select("is_business")
			.eq("id", data.customerId)
			.single();

		if (customer && !customer.is_business) {
			await typedSupabase.from("customers").update({ is_business: true }).eq("id", data.customerId);
		}

		// If setting as primary, unset other primaries
		if (data.isPrimary) {
			await typedSupabase.from("customer_contacts").update({ is_primary: false }).eq("customer_id", data.customerId);
		}

		// Add contact
		const { data: contact, error: createError } = await typedSupabase
			.from("customer_contacts")
			.insert({
				company_id: companyId,
				customer_id: data.customerId,
				first_name: data.firstName,
				last_name: data.lastName,
				title: data.title,
				email: data.email,
				phone: data.phone,
				secondary_phone: data.secondaryPhone,
				is_primary: data.isPrimary,
				is_billing_contact: data.isBillingContact,
				is_emergency_contact: data.isEmergencyContact,
				preferred_contact_method: data.preferredContactMethod,
				notes: data.notes,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("add customer contact"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${data.customerId}`);
		return contact.id;
	});
}

/**
 * Build contact update payload from form data
 */
function buildContactUpdatePayload(formData: FormData): Record<string, unknown> {
	const updateData: Record<string, unknown> = {};

	const firstName = formData.get("firstName");
	if (firstName) {
		updateData.first_name = firstName;
	}

	const lastName = formData.get("lastName");
	if (lastName) {
		updateData.last_name = lastName;
	}

	if (formData.has("title")) {
		updateData.title = formData.get("title");
	}

	const email = formData.get("email");
	if (email) {
		updateData.email = email;
	}

	const phone = formData.get("phone");
	if (phone) {
		updateData.phone = phone;
	}

	if (formData.has("secondaryPhone")) {
		updateData.secondary_phone = formData.get("secondaryPhone");
	}

	if (formData.has("notes")) {
		updateData.notes = formData.get("notes");
	}

	if (formData.has("isPrimary")) {
		updateData.is_primary = formData.get("isPrimary") === "true";
	}

	if (formData.has("isBillingContact")) {
		updateData.is_billing_contact = formData.get("isBillingContact") === "true";
	}

	if (formData.has("isEmergencyContact")) {
		updateData.is_emergency_contact = formData.get("isEmergencyContact") === "true";
	}

	return updateData;
}

/**
 * Update customer contact
 */
export async function updateCustomerContact(contactId: string, formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		// Verify contact belongs to company
		const { data: existingContact } = await typedSupabase
			.from("customer_contacts")
			.select("company_id, customer_id")
			.eq("id", contactId)
			.single();

		assertExists(existingContact, "Contact");

		if (existingContact.company_id !== companyId) {
			throw new ActionError(ERROR_MESSAGES.forbidden("contact"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
		}

		const updateData = buildContactUpdatePayload(formData);

		// Handle primary flag separately to unset other primaries
		if (formData.has("isPrimary")) {
			const isPrimary = formData.get("isPrimary") === "true";
			if (isPrimary) {
				await typedSupabase
					.from("customer_contacts")
					.update({ is_primary: false })
					.eq("customer_id", existingContact.customer_id);
			}
		}

		// Update contact
		const { error: updateError } = await typedSupabase.from("customer_contacts").update(updateData).eq("id", contactId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update contact"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${existingContact.customer_id}`);
	});
}

/**
 * Delete customer contact
 */
export async function deleteCustomerContact(contactId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		// Verify contact belongs to company
		const { data: contact } = await typedSupabase
			.from("customer_contacts")
			.select("company_id, customer_id")
			.eq("id", contactId)
			.single();

		assertExists(contact, "Contact");

		if (contact.company_id !== companyId) {
			throw new ActionError(ERROR_MESSAGES.forbidden("contact"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
		}

		// Soft delete
		const { error: deleteError } = await typedSupabase
			.from("customer_contacts")
			.update({ deleted_at: new Date().toISOString() })
			.eq("id", contactId);

		if (deleteError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete contact"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${contact.customer_id}`);
	});
}

// ============================================================================
// CUSTOMER ADDRESSES
// ============================================================================

/**
 * Parse address form data
 */
function parseAddressFormData(formData: FormData): z.infer<typeof customerAddressSchema> {
	const addressTypeValue = formData.get("addressType");
	const addressType: AddressType =
		addressTypeValue === "billing" ||
		addressTypeValue === "shipping" ||
		addressTypeValue === "service" ||
		addressTypeValue === "mailing" ||
		addressTypeValue === "other"
			? (addressTypeValue as AddressType)
			: "other";

	return customerAddressSchema.parse({
		customerId: formData.get("customerId"),
		addressType,
		isDefault: formData.get("isDefault") === "true",
		label: formData.get("label") || undefined,
		addressLine1: formData.get("addressLine1"),
		addressLine2: formData.get("addressLine2") || undefined,
		city: formData.get("city"),
		state: formData.get("state"),
		zipCode: formData.get("zipCode"),
		country: formData.get("country") || "USA",
		directions: formData.get("directions") || undefined,
		accessNotes: formData.get("accessNotes") || undefined,
		parkingInstructions: formData.get("parkingInstructions") || undefined,
		gateCode: formData.get("gateCode") || undefined,
	});
}

/**
 * Add address to customer
 */
export async function addCustomerAddress(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);
		const data = parseAddressFormData(formData);

		// Verify customer exists and belongs to company
		const { data: customer } = await typedSupabase
			.from("customers")
			.select("company_id")
			.eq("id", data.customerId)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== companyId) {
			throw new ActionError(ERROR_MESSAGES.forbidden("customer"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
		}

		// If setting as default, unset other defaults of same type
		if (data.isDefault) {
			await typedSupabase
				.from("customer_addresses")
				.update({ is_default: false })
				.eq("customer_id", data.customerId)
				.eq("address_type", data.addressType);
		}

		// Add address
		const { data: address, error: createError } = await typedSupabase
			.from("customer_addresses")
			.insert({
				company_id: companyId,
				customer_id: data.customerId,
				address_type: data.addressType,
				is_default: data.isDefault,
				label: data.label,
				address_line1: data.addressLine1,
				address_line2: data.addressLine2,
				city: data.city,
				state: data.state,
				zip_code: data.zipCode,
				country: data.country,
				directions: data.directions,
				access_notes: data.accessNotes,
				parking_instructions: data.parkingInstructions,
				gate_code: data.gateCode,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("add customer address"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// If this is the first address or is default, set as customer's default
		if (data.isDefault) {
			await typedSupabase.from("customers").update({ default_address_id: address.id }).eq("id", data.customerId);
		}

		revalidatePath(`/dashboard/customers/${data.customerId}`);
		return address.id;
	});
}

/**
 * Build address update payload from form data
 */
function buildAddressUpdatePayload(formData: FormData): Record<string, unknown> {
	const updateData: Record<string, unknown> = {};

	if (formData.has("label")) {
		updateData.label = formData.get("label");
	}

	const addressLine1 = formData.get("addressLine1");
	if (addressLine1) {
		updateData.address_line1 = addressLine1;
	}

	if (formData.has("addressLine2")) {
		updateData.address_line2 = formData.get("addressLine2");
	}

	const city = formData.get("city");
	if (city) {
		updateData.city = city;
	}

	const state = formData.get("state");
	if (state) {
		updateData.state = state;
	}

	const zipCode = formData.get("zipCode");
	if (zipCode) {
		updateData.zip_code = zipCode;
	}

	if (formData.has("directions")) {
		updateData.directions = formData.get("directions");
	}

	if (formData.has("accessNotes")) {
		updateData.access_notes = formData.get("accessNotes");
	}

	if (formData.has("parkingInstructions")) {
		updateData.parking_instructions = formData.get("parkingInstructions");
	}

	if (formData.has("gateCode")) {
		updateData.gate_code = formData.get("gateCode");
	}

	if (formData.has("isDefault")) {
		updateData.is_default = formData.get("isDefault") === "true";
	}

	return updateData;
}

/**
 * Update customer address
 */
export async function updateCustomerAddress(addressId: string, formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		// Verify address belongs to company
		const { data: existingAddress } = await typedSupabase
			.from("customer_addresses")
			.select("company_id, customer_id, address_type")
			.eq("id", addressId)
			.single();

		assertExists(existingAddress, "Address");

		if (existingAddress.company_id !== companyId) {
			throw new ActionError(ERROR_MESSAGES.forbidden("address"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
		}

		const updateData = buildAddressUpdatePayload(formData);

		// Handle default flag separately to unset other defaults
		if (formData.has("isDefault")) {
			const isDefault = formData.get("isDefault") === "true";
			if (isDefault) {
				await typedSupabase
					.from("customer_addresses")
					.update({ is_default: false })
					.eq("customer_id", existingAddress.customer_id)
					.eq("address_type", existingAddress.address_type);
			}
		}

		// Update address
		const { error: updateError } = await typedSupabase
			.from("customer_addresses")
			.update(updateData)
			.eq("id", addressId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update address"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${existingAddress.customer_id}`);
	});
}

/**
 * Delete customer address
 */
export async function deleteCustomerAddress(addressId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		// Verify address belongs to company
		const { data: address } = await typedSupabase
			.from("customer_addresses")
			.select("company_id, customer_id")
			.eq("id", addressId)
			.single();

		assertExists(address, "Address");

		if (address.company_id !== companyId) {
			throw new ActionError(ERROR_MESSAGES.forbidden("address"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
		}

		// Soft delete
		const { error: deleteError } = await typedSupabase
			.from("customer_addresses")
			.update({ deleted_at: new Date().toISOString() })
			.eq("id", addressId);

		if (deleteError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete address"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${address.customer_id}`);
	});
}

// ============================================================================
// CUSTOMER BUSINESS INFO
// ============================================================================

/**
 * Build business info update payload from form data
 */
function buildBusinessInfoUpdatePayload(formData: FormData): Record<string, unknown> {
	const updateData: Record<string, unknown> = {};

	if (formData.has("isBusiness")) {
		updateData.is_business = formData.get("isBusiness") === "true";
	}

	if (formData.has("directions")) {
		updateData.directions = formData.get("directions");
	}

	if (formData.has("salesContext")) {
		updateData.sales_context = formData.get("salesContext");
	}

	if (formData.has("serviceFlags")) {
		try {
			const flags = JSON.parse(formData.get("serviceFlags") as string);
			updateData.service_flags = flags;
		} catch {
			// Invalid JSON, skip
		}
	}

	return updateData;
}

/**
 * Update customer business information
 */
export async function updateCustomerBusinessInfo(customerId: string, formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		// Verify customer belongs to company
		const { data: customer } = await typedSupabase.from("customers").select("company_id").eq("id", customerId).single();

		assertExists(customer, "Customer");

		if (customer.company_id !== companyId) {
			throw new ActionError(ERROR_MESSAGES.forbidden("customer"), ERROR_CODES.AUTH_FORBIDDEN, HTTP_STATUS.forbidden);
		}

		const updateData = buildBusinessInfoUpdatePayload(formData);

		// Update customer
		const { error: updateError } = await typedSupabase.from("customers").update(updateData).eq("id", customerId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update customer business info"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

type CustomerContact = Record<string, unknown>;

/**
 * Get all contacts for a customer
 */
export async function getCustomerContacts(customerId: string): Promise<ActionResult<CustomerContact[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		const { data: contacts, error } = await typedSupabase
			.from("customer_contacts")
			.select("*")
			.eq("customer_id", customerId)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("is_primary", { ascending: false })
			.order("created_at", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch customer contacts"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return contacts || [];
	});
}

type CustomerAddress = Record<string, unknown>;

/**
 * Get all addresses for a customer
 */
export async function getCustomerAddresses(customerId: string): Promise<ActionResult<CustomerAddress[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const typedSupabase = supabase as SupabaseServerClient;
		const { companyId } = await getAuthContext(typedSupabase);

		const { data: addresses, error } = await typedSupabase
			.from("customer_addresses")
			.select("*")
			.eq("customer_id", customerId)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("is_default", { ascending: false })
			.order("address_type", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch customer addresses"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return addresses || [];
	});
}
