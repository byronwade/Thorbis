# Job Detail Page - Quick Reference Guide

## Current Architecture

**Primary Components**:
- `JobPageModern` - Modern card-based layout (ACTIVE)
- `JobPageContent` - Legacy accordion layout (DEPRECATED)
- Page Component: `/src/app/(dashboard)/dashboard/work/[id]/page.tsx`

**Data Loading**: Server-side via 19 parallel queries in page component

---

## Relationship Status Matrix

| Relationship | Type | Add | Edit | Remove | UI | Server Action |
|---|---|---|---|---|---|---|
| Team Assignments | Junction | ✅ | ✅ | ✅ | ✅ | ✅ TeamMemberSelector |
| Customer | Direct FK | ❌ | ✅ | ✅ | ✅ | ✅ updateJob() |
| Property | Direct FK | ❌ | ✅ | ✅ | ✅ | ✅ updateJob() |
| Equipment | Junction | ❌ | ❌ | ❌ | ❌ | ❌ MISSING |
| Materials | Junction | ✅ | ❌ | ❌ | ✅ Widget | ❌ MISSING |
| Invoices | Direct FK | ❌ | ❌ | ❌ | ✅ Widget | ❌ MISSING |
| Estimates | Direct FK | ❌ | ❌ | ❌ | ✅ Widget | ❌ MISSING |
| Payments | Direct FK | ❌ | ❌ | ❌ | ✅ Card | ❌ MISSING |
| Purchase Orders | Direct FK | ❌ | ❌ | ❌ | ❌ | ❌ MISSING |
| Schedules | Direct FK | ❌ | ❌ | ❌ | ❌ | ❌ MISSING |

---

## 7 Missing Server Actions (CRITICAL)

### Priority 1: Financial Impact (HIGH)
```typescript
// In /src/actions/jobs.ts or /src/actions/invoices.ts
export async function unlinkInvoiceFromJob(invoiceId: string, jobId: string)
export async function unlinkEstimateFromJob(estimateId: string, jobId: string)
```

### Priority 2: Job Completion (MEDIUM)
```typescript
// In /src/actions/equipment.ts
export async function removeEquipmentFromJob(jobEquipmentId: string)
```

### Priority 3: Enhancement (MEDIUM)
```typescript
// In /src/actions/jobs.ts
export async function unlinkPaymentFromJob(paymentId: string, jobId: string)
export async function unlinkScheduleFromJob(scheduleId: string, jobId: string)
export async function unlinkPurchaseOrderFromJob(poId: string, jobId: string)

// In /src/actions/equipment.ts (or jobs.ts)
export async function removeJobMaterial(jobMaterialId: string)
```

---

## Junction Tables (DELETE to unlink)

- `job_equipment` → DELETE row
- `job_materials` → DELETE row
- `job_team_assignments` → DELETE row (✅ already works)

## Direct Foreign Keys (SET NULL to unlink)

- `invoices.job_id` → SET NULL
- `estimates.job_id` → SET NULL
- `payments.job_id` → SET NULL
- `purchase_orders.job_id` → SET NULL
- `schedules.job_id` → SET NULL

---

## Implementation Checklist

For each missing server action, implement:

```typescript
// Template
"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionError, withErrorHandling } from "@/lib/errors"

export async function FUNCTION_NAME(
  id: string,
  jobId?: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient()
    // Get current user + verify company access
    // Get existing record + verify belongs to company
    // Delete row or SET NULL
    // Revalidate paths:
    //   - `/dashboard/work/${jobId}`
    //   - `/dashboard/RESOURCE_TYPE`
    // Return success
  })
}
```

---

## File Locations

**Components**:
- Detail Page: `/src/app/(dashboard)/dashboard/work/[id]/page.tsx`
- Modern Layout: `/src/components/work/job-details/job-page-modern.tsx`
- Legacy Layout: `/src/components/work/job-details/job-page-content.tsx`
- Team Selector: `/src/components/work/job-details/team-member-selector.tsx` (✅ MODEL)

