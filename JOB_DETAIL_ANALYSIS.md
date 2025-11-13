# Job Detail Page - Collapsible Sections & Relationship Management Analysis

## Executive Summary

The job detail page uses a modern card-based layout (via `JobPageModern` component) instead of complex accordions. The page loads all related data server-side via comprehensive parallel queries in the page component (`/src/app/(dashboard)/dashboard/work/[id]/page.tsx`).

**Current Issues Identified:**
- Missing server actions for unlinking/removing most relationships
- Limited UI for managing relationships in the collapsed detail view
- Data flows are mostly read-only on the detail page
- Some relationships use junction tables (job_equipment, job_materials) while others use foreign keys (job_id in invoices, estimates, etc.)

---

## 1. Collapsible Sections Inventory

### Overview: Job Page Structure

The job detail page uses:
- **Primary Component**: `JobPageModern` (modern card-based layout)
- **Legacy Component**: `JobPageContent` (complex accordion layout - deprecated)
- **Data Loading**: Server-side via page component `/src/app/(dashboard)/dashboard/work/[id]/page.tsx`
- **Stats Display**: Toolbar stats via `generateJobStats()` utility

### Section Details

| Section | Entity Type | Data Source | Add Action | Edit Action | Remove Action | Foreign Key |
|---------|------------|-------------|------------|-------------|---------------|-------------|
| **Job Header** | Jobs | `job` table | N/A | Via form | Via archive | N/A |
| **Stats Grid** | Metrics | Calculated | N/A | N/A | N/A | N/A |
| **Customer Info** | Customers | `customer` via join | Change only | Via dialog | Yes | `job.customer_id` |
| **Property Info** | Properties | `property` via join | Change only | Via dialog | Yes | `job.property_id` |
| **Team Assigned** | Team Members | `job_team_assignments` + `team_members` | Yes | Yes | Yes | Junction table |
| **Job Details** | Jobs metadata | `job` table | N/A | Via form | N/A | N/A |
| **Financial Summary** | Summary only | Invoices/Estimates/Payments data | Links out | Links out | Links out | Foreign key joins |

### Data Loading Pattern (from page.tsx)

All data is fetched server-side via `Promise.all()` with these queries:

```typescript
// The page fetches ALL of these in parallel:
- teamAssignments → job_team_assignments + team_members
- timeEntries → job_time_entries + users  
- invoices → invoices WHERE job_id
- estimates → estimates WHERE job_id
- payments → payments WHERE job_id
- purchaseOrders → purchase_orders WHERE job_id
- tasks → job_tasks + users
- photos → job_photos + users
- documents → attachments WHERE entity_type='job'
- signatures → job_signatures
- activities → activity_log WHERE entity_type='job'
- communications → communications WHERE job_id
- equipment → equipment at property
- jobEquipment → job_equipment + equipment details (junction table)
- jobMaterials → job_materials + price_book_items + users (junction table)
- jobNotes → job_notes + users
- schedules → schedules WHERE job_id + users + customers
- allCustomers → all company customers (for dropdowns)
- allProperties → all company properties (for dropdowns)
```

**Total Relationships Loaded**: 19 queries loading 8+ major relationships

---

## 2. Relationship Management Analysis

### 2.1 Estimates ↔ Job

**Current State**:
- **Foreign Key**: `estimates.job_id` (nullable)
- **Data Flow**: Read-only on detail page
- **Add Button**: No (must go to separate invoice creation)
- **Edit Button**: No (links to estimate detail page)
- **Remove Button**: No direct UI
- **Current Display**: `EstimatesWidget` shows count + link to view all

**Bidirectional Impact**:
- Unlinking: Would need to SET `job_id = NULL`
- No server action exists for `unlinkEstimateFromJob()`
- Estimate detail page shows job association
- No refresh/revalidation pattern for unlink

**Missing Implementation**:
```typescript
// MISSING: No server action exists
export async function unlinkEstimateFromJob(estimateId: string, jobId: string)
```

---

### 2.2 Invoices ↔ Job

**Current State**:
- **Foreign Key**: `invoices.job_id` (nullable)
- **Data Flow**: Read-only on detail page
- **Add Button**: No
- **Edit Button**: No (links to invoice detail page)
- **Remove Button**: No direct UI
- **Current Display**: `InvoicesWidget` shows count + link to view all

**Bidirectional Impact**:
- Unlinking: Would need to SET `job_id = NULL`
- No server action exists for `unlinkInvoiceFromJob()`
- Invoice detail shows job association
- Financial summary recalculation would be needed

