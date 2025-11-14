# Settings IA & Supabase Data Map

> Source inputs: `src/app/(dashboard)/dashboard/settings/*`, Supabase types in `src/types/supabase.ts`, analytics guidance in `docs/ANALYTICS.md`, and the finance migration `supabase/migrations/20251102120000_add_finance_settings.sql`.

## Cluster Overview

| Cluster | Key Destinations | Primary Supabase Tables | Notes |
| --- | --- | --- | --- |
| Account & Identity | `/profile/*`, `/profile/notifications/*`, `/profile/security/*` | `users`, `profiles`, `user_preferences`, `user_notification_preferences` | Drives personal status, auth hygiene, notification completeness. |
| Workspace & Organization | `/company`, `/team/*`, `/company-feed`, `/organizations`, `/tags`, `/lead-sources` | `companies`, `company_settings`, `team_members`, `custom_roles`, `departments`, `company_holidays` | Unifies org profile, people, and taxonomy data. |
| Communications | `/communications/*`, `/marketing`, `/customer-portal`, `/customer-intake`, `/customers/preferences` | `messaging_brands`, `messaging_campaigns`, `phone_numbers`, `phone_porting_requests`, `call_routing_rules`, `notification_queue`, `email_templates` | Needs Telnyx status, channel usage, deliverability. |
| Operations | `/jobs`, `/job-fields`, `/schedule/*`, `/service-plans`, `/customer-intake`, `/checklists`, `/purchase-orders` | `jobs`, `job_workflow_stages`, `appointments`, `dispatch_rules`, `service_areas`, `maintenance_plans`, `purchase_orders` | Surfaces workflow coverage, automation readiness, schedule health. |
| Finance | `/finance/*`, `/billing`, `/subscriptions`, `/invoices`, `/estimates`, `/payroll/*`, `/pricebook/*`, `/service-plans` | `finance_accounting_settings`, `finance_bookkeeping_settings`, `finance_bank_accounts`, `finance_*` child tables, `invoices`, `estimates`, `pricebook_items`, `payroll_*` tables | Relies on new finance tables plus legacy revenue data. |
| Integrations & API | `/integrations`, `/integrations/[id]`, `/development`, `/api`, `/customer-portal` | `integration_connections`, `integration_events`, `api_keys`, `webhooks`, `customer_portal_settings` | Tracks connected apps, API usage, webhook health. |
| Analytics & Telemetry | `/reporting`, `/tv`, analytics panel inside overview | `activities`, `usage_metrics` (materialized from jobs/customers), analytics events in `docs/ANALYTICS.md` | Combines Supabase usage tables with Vercel Analytics event streams. |

---

## Account & Identity

### Key Destinations

- `/dashboard/settings/profile/personal` – basic contact info and avatar.
- `/dashboard/settings/profile/preferences` – theme, timezone, language, dashboard defaults.
- `/dashboard/settings/profile/notifications/*` – channel-level opt-ins (email, push, SMS).
- `/dashboard/settings/profile/security/*` – password, 2FA, device recognition, login history.

### Supabase Sources

- `users` (`email`, `name`, `phone`, `last_login_at`, `email_verified`) for canonical identity.
- `profiles` (`active_company_id`, `onboarding_completed`) for workspace context.
- `user_preferences` (`theme`, `timezone`, `calendar_view`) for personalization defaults.
- `user_notification_preferences` (`email_*`, `push_*`, `sms_*`, digest fields) for completion bars.
- Authentication history pulled from `auth.audit_log_entries` (Supabase auth schema) for login/device timeline.

### Status & Metric Signals

- Completion percentage = required profile fields present (`name`, `phone`, `avatar`) + MFA enabled flag.
- Notification health = ratio of enabled channels vs recommended baseline (email + push + SMS).
- Security alerts triggered if `password_last_changed_at` older than policy threshold or if no 2FA secret stored.

### Implementation Notes

- Use a consolidated query via `createClient` to fetch user row + preferences + notifications in one RPC (leveraging Supabase’s ability to select nested tables).
- Map statuses to enums (`"complete"`, `"action_required"`, `"warning"`) for UI chips.
- Add quick action CTA metadata (e.g., “Enable MFA”) so the overview can deep-link to `/profile/security/2fa`.

---

## Workspace & Organization

### Key Destinations

- `/dashboard/settings/company` for branding, legal profile, support contacts.
- `/dashboard/settings/team/*` for member roster, invites, roles (`team`, `team/invite`, `team/roles`, `team/departments`).
- `/dashboard/settings/company-feed`, `/organizations`, `/tags`, `/lead-sources`.

### Supabase Sources

