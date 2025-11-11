# Role-Based Access Control (RBAC) System

**Comprehensive guide to the Stratos RBAC implementation**

## Overview

The RBAC system provides fine-grained access control based on user roles. Each team member has a role that determines their permissions and dashboard view.

## Architecture

### Database Layer
- **Migration**: `20250211000000_add_rbac_system.sql`
- **Enum Type**: `user_role` with 6 predefined roles
- **Storage**: `team_members.role` column
- **Permissions**: `team_members.permissions` JSONB for custom overrides

### Application Layer
- **Server Utilities**: `src/lib/auth/permissions.ts`
- **Server Actions**: `src/actions/roles.ts`
- **Client Store**: `src/lib/stores/role-store.ts` (Zustand)

## Roles

### 1. Owner
- **Description**: Full system access with focus on business financials
- **Permissions**: ALL (wildcard)
- **Dashboard**: Financial overview, profit margins, cash flow, reports
- **Limit**: One per company (enforced by unique index)

### 2. Admin
- **Description**: System administration and configuration
- **Permissions**: ALL except deleting team members
- **Dashboard**: System settings, user management, integrations, audit logs

### 3. Manager
- **Description**: Team oversight and operations management
- **Permissions**:
  - View reports
  - Manage team
  - Approve estimates
  - Handle escalations
  - Dispatch jobs
  - Manage schedule
  - Delete jobs
- **Dashboard**: Team performance, KPI tracking, callback queue

### 4. Dispatcher
- **Description**: Schedule management and job assignments
- **Permissions**:
  - Dispatch jobs
  - Manage schedule
  - View tech locations
  - Create jobs
  - Schedule appointments
- **Dashboard**: Dispatch map, technician locations, emergency queue

### 5. Technician
- **Description**: Field work and job updates
- **Permissions**:
  - Update job status
  - Create invoices
  - Upload photos
  - View assigned jobs
- **Dashboard**: My schedule, active job, my earnings, time tracking
- **Scope**: Can only see own schedule and assigned jobs

### 6. CSR (Customer Service Rep)
- **Description**: Customer communication and scheduling
- **Permissions**:
  - Create jobs
  - Schedule appointments
  - Send communications
  - Create invoices
  - View customers
- **Dashboard**: Call queue, booking calendar, follow-up queue

## Database Schema

### team_members Table

```sql
ALTER TABLE team_members
ADD COLUMN role user_role DEFAULT 'technician' NOT NULL,
ADD COLUMN permissions JSONB DEFAULT '{}'::jsonb,
ADD COLUMN department TEXT,
ADD COLUMN job_title TEXT;
```

### Helper Functions

#### `has_role(user_id, role, company_id)`
Check if user has a specific role.

```sql
SELECT has_role(
  '123e4567-e89b-12d3-a456-426614174000',
  'manager'::user_role,
  'company-uuid'
);
```

#### `has_any_role(user_id, roles[], company_id)`
Check if user has any of the specified roles.

```sql
SELECT has_any_role(
  '123e4567-e89b-12d3-a456-426614174000',
  ARRAY['owner', 'manager', 'admin']::user_role[],
  'company-uuid'
);
```

#### `get_user_role(user_id, company_id)`
Get user's role in a company.

```sql
SELECT get_user_role(
  '123e4567-e89b-12d3-a456-426614174000',
  'company-uuid'
);
-- Returns: 'manager'
```

#### `has_permission(user_id, permission_key, company_id)`
Check if user has a specific permission.

```sql
SELECT has_permission(
  '123e4567-e89b-12d3-a456-426614174000',
  'delete_jobs',
  'company-uuid'
);
-- Returns: true/false
```

#### `is_company_owner(user_id, company_id)`
Check if user is the company owner.

```sql
SELECT is_company_owner(
  '123e4567-e89b-12d3-a456-426614174000',
  'company-uuid'
);
```

## Usage

### Server-Side Permission Checks

```typescript
import { hasPermission, getUserRole, hasRole } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

// Check permission before action
export async function deleteJob(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const companyId = await getActiveCompanyId();

  // Check if user can delete jobs
  const canDelete = await hasPermission(
    supabase,
    user.id,
    "delete_jobs",
    companyId
  );

  if (!canDelete) {
    return { error: "You don't have permission to delete jobs" };
  }

  // Proceed with deletion...
}

// Check role
export async function manageTeam() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const companyId = await getActiveCompanyId();

  const isManager = await hasRole(
    supabase,
    user.id,
    "manager",
    companyId
  );

  if (!isManager) {
    return { error: "Manager role required" };
  }

  // Manager logic...
}
```

### Server Actions

```typescript
import { checkPermission, checkRole, getCurrentUserRole } from "@/actions/roles";

// In a Server Action
export async function deleteJobAction(jobId: string) {
  // Check permission
  const canDelete = await checkPermission("delete_jobs");

  if (!canDelete.data) {
    return { error: "Access denied" };
  }

  // Delete job...
}

// Get current user's role
export async function loadDashboard() {
  const roleResult = await getCurrentUserRole();

  if (roleResult.success && roleResult.data) {
    const role = roleResult.data;
    // Load role-specific dashboard...
  }
}
```

### Client-Side Role Display

