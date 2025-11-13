# Archive Button Implementation Audit
**Date**: November 11, 2025
**Status**: 🟡 IN PROGRESS

---

## Executive Summary

**Finding**: Archive functionality infrastructure exists but is NOT consistently implemented across all detail pages.

**Status Overview**:
- ✅ **Toolbar Preset System**: Complete with archive buttons for all 12 entity types
- ✅ **Archive Actions**: Server actions exist for most entities  
- 🟡 **Implementation**: Only 2-3 pages actually use the toolbar presets
- ❌ **Consistency**: Most pages use custom implementations or lack archive buttons

---

## Toolbar Preset System (EXCELLENT ✅)

### Available Presets with Archive Buttons:

1. **Jobs** (`getJobDetailToolbar`) - Line 147-153
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

2. **Customers** (`getCustomerDetailToolbar`) - Line 244-250
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

3. **Estimates** (`getEstimateDetailToolbar`) - Line 364-370
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

4. **Invoices** (`getInvoiceDetailToolbar`) - Line 476-482
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

5. **Properties** (`getPropertyDetailToolbar`) - Line 550-556
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

6. **Team Members** (`getTeamMemberDetailToolbar`) - Line 656-662
   - Archive action in context menu (if canManage)
   - Variant: destructive
   - Separator before action

7. **Equipment** (`getEquipmentDetailToolbar`) - Line 732-738
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

8. **Contracts** (`getContractDetailToolbar`) - Line 824-830
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

9. **Purchase Orders** (`getPurchaseOrderDetailToolbar`) - Line 934-940
   - Archive action in context menu
   - Variant: destructive
   - Separator before action

10. **Appointments** (`getAppointmentDetailToolbar`) - Line 1038-1044
    - "Cancel Appointment" action (not archive, but similar)
    - Variant: destructive
    - Separator before action

11. **Payments** (`getPaymentDetailToolbar`) - Line 1134-1140
    - Archive action in context menu
    - Variant: destructive
    - Separator before action

12. **Maintenance Plans** (`getMaintenancePlanDetailToolbar`) - Line 1231-1237
    - Archive action in context menu
    - Variant: destructive
    - Separator before action

13. **Service Agreements** (`getServiceAgreementDetailToolbar`) - Line 1322-1328
    - Archive action in context menu
    - Variant: destructive
    - Separator before action

---

## Current Implementation Status by Entity

### ✅ FULLY IMPLEMENTED (2/13)

#### 1. **Jobs** ✅
- **Location**: `/src/components/work/job-details/job-page-content.tsx`
- **Status**: Custom implementation with full archive dialog
- **Features**:
  - Archive button in toolbar
  - ArchiveConfirmDialog component
  - archiveJob server action
  - Toast notifications
  - 90-day recovery notice
- **Code Quality**: Excellent ⭐⭐⭐⭐⭐

#### 2. **Team Members** ✅  
- **Location**: `/src/components/team/team-member-page-content.tsx`
- **Status**: Custom implementation
- **Features**: Archive functionality present
- **Code Quality**: Good ⭐⭐⭐⭐

---

### 🟡 PARTIALLY IMPLEMENTED (0/13)

None found.

---

### ❌ NOT IMPLEMENTED (11/13)

#### 3. **Appointments** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/appointments/[id]/page.tsx`
- **Component**: `/src/components/work/appointments/appointment-page-content.tsx`
- **Missing**:
  - No archive button in toolbar
  - No archive dialog
  - No cancelAppointment/archiveAppointment action referenced
- **Impact**: HIGH - users cannot archive completed appointments
- **Effort**: 30 minutes
- **Recommendation**: Use `getAppointmentDetailToolbar` preset