**Actions**:
- Jobs: `/src/actions/jobs.ts`
- Equipment: `/src/actions/equipment.ts`
- Invoices: `/src/actions/invoices.ts`
- Team Assignments: `/src/actions/team-assignments.ts` (✅ MODEL)

**Database**:
- Schema: `/supabase/migrations/20250207000000_add_job_equipment_materials.sql`

---

## Quick Implementation Guide

### Step 1: Create Server Action

Add to `/src/actions/jobs.ts`:
```typescript
export async function unlinkInvoiceFromJob(
  invoiceId: string,
  jobId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    assertAuthenticated(user?.id)
    
    const activeCompanyId = await getActiveCompanyId()
    
    // Verify invoice exists and belongs to company
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, job_id")
      .eq("id", invoiceId)
      .single()
    
    assertExists(invoice, "Invoice")
    if (invoice.company_id !== activeCompanyId) {
      throw new ActionError("Not authorized", ERROR_CODES.AUTH_FORBIDDEN, 403)
    }
    
    // Unlink invoice
    const { error } = await supabase
      .from("invoices")
      .update({ job_id: null })
      .eq("id", invoiceId)
    
    if (error) throw new ActionError(error.message, ERROR_CODES.DB_QUERY_ERROR)
    
    revalidatePath(`/dashboard/work/${jobId}`)
    revalidatePath("/dashboard/invoices")
  })
}
```

### Step 2: Create Component

```typescript
"use client"
import { useState } from "react"
import { unlinkInvoiceFromJob } from "@/actions/jobs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function UnlinkInvoiceButton({
  invoiceId,
  jobId
}: {
  invoiceId: string
  jobId: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isRemoving, setIsRemoving] = useState(false)
  
  const handleUnlink = async () => {
    setIsRemoving(true)
    const result = await unlinkInvoiceFromJob(invoiceId, jobId)
    if (result.success) {
      toast.success("Invoice unlinked")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to unlink")
    }
    setIsRemoving(false)
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUnlink}
      disabled={isRemoving}
    >
      Unlink
    </Button>
  )
}
```

### Step 3: Add to UI

In `JobPageModern` or appropriate widget:
```typescript
{invoices && invoices.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Invoices</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {invoices.map(invoice => (
        <div key={invoice.id} className="flex justify-between items-center">
          <span>{invoice.invoice_number}</span>
          <UnlinkInvoiceButton 
            invoiceId={invoice.id} 
            jobId={job.id} 
          />
        </div>
      ))}
    </CardContent>
  </Card>
)}
```

---

## Testing Checklist

For each new server action test:

- [ ] User can call the action from the UI
- [ ] Action verifies user has company access
- [ ] Relationship is properly unlinked (FK set to NULL or junction row deleted)
- [ ] Page revalidates and UI updates
- [ ] Related pages also revalidate
- [ ] RLS policies allow the operation
- [ ] Error handling works (invalid IDs, unauthorized access, etc.)
- [ ] Toast notification shows success/error
- [ ] Bidirectional references still work (other pages show unlinked state)

---

## Revalidation Paths Template

```typescript
// When unlinking from job detail page:
revalidatePath(`/dashboard/work/${jobId}`) // Main detail page

// Also revalidate related pages:
revalidatePath("/dashboard/invoices")        // Invoice list
revalidatePath("/dashboard/work/estimates")  // Estimate list
revalidatePath(`/dashboard/invoices/${invoiceId}`) // Invoice detail (if exists)
```

---

## Performance Notes

- Page loads 19 queries in parallel → ~1-2s total
- All data server-side rendered
- Client gets full data to work with
- Unlink operations: 1 database query + revalidation
- Consider adding optimistic UI updates for perceived speed

---

## Security Considerations

- ✅ All operations verify company_id ownership
- ✅ RLS policies protect junction table access
- ✅ No cascade deletes on direct FKs (intentional)
- ✅ Validate user authentication before operations
- ⚠️ Consider audit logging for unlink operations
- ⚠️ Consider soft deletes for job_materials (financial trail)

---

Generated: 2025-11-12
See `JOB_DETAIL_ANALYSIS.md` for complete analysis
