# Detail Page Framework

**Date**: January 18, 2025
**Status**: Proposed Architecture
**Purpose**: Standardize detail page sections (Jobs, Customers, Properties, etc.)

---

## Problem Statement

Currently, the job details page has **12+ interconnected sections**:
- Customer & Property
- Team Members (4)
- Appointments (4)
- Equipment Serviced (0)
- Estimates (1)
- Invoices (2)
- Payments (0)
- Purchase Orders (0)
- Photos & Documents (0)
- Job Tasks & Checklist (0)
- Notes (0)
- Activity & Communications (0)

**Issues**:
1. Each section is implemented separately with duplicated code
2. Inconsistent UX patterns across sections
3. Hard to maintain keyboard shortcuts (Ctrl+1 through Ctrl+0)
4. No standardized empty states
5. No standardized loading states
6. No standardized error handling
7. Difficulty adding new sections

---

## Solution: DetailPageSection Framework

A **declarative component framework** that handles all common patterns.

---

## Architecture

### 1. Core Component: `<DetailPageSection>`

**Purpose**: Universal container for all detail page sections

**Props**:
```typescript
type DetailPageSectionProps = {
  // Identity
  id: string;                          // "team-members"
  title: string;                       // "Team Members"
  icon?: LucideIcon;                   // Users

  // Data
  count?: number;                      // 4
  isLoading?: boolean;                 // false
  error?: string;                      // null

  // Actions
  primaryAction?: {
    label: string;                     // "Add Team Member"
    onClick: () => void;
    icon?: LucideIcon;
    variant?: ButtonVariant;
    disabled?: boolean;
  };

  secondaryActions?: Array<{
    label: string;                     // "Load Template"
    onClick: () => void;
    icon?: LucideIcon;
    variant?: ButtonVariant;
  }>;

  // Keyboard
  keyboardShortcut?: string;           // "Ctrl+2"
  onKeyboardAction?: () => void;       // Handler for keyboard shortcut

  // Content
  children: React.ReactNode;           // Table, list, grid, etc.

  // Empty State
  emptyState?: {
    title?: string;                    // "No team members assigned"
    description?: string;              // "Add team members to start..."
    icon?: LucideIcon;
    action?: {
      label: string;
      onClick: () => void;
    };
  };

  // Advanced
  collapsible?: boolean;               // Can be collapsed/expanded
  defaultCollapsed?: boolean;          // Start collapsed
  badge?: string | number;             // Custom badge (instead of count)
  className?: string;

  // Permissions
  canView?: boolean;                   // RLS - can user view this section?
  canEdit?: boolean;                   // RLS - can user edit?
  canCreate?: boolean;                 // RLS - can user create?
};
```

---

### 2. Specialized Components (Built on DetailPageSection)

#### **`<TeamMembersSection>`**
```typescript
<TeamMembersSection
  jobId={jobId}
  teamMembers={teamMembers}
  onAddMember={() => setShowAddDialog(true)}
  onRemoveMember={(id) => handleRemove(id)}
  keyboardShortcut="Ctrl+2"
/>
```

**Renders to**:
```tsx
<DetailPageSection
  id="team-members"
  title="Team Members"
  icon={Users}
  count={teamMembers.length}
  primaryAction={{
    label: "Add Team Member",
    onClick: () => setShowAddDialog(true),
    icon: UserPlus,
  }}
  keyboardShortcut="Ctrl+2"
  emptyState={{
    title: "No team members assigned",
    description: "Add team members to this job to track who's working on it.",
    icon: Users,
  }}
>
  <TeamMembersTable data={teamMembers} onRemove={handleRemove} />
</DetailPageSection>
```

---

#### **`<InvoicesSection>`**
```typescript
<InvoicesSection
  jobId={jobId}
  invoices={invoices}
  onCreateInvoice={() => router.push(`/invoices/new?job=${jobId}`)}
  keyboardShortcut="Ctrl+6"
/>
```