- `companies` (`legal_name`, `logo_url`, `industry`, `subscription_status`) and `company_settings` (`hours_of_operation`, `service_areas`).
- `team_members`, `custom_roles`, `departments`, `company_role_stats` for permission coverage and seat counts.
- `company_holidays` + scheduling metadata for hours calendars.
- `tags`, `lead_sources`, `customer_segments` tables for taxonomy coverage.

### Status & Metric Signals

- Company profile completeness (logo, branding colors, support email/phone).
- Seat utilization = active `team_members` vs plan limit derived from subscription metadata.
- Role hygiene = count of users without assigned role or department.
- Lead/Tag readiness = whether defaults exist plus last updated timestamp for taxonomy tables.

### Implementation Notes

- Scope every query by `company_id = profiles.active_company_id` to honor RLS.
- Expose aggregated counts in the overview payload for quick “X active users · Y pending invites”.
- Provide warnings when `subscription_current_period_end` is near and no payment method on file (tie into Finance cluster later).

---

## Communications

### Key Destinations

- `/dashboard/settings/communications/*` (email, SMS, phone, notifications, templates, IVR, voicemail, porting status, usage, call routing).
- `/dashboard/settings/marketing` for outbound campaigns.
- `/dashboard/settings/customer-portal`, `/customer-intake`, `/customers/preferences/privacy`.

### Supabase Sources

- `messaging_brands`, `messaging_campaigns`, `messaging_campaign_phone_numbers` (Telnyx registration status fields).
- `phone_numbers`, `phone_porting_requests`, `call_routing_rules`, `ivr_menus` for telephony readiness.
- `notification_queue`, `notification_templates`, `email_templates` for deliverability stats.
- `customer_portal_settings`, `customer_intake_forms`, `customer_preferences` for portal + intake UX settings.

### Status & Metric Signals

- Display brand/campaign state from `messaging_brands.status`, `messaging_campaigns.status`, and `telnyx_*` IDs to detect A2P compliance gaps.
- Phone health cards use `phone_numbers.status`, call volume counters (`incoming_calls_count`, `sms_sent_count`) and last sync time.
- Porting panel surfaces `phone_porting_requests.status` and `estimated_completion_date`.
- Notifications show backlog via `notification_queue` counts and failure rate vs success.
- Customer portal readiness derived from boolean flags inside `companies.portal_settings`.

### Implementation Notes

- Many tables share `company_id`; fetch through a single server-side loader grouped by channel to avoid N+1 calls.
- Cache expensive Telnyx stats for a few minutes using Next.js ISR since numbers rarely change per request.
- Provide quick actions (e.g., “Verify brand”, “Assign routing rule”) with CTA metadata referencing the detail routes.

---

## Operations

### Key Destinations

- `/dashboard/settings/jobs`, `/job-fields`, `/checklists`, `/service-plans`, `/purchase-orders`.
- `/dashboard/settings/schedule/*` (calendar, availability, dispatch rules, service areas, team scheduling).
- `/dashboard/settings/customer-intake`, `/customers/*` (loyalty, privacy).

### Supabase Sources

- `jobs`, `job_workflow_stages`, `job_types`, `job_templates` for workflow definitions and adoption metrics.
- `appointments`, `schedule_blocks`, `dispatch_rules`, `service_areas`, `team_members` for scheduling logic.
- `maintenance_plans` (service plans) and `purchase_orders` for recurring programs and procurement.
- `customer_intake_forms`, `customer_loyalty_programs`, `customer_privacy_settings` for intake/compliance areas.

### Status & Metric Signals

- Workflow coverage = # of active stages vs recommended template baseline.
- Scheduling health = ratio of staffed hours vs demand (appointments upcoming vs available schedule blocks) plus unassigned jobs count.
- Service plan insights = `maintenance_plans.status` and auto-renew toggles, plan count by tier.
- Purchase order automation = share of jobs with linked PO (`purchase_orders.job_id`) and PO approval backlog.

### Implementation Notes

- Lean on SQL views/materialized metrics where possible to precompute heavy ratios (e.g., jobs without assigned tech).
- Provide icons/warnings when critical automations (dispatch rules, service areas) are empty arrays.
- Use same normalized card model as other clusters for consistent rendering.

---

## Finance

### Key Destinations

- `/dashboard/settings/finance/*` (accounting, bookkeeping, bank accounts, virtual buckets, debit/gas/gift cards, financing).
- `/dashboard/settings/billing`, `/subscriptions`, `/billing/payment-methods`.
- `/dashboard/settings/invoices`, `/estimates`, `/pricebook`, `/payroll/*`.

### Supabase Sources

