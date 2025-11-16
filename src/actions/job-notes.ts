"use server";

/**
 * Job Notes Server Actions
 *
 * Handles CRUD operations for job notes with:
 * - Pagination support
 * - Note type filtering (customer vs internal)
 * - Pinned notes
 * - Soft delete
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type GetJobNotesOptions = {
	jobId: string;
	noteType?: "customer" | "internal" | "all";
	limit?: number;
	offset?: number;
};

/**
 * Get job notes with pagination
 */
export async function getJobNotes({ jobId, noteType = "all", limit = 50, offset = 0 }: GetJobNotesOptions) {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			return { success: false, error: "No company found" };
		}

		let query = supabase
			.from("job_notes")
			.select(
				`
        *,
        user:users!user_id(name, email, avatar)
      `,
				{ count: "exact" }
			)
			.eq("job_id", jobId)
			.eq("company_id", teamMember.company_id)
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
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch notes",
		};
	}
}

/**
 * Create a new job note
 */
export async function createJobNote({
	jobId,
	content,
	noteType,
	isPinned = false,
}: {
	jobId: string;
	content: string;
	noteType: "customer" | "internal";
	isPinned?: boolean;
}) {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			return { success: false, error: "No company found" };
		}

		const { data, error } = await supabase
			.from("job_notes")
			.insert({
				job_id: jobId,
				company_id: teamMember.company_id,
				user_id: user.id,
				note_type: noteType,
				content,
				is_pinned: isPinned,
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(`/dashboard/work/${jobId}`);
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create note",
		};
	}
}

/**
 * Update a job note
 */
export async function updateJobNote({
	noteId,
	content,
	isPinned,
}: {
	noteId: string;
	content?: string;
	isPinned?: boolean;
}) {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const updateData: Record<string, unknown> = {};
		if (content !== undefined) {
			updateData.content = content;
		}
		if (isPinned !== undefined) {
			updateData.is_pinned = isPinned;
		}

		const { data, error } = await supabase.from("job_notes").update(updateData).eq("id", noteId).select().single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update note",
		};
	}
}

/**
 * Delete a job note (soft delete)
 */
export async function deleteJobNote(noteId: string) {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { error } = await supabase
			.from("job_notes")
			.update({
				deleted_at: new Date().toISOString(),
				deleted_by: user?.id,
			})
			.eq("id", noteId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete note",
		};
	}
}
