# Convex Hooks Library

This library provides typed React hooks for interacting with Convex, replacing the previous Supabase query patterns.

## Installation

The Convex provider is already integrated in `apps/web/src/app/layout.tsx`. No additional setup is required.

## Migration Guide

### Before (Supabase)

```typescript
// Using React.cache() with Supabase
import { cache } from "react";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const getCustomers = cache(async (companyId: string) => {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("company_id", companyId);
  return data;
});

// In a Server Component
export default async function CustomersPage() {
  const customers = await getCustomers(companyId);
  return <CustomerTable data={customers} />;
}
```

### After (Convex)

```typescript
// Using Convex hooks
"use client";

import { useCustomers } from "@/lib/convex";

export function CustomersPage({ companyId }: { companyId: Id<"companies"> }) {
  const customers = useCustomers({ companyId });

  if (customers === undefined) {
    return <Loading />;
  }

  return <CustomerTable data={customers} />;
}
```

## Key Differences

### 1. Real-time Updates

Convex queries automatically subscribe to real-time updates. When data changes on the server, your components re-render automatically.

```typescript
const customers = useCustomers({ companyId });
// Automatically updates when customers change!
```

### 2. Loading States

Convex queries return `undefined` while loading:

```typescript
const customers = useCustomers({ companyId });

if (customers === undefined) {
  return <Skeleton />;
}

return <CustomerList customers={customers} />;
```

### 3. Client Components Required

Convex hooks must be used in Client Components:

```typescript
"use client"; // Required!

import { useCustomers } from "@/lib/convex";

export function MyComponent() {
  const customers = useCustomers({ /* args */ });
  // ...
}
```

### 4. Typed Arguments

All hooks are fully typed with Convex's generated types:

```typescript
import { useCustomers } from "@/lib/convex";
import type { Id } from "@/lib/convex";

// TypeScript enforces correct argument types
const customers = useCustomers({
  companyId: companyId as Id<"companies">,
  includeArchived: false,
  limit: 50,
});
```

## Available Hooks

### Authentication

```typescript
import {
  useCurrentUser,
  useIsAuthenticated,
  useUserMemberships,
  useSignIn,
  useSignUp,
  useSignOut,
} from "@/lib/convex";
```

### Customers

```typescript
import {
  useCustomers,
  useCustomer,
  useCustomerComplete,
  useSearchCustomers,
  useCustomerStats,
  useCustomersByStatus,
  useCustomerByEmail,
  useCreateCustomer,
  useUpdateCustomer,
  useArchiveCustomer,
  useUnarchiveCustomer,
  useDeleteCustomer,
} from "@/lib/convex";
```

### Jobs

```typescript
import {
  useJobs,
  useJob,
  useJobComplete,
  useJobsByStatus,
  useJobsByCustomer,
  useJobsByProperty,
  useJobsByAssignee,
  useSearchJobs,
  useJobStats,
  useTodaysJobs,
  useUpcomingJobs,
  useCreateJob,
  useUpdateJob,
  useUpdateJobStatus,
  useAssignJob,
  useArchiveJob,
  useDeleteJob,
} from "@/lib/convex";
```

### Invoices

```typescript
import {
  useInvoices,
  useInvoice,
  useInvoiceComplete,
  useInvoicesByStatus,
  useInvoicesByCustomer,
  useInvoicesByJob,
  useOverdueInvoices,
  useInvoiceStats,
  useCreateInvoice,
  useUpdateInvoice,
  useSendInvoice,
  useMarkInvoicePaid,
  useArchiveInvoice,
  useDeleteInvoice,
} from "@/lib/convex";
```

### Estimates

```typescript
import {
  useEstimates,
  useEstimate,
  useEstimateComplete,
  usePendingEstimates,
  useExpiringEstimates,
  useEstimateStats,
  useCreateEstimate,
  useUpdateEstimate,
  useSendEstimate,
  useApproveEstimate,
  useDeclineEstimate,
  useConvertEstimateToJob,
} from "@/lib/convex";
```

### Payments

```typescript
import {
  usePayments,
  usePayment,
  usePaymentsByCustomer,
  usePaymentsByInvoice,
  usePaymentStats,
  useRecentPayments,
  useCreatePayment,
  useProcessPayment,
  useRefundPayment,
} from "@/lib/convex";
```

### Appointments/Schedules

```typescript
import {
  useAppointments,
  useAppointment,
  useTodaysAppointments,
  useUpcomingAppointments,
  useAppointmentsByTechnician,
  useAppointmentsByJob,
  useAppointmentStats,
  useCreateAppointment,
  useRescheduleAppointment,
  useCancelAppointment,
  useCompleteAppointment,
} from "@/lib/convex";
```

### Equipment

