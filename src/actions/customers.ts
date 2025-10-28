"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Server Actions for Customer Management
 *
 * Handles customer CRUD operations with server-side validation
 * and automatic cache revalidation
 */

// Validation schemas
const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid zip code required"),
  notes: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

/**
 * Create a new customer
 */
export async function createCustomer(
  formData: FormData
): Promise<{ success: boolean; error?: string; customerId?: string }> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      notes: formData.get("notes"),
    };

    const validated = customerSchema.parse(rawData);

    // TODO: Save to database
    const customerId = `customer-${Date.now()}`;

    // Revalidate customer lists
    revalidatePath("/dashboard/customers");

    return { success: true, customerId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" };
    }
    return { success: false, error: "Failed to create customer" };
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(
  customerId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      notes: formData.get("notes"),
    };

    const validated = customerSchema.parse(rawData);

    // TODO: Update in database

    // Revalidate customer pages
    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${customerId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" };
    }
    return { success: false, error: "Failed to update customer" };
  }
}

/**
 * Delete a customer
 */
export async function deleteCustomer(
  customerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Delete from database

    // Revalidate and redirect
    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
  } catch (error) {
    return { success: false, error: "Failed to delete customer" };
  }
}