- Newly added finance tables from `supabase/migrations/20251102120000_add_finance_settings.sql`: `finance_accounting_settings`, `finance_bookkeeping_settings`, `finance_bank_accounts`, `finance_business_financing_settings`, `finance_consumer_financing_settings`, `finance_debit_cards`, `finance_gas_cards`, `finance_gift_card_settings`, `finance_virtual_bucket_settings`, plus transactional tables (`finance_virtual_buckets`, `finance_gift_cards`).
- Existing monetization tables: `invoices`, `estimates`, `pricebook_items`, `service_plans`, `subscriptions`, `payments`, `payroll_settings`, `payroll_*` child tables.
- `api_keys` (for accounting providers) when storing encrypted credentials.

### Status & Metric Signals

- Accounting integration health = `provider_enabled`, `last_sync_at`, and failure counts (store in `integration_events`).
- Bookkeeping automation readiness = boolean flags (`auto_categorize_transactions`, `auto_reconcile_payments`) + report schedule compliance.
- Bank account cards show primary/active flags, balances, Plaid sync age, and transaction import status.
- Financing modules surface toggles and eligibility inputs (annual revenue, credit score).
- Payroll health = compliance toggles (overtime, PTO), `payroll_schedule` completeness, pending callbacks.

### Implementation Notes

- Because many finance tables are one-to-one per company, the overview loader can fetch them concurrently and compose a unified payload.
- Sensitive fields (`api_key_encrypted`, `routing_number_encrypted`) should never be exposed directly—only derived status.
- Add quick links to actions like “Sync QuickBooks now”, “Add bank account”, “Configure payroll overtime”.

---

## Integrations & API

### Key Destinations

- `/dashboard/settings/integrations` grid + `/integrations/[id]` drill-ins.
- `/dashboard/settings/development` (API keys, webhooks, sandbox).
- `/dashboard/settings/customer-portal` (white-label portal + embed tokens).

### Supabase Sources

- `integration_connections` (provider, status, scopes, last_sync_at) and `integration_events` for failure telemetry.
- `api_keys` (`key_prefix`, `permissions`, `last_used_at`, `rate_limit`, `revoked_at`).
- `webhooks` / `webhook_deliveries` (if present) for inbound/outbound hook health.
- `customer_portal_settings` + `portal_sessions` for portal tokens and embed usage.

### Status & Metric Signals

- Connection health = `status` + `last_sync_at` age, warn if >24h.
- API hygiene = # active keys, oldest unused key age, keys missing expiration.
- Webhook reliability = delivery success rate (success vs failure attempts).
- Portal readiness = custom domain verified, theme configured, single sign-on tokens active.

### Implementation Notes

- Collate integration rows grouped by provider category (accounting, marketing, field hardware, analytics).
- Audit logs should capture when admins create/revoke API keys; pipe these events to analytics cluster.
- Provide instrumentation hooks for `settings.quick_action` events whenever admins trigger sync/revoke.

---

## Analytics & Telemetry

### Key Destinations

- `/dashboard/settings/reporting`, `/tv`, plus the new analytics panel on the overview page with deeper drill links.

### Supabase Sources & Event Streams

- `activities` table for audit-grade records of configuration changes (`category = 'settings'`, `entity_type` per cluster).
- Derived `usage_metrics` (if materialized) combining `jobs`, `customers`, `invoices` counts for adoption KPIs.
- `automation_runs`, `cron_logs`, or equivalent tables for workflow health (if not yet present, create view).
- Vercel analytics events from `docs/ANALYTICS.md`, particularly `settings.quick_action`, `settings.section_viewed`, and calculator/tool-based events for adoption funnels.

### Status & Metric Signals

- Highlight weekly active admins in settings (unique `settings.section_viewed` events).
- Show automation health (success vs failure) across communications, finance syncs, integrations.
- Alert on spikes in `settings.quick_action` toggles, e.g., many PO system disables might indicate incidents.

### Implementation Notes

- Server component should fetch Supabase aggregates (activities, adoption counts) while a client “telemetry island” listens for user interactions and sends analytics via `trackEvent`.
- Keep client payload tiny by streaming only chart data needed for the visible viewport; lazy-load heavy charts with `dynamic()` if required.
- Document every event name + payload in `docs/ANALYTICS.md` and ensure analytics hooks fire from the new UI primitives.

---

## Next Steps

1. Finalize data loader contract (`src/lib/settings/overview-data.ts`) to return the normalized structure described above.
2. Extract shared UI primitives (`SettingsShell`, `SettingsNav`, `SettingsSection`, `SettingsCard`) that accept the normalized objects.
3. Implement surface-specific quick actions (server actions + analytics tracking) aligned with each cluster’s CTA list.
4. Validate the overview with fixtures covering empty, partial, and fully configured companies to ensure copy stays clear.

