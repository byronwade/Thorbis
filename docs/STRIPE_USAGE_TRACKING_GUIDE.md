# Stripe Usage Tracking Implementation Guide

This guide shows you exactly where to add usage tracking calls throughout the Thorbis application.

## Prerequisites

1. ✅ Complete meter creation in Stripe Dashboard (see STRIPE_BILLING_SETUP.md)
2. ✅ Add all price IDs to `.env.local`
3. ✅ Usage tracking utility created at `/src/lib/stripe/usage-tracking.ts`

---

## Implementation Checklist

### 1. Team Members Tracking

**When:** Daily cron job or when team changes
**Where:** Create a daily job or trigger on team member changes
**Meter Type:** LAST (bills based on last reported value)

```typescript
// Create: /src/app/api/cron/track-team-members/route.ts
import { trackTeamMemberCount, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  // Verify cron secret (Vercel Cron)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();

  // Get all companies with active subscriptions
  const { data: companies } = await supabase
    .from("companies")
    .select(`
      id,
      team_members!inner(
        user_id,
        users!inner(stripe_customer_id)
      )
    `)
    .eq("stripe_subscription_status", "active");

  for (const company of companies || []) {
    const activeMembers = company.team_members.filter(
      (m: any) => m.status === "active"
    );

    const ownerId = company.team_members.find(
      (m: any) => m.role?.name === "Owner"
    )?.user_id;

    if (ownerId) {
      const customerId = await getUserStripeCustomerId(ownerId);
      if (customerId) {
        await trackTeamMemberCount(customerId, activeMembers.length);
      }
    }
  }

  return Response.json({ success: true });
}

// Add to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/track-team-members",
//     "schedule": "0 0 * * *"
//   }]
// }
```

**OR** Track when team member is added/removed:

```typescript
// In /src/actions/team.ts - after adding team member
import { trackTeamMemberCount, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function addTeamMember(data: TeamMemberData) {
  // ... existing code to add team member ...

  // Track usage
  const customerId = await getUserStripeCustomerId(currentUser.id);
  if (customerId) {
    const { data: count } = await supabase
      .from("team_members")
      .select("id", { count: "exact" })
      .eq("company_id", companyId)
      .eq("status", "active");

    await trackTeamMemberCount(customerId, count || 0);
  }

  return { success: true };
}
```

---

### 2. Invoice Tracking

**When:** When invoice is created and sent
**Where:** Invoice creation action/API
**Meter Type:** COUNT

```typescript
// In /src/actions/invoices.ts
import { trackInvoiceCreated, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function createInvoice(invoiceData: InvoiceData) {
  // ... existing code to create invoice ...

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert(invoiceData)
    .select()
    .single();

  if (!error && invoice) {
    // Track usage
    const customerId = await getUserStripeCustomerId(currentUser.id);
    if (customerId) {
      await trackInvoiceCreated(customerId);
    }
  }

  return { success: true, invoice };
}
```

---

### 3. Estimate/Quote Tracking

**When:** When estimate is created
**Where:** Estimate creation action/API
**Meter Type:** COUNT

```typescript
// In /src/actions/estimates.ts
import { trackEstimateCreated, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function createEstimate(estimateData: EstimateData) {
  // ... existing code to create estimate ...

  const { data: estimate, error } = await supabase
    .from("estimates")
    .insert(estimateData)
    .select()
    .single();

  if (!error && estimate) {
    // Track usage
    const customerId = await getUserStripeCustomerId(currentUser.id);
    if (customerId) {
      await trackEstimateCreated(customerId);
    }
  }

  return { success: true, estimate };
}
```

---

### 4. SMS Tracking

**When:** When SMS is sent
**Where:** SMS sending function
**Meter Type:** COUNT

```typescript
// In /src/lib/communications/sms.ts or /src/actions/communications.ts
import { trackSmsSent, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function sendSms(to: string, message: string, userId: string) {
  // ... existing code to send SMS via Twilio/etc ...

  const success = await twilioClient.messages.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: message,
  });

  if (success) {
    // Track usage
    const customerId = await getUserStripeCustomerId(userId);
    if (customerId) {
      await trackSmsSent(customerId, 1);
    }
  }

  return { success: true };
}
```

---

### 5. Email Tracking

**When:** When email is sent
**Where:** Email sending function
**Meter Type:** COUNT