**Renders to**:
```tsx
<DetailPageSection
  id="invoices"
  title="Invoices"
  icon={FileText}
  count={invoices.length}
  primaryAction={{
    label: "Create Invoice",
    onClick: () => router.push(`/invoices/new?job=${jobId}`),
    icon: Plus,
    variant: "default",
  }}
  keyboardShortcut="Ctrl+6"
  emptyState={{
    title: "No invoices created",
    description: "Create an invoice to bill the customer for this job.",
    icon: FileText,
    action: {
      label: "Create First Invoice",
      onClick: () => router.push(`/invoices/new?job=${jobId}`),
    },
  }}
>
  <InvoicesTable data={invoices} />
</DetailPageSection>
```

---

#### **`<JobTasksSection>`**
```typescript
<JobTasksSection
  jobId={jobId}
  tasks={tasks}
  onAddTask={() => setShowTaskDialog(true)}
  onLoadTemplate={() => setShowTemplateDialog(true)}
  keyboardShortcut="Ctrl+0"
/>
```

**Renders to**:
```tsx
<DetailPageSection
  id="job-tasks"
  title="Job Tasks & Checklist"
  icon={CheckSquare}
  count={tasks.length}
  primaryAction={{
    label: "Add Task",
    onClick: () => setShowTaskDialog(true),
    icon: Plus,
  }}
  secondaryActions={[
    {
      label: "Load Template",
      onClick: () => setShowTemplateDialog(true),
      icon: FileCode,
    },
  ]}
  keyboardShortcut="Ctrl+0"
  emptyState={{
    title: "No tasks created",
    description: "Add tasks or load a template to track job progress.",
    icon: CheckSquare,
  }}
>
  <TasksChecklist data={tasks} />
</DetailPageSection>
```

---

### 3. Keyboard Shortcut Manager

**Purpose**: Centralized keyboard shortcut handling

**File**: `/src/hooks/use-keyboard-shortcuts.ts`

```typescript
import { useEffect } from "react";

type ShortcutConfig = {
  key: string;          // "Ctrl+2"
  action: () => void;
  disabled?: boolean;
};

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      if (!e.ctrlKey && !e.metaKey) return;

      // Find matching shortcut
      const shortcut = shortcuts.find((s) => {
        const key = s.key.split("+")[1]; // "Ctrl+2" -> "2"
        return e.key === key && !s.disabled;
      });

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [shortcuts]);
}

// Usage in job details page:
export default function JobDetailsPage({ jobId }: Props) {
  useKeyboardShortcuts([
    { key: "Ctrl+1", action: () => setShowCustomerDialog(true) },
    { key: "Ctrl+2", action: () => setShowTeamMemberDialog(true) },
    { key: "Ctrl+3", action: () => setShowAppointmentDialog(true) },
    { key: "Ctrl+4", action: () => setShowEquipmentDialog(true) },
    { key: "Ctrl+5", action: () => router.push(`/estimates/new?job=${jobId}`) },
    { key: "Ctrl+6", action: () => router.push(`/invoices/new?job=${jobId}`) },
    { key: "Ctrl+7", action: () => setShowPaymentDialog(true) },
    { key: "Ctrl+8", action: () => router.push(`/purchase-orders/new?job=${jobId}`) },
    { key: "Ctrl+9", action: () => setShowUploadDialog(true) },
    { key: "Ctrl+0", action: () => setShowTaskDialog(true) },
  ]);

  return (
    <div>
      <TeamMembersSection ... />
      <InvoicesSection ... />
      {/* ... other sections */}
    </div>
  );
}
```

---

### 4. Data Fetching Pattern

**Purpose**: Standardized data loading with React.cache()

**File**: `/src/lib/queries/job-details.ts`