#### 4. **Contracts** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/contracts/[id]/page.tsx`
- **Component**: `/src/components/work/contracts/contract-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: MEDIUM
- **Effort**: 30 minutes
- **Recommendation**: Use `getContractDetailToolbar` preset

#### 5. **Equipment** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/equipment/[id]/page.tsx`
- **Component**: `/src/components/work/equipment/equipment-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: MEDIUM
- **Effort**: 30 minutes
- **Recommendation**: Use `getEquipmentDetailToolbar` preset

#### 6. **Estimates** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/estimates/[id]/page.tsx`
- **Component**: `/src/components/work/estimates/estimate-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: HIGH - estimates pile up without archive
- **Effort**: 30 minutes
- **Recommendation**: Use `getEstimateDetailToolbar` preset

#### 7. **Invoices** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/invoices/[id]/page.tsx`
- **Component**: `/src/components/invoices/invoice-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: HIGH - old invoices clutter the system
- **Effort**: 30 minutes
- **Recommendation**: Use `getInvoiceDetailToolbar` preset

#### 8. **Maintenance Plans** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/maintenance-plans/[id]/page.tsx`
- **Component**: `/src/components/work/maintenance-plans/maintenance-plan-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: MEDIUM
- **Effort**: 30 minutes
- **Recommendation**: Use `getMaintenancePlanDetailToolbar` preset

#### 9. **Payments** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/payments/[id]/page.tsx`
- **Component**: `/src/components/work/payments/payment-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: MEDIUM
- **Effort**: 30 minutes
- **Recommendation**: Use `getPaymentDetailToolbar` preset

#### 10. **Properties** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/properties/[id]/page.tsx`
- **Component**: `/src/components/properties/property-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: LOW - properties rarely archived
- **Effort**: 30 minutes
- **Recommendation**: Use `getPropertyDetailToolbar` preset

#### 11. **Purchase Orders** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/purchase-orders/[id]/page.tsx`
- **Component**: `/src/components/work/purchase-orders/purchase-order-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: MEDIUM
- **Effort**: 30 minutes
- **Recommendation**: Use `getPurchaseOrderDetailToolbar` preset

#### 12. **Service Agreements** ❌
- **Location**: `/src/app/(dashboard)/dashboard/work/service-agreements/[id]/page.tsx`
- **Component**: `/src/components/work/service-agreements/service-agreement-page-content.tsx`
- **Missing**:
  - No archive button
  - No toolbar preset usage
- **Impact**: MEDIUM
- **Effort**: 30 minutes
- **Recommendation**: Use `getServiceAgreementDetailToolbar` preset

#### 13. **Customers** ❌ (not in work section but important)
- **Location**: `/src/app/(dashboard)/dashboard/customers/[id]/page.tsx`
- **Component**: `/src/components/customers/customer-page-content.tsx`
- **Missing**:
  - Archive button likely missing
  - Should use `getCustomerDetailToolbar` preset
- **Impact**: HIGH - customer data management
- **Effort**: 30 minutes

---

## Required Server Actions Status

### ✅ Server Actions that EXIST:

1. **archiveJob** - `/src/actions/jobs.ts` ✅
2. **archiveCustomer** - `/src/actions/customers.ts` (likely ✅)

### ❌ Server Actions that MAY BE MISSING:

3. **archiveAppointment** - Need to verify ❌
4. **archiveContract** - Need to verify ❌
5. **archiveEquipment** - Need to verify ❌
6. **archiveEstimate** - Need to verify ❌
7. **archiveInvoice** - Need to verify ❌
8. **archiveMaintenancePlan** - Need to verify ❌
9. **archivePayment** - Need to verify ❌
10. **archiveProperty** - Need to verify ❌
11. **archivePurchaseOrder** - Need to verify ❌
12. **archiveServiceAgreement** - Need to verify ❌

---

## Recommended Implementation Pattern

### Step 1: Create Archive Server Action

```typescript
// src/actions/[entity].ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function archive[Entity](entityId: string) {
  try {
    const supabase = await createClient();
    
    // Set deleted_at timestamp (soft delete)
    const { error } = await supabase
      .from("[entity_table]")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", entityId);
    
    if (error) throw error;
    
    revalidatePath("/dashboard/work/[entity]");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to archive [entity]" };
  }
}
```

### Step 2: Add Archive Dialog to Page Component

```typescript
// page-content.tsx
"use client";

