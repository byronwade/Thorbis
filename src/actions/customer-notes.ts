"use server";

/**
 * Customer Notes Server Actions
 *
 * Handles CRUD operations for customer notes with:
 * - Pagination support
 * - Note type filtering (customer vs internal)
 * - Pinned notes
 * - Soft delete
 *
 * NOTE: Types moved to @/types/customer-notes
 * to comply with Next.js 16 "use server" file restrictions.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

type NoteType = "customer" | "internal";

type GetNotesOptions = {
	customerId: string;
	noteType?: NoteType | "all";
	limit?: number;
	offset?: number;
};

type UpdateCustomerNoteInput = {
	content?: string;
	isPinned?: boolean;
};

/**
 * Get customer notes with pagination
 */
export async function getCustomerNotes({ customerId, noteType = "all", limit = 50, offset = 0 }: GetNotesOptions) {
	try {
		const supabase = await getSupabaseServerClient();
		const { companyId } = await getUserAndCompany(supabase);

		let query = supabase
			.from("customer_notes")
			.select(
				`
        *,
        user:users!user_id(name, email, avatar)
      `,
				{ count: "exact" }
			)
			.eq("customer_id", customerId)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("is_pinned", { ascending: false })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (noteType !== "all") {
			query = query.eq("note_type", noteType);
		}

		const { data, error, count } = await query;

		if (error) {
			return { success: false, error: error.message };
		}

		return {
			success: true,
			data: data || [],
			count: count || 0,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch notes",
		};
	}
}

/**
 * Create a new customer note
 */
export async function createCustomerNote({
	customerId,
	content,
	noteType,
	isPinned = false,
}: {
	customerId: string;
	content: string;
	noteType: NoteType;
	isPinned?: boolean;
}) {
	try {
		const supabase = await getSupabaseServerClient();
		const { userId, companyId } = await getUserAndCompany(supabase);

		const { data, error } = await supabase
			.from("customer_notes")
			.insert({
				customer_id: customerId,
				company_id: companyId,
				user_id: userId,
				note_type: noteType,
				content,
				is_pinned: isPinned,
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
		return { success: true, data };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create note",
		};
	}
}

/**
 * Update a customer note
 */
export async function updateCustomerNote({
	noteId,
	content,
	isPinned,
}: {
	noteId: string;
	content?: string;
	isPinned?: boolean;
}) {
	try {
		const supabase = await getSupabaseServerClient();
		await getUserAndCompany(supabase);
		const updateData = buildNoteUpdatePayload({ content, isPinned });

		if (Object.keys(updateData).length === 0) {
			return { success: false, error: "No update fields provided" };
		}

		const { data, error } = await supabase.from("customer_notes").update(updateData).eq("id", noteId).select().single();

		if (error) {
			return { success: false, error: error.message };
		}

		if (data?.customer_id) {
			revalidatePath(`/dashboard/customers/${data.customer_id}`);
		}

		return { success: true, data };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update note",
		};
	}
}

/**
 * Delete a customer note (soft delete)
 */
export async function deleteCustomerNote(noteId: string) {
	try {
		const supabase = await getSupabaseServerClient();
		await getUserAndCompany(supabase);

		const { data, error } = await supabase
			.from("customer_notes")
			.update({ deleted_at: new Date().toISOString() })
			.eq("id", noteId)
			.select("customer_id")
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		if (data?.customer_id) {
			revalidatePath(`/dashboard/customers/${data.customer_id}`);
		}

		return { success: true };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete note",
		};
	}
}

const getSupabaseServerClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Database connection failed");
	}
	return supabase as SupabaseServerClient;
};

const getUserAndCompany = async (supabase: SupabaseServerClient): Promise<{ userId: string; companyId: string }> => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Not authenticated");
	}

	const { data: teamMember } = await supabase.from("team_members").select("company_id").eq("user_id", user.id).single();

	if (!teamMember?.company_id) {
		throw new Error("No company found");
	}

	return { userId: user.id, companyId: teamMember.company_id };
};

const buildNoteUpdatePayload = ({ content, isPinned }: UpdateCustomerNoteInput): Record<string, unknown> => {
	const updates: Record<string, unknown> = {};

	if (content !== undefined) {
		updates.content = content;
	}

	if (isPinned !== undefined) {
		updates.is_pinned = isPinned;
	}

	return updates;
};