**Missing Implementation**:
```typescript
// MISSING: No server action exists
export async function unlinkInvoiceFromJob(invoiceId: string, jobId: string)
```

---

### 2.3 Payments ↔ Job

**Current State**:
- **Foreign Key**: `payments.job_id` (nullable)
- **Data Flow**: Read-only on detail page
- **Add Button**: No
- **Edit Button**: No
- **Remove Button**: No
- **Current Display**: Summary count only in financial card

**Bidirectional Impact**:
- Unlinking: Would need to SET `job_id = NULL`
- No server action for `unlinkPaymentFromJob()`
- No UI to manage at all

**Missing Implementation**:
```typescript
// MISSING: Completely missing
export async function unlinkPaymentFromJob(paymentId: string, jobId: string)
```

---

### 2.4 Purchase Orders ↔ Job

**Current State**:
- **Foreign Key**: `purchase_orders.job_id` (nullable)
- **Data Flow**: Fetched but not displayed in modern view
- **Add Button**: No
- **Edit Button**: No
- **Remove Button**: No
- **Current Display**: Component references `JobPurchaseOrdersTable` but not rendered in `JobPageModern`

**Bidirectional Impact**:
- Unlinking: Would need to SET `job_id = NULL`
- No server action exists

**Missing Implementation**:
```typescript
// MISSING: No server action
export async function unlinkPurchaseOrderFromJob(poId: string, jobId: string)
```

---

### 2.5 Job Equipment ↔ Job (Junction Table)

**Current State**:
- **Relationship Type**: Junction table (`job_equipment`)
- **Foreign Keys**: `job_id` + `equipment_id` + UNIQUE constraint
- **Data Flow**: Loaded via page query, not displayed in `JobPageModern`
- **Add Button**: No UI in modern view
- **Edit Button**: No UI in modern view
- **Remove Button**: No UI in modern view
- **Current Display**: Referenced in legacy `JobPageContent` but not in modern

**Bidirectional Impact**:
- Deletion: `ON DELETE CASCADE` → when job deleted, job_equipment records deleted
- Unlink: Would DELETE row from junction table
- Equipment side: Trigger `update_equipment_last_service()` on INSERT
- No server action to remove equipment from job

**Missing Implementation**:
```typescript
// MISSING: No server action
export async function removeEquipmentFromJob(jobEquipmentId: string)
```

**Schema Reference**:
```sql
CREATE TABLE job_equipment (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  CONSTRAINT unique_job_equipment UNIQUE(job_id, equipment_id)
);
```

---

### 2.6 Job Materials ↔ Job (Junction Table)

**Current State**:
- **Relationship Type**: Junction table (`job_materials`)
- **Foreign Keys**: `job_id` + optional `price_book_item_id` + optional `invoice_id`
- **Data Flow**: Loaded via page query, displayed in `MaterialsListWidget` (server component)
- **Add Button**: Links to `/dashboard/work/{jobId}/materials` 
- **Edit Button**: No direct edit, links to materials management page
- **Remove Button**: No direct UI on detail page
- **Current Display**: `MaterialsListWidget` shows materials grouped by category

**Bidirectional Impact**:
- Deletion: `ON DELETE CASCADE` → when job deleted, materials deleted
- Unlink: Would DELETE row from junction table
- Material can be linked to equipment (`job_equipment_id`) and invoice (`invoice_id`)
- Billing status tracked (`billed`, `invoice_id`)
- No server action to remove material from job

**Missing Implementation**:
```typescript
// MISSING: No server action
export async function removeJobMaterial(jobMaterialId: string)
```

**Schema Reference**:
```sql
CREATE TABLE job_materials (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_equipment_id UUID REFERENCES job_equipment(id) ON DELETE SET NULL,
  price_book_item_id UUID REFERENCES price_book_items(id) ON DELETE RESTRICT,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  billable BOOLEAN DEFAULT TRUE,
  billed BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES users(id)
);
```

---

### 2.7 Appointments/Schedules ↔ Job

**Current State**:
- **Foreign Key**: `schedules.job_id` (nullable)
- **Data Flow**: Loaded via page query (`schedules` with user + customer joins)
- **Add Button**: No direct UI on detail page
- **Edit Button**: No
- **Remove Button**: No UI
- **Current Display**: Not rendered in `JobPageModern`
- **Referenced as**: `JobAppointmentsTable` in legacy view

**Bidirectional Impact**:
- Unlinking: Would need to SET `job_id = NULL`
- Schedule still shows in calendar/schedule views
- No impact on schedule itself, just removes job association

**Missing Implementation**:
```typescript
// MISSING: No server action
export async function unlinkScheduleFromJob(scheduleId: string, jobId: string)
```