```typescript
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Single cached query fetches ALL job details data
export const getJobDetails = cache(async (jobId: string) => {
  const supabase = await createClient();

  const [
    job,
    teamMembers,
    appointments,
    equipment,
    estimates,
    invoices,
    payments,
    purchaseOrders,
    documents,
    tasks,
    notes,
    activities,
  ] = await Promise.all([
    supabase.from("jobs").select("*, customer:customers(*), property:properties(*)").eq("id", jobId).single(),
    supabase.from("team_assignments").select("*, team_member:team_members(*)").eq("job_id", jobId),
    supabase.from("appointments").select("*").eq("job_id", jobId).order("scheduled_start", { ascending: true }),
    supabase.from("job_equipment").select("*, equipment:equipment(*)").eq("job_id", jobId),
    supabase.from("estimates").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    supabase.from("invoices").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    supabase.from("purchase_orders").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    supabase.from("job_tasks").select("*").eq("job_id", jobId).order("order", { ascending: true }),
    supabase.from("notes").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    supabase.from("activities").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
  ]);

  return {
    job: job.data,
    teamMembers: teamMembers.data || [],
    appointments: appointments.data || [],
    equipment: equipment.data || [],
    estimates: estimates.data || [],
    invoices: invoices.data || [],
    payments: payments.data || [],
    purchaseOrders: purchaseOrders.data || [],
    documents: documents.data || [],
    tasks: tasks.data || [],
    notes: notes.data || [],
    activities: activities.data || [],
  };
});
```

**Usage**:
```typescript
// Server Component
export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getJobDetails(id);

  return (
    <JobDetailsClient
      job={data.job}
      teamMembers={data.teamMembers}
      appointments={data.appointments}
      // ... pass all data
    />
  );
}
```

---

### 5. Section Registry

**Purpose**: Centralized configuration for all sections

**File**: `/src/lib/detail-page/section-registry.ts`

```typescript
import { LucideIcon, Users, Calendar, Wrench, FileText, DollarSign, ShoppingCart, Image, CheckSquare, MessageSquare, Activity } from "lucide-react";

type SectionConfig = {
  id: string;
  title: string;
  icon: LucideIcon;
  keyboardShortcut: string;
  order: number;

  // Actions
  primaryActionLabel: string;
  primaryActionRoute?: string;       // If action is a route

  // Permissions
  requiredPermission?: string;       // "jobs.edit"

  // Features
  hasSecondaryActions?: boolean;
  collapsible?: boolean;
};

export const JOB_SECTIONS: Record<string, SectionConfig> = {
  customer: {
    id: "customer",
    title: "Customer & Property",
    icon: Users,
    keyboardShortcut: "Ctrl+1",
    order: 1,
    primaryActionLabel: "Assign Customer & Property",
  },

  teamMembers: {
    id: "team-members",
    title: "Team Members",
    icon: Users,
    keyboardShortcut: "Ctrl+2",
    order: 2,
    primaryActionLabel: "Add Team Member",
    requiredPermission: "jobs.edit",
  },

  appointments: {
    id: "appointments",
    title: "Appointments",
    icon: Calendar,
    keyboardShortcut: "Ctrl+3",
    order: 3,
    primaryActionLabel: "Add Appointment",
  },

  equipment: {
    id: "equipment",
    title: "Equipment Serviced",
    icon: Wrench,
    keyboardShortcut: "Ctrl+4",
    order: 4,
    primaryActionLabel: "Add Equipment",
  },

  estimates: {
    id: "estimates",
    title: "Estimates",
    icon: FileText,
    keyboardShortcut: "Ctrl+5",
    order: 5,
    primaryActionLabel: "Create Estimate",
    primaryActionRoute: "/estimates/new",
  },

  invoices: {
    id: "invoices",
    title: "Invoices",
    icon: FileText,
    keyboardShortcut: "Ctrl+6",
    order: 6,
    primaryActionLabel: "Create Invoice",
    primaryActionRoute: "/invoices/new",
  },

  payments: {
    id: "payments",
    title: "Payments",
    icon: DollarSign,
    keyboardShortcut: "Ctrl+7",
    order: 7,
    primaryActionLabel: "Record Payment",
  },

  purchaseOrders: {
    id: "purchase-orders",
    title: "Purchase Orders",
    icon: ShoppingCart,
    keyboardShortcut: "Ctrl+8",
    order: 8,
    primaryActionLabel: "Create PO",
    primaryActionRoute: "/purchase-orders/new",
  },

  documents: {
    id: "documents",
    title: "Photos & Documents",
    icon: Image,
    keyboardShortcut: "Ctrl+9",
    order: 9,
    primaryActionLabel: "Upload",
  },

  tasks: {
    id: "tasks",
    title: "Job Tasks & Checklist",
    icon: CheckSquare,
    keyboardShortcut: "Ctrl+0",
    order: 10,
    primaryActionLabel: "Add Task",
    hasSecondaryActions: true,        // "Load Template"
  },

  notes: {
    id: "notes",
    title: "Notes",
    icon: MessageSquare,
    keyboardShortcut: "",              // No shortcut
    order: 11,
    primaryActionLabel: "Add Note",
  },

  activities: {
    id: "activities",
    title: "Activity & Communications",
    icon: Activity,
    keyboardShortcut: "",              // No shortcut
    order: 12,
    primaryActionLabel: "Add Communication",
  },
};
```

