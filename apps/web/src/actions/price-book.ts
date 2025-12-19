"use server";

import { revalidatePath } from "next/cache";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// Price Book Actions
// ============================================================================

/**
 * Archive a price book item (soft delete)
 */
export async function archivePriceBookItem(
	itemId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { error } = await supabase
			.from("price_book")
			.update({
				deleted_at: new Date().toISOString(),
			})
			.eq("id", itemId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/work/pricebook");
		revalidatePath(`/dashboard/work/pricebook/${itemId}`);
		return { success: true };
	} catch (_error) {
		return { success: false, error: "Failed to archive price book item" };
	}
}

/**
 * Restore an archived price book item
 */
export async function restorePriceBookItem(
	itemId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { error } = await supabase
			.from("price_book")
			.update({
				deleted_at: null,
			})
			.eq("id", itemId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/work/pricebook");
		revalidatePath(`/dashboard/work/pricebook/${itemId}`);
		return { success: true };
	} catch (_error) {
		return { success: false, error: "Failed to restore price book item" };
	}
}

/**
 * Duplicate a price book item
 */
export async function duplicatePriceBookItem(
	itemId: string,
): Promise<{ success: boolean; newItemId?: string; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company" };
		}

		// Fetch the original item
		const { data: originalItem, error: fetchError } = await supabase
			.from("price_book")
			.select("*")
			.eq("id", itemId)
			.single();

		if (fetchError || !originalItem) {
			return { success: false, error: "Item not found" };
		}

		// Create a copy with modified fields
		const {
			id: _id,
			created_at: _createdAt,
			updated_at: _updatedAt,
			deleted_at: _deletedAt,
			sku,
			name,
			...restOfItem
		} = originalItem;

		// Generate a new SKU by appending -COPY or incrementing
		const newSku = sku ? `${sku}-COPY` : null;
		const newName = `${name} (Copy)`;

		const { data: newItem, error: insertError } = await supabase
			.from("price_book")
			.insert({
				...restOfItem,
				company_id: companyId,
				sku: newSku,
				name: newName,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select("id")
			.single();

		if (insertError) {
			return { success: false, error: insertError.message };
		}

		revalidatePath("/dashboard/work/pricebook");
		return { success: true, newItemId: newItem?.id };
	} catch (_error) {
		return { success: false, error: "Failed to duplicate price book item" };
	}
}
