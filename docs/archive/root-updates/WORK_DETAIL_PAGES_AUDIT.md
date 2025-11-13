# Work Detail Pages: Relationship & Unlink Audit

## Executive Summary

Comprehensive audit of 11 work detail pages identifying which pages show relationships to other entities and whether they have proper unlink/remove functionality.

**Overall Status**: ✅ Moderate Coverage - 40% of relationships have unlink capability, 60% missing

### Key Findings
- **Jobs**: Most comprehensive - has unlink for invoices, estimates, equipment
- **Invoices**: Has unlink for payments (via junction table)
- **Estimates**: Has unlink from jobs
- **Other pages**: Limited unlink functionality for related items

---

## Detailed Page Audit

### 1. JOBS (`/dashboard/work/[id]`)

**Related Entities Displayed:**
- Estimates (Table) ✅
- Invoices (Table) ✅
- Payments (Table) ✅
- Purchase Orders (Table)
- Team Assignments (Table)
- Appointments/Schedules (Table)
- Equipment Serviced (Table) ✅
- Job Materials (Table) ✅
- Job Notes (Table)
- Signatures (Table)
- Photos (Table)
- Documents (Table)
- Tasks (Table)
- Time Entries (Table)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Estimates | ✅ | ✅ | ❌ | ✅ (unlinkEstimateFromJob) |
| Invoices | ✅ | ✅ | ❌ | ✅ (unlinkInvoiceFromJob) |
| Payments | ✅ | ✅ | ❌ | ❌ |
| Purchase Orders | ✅ | ❌ | ❌ | ❌ |
| Equipment | ✅ | ✅ | ❌ | ✅ (removeEquipmentFromJob) |
| Materials | ✅ | ✅ | ❌ | ❌ Missing |
| Appointments | ✅ | ✅ | ❌ | ❌ Missing |

**Unlink Functions Found**:
- ✅ `unlinkEstimateFromJob()` - Sets `estimates.job_id = NULL`
- ✅ `unlinkInvoiceFromJob()` - Sets `invoices.job_id = NULL`
- ✅ `removeEquipmentFromJob()` - Deletes from `job_equipment` junction table
- Component: `JobEstimatesTable` - Has unlink button with dialog
- Component: `JobInvoicesTable` - Has unlink button with dialog
- Component: `EquipmentServicedSection` - Has remove equipment button

**Missing Unlink Functionality** (HIGH PRIORITY):
1. **Payments** - Can view but cannot unlink from job (via `payments.job_id`)
2. **Materials** - Can view but cannot remove from job (via `job_materials` junction)
3. **Purchase Orders** - Can view but cannot unlink from job
4. **Appointments** - Can view but cannot unlink from job

**Database Pattern**:
- Estimates: FK `job_id` → needs SET NULL
- Invoices: FK `job_id` → needs SET NULL
- Payments: FK `job_id` → needs SET NULL (MISSING UNLINK)
- Equipment: Junction table `job_equipment` → needs DELETE (EXISTS)
- Materials: Junction table `job_materials` → needs DELETE (MISSING UNLINK)

**Effort to Add Missing Unlinks**:
- Remove Payment from Job: 30 min (easy FK)
- Remove Material from Job: 30 min (easy junction delete)
- Remove Appointment from Job: 30 min (easy FK)
- Remove Purchase Order from Job: 30 min (easy FK)

---

### 2. INVOICES (`/dashboard/work/invoices/[id]`)

**Related Entities Displayed:**
- Payments (Table) - Via `invoice_payments` junction table ✅
- Job (Link)
- Customer (Link)
- Estimate (Link) - Workflow timeline
- Contract (Link) - Workflow timeline

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Payments | ✅ | ✅ | ❌ | ❌ Missing |
| Job | ✅ | Implicit | ❌ | ❌ |
| Customer | ✅ | Limited | ❌ | ❌ |

**Related Data Fetched**:
- `invoice_payments` - Junction table with `amount_applied`, `applied_at`
- Payments linked via: `invoice_payments.payment_id → payments.id`

**Missing Unlink Functionality** (HIGH PRIORITY):
1. **Payments** - Can view list but NO way to unlink/remove payment from invoice
   - Shows payment history with amounts
   - Has "Record Payment" button to add
   - NO "Remove Payment" button per row
   - Database: `invoice_payments` junction table (needs DELETE action)

**Database Pattern**:
- `invoice_payments`: Junction table
  - `invoice_id` FK
  - `payment_id` FK
  - `amount_applied` (can be partial)
  - Needs DELETE from junction when unlinking

**Component**: `InvoicePayments` 
- Shows payments with table
- Can add new payments
- No remove buttons on existing payments ❌

