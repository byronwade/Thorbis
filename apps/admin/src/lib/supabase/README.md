# Admin App - Supabase Database Architecture

The admin app connects to **TWO separate Supabase databases** for different purposes:

## 1. Admin Database (Primary)

**File:** `admin-client.ts`
**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Admin database URL
- `ADMIN_SUPABASE_SERVICE_ROLE_KEY` - Service role key

**Purpose:** Stores admin-specific data (separate from customer data)

**Tables:**
- `admin_users` - Admin user accounts
- `admin_sessions` - Admin login sessions
- `admin_audit_logs` - Audit trail of all admin actions
- `companies_registry` - Registry of customer companies (metadata)
- `support_tickets` + `support_ticket_messages` - Support system
- `email_campaigns` + `email_campaign_sends` - Email marketing
- `email_suppressions` - Unsubscribe/bounce management
- `waitlist` - Pre-launch waitlist
- `platform_settings` - Global platform settings

**Usage:**
```typescript
import { createAdminClient } from "@/lib/supabase/admin-client";

const supabase = createAdminClient();
const { data } = await supabase.from("admin_users").select("*");
```

---

## 2. Web Database (Customer Data - Full Access)

**File:** `web-client.ts`
**Environment Variables:**
- `WEB_SUPABASE_URL` - Web database URL
- `WEB_SUPABASE_SERVICE_ROLE_KEY` - Service role key (bypasses RLS)

**Purpose:** Full admin access to customer data for troubleshooting

**Tables (Customer Data):**
- `customers` - Customer records
- `jobs` - Jobs/work orders
- `invoices` - Invoices
- `payments` - Payments and refunds
- `properties` - Customer properties
- `estimates` - Estimates/quotes
- `contracts` - Service contracts
- `equipment` - Equipment tracking
- `team_members` - Technicians
- And 100+ more tables...

**Security:**
- Uses **service role key** to bypass all Row Level Security (RLS)
- Has **full read/write access** to ALL customer data
- **MUST log all actions** to `admin_audit_logs` table
- **ONLY use server-side** (Server Actions, API Routes)
- **NEVER expose to browser/client**

**Usage:**
```typescript
"use server";
import { createWebClient } from "@/lib/supabase/web-client";
import { logAdminAction } from "@/lib/admin/audit";

export async function viewCustomer(customerId: string, adminUserId: string) {
  const supabase = createWebClient();

  // Access customer data
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  // Log the action (REQUIRED)
  await logAdminAction({
    adminUserId,
    adminEmail: "admin@example.com",
    action: "customer_viewed",
    resourceType: "customer",
    resourceId: customerId
  });

  return data;
}
```

---

## 3. Browser-Safe Client (Read-Only, Future)

**File:** `web-reader.ts`
**Environment Variables:**
- `WEB_SUPABASE_URL` - Web database URL
- `WEB_SUPABASE_ANON_KEY` - Anon key (respects RLS)

**Purpose:** Browser-safe read access to customer data

**Security:**
- Uses **anon key** (safe to expose in browser)
- **Respects RLS policies** (limited access)
- Read-only access to specific tables
- For building real-time dashboards/charts in Client Components

**Status:** Not yet implemented (future enhancement)

---

## Helper Utilities

### Audit Logging (REQUIRED)

All admin actions that modify customer data MUST be logged:

```typescript
import { logAdminAction, ADMIN_ACTIONS } from "@/lib/admin/audit";

await logAdminAction({
  adminUserId: "admin-123",
  adminEmail: "admin@thorbis.com",
  action: ADMIN_ACTIONS.PAYMENT_REFUNDED,
  resourceType: "payment",
  resourceId: "pay-456",
  details: {
    amount: 100,
    reason: "Customer request"
  }
});
```

### Troubleshooting Helpers

Pre-built functions for common admin tasks:

