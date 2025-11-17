# Job Domain Table Migration Guide

## Quick Reference

This guide helps you migrate code from the old monolithic `jobs` table (83 columns) to the new domain-based structure (20 core + 10 domain tables).

## 🚀 Quick Start

### Step 1: Import Helper Functions

```typescript
import {
  getJobCompleteSelect,
  getJobListSelect,
  getJobWithDomains
} from "@/lib/validations/job-domain-schemas";
```

### Step 2: Update Your Query

**Before:**
```typescript
const { data: job } = await supabase
  .from("jobs")
  .select("*")
  .eq("id", jobId)
  .single();

// Access fields directly
const totalAmount = job.total_amount;
const paidAmount = job.paid_amount;
```

**After:**
```typescript
const { data: job } = await supabase
  .from("jobs")
  .select(getJobWithDomains(["financial", "timeTracking"]))
  .eq("id", jobId)
  .single();

// Access via domain with optional chaining
const totalAmount = job.financial?.total_amount ?? 0;
const paidAmount = job.financial?.paid_amount ?? 0;
```

### Step 3: Update Field Access

Replace all direct field access with domain access:

```typescript
// Old → New
job.total_amount           → job.financial?.total_amount
job.paid_amount            → job.financial?.paid_amount
job.deposit_amount         → job.financial?.deposit_amount
job.actual_start           → job.timeTracking?.actual_start
job.actual_end             → job.timeTracking?.actual_end
job.workflow_stage         → job.workflow?.workflow_stage
job.quality_score          → job.quality?.quality_score
```

## 📊 Domain Reference Table

| Old Field | New Path | Domain Table | Helper Domain Name |
|-----------|----------|--------------|-------------------|
| `total_amount` | `job.financial?.total_amount` | `job_financial` | `financial` |
| `paid_amount` | `job.financial?.paid_amount` | `job_financial` | `financial` |
| `deposit_amount` | `job.financial?.deposit_amount` | `job_financial` | `financial` |
| `deposit_paid_at` | `job.financial?.deposit_paid_at` | `job_financial` | `financial` |
| `payment_terms` | `job.financial?.payment_terms` | `job_financial` | `financial` |
| `payment_due_date` | `job.financial?.payment_due_date` | `job_financial` | `financial` |
| `invoice_generated_at` | `job.financial?.invoice_generated_at` | `job_financial` | `financial` |
| `workflow_stage` | `job.workflow?.workflow_stage` | `job_workflow` | `workflow` |
| `template_id` | `job.workflow?.template_id` | `job_workflow` | `workflow` |
| `workflow_completed_stages` | `job.workflow?.workflow_completed_stages` | `job_workflow` | `workflow` |
| `actual_start` | `job.timeTracking?.actual_start` | `job_time_tracking` | `timeTracking` |
| `actual_end` | `job.timeTracking?.actual_end` | `job_time_tracking` | `timeTracking` |
| `technician_clock_in` | `job.timeTracking?.technician_clock_in` | `job_time_tracking` | `timeTracking` |
| `technician_clock_out` | `job.timeTracking?.technician_clock_out` | `job_time_tracking` | `timeTracking` |
| `total_labor_hours` | `job.timeTracking?.total_labor_hours` | `job_time_tracking` | `timeTracking` |
| `estimated_labor_hours` | `job.timeTracking?.estimated_labor_hours` | `job_time_tracking` | `timeTracking` |
| `customer_approval_status` | `job.customerApproval?.customer_approval_status` | `job_customer_approval` | `customerApproval` |
| `customer_signature` | `job.customerApproval?.customer_signature` | `job_customer_approval` | `customerApproval` |
| `customer_notes` | `job.customerApproval?.customer_notes` | `job_customer_approval` | `customerApproval` |
| `quality_score` | `job.quality?.quality_score` | `job_quality` | `quality` |
| `customer_satisfaction_rating` | `job.quality?.customer_satisfaction_rating` | `job_quality` | `quality` |
| `inspection_required` | `job.quality?.inspection_required` | `job_quality` | `quality` |
| `primary_equipment_id` | `job.equipmentService?.primary_equipment_id` | `job_equipment_service` | `equipmentService` |
| `job_service_agreement_id` | `job.equipmentService?.job_service_agreement_id` | `job_equipment_service` | `equipmentService` |
| `dispatch_zone` | `job.dispatch?.dispatch_zone` | `job_dispatch` | `dispatch` |
| `route_order` | `job.dispatch?.route_order` | `job_dispatch` | `dispatch` |
| `requires_permit` | `job.safety?.requires_permit` | `job_safety` | `safety` |
| `hazards_identified` | `job.safety?.hazards_identified` | `job_safety` | `safety` |
| `ai_categories` | `job.aiEnrichment?.ai_categories` | `job_ai_enrichment` | `aiEnrichment` |
| `ai_equipment` | `job.aiEnrichment?.ai_equipment` | `job_ai_enrichment` | `aiEnrichment` |
| `ai_service_type` | `job.aiEnrichment?.ai_service_type` | `job_ai_enrichment` | `aiEnrichment` |
| `primary_customer_id` | `job.multiEntity?.primary_customer_id` | `job_multi_entity` | `multiEntity` |
| `primary_property_id` | `job.multiEntity?.primary_property_id` | `job_multi_entity` | `multiEntity` |
| `deleted_by` | `job.multiEntity?.deleted_by` | `job_multi_entity` | `multiEntity` |