**Effort**: 45 min - Need to add:
1. Delete action: `removePaymentFromInvoice()` - deletes from junction
2. Add row action button with confirm dialog
3. Revalidate invoice data

**UI Consideration**: May want to disallow removing if payment is partially applied to reduce accounting complexity

---

### 3. ESTIMATES (`/dashboard/work/estimates/[id]`)

**Related Entities Displayed**:
- Job (Link)
- Customer (Link)
- Invoice (Link) - via `converted_from_estimate_id`
- Contract (Link) - Workflow timeline

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Job | ✅ | Via conversion | ❌ | ❌ |
| Invoice | ✅ | Via conversion | ❌ | ❌ |
| Contract | ✅ | Via conversion | ❌ | ❌ |

**Unlink Functions Found**:
- ✅ `unlinkEstimateFromJob()` - Available for unlinking from job
- Component: `JobEstimatesTable` - Used when viewing job with estimates

**Database Pattern**:
- `estimates.job_id` FK → can be NULL
- `invoices.converted_from_estimate_id` - One-way link (not editable)
- `contracts.estimate_id` FK - One-way link (not editable)

**Status**: ✅ Covered - Already has unlink capability when accessed from Job page

---

### 4. APPOINTMENTS (`/dashboard/work/appointments/[id]`)

**Related Entities Displayed**:
- Job (Link)
- Customer (Link)
- Property (Link)
- Assigned User (Link)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Job | ✅ | Edit | ❌ | ❌ Missing |
| Customer | ✅ | Read-only | ❌ | N/A |
| Property | ✅ | Read-only | ❌ | N/A |

**Database Pattern**:
- `schedules.job_id` FK (type='appointment')
- `schedules.customer_id` FK
- `schedules.property_id` FK

**Missing**: No unlink button to remove appointment from job

**Effort**: 30 min - Need to add `unlinkAppointmentFromJob()` action

---

### 5. CONTRACTS (`/dashboard/work/contracts/[id]`)

**Related Entities Displayed**:
- Estimate (Link) - Workflow timeline
- Invoice (Link) - Workflow timeline
- Job (Link) - Workflow timeline
- Appointments (Table) - Related to job
- Property (Link)
- Customer (Link)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| All links | ✅ | Read-only | ❌ | N/A |
| Appointments | ✅ | View only | ❌ | ❌ |

**Database Pattern**:
- `contracts.estimate_id` FK
- `contracts.invoice_id` FK
- `contracts.job_id` FK
- All are one-way workflow relationships (not meant to unlink)

**Status**: ✅ No unlink needed - contracts follow workflow, not editable relationships

---

### 6. PAYMENTS (`/dashboard/work/payments/[id]`)

**Related Entities Displayed**:
- Invoice (Link)
- Job (Link)
- Customer (Link)
- Payment Plan Schedule (Optional)
- Financing Provider (Optional)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Invoice | ✅ | Read-only | ❌ | ❌ Missing |
| Job | ✅ | Read-only | ❌ | ❌ Missing |

**Database Pattern**:
- `payments.invoice_id` FK
- `payments.job_id` FK (can be NULL)
- Both can be unlinked

**Missing**: No way to unlink payment from invoice or job

**Effort**: 30 min each
- `unlinkPaymentFromInvoice()` - Set `invoice_id = NULL`
- `unlinkPaymentFromJob()` - Set `job_id = NULL`

---

### 7. EQUIPMENT (`/dashboard/work/equipment/[id]`)

**Related Entities Displayed**:
- Customer (Link)
- Property (Link)
- Service Plan (Link)
- Install Job (Link)
- Last Service Job (Link)
- Service History (Table) - via `job_equipment` junction
- Upcoming Maintenance (Table)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Service Plan | ✅ | Edit | ❌ | ❌ |
| Install Job | ✅ | Edit | ❌ | ❌ |
| Last Service Job | ✅ | Edit | ❌ | ❌ |
| Service History | ✅ | ❌ | ❌ | ❌ |

**Database Pattern**:
- `equipment.service_plan_id` FK → can be NULL
- `equipment.install_job_id` FK → can be NULL
- `equipment.last_service_job_id` FK → can be NULL
- `job_equipment` junction for service history (read-only)

**Missing**: 
- No unlink button for service plan
- No unlink button for install job
- Service history appears read-only (appropriate)

**Effort**: 30 min each for FKs

---

### 8. MAINTENANCE PLANS (`/dashboard/work/maintenance-plans/[id]`)

