# Job Domain Table Migration Report

## Summary

The jobs table has been refactored from 83 columns to ~20 core columns. Domain-specific fields have been moved to separate tables accessible via JOINs.

## Files Fixed (4/58)

### ✅ Fixed Files

1. **`/src/app/api/jobs/[id]/toolbar-data/route.ts`**
   - **Fields Updated**: `total_amount`, `paid_amount`, `estimated_labor_hours`
   - **Changes**:
     - Added `getJobWithDomains(['financial', 'timeTracking'])` to SELECT query
     - Updated field access: `job.total_amount` → `job.financial?.total_amount`
     - Updated field access: `job.paid_amount` → `job.financial?.paid_amount`
     - Updated field access: `job.estimated_labor_hours` → `job.timeTracking?.estimated_labor_hours`

2. **`/src/actions/customers.ts`**
   - **Fields Updated**: `total_amount`, `actual_end`
   - **Changes**:
     - Line 1487: Added `timeTracking:job_time_tracking(actual_end)` to SELECT
     - Line 1510: Added `financial:job_financial(total_amount)` to SELECT
     - Line 1516: Updated aggregation: `job.total_amount` → `job.financial?.total_amount`
     - Line 1521: Updated field access: `lastJob?.actual_end` → `lastJob?.timeTracking?.actual_end`

3. **`/src/components/work/jobs/jobs-data.tsx`**
   - **Fields Updated**: `total_amount`, `paid_amount`, `actual_start`, `actual_end`
   - **Changes**:
     - Lines 44-51: Added domain table JOINs to `JOB_SELECT` constant
     - Lines 162-163: Added domain extraction with null safety
     - Lines 186-189: Mapped domain fields to component props
     - All child components now receive financial and time tracking data

4. **`/src/components/work/job-details/job-page-content-unified.tsx`**
   - **Fields Updated**: `total_amount`, `deposit_amount`, `deposit_paid_at`, `estimated_labor_hours`
   - **Changes**:
     - Line 617: `job.total_amount` → `job.financial?.total_amount`
     - Line 624: `job.total_amount` → `job.financial?.total_amount`
     - Line 629: `job.deposit_amount` → `job.financial?.deposit_amount`
     - Lines 632, 639, 645: `job.deposit_paid_at` → `job.financial?.deposit_paid_at`
     - Line 691-692: `job.estimated_labor_hours` → `job.timeTracking?.estimated_labor_hours`
     - Lines 818-819: Updated prop passing to `LinkedDataAlerts` component

## Domain Field Mappings

### Financial Domain (`job_financial`)
- `job.total_amount` → `job.financial?.total_amount`
- `job.paid_amount` → `job.financial?.paid_amount`
- `job.deposit_amount` → `job.financial?.deposit_amount`
- `job.payment_terms` → `job.financial?.payment_terms`
- `job.payment_due_date` → `job.financial?.payment_due_date`
- `job.invoice_generated_at` → `job.financial?.invoice_generated_at`
- `job.deposit_paid_at` → `job.financial?.deposit_paid_at`

### Workflow Domain (`job_workflow`)
- `job.workflow_stage` → `job.workflow?.workflow_stage`
- `job.template_id` → `job.workflow?.template_id`
- `job.workflow_completed_stages` → `job.workflow?.workflow_completed_stages`

### Time Tracking Domain (`job_time_tracking`)
- `job.actual_start` → `job.timeTracking?.actual_start`
- `job.actual_end` → `job.timeTracking?.actual_end`
- `job.technician_clock_in` → `job.timeTracking?.technician_clock_in`
- `job.technician_clock_out` → `job.timeTracking?.technician_clock_out`
- `job.total_labor_hours` → `job.timeTracking?.total_labor_hours`
- `job.estimated_labor_hours` → `job.timeTracking?.estimated_labor_hours`

### Customer Approval Domain (`job_customer_approval`)
- `job.customer_approval_status` → `job.customerApproval?.customer_approval_status`
- `job.customer_signature` → `job.customerApproval?.customer_signature`
- `job.customer_notes` → `job.customerApproval?.customer_notes`

### Quality Domain (`job_quality`)
- `job.quality_score` → `job.quality?.quality_score`
- `job.customer_satisfaction_rating` → `job.quality?.customer_satisfaction_rating`
- `job.inspection_required` → `job.quality?.inspection_required`