---

## Usage Example: Complete Job Details Page

**File**: `/src/app/(dashboard)/dashboard/work/[id]/page.tsx`

```typescript
import { getJobDetails } from "@/lib/queries/job-details";
import { JOB_SECTIONS } from "@/lib/detail-page/section-registry";
import { JobDetailsClient } from "./job-details-client";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getJobDetails(id);

  return (
    <JobDetailsClient
      jobId={id}
      sections={JOB_SECTIONS}
      data={data}
    />
  );
}
```

**File**: `/src/app/(dashboard)/dashboard/work/[id]/job-details-client.tsx`

```typescript
"use client";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { DetailPageSection } from "@/components/layout/detail-page-section";
import { TeamMembersTable } from "@/components/work/job-details/team-members-table";
import { InvoicesTable } from "@/components/work/job-details/invoices-table";
// ... other imports

export function JobDetailsClient({ jobId, sections, data }: Props) {
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  // ... other dialog states

  // Centralized keyboard shortcuts
  useKeyboardShortcuts([
    { key: sections.teamMembers.keyboardShortcut, action: () => setShowTeamMemberDialog(true) },
    { key: sections.invoices.keyboardShortcut, action: () => router.push(`/invoices/new?job=${jobId}`) },
    // ... other shortcuts
  ]);

  return (
    <div className="space-y-6">
      {/* Team Members Section */}
      <DetailPageSection
        id={sections.teamMembers.id}
        title={sections.teamMembers.title}
        icon={sections.teamMembers.icon}
        count={data.teamMembers.length}
        primaryAction={{
          label: sections.teamMembers.primaryActionLabel,
          onClick: () => setShowTeamMemberDialog(true),
        }}
        keyboardShortcut={sections.teamMembers.keyboardShortcut}
        emptyState={{
          title: "No team members assigned",
          description: "Add team members to this job.",
          icon: sections.teamMembers.icon,
        }}
      >
        <TeamMembersTable data={data.teamMembers} />
      </DetailPageSection>

      {/* Invoices Section */}
      <DetailPageSection
        id={sections.invoices.id}
        title={sections.invoices.title}
        icon={sections.invoices.icon}
        count={data.invoices.length}
        primaryAction={{
          label: sections.invoices.primaryActionLabel,
          onClick: () => router.push(`/invoices/new?job=${jobId}`),
        }}
        keyboardShortcut={sections.invoices.keyboardShortcut}
        emptyState={{
          title: "No invoices created",
          description: "Create an invoice to bill the customer.",
          icon: sections.invoices.icon,
        }}
      >
        <InvoicesTable data={data.invoices} />
      </DetailPageSection>

      {/* ... other sections */}
    </div>
  );
}
```

