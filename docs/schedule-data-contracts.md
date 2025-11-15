# Schedule & Team Data Contracts

Authoritative schema references: `supabase/migrations/20250131000002_production_schema_complete.sql` plus newer migrations such as `20250209000000_add_job_team_assignments.sql` and `20250215000002_team_members_trigger.sql`.

## schedules

- `id UUID PRIMARY KEY`
- `company_id UUID NOT NULL` → `companies.id`
- `customer_id UUID NOT NULL` → `customers.id`
- `property_id UUID NOT NULL` → `properties.id`
- `job_id UUID NULL` → `jobs.id` (optional linkage used for crew + billing context)
- Assignment
  - `assigned_to UUID NULL` → `users.id` (single primary assignee)
  - Additional crew comes from `job_team_assignments` joined via `jobs.id`
- Timing
  - `start_time`, `end_time`, `duration` are required
  - `all_day`, `is_recurring`, `recurrence_rule JSONB`, `recurrence_end_date`, `parent_schedule_id`
- Status & tracking
  - `status schedule_status DEFAULT 'scheduled'`
  - Reminder + confirmation metadata (`reminder_sent`, `confirmed_at/by`, etc.)
  - Actual vs scheduled timestamps (`actual_*`) and `completed_by`
- Soft delete / archive fields (`deleted_at`, `deleted_by`, `archived_at`)
- Constraints & implications
  - Inserts must include both `customer_id` and `property_id`
  - Queries must scope by `company_id` and exclude soft-deleted rows
  - Recurring instances reference their parent via `parent_schedule_id`

## job_team_assignments

- `id UUID PRIMARY KEY`
- `job_id UUID NOT NULL` → `jobs.id`
- `team_member_id UUID NOT NULL` → `team_members.id`
- `role TEXT DEFAULT 'crew'` (allowed values: `primary`, `assistant`, `crew`, `supervisor`)
- `assigned_at TIMESTAMPTZ DEFAULT NOW()`
- Soft delete via `removed_at`, `removed_by`
- `UNIQUE(job_id, team_member_id)` prevents duplicates
- Indexed by `job_id`, `team_member_id`, `(job_id, role)` to power crew lookups

## team_members

- `id UUID PRIMARY KEY`
- `company_id UUID NOT NULL`
- `user_id UUID NULL` (null indicates pending invite)
- `status TEXT` (`active`, `archived`, etc.) and `archived_at TIMESTAMPTZ` hide inactive techs
- `role user_role` enumerates owner/admin/dispatcher/technician/csr/etc.
- Profile metadata: `job_title`, `department`, `permissions JSONB`
- Contact / telephony metadata: `email`, `phone`, `phone_extension`, `call_forwarding_*`, `voicemail_*`
- Timestamps: `created_at`, `updated_at`, `joined_at`, `last_active_at`
- Constraints
  - Unique `(user_id, company_id)` enforced through `team_members_user_company_unique`
  - Triggers ensure every company owner has a corresponding `team_members` row

## Fetch & transform pipeline

- `fetchScheduleData` (`src/lib/schedule-data.ts`) is the single Supabase fetcher for both the Gantt and the new ServiceTitan-style timeline. It filters by `company_id`, excludes deleted rows, joins customers/properties, and normalizes technicians.
- `mapScheduleToJob`, `mapTeamMembersToTechnicians`, and `buildAssignments` convert raw rows into the shared `Job`/`Technician` contracts consumed across the UI.
- `createTechnicianJobMap` + `UNASSIGNED_TECHNICIAN_ID` provide the canonical way to build technician lanes (including the synthetic “Unassigned” lane). This powers the new dispatch board, the Gantt view, and server bootstrap hydration.
- `resolveScheduleRange` standardizes default ranges (7-day look-back, 30-day look-ahead) so server-side hydration and client-side fetching stay aligned.
- Tests in `src/lib/__tests__/schedule-data.test.ts` codify the pipeline, including the helpers above. Update the suite whenever the schema or UI expectations change.

## UI checklist

- **Gantt view**: Always append the unassigned lane when any visible job lacks a technician, provide highlight toggles, and render destructive styling for orphaned appointments.
- **Technician sidebar**: List the synthetic unassigned entry plus live job counts; keep badges/initials consistent with the new dispatch board.
- **Timeline/dispatch view**: Default `useScheduleViewStore` to `view: "timeline"` so sessions open on the ServiceTitan-style hourly board, and re-use the same normalized data/lanes produced by the helpers above.
- **Toolbar & filters**: Map “Today”, previous/next, technician filters, and status chips to the shared stores so both Gantt and timeline stay in sync.

Keep this document in sync with Supabase migrations and schedule UI behaviour; treat it as the contract between the backend schema and the scheduling experiences.