## 🔧 Common Patterns

### Pattern 1: Simple Field Access

```typescript
// ❌ Old way
const amount = job.total_amount || 0;

// ✅ New way
const amount = job.financial?.total_amount ?? 0;
```

### Pattern 2: Conditional Rendering

```typescript
// ❌ Old way
{job.total_amount > 0 && <div>{formatCurrency(job.total_amount)}</div>}

// ✅ New way
{(job.financial?.total_amount ?? 0) > 0 && (
  <div>{formatCurrency(job.financial?.total_amount ?? 0)}</div>
)}
```

### Pattern 3: Aggregations

```typescript
// ❌ Old way
const { data: jobs } = await supabase
  .from("jobs")
  .select("total_amount")
  .eq("customer_id", customerId);

const totalRevenue = jobs?.reduce((sum, job) => sum + (job.total_amount || 0), 0) || 0;

// ✅ New way
const { data: jobs } = await supabase
  .from("jobs")
  .select("financial:job_financial(total_amount)")
  .eq("customer_id", customerId);

const totalRevenue = jobs?.reduce(
  (sum, job) => sum + (job.financial?.total_amount || 0),
  0
) || 0;
```

### Pattern 4: Multiple Domain Fields

```typescript
// ❌ Old way
const { data: job } = await supabase
  .from("jobs")
  .select("*, total_amount, paid_amount, actual_start, actual_end")
  .single();

// ✅ New way
const { data: job } = await supabase
  .from("jobs")
  .select(getJobWithDomains(["financial", "timeTracking"]))
  .single();

// Access both domains
const financials = {
  total: job.financial?.total_amount ?? 0,
  paid: job.financial?.paid_amount ?? 0,
};

const timing = {
  start: job.timeTracking?.actual_start,
  end: job.timeTracking?.actual_end,
};
```

### Pattern 5: Complete Job Data

```typescript
// For job detail pages that need everything
const { data: job } = await supabase
  .from("jobs")
  .select(getJobCompleteSelect())
  .eq("id", jobId)
  .single();

// Now you have access to ALL domains
const hasDeposit = job.financial?.deposit_amount ?? 0;
const workflowStage = job.workflow?.workflow_stage;
const qualityScore = job.quality?.quality_score;
```

### Pattern 6: List Views (Optimized)

```typescript
// For job lists - only fetch what you need
const { data: jobs } = await supabase
  .from("jobs")
  .select(getJobListSelect()) // Only core + financial
  .order("created_at", { ascending: false })
  .limit(50);

// Each job has: id, title, status, etc. + financial.total_amount & financial.paid_amount
```

## ⚠️ Common Pitfalls

### Pitfall 1: Forgetting Optional Chaining

```typescript
// ❌ Will crash if financial domain not loaded
const amount = job.financial.total_amount;

// ✅ Safe with optional chaining
const amount = job.financial?.total_amount ?? 0;
```

### Pitfall 2: Using SELECT *

```typescript
// ❌ Doesn't include domain tables
const { data } = await supabase.from("jobs").select("*");

// ✅ Explicitly include domains
const { data } = await supabase
  .from("jobs")
  .select(getJobWithDomains(["financial"]));
```

### Pitfall 3: Not Handling Null/Undefined

```typescript
// ❌ Might display NaN or undefined
<div>{job.financial?.total_amount}</div>

// ✅ Proper fallback
<div>{job.financial?.total_amount ?? 0}</div>
```

### Pitfall 4: Over-fetching Data

