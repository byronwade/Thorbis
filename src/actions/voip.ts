"use server";

/**
 * VoIP Server Actions - Advanced phone system operations
 *
 * Actions:
 * - Team extension management
 * - Vacation mode configuration
 * - Call routing rules
 * - Holiday schedule management
 * - Call logs and analytics
 * - Call queue operations
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const extensionSchema = z.object({
  phone_extension: z.string().min(2).max(10),
  direct_inward_dial: z.string().optional(),
  extension_enabled: z.boolean(),
  voicemail_pin: z.string().max(6).optional(),
  call_forwarding_enabled: z.boolean(),
  call_forwarding_number: z.string().optional(),
  simultaneous_ring_enabled: z.boolean(),
  ring_timeout_seconds: z.number().min(15).max(90),
});

const vacationModeSchema = z.object({
  vacation_mode_enabled: z.boolean(),
  vacation_start_date: z.string().optional(),
  vacation_end_date: z.string().optional(),
  vacation_message: z.string().optional(),
});

const routingRuleSchema = z.object({
  name: z.string().min(1).max(255),
  routing_type: z.enum([
    "direct",
    "round_robin",
    "simultaneous",
    "ivr",
    "business_hours",
    "conditional",
  ]),
  ring_timeout: z.number().min(15).max(90),
  voicemail_enabled: z.boolean(),
  record_calls: z.boolean(),
  enabled: z.boolean(),
});

const holidaySchema = z.object({
  name: z.string().min(1).max(255),
  holiday_date: z.string(),
  is_recurring: z.boolean(),
  recurrence_type: z.enum(["yearly", "monthly", "weekly", "custom"]).optional(),
  special_greeting_message: z.string().optional(),
  enabled: z.boolean(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCompanyId(): Promise<
  { success: false; error: string } | { success: true; companyId: string }
> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: "Failed to initialize database connection",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: teamMember, error: teamError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (teamError || !teamMember) {
    return { success: false, error: "Company not found" };
  }

  return { success: true, companyId: teamMember.company_id };
}

// ============================================================================
// TEAM EXTENSIONS
// ============================================================================

export async function getTeamExtensions() {
  try {
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { data, error } = await supabase
      .from("team_members")
      .select(`
        id,
        full_name,
        email,
        role,
        phone_extension,
        direct_inward_dial,
        extension_enabled,
        voicemail_pin,
        call_forwarding_enabled,
        call_forwarding_number,
        simultaneous_ring_enabled,
        ring_timeout_seconds,
        team_availability (
          status,
          can_receive_calls,
          vacation_mode_enabled,
          vacation_start_date,
          vacation_end_date,
          vacation_message,
          do_not_disturb_until
        )
      `)
      .eq("company_id", companyResult.companyId)
      .order("full_name");

    if (error) {
      return { success: false, error: error.message };
    }

    // Transform the data to include availability as an object
    const transformedData = data.map((member: any) => ({
      ...member,
      availability:
        Array.isArray(member.team_availability) &&
        member.team_availability.length > 0
          ? member.team_availability[0]
          : null,
      team_availability: undefined,
    }));

    return { success: true, data: transformedData };
  } catch (error) {
    console.error("Error fetching team extensions:", error);
    return { success: false, error: "Failed to fetch team extensions" };
  }
}

export async function updateTeamMemberExtension(
  teamMemberId: string,
  extensionData: z.infer<typeof extensionSchema>
) {
  try {
    const validated = extensionSchema.parse(extensionData);
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    // Check if extension is already in use
    if (validated.extension_enabled && validated.phone_extension) {
      const { data: existing } = await supabase
        .from("team_members")
        .select("id")
        .eq("company_id", companyResult.companyId)
        .eq("phone_extension", validated.phone_extension)
        .eq("extension_enabled", true)
        .neq("id", teamMemberId)
        .single();

      if (existing) {
        return { success: false, error: "This extension is already in use" };
      }
    }

    const { error } = await supabase
      .from("team_members")
      .update(validated)
      .eq("id", teamMemberId)
      .eq("company_id", companyResult.companyId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    console.error("Error updating team member extension:", error);
    return { success: false, error: "Failed to update extension settings" };
  }
}

export async function setVacationMode(
  teamMemberId: string,
  vacationData: z.infer<typeof vacationModeSchema>
) {
  try {
    const validated = vacationModeSchema.parse(vacationData);
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    // Get or create team_availability record
    const { data: availability, error: fetchError } = await supabase
      .from("team_availability")
      .select("id")
      .eq("team_member_id", teamMemberId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return { success: false, error: fetchError.message };
    }

    if (availability) {
      // Update existing record
      const { error } = await supabase
        .from("team_availability")
        .update(validated)
        .eq("id", availability.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Create new record
      const { error } = await supabase.from("team_availability").insert({
        team_member_id: teamMemberId,
        ...validated,
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    console.error("Error setting vacation mode:", error);
    return { success: false, error: "Failed to set vacation mode" };
  }
}

// ============================================================================
// CALL ROUTING RULES
// ============================================================================

export async function getCallRoutingRules() {
  try {
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { data, error } = await supabase
      .from("call_routing_rules")
      .select("*")
      .eq("company_id", companyResult.companyId)
      .order("priority");

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching routing rules:", error);
    return { success: false, error: "Failed to fetch routing rules" };
  }
}

export async function createRoutingRule(
  ruleData: z.infer<typeof routingRuleSchema>
) {
  try {
    const validated = routingRuleSchema.parse(ruleData);
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    // Get the highest priority to assign next
    const { data: maxPriority } = await supabase
      .from("call_routing_rules")
      .select("priority")
      .eq("company_id", companyResult.companyId)
      .order("priority", { ascending: false })
      .limit(1)
      .single();

    const nextPriority = (maxPriority?.priority || 0) + 1;

    const { error } = await supabase.from("call_routing_rules").insert({
      ...validated,
      company_id: companyResult.companyId,
      priority: nextPriority,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    console.error("Error creating routing rule:", error);
    return { success: false, error: "Failed to create routing rule" };
  }
}

export async function updateRoutingRule(
  ruleId: string,
  ruleData: z.infer<typeof routingRuleSchema>
) {
  try {
    const validated = routingRuleSchema.parse(ruleData);
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { error } = await supabase
      .from("call_routing_rules")
      .update(validated)
      .eq("id", ruleId)
      .eq("company_id", companyResult.companyId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    console.error("Error updating routing rule:", error);
    return { success: false, error: "Failed to update routing rule" };
  }
}

export async function deleteRoutingRule(ruleId: string) {
  try {
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { error } = await supabase
      .from("call_routing_rules")
      .delete()
      .eq("id", ruleId)
      .eq("company_id", companyResult.companyId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    console.error("Error deleting routing rule:", error);
    return { success: false, error: "Failed to delete routing rule" };
  }
}

export async function updateRulePriority(
  ruleId: string,
  direction: "up" | "down"
) {
  try {
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    // Get current rule
    const { data: currentRule, error: fetchError } = await supabase
      .from("call_routing_rules")
      .select("priority")
      .eq("id", ruleId)
      .eq("company_id", companyResult.companyId)
      .single();

    if (fetchError || !currentRule) {
      return { success: false, error: "Rule not found" };
    }

    const currentPriority = currentRule.priority;
    const newPriority =
      direction === "up" ? currentPriority - 1 : currentPriority + 1;

    // Swap priorities
    await supabase
      .from("call_routing_rules")
      .update({ priority: -1 })
      .eq("priority", newPriority)
      .eq("company_id", companyResult.companyId);

    await supabase
      .from("call_routing_rules")
      .update({ priority: newPriority })
      .eq("id", ruleId);

    await supabase
      .from("call_routing_rules")
      .update({ priority: currentPriority })
      .eq("priority", -1)
      .eq("company_id", companyResult.companyId);

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    console.error("Error updating rule priority:", error);
    return { success: false, error: "Failed to update priority" };
  }
}

// ============================================================================
// COMPANY HOLIDAYS
// ============================================================================

export async function getCompanyHolidays() {
  try {
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { data, error } = await supabase
      .from("company_holidays")
      .select("*")
      .eq("company_id", companyResult.companyId)
      .order("holiday_date");

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return { success: false, error: "Failed to fetch holidays" };
  }
}

export async function createHoliday(
  holidayData: z.infer<typeof holidaySchema>
) {
  try {
    const validated = holidaySchema.parse(holidayData);
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { error } = await supabase.from("company_holidays").insert({
      ...validated,
      company_id: companyResult.companyId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    console.error("Error creating holiday:", error);
    return { success: false, error: "Failed to create holiday" };
  }
}

export async function updateHoliday(
  holidayId: string,
  holidayData: z.infer<typeof holidaySchema>
) {
  try {
    const validated = holidaySchema.parse(holidayData);
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { error } = await supabase
      .from("company_holidays")
      .update(validated)
      .eq("id", holidayId)
      .eq("company_id", companyResult.companyId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    console.error("Error updating holiday:", error);
    return { success: false, error: "Failed to update holiday" };
  }
}

export async function deleteHoliday(holidayId: string) {
  try {
    const companyResult = await getCompanyId();
    if (!companyResult.success) {
      return { success: false, error: companyResult.error };
    }

    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize database connection",
      };
    }

    const { error } = await supabase
      .from("company_holidays")
      .delete()
      .eq("id", holidayId)
      .eq("company_id", companyResult.companyId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/settings/communications/phone");
    return { success: true };
  } catch (error) {
    console.error("Error deleting holiday:", error);
    return { success: false, error: "Failed to delete holiday" };
  }
}
