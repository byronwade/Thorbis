/**
 * AI Planner Service - Multi-step planning with approval workflow
 * Based on ReAct and Chain-of-Thought reasoning patterns
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import crypto from "crypto";

export type PlanStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";

export type StepStatus = "pending" | "in_progress" | "completed" | "failed" | "skipped";

export type StepType =
  | "query"
  | "create"
  | "update"
  | "delete"
  | "tool_call"
  | "analysis"
  | "notification"
  | "wait"
  | "conditional";

export interface PlanStep {
  stepNumber: number;
  description: string;
  stepType: StepType;
  toolName?: string;
  toolParams?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
  expectedOutcome?: string;
  dependsOn?: number[];
  isReversible: boolean;
  requiresApproval: boolean;
  estimatedDurationMs?: number;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  steps: PlanStep[];
  status: PlanStatus;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
}

export interface PlanExecutionResult {
  planId: string;
  status: "completed" | "partial" | "failed";
  completedSteps: number;
  totalSteps: number;
  results: Array<{
    stepNumber: number;
    status: StepStatus;
    result?: Record<string, unknown>;
    error?: string;
    durationMs: number;
  }>;
}

/**
 * Create a new multi-step plan
 */
export async function createPlan(
  companyId: string,
  userId: string,
  chatId: string,
  messageId: string,
  plan: {
    title: string;
    description: string;
    steps: PlanStep[];
    requiresApproval?: boolean;
  }
): Promise<string> {
  const supabase = createServiceSupabaseClient();
  const planId = crypto.randomUUID();

  // Calculate total estimated duration
  const estimatedDuration = plan.steps.reduce(
    (sum, step) => sum + (step.estimatedDurationMs || 1000),
    0
  );

  // Check if any step requires approval
  const hasApprovalRequired =
    plan.requiresApproval || plan.steps.some((step) => step.requiresApproval);

  const { error } = await supabase.from("ai_plans").insert({
    id: planId,
    company_id: companyId,
    user_id: userId,
    chat_id: chatId,
    message_id: messageId,
    title: plan.title,
    description: plan.description,
    steps: plan.steps,
    total_steps: plan.steps.length,
    completed_steps: 0,
    status: hasApprovalRequired ? "pending_approval" : "draft",
    requires_approval: hasApprovalRequired,
    estimated_duration_ms: estimatedDuration,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to create plan:", error);
    throw error;
  }

  return planId;
}

/**
 * Get a plan by ID
 */
export async function getPlan(companyId: string, planId: string): Promise<Plan | null> {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("ai_plans")
    .select("*")
    .eq("id", planId)
    .eq("company_id", companyId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    steps: data.steps as PlanStep[],
    status: data.status as PlanStatus,
    createdAt: data.created_at as string,
    approvedAt: data.approved_at as string | undefined,
    completedAt: data.completed_at as string | undefined,
  };
}

/**
 * Approve a plan for execution
 */
export async function approvePlan(
  companyId: string,
  planId: string,
  approvedBy: string
): Promise<boolean> {
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from("ai_plans")
    .update({
      status: "approved",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("company_id", companyId)
    .eq("status", "pending_approval");

  if (error) {
    console.error("Failed to approve plan:", error);
    return false;
  }

  return true;
}

/**
 * Reject a plan
 */
export async function rejectPlan(
  companyId: string,
  planId: string,
  rejectedBy: string,
  reason: string
): Promise<boolean> {
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from("ai_plans")
    .update({
      status: "cancelled",
      rejection_reason: reason,
      rejected_by: rejectedBy,
      rejected_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("company_id", companyId)
    .eq("status", "pending_approval");

  if (error) {
    console.error("Failed to reject plan:", error);
    return false;
  }

  return true;
}

/**
 * Update plan execution progress
 */
export async function updatePlanProgress(
  companyId: string,
  planId: string,
  stepNumber: number,
  stepResult: {
    status: StepStatus;
    result?: Record<string, unknown>;
    error?: string;
    durationMs: number;
  }
): Promise<void> {
  const supabase = createServiceSupabaseClient();

  // Get current plan
  const { data: plan, error: fetchError } = await supabase
    .from("ai_plans")
    .select("steps, completed_steps, total_steps, execution_results")
    .eq("id", planId)
    .eq("company_id", companyId)
    .single();

  if (fetchError || !plan) {
    console.error("Failed to fetch plan:", fetchError);
    return;
  }

  // Update step status in the steps array
  const steps = plan.steps as PlanStep[];
  const stepIndex = steps.findIndex((s) => s.stepNumber === stepNumber);
  if (stepIndex >= 0) {
    // Note: We're not modifying steps directly since PlanStep doesn't have status
    // Instead we track in execution_results
  }

  // Update execution results
  const executionResults = (plan.execution_results as Array<{
    stepNumber: number;
    status: StepStatus;
    result?: Record<string, unknown>;
    error?: string;
    durationMs: number;
  }>) || [];

  const existingIndex = executionResults.findIndex((r) => r.stepNumber === stepNumber);
  if (existingIndex >= 0) {
    executionResults[existingIndex] = { stepNumber, ...stepResult };
  } else {
    executionResults.push({ stepNumber, ...stepResult });
  }

  // Calculate completed steps
  const completedSteps = executionResults.filter(
    (r) => r.status === "completed" || r.status === "skipped"
  ).length;

  // Determine overall status
  let planStatus: PlanStatus = "in_progress";
  if (stepResult.status === "failed") {
    planStatus = "failed";
  } else if (completedSteps >= plan.total_steps) {
    planStatus = "completed";
  }

  const { error: updateError } = await supabase
    .from("ai_plans")
    .update({
      steps,
      completed_steps: completedSteps,
      current_step: stepNumber,
      execution_results: executionResults,
      status: planStatus,
      ...(planStatus === "completed" ? { completed_at: new Date().toISOString() } : {}),
      ...(planStatus === "failed" ? { failed_at: new Date().toISOString() } : {}),
    })
    .eq("id", planId)
    .eq("company_id", companyId);

  if (updateError) {
    console.error("Failed to update plan progress:", updateError);
  }
}

/**
 * Start plan execution
 */
export async function startPlanExecution(
  companyId: string,
  planId: string
): Promise<boolean> {
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from("ai_plans")
    .update({
      status: "in_progress",
      started_at: new Date().toISOString(),
      current_step: 1,
    })
    .eq("id", planId)
    .eq("company_id", companyId)
    .in("status", ["draft", "approved"]);

  if (error) {
    console.error("Failed to start plan execution:", error);
    return false;
  }

  return true;
}

/**
 * Cancel a plan in progress
 */
export async function cancelPlan(
  companyId: string,
  planId: string,
  cancelledBy: string,
  reason: string
): Promise<boolean> {
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from("ai_plans")
    .update({
      status: "cancelled",
      cancellation_reason: reason,
      cancelled_by: cancelledBy,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", planId)
    .eq("company_id", companyId)
    .in("status", ["draft", "pending_approval", "approved", "in_progress"]);

  if (error) {
    console.error("Failed to cancel plan:", error);
    return false;
  }

  return true;
}

/**
 * Get plans for a chat session
 */
export async function getChatPlans(
  companyId: string,
  chatId: string,
  options?: { status?: PlanStatus; limit?: number }
): Promise<
  Array<{
    id: string;
    title: string;
    status: PlanStatus;
    totalSteps: number;
    completedSteps: number;
    createdAt: string;
  }>
> {
  const supabase = createServiceSupabaseClient();
  const limit = options?.limit || 20;

  let query = supabase
    .from("ai_plans")
    .select("id, title, status, total_steps, completed_steps, created_at")
    .eq("company_id", companyId)
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to get chat plans:", error);
    return [];
  }

  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status as PlanStatus,
    totalSteps: p.total_steps,
    completedSteps: p.completed_steps,
    createdAt: p.created_at as string,
  }));
}

/**
 * Get pending approval plans for a company (admin dashboard)
 */
export async function getPendingApprovalPlans(
  companyId: string,
  options?: { limit?: number }
): Promise<
  Array<{
    id: string;
    title: string;
    description: string;
    totalSteps: number;
    userId: string;
    chatId: string;
    createdAt: string;
    estimatedDurationMs: number;
  }>
> {
  const supabase = createServiceSupabaseClient();
  const limit = options?.limit || 20;

  const { data, error } = await supabase
    .from("ai_plans")
    .select(
      "id, title, description, total_steps, user_id, chat_id, created_at, estimated_duration_ms"
    )
    .eq("company_id", companyId)
    .eq("status", "pending_approval")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Failed to get pending approval plans:", error);
    return [];
  }

  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    totalSteps: p.total_steps,
    userId: p.user_id,
    chatId: p.chat_id,
    createdAt: p.created_at as string,
    estimatedDurationMs: p.estimated_duration_ms,
  }));
}

