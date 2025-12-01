-- =====================================================
-- Webhook Deduplication & Rate Limiting Tables
-- Multi-tenant design for Telnyx integration
-- =====================================================

-- Webhook deduplication cache (prevents duplicate processing in serverless)
create table if not exists webhook_dedup_cache (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id) on delete cascade,
    webhook_id text not null,
    source text not null default 'telnyx',
    processed_at timestamptz not null default timezone('utc', now()),
    expires_at timestamptz not null,
    constraint webhook_dedup_unique unique (company_id, webhook_id, source)
);

-- Indexes for fast lookups and cleanup
create index if not exists idx_webhook_dedup_lookup
    on webhook_dedup_cache(company_id, webhook_id, source);
create index if not exists idx_webhook_dedup_cleanup
    on webhook_dedup_cache(expires_at);
create index if not exists idx_webhook_dedup_source
    on webhook_dedup_cache(source, processed_at desc);

-- Rate limiting counters (sliding window per company)
create table if not exists rate_limit_counters (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id) on delete cascade,
    resource text not null,
    identifier text not null,
    window_start timestamptz not null,
    window_size_seconds integer not null default 60,
    count integer not null default 1,
    metadata jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint rate_limit_unique unique (company_id, resource, identifier, window_start)
);

-- Indexes for rate limiting queries
create index if not exists idx_rate_limit_lookup
    on rate_limit_counters(company_id, resource, identifier, window_start desc);
create index if not exists idx_rate_limit_cleanup
    on rate_limit_counters(window_start);
create index if not exists idx_rate_limit_resource
    on rate_limit_counters(resource, company_id);

-- Enable RLS on both tables
alter table webhook_dedup_cache enable row level security;
alter table rate_limit_counters enable row level security;

-- Drop existing policies if they exist then recreate
drop policy if exists "webhook_dedup_service_role" on webhook_dedup_cache;
drop policy if exists "webhook_dedup_read_members" on webhook_dedup_cache;
drop policy if exists "rate_limit_service_role" on rate_limit_counters;
drop policy if exists "rate_limit_read_admins" on rate_limit_counters;

-- RLS Policies for webhook_dedup_cache
create policy "webhook_dedup_service_role" on webhook_dedup_cache
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "webhook_dedup_read_members" on webhook_dedup_cache
for select
using (
    exists (
        select 1 from public.team_members tm
        where tm.company_id = webhook_dedup_cache.company_id
          and tm.user_id = auth.uid()
          and tm.status = 'active'
    )
);

-- RLS Policies for rate_limit_counters
create policy "rate_limit_service_role" on rate_limit_counters
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "rate_limit_read_admins" on rate_limit_counters
for select
using (
    exists (
        select 1 from public.team_members tm
        where tm.company_id = rate_limit_counters.company_id
          and tm.user_id = auth.uid()
          and tm.status = 'active'
          and tm.role in ('owner', 'admin')
    )
);

-- Function to increment rate limit counter (upsert pattern)
create or replace function increment_rate_limit(
    p_company_id uuid,
    p_resource text,
    p_identifier text,
    p_window_size_seconds integer default 60,
    p_metadata jsonb default null
) returns table(current_count integer, window_start timestamptz)
language plpgsql
security definer
as $$
declare
    v_window_start timestamptz;
    v_count integer;
begin
    v_window_start := date_trunc('minute', now());

    insert into rate_limit_counters (
        company_id, resource, identifier, window_start, window_size_seconds, count, metadata
    )
    values (
        p_company_id, p_resource, p_identifier, v_window_start, p_window_size_seconds, 1, p_metadata
    )
    on conflict (company_id, resource, identifier, window_start)
    do update set
        count = rate_limit_counters.count + 1,
        updated_at = timezone('utc', now())
    returning rate_limit_counters.count, rate_limit_counters.window_start
    into v_count, v_window_start;

    return query select v_count, v_window_start;
end;
$$;

-- Function to check rate limit (returns true if under limit)
create or replace function check_rate_limit(
    p_company_id uuid,
    p_resource text,
    p_identifier text,
    p_limit integer,
    p_window_size_seconds integer default 60
) returns boolean
language plpgsql
security definer
as $$
declare
    v_window_start timestamptz;
    v_count integer;
begin
    v_window_start := date_trunc('minute', now());

    select coalesce(sum(count), 0)
    into v_count
    from rate_limit_counters
    where company_id = p_company_id
      and resource = p_resource
      and identifier = p_identifier
      and window_start >= v_window_start - (p_window_size_seconds || ' seconds')::interval;

    return v_count < p_limit;
end;
$$;

-- Function to cleanup expired webhook dedup entries
create or replace function cleanup_expired_webhook_dedup()
returns integer
language plpgsql
security definer
as $$
declare
    deleted_count integer;
begin
    delete from webhook_dedup_cache
    where expires_at < now();

    get diagnostics deleted_count = row_count;
    return deleted_count;
end;
$$;

-- Function to cleanup old rate limit entries (older than 1 hour)
create or replace function cleanup_old_rate_limits()
returns integer
language plpgsql
security definer
as $$
declare
    deleted_count integer;
begin
    delete from rate_limit_counters
    where window_start < now() - interval '1 hour';

    get diagnostics deleted_count = row_count;
    return deleted_count;
end;
$$;

-- Comments for documentation
comment on table webhook_dedup_cache is 'Prevents duplicate webhook processing across serverless instances';
comment on table rate_limit_counters is 'Sliding window rate limiting counters per company';
