# Backend Optimization - Quick Reference Guide

**Created:** October 31, 2025  
**Full Analysis:** [BACKEND_ARCHITECTURE_ANALYSIS.md](./BACKEND_ARCHITECTURE_ANALYSIS.md)

---

## 🚨 Critical Actions Required (This Week)

### 1. Apply RLS Policies (P0 - CRITICAL)

**Issue:** 20+ tables missing RLS policies = multi-tenant data leakage risk

**Fix:**
```bash
# Apply the complete RLS migration
supabase db push

# Or manually run:
psql $DATABASE_URL < supabase/migrations/20250131000010_rls_complete.sql
```

**Verify:**
```bash
# Run RLS tests
pnpm test:rls
```

**Tables Fixed:**
- ✅ customers (PII data)
- ✅ communications (email/SMS)
- ✅ email_logs (email history)
- ✅ payments (financial data)
- ✅ equipment, service_plans, schedules
- ✅ inventory, tags, attachments
- ✅ activities (audit trail)
- ✅ contracts, verification_tokens

---

### 2. Set Up Basic Monitoring (P0)

**Install Sentry for error tracking:**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configure:**
```typescript
// sentry.client.config.ts & sentry.server.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

### 3. Add Performance Indexes (P0)

**Indexes for RLS performance:**
```sql
-- Already included in migration 20250131000010_rls_complete.sql
CREATE INDEX idx_team_members_user_company_status
  ON team_members(user_id, company_id, status)
  WHERE status = 'active';
```

**Monitor slow queries:**
```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 📊 Implementation Roadmap

### Phase 1: Security (Week 1-2) - P0
- [x] RLS policies for all 42 tables
- [ ] Test RLS policies
- [ ] Add database indexes
- [ ] Set up Sentry error tracking

**Time:** 16 hours (2 days)

---

### Phase 2: Performance (Week 3-4) - P1
- [ ] Set up Redis caching (Upstash)
- [ ] Implement job queue (Edge Functions)
- [ ] Create materialized views for reports
- [ ] Add cache invalidation logic

**Time:** 28 hours (3.5 days)

---

### Phase 3: Monitoring (Week 5) - P1
- [ ] Set up Axiom logging
- [ ] Enable pg_stat_statements
- [ ] Create health check endpoint
- [ ] Set up alerts (Slack/email)

**Time:** 16 hours (2 days)

---

### Phase 4: Rate Limiting (Week 6) - P1
- [ ] Install @upstash/ratelimit
- [ ] Apply to server actions
- [ ] Apply to API routes
- [ ] Add CORS configuration

**Time:** 10 hours (1.25 days)

---

### Phase 5: Scalability (Week 7-8) - P2
- [ ] Enable Supabase Pooler
- [ ] Configure storage buckets
- [ ] Implement soft delete
- [ ] Create archive strategy

**Time:** 18 hours (2.25 days)

---

### Phase 6: Audit Logging (Week 9) - P2
- [ ] Create audit log table
- [ ] Add audit triggers
- [ ] Create audit log UI

**Time:** 20 hours (2.5 days)

---

## 💰 Cost Estimate

| Service | Current | With Optimizations | Increase |
|---------|---------|-------------------|----------|
| Supabase Pro | $25/mo | $25/mo | $0 |
| Vercel Pro | $20/mo | $20/mo | $0 |
| Upstash Redis | - | $10/mo | $10/mo |
| Sentry | - | $26/mo | $26/mo |
| Axiom (free tier) | - | $0/mo | $0 |
| **Total** | **$45/mo** | **$81/mo** | **+$36/mo** |

**Cost per 1000 users:** $0.081 (vs $0.045 before)

---

## 🎯 Key Performance Targets

| Metric | Current | Target | How to Achieve |
|--------|---------|--------|----------------|
| Database query (p95) | Unknown | < 50ms | RLS indexes + connection pooling |
| Server action (p95) | Unknown | < 100ms | Redis caching + async jobs |
| Page load (LCP) | Unknown | < 2.5s | ISR + code splitting |
| Error rate | Unknown | < 0.1% | Sentry monitoring |
| Cache hit rate | 0% | > 80% | Redis + materialized views |

