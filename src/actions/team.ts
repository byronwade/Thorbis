/**
 * Team Management Server Actions
 *
 * Handles team member and role management with server-side validation
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

// Schema for inviting team members
const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "manager", "technician", "dispatcher"], {
    message: "Role is required",
  }),
  department: z.string().optional(),
});

// Schema for creating roles
const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission is required"),
});

// Schema for creating departments
const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().optional(),
  managerId: z.string().optional(),
});

/**
 * Invite team member
 */
export async function inviteTeamMember(
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company to invite team members",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = inviteTeamMemberSchema.parse({
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      role: formData.get("role"),
      department: formData.get("department") || undefined,
    });

    // Check if user already exists
    let userId: string;
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user record (they'll complete registration via invitation link)
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          email_verified: false,
          is_active: true,
        })
        .select("id")
        .single();

      if (userError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("create user"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }

      userId = newUser.id;
    }

    // Get role ID if role is specified
    let roleId: string | undefined;
    if (data.role) {
      const { data: role } = await supabase
        .from("custom_roles")
        .select("id")
        .eq("name", data.role)
        .eq("company_id", teamMember.company_id)
        .single();

      roleId = role?.id;
    }

    // Get department ID if department is specified
    let departmentId: string | undefined;
    if (data.department) {
      const { data: dept } = await supabase
        .from("departments")
        .select("id")
        .eq("id", data.department)
        .eq("company_id", teamMember.company_id)
        .single();

      departmentId = dept?.id;
    }

    // Create team member invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("team_members")
      .insert({
        company_id: teamMember.company_id,
        user_id: userId,
        role_id: roleId,
        department_id: departmentId,
        status: "invited",
        invited_by: user.id,
        invited_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (inviteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("send invitation"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // TODO: Send invitation email via Supabase Auth or email service
    // await supabase.auth.admin.inviteUserByEmail(data.email)

    revalidatePath("/dashboard/settings/team");
    return invitation.id;
  });
}

/**
 * Update team member
 */
export async function updateTeamMember(
  memberId: string,
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company to verify permissions
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify team member belongs to same company
    const { data: targetMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("id", memberId)
      .single();

    assertExists(targetMember, "Team member");

    if (targetMember.company_id !== currentUserTeam.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("team member"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Get role ID if role is specified
    let roleId: string | null = null;
    const roleInput = formData.get("role") as string;
    if (roleInput) {
      const { data: role } = await supabase
        .from("custom_roles")
        .select("id")
        .eq("id", roleInput)
        .eq("company_id", currentUserTeam.company_id)
        .single();

      roleId = role?.id || null;
    }

    // Get department ID if department is specified
    let departmentId: string | null = null;
    const departmentInput = formData.get("department") as string;
    if (departmentInput) {
      const { data: dept } = await supabase
        .from("departments")
        .select("id")
        .eq("id", departmentInput)
        .eq("company_id", currentUserTeam.company_id)
        .single();

      departmentId = dept?.id || null;
    }

    const updateData: any = {
      role_id: roleId,
      department_id: departmentId,
      status: formData.get("status") as string,
      job_title: formData.get("jobTitle") as string,
    };

    // Update team member
    const { error: updateError } = await supabase
      .from("team_members")
      .update(updateData)
      .eq("id", memberId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update team member"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team");
    revalidatePath(`/dashboard/settings/team/${memberId}`);
  });
}

/**
 * Remove team member
 */
export async function removeTeamMember(
  memberId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company to verify permissions
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify team member belongs to same company
    const { data: targetMember } = await supabase
      .from("team_members")
      .select("company_id, user_id")
      .eq("id", memberId)
      .single();

    assertExists(targetMember, "Team member");

    if (targetMember.company_id !== currentUserTeam.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("team member"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Prevent removing yourself
    if (targetMember.user_id === user.id) {
      throw new ActionError(
        "You cannot remove yourself from the team",
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Soft delete: set status to 'suspended'
    const { error: updateError } = await supabase
      .from("team_members")
      .update({ status: "suspended" })
      .eq("id", memberId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("remove team member"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team");
  });
}

/**
 * Create role
 */
export async function createRole(
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const permissionsString = formData.get("permissions") as string;
    const permissions = permissionsString ? permissionsString.split(",") : [];

    const data = createRoleSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      permissions,
    });

    // Check if role name already exists in company
    const { data: existingRole } = await supabase
      .from("custom_roles")
      .select("id")
      .eq("name", data.name)
      .eq("company_id", currentUserTeam.company_id)
      .single();

    if (existingRole) {
      throw new ActionError(
        ERROR_MESSAGES.alreadyExists("Role"),
        ERROR_CODES.DB_DUPLICATE_ENTRY
      );
    }

    // Create role
    const { data: newRole, error: createError } = await supabase
      .from("custom_roles")
      .insert({
        company_id: currentUserTeam.company_id,
        name: data.name,
        description: data.description,
        permissions: data.permissions,
        is_system: false,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create role"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team/roles");
    return newRole.id;
  });
}

/**
 * Update role
 */
export async function updateRole(
  roleId: string,
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify role belongs to company and is not a system role
    const { data: existingRole } = await supabase
      .from("custom_roles")
      .select("company_id, is_system")
      .eq("id", roleId)
      .single();

    assertExists(existingRole, "Role");

    if (existingRole.company_id !== currentUserTeam.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("role"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (existingRole.is_system) {
      throw new ActionError(
        "System roles cannot be modified",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    const permissionsString = formData.get("permissions") as string;
    const permissions = permissionsString ? permissionsString.split(",") : [];

    const data = createRoleSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      permissions,
    });

    // Update role
    const { error: updateError } = await supabase
      .from("custom_roles")
      .update({
        name: data.name,
        description: data.description,
        permissions: data.permissions,
      })
      .eq("id", roleId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update role"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team/roles");
    revalidatePath(`/dashboard/settings/team/roles/${roleId}`);
  });
}

/**
 * Delete role
 */
export async function deleteRole(roleId: string): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify role belongs to company and is not a system role
    const { data: existingRole } = await supabase
      .from("custom_roles")
      .select("company_id, is_system, name")
      .eq("id", roleId)
      .single();

    assertExists(existingRole, "Role");

    if (existingRole.company_id !== currentUserTeam.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("role"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (existingRole.is_system) {
      throw new ActionError(
        "System roles cannot be deleted",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Check if role is in use by any team members
    const { data: teamMembersWithRole, error: checkError } = await supabase
      .from("team_members")
      .select("id")
      .eq("role_id", roleId)
      .limit(1);

    if (checkError) {
      throw new ActionError(
        "Failed to check role usage",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    if (teamMembersWithRole && teamMembersWithRole.length > 0) {
      throw new ActionError(
        ERROR_MESSAGES.cannotDelete(
          "role",
          "it is currently assigned to team members"
        ),
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Delete role
    const { error: deleteError } = await supabase
      .from("custom_roles")
      .delete()
      .eq("id", roleId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete role"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team/roles");
  });
}

/**
 * Create department
 */
export async function createDepartment(
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = createDepartmentSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      managerId: formData.get("managerId") || undefined,
    });

    // Check if department name already exists in company
    const { data: existingDepartment } = await supabase
      .from("departments")
      .select("id")
      .eq("name", data.name)
      .eq("company_id", currentUserTeam.company_id)
      .single();

    if (existingDepartment) {
      throw new ActionError(
        ERROR_MESSAGES.alreadyExists("Department"),
        ERROR_CODES.DB_DUPLICATE_ENTRY
      );
    }

    // Create department
    const { data: newDepartment, error: createError } = await supabase
      .from("departments")
      .insert({
        company_id: currentUserTeam.company_id,
        name: data.name,
        description: data.description,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create department"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team/departments");
    return newDepartment.id;
  });
}

/**
 * Update department
 */
export async function updateDepartment(
  departmentId: string,
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify department belongs to company
    const { data: existingDepartment } = await supabase
      .from("departments")
      .select("company_id")
      .eq("id", departmentId)
      .single();

    assertExists(existingDepartment, "Department");

    if (existingDepartment.company_id !== currentUserTeam.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("department"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = createDepartmentSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      managerId: formData.get("managerId") || undefined,
    });

    // Update department
    const { error: updateError } = await supabase
      .from("departments")
      .update({
        name: data.name,
        description: data.description,
      })
      .eq("id", departmentId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update department"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team/departments");
  });
}

/**
 * Delete department
 */
export async function deleteDepartment(
  departmentId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: currentUserTeam } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!currentUserTeam?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify department belongs to company
    const { data: existingDepartment } = await supabase
      .from("departments")
      .select("company_id, name")
      .eq("id", departmentId)
      .single();

    assertExists(existingDepartment, "Department");

    if (existingDepartment.company_id !== currentUserTeam.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("department"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Check if department has members
    const { data: teamMembersInDept, error: checkError } = await supabase
      .from("team_members")
      .select("id")
      .eq("department_id", departmentId)
      .limit(1);

    if (checkError) {
      throw new ActionError(
        "Failed to check department usage",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    if (teamMembersInDept && teamMembersInDept.length > 0) {
      throw new ActionError(
        ERROR_MESSAGES.cannotDelete(
          "department",
          "it still has team members assigned"
        ),
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Delete department
    const { error: deleteError } = await supabase
      .from("departments")
      .delete()
      .eq("id", departmentId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete department"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/team/departments");
  });
}

// ============================================================================
// FETCH FUNCTIONS
// ============================================================================

export type TeamMemberWithDetails = {
  id: string;
  user_id: string;
  company_id: string;
  role_id: string | null;
  department_id: string | null;
  status: string;
  job_title: string | null;
  phone: string | null;
  invited_at: string | null;
  joined_at: string | null;
  last_active_at: string | null;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  role: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  department: {
    id: string;
    name: string;
    color: string | null;
  } | null;
};

/**
 * Get all team members for current user's company
 */
export async function getTeamMembers(): Promise<
  ActionResult<TeamMemberWithDetails[]>
> {
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

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Fetch all team members with related data
    const { data: members, error } = await supabase
      .from("team_members")
      .select(
        `
        id,
        user_id,
        company_id,
        role_id,
        department_id,
        status,
        job_title,
        phone,
        invited_at,
        joined_at,
        last_active_at,
        created_at,
        users!team_members_user_id_fkey (
          id,
          name,
          email,
          avatar
        ),
        custom_roles!team_members_role_id_fkey (
          id,
          name,
          color
        ),
        departments!team_members_department_id_fkey (
          id,
          name,
          color
        )
      `
      )
      .eq("company_id", teamMember.company_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch team members"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Transform the data to match expected structure
    const transformedMembers = members.map((member: any) => ({
      id: member.id,
      user_id: member.user_id,
      company_id: member.company_id,
      role_id: member.role_id,
      department_id: member.department_id,
      status: member.status,
      job_title: member.job_title,
      phone: member.phone,
      invited_at: member.invited_at,
      joined_at: member.joined_at,
      last_active_at: member.last_active_at,
      created_at: member.created_at,
      user: member.users,
      role: member.custom_roles,
      department: member.departments,
    }));

    return transformedMembers;
  });
}

/**
 * Get all roles for current user's company
 */
export async function getRoles(): Promise<
  ActionResult<
    Array<{
      id: string;
      name: string;
      description: string | null;
      color: string | null;
      permissions: string[];
      is_system: boolean;
      member_count?: number;
    }>
  >
> {
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

    // Get user's company
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

    // Fetch roles
    const { data: roles, error } = await supabase
      .from("custom_roles")
      .select("id, name, description, color, permissions, is_system")
      .eq("company_id", teamMember.company_id)
      .order("name");

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch roles"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Get member counts for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const { count } = await supabase
          .from("team_members")
          .select("*", { count: "exact", head: true })
          .eq("role_id", role.id)
          .eq("company_id", teamMember.company_id);

        return {
          ...role,
          member_count: count || 0,
        };
      })
    );

    return rolesWithCounts;
  });
}

/**
 * Get all departments for current user's company
 */
export async function getDepartments(): Promise<
  ActionResult<
    Array<{
      id: string;
      name: string;
      description: string | null;
      color: string | null;
      member_count?: number;
    }>
  >
> {
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

    // Get user's company
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

    // Fetch departments
    const { data: departments, error } = await supabase
      .from("departments")
      .select("id, name, description, color")
      .eq("company_id", teamMember.company_id)
      .order("name");

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch departments"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Get member counts for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const { count } = await supabase
          .from("team_members")
          .select("*", { count: "exact", head: true })
          .eq("department_id", dept.id)
          .eq("company_id", teamMember.company_id);

        return {
          ...dept,
          member_count: count || 0,
        };
      })
    );

    return departmentsWithCounts;
  });
}