```typescript
// In /src/lib/email/sender.ts or /src/actions/emails.ts
import { trackEmailSent, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string, userId: string) {
  // Send email
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
  });

  if (!error && data) {
    // Track usage
    const customerId = await getUserStripeCustomerId(userId);
    if (customerId) {
      await trackEmailSent(customerId, 1);
    }
  }

  return { success: !error };
}
```

---

### 6. Video Call Tracking

**When:** When video call ends
**Where:** Video call end event handler
**Meter Type:** SUM

```typescript
// In video call component or API endpoint
import { trackVideoCall, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function endVideoCall(callId: string, userId: string) {
  // Get call duration
  const { data: call } = await supabase
    .from("video_calls")
    .select("started_at, ended_at")
    .eq("id", callId)
    .single();

  if (call?.started_at && call?.ended_at) {
    const durationMs = new Date(call.ended_at).getTime() - new Date(call.started_at).getTime();
    const durationMinutes = Math.ceil(durationMs / 60000);

    // Track usage
    const customerId = await getUserStripeCustomerId(userId);
    if (customerId) {
      await trackVideoCall(customerId, durationMinutes);
    }
  }

  return { success: true };
}
```

---

### 7. Phone Call Tracking

**When:** When phone call ends
**Where:** Phone call end event handler
**Meter Type:** SUM

```typescript
// In phone call component or webhook from phone provider
import { trackPhoneCall, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function handleCallEnded(callData: CallData) {
  const durationMinutes = Math.ceil(callData.duration / 60);

  // Track usage
  const customerId = await getUserStripeCustomerId(callData.userId);
  if (customerId) {
    await trackPhoneCall(customerId, durationMinutes);
  }

  return { success: true };
}
```

---

### 8. Storage Tracking

**When:** Daily cron job or when files are uploaded/deleted
**Where:** Create daily storage calculation job
**Meter Type:** LAST (bills based on last reported value)

```typescript
// Create: /src/app/api/cron/track-storage/route.ts
import { trackStorageUsage, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();

  // Calculate storage per company
  const { data: companies } = await supabase
    .from("companies")
    .select(`
      id,
      team_members!inner(
        user_id,
        users!inner(stripe_customer_id)
      )
    `)
    .eq("stripe_subscription_status", "active");

  for (const company of companies || []) {
    // Calculate total storage for this company
    const { data: files } = await supabase
      .from("files")
      .select("size_bytes")
      .eq("company_id", company.id);

    const totalBytes = files?.reduce((sum, file) => sum + (file.size_bytes || 0), 0) || 0;
    const totalGB = totalBytes / 1024 / 1024 / 1024; // Convert to GB

    const ownerId = company.team_members.find(
      (m: any) => m.role?.name === "Owner"
    )?.user_id;

    if (ownerId) {
      const customerId = await getUserStripeCustomerId(ownerId);
      if (customerId) {
        await trackStorageUsage(customerId, totalGB);
      }
    }
  }

  return Response.json({ success: true });
}

// Add to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/track-storage",
//     "schedule": "0 2 * * *"
//   }]
// }
```

---

### 9. Payment Tracking

**When:** When payment is successfully collected
**Where:** Payment webhook or success handler
**Meter Type:** COUNT

```typescript
// In Stripe payment webhook handler or payment success action
import { trackPaymentCollected, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // ... existing code ...

  const userId = paymentIntent.metadata?.user_id;
  if (userId) {
    const customerId = await getUserStripeCustomerId(userId);
    if (customerId) {
      await trackPaymentCollected(customerId);
    }
  }

  return { success: true };
}
```

---

### 10. Automated Workflow Tracking

**When:** When automated workflow executes
**Where:** Workflow execution engine
**Meter Type:** COUNT

```typescript
// In workflow execution code
import { trackWorkflowExecuted, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function executeWorkflow(workflowId: string, userId: string) {
  // ... execute workflow steps ...

  if (workflowCompleted) {
    // Track usage
    const customerId = await getUserStripeCustomerId(userId);
    if (customerId) {
      await trackWorkflowExecuted(customerId, 1);
    }
  }

  return { success: true };
}
```

---

### 11. API Call Tracking

**When:** On API requests (optional - can be expensive)
**Where:** API middleware or individual routes
**Meter Type:** COUNT

**Option 1: Middleware (tracks all API calls)**

```typescript
// In middleware.ts
import { trackApiCall, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";
import { getCurrentUser } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only track certain API routes
  if (path.startsWith("/api/v1/")) {
    const user = await getCurrentUser();
    if (user) {
      const customerId = await getUserStripeCustomerId(user.id);
      if (customerId) {
        // Don't await - fire and forget to not slow down requests
        trackApiCall(customerId, 1).catch(console.error);
      }
    }
  }

  return NextResponse.next();
}
```

