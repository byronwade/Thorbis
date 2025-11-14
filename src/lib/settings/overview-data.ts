import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { requireActiveCompany } from "@/lib/auth/company-context";
import { requireUser } from "@/lib/auth/session";
import type { Database } from "@/types/supabase";
import {
  SETTINGS_INFORMATION_ARCHITECTURE,
  type SettingsClusterDefinition,
  type SettingsClusterSlug,
  type SettingsLinkDefinition,
} from "./information-architecture";
import {
  describeHealthStatus,
  deriveHealthStatus,
  formatTrendDelta,
  normalizeProgress,
  progressFromSteps,
  type HealthStatus,
} from "./status-utils";

type Tables = Database["public"]["Tables"];
type TypedSupabaseClient = SupabaseClient<Database>;

type CompanyRow = Tables["companies"]["Row"];
type CompanySettingsRow = Tables["company_settings"]["Row"] & {
  po_system_enabled?: boolean | null;
  po_system_last_enabled_at?: string | null;
};
type UserPreferencesRow = Tables["user_preferences"]["Row"];
type UserNotificationPreferencesRow = Tables["user_notification_preferences"]["Row"];
type CommunicationEmailSettingsRow = Tables["communication_email_settings"]["Row"];
type CommunicationSmsSettingsRow = Tables["communication_sms_settings"]["Row"];
type CommunicationPhoneSettingsRow = Tables["communication_phone_settings"]["Row"];
type CommunicationNotificationSettingsRow =
  Tables["communication_notification_settings"]["Row"];
type JobSettingsRow = Tables["job_settings"]["Row"];
type ScheduleAvailabilitySettingsRow = Tables["schedule_availability_settings"]["Row"];
type ScheduleCalendarSettingsRow = Tables["schedule_calendar_settings"]["Row"];
type FinanceAccountingSettingsRow = Tables["finance_accounting_settings"]["Row"];
type FinanceBookkeepingSettingsRow = Tables["finance_bookkeeping_settings"]["Row"];
type FinanceBankAccountRow = Tables["finance_bank_accounts"]["Row"];
type FinanceVirtualBucketSettingsRow = Tables["finance_virtual_bucket_settings"]["Row"];
type FinanceBusinessFinancingSettingsRow =
  Tables["finance_business_financing_settings"]["Row"];
type FinanceConsumerFinancingSettingsRow =
  Tables["finance_consumer_financing_settings"]["Row"];
type FinanceGiftCardSettingsRow = Tables["finance_gift_card_settings"]["Row"];
type CustomerPortalSettingsRow = Tables["customer_portal_settings"]["Row"];
type CustomerIntakeSettingsRow = Tables["customer_intake_settings"]["Row"];
type CustomerLoyaltySettingsRow = Tables["customer_loyalty_settings"]["Row"];
type ProfilesRow = Tables["profiles"]["Row"];

export type SettingsMetricDatum = {
  key: string;
  label: string;
  value: string;
  helper?: string;
  status?: HealthStatus;
  trend?: number;
};

export type SettingsChecklistItem = {
  key: string;
  label: string;
  href: string;
  completed: boolean;
  helper?: string;
  supabaseSources: string[];
};

export type SettingsQuickAction = {
  key: string;
  label: string;
  href: string;
  variant?: "default" | "outline" | "ghost";
  analyticsEvent?: string;
};

export type SettingsOverviewSection = {
  slug: SettingsClusterSlug;
  title: string;
  description: string;
  icon: SettingsClusterDefinition["icon"];
  progress: number;
  status: HealthStatus;
  summary: string;
  metrics: SettingsMetricDatum[];
  checklist: SettingsChecklistItem[];
  quickActions: SettingsQuickAction[];
  links: SettingsLinkDefinition[];
  documentation?: SettingsClusterDefinition["documentation"];
};

export type SettingsOverviewMeta = {
  companyName: string | null;
  subscriptionStatus: string | null;
  teamCount: number;
  alerts: string[];
  poSystemEnabled: boolean;
  poSystemLastEnabledAt: string | null;
  generatedAt: string;
};

export type SettingsOverviewData = {
  meta: SettingsOverviewMeta;
  sections: SettingsOverviewSection[];
};

