/**
 * Property Management Server Actions
 *
 * Property/location management for customers with:
 * - Property CRUD operations
 * - Multiple properties per customer
 * - Property type classification
 * - Equipment tracking per property
 * - Job history per property
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	ActionError,
	ERROR_CODES,
	ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { geocodeAddressSilent } from "@/lib/maps/geocoding";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const propertySchema = z.object({
	customerId: z.string().uuid("Customer is required"),
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
	notes: z.string().optional(),
	lat: z.number().optional(), // Coordinates from Google Places (if available)
	lon: z.number().optional(),
});

// ============================================================================
// PROPERTY CRUD OPERATIONS
// ============================================================================

/**
 * Find existing property or create new one for customer
 * Prevents duplicate properties for the same address
 */
export async function findOrCreateProperty(
	formData: FormData,
): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get active company ID
		const activeCompanyId = await getActiveCompanyId();
		if (!activeCompanyId) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Validate input
		const data = propertySchema.parse({
			customerId: formData.get("customerId"),
			name: formData.get("name"),
			address: formData.get("address"),
			address2: formData.get("address2") || undefined,
			city: formData.get("city"),
			state: formData.get("state"),
			zipCode: formData.get("zipCode"),
			country: formData.get("country") || "USA",
			propertyType: formData.get("propertyType") || undefined,
			squareFootage: formData.get("squareFootage")
				? Number(formData.get("squareFootage"))
				: undefined,
			yearBuilt: formData.get("yearBuilt")
				? Number(formData.get("yearBuilt"))
				: undefined,
			notes: formData.get("notes") || undefined,
			lat: formData.get("lat") ? Number(formData.get("lat")) : undefined,
			lon: formData.get("lon") ? Number(formData.get("lon")) : undefined,
		});

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id")
			.eq("id", data.customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== activeCompanyId) {
			throw new ActionError(
				"Customer not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Check if property already exists for this customer with the same address
		const { data: existingProperty } = await supabase
			.from("properties")
			.select("id")
			.eq("customer_id", data.customerId)
			.eq("address", data.address)
			.eq("city", data.city)
			.eq("state", data.state)
			.eq("zip_code", data.zipCode)
			.eq("company_id", activeCompanyId)
			.maybeSingle();

		// If property exists, return its ID
		if (existingProperty) {
			return existingProperty.id;
		}

		// Use coordinates from Google Places if provided, otherwise geocode in background
		const _fullAddress = `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`;

		// Create property immediately
		const insertData: Record<string, any> = {
			company_id: activeCompanyId,
			customer_id: data.customerId,
			name: data.name,
			address: data.address,
			city: data.city,
			state: data.state,
			zip_code: data.zipCode,
			country: data.country,
			notes: data.notes,
		};

		// Only include optional fields if they have values
		if (data.address2) {
			insertData.address2 = data.address2;
		}
		if (data.squareFootage) {
			insertData.square_footage = data.squareFootage;
		}
		if (data.yearBuilt) {
			insertData.year_built = data.yearBuilt;
		}

		// If coordinates provided from Google Places, save them immediately
		if (data.lat && data.lon) {
			insertData.lat = data.lat;
			insertData.lon = data.lon;
		}

		const { data: property, error: createError } = await supabase
			.from("properties")
			.insert(insertData)
			.select("id")
			.single();

		// Only geocode in background if coordinates weren't provided
		if (property?.id && !data.lat && !data.lon) {
			// Fire and forget - don't wait for this
			geocodeAddressSilent(
				data.address,
				data.city,
				data.state,
				data.zipCode,
				data.country,
			)
				.then((geocoded) => {
					if (geocoded) {
						// Update property with coordinates
						supabase
							.from("properties")
							.update({
								lat: geocoded.lat,
								lon: geocoded.lon,
							})
							.eq("id", property.id);
					}
				})
				// Intentionally ignoring geocoding errors - best effort operation
				.catch((_error) => {
					// Geocoding is optional
				});
		}

		if (createError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create property"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		assertExists(property, "Property");

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${data.customerId}`);

		return property.id;
	});
}

/**
 * Create a new property for a customer
 */
async function createProperty(
	formData: FormData,
): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Validate input
		const data = propertySchema.parse({
			customerId: formData.get("customerId"),
			name: formData.get("name"),
			address: formData.get("address"),
			address2: formData.get("address2") || undefined,
			city: formData.get("city"),
			state: formData.get("state"),
			zipCode: formData.get("zipCode"),
			country: formData.get("country") || "USA",
			propertyType: formData.get("propertyType") || undefined,
			squareFootage: formData.get("squareFootage")
				? Number(formData.get("squareFootage"))
				: undefined,
			yearBuilt: formData.get("yearBuilt")
				? Number(formData.get("yearBuilt"))
				: undefined,
			notes: formData.get("notes") || undefined,
		});

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id")
			.eq("id", data.customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError(
				"Customer not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Geocode property address
		let propertyLat: number | null = null;
		let propertyLon: number | null = null;

		const geocodeResult = await geocodeAddressSilent(
			data.address,
			data.city,
			data.state,
			data.zipCode,
			data.country,
		);

		if (geocodeResult) {
			propertyLat = geocodeResult.lat;
			propertyLon = geocodeResult.lon;
		}

		// Create property
		const { data: property, error: createError } = await supabase
			.from("properties")
			.insert({
				company_id: teamMember.company_id,
				customer_id: data.customerId,
				name: data.name,
				address: data.address,
				address2: data.address2,
				city: data.city,
				state: data.state,
				zip_code: data.zipCode,
				country: data.country,
				property_type: data.propertyType,
				square_footage: data.squareFootage,
				year_built: data.yearBuilt,
				notes: data.notes,
				lat: propertyLat,
				lon: propertyLon,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create property"),
				ERROR_CODES.DB_QUERY_ERROR,
				400,
				{
					dbError: createError.message,
					code: createError.code,
				},
			);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${data.customerId}`);
		return property.id;
	});
}