### AI Enrichment Domain (`job_ai_enrichment`)
- `job.ai_categories` → `job.aiEnrichment?.ai_categories`
- `job.ai_equipment` → `job.aiEnrichment?.ai_equipment`
- `job.ai_service_type` → `job.aiEnrichment?.ai_service_type`

### Equipment Service Domain (`job_equipment_service`)
- `job.primary_equipment_id` → `job.equipmentService?.primary_equipment_id`
- `job.job_service_agreement_id` → `job.equipmentService?.job_service_agreement_id`

### Dispatch Domain (`job_dispatch`)
- `job.dispatch_zone` → `job.dispatch?.dispatch_zone`
- `job.route_order` → `job.dispatch?.route_order`

### Safety Domain (`job_safety`)
- `job.requires_permit` → `job.safety?.requires_permit`
- `job.hazards_identified` → `job.safety?.hazards_identified`

### Multi-Entity Domain (`job_multi_entity`)
- `job.primary_customer_id` → `job.multiEntity?.primary_customer_id`
- `job.primary_property_id` → `job.multiEntity?.primary_property_id`
- `job.deleted_by` → `job.multiEntity?.deleted_by`

## Remaining Files to Fix (54)

### High Priority - Actions & API Routes (8 files)
1. `/src/actions/estimates.ts`
2. `/src/actions/invoice-payments.ts`
3. `/src/actions/invoices.ts`
4. `/src/actions/payments/process-invoice-payment.ts`
5. `/src/actions/purchase-orders.ts`
6. `/src/actions/schedule-assignments.ts`
7. `/src/actions/schedules.ts`
8. `/src/app/(public)/pay/[invoiceId]/page.tsx`

### High Priority - Job Detail Components (11 files)
9. `/src/components/work/job-details/tabs/overview-tab.tsx`
10. `/src/components/work/job-details/tabs/team-schedule-tab.tsx`
11. `/src/components/work/job-details/tabs/financials-tab.tsx`
12. `/src/components/work/job-details/job-appointments-table.tsx`
13. `/src/components/work/job-details/job-estimates-table.tsx`
14. `/src/components/work/job-details/job-invoices-table.tsx`
15. `/src/components/work/job-details/job-purchase-orders-table.tsx`
16. `/src/components/work/job-details/sections/job-estimates.tsx`
17. `/src/components/work/job-details/sections/job-invoices.tsx`
18. `/src/components/work/job-details/smart-badges/linked-data-alerts.tsx`
19. `/src/components/call-window/customer-sidebar.tsx`

### Medium Priority - Customer/Property Views (8 files)
20. `/src/components/customers/editor-blocks/jobs-table-block.tsx`
21. `/src/components/customers/customer-invoices-table.tsx`
22. `/src/components/customers/customer-page-content.tsx`
23. `/src/components/properties/property-detail-data.tsx`
24. `/src/components/properties/property-details/property-jobs-table.tsx`
25. `/src/components/properties/property-details/property-page-content.tsx`
26. `/src/components/settings/team/settings-team-member-detail-data.tsx`
27. `/src/components/team/team-member-detail-data.tsx`

### Medium Priority - Invoice/Estimate/Payment Components (11 files)
28. `/src/components/invoices/invoice-detail-data.tsx`
29. `/src/components/invoices/invoice-page-content.tsx`
30. `/src/components/invoices/invoice-payments.tsx`
31. `/src/components/invoices/invoice-progress-payments.tsx`
32. `/src/components/invoices/invoice-totals.tsx`
33. `/src/components/payment/invoice-payment-form.tsx`
34. `/src/components/work/invoices/invoices-data.tsx`
35. `/src/components/work/invoices/invoices-stats.tsx`
36. `/src/components/work/estimates/estimate-detail-data.tsx`
37. `/src/components/work/estimates/estimate-page-content.tsx`
38. `/src/components/appointments/appointment-detail-data.tsx`