---

## Benefits

### 1. **Consistency**
- ✅ All sections use the same visual design
- ✅ Keyboard shortcuts work consistently
- ✅ Empty states are standardized
- ✅ Loading states are standardized
- ✅ Error handling is standardized

### 2. **Maintainability**
- ✅ Single component to update for design changes
- ✅ Centralized keyboard shortcut management
- ✅ Section configuration in one place
- ✅ Easy to add new sections

### 3. **Developer Experience**
- ✅ Declarative API (tell it what, not how)
- ✅ Type-safe with TypeScript
- ✅ Autocomplete for section config
- ✅ Reusable across all detail pages (jobs, customers, properties, etc.)

### 4. **Performance**
- ✅ Single data fetch with React.cache()
- ✅ Optimistic updates built-in
- ✅ Suspense boundaries for slow sections
- ✅ Lazy loading of dialogs

### 5. **Accessibility**
- ✅ Keyboard navigation built-in
- ✅ Screen reader support
- ✅ ARIA labels automated
- ✅ Focus management

---

## Migration Path

### Phase 1: Build Core Framework
1. Create `<DetailPageSection>` component
2. Create `useKeyboardShortcuts` hook
3. Create section registry
4. Create data fetching utilities

### Phase 2: Migrate Job Details Page
1. Migrate Team Members section
2. Migrate Invoices section
3. Migrate Appointments section
4. Continue with remaining sections

### Phase 3: Extend to Other Pages
1. Customer details page
2. Property details page
3. Estimate details page
4. Invoice details page

### Phase 4: Advanced Features
1. Drag-and-drop section reordering
2. User preferences for collapsed sections
3. Section visibility toggles
4. Export/import section data

---

## File Structure

```
/src
  /components
    /layout
      detail-page-section.tsx       # Core component
      detail-page-header.tsx         # Page header with breadcrumbs

  /hooks
    use-keyboard-shortcuts.ts        # Keyboard shortcut manager
    use-detail-page-section.ts       # Section state management

  /lib
    /detail-page
      section-registry.ts            # Section configurations
      types.ts                       # TypeScript types
      utils.ts                       # Helper functions

  /lib/queries
    job-details.ts                   # Job data fetching
    customer-details.ts              # Customer data fetching
    property-details.ts              # Property data fetching
```

---

## TypeScript Types

```typescript
// /src/lib/detail-page/types.ts

export type SectionAction = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
};

export type SectionEmptyState = {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type DetailPageSectionProps = {
  id: string;
  title: string;
  icon?: LucideIcon;
  count?: number;
  isLoading?: boolean;
  error?: string;
  primaryAction?: SectionAction;
  secondaryActions?: SectionAction[];
  keyboardShortcut?: string;
  onKeyboardAction?: () => void;
  children: React.ReactNode;
  emptyState?: SectionEmptyState;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  badge?: string | number;
  className?: string;
  canView?: boolean;
  canEdit?: boolean;
  canCreate?: boolean;
};
```

---

## Next Steps

1. ✅ **Review this proposal** - Does this approach solve the problem?
2. 🔨 **Build core framework** - Create DetailPageSection component
3. 🧪 **Migrate one section** - Start with Team Members as proof of concept
4. 📈 **Iterate and improve** - Add features based on usage
5. 🚀 **Roll out to all pages** - Migrate job details, customer details, etc.

---

**Status**: Awaiting approval to proceed
**Estimated Time**:
- Phase 1 (Core Framework): 4-6 hours
- Phase 2 (Job Details Migration): 6-8 hours
- Phase 3 (Other Pages): 2-3 hours per page
- Total: ~20-30 hours for complete system

---

Would you like me to start building this framework?
