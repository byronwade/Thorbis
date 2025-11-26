# Telnyx Communications - Quick Reference Guide

## 🚀 Quick Start

### Import Server Actions

```typescript
import {
  // Phone Number Management
  getCompanyPhoneNumbers,
  purchasePhoneNumber,
  updatePhoneNumber,
  deletePhoneNumber,

  // Call Routing
  getCallRoutingRules,
  createCallRoutingRule,
  updateCallRoutingRule,
  deleteCallRoutingRule,
  toggleCallRoutingRule,

  // Usage Statistics
  getPhoneNumberUsageStats,
  getCompanyUsageStats,

  // Call Operations
  makeCall,
  acceptCall,
  declineCall,
  endCall,

  // Voicemail
  getVoicemails,
  markVoicemailAsRead,
  deleteVoicemail,
} from "@/actions/telnyx";
```

### Get User's Company ID

```typescript
import { getUserCompanyId } from "@/lib/auth/user-data";

export async function MyServerComponent() {
  const companyId = await getUserCompanyId();
  if (!companyId) {
    return <NoCompanyError />;
  }

  // Use companyId in queries...
}
```

## 📞 Common Usage Patterns

### 1. Display Phone Numbers

```typescript
export async function PhoneNumbersPage() {
  const companyId = await getUserCompanyId();
  const result = await getCompanyPhoneNumbers(companyId);

  if (!result.success) {
    return <ErrorMessage error={result.error} />;
  }

  return (
    <div>
      {result.data.map((number) => (
        <PhoneNumberCard key={number.id} number={number} />
      ))}
    </div>
  );
}
```

### 2. Create Call Routing Rule

```typescript
"use server";

export async function createNewRoutingRule(formData: FormData) {
  const companyId = await getUserCompanyId();
  const userId = await getCurrentUserId();

  const result = await createCallRoutingRule({
    companyId,
    userId,
    name: formData.get("name") as string,
    routingType: "round_robin",
    teamMembers: ["user-id-1", "user-id-2"],
    ringTimeout: 20,
    enableVoicemail: true,
    voicemailTranscriptionEnabled: true,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/settings/communications/call-routing");
  return { success: true, data: result.data };
}
```

### 3. Get Usage Statistics

```typescript
export async function UsageDashboard() {
  const companyId = await getUserCompanyId();

  // Get last 30 days of usage
  const result = await getCompanyUsageStats(companyId, 30);

  if (!result.success) {
    return <ErrorMessage error={result.error} />;
  }

  const stats = result.data;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard title="Total Calls" value={stats.totalCalls} />
      <StatCard title="Call Duration" value={`${stats.totalCallDuration}m`} />
      <StatCard title="SMS Sent" value={stats.outgoingSms} />
      <StatCard title="SMS Received" value={stats.incomingSms} />
    </div>
  );
}
```

### 4. Toggle Routing Rule (Client Component)

```typescript
"use client";

import { toggleCallRoutingRule } from "@/actions/telnyx";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function RuleToggle({ rule }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleToggle = async () => {
    const result = await toggleCallRoutingRule(rule.id, !rule.is_active);

    if (result.success) {
      toast({
        title: "Success",
        description: `Rule ${!rule.is_active ? "activated" : "deactivated"}`,
      });
      router.refresh(); // Refresh server data
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Switch checked={rule.is_active} onCheckedChange={handleToggle} />
  );
}
```

## 🗄️ Database Queries

### Direct Supabase Queries (When Needed)

```typescript
import { createClient } from "@/lib/supabase/server";

// Get phone numbers with usage stats
const { data: numbers } = await supabase
  .from("phone_numbers")
  .select(`
    *,
    communications:communications(count)
  `)
  .eq("company_id", companyId)
  .is("deleted_at", null);

// Get routing rules with creator info
const { data: rules } = await supabase
  .from("call_routing_rules")
  .select(`
    *,
    created_by_user:users!call_routing_rules_created_by_fkey(name, email)
  `)
  .eq("company_id", companyId)
  .order("priority", { ascending: false });

// Get voicemails with customer details
const { data: voicemails } = await supabase
  .from("voicemails")
  .select(`
    *,
    customer:customers(first_name, last_name, phone),
    phone_number:phone_numbers(phone_number)
  `)
  .eq("company_id", companyId)
  .eq("is_read", false)
  .order("received_at", { ascending: false });
```

## 🎨 Component Patterns

### Server Component with Loading State

```typescript
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <DataComponent />
      </Suspense>
    </div>
  );
}

async function DataComponent() {
  const data = await fetchData();
  return <Display data={data} />;
}
```

