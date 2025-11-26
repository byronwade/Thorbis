"use server";

import { revalidatePath } from "next/cache";
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

		revalidatePath("/dashboard/work/price-book");
		return { success: true };
	} catch (_error) {
		return { success: false, error: "Failed to archive price book item" };
	}
}
