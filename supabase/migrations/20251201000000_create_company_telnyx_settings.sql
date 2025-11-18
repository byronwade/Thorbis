create table if not exists company_telnyx_settings (
    company_id uuid primary key references public.companies(id) on delete cascade,
    status text not null default 'pending',
    messaging_profile_id text,
    call_control_application_id text,
    default_outbound_number text,
    default_outbound_phone_number_id text,
    ten_dlc_brand_id text,
    ten_dlc_campaign_id text,
    webhook_secret text,
    metadata jsonb,
    last_provisioned_at timestamptz,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

alter table company_telnyx_settings enable row level security;

create policy if not exists "company_telnyx_settings_service_role" on company_telnyx_settings
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy if not exists "company_telnyx_settings_read_members" on company_telnyx_settings
for select
using (
    exists (
        select 1 from public.team_members tm
        where tm.company_id = company_telnyx_settings.company_id
          and tm.user_id = auth.uid()
          and tm.status = 'active'
    )
);