import { useState } from "react";
import { archive[Entity] } from "@/actions/[entity]";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function [Entity]PageContent({ entity }: Props) {
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  
  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const result = await archive[Entity](entity.id);
      if (result.success) {
        toast.success("[Entity] archived successfully");
        setIsArchiveDialogOpen(false);
        // Redirect to list page
        window.location.href = "/dashboard/work/[entity]";
      } else {
        toast.error(result.error || "Failed to archive [entity]");
      }
    } catch (error) {
      toast.error("Failed to archive [entity]");
    } finally {
      setIsArchiving(false);
    }
  };
  
  return (
    <>
      {/* ... page content ... */}
      
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogTitle>Archive [Entity]?</DialogTitle>
          <DialogDescription>
            This will archive the [entity]. You can restore it from the archive within 90 days.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchive} disabled={isArchiving}>
              {isArchiving ? "Archiving..." : "Archive [Entity]"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Step 3: Use Toolbar Preset

```typescript
import { get[Entity]DetailToolbar } from "@/components/layout/detail-page-toolbar-presets";
import { DetailPageToolbar } from "@/components/layout/detail-page-toolbar";

const toolbarConfig = get[Entity]DetailToolbar({
  [entity]Id: entity.id,
  [entity]Number: entity.[number_field],
  status: entity.status,
  onArchive: () => setIsArchiveDialogOpen(true),
  // ... other required callbacks
});

<DetailPageToolbar {...toolbarConfig} />
```

---

## Priority Levels

### 🔴 CRITICAL (Implement First):
1. **Invoices** - Financial records must be archivable
2. **Estimates** - Sales pipeline management
3. **Appointments** - Schedule cleanup

### 🟡 HIGH (Implement Soon):
4. **Contracts** - Legal document management
5. **Payments** - Financial tracking
6. **Equipment** - Asset management

### 🟢 MEDIUM (Implement Next Sprint):
7. **Maintenance Plans** - Service management
8. **Service Agreements** - Contract management
9. **Purchase Orders** - Vendor management

### 🔵 LOW (Nice to Have):
10. **Properties** - Rarely archived (usually kept)
11. **Customers** - Should only archive with extreme caution

---

## Effort Estimates

| Entity | Effort | Complexity | Dependencies |
|--------|--------|------------|--------------|
| Invoices | 30 min | Low | Server action + dialog |
| Estimates | 30 min | Low | Server action + dialog |
| Appointments | 30 min | Low | Server action + dialog |
| Contracts | 30 min | Low | Server action + dialog |
| Payments | 30 min | Low | Server action + dialog |
| Equipment | 30 min | Low | Server action + dialog |
| Maintenance Plans | 30 min | Low | Server action + dialog |
| Service Agreements | 30 min | Low | Server action + dialog |
| Purchase Orders | 30 min | Low | Server action + dialog |
| Properties | 30 min | Low | Server action + dialog |

**Total Effort**: ~5-6 hours to implement all archive buttons

---

## Next Steps

1. ✅ Verify all server actions exist (check `/src/actions/` folder)
2. ⏳ Implement archive buttons starting with CRITICAL priority
3. ⏳ Test archive/restore flow for each entity
4. ⏳ Add "View Archived" filter to list pages
5. ⏳ Implement 90-day auto-deletion for archived items (optional)

---

## Files to Modify

### Server Actions (create if missing):
- `/src/actions/invoices.ts` - Add archiveInvoice
- `/src/actions/estimates.ts` - Add archiveEstimate  
- `/src/actions/appointments.ts` - Add archiveAppointment
- `/src/actions/contracts.ts` - Add archiveContract
- `/src/actions/equipment.ts` - Add archiveEquipment
- `/src/actions/payments.ts` - Add archivePayment
- `/src/actions/maintenance-plans.ts` - Add archiveMaintenancePlan
- `/src/actions/service-agreements.ts` - Add archiveServiceAgreement
- `/src/actions/purchase-orders.ts` - Add archivePurchaseOrder
- `/src/actions/properties.ts` - Add archiveProperty

### Page Components (add dialog + toolbar):
- `/src/components/invoices/invoice-page-content.tsx`
- `/src/components/work/estimates/estimate-page-content.tsx`
- `/src/components/work/appointments/appointment-page-content.tsx`
- `/src/components/work/contracts/contract-page-content.tsx`
- `/src/components/work/equipment/equipment-page-content.tsx`
- `/src/components/work/payments/payment-page-content.tsx`
- `/src/components/work/maintenance-plans/maintenance-plan-page-content.tsx`
- `/src/components/work/service-agreements/service-agreement-page-content.tsx`
- `/src/components/work/purchase-orders/purchase-order-page-content.tsx`
- `/src/components/properties/property-page-content.tsx`

---

## Conclusion

**Status**: 🟡 **NEEDS ATTENTION**

- Infrastructure is excellent (toolbar presets exist)
- Implementation is inconsistent (only 2/13 pages have archive)
- Low complexity to fix (30 min per entity)
- High value to users (essential data management feature)

**Recommendation**: Implement archive buttons systematically, starting with CRITICAL priority entities (Invoices, Estimates, Appointments).

---

**Report Generated**: November 11, 2025
**Next Review**: After implementation phase