```typescript
// ❌ Fetching all domains when you only need one
const { data } = await supabase
  .from("jobs")
  .select(getJobCompleteSelect());

// ✅ Only fetch what you need
const { data } = await supabase
  .from("jobs")
  .select(getJobWithDomains(["financial"]));
```

## 📝 Migration Checklist

For each file you migrate:

- [ ] Identify which domain fields are being used
- [ ] Update import statements to include helper functions
- [ ] Update SELECT queries to include required domains
- [ ] Replace direct field access with domain access (e.g., `job.field` → `job.domain?.field`)
- [ ] Add optional chaining (`?.`) to all domain accesses
- [ ] Add fallback values (e.g., `?? 0` for numbers, `?? null` for objects)
- [ ] Test the component/function to ensure it handles undefined gracefully
- [ ] Verify that calculations and aggregations still work correctly
- [ ] Check that conditionals work with the new null-safe patterns

## 🎯 Domain Selection Guide

Choose domains based on what data you need:

| Use Case | Required Domains | Helper Function |
|----------|------------------|-----------------|
| Job list view | `financial` | `getJobListSelect()` |
| Job detail page | All domains | `getJobCompleteSelect()` |
| Financial dashboard | `financial` | `getJobWithDomains(['financial'])` |
| Time tracking report | `timeTracking` | `getJobWithDomains(['timeTracking'])` |
| Quality metrics | `quality` | `getJobWithDomains(['quality'])` |
| Workflow visualization | `workflow` | `getJobWithDomains(['workflow'])` |
| Multi-domain dashboard | Multiple | `getJobWithDomains(['financial', 'quality', 'timeTracking'])` |

## 🔍 Testing Strategy

After migrating a file:

1. **Unit Tests**: Ensure formatters handle undefined values
   ```typescript
   expect(formatCurrency(undefined)).toBe("$0.00");
   expect(formatCurrency(null)).toBe("$0.00");
   expect(formatCurrency(job.financial?.total_amount)).toBeDefined();
   ```

2. **Component Tests**: Verify rendering with/without domain data
   ```typescript
   it("renders without domain data", () => {
     const job = { id: "1", title: "Test" }; // No domains
     render(<JobCard job={job} />);
     expect(screen.getByText("$0.00")).toBeInTheDocument();
   });

   it("renders with domain data", () => {
     const job = {
       id: "1",
       title: "Test",
       financial: { total_amount: 10000 }
     };
     render(<JobCard job={job} />);
     expect(screen.getByText("$100.00")).toBeInTheDocument();
   });
   ```

3. **Integration Tests**: Test queries return expected shape
   ```typescript
   const { data } = await supabase
     .from("jobs")
     .select(getJobWithDomains(["financial"]))
     .limit(1)
     .single();

   expect(data).toHaveProperty("financial");
   expect(data.financial).toHaveProperty("total_amount");
   ```

## 🐛 Troubleshooting

### Problem: "Cannot read property 'total_amount' of undefined"

**Solution**: Add optional chaining
```typescript
// ❌ Before
const amount = job.financial.total_amount;

// ✅ After
const amount = job.financial?.total_amount ?? 0;
```

### Problem: "Query returns job but no financial data"

**Solution**: Include domain in SELECT
```typescript
// ❌ Missing domain
.select("*")

// ✅ Include domain
.select(getJobWithDomains(["financial"]))
```

### Problem: "Displaying 'undefined' in UI"

**Solution**: Add fallback values
```typescript
// ❌ No fallback
{job.financial?.total_amount}

// ✅ With fallback
{job.financial?.total_amount ?? 0}
```

### Problem: "Slow queries after migration"

**Solution**: Only fetch domains you need
```typescript
// ❌ Over-fetching
.select(getJobCompleteSelect())

// ✅ Optimized
.select(getJobWithDomains(["financial"]))
```

## 📚 Additional Resources

- **Schema Documentation**: `/src/lib/validations/job-domain-schemas.ts`
- **Type Definitions**: `/src/types/supabase.ts`
- **Migration Report**: `/job-domain-migration-report.md`
- **Analysis Script**: `/analyze-remaining-files.sh`

## ✅ Success Criteria

Your migration is complete when:

1. No more direct references to removed fields (e.g., `job.total_amount`)
2. All queries include necessary domain tables
3. All field accesses use optional chaining
4. All calculations handle undefined values
5. Components render correctly with and without domain data
6. No runtime errors related to undefined domain fields
7. Tests pass with updated field access patterns