type RawSettingsData = {
  generatedAt: string;
  company: CompanyRow | null;
  companySettings: CompanySettingsRow | null;
  profile: ProfilesRow | null;
  userPreferences: UserPreferencesRow | null;
  userNotificationPreferences: UserNotificationPreferencesRow | null;
  communicationEmailSettings: CommunicationEmailSettingsRow | null;
  communicationSmsSettings: CommunicationSmsSettingsRow | null;
  communicationPhoneSettings: CommunicationPhoneSettingsRow | null;
  communicationNotificationSettings: CommunicationNotificationSettingsRow | null;
  jobSettings: JobSettingsRow | null;
  scheduleAvailabilitySettings: ScheduleAvailabilitySettingsRow | null;
  scheduleCalendarSettings: ScheduleCalendarSettingsRow | null;
  accountingSettings: FinanceAccountingSettingsRow | null;
  bookkeepingSettings: FinanceBookkeepingSettingsRow | null;
  bankAccounts: FinanceBankAccountRow[];
  virtualBucketSettings: FinanceVirtualBucketSettingsRow | null;
  businessFinancingSettings: FinanceBusinessFinancingSettingsRow | null;
  consumerFinancingSettings: FinanceConsumerFinancingSettingsRow | null;
  giftCardSettings: FinanceGiftCardSettingsRow | null;
  portalSettings: CustomerPortalSettingsRow | null;
  intakeSettings: CustomerIntakeSettingsRow | null;
  loyaltySettings: CustomerLoyaltySettingsRow | null;
  teamCounts: { active: number; pendingInvites: number };
  customRolesCount: number;
  apiKeysCount: number;
  phoneNumbersCount: number;
  debitCardsCount: number;
  giftCardsActiveCount: number;
  virtualBucketsCount: number;
  scheduleDispatchRulesCount: number;
  scheduleTeamRulesCount: number;
  supplierIntegrationsCount: number;
  jobsTotalCount: number;
  jobsWeekCount: number;
  customersCount: number;
  invoicesOpenCount: number;
  activitiesWeekCount: number;
  automationWeekCount: number;
  notificationsWeekCount: number;
  callLogsWeekCount: number;
};

const DEFAULT_RAW_DATA: RawSettingsData = {
  generatedAt: new Date(0).toISOString(),
  company: null,
  companySettings: null,
  profile: null,
  userPreferences: null,
  userNotificationPreferences: null,
  communicationEmailSettings: null,
  communicationSmsSettings: null,
  communicationPhoneSettings: null,
  communicationNotificationSettings: null,
  jobSettings: null,
  scheduleAvailabilitySettings: null,
  scheduleCalendarSettings: null,
  accountingSettings: null,
  bookkeepingSettings: null,
  bankAccounts: [],
  virtualBucketSettings: null,
  businessFinancingSettings: null,
  consumerFinancingSettings: null,
  giftCardSettings: null,
  portalSettings: null,
  intakeSettings: null,
  loyaltySettings: null,
  teamCounts: { active: 0, pendingInvites: 0 },
  customRolesCount: 0,
  apiKeysCount: 0,
  phoneNumbersCount: 0,
  debitCardsCount: 0,
  giftCardsActiveCount: 0,
  virtualBucketsCount: 0,
  scheduleDispatchRulesCount: 0,
  scheduleTeamRulesCount: 0,
  supplierIntegrationsCount: 0,
  jobsTotalCount: 0,
  jobsWeekCount: 0,
  customersCount: 0,
  invoicesOpenCount: 0,
  activitiesWeekCount: 0,
  automationWeekCount: 0,
  notificationsWeekCount: 0,
  callLogsWeekCount: 0,
};

export const getSettingsOverviewData = cache(
  async (): Promise<SettingsOverviewData> => {
    const supabase = (await createClient()) as TypedSupabaseClient | null;
    if (!supabase) {
      return buildFallbackOverview(DEFAULT_RAW_DATA);
    }

    const user = await requireUser();
    const companyId = await requireActiveCompany();

    const rawData = await fetchRawSettingsData(supabase, companyId, user.id);
    return buildOverviewPayload(rawData);
  }
);