**Option 2: Per-route tracking**

```typescript
// In specific API routes that should be metered
import { trackApiCall, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  // Track usage (fire and forget)
  if (user) {
    const customerId = await getUserStripeCustomerId(user.id);
    if (customerId) {
      trackApiCall(customerId, 1).catch(console.error);
    }
  }

  // ... rest of API logic ...
}
```

---

## Batch Tracking Example

For operations that generate multiple usage events at once:

```typescript
import { trackUsageBatch, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function bulkSendNotifications(userId: string, recipients: Recipient[]) {
  const smsCount = recipients.filter(r => r.method === "sms").length;
  const emailCount = recipients.filter(r => r.method === "email").length;

  // Send notifications...

  // Track all usage at once
  const customerId = await getUserStripeCustomerId(userId);
  if (customerId) {
    await trackUsageBatch(customerId, [
      { event: "thorbis_sms", value: smsCount },
      { event: "thorbis_emails", value: emailCount },
      { event: "thorbis_workflows", value: 1 }, // The bulk send itself
    ]);
  }
}
```

---

## Testing Usage Tracking

### 1. Check Meter Events in Stripe Dashboard

After implementing tracking:

1. Go to https://dashboard.stripe.com/meters
2. Click on a meter (e.g., "Thorbis Invoices")
3. Click "View events"
4. You should see events appearing as you use the application

### 2. Test Locally

```typescript
// In any server action or API route
import { trackUsage, getUserStripeCustomerId } from "@/lib/stripe/usage-tracking";

export async function testUsageTracking() {
  const userId = "test-user-id";
  const customerId = await getUserStripeCustomerId(userId);

  if (customerId) {
    const result = await trackUsage(customerId, "thorbis_invoices", 1);
    console.log("Usage tracking result:", result);
  }
}
```

### 3. View Usage in Upcoming Invoice

1. Go to Stripe Dashboard > Customers
2. Select a test customer
3. View "Upcoming invoice"
4. You should see line items for usage-based charges

---

## Best Practices

### 1. Error Handling
- ✅ Usage tracking failures should NOT block user operations
- ✅ Use fire-and-forget pattern for non-critical tracking
- ✅ Log errors for monitoring

```typescript
// Good: Don't block user action
const result = await createInvoice(data);
trackInvoiceCreated(customerId).catch(console.error); // Fire and forget

// Bad: Blocking user action on tracking failure
await trackInvoiceCreated(customerId);
return result;
```

### 2. Idempotency
- ✅ Ensure usage events are tracked exactly once
- ✅ Use database transactions where appropriate
- ✅ Add deduplication logic for critical events

### 3. Performance
- ✅ Use batch tracking for bulk operations
- ✅ Don't await usage tracking for API calls (fire and forget)
- ✅ Consider queueing for high-volume events

### 4. Testing
- ✅ Use test mode during development
- ✅ Monitor meter events in Stripe Dashboard
- ✅ Verify upcoming invoices before going live

---

## Cron Jobs Setup (Vercel)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/track-team-members",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/track-storage",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Create `CRON_SECRET` environment variable in Vercel dashboard.

---

## Monitoring

### Check Meter Event Delivery

```typescript
// Create: /src/app/api/admin/meter-stats/route.ts
import { stripe } from "@/lib/stripe/server";

export async function GET() {
  if (!stripe) {
    return Response.json({ error: "Stripe not configured" });
  }

  // Get meter event summary
  const summary = await stripe.billing.meterEventSummaries.list({
    customer: "cus_xxx", // Replace with actual customer ID
    start_time: Math.floor(Date.now() / 1000) - 86400, // Last 24 hours
    end_time: Math.floor(Date.now() / 1000),
  });

  return Response.json(summary);
}
```

---

## Troubleshooting

### Events Not Showing in Stripe

1. Check Stripe API key is correct
2. Verify meter event names match exactly
3. Check customer ID is valid
4. Look for errors in server logs

### Usage Not Reflected in Invoice

1. Events are processed asynchronously by Stripe
2. Wait a few minutes and refresh
3. Check the billing period matches
4. Verify the price is attached to the subscription

### Duplicate Events

1. Add idempotency keys to meter events
2. Check for duplicate function calls
3. Review error handling logic

---

**Last Updated:** 2025-01-31
**Status:** Ready for Implementation