---

## 🔧 Quick Commands

### Database Operations
```bash
# Apply migrations
supabase db push

# View migration status
supabase db remote list

# View database logs
supabase logs postgres

# View slow queries
supabase db query "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10"
```

### Testing
```bash
# Run RLS tests
pnpm test:rls

# Run all tests
pnpm test

# Analyze bundle size
pnpm analyze:bundle
```

### Monitoring
```bash
# View production logs (Axiom)
npx axiom query "SELECT * FROM logs WHERE service='api' ORDER BY _time DESC LIMIT 100"

# View errors (Sentry)
# Go to: https://sentry.io/organizations/thorbis/issues/
```

---

## 📚 Key Files Created

1. **Full Analysis:** `/docs/BACKEND_ARCHITECTURE_ANALYSIS.md` (100+ pages)
2. **RLS Migration:** `/supabase/migrations/20250131000010_rls_complete.sql`
3. **This Guide:** `/docs/BACKEND_QUICK_REFERENCE.md`

---

## 🚀 Quick Start

### Apply RLS Policies (5 minutes)
```bash
# 1. Backup database first
supabase db dump -f backup.sql

# 2. Apply RLS migration
supabase db push

# 3. Verify RLS enabled
supabase db query "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true"
```

### Set Up Monitoring (15 minutes)
```bash
# 1. Install Sentry
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# 2. Add DSN to .env.local
echo "NEXT_PUBLIC_SENTRY_DSN=https://..." >> .env.local

# 3. Deploy
git add . && git commit -m "Add Sentry monitoring" && git push
```

### Set Up Caching (30 minutes)
```bash
# 1. Sign up for Upstash Redis (https://upstash.com)
# 2. Install Redis client
pnpm add @upstash/redis

# 3. Add Redis URL to .env.local
echo "UPSTASH_REDIS_REST_URL=https://..." >> .env.local
echo "UPSTASH_REDIS_REST_TOKEN=..." >> .env.local

# 4. Create cache helper (see full docs)
# 5. Deploy
```

---

## 🔐 Security Checklist

- [x] RLS enabled on all tables
- [ ] RLS policies tested (no data leakage)
- [ ] Database indexes added for performance
- [ ] Rate limiting implemented
- [ ] Input sanitization (DOMPurify for HTML)
- [ ] Environment variables validated
- [ ] CORS configured
- [ ] Secrets rotated (service role key)
- [ ] Sentry error tracking
- [ ] Audit logging (phase 6)

---

## 📞 Support

**Questions?**
- Read full analysis: [BACKEND_ARCHITECTURE_ANALYSIS.md](./BACKEND_ARCHITECTURE_ANALYSIS.md)
- Review migration: `/supabase/migrations/20250131000010_rls_complete.sql`
- Check Supabase docs: https://supabase.com/docs

**Common Issues:**
1. **RLS policy errors:** Check team_members status and company_id
2. **Slow queries:** Add indexes, check pg_stat_statements
3. **Cache misses:** Verify Redis connection, check TTL
4. **Job failures:** Check Edge Function logs, retry count

---

## ✅ Pre-Deployment Checklist

Before deploying RLS migration:

- [ ] Database backup created
- [ ] RLS migration reviewed
- [ ] Test environment validated
- [ ] Rollback plan documented
- [ ] Team notified of changes
- [ ] Monitoring configured (Sentry)
- [ ] Error alerts set up
- [ ] Performance baseline captured

**Rollback Plan:**
```bash
# If RLS causes issues:
# 1. Disable RLS temporarily
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

# 2. Drop problematic policies
DROP POLICY "Company members can read customers" ON customers;

# 3. Fix and re-apply
# 4. Re-enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
```

---

**Last Updated:** October 31, 2025  
**Next Review:** After Phase 1 completion (Week 2)