### Lower Priority - Stats & Other Components (16 files)
39. `/src/components/work/estimates/estimates-data.tsx`
40. `/src/components/work/estimates/estimates-stats.tsx`
41. `/src/components/work/maintenance-plans/maintenance-plan-page-content.tsx`
42. `/src/components/work/payments/payment-form.tsx`
43. `/src/components/work/payments/payment-page-content.tsx`
44. `/src/components/work/purchase-order-detail-data.tsx`
45. `/src/components/work/purchase-order-page-content.tsx`
46. `/src/components/work/purchase-orders/purchase-orders-data.tsx`
47. `/src/components/work/purchase-orders/purchase-orders-stats.tsx`
48. `/src/components/work/service-agreements/service-agreement-detail-data.tsx`
49. `/src/components/work/service-agreements/service-agreement-page-content.tsx`
50. `/src/components/work/vendors/vendor-detail-data.tsx`
51. `/src/components/work/vendors/vendor-page-content.tsx`
52. `/src/components/work/vendors/vendors-stats.tsx`
53. `/src/actions/jobs.ts`
54. `/src/lib/dashboard/mission-control-data.ts`

## Helper Functions Available

### From `/src/lib/validations/job-domain-schemas.ts`:

```typescript
// Get complete job with all domains
import { getJobCompleteSelect } from "@/lib/validations/job-domain-schemas";

const { data } = await supabase
  .from('jobs')
  .select(getJobCompleteSelect())
  .eq('id', jobId)
  .single();

// Get job with specific domains only
import { getJobWithDomains } from "@/lib/validations/job-domain-schemas";

const { data } = await supabase
  .from('jobs')
  .select(getJobWithDomains(['financial', 'workflow', 'timeTracking']))
  .eq('id', jobId)
  .single();

// Get minimal job for list views (core + financial only)
import { getJobListSelect } from "@/lib/validations/job-domain-schemas";

const { data } = await supabase
  .from('jobs')
  .select(getJobListSelect())
  .order('created_at', { ascending: false })
  .limit(50);
```

## Migration Checklist

For each file:

1. ✅ **Read the file** to understand current usage
2. ✅ **Identify all references** to removed fields
3. ✅ **Update SELECT queries** with domain table JOINs:
   - Add domain tables: `financial:job_financial(*)`
   - Use helper functions from `job-domain-schemas.ts`
4. ✅ **Update field access patterns**:
   - Direct access: `job.total_amount` → `job.financial?.total_amount`
   - Use optional chaining (`?.`) for safety
5. ✅ **Verify null safety** - Domain tables might not be loaded
6. ✅ **Test patterns** - Ensure formatters handle undefined values

## Pattern Examples

### ✅ Good: Query with Domain Tables
```typescript
import { getJobWithDomains } from "@/lib/validations/job-domain-schemas";

const { data: job } = await supabase
  .from("jobs")
  .select(getJobWithDomains(["financial", "timeTracking"]))
  .eq("id", jobId)
  .single();

// Access with optional chaining
const totalAmount = job.financial?.total_amount || 0;
const actualEnd = job.timeTracking?.actual_end;
```

### ❌ Bad: Direct Field Access
```typescript
// This will fail - field no longer exists on jobs table
const { data: job } = await supabase
  .from("jobs")
  .select("*, total_amount, paid_amount")
  .eq("id", jobId)
  .single();

const totalAmount = job.total_amount; // undefined!
```

### ✅ Good: Aggregation with Domain Tables
```typescript
const { data: jobs } = await supabase
  .from("jobs")
  .select("financial:job_financial(total_amount)")
  .eq("customer_id", customerId);

const totalRevenue = jobs?.reduce(
  (sum, job) => sum + (job.financial?.total_amount || 0),
  0
) || 0;
```

## Next Steps

1. **Continue fixing high-priority files** (Actions & Job Detail Components)
2. **Update SELECT queries** to include necessary domain tables
3. **Add optional chaining** to all domain field accesses
4. **Test each file** after updating to ensure runtime safety
5. **Verify null handling** in all formatters and calculations

## Notes

- All domain tables use optional chaining (`?.`) because they might not be loaded
- Use appropriate helper functions to avoid over-fetching data
- Financial domain is most commonly needed (used in stats, displays, calculations)
- Time tracking domain needed for labor hours and completion tracking
- Other domains (workflow, quality, safety, etc.) only needed in specific contexts

## Status

- **Progress**: 4/58 files completed (6.9%)
- **Estimated Remaining**: ~54 files
- **Priority**: Focus on high-priority files first (Actions, Job Details, Customer/Property views)
