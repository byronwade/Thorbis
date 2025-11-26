# AI Job Assistant Header

## Overview

An intelligent, context-aware header that uses AI to analyze job data and provide role-specific guidance, policy reminders, and actionable recommendations. Built with Vercel AI SDK and designed to integrate with Anthropic's Claude.

## Component Location

```
/src/components/work/job-details/ai-job-assistant-header.tsx
```

## Key Features

### 1. **Context-Aware Analysis**
The AI analyzes all job-related data:
- Job status, priority, and schedule
- Customer history and payment records
- Team assignments and time tracking
- Invoices, payments, and estimates
- Company policies and business rules

### 2. **Role-Based Guidance**
Insights adapt based on user role:
- **Owner/Manager**: Strategic insights, policy compliance, financial health
- **Dispatcher**: Assignment status, schedule optimization, resource allocation
- **Technician**: Clock-in reminders, safety protocols, documentation requirements
- **CSR**: Customer satisfaction, payment status, service history

### 3. **Intelligent Insights**
The AI provides four types of insights:

#### Critical (Red)
- Jobs overdue by 2+ hours without assignment
- Payments 30+ days overdue (collection policy)
- Safety violations or compliance issues

#### Warning (Yellow)
- High-value jobs without approved estimates
- Payments 15-29 days overdue (follow-up needed)
- Missing documentation or incomplete records
- Unassigned scheduled jobs

#### Info (Blue)
- Active time entries and current status
- Customer communication history
- Weather alerts affecting schedule
- Route optimization suggestions

#### Success (Green)
- VIP customer notifications
- Recent payments received
- Jobs on track and compliant
- Positive customer feedback

## Mock AI Implementation

Currently uses mock data to demonstrate functionality. The `generateMockAIInsights()` function analyzes job context and returns structured insights.

### Example Insights

**For Dispatcher (Overdue Job)**
```
Type: Critical
Title: "Urgent: Job Overdue by 5 hours"
Message: "This job was scheduled 5h ago but no technician is assigned.
Dispatch protocol requires immediate assignment for jobs overdue by more than 2 hours."
Action: "Assign Technician"
```

**For Owner (30+ Days Overdue Payment)**
```
Type: Critical
Title: "Outstanding Balance: $2,450 (35 days overdue)"
Message: "Company policy requires escalation for accounts 30+ days past due.
The balance of $2,450 has been outstanding since 10/15/2024. Consider collection
agency referral or payment plan negotiation."
Action: "View Invoices"
```

**For Technician (VIP Customer)**
```
Type: Success
Title: "VIP Customer: $45,200 Lifetime Value"
Message: "John Smith is a high-value customer with $45,200 in total revenue.
Prioritize excellent service and consider offering loyalty perks or discounts
on future work."
Action: "View Customer History"
```

## Integration with Anthropic (Future)

### Step 1: Environment Variables
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### Step 2: Server Action
```typescript
// /src/actions/ai-job-analysis.ts
"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const InsightSchema = z.object({
  type: z.enum(["critical", "warning", "info", "success"]),
  title: z.string(),
  message: z.string(),
  action: z.object({
    label: z.string(),
    href: z.string().optional(),
  }).optional(),
});

export async function analyzeJobWithAI(context: {
  job: any;
  customer: any;
  metrics: any;
  // ... other context
  userRole: string;
}) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    schema: z.object({
      insights: z.array(InsightSchema),
    }),
    prompt: `You are an AI assistant for a field service management system.

Analyze this job and provide actionable insights for a ${context.userRole}.

Job Data:
- Status: ${context.job.status}
- Priority: ${context.job.priority}
- Scheduled: ${context.job.scheduled_start}
- Customer: ${context.customer?.display_name}
- Total Amount: ${context.metrics.totalAmount}
- Paid Amount: ${context.metrics.paidAmount}

Company Policies:
1. Jobs overdue by 2+ hours require immediate dispatcher action
2. Payments 30+ days overdue require collection escalation
3. High-value jobs (>$5,000) require written estimates before work begins
4. All technicians must clock in before starting work
5. VIP customers (>$10,000 lifetime value) get priority service

Provide 2-4 insights with specific recommendations based on the data above.`,
  });

  return object.insights;
}
```

### Step 3: Update Component
```typescript
// Replace generateMockAIInsights() call with:
import { analyzeJobWithAI } from "@/actions/ai-job-analysis";

const insights = await analyzeJobWithAI({
  job,
  customer,
  property,
  metrics,
  teamAssignments,
  timeEntries,
  invoices,
  payments,
  estimates,
  userRole,
});
```

## Props Interface