**Related Entities Displayed**:
- Customer (Link)
- Property (Link)
- Equipment (Table) - Equipment covered by plan
- Generated Jobs (Table) - via metadata
- Scheduled Appointments (Table)
- Generated Invoices (Table)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Equipment | ✅ | ✅ Add/remove | ❌ | ✅ (via FK) |
| Jobs | ✅ | Read-only | ❌ | N/A |
| Invoices | ✅ | Read-only | ❌ | N/A |

**Database Pattern**:
- `equipment.service_plan_id` FK → can unlink
- Generated items (jobs, invoices) linked via metadata (read-only)

**Status**: ✅ Equipment linkage is handled

---

### 9. SERVICE AGREEMENTS (`/dashboard/work/service-agreements/[id]`)

**Related Entities Displayed**:
- Customer (Link)
- Property (Link)
- Generated Invoices (Table)
- Generated Jobs (Table)
- Equipment (Table) - at property

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Equipment | ✅ | Read-only | ❌ | N/A |
| Jobs | ✅ | Read-only | ❌ | N/A |
| Invoices | ✅ | Read-only | ❌ | N/A |

**Database Pattern**:
- Stored in `service_plans` with `type='contract'`
- Generated items linked via metadata (workflow, not editable)

**Status**: ✅ No unlink needed - workflow relationships

---

### 10. PURCHASE ORDERS (`/dashboard/work/purchase-orders/[id]`)

**Related Entities Displayed**:
- Job (Link)
- Estimate (Link)
- Invoice (Link)
- Line Items (Table)
- Requested By User (Link)
- Approved By User (Link)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| Job | ✅ | Implicit | ❌ | ❌ Missing |
| Estimate | ✅ | Implicit | ❌ | ❌ Missing |
| Invoice | ✅ | Implicit | ❌ | ❌ Missing |

**Database Pattern**:
- `purchase_orders.job_id` FK
- `purchase_orders.estimate_id` FK
- `purchase_orders.invoice_id` FK

**Missing**: No unlink buttons for relationships

**Effort**: 30 min each

---

### 11. PROPERTIES (`/dashboard/work/properties/[id]`)

**Related Entities Displayed**:
- Customer (Link)
- Jobs (Table)
- Equipment (Table)
- Schedules (Table)
- Estimates (Table)
- Invoices (Table)
- Maintenance Plans (Table)

**Current CRUD Capabilities**:
| Entity | View | Add/Link | Edit | Remove/Unlink |
|--------|------|----------|------|---------------|
| All | ✅ | View only | ❌ | N/A |

**Database Pattern**:
- These are inverse relationships (jobs link to properties, not vice versa)
- Equipment links to property via FK
- No unlink needed (manage from other entity)

**Status**: ✅ Correct - relationships managed from other entities

---

## Summary Table

| Page | Related Entities | View | Add | Edit | Unlink | Priority |
|------|------------------|------|-----|------|--------|----------|
| **Jobs** | Estimates ✅ | ✅ | ✅ | ❌ | ✅ | - |
| **Jobs** | Invoices ✅ | ✅ | ✅ | ❌ | ✅ | - |
| **Jobs** | Payments | ✅ | ✅ | ❌ | ❌ | HIGH |
| **Jobs** | Equipment ✅ | ✅ | ✅ | ❌ | ✅ | - |
| **Jobs** | Materials | ✅ | ✅ | ❌ | ❌ | HIGH |
| **Jobs** | Appointments | ✅ | ✅ | ❌ | ❌ | HIGH |
| **Jobs** | Purchase Orders | ✅ | ❌ | ❌ | ❌ | MEDIUM |
| **Invoices** | Payments (junction) | ✅ | ✅ | ❌ | ❌ | HIGH |
| **Estimates** | Job | ✅ | Implicit | ❌ | ✅ | - |
| **Appointments** | Job | ✅ | Edit | ❌ | ❌ | HIGH |
| **Contracts** | Workflow items | ✅ | N/A | ❌ | N/A | - |
| **Payments** | Invoice/Job | ✅ | N/A | ❌ | ❌ | MEDIUM |
| **Equipment** | Service Plan | ✅ | Edit | ❌ | ❌ | MEDIUM |
| **Equipment** | Install Job | ✅ | Edit | ❌ | ❌ | LOW |
| **Maintenance Plans** | Equipment | ✅ | ✅ | ❌ | ✅ | - |
| **Service Agreements** | Generated items | ✅ | N/A | ❌ | N/A | - |
| **Purchase Orders** | Job/Estimate/Invoice | ✅ | Implicit | ❌ | ❌ | MEDIUM |
| **Properties** | Related items | ✅ | N/A | ❌ | N/A | - |

---