async function fetchRawSettingsData(
  supabase: TypedSupabaseClient,
  companyId: string,
  userId: string
): Promise<RawSettingsData> {
  try {
    const nowIso = new Date().toISOString();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString();

    const [
      company,
      companySettings,
      profile,
      userPreferences,
      userNotificationPreferences,
      communicationEmailSettings,
      communicationSmsSettings,
      communicationPhoneSettings,
      communicationNotificationSettings,
      jobSettings,
      scheduleAvailabilitySettings,
      scheduleCalendarSettings,
      accountingSettings,
      bookkeepingSettings,
      bankAccountsData,
      virtualBucketSettings,
      businessFinancingSettings,
      consumerFinancingSettings,
      giftCardSettings,
      portalSettings,
      intakeSettings,
      loyaltySettings,
      teamActiveCount,
      teamInviteCount,
      customRolesCount,
      apiKeysCount,
      phoneNumbersCount,
      debitCardsCount,
      giftCardsActiveCount,
      virtualBucketsCount,
      scheduleDispatchRulesCount,
      scheduleTeamRulesCount,
      jobsTotalCount,
      jobsWeekCount,
      customersCount,
      invoicesOpenCount,
      activitiesWeekCount,
      automationWeekCount,
      notificationsWeekCount,
      callLogsWeekCount,
    ] = await Promise.all([
      supabase
        .from("companies")
        .select(
          "id,name,logo,legal_name,phone,email,website,website_url,stripe_subscription_status,onboarding_step,onboarding_completed_at,subscription_cancel_at_period_end"
        )
        .eq("id", companyId)
        .maybeSingle<CompanyRow>(),
      supabase
        .from("company_settings")
        .select(
          "company_id,company_feed_enabled,feed_visibility,service_area_type,po_system_enabled,po_system_last_enabled_at"
        )
        .eq("company_id", companyId)
        .maybeSingle<CompanySettingsRow>(),
      supabase
        .from("profiles")
        .select("id,onboarding_completed")
        .eq("id", userId)
        .maybeSingle<ProfilesRow>(),
      supabase
        .from("user_preferences")
        .select(
          "user_id,timezone,theme,language,date_format,time_format,default_dashboard_view,default_page_size"
        )
        .eq("user_id", userId)
        .maybeSingle<UserPreferencesRow>(),
      supabase
        .from("user_notification_preferences")
        .select(
          "user_id,email_new_jobs,email_job_updates,email_mentions,email_messages,push_new_jobs,push_job_updates,push_mentions,push_messages,sms_schedule_changes,sms_urgent_jobs,digest_enabled,digest_frequency,in_app_all"
        )
        .eq("user_id", userId)
        .maybeSingle<UserNotificationPreferencesRow>(),
      supabase
        .from("communication_email_settings")
        .select(
          "company_id,smtp_enabled,smtp_host,smtp_from_email,auto_cc_enabled,default_signature,track_opens,track_clicks"
        )
        .eq("company_id", companyId)
        .maybeSingle<CommunicationEmailSettingsRow>(),
      supabase
        .from("communication_sms_settings")
        .select(
          "company_id,provider,sender_number,auto_reply_enabled,auto_reply_message,opt_out_message,consent_required"
        )
        .eq("company_id", companyId)
        .maybeSingle<CommunicationSmsSettingsRow>(),
      supabase
        .from("communication_phone_settings")
        .select(
          "company_id,routing_strategy,business_hours_only,fallback_number,voicemail_enabled,voicemail_email_notifications,recording_enabled,ivr_enabled"
        )
        .eq("company_id", companyId)
        .maybeSingle<CommunicationPhoneSettingsRow>(),
      supabase
        .from("communication_notification_settings")
        .select(
          "company_id,email_notifications,sms_notifications,push_notifications,in_app_notifications,notify_new_jobs,notify_job_updates,notify_invoice_overdue"
        )
        .eq("company_id", companyId)
        .maybeSingle<CommunicationNotificationSettingsRow>(),
      supabase
        .from("job_settings")
        .select(
          "company_id,default_job_status,auto_invoice_on_completion,require_customer_signature,require_completion_notes,track_technician_time,send_review_link_on_completion"
        )
        .eq("company_id", companyId)
        .maybeSingle<JobSettingsRow>(),
      supabase
        .from("schedule_availability_settings")
        .select(
          "company_id,default_work_hours,default_appointment_duration_minutes,buffer_time_minutes,min_booking_notice_hours,max_booking_advance_days"
        )
        .eq("company_id", companyId)
        .maybeSingle<ScheduleAvailabilitySettingsRow>(),
      supabase
        .from("schedule_calendar_settings")
        .select(
          "company_id,default_view,start_day_of_week,time_slot_duration_minutes,show_technician_colors,sync_with_google_calendar,sync_with_outlook"
        )
        .eq("company_id", companyId)
        .maybeSingle<ScheduleCalendarSettingsRow>(),
      supabase
        .from("finance_accounting_settings")
        .select(
          "company_id,provider,provider_enabled,auto_sync_enabled,last_sync_at,sync_frequency,sync_invoices,sync_payments,sync_expenses,sync_customers"
        )
        .eq("company_id", companyId)
        .maybeSingle<FinanceAccountingSettingsRow>(),
      supabase
        .from("finance_bookkeeping_settings")
        .select(
          "company_id,auto_categorize_transactions,auto_reconcile_payments,report_frequency,email_reports,report_recipients"
        )
        .eq("company_id", companyId)
        .maybeSingle<FinanceBookkeepingSettingsRow>(),
      supabase
        .from("finance_bank_accounts")
        .select(
          "id,company_id,account_name,bank_name,account_type,current_balance,available_balance,auto_import_transactions,is_primary,is_active"
        )
        .eq("company_id", companyId)
        .eq("is_active", true),
      supabase
        .from("finance_virtual_bucket_settings")
        .select(
          "company_id,virtual_buckets_enabled,auto_allocate_funds,allocation_frequency,operating_expenses_percentage,tax_reserve_percentage,profit_percentage,emergency_fund_percentage"
        )
        .eq("company_id", companyId)
        .maybeSingle<FinanceVirtualBucketSettingsRow>(),
      supabase
        .from("finance_business_financing_settings")
        .select(
          "company_id,enable_business_loans,enable_line_of_credit,enable_equipment_financing,financing_provider,auto_calculate_eligibility,show_offers_in_dashboard"
        )
        .eq("company_id", companyId)
        .maybeSingle<FinanceBusinessFinancingSettingsRow>(),
      supabase
        .from("finance_consumer_financing_settings")
        .select(
          "company_id,financing_enabled,provider,min_amount,max_amount,available_terms,show_in_estimates,show_in_invoices,promote_financing"
        )
        .eq("company_id", companyId)
        .maybeSingle<FinanceConsumerFinancingSettingsRow>(),
      supabase
        .from("finance_gift_card_settings")
        .select(
          "company_id,gift_cards_enabled,program_name,fixed_denominations,available_amounts,allow_online_purchase,allow_in_person_purchase,cards_expire,expiration_months"
        )
        .eq("company_id", companyId)
        .maybeSingle<FinanceGiftCardSettingsRow>(),
      supabase
        .from("customer_portal_settings")
        .select(
          "company_id,portal_enabled,allow_booking,allow_invoice_payment,allow_estimate_approval,show_service_history,welcome_message"
        )
        .eq("company_id", companyId)
        .maybeSingle<CustomerPortalSettingsRow>(),
      supabase
        .from("customer_intake_settings")
        .select(
          "company_id,require_phone,require_email,require_address,require_property_type,track_lead_source,auto_assign_technician,auto_create_job"
        )
        .eq("company_id", companyId)
        .maybeSingle<CustomerIntakeSettingsRow>(),
      supabase
        .from("customer_loyalty_settings")
        .select(
          "company_id,loyalty_enabled,program_name,points_per_dollar_spent,auto_apply_rewards,notify_on_points_earned"
        )
        .eq("company_id", companyId)
        .maybeSingle<CustomerLoyaltySettingsRow>(),
      getExactCount(supabase, "team_members", (query) =>
        query.eq("company_id", companyId).eq("status", "active")
      ),
      getExactCount(supabase, "team_invitations", (query) =>
        query.eq("company_id", companyId).is("used_at", null).gt("expires_at", nowIso)
      ),
      getExactCount(supabase, "custom_roles", (query) =>
        query.eq("company_id", companyId).eq("is_active", true)
      ),
      getExactCount(supabase, "api_keys", (query) =>
        query.eq("company_id", companyId).is("revoked_at", null)
      ),
      getExactCount(supabase, "phone_numbers", (query) =>
        query.eq("company_id", companyId).eq("status", "active")
      ),
      getExactCount(supabase, "finance_debit_cards", (query) =>
        query.eq("company_id", companyId).eq("is_active", true)
      ),
      getExactCount(supabase, "finance_gift_cards", (query) =>
        query.eq("company_id", companyId).eq("status", "active")
      ),
      getExactCount(supabase, "finance_virtual_buckets", (query) =>
        query.eq("company_id", companyId)
      ),
      getExactCount(supabase, "supplier_integrations", (query) =>
        query.eq("company_id", companyId)
      ),
      getExactCount(supabase, "schedule_dispatch_rules", (query) =>
        query.eq("company_id", companyId)
      ),
      getExactCount(supabase, "schedule_team_rules", (query) =>
        query.eq("company_id", companyId)
      ),
      getExactCount(supabase, "jobs", (query) => query.eq("company_id", companyId)),
      getExactCount(supabase, "jobs", (query) =>
        query.eq("company_id", companyId).gte("created_at", sevenDaysAgoIso)
      ),
      getExactCount(supabase, "customers", (query) => query.eq("company_id", companyId)),
      getExactCount(supabase, "invoices", (query) =>
        query.eq("company_id", companyId).in("status", ["open", "overdue"])
      ),
      getExactCount(supabase, "activities", (query) =>
        query.eq("company_id", companyId).gte("occurred_at", sevenDaysAgoIso)
      ),
      getExactCount(supabase, "activities", (query) =>
        query.eq("company_id", companyId).eq("category", "automation").gte("occurred_at", sevenDaysAgoIso)
      ),
      getExactCount(supabase, "notifications", (query) =>
        query.eq("company_id", companyId).gte("created_at", sevenDaysAgoIso)
      ),
      getExactCount(supabase, "call_logs", (query) =>
        query.eq("company_id", companyId).gte("created_at", sevenDaysAgoIso)
      ),
    ]);

    return {
      generatedAt: nowIso,
      company: company ?? null,
      companySettings: companySettings ?? null,
      profile: profile ?? null,
      userPreferences: userPreferences ?? null,
      userNotificationPreferences: userNotificationPreferences ?? null,
      communicationEmailSettings: communicationEmailSettings ?? null,
      communicationSmsSettings: communicationSmsSettings ?? null,
      communicationPhoneSettings: communicationPhoneSettings ?? null,
      communicationNotificationSettings: communicationNotificationSettings ?? null,
      jobSettings: jobSettings ?? null,
      scheduleAvailabilitySettings: scheduleAvailabilitySettings ?? null,
      scheduleCalendarSettings: scheduleCalendarSettings ?? null,
      accountingSettings: accountingSettings ?? null,
      bookkeepingSettings: bookkeepingSettings ?? null,
      bankAccounts: bankAccountsData ?? [],
      virtualBucketSettings: virtualBucketSettings ?? null,
      businessFinancingSettings: businessFinancingSettings ?? null,
      consumerFinancingSettings: consumerFinancingSettings ?? null,
      giftCardSettings: giftCardSettings ?? null,
      portalSettings: portalSettings ?? null,
      intakeSettings: intakeSettings ?? null,
      loyaltySettings: loyaltySettings ?? null,
      teamCounts: {
        active: teamActiveCount ?? 0,
        pendingInvites: teamInviteCount ?? 0,
      },
      customRolesCount: customRolesCount ?? 0,
      apiKeysCount: apiKeysCount ?? 0,
      phoneNumbersCount: phoneNumbersCount ?? 0,
      debitCardsCount: debitCardsCount ?? 0,
      giftCardsActiveCount: giftCardsActiveCount ?? 0,
      virtualBucketsCount: virtualBucketsCount ?? 0,
      scheduleDispatchRulesCount: scheduleDispatchRulesCount ?? 0,
      scheduleTeamRulesCount: scheduleTeamRulesCount ?? 0,
      supplierIntegrationsCount: supplierIntegrationsCount ?? 0,
      jobsTotalCount: jobsTotalCount ?? 0,
      jobsWeekCount: jobsWeekCount ?? 0,
      customersCount: customersCount ?? 0,
      invoicesOpenCount: invoicesOpenCount ?? 0,
      activitiesWeekCount: activitiesWeekCount ?? 0,
      automationWeekCount: automationWeekCount ?? 0,
      notificationsWeekCount: notificationsWeekCount ?? 0,
      callLogsWeekCount: callLogsWeekCount ?? 0,
    };
  } catch {
    return {
      ...DEFAULT_RAW_DATA,
      generatedAt: new Date().toISOString(),
    };
  }
}