```typescript
"use client";

import { useRoleStore } from "@/lib/stores/role-store";
import { ROLES, roleHasPermission } from "@/lib/auth/permissions";

export function MyComponent() {
  const currentRole = useRoleStore((state) => state.role);
  const roleConfig = ROLES[currentRole];

  // Check if role has permission (client-side check only!)
  const canDelete = roleHasPermission(currentRole, "delete_jobs");

  return (
    <div>
      <h2>Current Role: {roleConfig.label}</h2>
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

## RLS Policies

All table policies have been updated to respect roles:

### Jobs Table
- **SELECT**: All active team members
- **INSERT**: Owner, Admin, Manager, Dispatcher, CSR
- **UPDATE**: Owner, Admin, Manager, Dispatcher, Technician, CSR
- **DELETE**: Owner, Admin, Manager

### Customers Table
- **SELECT**: All active team members
- **INSERT**: Owner, Admin, Manager, CSR
- **UPDATE**: Owner, Admin, Manager, CSR
- **DELETE**: Owner, Admin, Manager

### Schedules Table
- **ALL**: Owner, Admin, Manager, Dispatcher
- **SELECT (own)**: Technicians can view their own schedules

### Team Members Table
- **ALL**: Company owner and admins only

## Custom Permissions

Override default role permissions with custom JSONB:

```typescript
import { updateTeamMemberPermissions } from "@/actions/roles";

// Grant technician ability to delete jobs
await updateTeamMemberPermissions({
  teamMemberId: "tech-uuid",
  permissions: {
    "delete_jobs": true,
    "approve_estimates": false
  }
});
```

In database:
```sql
UPDATE team_members
SET permissions = '{"delete_jobs": true, "approve_estimates": true}'::jsonb
WHERE id = 'team-member-uuid';
```

The `has_permission()` function checks custom permissions first, then falls back to role defaults.

## Development Mode

### Role Switcher
Navigate to **Settings → Development** to test different roles:

1. Select a role from the list
2. Click "Apply Role Change"
3. Page reloads with new role's dashboard

### Development Override
- In development mode, role is stored in `localStorage` under key `stratos_dev_role`
- Clear localStorage to reset to actual database role
- Production mode ignores localStorage and always uses database role

### Initialize Role from Database

```typescript
// In your root layout or auth provider
"use client";

import { useEffect } from "react";
import { initializeRoleFromDatabase } from "@/lib/stores/role-store";

export function AuthProvider({ children }) {
  useEffect(() => {
    // Fetch actual role from database on mount
    initializeRoleFromDatabase();
  }, []);

  return <>{children}</>;
}
```

## Audit Logging

All role changes are logged in `role_change_log` table:

```sql
SELECT
  rcl.*,
  tm.user_id,
  u.name as changed_by_name
FROM role_change_log rcl
JOIN team_members tm ON tm.id = rcl.team_member_id
JOIN users u ON u.id = rcl.changed_by
WHERE tm.company_id = 'company-uuid'
ORDER BY rcl.created_at DESC;
```

## Migration Steps

### 1. Apply Migration

```bash
# Using Supabase CLI
npx supabase db push

# Or apply via Supabase MCP server
# The migration file is at: supabase/migrations/20250211000000_add_rbac_system.sql
```

### 2. Set Initial Roles

The migration automatically:
- Sets company owners to 'owner' role
- Sets all other team members to 'technician' role (default)

Manually update roles as needed:

```sql
-- Set user as manager
UPDATE team_members
SET role = 'manager'::user_role
WHERE user_id = 'user-uuid'
AND company_id = 'company-uuid';
```

### 3. Generate TypeScript Types

```bash
npx supabase gen types typescript --local > src/lib/db/supabase-types.ts
```

### 4. Test Permissions

```typescript
// Test permission checks
import { checkPermission } from "@/actions/roles";

const canDelete = await checkPermission("delete_jobs");
console.log(canDelete);
```

## Security Best Practices

1. **Always check permissions server-side** - Never trust client-side checks
2. **Use RLS policies** - Database-level security as first line of defense
3. **Log role changes** - Audit trail for compliance
4. **Principle of least privilege** - Start with minimal permissions
5. **Review custom permissions** - Monitor and audit overrides
6. **Test with different roles** - Use development role switcher

## Permission Keys Reference

### View Permissions
- `view_customers` - View customer list and details
- `view_jobs` - View job list and details
- `view_schedule` - View company schedule
- `view_reports` - View reports and analytics
- `view_tech_locations` - View technician locations (GPS)

### Management Permissions
- `manage_team` - Add/remove team members, assign roles
- `manage_schedule` - Create/edit/delete schedule entries
- `dispatch_jobs` - Assign jobs to technicians
- `approve_estimates` - Approve customer estimates
- `handle_escalations` - Handle customer escalations

### Action Permissions
- `create_jobs` - Create new jobs
- `update_job_status` - Update job status
- `delete_jobs` - Delete jobs
- `create_invoices` - Create customer invoices
- `schedule_appointments` - Schedule appointments
- `send_communications` - Send emails/SMS
- `upload_photos` - Upload job photos
- `delete_customers` - Delete customers
- `delete_team_members` - Remove team members

## Troubleshooting

### User can't access features
1. Check their role: `SELECT role FROM team_members WHERE user_id = 'uuid'`
2. Verify RLS policies are enabled
3. Check custom permissions JSON
4. Ensure user is active: `status = 'active'`

### Permission check returns false
1. Verify user is in correct company
2. Check role spelling (lowercase, underscores)
3. Review custom permissions override
4. Check database function logic

### Development override not working
1. Check `NODE_ENV === 'development'`
2. Clear localStorage: `localStorage.removeItem('stratos_dev_role')`
3. Verify role store initialization

## Future Enhancements

- [ ] Permission groups/presets
- [ ] Role templates
- [ ] Time-based permissions (temporary escalations)
- [ ] IP-based restrictions
- [ ] Multi-company user support
- [ ] Permission inheritance hierarchy
- [ ] Custom role builder UI

---

**Last Updated**: 2025-02-11
**Migration Version**: 20250211000000
**Author**: Claude Code (AI Assistant)
