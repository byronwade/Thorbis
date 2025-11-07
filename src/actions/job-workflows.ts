"use server";

/**
 * Server Actions for Job Workflows
 *
 * Handles workflow stage management and automation with:
 * - Server-side validation using Zod
 * - Stage progression rules
 * - Automation triggers (email, SMS, invoice)
 * - Required field validation
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  jobWorkflowStageInsertSchema,
  jobWorkflowStageUpdateSchema,
  type JobWorkflowStageInsert,
  type JobWorkflowStageUpdate,
} from "@/lib/validations/database-schemas";

// ============================================================================
// CREATE WORKFLOW STAGE
// ============================================================================

export async function createWorkflowStage(
  data: Omit<JobWorkflowStageInsert, "company_id">
): Promise<{ success: boolean; error?: string; stageId?: string }> {
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

    // Get user's company and verify admin role
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id, role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "User not associated with a company" };
    }

    const role = Array.isArray(teamMember.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (!isAdmin) {
      return {
        success: false,
        error: "Only admins can create workflow stages",
      };
    }

    const stageData: JobWorkflowStageInsert = {
      ...data,
      company_id: teamMember.company_id,
    };

    const validated = jobWorkflowStageInsertSchema.parse(stageData);

    const { data: stage, error } = await supabase
      .from("job_workflow_stages")
      .insert(validated)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/workflows");
    return { success: true, stageId: stage.id };
  } catch (error) {
    console.error("Create workflow stage error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create workflow stage",
    };
  }
}

// ============================================================================
// UPDATE JOB WORKFLOW STAGE
// ============================================================================

export async function updateJobWorkflowStage(
  jobId: string,
  newStageKey: string
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

    // Get job
    const { data: job } = await supabase
      .from("jobs")
      .select("id, company_id, workflow_stage, workflow_completed_stages")
      .eq("id", jobId)
      .single();

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Get new stage
    const { data: newStage } = await supabase
      .from("job_workflow_stages")
      .select("*")
      .eq("company_id", job.company_id)
      .eq("stage_key", newStageKey)
      .eq("is_active", true)
      .single();

    if (!newStage) {
      return { success: false, error: "Workflow stage not found" };
    }

    // Validate stage transition (if current stage has allowed_next_stages)
    if (job.workflow_stage) {
      const { data: currentStage } = await supabase
        .from("job_workflow_stages")
        .select("allowed_next_stages")
        .eq("company_id", job.company_id)
        .eq("stage_key", job.workflow_stage)
        .single();

      if (
        currentStage?.allowed_next_stages &&
        Array.isArray(currentStage.allowed_next_stages) &&
        currentStage.allowed_next_stages.length > 0 &&
        !currentStage.allowed_next_stages.includes(newStageKey)
      ) {
        return {
          success: false,
          error: `Cannot transition from ${job.workflow_stage} to ${newStageKey}`,
        };
      }
    }

    // Check if required fields are met
    if (newStage.required_fields && Array.isArray(newStage.required_fields)) {
      for (const field of newStage.required_fields) {
        if (field === "customer_signature") {
          const { data: signature } = await supabase
            .from("job_signatures")
            .select("id")
            .eq("job_id", jobId)
            .eq("signature_type", "customer")
            .single();

          if (!signature) {
            return {
              success: false,
              error: "Customer signature is required for this stage",
            };
          }
        }

        if (field === "completion_photos") {
          const { data: photos } = await supabase
            .from("job_photos")
            .select("id")
            .eq("job_id", jobId)
            .eq("category", "completion")
            .gte("id", newStage.required_photos_count || 1);

          if (!photos || photos.length < (newStage.required_photos_count || 1)) {
            return {
              success: false,
              error: `At least ${newStage.required_photos_count} completion photo(s) required`,
            };
          }
        }
      }
    }

    // Update completed stages array
    const completedStages = Array.isArray(job.workflow_completed_stages)
      ? job.workflow_completed_stages
      : [];

    if (job.workflow_stage && !completedStages.includes(job.workflow_stage)) {
      completedStages.push({
        stage_key: job.workflow_stage,
        completed_at: new Date().toISOString(),
        completed_by: user.id,
      });
    }

    // Update job
    const { error } = await supabase
      .from("jobs")
      .update({
        workflow_stage: newStageKey,
        workflow_completed_stages: completedStages,
        workflow_stage_changed_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    // Execute automation triggers
    if (newStage.auto_send_email) {
      // TODO: Send automated email
    }

    if (newStage.auto_send_sms) {
      // TODO: Send automated SMS
    }

    if (newStage.auto_create_invoice) {
      // TODO: Create invoice automatically
    }

    revalidatePath(`/dashboard/work/${jobId}`);
    return { success: true };
  } catch (error) {
    console.error("Update workflow stage error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update workflow stage",
    };
  }
}

// ============================================================================
// GET WORKFLOW STAGES
// ============================================================================

export async function getWorkflowStages(
  industryType?: string
): Promise<{
  success: boolean;
  error?: string;
  stages?: any[];
}> {
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

    let query = supabase
      .from("job_workflow_stages")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (industryType) {
      query = query.eq("industry_type", industryType);
    }

    const { data: stages, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, stages: stages || [] };
  } catch (error) {
    console.error("Get workflow stages error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get workflow stages",
    };
  }
}

// ============================================================================
// DELETE WORKFLOW STAGE
// ============================================================================

export async function deleteWorkflowStage(
  stageId: string
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

    // Get stage
    const { data: stage } = await supabase
      .from("job_workflow_stages")
      .select("id, company_id")
      .eq("id", stageId)
      .single();

    if (!stage) {
      return { success: false, error: "Workflow stage not found" };
    }

    // Check if user is admin
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("company_id", stage.company_id)
      .single();

    const role = Array.isArray(teamMember?.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember?.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (!isAdmin) {
      return {
        success: false,
        error: "Only admins can delete workflow stages",
      };
    }

    const { error } = await supabase
      .from("job_workflow_stages")
      .delete()
      .eq("id", stageId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/workflows");
    return { success: true };
  } catch (error) {
    console.error("Delete workflow stage error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete workflow stage",
    };
  }
}
