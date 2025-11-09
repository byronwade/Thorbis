"use server";

/**
 * Server Actions for Job Photos
 *
 * Handles photo upload, categorization, and management with:
 * - Server-side validation using Zod
 * - Supabase Storage integration
 * - Photo categorization (before/during/after/issue/equipment)
 * - Annotations and tagging
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type JobPhotoInsert,
  type JobPhotoUpdate,
  jobPhotoInsertSchema,
  jobPhotoUpdateSchema,
} from "@/lib/validations/database-schemas";

// ============================================================================
// CREATE PHOTO RECORD
// ============================================================================

export async function createJobPhoto(
  data: Omit<JobPhotoInsert, "company_id" | "uploaded_by">
): Promise<{ success: boolean; error?: string; photoId?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "User not associated with a company" };
    }

    // Create photo record
    const photoData: JobPhotoInsert = {
      ...data,
      company_id: teamMember.company_id,
      uploaded_by: user.id,
    };

    const validated = jobPhotoInsertSchema.parse(photoData);

    const { data: photo, error } = await supabase
      .from("job_photos")
      .insert(validated)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    // Update job completion photos count if this is a completion photo
    if (data.category === "completion" || data.is_required_photo) {
      const { data: job } = await supabase
        .from("jobs")
        .select("completion_photos_count")
        .eq("id", data.job_id)
        .single();

      if (job) {
        await supabase
          .from("jobs")
          .update({
            completion_photos_count: (job.completion_photos_count || 0) + 1,
          })
          .eq("id", data.job_id);
      }
    }

    revalidatePath(`/dashboard/work/${data.job_id}`);
    return { success: true, photoId: photo.id };
  } catch (error) {
    console.error("Create photo error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create photo",
    };
  }
}

// ============================================================================
// UPDATE PHOTO
// ============================================================================

export async function updateJobPhoto(
  photoId: string,
  data: Partial<JobPhotoUpdate>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify photo belongs to user or user is admin
    const { data: photo } = await supabase
      .from("job_photos")
      .select("id, job_id, uploaded_by, company_id")
      .eq("id", photoId)
      .single();

    if (!photo) {
      return { success: false, error: "Photo not found" };
    }

    // Check if user is admin or owner of photo
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("company_id", photo.company_id)
      .single();

    const role = Array.isArray(teamMember?.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember?.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (photo.uploaded_by !== user.id && !isAdmin) {
      return {
        success: false,
        error: "You can only edit your own photos",
      };
    }

    const validated = jobPhotoUpdateSchema.parse(data);

    const { error } = await supabase
      .from("job_photos")
      .update(validated)
      .eq("id", photoId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${photo.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Update photo error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update photo",
    };
  }
}

// ============================================================================
// DELETE PHOTO
// ============================================================================

export async function deleteJobPhoto(
  photoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get photo details
    const { data: photo } = await supabase
      .from("job_photos")
      .select("id, job_id, uploaded_by, company_id, storage_path, category")
      .eq("id", photoId)
      .single();

    if (!photo) {
      return { success: false, error: "Photo not found" };
    }

    // Check if user is admin or owner of photo
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("company_id", photo.company_id)
      .single();

    const role = Array.isArray(teamMember?.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember?.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (photo.uploaded_by !== user.id && !isAdmin) {
      return {
        success: false,
        error: "You can only delete your own photos",
      };
    }

    // Delete from storage
    try {
      const { error: storageError } = await supabase.storage
        .from("job-photos")
        .remove([photo.storage_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        // Continue with database deletion even if storage fails
      }
    } catch (storageError) {
      console.error("Storage deletion error:", storageError);
      // Continue with database deletion
    }

    // Delete from database
    const { error } = await supabase
      .from("job_photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    // Update job completion photos count if this was a completion photo
    if (photo.category === "completion") {
      const { data: job } = await supabase
        .from("jobs")
        .select("completion_photos_count")
        .eq("id", photo.job_id)
        .single();

      if (job && job.completion_photos_count > 0) {
        await supabase
          .from("jobs")
          .update({
            completion_photos_count: job.completion_photos_count - 1,
          })
          .eq("id", photo.job_id);
      }
    }

    revalidatePath(`/dashboard/work/${photo.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Delete photo error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete photo",
    };
  }
}

// ============================================================================
// ADD ANNOTATION
// ============================================================================

export async function addPhotoAnnotation(
  photoId: string,
  annotation: {
    type: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    color?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get photo
    const { data: photo } = await supabase
      .from("job_photos")
      .select("id, job_id, annotations")
      .eq("id", photoId)
      .single();

    if (!photo) {
      return { success: false, error: "Photo not found" };
    }

    // Add annotation
    const annotations = Array.isArray(photo.annotations)
      ? [...photo.annotations, annotation]
      : [annotation];

    const { error } = await supabase
      .from("job_photos")
      .update({ annotations })
      .eq("id", photoId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${photo.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Add annotation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add annotation",
    };
  }
}

// ============================================================================
// GET PHOTOS BY CATEGORY
// ============================================================================

export async function getPhotosByCategory(
  jobId: string,
  category: string
): Promise<{
  success: boolean;
  error?: string;
  photos?: any[];
}> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: photos, error } = await supabase
      .from("job_photos")
      .select(
        `
        *,
        uploaded_by_user:users!uploaded_by(
          id,
          name,
          email,
          avatar
        )
      `
      )
      .eq("job_id", jobId)
      .eq("category", category)
      .order("taken_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, photos: photos || [] };
  } catch (error) {
    console.error("Get photos error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get photos",
    };
  }
}