---

### 2.8 Team Assignments ↔ Job (Junction Table)

**Current State**:
- **Relationship Type**: Junction table (`job_team_assignments`)
- **Foreign Keys**: `job_id` + `team_member_id`
- **Data Flow**: Loaded and **actively managed** via `TeamMemberSelector` component
- **Add Button**: Yes - `TeamMemberSelector` has add UI
- **Edit Button**: Yes - can modify assignments
- **Remove Button**: Yes - can unassign team members
- **Current Display**: `TeamMemberSelector` component in Team Assigned card

**Bidirectional Impact**:
- Deletion: `ON DELETE CASCADE` when job deleted
- Removal: DELETE from junction table
- Team member still exists, just unassigned from job
- **This is the ONLY relationship with full CRUD UI**

**Implementation Status**: ✅ IMPLEMENTED
- Component: `TeamMemberSelector` - handles add/remove
- Server Action: Check `/src/actions/team-assignments.ts`

---

### 2.9 Customer ↔ Job (Direct Foreign Key)

**Current State**:
- **Foreign Key**: `job.customer_id` (nullable)
- **Data Flow**: Loaded server-side via select join
- **Add/Change Button**: Yes - customer selector dialog in `JobPageContent`
- **Edit Button**: Yes - can change customer
- **Remove Button**: Yes - can set to NULL
- **Current Display**: "Customer Information" card in modern view

**Bidirectional Impact**:
- Change: Updates `job.customer_id`
- Remove: Sets `job.customer_id = NULL`
- Property is cleared if doesn't belong to new customer
- Customer page still shows job via reverse FK relationship

**Implementation Status**: ✅ PARTIALLY IMPLEMENTED
- Component: `JobPageContent` has customer change UI
- Server Action: `updateJob()` handles customer_id update
- Constraint: Property must belong to customer if both set

---

### 2.10 Property ↔ Job (Direct Foreign Key)

**Current State**:
- **Foreign Key**: `job.property_id` (nullable)
- **Data Flow**: Loaded server-side via select join
- **Add/Change Button**: Yes - property selector dialog
- **Edit Button**: Yes - can change property
- **Remove Button**: Yes - can set to NULL
- **Current Display**: "Service Location" card in modern view

**Bidirectional Impact**:
- Change: Updates `job.property_id`
- Remove: Sets `job.property_id = NULL`
- Equipment at property is still visible in equipment list
- Property page still references job via reverse FK

**Implementation Status**: ✅ PARTIALLY IMPLEMENTED
- Component: `JobPageContent` has property change UI
- Server Action: `updateJob()` handles property_id update
- Can create new property from dialog

---

## 3. Missing Functionality Summary

### Critical Gaps

| Function | Current Status | Impact | Priority |
|----------|----------------|--------|----------|
| `unlinkEstimateFromJob()` | Missing | Can't unlink estimates, lose associa tion tracking | HIGH |
| `unlinkInvoiceFromJob()` | Missing | Can't unlink invoices, financial data corrupt | HIGH |
| `unlinkPaymentFromJob()` | Missing | Can't manage payment associations | HIGH |
| `removeEquipmentFromJob()` | Missing | Can't remove equipment from job, UI missing | MEDIUM |
| `removeJobMaterial()` | Missing | Can't remove materials without going to separate page | MEDIUM |
| `unlinkScheduleFromJob()` | Missing | Can't unlink appointments from job | MEDIUM |
| UI for unlink actions | Missing | Can't easily remove relationships from detail page | MEDIUM |
| `JobEquipmentTable` component | Missing | No way to view/manage equipment on detail page | MEDIUM |
| Purchase orders display | Incomplete | Loaded but not shown in modern view | LOW |
| Server action revalidation | Partial | Not all actions properly revalidate detail page | MEDIUM |

---

## 4. Server Actions Audit

### Existing in `/src/actions/jobs.ts`

✅ **Implemented**:
- `createJob()` - Create new job
- `getJob()` - Fetch single job  
- `updateJob()` - Update job fields (including customer_id, property_id)
- `updateJobStatus()` - Change job status
- `assignJob()` - Assign to technician
- `scheduleJob()` - Set schedule dates
- `startJob()` - Change to in_progress
- `completeJob()` - Change to completed
- `cancelJob()` - Change to cancelled
- `archiveJob()` - Soft delete
- `restoreJob()` - Restore archived job
- `searchJobs()` - Full-text search
- `searchAll()` - Universal search