### Client Component with Actions

```typescript
"use client";

import { useRouter } from "next/navigation";
import { deletePhoneNumber } from "@/actions/telnyx";

export function DeleteButton({ phoneNumberId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePhoneNumber(phoneNumberId);

    if (result.success) {
      router.refresh();
    }

    setIsDeleting(false);
  };

  return (
    <Button onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
```

## 📊 Usage Statistics Examples

### Daily Stats Structure

```typescript
{
  date: "2025-11-02",
  calls: 45,
  sms: 123,
  duration: 2340  // seconds
}
```

### Company Stats Structure

```typescript
{
  incomingCalls: 234,
  outgoingCalls: 456,
  totalCalls: 690,
  totalCallDuration: 34560,  // seconds
  averageCallDuration: 50,    // seconds
  incomingSms: 567,
  outgoingSms: 890,
  totalSms: 1457,
  dailyStats: DailyStat[]
}
```

## 🔒 Security Best Practices

### 1. Always Use Company Context

```typescript
// ✅ GOOD - Uses company context
export async function myAction() {
  const companyId = await getUserCompanyId();
  const { data } = await supabase
    .from("phone_numbers")
    .select("*")
    .eq("company_id", companyId);
}

// ❌ BAD - No company filter
export async function myAction() {
  const { data } = await supabase
    .from("phone_numbers")
    .select("*");
}
```

### 2. Validate Input

```typescript
import { z } from "zod";

const routingRuleSchema = z.object({
  name: z.string().min(1).max(100),
  routingType: z.enum(["direct", "round_robin", "ivr", "business_hours"]),
  priority: z.number().int().min(0).max(100),
});

export async function createRule(formData: FormData) {
  const parsed = routingRuleSchema.parse({
    name: formData.get("name"),
    routingType: formData.get("routingType"),
    priority: Number(formData.get("priority")),
  });

  // Safe to use parsed data
}
```

### 3. Handle Errors Gracefully

```typescript
export async function myAction() {
  try {
    const result = await someOperation();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Operation failed",
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

## 📱 Real-Time Updates (Optional Enhancement)

### Subscribe to Changes

```typescript
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function RealtimePhoneNumbers({ companyId }) {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("phone-numbers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "phone_numbers",
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          console.log("Change detected:", payload);
          // Update local state
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  return <PhoneNumbersList numbers={numbers} />;
}
```

## 🎯 Common Routing Rule Configurations

### 1. Direct Forward

```typescript
{
  routingType: "direct",
  forwardToNumber: "+1234567890",
  enableVoicemail: true,
  recordCalls: false,
}
```

### 2. Round Robin

```typescript
{
  routingType: "round_robin",
  teamMembers: ["user-1", "user-2", "user-3"],
  ringTimeout: 20,
  enableVoicemail: true,
}
```

### 3. Business Hours

```typescript
{
  routingType: "business_hours",
  businessHours: {
    monday: [{ start: "09:00", end: "17:00" }],
    tuesday: [{ start: "09:00", end: "17:00" }],
    // ...
  },
  timezone: "America/Los_Angeles",
  afterHoursAction: "voicemail",
  enableVoicemail: true,
}
```

### 4. IVR Menu

```typescript
{
  routingType: "ivr",
  ivrMenu: {
    greeting: "Welcome! Press 1 for sales, 2 for support.",
    options: [
      { key: "1", action: "forward", destination: "+1234567890" },
      { key: "2", action: "forward", destination: "+0987654321" },
      { key: "0", action: "voicemail" },
    ],
  },
  ivrGreetingUrl: "https://storage.example.com/greeting.mp3",
}
```

## 🧪 Testing

### Mock Data for Development

```typescript
const mockPhoneNumber = {
  id: "test-number-1",
  company_id: "test-company-1",
  phone_number: "+14155551234",
  formatted_number: "(415) 555-1234",
  country_code: "US",
  number_type: "local",
  features: ["voice", "sms"],
  status: "active",
  voicemail_enabled: true,
  created_at: new Date().toISOString(),
};

const mockRoutingRule = {
  id: "test-rule-1",
  company_id: "test-company-1",
  name: "Business Hours Routing",
  routing_type: "business_hours",
  priority: 10,
  is_active: true,
  enable_voicemail: true,
  voicemail_transcription_enabled: true,
};
```

## 📚 Additional Resources

- **Telnyx API Docs:** https://developers.telnyx.com/
- **Supabase Docs:** https://supabase.com/docs
- **Next.js 16 Docs:** https://nextjs.org/docs

---

**Last Updated:** 2025-11-02
**Maintained By:** Development Team
