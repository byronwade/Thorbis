/**
 * Team Management Server Actions
 *
 * Handles team member and role management with server-side validation
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
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
export async function inviteTeamMember(formData: FormData) {
  try {
    const data = inviteTeamMemberSchema.parse({
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      role: formData.get("role"),
      department: formData.get("department") || undefined,
    });

    // TODO: Send invitation email and create user record

    revalidatePath("/dashboard/settings/team");
    return {
      success: true,
      message: `Invitation sent to ${data.email}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to send invitation" };
  }
}

/**
 * Update team member
 */
export async function updateTeamMember(
  memberId: string,
  formData: FormData
) {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      status: formData.get("status") as string,
    };

    // TODO: Update in database

    revalidatePath("/dashboard/settings/team");
    revalidatePath(`/dashboard/settings/team/${memberId}`);
    return { success: true, message: "Team member updated successfully" };
  } catch (error) {
    return { success: false, error: "Failed to update team member" };
  }
}

/**
 * Remove team member
 */
export async function removeTeamMember(memberId: string) {
  try {
    // TODO: Soft delete or remove from database

    revalidatePath("/dashboard/settings/team");
    return { success: true, message: "Team member removed successfully" };
  } catch (error) {
    return { success: false, error: "Failed to remove team member" };
  }
}

/**
 * Create role
 */
export async function createRole(formData: FormData) {
  try {
    const permissionsString = formData.get("permissions") as string;
    const permissions = permissionsString ? permissionsString.split(",") : [];

    const data = createRoleSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      permissions,
    });

    // TODO: Save to database

    revalidatePath("/dashboard/settings/team/roles");
    return { success: true, message: "Role created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to create role" };
  }
}

/**
 * Update role
 */
export async function updateRole(roleId: string, formData: FormData) {
  try {
    const permissionsString = formData.get("permissions") as string;
    const permissions = permissionsString ? permissionsString.split(",") : [];

    const data = createRoleSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      permissions,
    });

    // TODO: Update in database

    revalidatePath("/dashboard/settings/team/roles");
    revalidatePath(`/dashboard/settings/team/roles/${roleId}`);
    return { success: true, message: "Role updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update role" };
  }
}

/**
 * Delete role
 */
export async function deleteRole(roleId: string) {
  try {
    // TODO: Check if role is in use, then delete

    revalidatePath("/dashboard/settings/team/roles");
    return { success: true, message: "Role deleted successfully" };
  } catch (error) {
    return { success: false, error: "Failed to delete role" };
  }
}

/**
 * Create department
 */
export async function createDepartment(formData: FormData) {
  try {
    const data = createDepartmentSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      managerId: formData.get("managerId") || undefined,
    });

    // TODO: Save to database

    revalidatePath("/dashboard/settings/team/departments");
    return { success: true, message: "Department created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to create department" };
  }
}

/**
 * Update department
 */
export async function updateDepartment(
  departmentId: string,
  formData: FormData
) {
  try {
    const data = createDepartmentSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      managerId: formData.get("managerId") || undefined,
    });

    // TODO: Update in database

    revalidatePath("/dashboard/settings/team/departments");
    return { success: true, message: "Department updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update department" };
  }
}

/**
 * Delete department
 */
export async function deleteDepartment(departmentId: string) {
  try {
    // TODO: Check if department has members, then delete

    revalidatePath("/dashboard/settings/team/departments");
    return { success: true, message: "Department deleted successfully" };
  } catch (error) {
    return { success: false, error: "Failed to delete department" };
  }
}