❌ **Missing - Unlink/Remove Operations**:
- `unlinkEstimateFromJob()`
- `unlinkInvoiceFromJob()`
- `unlinkPaymentFromJob()`
- `unlinkPurchaseOrderFromJob()`
- `removeEquipmentFromJob()`
- `removeJobMaterial()`
- `unlinkScheduleFromJob()`

### Related Action Files

**`/src/actions/equipment.ts`**:
- ✅ `getCustomerEquipment()` - Read
- ✅ `getPropertyEquipment()` - Read
- ✅ `getJobEquipment()` - Read
- ❌ Missing: `addEquipmentToJob()`, `removeEquipmentFromJob()`

**`/src/actions/invoices.ts`**:
- Limited to invoice CRUD
- ❌ Missing: `unlinkInvoiceFromJob()`

**`/src/actions/team-assignments.ts`**:
- ✅ Has complete CRUD for team assignments
- This is the model to follow

---

## 5. Junction Tables vs Foreign Keys

### Pattern Analysis

| Table | Relationship Type | Structure | Delete Cascade | Can Unlink |
|-------|------------------|-----------|----------------|-----------|
| `job_equipment` | Junction | `job_id` + `equipment_id` | YES | Should delete junction row |
| `job_materials` | Junction | `job_id` + `price_book_item_id` | YES | Should delete junction row |
| `job_team_assignments` | Junction | `job_id` + `team_member_id` | YES | ✅ Works (has action) |
| `invoices` | Direct FK | `job_id` | NO | Should SET NULL |
| `estimates` | Direct FK | `job_id` | NO | Should SET NULL |
| `payments` | Direct FK | `job_id` | NO | Should SET NULL |
| `purchase_orders` | Direct FK | `job_id` | NO | Should SET NULL |
| `schedules` | Direct FK | `job_id` | NO | Should SET NULL |

**Key Difference**: 
- Junction tables: DELETE the row to unlink
- Direct FK: SET `job_id = NULL` to unlink

---

## 6. Bidirectional Relationship Updates

### Current Behavior

#### When Job is Deleted
- `job_equipment` → Cascade delete (equipment records removed)
- `job_materials` → Cascade delete (material records removed)
- `invoices.job_id` → No action (stranded records)
- `estimates.job_id` → No action (stranded records)
- `payments.job_id` → No action (stranded records)

❌ **Problem**: Foreign key records become orphaned

#### When Relationship is Unlinked
**Current**: Not possible for most relationships

**Should Be**:
- Invoice unlinked → Page refreshes to remove from list
- Estimate unlinked → Page refreshes to remove from list
- Equipment removed → Page refreshes, equipment still exists
- Material removed → Page refreshes, material can be added back

#### Revalidation Paths

Currently used:
```typescript
revalidatePath("/dashboard/work")
revalidatePath(`/dashboard/work/${jobId}`)
revalidatePath("/dashboard/schedule")
```

Should include specific pages when unlinking:
```typescript
revalidatePath(`/dashboard/invoices`)
revalidatePath(`/dashboard/work/estimates`)
```

---

## 7. UI Component Architecture

### JobPageModern Layout

Current sections displayed:
1. Archive notice (if archived)
2. Job header + status badges
3. Stats grid (4 cards: total amount, balance due, labor hours, profit margin)
4. Customer & property cards
5. Team assigned card
6. Job details card
7. Financial summary card

### Missing Components

```typescript
// These are referenced but not rendered in JobPageModern:
- JobEquipmentTable          // Equipment serviced on this job
- JobMaterialsTable          // Materials used (shown in widget but no detail table)
- JobPurchaseOrdersTable     // POs for this job
- JobAppointmentsTable       // Schedules for this job
```

### Component Hierarchy

```
page.tsx (loads all data)
  ↓
JobPageModern (card-based layout) 
  ├── JobQuickActions (status buttons)
  ├── TeamMemberSelector (✅ manages relationships)
  └── Links to detail pages (no inline relationship mgmt)

JobPageContent (legacy - complex accordions)
  ├── JobEstimatesTable
  ├── JobInvoicesTable
  ├── JobPurchaseOrdersTable
  ├── JobAppointmentsTable
  └── Multiple management capabilities
```

---

## 8. Recommended Implementation Pattern

Based on working `TeamMemberSelector` pattern:

### Pattern Template