```typescript
import {
  getCustomerFullProfile,
  issuePaymentRefund,
  updateInvoiceStatus,
  searchCustomers,
  getCompanyOverview,
  updateCompanyStatus
} from "@/lib/admin/troubleshooting";

// Get complete customer profile
const profile = await getCustomerFullProfile(
  customerId,
  adminUserId,
  adminEmail
);

// Issue refund
await issuePaymentRefund(
  paymentId,
  100,
  "Customer request",
  adminUserId,
  adminEmail
);

// Search customers
const results = await searchCustomers("john@example.com");
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Application                         │
│                     (apps/admin/)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Admin Database  │              │  Web Database    │    │
│  │  (admin-client)  │              │  (web-client)    │    │
│  ├──────────────────┤              ├──────────────────┤    │
│  │ ✓ Admin users    │              │ ✓ Customers      │    │
│  │ ✓ Sessions       │              │ ✓ Jobs           │    │
│  │ ✓ Audit logs     │◄─────logs────┤ ✓ Invoices       │    │
│  │ ✓ Support        │              │ ✓ Payments       │    │
│  │ ✓ Campaigns      │              │ ✓ Properties     │    │
│  │ ✓ Settings       │              │ ✓ 100+ tables    │    │
│  └──────────────────┘              └──────────────────┘    │
│         │                                   │                │
│         │ Service Role                      │ Service Role   │
│         │ (Bypass RLS)                      │ (Bypass RLS)   │
│         ▼                                   ▼                │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │ Admin Supabase   │              │  Web Supabase    │    │
│  │ iwudmixxoozw...  │              │  togejqdwgge...  │    │
│  └──────────────────┘              └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Best Practices

### ✅ DO:
- Use `createWebClient()` only in Server Actions/API Routes
- Log ALL actions that modify customer data
- Validate admin permissions before operations
- Use helper functions from `troubleshooting.ts`
- Include reason/notes for sensitive operations

### ❌ DON'T:
- Use `createWebClient()` in Client Components
- Expose service role keys to browser
- Skip audit logging
- Directly modify data without logging
- Use web client for admin-specific data

---

## Example: Complete Refund Flow

```typescript
// app/actions/refunds.ts
"use server";

import { createWebClient } from "@/lib/supabase/web-client";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction, ADMIN_ACTIONS } from "@/lib/admin/audit";
import { getAdminSession } from "@/lib/auth/session";

export async function processRefund(
  paymentId: string,
  amount: number,
  reason: string
) {
  // 1. Verify admin session
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 2. Access web database
  const webDb = createWebClient();

  // 3. Get payment
  const { data: payment } = await webDb
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (!payment) {
    throw new Error("Payment not found");
  }

  // 4. Process refund
  const { error } = await webDb
    .from("payments")
    .update({
      status: "refunded",
      refund_amount: amount,
      refund_reason: reason,
      refunded_at: new Date().toISOString(),
      refunded_by: session.user.id
    })
    .eq("id", paymentId);

  if (error) throw error;

  // 5. Log to admin database (REQUIRED)
  await logAdminAction({
    adminUserId: session.user.id,
    adminEmail: session.user.email,
    action: ADMIN_ACTIONS.PAYMENT_REFUNDED,
    resourceType: "payment",
    resourceId: paymentId,
    details: {
      original_amount: payment.amount,
      refund_amount: amount,
      reason,
      customer_id: payment.customer_id
    }
  });

  return { success: true };
}
```

---

## Environment Variables Reference

```bash
# Admin Database
NEXT_PUBLIC_SUPABASE_URL="https://iwudmixxoozwskgolqlz.supabase.co"
ADMIN_SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."

# Web Database (Customer Data)
WEB_SUPABASE_URL="https://togejqdwggezkxahomeh.supabase.co"
WEB_SUPABASE_ANON_KEY="eyJhbGc..."  # For future read-only browser access
WEB_SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."  # For full admin access

# Admin JWT (for admin sessions)
ADMIN_JWT_SECRET="bdc7ad9f53f75d09..."
```