/**
 * Get plan execution statistics
 */
export async function getPlanStatistics(
  companyId: string,
  dateRange: { start: Date; end: Date }
): Promise<{
  totalPlans: number;
  completedPlans: number;
  failedPlans: number;
  cancelledPlans: number;
  avgCompletionRate: number;
  avgDurationMs: number;
  pendingApprovals: number;
}> {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("ai_plans")
    .select("status, completed_steps, total_steps, estimated_duration_ms, actual_duration_ms")
    .eq("company_id", companyId)
    .gte("created_at", dateRange.start.toISOString())
    .lte("created_at", dateRange.end.toISOString());

  if (error || !data) {
    return {
      totalPlans: 0,
      completedPlans: 0,
      failedPlans: 0,
      cancelledPlans: 0,
      avgCompletionRate: 0,
      avgDurationMs: 0,
      pendingApprovals: 0,
    };
  }

  const completedPlans = data.filter((p) => p.status === "completed").length;
  const failedPlans = data.filter((p) => p.status === "failed").length;
  const cancelledPlans = data.filter((p) => p.status === "cancelled").length;
  const pendingApprovals = data.filter((p) => p.status === "pending_approval").length;

  // Calculate average completion rate
  const completionRates = data
    .filter((p) => p.total_steps > 0)
    .map((p) => (p.completed_steps / p.total_steps) * 100);
  const avgCompletionRate =
    completionRates.length > 0
      ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
      : 0;

  // Calculate average duration
  const durations = data
    .filter((p) => p.actual_duration_ms)
    .map((p) => p.actual_duration_ms as number);
  const avgDurationMs =
    durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

  return {
    totalPlans: data.length,
    completedPlans,
    failedPlans,
    cancelledPlans,
    avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
    avgDurationMs: Math.round(avgDurationMs),
    pendingApprovals,
  };
}

/**
 * Generate a plan from natural language description
 * This is a simplified version - in production, use an LLM
 */
export function generatePlanFromDescription(
  description: string,
  context: { entityType?: string; entityId?: string }
): PlanStep[] {
  // This is a placeholder - in production, use an LLM to generate the plan
  // For now, we'll return a basic structure

  const steps: PlanStep[] = [
    {
      stepNumber: 1,
      description: "Analyze the request and gather context",
      stepType: "analysis",
      isReversible: false,
      requiresApproval: false,
      estimatedDurationMs: 500,
    },
    {
      stepNumber: 2,
      description: `Execute the main action: ${description.substring(0, 100)}`,
      stepType: context.entityId ? "update" : "query",
      entityType: context.entityType,
      entityId: context.entityId,
      isReversible: true,
      requiresApproval: true,
      estimatedDurationMs: 1000,
    },
    {
      stepNumber: 3,
      description: "Verify the results and report back",
      stepType: "analysis",
      dependsOn: [2],
      isReversible: false,
      requiresApproval: false,
      estimatedDurationMs: 500,
    },
  ];

  return steps;
}