```typescript
// 1. Server Action (e.g., removeEquipmentFromJob)
"use server"
export async function removeEquipmentFromJob(jobEquipmentId: string): Promise<ActionResult<void>> {
  // Verify job_equipment belongs to user's company
  // Delete from job_equipment table
  // Revalidate paths:
  //   - `/dashboard/work/${jobId}`
  //   - `/dashboard/inventory/equipment`
  // Return success
}

// 2. Client Component (e.g., JobEquipmentRemoveButton)
"use client"
export function JobEquipmentRemoveButton({ 
  jobEquipmentId, 
  jobId 
}: Props) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const handleRemove = async () => {
    setIsRemoving(true)
    const result = await removeEquipmentFromJob(jobEquipmentId)
    if (result.success) {
      toast.success("Equipment removed")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsRemoving(false)
  }
  
  return (
    <>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => setShowConfirm(true)}
      >
        Remove
      </Button>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        {/* Confirmation UI */}
      </AlertDialog>
    </>
  )
}
```

---

## 9. Data Flow Diagram

### Current State: Read-Only Detail View

```
page.tsx (loads all data in parallel)
    ↓
JobPageModern (displays cards)
    ├── Customer card (links to customer page)
    ├── Property card (links to property page)
    ├── Team card (✅ has TeamMemberSelector with add/remove)
    ├── Financial summary (links to invoices/estimates pages)
    └── Other cards (display only)

User wants to remove estimate from job:
    ↓
Must go to: /dashboard/invoices
    ↓
Find estimate
    ↓
Open estimate detail page
    ↓
Change job_id field
    ↓
Save
    ↓
Refresh
```

### Proposed: Inline Relationship Management

```
page.tsx (loads all data)
    ↓
JobPageModern (displays cards)
    ├── Customer card (change via dialog)
    ├── Property card (change via dialog)
    ├── Team card (✅ add/remove/edit inline)
    ├── Equipment card (add/remove inline) ← NEW
    ├── Materials card (remove inline) ← ENHANCED
    ├── Invoices card (unlink inline) ← NEW
    ├── Estimates card (unlink inline) ← NEW
    └── Payments card (unlink inline) ← NEW
```

---

## 10. Summary & Recommendations

### Current State Score: 60/100

**Strengths**:
- ✅ Clean server-side data loading pattern
- ✅ Comprehensive data fetching in parallel
- ✅ Team assignment relationship fully implemented
- ✅ Customer and property management implemented
- ✅ Proper RLS policies on junction tables

**Weaknesses**:
- ❌ 7 missing server actions for unlinking
- ❌ No UI for managing equipment/materials relationships on detail page
- ❌ Read-only relationships for invoices/estimates/payments
- ❌ Orphaned records when jobs deleted (FK relationships)
- ❌ Incomplete modern view (missing tables)
- ❌ No revalidation pattern for unlink operations

### Priority Implementation

**Phase 1 (Critical)** - Add unlink actions:
1. `unlinkInvoiceFromJob()` - Financial impact
2. `unlinkEstimateFromJob()` - Customer communication
3. `removeEquipmentFromJob()` - Job completion tracking

**Phase 2 (Important)** - Add UI components:
1. `JobInvoicesManager` - Inline unlink UI
2. `JobEstimatesManager` - Inline unlink UI
3. `JobEquipmentManager` - Inline add/remove UI

**Phase 3 (Enhancement)** - Remaining operations:
1. `unlinkPaymentFromJob()` - Payment management
2. `unlinkScheduleFromJob()` - Schedule management
3. `removeJobMaterial()` - Material management

---

## Appendix: Database Relationships

### Complete Relationship Map

```sql
-- Direct Foreign Key Relationships
job.customer_id → customers.id
job.property_id → properties.id
job.assigned_to → users.id

-- Child Relationships (Foreign Key Points To Job)
invoices.job_id → jobs.id
estimates.job_id → jobs.id
payments.job_id → jobs.id
purchase_orders.job_id → jobs.id
schedules.job_id → jobs.id
job_notes.job_id → jobs.id
job_photos.job_id → jobs.id
job_signatures.job_id → jobs.id
job_tasks.job_id → jobs.id
job_time_entries.job_id → jobs.id
communications.job_id → jobs.id
call_logs.job_id → jobs.id

-- Junction Tables
job_equipment: (job_id, equipment_id) → jobs, equipment
job_materials: (job_id, [optional] price_book_item_id) → jobs, price_book_items
job_team_assignments: (job_id, team_member_id) → jobs, team_members

-- Cross-Table References
job_materials.invoice_id → invoices.id
job_materials.job_equipment_id → job_equipment.id
job_materials.purchase_order_id → purchase_orders.id
equipment.install_job_id → jobs.id
equipment.last_service_job_id → jobs.id
```

---

**Document Generated**: 2025-11-12
**Analysis Scope**: Comprehensive job detail page collapsible sections and relationship management
**Files Analyzed**: 25+ component and action files