```typescript
import {
  useEquipment,
  useEquipmentItem,
  useEquipmentByProperty,
  useEquipmentByCustomer,
  useEquipmentDueForMaintenance,
  useEquipmentStats,
  useCreateEquipment,
  useUpdateEquipment,
  useLogMaintenance,
} from "@/lib/convex";
```

### Properties

```typescript
import {
  useProperties,
  useProperty,
  usePropertiesByCustomer,
  usePropertyStats,
  useCreateProperty,
  useUpdateProperty,
} from "@/lib/convex";
```

### Communications

```typescript
import {
  useCommunications,
  useCommunicationsByCustomer,
  useCommunicationsByJob,
  useUnreadCommunications,
  useSendEmail,
  useSendSms,
  useLogCall,
  useAddNote,
} from "@/lib/convex";
```

### Team Members

```typescript
import {
  useTeamMembers,
  useTeamMember,
  useTechnicians,
  useDispatchers,
  useInviteTeamMember,
  useUpdateTeamMemberRole,
} from "@/lib/convex";
```

### Service Plans

```typescript
import {
  useServicePlans,
  useServicePlansByCustomer,
  useActiveServicePlans,
  useExpiringServicePlans,
  useServicePlanStats,
  useCreateServicePlan,
  useRenewServicePlan,
} from "@/lib/convex";
```

### Price Book

```typescript
import {
  usePriceBookItems,
  usePriceBookItem,
  usePriceBookItemBySku,
  usePriceBookCategories,
  usePriceBookStats,
  useCreatePriceBookItem,
  useUpdatePriceBookItemPrice,
  useBulkPriceAdjust,
} from "@/lib/convex";
```

### Inventory

```typescript
import {
  useInventory,
  useInventoryItem,
  useLowStockInventory,
  useInventoryNeedingReorder,
  useInventoryStats,
  useAdjustStock,
  useReserveStock,
  useConsumeReservedStock,
} from "@/lib/convex";
```

### Purchase Orders

```typescript
import {
  usePurchaseOrders,
  usePurchaseOrder,
  usePurchaseOrdersPendingApproval,
  usePurchaseOrdersAwaitingDelivery,
  usePurchaseOrderStats,
  useCreatePurchaseOrder,
  useApprovePurchaseOrder,
  useMarkPurchaseOrderReceived,
} from "@/lib/convex";
```

### Vendors

```typescript
import {
  useVendors,
  useVendor,
  useActiveVendors,
  useVendorStats,
  useSearchVendors,
  useCreateVendor,
  useUpdateVendor,
} from "@/lib/convex";
```

### Tags

```typescript
import {
  useTags,
  useTagsByCategory,
  usePopularTags,
  useTagStats,
  useCreateTag,
  useMergeTags,
} from "@/lib/convex";
```

## Utility Functions

```typescript
import {
  formatCurrency,
  parseCurrencyToCents,
  formatPhoneNumber,
  createDisplayName,
  getInitials,
  convexTimestampToDate,
  dateToConvexTimestamp,
  isArchived,
  isDeleted,
  excludeArchived,
  excludeDeleted,
  paginateArray,
} from "@/lib/convex";
```

## Example: Full Migration

### Before (Server Component with Supabase)

```typescript
// app/dashboard/customers/page.tsx
import { getCustomersPageData } from "@/lib/queries/customers";
import { CustomersTable } from "@/components/customers/customers-table";

export default async function CustomersPage() {
  const { customers, totalCount } = await getCustomersPageData(1, 50);

  return (
    <div>
      <h1>Customers ({totalCount})</h1>
      <CustomersTable data={customers} />
    </div>
  );
}
```

### After (Client Component with Convex)

```typescript
// app/dashboard/customers/page.tsx
import { CustomersPageContent } from "@/components/customers/customers-page-content";

export default function CustomersPage() {
  return <CustomersPageContent />;
}

// components/customers/customers-page-content.tsx
"use client";

import { useCustomers, useCustomerStats } from "@/lib/convex";
import { CustomersTable } from "./customers-table";
import { useActiveCompanyId } from "@/hooks/use-active-company";

export function CustomersPageContent() {
  const companyId = useActiveCompanyId();
  const customers = useCustomers({ companyId, limit: 50 });
  const stats = useCustomerStats({ companyId });

  if (customers === undefined || stats === undefined) {
    return <CustomersTableSkeleton />;
  }

  return (
    <div>
      <h1>Customers ({stats.total})</h1>
      <CustomersTable data={customers} />
    </div>
  );
}
```

## Tips for Migration

1. **Start with leaf components**: Migrate components that don't have many dependencies first.

2. **Use loading states**: Always handle the `undefined` state from Convex queries.

3. **Leverage real-time**: Remove manual refresh logic - Convex handles it automatically.

4. **Type safety**: Use the generated Convex types for full type safety.

5. **Optimistic updates**: Convex mutations automatically handle optimistic updates.