function buildOverviewPayload(raw: RawSettingsData): SettingsOverviewData {
  const sections = SETTINGS_INFORMATION_ARCHITECTURE.map((definition) =>
    buildSection(definition, raw)
  );

  const alerts = sections
    .filter((section) => section.status !== "ready")
    .map((section) => describeHealthStatus(section.status) + ": " + section.title);

  return {
    meta: {
      companyName: raw.company?.name ?? null,
      subscriptionStatus: raw.company?.stripe_subscription_status ?? null,
      teamCount: raw.teamCounts.active,
      alerts,
      poSystemEnabled: Boolean(raw.companySettings?.po_system_enabled),
      poSystemLastEnabledAt: raw.companySettings?.po_system_last_enabled_at ?? null,
      generatedAt: raw.generatedAt,
    },
    sections,
  };
}

function buildFallbackOverview(raw: RawSettingsData): SettingsOverviewData {
  return buildOverviewPayload(raw);
}

function buildSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  switch (definition.slug) {
    case "account":
      return buildAccountSection(definition, raw);
    case "workspace":
      return buildWorkspaceSection(definition, raw);
    case "communications":
      return buildCommunicationsSection(definition, raw);
    case "operations":
      return buildOperationsSection(definition, raw);
    case "finance":
      return buildFinanceSection(definition, raw);
    case "integrations":
      return buildIntegrationsSection(definition, raw);
    case "analytics":
    default:
      return buildAnalyticsSection(definition, raw);
  }
}

function buildAccountSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const completedSteps = [
    Boolean(raw.profile?.onboarding_completed),
    Boolean(raw.userPreferences?.timezone),
    Boolean(raw.userNotificationPreferences?.email_new_jobs),
    Boolean(raw.userNotificationPreferences?.push_new_jobs),
  ];
  const progress = progressFromSteps(
    completedSteps.filter(Boolean).length,
    completedSteps.length
  );
  const status = deriveHealthStatus(progress);
  const summary =
    raw.profile?.onboarding_completed && progress >= 85
      ? "Your personal account is fully configured."
      : "Finish personal details and notification channels to unlock all admin tools.";

  const notificationChannels = [
    raw.userNotificationPreferences?.email_new_jobs,
    raw.userNotificationPreferences?.push_new_jobs,
    raw.userNotificationPreferences?.sms_urgent_jobs,
  ].filter(Boolean).length;

  const metrics: SettingsMetricDatum[] = [
    {
      key: "profile-completion",
      label: "Profile completion",
      value: `${progress}%`,
      helper: describeHealthStatus(status),
      status,
    },
    {
      key: "notification-channels",
      label: "Notification channels",
      value: `${notificationChannels}/3`,
      helper: "Email, push, SMS",
      status: notificationChannels >= 2 ? "ready" : "warning",
    },
    {
      key: "timezone",
      label: "Timezone",
      value: raw.userPreferences?.timezone ?? "Not set",
      helper: raw.userPreferences?.language ?? "English",
      status: raw.userPreferences?.timezone ? "ready" : "warning",
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "verify-email",
      label: "Verify login email",
      href: "/dashboard/settings/profile/personal",
      completed: Boolean(raw.profile?.onboarding_completed),
      supabaseSources: ["profiles"],
    },
    {
      key: "notifications",
      label: "Enable at least two notification channels",
      href: "/dashboard/settings/profile/notifications",
      completed: notificationChannels >= 2,
      supabaseSources: ["user_notification_preferences"],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "personal",
      label: "Update personal info",
      href: "/dashboard/settings/profile/personal",
      analyticsEvent: "settings.quick_action.personal_info",
    },
    {
      key: "notifications",
      label: "Tune notifications",
      href: "/dashboard/settings/profile/notifications",
      variant: "outline",
      analyticsEvent: "settings.quick_action.notifications",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress,
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

function buildWorkspaceSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const companyProfileFields = [
    raw.company?.legal_name,
    raw.company?.phone,
    raw.company?.website,
  ];
  const profileProgress = progressFromSteps(
    companyProfileFields.filter(Boolean).length,
    companyProfileFields.length
  );
  const billingReady =
    raw.company?.stripe_subscription_status === "active" ||
    raw.company?.stripe_subscription_status === "trialing";
  const progress = Math.round((profileProgress * 0.6 + (billingReady ? 100 : 40) * 0.4));
  const status = deriveHealthStatus(progress);
  const summary = billingReady
    ? "Workspace billing and profile are in good standing."
    : "Add a payment method to keep automations running.";

  const metrics: SettingsMetricDatum[] = [
    {
      key: "team-members",
      label: "Active teammates",
      value: raw.teamCounts.active.toString(),
      helper: `${raw.teamCounts.pendingInvites} pending invite(s)`,
      status: raw.teamCounts.active > 0 ? "ready" : "warning",
    },
    {
      key: "roles",
      label: "Custom roles",
      value: raw.customRolesCount.toString(),
      helper: raw.customRolesCount ? "Granular access in place" : "Using defaults",
      status: raw.customRolesCount ? "ready" : "warning",
    },
    {
      key: "api-keys",
      label: "API keys",
      value: raw.apiKeysCount.toString(),
      helper: "Machine integrations",
      status: raw.apiKeysCount ? "ready" : "warning",
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "company-profile",
      label: "Complete company profile",
      href: "/dashboard/settings/company",
      completed: profileProgress >= 85,
      helper: "Legal name, phone, and website",
      supabaseSources: ["companies", "company_settings"],
    },
    {
      key: "billing",
      label: "Verify billing + plan",
      href: "/dashboard/settings/billing",
      completed: billingReady,
      helper: raw.company?.stripe_subscription_status ?? "unknown",
      supabaseSources: ["companies", "invoices"],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "invite",
      label: "Invite teammate",
      href: "/dashboard/settings/team/invite",
      analyticsEvent: "settings.quick_action.invite_teammate",
    },
    {
      key: "roles",
      label: "Manage roles",
      href: "/dashboard/settings/team/roles",
      variant: "outline",
      analyticsEvent: "settings.quick_action.manage_roles",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress: normalizeProgress(progress),
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

function buildCommunicationsSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const emailConfigured = Boolean(
    raw.communicationEmailSettings?.smtp_enabled &&
      raw.communicationEmailSettings?.smtp_from_email
  );
  const smsConfigured = Boolean(
    raw.communicationSmsSettings?.provider && raw.communicationSmsSettings?.sender_number
  );
  const phoneConfigured = Boolean(
    raw.communicationPhoneSettings?.routing_strategy && raw.phoneNumbersCount > 0
  );
  const progress = progressFromSteps(
    [emailConfigured, smsConfigured, phoneConfigured].filter(Boolean).length,
    3
  );
  const status = deriveHealthStatus(progress);
  const summary =
    progress >= 85
      ? "Every channel is configured and redundant."
      : "Configure all channels to maximize deliverability.";

  const metrics: SettingsMetricDatum[] = [
    {
      key: "phone-numbers",
      label: "Active numbers",
      value: raw.phoneNumbersCount.toString(),
      helper: `${raw.callLogsWeekCount} calls last 7d`,
      status: raw.phoneNumbersCount ? "ready" : "warning",
    },
    {
      key: "notifications-sent",
      label: "Notifications sent",
      value: raw.notificationsWeekCount.toString(),
      helper: "Last 7 days",
    },
    {
      key: "tracking",
      label: "Email tracking",
      value: raw.communicationEmailSettings?.track_opens ? "Enabled" : "Disabled",
      helper: raw.communicationEmailSettings?.track_clicks
        ? "Click tracking on"
        : "Click tracking off",
      status: raw.communicationEmailSettings?.track_opens ? "ready" : "warning",
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "smtp",
      label: "Connect SMTP or branded email",
      href: "/dashboard/settings/communications/email",
      completed: emailConfigured,
      supabaseSources: ["communication_email_settings"],
    },
    {
      key: "sms",
      label: "Provision messaging number",
      href: "/dashboard/settings/communications/sms",
      completed: smsConfigured,
      supabaseSources: ["communication_sms_settings"],
    },
    {
      key: "phone",
      label: "Define routing + voicemail",
      href: "/dashboard/settings/communications/phone",
      completed: phoneConfigured,
      supabaseSources: ["communication_phone_settings", "phone_numbers"],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "buy-number",
      label: "Buy phone number",
      href: "/dashboard/settings/communications/phone-numbers",
      analyticsEvent: "settings.quick_action.buy_number",
    },
    {
      key: "email-template",
      label: "Edit email templates",
      href: "/dashboard/settings/communications/email-templates",
      variant: "outline",
      analyticsEvent: "settings.quick_action.email_template",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress,
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

function buildOperationsSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const bookingConfigured = Boolean(raw.scheduleAvailabilitySettings);
  const dispatchConfigured = raw.scheduleDispatchRulesCount > 0;
  const portalConfigured = Boolean(raw.portalSettings?.portal_enabled);
  const progress = progressFromSteps(
    [bookingConfigured, dispatchConfigured, portalConfigured].filter(Boolean).length,
    3
  );
  const status = deriveHealthStatus(progress);
  const summary =
    progress >= 85
      ? "Scheduling, portal, and workflows are dialed in."
      : "Tighten booking + dispatch rules to reduce slack time.";

  const metrics: SettingsMetricDatum[] = [
    {
      key: "jobs-week",
      label: "Jobs created (7d)",
      value: raw.jobsWeekCount.toString(),
      helper: `${raw.jobsTotalCount} total`,
    },
    {
      key: "dispatch-rules",
      label: "Dispatch rules",
      value: raw.scheduleDispatchRulesCount.toString(),
      helper: raw.scheduleTeamRulesCount
        ? `${raw.scheduleTeamRulesCount} team rules`
        : "No team overrides",
      status: raw.scheduleDispatchRulesCount ? "ready" : "warning",
    },
    {
      key: "portal",
      label: "Customer portal",
      value: raw.portalSettings?.portal_enabled ? "Enabled" : "Disabled",
      helper: raw.portalSettings?.welcome_message ? "Custom welcome" : "Default copy",
      status: raw.portalSettings?.portal_enabled ? "ready" : "warning",
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "booking",
      label: "Review booking rules",
      href: "/dashboard/settings/booking",
      completed: bookingConfigured,
      supabaseSources: ["schedule_availability_settings"],
    },
    {
      key: "dispatch",
      label: "Define dispatch automation",
      href: "/dashboard/settings/schedule/dispatch-rules",
      completed: dispatchConfigured,
      supabaseSources: ["schedule_dispatch_rules"],
    },
    {
      key: "portal",
      label: "Enable customer portal",
      href: "/dashboard/settings/customer-portal",
      completed: portalConfigured,
      supabaseSources: ["customer_portal_settings"],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "intake",
      label: "Customize intake form",
      href: "/dashboard/settings/customer-intake",
      analyticsEvent: "settings.quick_action.intake",
    },
    {
      key: "service-areas",
      label: "Manage service areas",
      href: "/dashboard/settings/schedule/service-areas",
      variant: "outline",
      analyticsEvent: "settings.quick_action.service_areas",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress,
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

function buildFinanceSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const accountingConnected =
    Boolean(raw.accountingSettings?.provider_enabled) &&
    Boolean(raw.accountingSettings?.provider);
  const bankConnected = raw.bankAccounts.length > 0;
  const collectionsHealthy = raw.invoicesOpenCount < Math.max(5, raw.jobsWeekCount);
  const progress = progressFromSteps(
    [accountingConnected, bankConnected, collectionsHealthy].filter(Boolean).length,
    3
  );
  const status = deriveHealthStatus(progress);
  const summary =
    progress >= 85
      ? "Accounting syncs and billing tools look healthy."
      : "Connect accounting + banking to unlock automations.";

  const metrics: SettingsMetricDatum[] = [
    {
      key: "bank-accounts",
      label: "Connected accounts",
      value: raw.bankAccounts.length.toString(),
      helper: raw.bankAccounts.find((account) => account.is_primary)?.bank_name ?? "None primary",
      status: bankConnected ? "ready" : "danger",
    },
    {
      key: "open-invoices",
      label: "Open invoices",
      value: raw.invoicesOpenCount.toString(),
      helper: "Awaiting payment",
      status: collectionsHealthy ? "ready" : "warning",
    },
    {
      key: "virtual-buckets",
      label: "Virtual buckets",
      value: raw.virtualBucketsCount.toString(),
      helper: raw.virtualBucketSettings?.virtual_buckets_enabled
        ? "Automation enabled"
        : "Automation off",
      status: raw.virtualBucketSettings?.virtual_buckets_enabled ? "ready" : "warning",
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "accounting",
      label: "Connect accounting provider",
      href: "/dashboard/settings/finance/accounting",
      completed: accountingConnected,
      supabaseSources: ["finance_accounting_settings"],
    },
    {
      key: "banking",
      label: "Add a primary bank account",
      href: "/dashboard/settings/finance/bank-accounts",
      completed: bankConnected,
      supabaseSources: ["finance_bank_accounts"],
    },
    {
      key: "financing",
      label: "Enable financing programs",
      href: "/dashboard/settings/finance/consumer-financing",
      completed:
        Boolean(raw.consumerFinancingSettings?.financing_enabled) ||
        Boolean(raw.businessFinancingSettings?.enable_business_loans),
      supabaseSources: [
        "finance_consumer_financing_settings",
        "finance_business_financing_settings",
      ],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "gift-cards",
      label: "Launch gift cards",
      href: "/dashboard/settings/finance/gift-cards",
      analyticsEvent: "settings.quick_action.gift_cards",
    },
    {
      key: "virtual-buckets",
      label: "Tune profit buckets",
      href: "/dashboard/settings/finance/virtual-buckets",
      variant: "outline",
      analyticsEvent: "settings.quick_action.virtual_buckets",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress,
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

function buildIntegrationsSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const hasIntegrations =
    raw.supplierIntegrationsCount > 0 ||
    raw.apiKeysCount > 0 ||
    Boolean(raw.accountingSettings?.provider_enabled) ||
    raw.phoneNumbersCount > 0;
  const progress = hasIntegrations ? 90 : 45;
  const status = deriveHealthStatus(progress);
  const summary = hasIntegrations
    ? "Key integrations are active."
    : "Connect at least one system to unlock automation.";

  const metrics: SettingsMetricDatum[] = [
    {
      key: "api-usage",
      label: "API keys",
      value: raw.apiKeysCount.toString(),
      helper: raw.apiKeysCount ? "Rotate regularly" : "No active keys",
      status: raw.apiKeysCount ? "ready" : "warning",
    },
    {
      key: "supplier-feeds",
      label: "Supplier integrations",
      value: raw.supplierIntegrationsCount.toString(),
      helper: raw.supplierIntegrationsCount
        ? "Catalog sync enabled"
        : "No supplier feeds",
      status: raw.supplierIntegrationsCount ? "ready" : "warning",
    },
    {
      key: "bank-sync",
      label: "Accounting sync",
      value: raw.accountingSettings?.provider ?? "Not connected",
      helper: raw.accountingSettings?.last_sync_at
        ? `Last sync ${new Date(raw.accountingSettings.last_sync_at).toLocaleDateString()}`
        : "Never synced",
      status: raw.accountingSettings?.provider_enabled ? "ready" : "warning",
    },
    {
      key: "phone-integrations",
      label: "Telecom integrations",
      value: raw.phoneNumbersCount ? "Active" : "None",
      helper: `${raw.callLogsWeekCount} calls last 7d`,
      status: raw.phoneNumbersCount ? "ready" : "warning",
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "supplier-integrations",
      label: "Connect supplier catalogs",
      href: "/dashboard/settings/pricebook/integrations",
      completed: raw.supplierIntegrationsCount > 0,
      supabaseSources: ["supplier_integrations"],
    },
    {
      key: "webhooks",
      label: "Issue API key + webhook secret",
      href: "/dashboard/settings/integrations",
      completed: raw.apiKeysCount > 0,
      supabaseSources: ["api_keys"],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "integration-hub",
      label: "Open integration hub",
      href: "/dashboard/settings/integrations",
      analyticsEvent: "settings.quick_action.integration_hub",
    },
    {
      key: "api-docs",
      label: "View API docs",
      href: "/docs/api",
      variant: "outline",
      analyticsEvent: "settings.quick_action.api_docs",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress,
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

function buildAnalyticsSection(
  definition: SettingsClusterDefinition,
  raw: RawSettingsData
): SettingsOverviewSection {
  const activityTrend =
    raw.activitiesWeekCount && raw.jobsWeekCount
      ? normalizeProgress((raw.activitiesWeekCount / (raw.jobsWeekCount || 1)) * 100)
      : 0;
  const progress = normalizeProgress(
    Math.round((activityTrend + (raw.notificationsWeekCount ? 100 : 40)) / 2)
  );
  const status = deriveHealthStatus(progress);
  const summary =
    raw.activitiesWeekCount > 0
      ? "Telemetry is flowing across automation, comms, and jobs."
      : "No analytics events detected in the last 7 days.";

  const metrics: SettingsMetricDatum[] = [
    {
      key: "activities",
      label: "Activity stream",
      value: raw.activitiesWeekCount.toString(),
      helper: "Events last 7 days",
      status: raw.activitiesWeekCount ? "ready" : "danger",
    },
    {
      key: "automation",
      label: "Automation runs",
      value: raw.automationWeekCount.toString(),
      helper: formatTrendDelta(
        raw.activitiesWeekCount ? (raw.automationWeekCount / raw.activitiesWeekCount) * 100 - 50 : 0
      ),
    },
    {
      key: "alerts",
      label: "Notifications delivered",
      value: raw.notificationsWeekCount.toString(),
      helper: `${raw.callLogsWeekCount} calls logged`,
    },
  ];

  const checklist: SettingsChecklistItem[] = [
    {
      key: "mission-control",
      label: "Pin mission control dashboard",
      href: "/dashboard/mission-control",
      completed: raw.activitiesWeekCount > 0,
      supabaseSources: ["activities"],
    },
    {
      key: "automation-audit",
      label: "Audit automation failures weekly",
      href: "/dashboard/settings/automation",
      completed: raw.automationWeekCount > 0,
      supabaseSources: ["activities"],
    },
  ];

  const quickActions: SettingsQuickAction[] = [
    {
      key: "open-analytics-docs",
      label: "Review analytics playbook",
      href: "/docs/ANALYTICS.md",
      analyticsEvent: "settings.quick_action.analytics_docs",
    },
    {
      key: "instrument",
      label: "Instrument new event",
      href: "/dashboard/settings/development",
      variant: "outline",
      analyticsEvent: "settings.quick_action.instrument_event",
    },
  ];

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    progress,
    status,
    summary,
    metrics,
    checklist,
    quickActions,
    links: definition.links,
    documentation: definition.documentation,
  };
}

async function getExactCount(
  supabase: TypedSupabaseClient,
  table: keyof Tables,
  build?: (query: any) => any
): Promise<number> {
  let query = supabase.from(table as string).select("id", { count: "exact", head: true });

  if (build) {
    query = build(query);
  }

  const { count } = await query;
  return count ?? 0;
}

