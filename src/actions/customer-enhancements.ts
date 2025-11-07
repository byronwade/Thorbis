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
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const customerContactSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  title: z.string().max(100).optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").max(20),
  secondaryPhone: z.string().max(20).optional(),
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
  label: z.string().max(100).optional(),
  addressLine1: z.string().min(1, "Address is required").max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(50),
  zipCode: z.string().min(1, "ZIP code is required").max(20),
  country: z.string().max(50).default("USA"),
  directions: z.string().optional(),
  accessNotes: z.string().optional(),
  parkingInstructions: z.string().optional(),
  gateCode: z.string().max(50).optional(),
});

const updateCustomerBusinessInfoSchema = z.object({
  isBusiness: z.boolean(),
  directions: z.string().optional(),
  salesContext: z.string().optional(),
  serviceFlags: z.array(z.string()).optional(),
});

// ============================================================================
// CUSTOMER CONTACTS
// ============================================================================

/**
 * Add contact to business customer
 */
export async function addCustomerContact(
  formData: FormData
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = customerContactSchema.parse({
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
      preferredContactMethod: formData.get("preferredContactMethod") as any || "email",
      notes: formData.get("notes") || undefined,
    });

    // Verify customer exists and belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("company_id, is_business")
      .eq("id", data.customerId)
      .single();

    assertExists(customer, "Customer");

    if (customer.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("customer"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Ensure customer is marked as business
    if (!customer.is_business) {
      await supabase
        .from("customers")
        .update({ is_business: true })
        .eq("id", data.customerId);
    }

    // If setting as primary, unset other primaries
    if (data.isPrimary) {
      await supabase
        .from("customer_contacts")
        .update({ is_primary: false })
        .eq("customer_id", data.customerId);
    }

    // Add contact
    const { data: contact, error: createError } = await supabase
      .from("customer_contacts")
      .insert({
        company_id: teamMember.company_id,
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("add customer contact"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${data.customerId}`);
    return contact.id;
  });
}

/**
 * Update customer contact
 */
export async function updateCustomerContact(
  contactId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify contact belongs to company
    const { data: existingContact } = await supabase
      .from("customer_contacts")
      .select("company_id, customer_id")
      .eq("id", contactId)
      .single();

    assertExists(existingContact, "Contact");

    if (existingContact.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("contact"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const updateData: any = {};
    if (formData.get("firstName")) updateData.first_name = formData.get("firstName");
    if (formData.get("lastName")) updateData.last_name = formData.get("lastName");
    if (formData.has("title")) updateData.title = formData.get("title");
    if (formData.get("email")) updateData.email = formData.get("email");
    if (formData.get("phone")) updateData.phone = formData.get("phone");
    if (formData.has("secondaryPhone")) updateData.secondary_phone = formData.get("secondaryPhone");
    if (formData.has("notes")) updateData.notes = formData.get("notes");

    // Handle boolean flags
    if (formData.has("isPrimary")) {
      const isPrimary = formData.get("isPrimary") === "true";
      if (isPrimary) {
        // Unset other primaries
        await supabase
          .from("customer_contacts")
          .update({ is_primary: false })
          .eq("customer_id", existingContact.customer_id);
      }
      updateData.is_primary = isPrimary;
    }

    if (formData.has("isBillingContact")) {
      updateData.is_billing_contact = formData.get("isBillingContact") === "true";
    }

    if (formData.has("isEmergencyContact")) {
      updateData.is_emergency_contact = formData.get("isEmergencyContact") === "true";
    }

    // Update contact
    const { error: updateError } = await supabase
      .from("customer_contacts")
      .update(updateData)
      .eq("id", contactId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update contact"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${existingContact.customer_id}`);
  });
}

/**
 * Delete customer contact
 */
export async function deleteCustomerContact(
  contactId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify contact belongs to company
    const { data: contact } = await supabase
      .from("customer_contacts")
      .select("company_id, customer_id")
      .eq("id", contactId)
      .single();

    assertExists(contact, "Contact");

    if (contact.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("contact"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from("customer_contacts")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", contactId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete contact"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${contact.customer_id}`);
  });
}

// ============================================================================
// CUSTOMER ADDRESSES
// ============================================================================

/**
 * Add address to customer
 */
export async function addCustomerAddress(
  formData: FormData
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = customerAddressSchema.parse({
      customerId: formData.get("customerId"),
      addressType: formData.get("addressType") as any,
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

    // Verify customer exists and belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("company_id")
      .eq("id", data.customerId)
      .single();

    assertExists(customer, "Customer");

    if (customer.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("customer"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // If setting as default, unset other defaults of same type
    if (data.isDefault) {
      await supabase
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("customer_id", data.customerId)
        .eq("address_type", data.addressType);
    }

    // Add address
    const { data: address, error: createError } = await supabase
      .from("customer_addresses")
      .insert({
        company_id: teamMember.company_id,
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("add customer address"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // If this is the first address or is default, set as customer's default
    if (data.isDefault) {
      await supabase
        .from("customers")
        .update({ default_address_id: address.id })
        .eq("id", data.customerId);
    }

    revalidatePath(`/dashboard/customers/${data.customerId}`);
    return address.id;
  });
}

/**
 * Update customer address
 */
export async function updateCustomerAddress(
  addressId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify address belongs to company
    const { data: existingAddress } = await supabase
      .from("customer_addresses")
      .select("company_id, customer_id, address_type")
      .eq("id", addressId)
      .single();

    assertExists(existingAddress, "Address");

    if (existingAddress.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("address"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const updateData: any = {};
    if (formData.has("label")) updateData.label = formData.get("label");
    if (formData.get("addressLine1")) updateData.address_line1 = formData.get("addressLine1");
    if (formData.has("addressLine2")) updateData.address_line2 = formData.get("addressLine2");
    if (formData.get("city")) updateData.city = formData.get("city");
    if (formData.get("state")) updateData.state = formData.get("state");
    if (formData.get("zipCode")) updateData.zip_code = formData.get("zipCode");
    if (formData.has("directions")) updateData.directions = formData.get("directions");
    if (formData.has("accessNotes")) updateData.access_notes = formData.get("accessNotes");
    if (formData.has("parkingInstructions")) updateData.parking_instructions = formData.get("parkingInstructions");
    if (formData.has("gateCode")) updateData.gate_code = formData.get("gateCode");

    if (formData.has("isDefault")) {
      const isDefault = formData.get("isDefault") === "true";
      if (isDefault) {
        // Unset other defaults of same type
        await supabase
          .from("customer_addresses")
          .update({ is_default: false })
          .eq("customer_id", existingAddress.customer_id)
          .eq("address_type", existingAddress.address_type);
      }
      updateData.is_default = isDefault;
    }

    // Update address
    const { error: updateError } = await supabase
      .from("customer_addresses")
      .update(updateData)
      .eq("id", addressId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update address"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${existingAddress.customer_id}`);
  });
}

/**
 * Delete customer address
 */
export async function deleteCustomerAddress(
  addressId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify address belongs to company
    const { data: address } = await supabase
      .from("customer_addresses")
      .select("company_id, customer_id")
      .eq("id", addressId)
      .single();

    assertExists(address, "Address");

    if (address.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("address"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from("customer_addresses")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", addressId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete address"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${address.customer_id}`);
  });
}

// ============================================================================
// CUSTOMER BUSINESS INFO
// ============================================================================

/**
 * Update customer business information
 */
export async function updateCustomerBusinessInfo(
  customerId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify customer belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("company_id")
      .eq("id", customerId)
      .single();

    assertExists(customer, "Customer");

    if (customer.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("customer"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const updateData: any = {};

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

    // Update customer
    const { error: updateError } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", customerId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update customer business info"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
  });
}

/**
 * Get all contacts for a customer
 */
export async function getCustomerContacts(customerId: string): Promise<ActionResult<any[]>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const { data: contacts, error } = await supabase
      .from("customer_contacts")
      .select("*")
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch customer contacts"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return contacts || [];
  });
}

/**
 * Get all addresses for a customer
 */
export async function getCustomerAddresses(customerId: string): Promise<ActionResult<any[]>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const { data: addresses, error } = await supabase
      .from("customer_addresses")
      .select("*")
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("is_default", { ascending: false })
      .order("address_type", { ascending: true });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch customer addresses"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return addresses || [];
  });
}