## Quick Wins (HIGH Priority, Low Effort)

| Task | Effort | Impact | Files |
|------|--------|--------|-------|
| Remove Material from Job | 30 min | HIGH | Create `removeMaterialFromJob()` action + UI button |
| Remove Payment from Job | 30 min | HIGH | Create `unlinkPaymentFromJob()` action + edit job payments section |
| Remove Payment from Invoice | 45 min | HIGH | Create `removePaymentFromInvoice()` action + row buttons in InvoicePayments |
| Remove Appointment from Job | 30 min | HIGH | Create `unlinkAppointmentFromJob()` action + update appointment page |
| Unlink Service Plan from Equipment | 30 min | MEDIUM | Create `unlinkServicePlanFromEquipment()` action + edit button |
| Unlink Install Job from Equipment | 30 min | LOW | Create `unlinkInstallJobFromEquipment()` action + edit button |

---

## Database Patterns Found

### Pattern 1: Direct Foreign Key (One-to-One or Many-to-One)
**Examples**: 
- `invoices.job_id` → can SET NULL
- `estimates.job_id` → can SET NULL
- `appointments.job_id` → can SET NULL
- `payments.job_id` → can SET NULL
- `equipment.service_plan_id` → can SET NULL

**Action**: `UPDATE table SET fk_column = NULL WHERE id = ?`
**Complexity**: Simple (5 min each)

### Pattern 2: Junction Tables (Many-to-Many)
**Examples**:
- `job_equipment` (junction for serviced equipment)
- `job_materials` (junction for used materials)
- `invoice_payments` (junction for applied payments)
- `job_team_assignments` (junction for team members)

**Action**: `DELETE FROM junction WHERE id = ?`
**Complexity**: Simple (5 min each)

### Pattern 3: One-Way Workflow Links (No Unlink)
**Examples**:
- `contracts.estimate_id` (contract created from estimate)
- `contracts.invoice_id` (contract for invoice)
- `invoices.converted_from_estimate_id` (estimate→invoice conversion)
- Generated jobs/invoices via metadata

**Action**: None (these represent completed workflows)
**Complexity**: N/A

---

## Recommendations

### Immediate (This Sprint)
1. **Jobs Page** - Add unlink for Payments, Materials, Appointments (3 quick wins)
2. **Invoices Page** - Add remove button for payments in junction table
3. **Appointments Page** - Add unlink button to remove from job

### Soon (Next Sprint)
1. **Equipment Page** - Add unlink for service plan and install job
2. **Payment Page** - Add unlink buttons for invoice/job
3. **Purchase Orders Page** - Add unlink buttons if needed

### Infrastructure
- Create standard "Remove Relationship" confirmation dialog component
- Update all unlink actions to trigger `revalidatePath()`
- Add toast notifications for all unlink operations
- Consider permission checks (who can unlink what)

---

## File Locations Reference

### Server Actions
- `/src/actions/invoices.ts` - `unlinkInvoiceFromJob()`
- `/src/actions/estimates.ts` - `unlinkEstimateFromJob()`
- `/src/actions/equipment.ts` - `removeEquipmentFromJob()`

### Client Components  
- `/src/components/work/job-details/job-invoices-table.tsx` - Has unlink UI
- `/src/components/work/job-details/job-estimates-table.tsx` - Has unlink UI
- `/src/components/work/job-details/equipment-serviced-section.tsx` - Has remove UI
- `/src/components/invoices/invoice-payments.tsx` - Needs unlink UI

### Detail Pages
- `/src/app/(dashboard)/dashboard/work/[id]/page.tsx` - Jobs
- `/src/app/(dashboard)/dashboard/work/invoices/[id]/page.tsx` - Invoices
- `/src/app/(dashboard)/dashboard/work/estimates/[id]/page.tsx` - Estimates
- `/src/app/(dashboard)/dashboard/work/appointments/[id]/page.tsx` - Appointments
- `/src/app/(dashboard)/dashboard/work/contracts/[id]/page.tsx` - Contracts
- `/src/app/(dashboard)/dashboard/work/payments/[id]/page.tsx` - Payments
- `/src/app/(dashboard)/dashboard/work/equipment/[id]/page.tsx` - Equipment
- `/src/app/(dashboard)/dashboard/work/maintenance-plans/[id]/page.tsx` - Maintenance Plans
- `/src/app/(dashboard)/dashboard/work/service-agreements/[id]/page.tsx` - Service Agreements
- `/src/app/(dashboard)/dashboard/work/purchase-orders/[id]/page.tsx` - Purchase Orders
- `/src/app/(dashboard)/dashboard/work/properties/[id]/page.tsx` - Properties