```typescript
interface AIJobAssistantHeaderProps {
  job: any;                    // Current job data
  customer: any | null;        // Customer record
  property: any | null;        // Property/location
  metrics: any;                // Financial metrics
  teamAssignments: any[];      // Assigned technicians
  timeEntries: any[];          // Clock in/out records
  invoices: any[];             // All invoices
  payments: any[];             // All payments
  estimates: any[];            // All estimates
  userRole?: string;           // User's role (owner, manager, etc.)
  onTitleChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}
```

## Visual Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ [Job Title Input]                          [Cancel] [Save]      │
│ #12345  Scheduled  High Priority                               │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🤖 AI Job Assistant              [Analyzing...]             │ │
│ │ Context-aware guidance based on job data, company policy... │ │
│ │                                                             │ │
│ │ ┌───────────────────────────────────────────────────────┐   │ │
│ │ │ 🔴 Urgent: Job Overdue by 5 hours                    │   │ │
│ │ │ This job was scheduled 5h ago but no technician...   │   │ │
│ │ │ → Assign Technician                                   │   │ │
│ │ └───────────────────────────────────────────────────────┘   │ │
│ │                                                             │ │
│ │ ┌───────────────────────────────────────────────────────┐   │ │
│ │ │ 🟡 Payment Overdue: $2,450 (15 days)                 │   │ │
│ │ │ Customer has an outstanding balance 15 days past...   │   │ │
│ │ │ → Send Payment Reminder                               │   │ │
│ │ └───────────────────────────────────────────────────────┘   │ │
│ │                                                             │ │
│ │ ┌───────────────────────────────────────────────────────┐   │ │
│ │ │ 🟢 VIP Customer: $45,200 Lifetime Value              │   │ │
│ │ │ John Smith is a high-value customer...                │   │ │
│ │ │ → View Customer History                               │   │ │
│ │ └───────────────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Color Coding
- **Critical (Red)**: `bg-destructive/10 border-destructive/20 text-destructive`
- **Warning (Yellow)**: `bg-yellow-500/10 border-yellow-500/20 text-yellow-600`
- **Info (Blue)**: `bg-blue-500/10 border-blue-500/20 text-blue-600`
- **Success (Green)**: `bg-green-500/10 border-green-500/20 text-green-600`

### Icons
- Critical: `<AlertCircle />`
- Warning: `<Clock />`, `<Lightbulb />`
- Info: `<Zap />`, `<User />`
- Success: `<CheckCircle />`, `<TrendingUp />`

## Policy Examples

The AI references these company policies in its analysis:

### Scheduling & Dispatch
- Jobs overdue by 2+ hours require immediate assignment
- All scheduled jobs need team assignments 24h in advance
- Route optimization requires advance notice

### Financial Policies
- Payments 15+ days overdue: Friendly follow-up call
- Payments 30+ days overdue: Management escalation
- Payments 60+ days overdue: Collection agency referral
- Jobs >$5,000 require written estimates before work begins
- No new work for accounts 30+ days past due (manager approval required)

### Service Quality
- VIP customers (>$10,000 lifetime value) get priority service
- All completed jobs require customer review request
- Documentation required within 24h of job completion

### Time Tracking
- Technicians must clock in before starting work
- Clock out required at job completion
- Breaks must be documented for jobs >4 hours

## Performance

- **Initial Load**: ~1 second (mock analysis delay)
- **Re-analysis Triggers**: Job status, priority, customer ID, metrics, team assignments
- **Bundle Size**: ~5KB (gzipped)
- **Dependencies**: Vercel AI SDK, @ai-sdk/anthropic (future)

## Testing Checklist

- [ ] Shows critical alerts for overdue jobs
- [ ] Displays financial warnings for overdue payments
- [ ] Shows success messages for VIP customers
- [ ] Provides role-specific guidance (test each role)
- [ ] Action buttons are clickable and functional
- [ ] Loading state shows during analysis
- [ ] Re-analyzes when dependencies change
- [ ] Handles missing data gracefully
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible via keyboard and screen readers

## Future Enhancements

### Phase 1 (Current)
- ✅ Mock AI insights
- ✅ Role-based messages
- ✅ Policy enforcement
- ✅ Action buttons

### Phase 2 (Next)
- [ ] Real Anthropic integration
- [ ] Streaming AI responses
- [ ] Customizable policies per company
- [ ] User role from auth context

### Phase 3 (Future)
- [ ] Historical insight tracking
- [ ] Insight effectiveness metrics
- [ ] A/B testing for recommendations
- [ ] Voice/audio AI assistant
- [ ] Predictive insights (before issues occur)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-19
**Status**: Production Ready (Mock Data)
