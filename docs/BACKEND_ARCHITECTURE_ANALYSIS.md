# Thorbis Backend Architecture Analysis & Optimization Roadmap

**Analysis Date:** October 31, 2025  
**Platform:** Thorbis Field Service Management  
**Current Stack:** Next.js 16 + Supabase PostgreSQL + Zustand  

---

## Executive Summary

This comprehensive analysis identifies critical security vulnerabilities, performance optimization opportunities, and scalability improvements for the Thorbis backend architecture. The platform currently has **21 RLS policies implemented** covering core tables, but **20+ tables remain without RLS protection**, representing a significant security risk.

### Critical Statistics
- **Database Tables:** 42 production tables
- **RLS Coverage:** ~50% (21/42 tables with policies)
- **Server Actions:** 20 implemented
- **Security Risk Level:** **HIGH** (missing RLS on customer, equipment, inventory, communications)
- **Monitoring:** **NONE** (no APM, logging, or alerting)
- **Job Queue:** **NONE** (synchronous operations only)
- **Caching:** **MINIMAL** (Next.js default only)

---

## Table of Contents

1. [Current Architecture Assessment](#current-architecture-assessment)
2. [Critical Security Issues (P0)](#critical-security-issues-p0)
3. [RLS Policy Implementation](#rls-policy-implementation)
4. [Background Job System](#background-job-system)
5. [Caching Architecture](#caching-architecture)
6. [Migration System](#migration-system)
7. [Monitoring & Observability](#monitoring--observability)
8. [Scalability Patterns](#scalability-patterns)
9. [Data Validation & Integrity](#data-validation--integrity)
10. [Security Hardening](#security-hardening)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Current Architecture Assessment

### Database Schema Analysis

**Total Tables:** 42  
**Multi-tenant Architecture:** Yes (company_id scoping)  
**RLS Enabled:** Partial (21 core tables)  

#### Tables WITH RLS Policies (21):
✅ users, posts, chats, messages, votes, documents, suggestions, streams  
✅ companies, departments, custom_roles, team_members, company_settings  
✅ properties, jobs, estimates, invoices, purchase_orders, po_settings  
✅ price_book_items, price_history, service_packages, pricing_rules, labor_rates, supplier_integrations  

#### Tables WITHOUT RLS Policies (20+):
❌ **customers** (CRITICAL - contains PII)  
❌ **communications** (CRITICAL - contains emails, SMS, phone logs)  
❌ **email_logs** (CRITICAL - contains email content)  
❌ **payments** (CRITICAL - contains payment data)  
❌ **equipment** (customer equipment records)  
❌ **equipment_tags** (junction table)  
❌ **service_plans** (maintenance contracts)  
❌ **schedules** (appointments)  
❌ **inventory** (stock management)  
❌ **tags** (shared tags)  
❌ **customer_tags** (junction table)  
❌ **job_tags** (junction table)  
❌ **attachments** (file metadata)  
❌ **activities** (audit trail)  
❌ **contracts** (legal documents)  
❌ **verification_tokens** (auth tokens)  
❌ **price_book_categories** (shared categories)  

### Server Actions Analysis

**Total Files:** 20 server action files  
**Implementation Pattern:** ✅ Consistent (Zod validation, error handling)  
**Authentication:** ✅ Implemented via Supabase Auth  
**Authorization:** ⚠️ Relies on RLS (missing for 20+ tables)  

**Key Files:**
- `/src/actions/customers.ts` - Customer CRUD (uses RLS-missing table)
- `/src/actions/communications.ts` - Email/SMS (uses RLS-missing table)
- `/src/actions/payments.ts` - Payment processing (uses RLS-missing table)
- `/src/actions/equipment.ts` - Equipment tracking
- `/src/actions/schedules.ts` - Appointment scheduling
- `/src/actions/inventory.ts` - Inventory management

### Current Security Posture

**Authentication:** ✅ Supabase Auth (JWT tokens, email verification)  
**Authorization:** ⚠️ Partial RLS coverage (50%)  
**Input Validation:** ✅ Zod schemas in server actions  
**SQL Injection:** ✅ Supabase client (parameterized queries)  
**XSS Prevention:** ✅ React (auto-escaping)  
**CSRF Protection:** ⚠️ Not explicitly documented  
**Rate Limiting:** ❌ Not implemented  
**Secrets Management:** ⚠️ Environment variables (no rotation)  

---

## Critical Security Issues (P0)

### Issue #1: Missing RLS on Customer Data Tables

**Severity:** 🔴 **CRITICAL**  
**Impact:** Multi-tenant data leakage, unauthorized access to customer PII  
**Affected Tables:** `customers`, `communications`, `email_logs`, `payments`  

**Risk Scenario:**
```typescript
// Current: NO RLS on customers table
const { data } = await supabase.from("customers").select("*");
// ⚠️ Returns ALL customers from ALL companies (if RLS not enabled)
// GDPR/CCPA violation, competitive intelligence leak
```

**Resolution:** Implement comprehensive RLS policies (see Section 3).

---

### Issue #2: No Audit Logging

**Severity:** 🟠 **HIGH**  
**Impact:** Cannot track data modifications, compliance violations  
**Affected Areas:** All CRUD operations  

**Current State:** No audit trail for:
- Customer data modifications
- Payment transactions
- Job status changes
- Price book updates
- User permission changes

**Resolution:** Implement audit logging system (see Section 7).

---

### Issue #3: No Rate Limiting

**Severity:** 🟠 **HIGH**  
**Impact:** DDoS vulnerability, resource exhaustion, abuse  
**Affected Areas:** All API endpoints, Server Actions  

**Current State:**
- No per-user rate limits
- No per-IP rate limits
- No endpoint-specific throttling
- Vulnerable to automated scraping/abuse

**Resolution:** Implement multi-layer rate limiting (see Section 10).

---

### Issue #4: Synchronous Long-Running Operations

**Severity:** 🟡 **MEDIUM**  
**Impact:** Poor UX, timeout errors, resource blocking  
**Affected Operations:**
- Email sending (should be async)
- SMS sending (should be async)
- Invoice generation (can be slow)
- Report generation (CPU intensive)
- Data export (large datasets)

**Current Pattern:**
```typescript
// ❌ BAD: Synchronous email sending
export async function sendEstimate(estimateId: string) {
  const estimate = await fetchEstimate(estimateId);
  await sendEmail(estimate); // Blocks for 2-5 seconds
  return { success: true };
}
```

**Resolution:** Implement background job queue (see Section 4).

---

## RLS Policy Implementation

### Comprehensive RLS Migration

**File:** `/supabase/migrations/20250131000010_rls_complete.sql`

#### Tables Requiring RLS Policies

**Priority P0 (Security Critical):**
1. `customers` - Customer PII data
2. `communications` - Email/SMS content
3. `email_logs` - Email history
4. `payments` - Financial transactions
5. `verification_tokens` - Auth tokens

**Priority P1 (Business Critical):**
6. `equipment` - Customer assets
7. `service_plans` - Maintenance contracts
8. `schedules` - Appointments
9. `attachments` - File metadata
10. `contracts` - Legal documents

**Priority P2 (Operational):**
11. `inventory` - Stock levels
12. `tags` - Shared tags
13. `customer_tags` - Junction table
14. `job_tags` - Junction table
15. `equipment_tags` - Junction table
16. `price_book_categories` - Shared categories
17. `activities` - Audit trail

#### RLS Policy Patterns

**Pattern 1: Company Member Access (Most Common)**
```sql
-- Company members can read records in their company
CREATE POLICY "Company members can read customers"
  ON customers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = customers.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Company members can create records in their company
CREATE POLICY "Company members can create customers"
  ON customers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Company members can update records in their company
CREATE POLICY "Company members can update customers"
  ON customers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = customers.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Only company owners can delete records
CREATE POLICY "Company owners can delete customers"
  ON customers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = customers.company_id
      AND companies.owner_id = auth.uid()
    )
  );
```

**Pattern 2: Owner-Only Management**
```sql
-- Only company owners can manage sensitive settings
CREATE POLICY "Company owners can manage labor rates"
  ON labor_rates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = labor_rates.company_id
      AND companies.owner_id = auth.uid()
    )
  );
```

**Pattern 3: Role-Based Access (Advanced)**
```sql
-- Technicians can only read/update assigned jobs
CREATE POLICY "Technicians can access assigned jobs"
  ON jobs
  FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM team_members tm
      JOIN custom_roles cr ON tm.role_id = cr.id
      WHERE tm.company_id = jobs.company_id
      AND tm.user_id = auth.uid()
      AND cr.permissions->>'jobs_view_all' = 'true'
    )
  );
```

**Pattern 4: Soft Delete Support**
```sql
-- Exclude soft-deleted records by default
CREATE POLICY "Company members see non-deleted customers"
  ON customers
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = customers.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );
```

#### Service Role Bypass

**For Server-Side Operations:**
```typescript
// Use service role client for admin operations
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Bypasses RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Use carefully - only for system operations
const { data } = await supabaseAdmin
  .from("customers")
  .select("*")
  .eq("company_id", companyId);
```

#### Performance Optimization for RLS

**1. Add Indexes for RLS Joins:**
```sql
-- Optimize RLS policy lookups
CREATE INDEX idx_team_members_user_company 
  ON team_members(user_id, company_id, status) 
  WHERE status = 'active';

CREATE INDEX idx_team_members_company_user 
  ON team_members(company_id, user_id, status) 
  WHERE status = 'active';

CREATE INDEX idx_companies_owner 
  ON companies(owner_id);
```

**2. Use auth.uid() Function Efficiently:**
```sql
-- Cache auth.uid() in policy for multiple checks
CREATE POLICY "Company members can read customers"
  ON customers
  FOR SELECT
  USING (
    -- Pattern: Single EXISTS vs multiple auth.uid() calls
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = customers.company_id
      AND team_members.user_id = auth.uid() -- Called once
      AND team_members.status = 'active'
    )
  );
```

**3. Partial Indexes for Soft Deletes:**
```sql
-- Index excludes deleted records
CREATE INDEX idx_customers_active 
  ON customers(company_id, status) 
  WHERE deleted_at IS NULL;
```

#### Testing RLS Policies

**Test Script:** `/scripts/test-rls-policies.ts`
```typescript
import { createClient } from "@/lib/supabase/server";

export async function testRLSPolicies() {
  const supabase = await createClient();
  
  // Test 1: User can only see their company's data
  const { data: customers } = await supabase
    .from("customers")
    .select("company_id");
  
  const uniqueCompanies = new Set(customers?.map(c => c.company_id));
  console.assert(uniqueCompanies.size === 1, "User sees multiple companies");
  
  // Test 2: User cannot access other company's data
  const { data: otherCompany, error } = await supabase
    .from("customers")
    .select("*")
    .eq("company_id", "fake-company-id");
  
  console.assert(otherCompany?.length === 0, "RLS leak detected");
  
  // Test 3: Soft deletes are hidden
  const { data: deleted } = await supabase
    .from("customers")
    .select("*")
    .not("deleted_at", "is", null);
  
  console.assert(deleted?.length === 0, "Soft deletes visible");
}
```

---

## Background Job System

### Architecture Options

#### Option 1: Supabase pg_cron (Recommended for Simple Jobs)

**Pros:**
- Built into Supabase PostgreSQL
- No external dependencies
- Free (included in Supabase Pro)
- Perfect for scheduled tasks

**Cons:**
- Limited to scheduled jobs (not event-driven)
- No built-in retry logic
- No web UI for management
- Limited to SQL functions

**Use Cases:**
- Daily report generation
- Weekly data cleanup
- Monthly billing runs
- Hourly metric aggregation

**Setup:**
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily customer report
SELECT cron.schedule(
  'daily-customer-report',
  '0 8 * * *', -- Every day at 8 AM
  $$
  SELECT generate_customer_report(company_id)
  FROM companies
  WHERE status = 'active';
  $$
);

-- Schedule hourly invoice reminders
SELECT cron.schedule(
  'hourly-invoice-reminders',
  '0 * * * *', -- Every hour
  $$
  SELECT send_invoice_reminder(id)
  FROM invoices
  WHERE status = 'sent'
  AND due_date < NOW()
  AND last_reminder_sent < NOW() - INTERVAL '24 hours';
  $$
);
```

---

#### Option 2: Supabase Edge Functions + pg_cron (Recommended for Most Jobs)

**Pros:**
- TypeScript/JavaScript (familiar)
- Can call external APIs
- Event-driven triggers
- Retry logic in application code
- Better error handling

**Cons:**
- Additional complexity
- Edge function cold starts
- Requires deployment pipeline

**Use Cases:**
- Email sending (with retry)
- SMS sending
- Webhook delivery
- External API integrations
- Complex business logic

**Architecture:**
```
Trigger → pg_cron OR Database Trigger → Edge Function → Job Processing
```

**Setup:**

**1. Create Job Queue Table:**
```sql
CREATE TABLE job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 0,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_queue_pending 
  ON job_queue(status, priority DESC, scheduled_at ASC) 
  WHERE status = 'pending' AND scheduled_at <= NOW();

CREATE INDEX idx_job_queue_company 
  ON job_queue(company_id, status);
```

**2. Edge Function - Job Processor:**
```typescript
// supabase/functions/job-processor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    // Fetch pending jobs
    const { data: jobs } = await supabase
      .from("job_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .order("priority", { ascending: false })
      .order("scheduled_at", { ascending: true })
      .limit(10);

    const results = [];
    for (const job of jobs || []) {
      try {
        // Mark as processing
        await supabase
          .from("job_queue")
          .update({ status: "processing", started_at: new Date().toISOString() })
          .eq("id", job.id);

        // Process job based on type
        await processJob(job);

        // Mark as completed
        await supabase
          .from("job_queue")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", job.id);

        results.push({ id: job.id, status: "completed" });
      } catch (error) {
        // Handle failure with retry
        const retryCount = job.retry_count + 1;
        if (retryCount < job.max_retries) {
          // Exponential backoff: 1min, 5min, 15min
          const delayMinutes = Math.pow(5, retryCount - 1);
          const nextRetry = new Date(Date.now() + delayMinutes * 60 * 1000);

          await supabase
            .from("job_queue")
            .update({
              status: "pending",
              retry_count: retryCount,
              scheduled_at: nextRetry.toISOString(),
              error_message: error.message,
            })
            .eq("id", job.id);
        } else {
          // Max retries reached
          await supabase
            .from("job_queue")
            .update({
              status: "failed",
              failed_at: new Date().toISOString(),
              error_message: error.message,
            })
            .eq("id", job.id);
        }

        results.push({ id: job.id, status: "failed", error: error.message });
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function processJob(job: any) {
  switch (job.job_type) {
    case "send_email":
      return await sendEmail(job.payload);
    case "send_sms":
      return await sendSMS(job.payload);
    case "generate_invoice_pdf":
      return await generateInvoicePDF(job.payload);
    case "webhook_delivery":
      return await deliverWebhook(job.payload);
    default:
      throw new Error(`Unknown job type: ${job.job_type}`);
  }
}
```

**3. Schedule Edge Function with pg_cron:**
```sql
-- Run job processor every minute
SELECT cron.schedule(
  'job-processor',
  '* * * * *', -- Every minute
  $$
  SELECT extensions.http((
    'POST',
    'https://YOUR_PROJECT_REF.supabase.co/functions/v1/job-processor',
    ARRAY[extensions.http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))],
    'application/json',
    '{}'
  )::extensions.http_request);
  $$
);
```

**4. Queue Jobs from Server Actions:**
```typescript
// src/actions/communications.ts
export async function sendEstimateEmail(estimateId: string) {
  const supabase = await createClient();
  
  // Queue the email job instead of sending synchronously
  const { error } = await supabase.from("job_queue").insert({
    company_id: companyId,
    job_type: "send_email",
    payload: {
      template: "estimate",
      estimate_id: estimateId,
      to: customer.email,
    },
    priority: 1, // Higher priority for transactional emails
  });

  if (error) throw error;
  
  return { success: true, message: "Email queued for delivery" };
}
```

---

#### Option 3: External Queue (BullMQ + Redis) - For High Volume

**Pros:**
- Industry standard
- Advanced features (priority, rate limiting, concurrency)
- Excellent monitoring (Bull Board UI)
- Horizontal scaling
- Better performance for high volume

**Cons:**
- Additional infrastructure (Redis)
- Higher cost (~$10-30/month for Redis)
- More complex setup

**When to Use:**
- Processing >1000 jobs/hour
- Need advanced scheduling (cron, delayed jobs)
- Require strict concurrency control
- Need detailed job monitoring

**Setup:**
```typescript
// lib/queue/queue-setup.ts
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL!);

export const emailQueue = new Queue("email", { connection });
export const smsQueue = new Queue("sms", { connection });
export const reportQueue = new Queue("reports", { connection });

// Worker - runs in separate process/container
const emailWorker = new Worker(
  "email",
  async (job) => {
    await sendEmail(job.data);
  },
  { connection }
);
```

**Cost Estimate:**
- Upstash Redis (serverless): $10/month
- Railway Redis: $20/month
- Heroku Redis: $30/month

---

### Recommended Job Types

#### Immediate Processing (Edge Functions)
- ✅ Email sending (1-2s)
- ✅ SMS sending (1-2s)
- ✅ Webhook delivery (1-3s)
- ✅ Invoice PDF generation (5-10s)

#### Scheduled Processing (pg_cron)
- ✅ Daily customer reports
- ✅ Weekly performance metrics
- ✅ Monthly billing runs
- ✅ Hourly invoice reminders
- ✅ Data cleanup/archival

#### Background Processing (Job Queue)
- ✅ Batch email sending
- ✅ Data import/export
- ✅ Large report generation
- ✅ Bulk operations (price updates, inventory sync)
- ✅ External API synchronization

---

## Caching Architecture

### Multi-Layer Caching Strategy

**Current State:** ❌ No dedicated caching (Next.js default only)  
**Target State:** ✅ 3-layer caching (Application, Redis, Database)  

---

### Layer 1: Next.js Application Cache

**Purpose:** Reduce redundant server work  
**TTL:** 5-60 seconds  
**Implementation:** Built-in Next.js caching  

**1. Static Page Caching (ISR):**
```typescript
// app/dashboard/reports/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

export default async function ReportsPage() {
  // Static page, regenerated every 5 minutes
  const reports = await fetchReports();
  return <ReportsList reports={reports} />;
}
```

**2. React Server Component Caching:**
```typescript
// components/dashboard/kpi-cards.tsx
import { unstable_cache } from "next/cache";

const getCachedKPIs = unstable_cache(
  async (companyId: string) => {
    return await fetchKPIs(companyId);
  },
  ["kpis"], // Cache key
  { revalidate: 60, tags: ["kpis"] } // 60 second TTL
);

export async function KPICards({ companyId }: Props) {
  const kpis = await getCachedKPIs(companyId);
  return <div>{/* Render KPIs */}</div>;
}
```

**3. Server Action Response Caching:**
```typescript
// actions/customers.ts
import { unstable_cache } from "next/cache";

export const getCustomers = unstable_cache(
  async (companyId: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", companyId);
    return data;
  },
  ["customers"],
  { revalidate: 30, tags: ["customers"] }
);
```

**4. Manual Cache Invalidation:**
```typescript
import { revalidateTag, revalidatePath } from "next/cache";

export async function createCustomer(data: CustomerData) {
  const supabase = await createClient();
  await supabase.from("customers").insert(data);
  
  // Invalidate customer cache
  revalidateTag("customers");
  revalidatePath("/dashboard/customers");
  
  return { success: true };
}
```

---

### Layer 2: Redis Cache (Recommended)

**Purpose:** Share cache across server instances, persistent sessions  
**TTL:** 5 minutes - 24 hours  
**Cost:** ~$10-30/month  

**Provider Options:**
1. **Upstash Redis** (Recommended for Next.js)
   - Serverless, pay-per-request
   - Free tier: 10K commands/day
   - Paid: $10/month for 100K commands/day
   - Native edge support

2. **Vercel KV** (If hosting on Vercel)
   - Built-in integration
   - Same pricing as Upstash
   - Zero config

3. **Railway Redis**
   - Traditional Redis instance
   - $20/month for 1GB
   - More control

**Setup:**

**1. Install Upstash Redis:**
```bash
pnpm add @upstash/redis
```

**2. Configure Redis Client:**
```typescript
// lib/cache/redis.ts
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv(); // Uses UPSTASH_REDIS_REST_URL

// Type-safe cache helpers
export async function getCached<T>(key: string): Promise<T | null> {
  return await redis.get<T>(key);
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300
): Promise<void> {
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

**3. Cache Price Book Data:**
```typescript
// lib/cache/pricebook-cache.ts
import { getCached, setCached } from "./redis";

export async function getCachedPriceBook(companyId: string) {
  const key = `pricebook:${companyId}`;
  
  // Try cache first
  let priceBook = await getCached<PriceBookItem[]>(key);
  
  if (!priceBook) {
    // Cache miss - fetch from database
    const supabase = await createClient();
    const { data } = await supabase
      .from("price_book_items")
      .select("*")
      .eq("company_id", companyId)
      .eq("is_active", true);
    
    priceBook = data || [];
    
    // Cache for 1 hour
    await setCached(key, priceBook, 3600);
  }
  
  return priceBook;
}

export async function invalidatePriceBookCache(companyId: string) {
  await redis.del(`pricebook:${companyId}`);
}
```

**4. Cache User Sessions:**
```typescript
// lib/cache/session-cache.ts
import { getCached, setCached } from "./redis";

export async function getCachedSession(userId: string) {
  const key = `session:${userId}`;
  return await getCached<UserSession>(key);
}

export async function setCachedSession(userId: string, session: UserSession) {
  const key = `session:${userId}`;
  await setCached(key, session, 3600); // 1 hour TTL
}
```

**5. Cache Company Settings:**
```typescript
// lib/cache/company-cache.ts
export async function getCachedCompanySettings(companyId: string) {
  const key = `company_settings:${companyId}`;
  
  let settings = await getCached<CompanySettings>(key);
  
  if (!settings) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("company_settings")
      .select("*")
      .eq("company_id", companyId)
      .single();
    
    settings = data;
    
    // Cache for 24 hours (rarely changes)
    await setCached(key, settings, 86400);
  }
  
  return settings;
}
```

---

### Layer 3: Database Query Caching

**Purpose:** Optimize repeated database queries  
**TTL:** N/A (query planner optimization)  

**1. Materialized Views for Reports:**
```sql
-- Create materialized view for dashboard KPIs
CREATE MATERIALIZED VIEW company_kpis AS
SELECT
  c.id AS company_id,
  COUNT(DISTINCT cu.id) AS total_customers,
  COUNT(DISTINCT j.id) AS total_jobs,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'scheduled') AS scheduled_jobs,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'in_progress') AS active_jobs,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'completed') AS completed_jobs,
  SUM(i.total_amount) AS total_revenue,
  SUM(i.total_amount) FILTER (WHERE i.status = 'paid') AS collected_revenue,
  SUM(i.total_amount) FILTER (WHERE i.status IN ('sent', 'overdue')) AS outstanding_revenue
FROM companies c
LEFT JOIN customers cu ON cu.company_id = c.id AND cu.deleted_at IS NULL
LEFT JOIN jobs j ON j.company_id = c.id
LEFT JOIN invoices i ON i.company_id = c.id
GROUP BY c.id;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_company_kpis_company_id ON company_kpis(company_id);

-- Refresh materialized view (run via pg_cron every 5 minutes)
SELECT cron.schedule(
  'refresh-kpis',
  '*/5 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY company_kpis;'
);
```

**2. Prepared Statements (Automatic in Supabase):**
```typescript
// Supabase automatically uses prepared statements
const { data } = await supabase
  .from("customers")
  .select("*")
  .eq("company_id", companyId); // Parameterized query
```

**3. Connection Pooling:**
```sql
-- Enable Supabase Pooler in supabase/config.toml
[db.pooler]
enabled = true
pool_mode = "transaction" # Faster than "session"
default_pool_size = 20
max_client_conn = 100
```

---

### What to Cache (Priority Order)

**P0 - Cache Always:**
1. ✅ Price book items (TTL: 1 hour)
2. ✅ Company settings (TTL: 24 hours)
3. ✅ User permissions/roles (TTL: 15 minutes)
4. ✅ Labor rates (TTL: 1 hour)
5. ✅ Service packages (TTL: 1 hour)

**P1 - Cache Often:**
6. ✅ Customer list (TTL: 5 minutes)
7. ✅ Equipment list (TTL: 10 minutes)
8. ✅ Tags (TTL: 1 hour)
9. ✅ Inventory items (TTL: 5 minutes)
10. ✅ Team members (TTL: 15 minutes)

**P2 - Cache Selectively:**
11. ✅ Dashboard KPIs (TTL: 5 minutes, via materialized view)
12. ✅ Job statistics (TTL: 5 minutes)
13. ✅ Invoice statistics (TTL: 10 minutes)
14. ✅ Reports (TTL: 1 hour)

**❌ Never Cache:**
- Real-time data (schedule, job status)
- Financial transactions (payments)
- Sensitive audit logs
- Auth tokens

---

### Cache Invalidation Strategy

**1. Time-Based (Passive):**
```typescript
// Automatically expires after TTL
await setCached(key, data, 300); // 5 minutes
```

**2. Event-Based (Active):**
```typescript
// Invalidate on mutation
export async function updatePriceBookItem(id: string, data: any) {
  const supabase = await createClient();
  
  // Update database
  await supabase.from("price_book_items").update(data).eq("id", id);
  
  // Invalidate cache
  const { data: item } = await supabase
    .from("price_book_items")
    .select("company_id")
    .eq("id", id)
    .single();
  
  await redis.del(`pricebook:${item.company_id}`);
  revalidateTag("pricebook");
}
```

**3. Wildcard Invalidation:**
```typescript
// Invalidate all customer caches
await redis.del("customers:*");
```

---

### Monitoring Cache Performance

**Redis Metrics:**
```typescript
// lib/cache/metrics.ts
export async function getCacheStats() {
  const info = await redis.info();
  return {
    hitRate: parseFloat(info.match(/keyspace_hits:(\d+)/)?.[1] || "0"),
    missRate: parseFloat(info.match(/keyspace_misses:(\d+)/)?.[1] || "0"),
    memory: parseFloat(info.match(/used_memory:(\d+)/)?.[1] || "0"),
    connections: parseFloat(info.match(/connected_clients:(\d+)/)?.[1] || "0"),
  };
}
```

---

## Migration System

### Current State Assessment

**Migration Tool:** Drizzle ORM + Supabase Migrations  
**Migration Files:** `/supabase/migrations/` (28 files)  
**Tracking:** ✅ Supabase tracks migrations via `supabase_migrations` table  

**Issues:**
1. ❌ No rollback support documented
2. ⚠️ No migration naming convention enforced
3. ⚠️ No migration dependencies documented
4. ⚠️ No data migration testing framework

---

### Recommended Migration Workflow

**1. Migration Naming Convention:**
```
Format: YYYYMMDDHHMMSS_descriptive_name.sql
Example: 20250131153000_add_customer_loyalty_program.sql

Prefixes:
- DDL: create_table_, alter_table_, drop_table_
- DML: add_data_, update_data_, remove_data_
- RLS: rls_, enable_rls_
- Index: idx_, create_index_
- Trigger: trg_, create_trigger_
```

**2. Migration Template:**
```sql
-- ============================================================================
-- Migration: YYYYMMDDHHMMSS_description
-- Description: What this migration does
-- Author: Name
-- Date: YYYY-MM-DD
-- Dependencies: List of required migrations
-- Rollback: Instructions for manual rollback
-- ============================================================================

-- Forward Migration
BEGIN;

-- Add your schema changes here
ALTER TABLE customers ADD COLUMN loyalty_points INTEGER DEFAULT 0;

-- Add indexes
CREATE INDEX idx_customers_loyalty_points ON customers(loyalty_points);

-- Update RLS policies if needed
-- ...

COMMIT;

-- Rollback Instructions (manual)
-- ALTER TABLE customers DROP COLUMN loyalty_points;
-- DROP INDEX idx_customers_loyalty_points;
```

**3. Safe Migration Practices:**

**✅ DO:**
```sql
-- Add nullable column first
ALTER TABLE customers ADD COLUMN loyalty_tier TEXT;

-- Backfill data in separate migration
UPDATE customers SET loyalty_tier = 'bronze' WHERE loyalty_tier IS NULL;

-- Add NOT NULL constraint after backfill
ALTER TABLE customers ALTER COLUMN loyalty_tier SET NOT NULL;
```

**❌ DON'T:**
```sql
-- Don't add NOT NULL column in one step (will fail if table has data)
ALTER TABLE customers ADD COLUMN loyalty_tier TEXT NOT NULL DEFAULT 'bronze';
```

**4. Zero-Downtime Migrations:**

**Pattern: Add Column**
```sql
-- Step 1: Add nullable column
ALTER TABLE customers ADD COLUMN new_field TEXT;

-- Step 2: Deploy code that writes to both old and new fields
-- (Application deployment)

-- Step 3: Backfill existing data
UPDATE customers SET new_field = old_field WHERE new_field IS NULL;

-- Step 4: Add NOT NULL constraint
ALTER TABLE customers ALTER COLUMN new_field SET NOT NULL;

-- Step 5: Deploy code that only uses new field
-- (Application deployment)

-- Step 6: Drop old column (optional)
ALTER TABLE customers DROP COLUMN old_field;
```

**Pattern: Rename Column**
```sql
-- Step 1: Add new column
ALTER TABLE customers ADD COLUMN email_address TEXT;

-- Step 2: Copy data
UPDATE customers SET email_address = email;

-- Step 3: Deploy code that reads from both columns
-- (Application deployment)

-- Step 4: Deploy code that writes to new column
-- (Application deployment)

-- Step 5: Drop old column
ALTER TABLE customers DROP COLUMN email;
```

**5. Data Migration Testing:**

**Test Script:** `/scripts/test-migrations.ts`
```typescript
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function testMigration(migrationFile: string) {
  try {
    console.log(`Testing migration: ${migrationFile}`);
    
    // 1. Create test database
    await execAsync("supabase db reset --db-url postgres://test_db");
    
    // 2. Run migrations up to target
    await execAsync(`supabase db push --db-url postgres://test_db`);
    
    // 3. Verify schema
    const { stdout } = await execAsync(
      "supabase db diff --db-url postgres://test_db"
    );
    
    if (stdout.trim() !== "") {
      throw new Error(`Schema mismatch: ${stdout}`);
    }
    
    // 4. Seed test data
    await execAsync(
      "psql postgres://test_db < supabase/seeds/test_data.sql"
    );
    
    // 5. Run queries to verify RLS policies
    // ... (custom verification logic)
    
    console.log("✅ Migration test passed");
  } catch (error) {
    console.error("❌ Migration test failed:", error);
    throw error;
  }
}
```

**6. Migration Rollback Strategy:**

**Manual Rollback (Supabase Doesn't Support Auto-Rollback):**
```bash
# 1. Identify last good migration
supabase db remote get

# 2. Create rollback migration
cat > supabase/migrations/20250131160000_rollback_loyalty_program.sql << EOF
-- Rollback: Remove loyalty_points column
ALTER TABLE customers DROP COLUMN loyalty_points;
DROP INDEX idx_customers_loyalty_points;
EOF

# 3. Apply rollback
supabase db push
```

**7. Migration CI/CD Integration:**

```yaml
# .github/workflows/test-migrations.yml
name: Test Database Migrations

on:
  pull_request:
    paths:
      - "supabase/migrations/**"

jobs:
  test-migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        
      - name: Start local Supabase
        run: supabase start
        
      - name: Run migrations
        run: supabase db push
        
      - name: Verify schema
        run: supabase db diff
        
      - name: Run RLS tests
        run: npm run test:rls
```

---

### Seed Data Management

**1. Separate Seed Files by Purpose:**
```
/supabase/seeds/
  01_system_roles.sql          # System data (never changes)
  02_demo_company.sql           # Demo data (optional)
  03_price_book_categories.sql  # Shared categories
  04_test_customers.sql         # Test data (dev only)
```

**2. Idempotent Seeds:**
```sql
-- Use INSERT ... ON CONFLICT for idempotency
INSERT INTO custom_roles (id, company_id, name, permissions, is_system)
VALUES 
  ('owner-role-id', 'company-id', 'Owner', '{"all": true}', true),
  ('admin-role-id', 'company-id', 'Admin', '{"manage_team": true}', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();
```

**3. Environment-Specific Seeds:**
```typescript
// scripts/seed.ts
import { exec } from "child_process";

const env = process.env.NODE_ENV;

if (env === "development") {
  // Run all seeds including test data
  exec("psql $DATABASE_URL < supabase/seeds/*.sql");
} else if (env === "production") {
  // Only run system seeds
  exec("psql $DATABASE_URL < supabase/seeds/01_system_roles.sql");
}
```

---

## Monitoring & Observability

### Current State

**Monitoring:** ❌ None  
**Logging:** ⚠️ Console logs only  
**Error Tracking:** ❌ None  
**Performance Monitoring:** ❌ None  

---

### Recommended Stack

#### Option 1: Sentry (Recommended)

**Purpose:** Error tracking, performance monitoring  
**Cost:** Free tier (5K errors/month), Pro $26/month  

**Features:**
- ✅ Error tracking with stack traces
- ✅ User context (who experienced error)
- ✅ Performance monitoring (slow queries)
- ✅ Release tracking
- ✅ Slack/email alerts

**Setup:**
```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% of transactions
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

**Usage in Server Actions:**
```typescript
// actions/customers.ts
import * as Sentry from "@sentry/nextjs";

export async function createCustomer(data: CustomerData) {
  try {
    const customer = await supabase.from("customers").insert(data);
    return { success: true, data: customer };
  } catch (error) {
    // Send error to Sentry
    Sentry.captureException(error, {
      tags: { action: "createCustomer" },
      user: { id: userId, company_id: companyId },
      extra: { data },
    });
    
    throw error;
  }
}
```

---

#### Option 2: Axiom (Recommended for Logs)

**Purpose:** Log aggregation, analytics  
**Cost:** Free tier (500MB/month), Pro $25/month  

**Features:**
- ✅ Structured logging
- ✅ Fast queries (billions of events)
- ✅ Next.js integration
- ✅ Custom dashboards

**Setup:**
```bash
pnpm add @axiomhq/js next-axiom
```

```typescript
// next.config.js
const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
  // ... your config
});
```

**Usage:**
```typescript
// app/api/customers/route.ts
import { log } from "next-axiom";

export async function POST(request: Request) {
  log.info("Creating customer", {
    company_id: companyId,
    user_id: userId,
  });
  
  const customer = await createCustomer(data);
  
  log.info("Customer created", {
    customer_id: customer.id,
    company_id: companyId,
  });
  
  return Response.json(customer);
}
```

---

#### Option 3: Supabase Logs (Built-in)

**Purpose:** Database query logs, API logs  
**Cost:** Included in Supabase Pro ($25/month)  

**Access:**
```bash
# View API logs
supabase logs api --limit 100

# View Postgres logs
supabase logs postgres --limit 100

# View slow queries
supabase logs postgres --filter="duration > 1000"
```

---

### Database Performance Monitoring

**1. Enable pg_stat_statements:**
```sql
-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT
  query,
  calls,
  total_exec_time / 1000 AS total_seconds,
  mean_exec_time / 1000 AS mean_seconds,
  max_exec_time / 1000 AS max_seconds
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_exec_time DESC
LIMIT 20;
```

**2. Monitor Connection Pool:**
```sql
-- View active connections
SELECT 
  datname,
  count(*) AS connections,
  max_conn,
  max_conn - count(*) AS available
FROM pg_stat_activity
JOIN pg_database ON pg_database.oid = pg_stat_activity.datid
CROSS JOIN (SELECT setting::int AS max_conn FROM pg_settings WHERE name = 'max_connections') mc
GROUP BY datname, max_conn;
```

**3. Monitor Table Bloat:**
```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

### Application Metrics

**Create Metrics Dashboard:**
```typescript
// lib/metrics/business-metrics.ts
import { redis } from "@/lib/cache/redis";

export async function trackJobCreated(companyId: string) {
  const key = `metrics:${companyId}:jobs_created`;
  await redis.incr(key);
  await redis.expire(key, 86400); // 24 hours
}

export async function trackInvoiceSent(companyId: string, amount: number) {
  const key = `metrics:${companyId}:invoices_sent`;
  await redis.hincrby(key, "count", 1);
  await redis.hincrby(key, "amount", amount);
  await redis.expire(key, 86400);
}

export async function getMetrics(companyId: string) {
  const [jobsCreated, invoicesData] = await Promise.all([
    redis.get(`metrics:${companyId}:jobs_created`),
    redis.hgetall(`metrics:${companyId}:invoices_sent`),
  ]);
  
  return {
    jobs_created_today: jobsCreated || 0,
    invoices_sent_today: invoicesData?.count || 0,
    revenue_sent_today: invoicesData?.amount || 0,
  };
}
```

---

### Alerting

**1. Set Up Sentry Alerts:**
```yaml
# Sentry Alert Rules
- name: "High Error Rate"
  condition: "error_count > 50 in 5 minutes"
  actions:
    - type: "slack"
      channel: "#alerts"
    - type: "email"
      emails: ["team@thorbis.com"]

- name: "Slow Database Queries"
  condition: "transaction_duration > 5000ms"
  actions:
    - type: "slack"
      channel: "#performance"
```

**2. Set Up Supabase Alerts (via pg_cron):**
```sql
-- Alert on high connection count
SELECT cron.schedule(
  'check-connections',
  '*/5 * * * *',
  $$
  DO $$
  DECLARE
    conn_count INTEGER;
  BEGIN
    SELECT count(*) INTO conn_count FROM pg_stat_activity;
    IF conn_count > 80 THEN
      -- Send alert (via webhook or email function)
      PERFORM send_alert('High connection count: ' || conn_count);
    END IF;
  END $$;
  $$
);
```

---

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { redis } from "@/lib/cache/redis";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    services: {
      database: "unknown",
      redis: "unknown",
    },
  };

  try {
    // Check database
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    
    checks.services.database = dbError ? "unhealthy" : "healthy";
  } catch (error) {
    checks.services.database = "unhealthy";
    checks.status = "degraded";
  }

  try {
    // Check Redis
    await redis.ping();
    checks.services.redis = "healthy";
  } catch (error) {
    checks.services.redis = "unhealthy";
    checks.status = "degraded";
  }

  const httpStatus = checks.status === "healthy" ? 200 : 503;
  return Response.json(checks, { status: httpStatus });
}
```

---

## Scalability Patterns

### Connection Pooling

**1. Enable Supabase Pooler:**
```toml
# supabase/config.toml
[db.pooler]
enabled = true
port = 54329
pool_mode = "transaction"  # Faster than "session"
default_pool_size = 20     # Per user/database
max_client_conn = 100      # Total connections
```

**2. Use Pooled Connection String:**
```typescript
// .env.local
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
POOLED_DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres?pgbouncer=true"
```

**3. Use Correct Connection String:**
```typescript
// For long-running operations (migrations, seeds)
const directClient = createClient(process.env.DATABASE_URL);

// For API requests (short transactions)
const pooledClient = createClient(process.env.POOLED_DATABASE_URL);
```

---

### Read Replicas (Enterprise)

**When to Consider:**
- Read:Write ratio > 10:1
- Expensive read queries (reports)
- High concurrent users (>1000)

**Setup:**
```typescript
// lib/supabase/read-replica.ts
const readReplica = createClient(
  process.env.SUPABASE_READ_REPLICA_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Use read replica for reports
export async function fetchReportData(companyId: string) {
  const { data } = await readReplica
    .from("jobs")
    .select("*")
    .eq("company_id", companyId);
  
  return data;
}
```

---

### Horizontal Scaling

**1. Stateless Server Actions:**
```typescript
// ✅ GOOD: Stateless (scales horizontally)
export async function getCustomers(companyId: string) {
  const supabase = await createClient(); // Per-request client
  return await supabase.from("customers").select("*");
}

// ❌ BAD: Stateful (doesn't scale)
let globalCache = {}; // Shared state across requests
export async function getCustomers(companyId: string) {
  if (globalCache[companyId]) return globalCache[companyId];
  // ...
}
```

**2. Offload Heavy Work to Background Jobs:**
```typescript
// ✅ GOOD: Queue heavy work
export async function generateAnnualReport(companyId: string) {
  await queueJob({
    type: "generate_report",
    company_id: companyId,
  });
  return { message: "Report generation started" };
}

// ❌ BAD: Synchronous heavy work
export async function generateAnnualReport(companyId: string) {
  const report = await computeReport(companyId); // 30+ seconds
  return report;
}
```

---

### File Upload Handling

**1. Direct Upload to Supabase Storage:**
```typescript
// ✅ GOOD: Direct upload (doesn't go through server)
export async function getUploadUrl(fileName: string) {
  const supabase = await createClient();
  
  // Generate presigned URL
  const { data } = await supabase.storage
    .from("attachments")
    .createSignedUploadUrl(`${companyId}/${fileName}`);
  
  return data?.signedUrl; // Client uploads directly
}

// ❌ BAD: Upload through server (memory intensive)
export async function uploadFile(file: File) {
  const buffer = await file.arrayBuffer(); // Loads entire file in memory
  await supabase.storage.from("attachments").upload(fileName, buffer);
}
```

**2. Configure Storage Buckets:**
```sql
-- supabase/migrations/storage_buckets.sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('attachments', 'attachments', false, 52428800, ARRAY['image/*', 'application/pdf']),
  ('invoices', 'invoices', false, 10485760, ARRAY['application/pdf']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/*']);

-- RLS for attachments bucket
CREATE POLICY "Company members can upload attachments"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'attachments'
    AND (storage.foldername(name))[1]::uuid IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Company members can read attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND (storage.foldername(name))[1]::uuid IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );
```

---

### Archive/Purge Strategy

**1. Soft Delete Pattern:**
```sql
-- Add deleted_at to all tables (already exists in customers)
ALTER TABLE jobs ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN deleted_by UUID REFERENCES users(id);

-- Create index for non-deleted records
CREATE INDEX idx_jobs_active ON jobs(company_id) WHERE deleted_at IS NULL;

-- RLS policy excludes soft-deleted
CREATE POLICY "Company members see non-deleted jobs"
  ON jobs
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid())
  );
```

**2. Archive Old Data:**
```sql
-- Create archive table
CREATE TABLE jobs_archive (LIKE jobs INCLUDING ALL);

-- Move old completed jobs to archive (run monthly)
INSERT INTO jobs_archive
SELECT * FROM jobs
WHERE status = 'completed'
AND completed_at < NOW() - INTERVAL '1 year';

DELETE FROM jobs
WHERE status = 'completed'
AND completed_at < NOW() - INTERVAL '1 year';

-- Vacuum to reclaim space
VACUUM ANALYZE jobs;
```

**3. Automated Cleanup:**
```sql
-- Schedule cleanup job
SELECT cron.schedule(
  'cleanup-old-logs',
  '0 2 * * 0', -- Weekly on Sunday at 2 AM
  $$
  -- Delete old email logs (older than 6 months)
  DELETE FROM email_logs
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  -- Delete old activity logs (older than 1 year)
  DELETE FROM activities
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Vacuum tables
  VACUUM ANALYZE email_logs, activities;
  $$
);
```

---

## Data Validation & Integrity

### Server-Side Validation with Zod

**Current Implementation:** ✅ Good (using Zod in server actions)

**Example Pattern:**
```typescript
// actions/customers.ts
const customerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/), // E.164 format
  type: z.enum(["residential", "commercial", "industrial"]),
});

export async function createCustomer(formData: FormData) {
  // Validate input
  const data = customerSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    type: formData.get("type"),
  });
  
  // Insert to database
  const supabase = await createClient();
  const { error } = await supabase.from("customers").insert(data);
  
  if (error) throw error;
  return { success: true };
}
```

---

### Database Constraints

**1. CHECK Constraints:**
```sql
-- Email validation
ALTER TABLE customers ADD CONSTRAINT customers_email_valid
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Phone validation
ALTER TABLE customers ADD CONSTRAINT customers_phone_valid
  CHECK (phone ~ '^\+?[1-9]\d{1,14}$');

-- Amount validation
ALTER TABLE invoices ADD CONSTRAINT invoices_amounts_valid
  CHECK (
    subtotal >= 0 AND
    tax_amount >= 0 AND
    discount_amount >= 0 AND
    total_amount >= 0 AND
    total_amount = subtotal + tax_amount - discount_amount
  );

-- Status validation
ALTER TABLE jobs ADD CONSTRAINT jobs_status_valid
  CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed', 'cancelled'));
```

**2. NOT NULL Constraints:**
```sql
-- Required fields
ALTER TABLE customers ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE customers ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE customers ALTER COLUMN email SET NOT NULL;
ALTER TABLE customers ALTER COLUMN company_id SET NOT NULL;
```

**3. UNIQUE Constraints:**
```sql
-- Prevent duplicate emails per company
ALTER TABLE customers 
  ADD CONSTRAINT customers_email_company_unique 
  UNIQUE (company_id, email);

-- Prevent duplicate job numbers per company
ALTER TABLE jobs 
  ADD CONSTRAINT jobs_job_number_company_unique 
  UNIQUE (company_id, job_number);
```

---

### Transaction Patterns

**1. Multi-Table Insert:**
```typescript
// actions/jobs.ts
export async function createJobWithInvoice(jobData: any, invoiceData: any) {
  const supabase = await createClient();
  
  // Start transaction
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert(jobData)
    .select()
    .single();
  
  if (jobError) throw jobError;
  
  // Insert invoice
  const { error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      ...invoiceData,
      job_id: job.id,
    });
  
  if (invoiceError) {
    // Rollback by deleting job
    await supabase.from("jobs").delete().eq("id", job.id);
    throw invoiceError;
  }
  
  return { success: true, job };
}
```

**2. Optimistic Locking (Prevent Concurrent Updates):**
```sql
-- Add version column
ALTER TABLE invoices ADD COLUMN version INTEGER DEFAULT 0;

-- Update with version check
UPDATE invoices
SET 
  total_amount = 1500,
  version = version + 1,
  updated_at = NOW()
WHERE id = 'invoice-id'
AND version = 5 -- Only succeeds if version matches
RETURNING *;
```

```typescript
// actions/invoices.ts
export async function updateInvoice(id: string, data: any, version: number) {
  const supabase = await createClient();
  
  const { data: updated, error } = await supabase
    .from("invoices")
    .update({
      ...data,
      version: version + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("version", version) // Optimistic lock
    .select()
    .single();
  
  if (error) {
    throw new Error("Invoice was modified by another user. Please refresh and try again.");
  }
  
  return updated;
}
```

---

### Idempotency for Critical Operations

**1. Idempotency Keys for Payments:**
```sql
-- Add idempotency key to payments
ALTER TABLE payments ADD COLUMN idempotency_key TEXT UNIQUE;
CREATE INDEX idx_payments_idempotency ON payments(idempotency_key);
```

```typescript
// actions/payments.ts
export async function createPayment(data: PaymentData, idempotencyKey: string) {
  const supabase = await createClient();
  
  // Check if payment already exists
  const { data: existing } = await supabase
    .from("payments")
    .select("*")
    .eq("idempotency_key", idempotencyKey)
    .single();
  
  if (existing) {
    return { success: true, payment: existing }; // Already processed
  }
  
  // Create new payment
  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      ...data,
      idempotency_key: idempotencyKey,
    })
    .select()
    .single();
  
  if (error) throw error;
  return { success: true, payment };
}
```

**2. Generate Idempotency Keys:**
```typescript
// client component
import { v4 as uuidv4 } from "uuid";

async function handlePayment() {
  const idempotencyKey = uuidv4();
  await createPayment(paymentData, idempotencyKey);
}
```

---

## Security Hardening

### SQL Injection Prevention

**Current State:** ✅ Good (using Supabase client with parameterized queries)

**Example:**
```typescript
// ✅ SAFE: Parameterized query
const { data } = await supabase
  .from("customers")
  .select("*")
  .eq("email", userInput); // Automatically parameterized

// ❌ UNSAFE: Raw SQL (avoid)
const { data } = await supabase.rpc("search_customers", {
  query: `SELECT * FROM customers WHERE email = '${userInput}'`
}); // SQL injection vulnerability
```

---

### Input Sanitization

**1. Sanitize HTML Input:**
```bash
pnpm add dompurify isomorphic-dompurify
```

```typescript
import DOMPurify from "isomorphic-dompurify";

export async function createNote(content: string) {
  // Sanitize HTML content
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "a"],
    ALLOWED_ATTR: ["href"],
  });
  
  const supabase = await createClient();
  await supabase.from("notes").insert({ content: clean });
}
```

---

### Secret Management

**1. Use Environment Variables:**
```bash
# .env.local (never commit)
SUPABASE_SERVICE_ROLE_KEY=ey... # Server-side only
STRIPE_SECRET_KEY=sk_test_... # Server-side only
NEXT_PUBLIC_SUPABASE_URL=https://... # Client-side OK
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey... # Client-side OK
```

**2. Validate Environment Variables at Startup:**
```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
});

// Server crashes at startup if any env var is missing
```

**3. Secret Rotation:**
```bash
# Rotate Supabase service role key
1. Generate new key in Supabase dashboard
2. Update SUPABASE_SERVICE_ROLE_KEY in production
3. Restart servers
4. Revoke old key
```

---

### CORS Configuration

**Next.js API Routes:**
```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://thorbis.com",
    "https://app.thorbis.com",
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }

  return NextResponse.next();
}
```

---

### Rate Limiting Implementation

**Option 1: Upstash Rate Limit (Recommended)**

```bash
pnpm add @upstash/ratelimit
```

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Per-user rate limit (authenticated)
export const userRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "ratelimit:user",
});

// Per-IP rate limit (public endpoints)
export const ipRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 requests per minute
  analytics: true,
  prefix: "ratelimit:ip",
});

// Strict rate limit (sensitive endpoints)
export const strictRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
  analytics: true,
  prefix: "ratelimit:strict",
});
```

**Apply Rate Limiting to Server Actions:**
```typescript
// actions/customers.ts
import { userRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function createCustomer(formData: FormData) {
  // Get user identifier
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const identifier = user?.id || (await headers()).get("x-forwarded-for") || "anonymous";

  // Check rate limit
  const { success, limit, remaining, reset } = await userRateLimit.limit(identifier);
  
  if (!success) {
    throw new ActionError(
      `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
  }

  // Process request
  // ...
}
```

**Rate Limit by Endpoint:**
```typescript
// app/api/webhooks/stripe/route.ts
import { ipRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  
  const { success } = await ipRateLimit.limit(ip);
  if (!success) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Process webhook
  // ...
}
```

---

**Option 2: Supabase Edge Function Rate Limiting**

```typescript
// supabase/functions/rate-limited-endpoint/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const userId = req.headers.get("x-user-id");
  const key = `ratelimit:${userId}`;

  // Check Redis for rate limit
  const count = await supabase.from("rate_limits").select("count").eq("key", key).single();
  
  if (count && count.data.count > 100) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // Increment counter
  await supabase.rpc("increment_rate_limit", { key });

  // Process request
  return new Response("OK");
});
```

---

## Implementation Roadmap

### Phase 1: Critical Security Fixes (Week 1-2) - P0

**Objective:** Fix critical security vulnerabilities immediately.

**Tasks:**
1. ✅ **Generate and Apply RLS Policies**
   - File: `/supabase/migrations/20250131000010_rls_complete.sql`
   - Tables: customers, communications, email_logs, payments, equipment, etc.
   - Estimated Time: 8 hours
   - Owner: Senior Backend Engineer
   - Success Criteria: All 42 tables have RLS policies enabled

2. ✅ **Test RLS Policies**
   - Script: `/scripts/test-rls-policies.ts`
   - Test multi-tenancy isolation
   - Test role-based permissions
   - Estimated Time: 4 hours
   - Success Criteria: 100% coverage, no leaks detected

3. ✅ **Add Database Indexes for RLS Performance**
   - Indexes on team_members, companies for RLS joins
   - Estimated Time: 2 hours
   - Success Criteria: RLS queries < 50ms at p95

4. ✅ **Add CHECK Constraints**
   - Email validation, amount validation, status validation
   - Estimated Time: 2 hours
   - Success Criteria: Invalid data rejected at database level

**Total Estimated Time:** 16 hours (2 working days)

---

### Phase 2: Background Jobs & Caching (Week 3-4) - P1

**Objective:** Improve performance and enable asynchronous operations.

**Tasks:**
1. ✅ **Set Up Job Queue System**
   - Edge Function: `/supabase/functions/job-processor/index.ts`
   - Database Table: `job_queue`
   - pg_cron schedule
   - Estimated Time: 12 hours
   - Success Criteria: Email/SMS sending is async

2. ✅ **Implement Redis Caching**
   - Set up Upstash Redis
   - Cache helper functions
   - Cache price book, settings, permissions
   - Estimated Time: 8 hours
   - Success Criteria: Price book loads < 100ms

3. ✅ **Create Materialized Views**
   - Dashboard KPIs
   - Company metrics
   - pg_cron refresh schedule
   - Estimated Time: 4 hours
   - Success Criteria: Dashboard loads < 500ms

4. ✅ **Add Cache Invalidation Logic**
   - Invalidate on mutations
   - Wildcard patterns
   - Estimated Time: 4 hours
   - Success Criteria: Cache never stale > 5 minutes

**Total Estimated Time:** 28 hours (3.5 working days)

---

### Phase 3: Monitoring & Observability (Week 5) - P1

**Objective:** Gain visibility into system health and performance.

**Tasks:**
1. ✅ **Set Up Sentry**
   - Install @sentry/nextjs
   - Configure error tracking
   - Add to server actions
   - Estimated Time: 4 hours
   - Success Criteria: All errors tracked

2. ✅ **Set Up Axiom Logging**
   - Install next-axiom
   - Add structured logging
   - Create dashboards
   - Estimated Time: 4 hours
   - Success Criteria: All requests logged

3. ✅ **Enable pg_stat_statements**
   - Monitor slow queries
   - Create slow query dashboard
   - Estimated Time: 2 hours
   - Success Criteria: Slow queries identified and optimized

4. ✅ **Create Health Check Endpoint**
   - `/api/health`
   - Check database, Redis
   - Estimated Time: 2 hours
   - Success Criteria: Health checks pass

5. ✅ **Set Up Alerts**
   - Sentry alerts for errors
   - Slow query alerts
   - Connection pool alerts
   - Estimated Time: 4 hours
   - Success Criteria: Team notified of issues within 5 minutes

**Total Estimated Time:** 16 hours (2 working days)

---

### Phase 4: Rate Limiting & Security Hardening (Week 6) - P1

**Objective:** Prevent abuse and strengthen security.

**Tasks:**
1. ✅ **Implement Rate Limiting**
   - Install @upstash/ratelimit
   - Apply to server actions
   - Apply to API routes
   - Estimated Time: 6 hours
   - Success Criteria: No endpoint exceeds 100 req/min per user

2. ✅ **Add Input Sanitization**
   - Install dompurify
   - Sanitize HTML content
   - Estimated Time: 2 hours
   - Success Criteria: No XSS vulnerabilities

3. ✅ **Validate Environment Variables**
   - Create /lib/env.ts
   - Validate at startup
   - Estimated Time: 1 hour
   - Success Criteria: Server crashes if env var missing

4. ✅ **Add CORS Configuration**
   - Middleware for allowed origins
   - Estimated Time: 1 hour
   - Success Criteria: Only allowed origins can access API

**Total Estimated Time:** 10 hours (1.25 working days)

---

### Phase 5: Scalability & Performance (Week 7-8) - P2

**Objective:** Prepare for growth and optimize resource usage.

**Tasks:**
1. ✅ **Enable Supabase Pooler**
   - Configure connection pooling
   - Update connection strings
   - Estimated Time: 2 hours
   - Success Criteria: Connection pool utilization < 80%

2. ✅ **Configure Storage Buckets**
   - RLS policies for buckets
   - Direct upload URLs
   - Estimated Time: 4 hours
   - Success Criteria: File uploads don't go through server

3. ✅ **Implement Soft Delete**
   - Add deleted_at to tables
   - Update RLS policies
   - Estimated Time: 4 hours
   - Success Criteria: No hard deletes in production

4. ✅ **Create Archive Strategy**
   - Archive old jobs
   - Schedule cleanup jobs
   - Estimated Time: 4 hours
   - Success Criteria: Database size stable

5. ✅ **Add Optimistic Locking**
   - Version column on critical tables
   - Prevent concurrent updates
   - Estimated Time: 4 hours
   - Success Criteria: No lost updates

**Total Estimated Time:** 18 hours (2.25 working days)

---

### Phase 6: Audit Logging (Week 9) - P2

**Objective:** Track all data modifications for compliance.

**Tasks:**
1. ✅ **Create Audit Log Table**
   - Schema: activities table
   - Trigger functions
   - Estimated Time: 4 hours

2. ✅ **Add Audit Triggers**
   - Triggers on critical tables
   - Capture before/after values
   - Estimated Time: 8 hours

3. ✅ **Create Audit Log UI**
   - Admin dashboard
   - Filter/search
   - Estimated Time: 8 hours

**Total Estimated Time:** 20 hours (2.5 working days)

---

### Summary

**Total Implementation Time:** ~108 hours (13.5 working days)  
**Phases:** 6 phases over 9 weeks  
**Priority Breakdown:**
- P0 (Critical): 16 hours
- P1 (High): 54 hours
- P2 (Medium): 38 hours

**Resource Requirements:**
- 1 Senior Backend Engineer (full-time)
- 1 DevOps Engineer (part-time for monitoring setup)
- $45-75/month additional infrastructure costs (Redis, monitoring)

**Risk Mitigation:**
- Deploy RLS policies to staging first
- Monitor error rates after each deployment
- Keep rollback scripts ready
- Test thoroughly before production

---

## Cost Analysis

### Current Monthly Costs

- **Supabase Pro:** $25/month
- **Vercel Pro (Next.js hosting):** $20/month
- **Total:** $45/month

---

### Recommended Additional Services

| Service | Purpose | Free Tier | Paid Tier | Recommended Plan |
|---------|---------|-----------|-----------|------------------|
| **Upstash Redis** | Caching | 10K commands/day | $10/month for 100K | $10/month |
| **Sentry** | Error tracking | 5K errors/month | $26/month | $26/month |
| **Axiom** | Log aggregation | 500MB/month | $25/month | Free tier initially |
| **Total Additional** | | | | **$36/month** |

---

### Total Monthly Cost Projection

- **Current:** $45/month
- **With Optimizations:** $81/month
- **Increase:** $36/month (80% increase)

**Cost per 1000 Users:**
- Before: $45 / 1000 = $0.045 per user
- After: $81 / 1000 = $0.081 per user
- **Marginal cost increase: $0.036 per user**

**ROI Justification:**
- ✅ Prevents security breaches (avg cost: $100K+)
- ✅ Improves performance (lower churn, higher retention)
- ✅ Enables scaling (handles 10x traffic)
- ✅ Reduces support costs (better monitoring)
- ✅ Compliance ready (audit logging)

---

## Appendices

### Appendix A: Complete RLS Migration Script

See separate file: `/supabase/migrations/20250131000010_rls_complete.sql`

---

### Appendix B: Testing Scripts

See separate file: `/scripts/test-rls-policies.ts`

---

### Appendix C: Performance Benchmarks

**Target Metrics:**
- Database query time (p95): < 50ms
- Server action execution (p95): < 100ms
- Page load time (LCP): < 2.5s
- Error rate: < 0.1%
- Cache hit rate: > 80%

**Monitoring Dashboard:**
- Sentry: Performance transactions
- Axiom: Query analytics
- Supabase: Database metrics

---

## Conclusion

This comprehensive analysis has identified critical security vulnerabilities and performance optimization opportunities in the Thorbis backend architecture. The recommended roadmap provides a clear path to:

1. **Secure the platform** with comprehensive RLS policies
2. **Improve performance** with multi-layer caching
3. **Enable scalability** with background jobs and connection pooling
4. **Ensure reliability** with monitoring and alerting
5. **Prepare for compliance** with audit logging

**Immediate Actions (This Week):**
1. ✅ Apply RLS policies to all 42 tables
2. ✅ Test RLS policies thoroughly
3. ✅ Add database indexes for RLS performance
4. ✅ Set up basic monitoring (Sentry)

**Next Month:**
1. ✅ Implement background job queue
2. ✅ Set up Redis caching
3. ✅ Add rate limiting
4. ✅ Create health check endpoints

**Long Term (Next Quarter):**
1. ✅ Implement audit logging
2. ✅ Optimize for 10x growth
3. ✅ Add read replicas (if needed)
4. ✅ Advanced monitoring dashboards

---

**End of Report**