/**
 * Update existing property
 */
export async function _updateProperty(
	propertyId: string,
	formData: FormData,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify property exists and belongs to company
		const { data: property } = await supabase
			.from("properties")
			.select("id, company_id, customer_id")
			.eq("id", propertyId)
			.single();

		assertExists(property, "Property");

		if (property.company_id !== teamMember.company_id) {
			throw new ActionError(
				"Property not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Validate input
		const data = propertySchema.parse({
			customerId: property.customer_id, // Keep existing customer
			name: formData.get("name"),
			address: formData.get("address"),
			address2: formData.get("address2") || undefined,
			city: formData.get("city"),
			state: formData.get("state"),
			zipCode: formData.get("zipCode"),
			country: formData.get("country") || "USA",
			propertyType: formData.get("propertyType") || undefined,
			squareFootage: formData.get("squareFootage")
				? Number(formData.get("squareFootage"))
				: undefined,
			yearBuilt: formData.get("yearBuilt")
				? Number(formData.get("yearBuilt"))
				: undefined,
			notes: formData.get("notes") || undefined,
		});

		// Update property
		const { error: updateError } = await supabase
			.from("properties")
			.update({
				name: data.name,
				address: data.address,
				address2: data.address2,
				city: data.city,
				state: data.state,
				zip_code: data.zipCode,
				country: data.country,
				property_type: data.propertyType,
				square_footage: data.squareFootage,
				year_built: data.yearBuilt,
				notes: data.notes,
			})
			.eq("id", propertyId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update property"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${property.customer_id}`);
	});
}

/**
 * Archive property (soft delete)
 * Only allowed if no equipment or jobs are associated
 *
 * Archives instead of permanently deleting. Can be restored within 90 days.
 */
export async function archiveProperty(
	propertyId: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify property exists and belongs to company
		const { data: property } = await supabase
			.from("properties")
			.select("id, company_id, customer_id")
			.eq("id", propertyId)
			.single();

		assertExists(property, "Property");

		if (property.company_id !== teamMember.company_id) {
			throw new ActionError(
				"Property not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Check if property has equipment
		const { data: equipment } = await supabase
			.from("equipment")
			.select("id")
			.eq("property_id", propertyId)
			.is("deleted_at", null)
			.limit(1);

		if (equipment && equipment.length > 0) {
			throw new ActionError(
				"Cannot archive property with equipment. Remove or reassign equipment first.",
				ERROR_CODES.BUSINESS_RULE_VIOLATION,
			);
		}

		// Check if property has jobs
		const { data: jobs } = await supabase
			.from("jobs")
			.select("id")
			.eq("property_id", propertyId)
			.is("deleted_at", null)
			.limit(1);

		if (jobs && jobs.length > 0) {
			throw new ActionError(
				"Cannot archive property with job history.",
				ERROR_CODES.BUSINESS_RULE_VIOLATION,
			);
		}

		// Archive property (soft delete)
		const now = new Date().toISOString();
		const scheduledDeletion = new Date(
			Date.now() + 90 * 24 * 60 * 60 * 1000,
		).toISOString();

		const { error: archiveError } = await supabase
			.from("properties")
			.update({
				deleted_at: now,
				deleted_by: user.id,
				archived_at: now,
				permanent_delete_scheduled_at: scheduledDeletion,
			})
			.eq("id", propertyId);

		if (archiveError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("archive property"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${property.customer_id}`);
		revalidatePath("/dashboard/settings/archive");
	});
}

/**
 * Restore archived property
 */
async function _restoreProperty(
	propertyId: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify property belongs to company and is archived
		const { data: property } = await supabase
			.from("properties")
			.select("id, company_id, customer_id, deleted_at")
			.eq("id", propertyId)
			.single();

		assertExists(property, "Property");

		if (property.company_id !== teamMember.company_id) {
			throw new ActionError(
				"Property not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		if (!property.deleted_at) {
			throw new ActionError(
				"Property is not archived",
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Restore property
		const { error: restoreError } = await supabase
			.from("properties")
			.update({
				deleted_at: null,
				deleted_by: null,
				archived_at: null,
				permanent_delete_scheduled_at: null,
			})
			.eq("id", propertyId);

		if (restoreError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("restore property"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/customers");
		revalidatePath(`/dashboard/customers/${property.customer_id}`);
		revalidatePath("/dashboard/settings/archive");
	});
}

/**
 * Delete property (legacy - deprecated)
 * @deprecated Use archiveProperty() instead
 */
async function _deleteProperty(
	propertyId: string,
): Promise<ActionResult<void>> {
	return archiveProperty(propertyId);
}

// ============================================================================
// PROPERTY QUERIES
// ============================================================================

/**
 * Get all properties for a customer
 */
async function _getCustomerProperties(
	customerId: string,
): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
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
			throw new ActionError(
				"Customer not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Get all properties for customer
		const { data: properties, error } = await supabase
			.from("properties")
			.select("*")
			.eq("customer_id", customerId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch properties"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		return properties || [];
	});
}

/**
 * Get property with equipment count
 */
async function _getPropertyWithDetails(
	propertyId: string,
): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Get property
		const { data: property, error: propertyError } = await supabase
			.from("properties")
			.select(
				`
        *,
        customer:customers(id, display_name, email, phone)
      `,
			)
			.eq("id", propertyId)
			.single();

		if (propertyError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch property"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		assertExists(property, "Property");

		if (property.company_id !== teamMember.company_id) {
			throw new ActionError(
				"Property not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Get equipment count (head: true prevents data transfer)
		const { count: equipmentCount } = await supabase
			.from("equipment")
			.select("id", { count: "exact", head: true })
			.eq("property_id", propertyId)
			.is("deleted_at", null);

		// Get job count (head: true prevents data transfer)
		const { count: jobCount } = await supabase
			.from("jobs")
			.select("id", { count: "exact", head: true })
			.eq("property_id", propertyId);

		return {
			...property,
			equipmentCount: equipmentCount || 0,
			jobCount: jobCount || 0,
		};
	});
}

/**
 * Set property as primary for customer
 * This is useful when a customer has multiple properties
 */
async function _setPrimaryProperty(
	customerId: string,
	propertyId: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify customer exists and belongs to company
		const { data: customer } = await supabase
			.from("customers")
			.select("id, company_id, address, city, state, zip_code")
			.eq("id", customerId)
			.is("deleted_at", null)
			.single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError(
				"Customer not found",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify property exists and belongs to customer
		const { data: property } = await supabase
			.from("properties")
			.select("id, customer_id, address, city, state, zip_code")
			.eq("id", propertyId)
			.single();

		assertExists(property, "Property");

		if (property.customer_id !== customerId) {
			throw new ActionError(
				"Property does not belong to this customer",
				ERROR_CODES.BUSINESS_RULE_VIOLATION,
			);
		}

		// Update customer's primary address to match this property
		const { error: updateError } = await supabase
			.from("customers")
			.update({
				address: property.address,
				city: property.city,
				state: property.state,
				zip_code: property.zip_code,
			})
			.eq("id", customerId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("set primary property"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

// Alias for backward compatibility
;
