-- Messaging branding + 10DLC support
create extension if not exists "pgcrypto";

alter table public.companies
  add column if not exists legal_name text,
  add column if not exists ein text,
  add column if not exists support_email text,
  add column if not exists support_phone text,
  add column if not exists doing_business_as text;

alter table public.communication_phone_settings
  add column if not exists caller_id_label text,
  add column if not exists sms_sender_name text,
  add column if not exists sms_signature text,
  add column if not exists branding_payload jsonb default '{}'::jsonb;

create table if not exists public.messaging_brands (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  telnyx_brand_id text,
  status text not null default 'pending',
  legal_name text not null,
  doing_business_as text,
  ein text not null,
  vertical text not null,
  website text,
  support_email text,
  support_phone text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  brand_color text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id)
);

create table if not exists public.messaging_campaigns (
  id uuid primary key default gen_random_uuid(),
  messaging_brand_id uuid not null references public.messaging_brands(id) on delete cascade,
  telnyx_campaign_id text,
  messaging_profile_id text,
  usecase text not null,
  description text,
  status text not null default 'pending',
  sample_messages text[],
  terms_and_conditions_url text,
  help_message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(messaging_brand_id, usecase)
);

create table if not exists public.messaging_campaign_phone_numbers (
  id uuid primary key default gen_random_uuid(),
  messaging_campaign_id uuid not null references public.messaging_campaigns(id) on delete cascade,
  phone_number_id uuid not null references public.phone_numbers(id) on delete cascade,
  telnyx_relationship_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(messaging_campaign_id, phone_number_id)
);

create index if not exists idx_messaging_brands_company_id on public.messaging_brands(company_id);
create index if not exists idx_messaging_campaigns_brand_id on public.messaging_campaigns(messaging_brand_id);
create index if not exists idx_messaging_campaign_phone_numbers_campaign_id on public.messaging_campaign_phone_numbers(messaging_campaign_id);

