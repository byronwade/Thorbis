import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Building2,
	CreditCard,
	MessageSquare,
	Settings2,
	User,
	Zap,
} from "lucide-react";

export type SettingsClusterSlug =
	| "account"
	| "workspace"
	| "communications"
	| "operations"
	| "finance"
	| "integrations"
	| "analytics";

export type SettingsLinkDefinition = {
	title: string;
	description: string;
	href: string;
	supabaseSources: string[];
	tag?: "beta" | "new" | "soon";
};

export type SettingsClusterDefinition = {
	slug: SettingsClusterSlug;
	title: string;
	description: string;
	icon: LucideIcon;
	supabaseSources: string[];
	links: SettingsLinkDefinition[];
	documentation?: { title: string; href: string }[];
};

export const SETTINGS_INFORMATION_ARCHITECTURE: SettingsClusterDefinition[] = [
	{
		slug: "account",
		title: "Account",
		description: "Personal identity, authentication, preferences, and alerts",
		icon: User,
		supabaseSources: [
			"users",
			"profiles",
			"user_preferences",
			"user_notification_preferences",
		],
		links: [
			{
				title: "Personal Information",
				description: "Name, avatar, and verified contact details",
				href: "/dashboard/settings/profile/personal",
				supabaseSources: ["users", "profiles"],
			},
			{
				title: "Security",
				description: "Passwords, device logins, and 2FA",
				href: "/dashboard/settings/profile/security",
				supabaseSources: ["users"],
			},
			{
				title: "Notifications",
				description: "Email, push, SMS, and digest cadence",
				href: "/dashboard/settings/profile/notifications",
				supabaseSources: ["user_notification_preferences"],
			},
			{
				title: "Preferences",
				description: "Theme, timezone, language, and UI density",
				href: "/dashboard/settings/profile/preferences",
				supabaseSources: ["user_preferences"],
			},
		],
	},
	{
		slug: "workspace",
		title: "Workspace",
		description: "Company identity, subscription, and team governance",
		icon: Building2,
		supabaseSources: [
			"companies",
			"company_settings",
			"team_members",
			"team_invitations",
			"departments",
			"custom_roles",
			"api_keys",
			"tags",
			"lead_sources",
		],
		links: [
			{
				title: "Company Profile",
				description: "Legal details, branding, and public contact info",
				href: "/dashboard/settings/company",
				supabaseSources: ["companies", "company_settings"],
			},
			{
				title: "Billing & Subscription",
				description: "Plan, invoices, payment methods, and usage caps",
				href: "/dashboard/settings/billing",
				supabaseSources: ["companies", "invoices"],
			},
			{
				title: "Team & Permissions",
				description: "Members, invites, departments, and roles",
				href: "/dashboard/settings/team",
				supabaseSources: [
					"team_members",
					"team_invitations",
					"custom_roles",
					"departments",
				],
			},
			{
				title: "API Keys",
				description: "Machine-to-machine access and rate limits",
				href: "/dashboard/settings/integrations",
				supabaseSources: ["api_keys"],
			},
			{
				title: "Tags & Lead Sources",
				description: "Taxonomy for routing, reporting, and attribution",
				href: "/dashboard/settings/tags",
				supabaseSources: ["tags", "lead_sources"],
			},
		],
	},
	{
		slug: "communications",
		title: "Communications",
		description: "Email, SMS, phone, voicemail, and notification defaults",
		icon: MessageSquare,
		supabaseSources: [
			"communication_email_settings",
			"communication_sms_settings",
			"communication_phone_settings",
			"communication_notification_settings",
			"phone_numbers",
			"call_logs",
			"messaging_brands",
			"messaging_campaigns",
			"notification_queue",
			"phone_porting_requests",
		],
		links: [
			{
				title: "Email Settings",
				description: "SMTP, signatures, open tracking, deliverability",
				href: "/dashboard/settings/communications/email",
				supabaseSources: ["communication_email_settings"],
			},
			{
				title: "SMS & MMS",
				description: "Provider credentials, compliance, and auto-replies",
				href: "/dashboard/settings/communications/sms",
				supabaseSources: ["communication_sms_settings"],
			},
			{
				title: "Phone System",
				description: "Routing, IVR, voicemail, recordings, and usage",
				href: "/dashboard/settings/communications/phone",
				supabaseSources: ["communication_phone_settings", "phone_numbers"],
			},
			{
				title: "Notification Defaults",
				description: "Job, customer, invoice, and queue health",
				href: "/dashboard/settings/communications/notifications",
				supabaseSources: [
					"communication_notification_settings",
					"notification_queue",
				],
			},
			{
				title: "10DLC & Compliance",
				description: "Messaging brand and campaign registration",
				href: "/dashboard/settings/communications/usage",
				supabaseSources: ["messaging_brands", "messaging_campaigns"],
			},
			{
				title: "Porting Status",
				description: "Track number port requests and SLAs",
				href: "/dashboard/settings/communications/porting-status",
				supabaseSources: ["phone_porting_requests"],
			},
		],
	},
	{
		slug: "operations",
		title: "Operations",
		description: "Booking, scheduling, job workflows, and customer experiences",
		icon: Settings2,
		supabaseSources: [
			"job_settings",
			"schedule_availability_settings",
			"schedule_calendar_settings",
			"schedule_dispatch_rules",
			"schedule_team_rules",
			"customer_portal_settings",
			"customer_intake_settings",
			"customer_loyalty_settings",
		],
		links: [
			{
				title: "Booking Rules",
				description: "Availability windows, buffers, and automation",
				href: "/dashboard/settings/booking",
				supabaseSources: ["schedule_availability_settings"],
			},
			{
				title: "Job Configuration",
				description:
					"Job types, statuses, numbering, and completion requirements",
				href: "/dashboard/settings/jobs",
				supabaseSources: ["job_settings"],
			},
			{
				title: "Customer Intake",
				description: "Lead capture, custom questions, and assignments",
				href: "/dashboard/settings/customer-intake",
				supabaseSources: ["customer_intake_settings"],
			},
			{
				title: "Customer Portal",
				description: "Self-service access, branding, and feature toggles",
				href: "/dashboard/settings/customer-portal",
				supabaseSources: ["customer_portal_settings"],
			},
			{
				title: "Scheduling",
				description: "Team rules, dispatch policies, calendar defaults",
				href: "/dashboard/settings/schedule",
				supabaseSources: [
					"schedule_calendar_settings",
					"schedule_dispatch_rules",
					"schedule_team_rules",
				],
			},
			{
				title: "Loyalty & Rewards",
				description: "Points, rewards, and program notifications",
				href: "/dashboard/settings/customers/loyalty",
				supabaseSources: ["customer_loyalty_settings"],
			},
		],
	},
	{
		slug: "finance",
		title: "Finance",
		description: "Accounting syncs, billing tools, payments, and capital",
		icon: CreditCard,
		supabaseSources: [
			"finance_accounting_settings",
			"finance_bookkeeping_settings",
			"finance_bank_accounts",
			"finance_virtual_bucket_settings",
			"finance_virtual_buckets",
			"finance_business_financing_settings",
			"finance_consumer_financing_settings",
			"finance_debit_cards",
			"finance_gift_card_settings",
			"finance_gift_cards",
			"invoices",
			"payments",
		],
		links: [
			{
				title: "Accounting Integrations",
				description: "QuickBooks, Xero, sync cadence, and mappings",
				href: "/dashboard/settings/finance/accounting",
				supabaseSources: ["finance_accounting_settings"],
			},
			{
				title: "Bank Accounts",
				description: "Plaid connections, balances, and auto-import",
				href: "/dashboard/settings/finance/bank-accounts",
				supabaseSources: ["finance_bank_accounts"],
			},
			{
				title: "Virtual Buckets",
				description: "Profit-first allocations and automation",
				href: "/dashboard/settings/finance/virtual-buckets",
				supabaseSources: [
					"finance_virtual_bucket_settings",
					"finance_virtual_buckets",
				],
			},
			{
				title: "Gift & Debit Cards",
				description: "Spend controls, expiration policies, redemption data",
				href: "/dashboard/settings/finance/gift-cards",
				supabaseSources: [
					"finance_gift_card_settings",
					"finance_gift_cards",
					"finance_debit_cards",
				],
			},
			{
				title: "Financing Programs",
				description: "Consumer and business financing eligibility",
				href: "/dashboard/settings/finance/business-financing",
				supabaseSources: [
					"finance_business_financing_settings",
					"finance_consumer_financing_settings",
				],
			},
		],
	},
	{
		slug: "integrations",
		title: "Integrations",
		description: "Connected apps, webhooks, supplier feeds, and API usage",
		icon: Zap,
		supabaseSources: [
			"supplier_integrations",
			"api_keys",
			"communication_sms_settings",
			"finance_accounting_settings",
			"finance_bank_accounts",
			"webhooks",
			"webhook_logs",
		],
		links: [
			{
				title: "Integration Hub",
				description: "View and manage all connected platforms",
				href: "/dashboard/settings/integrations",
				supabaseSources: ["supplier_integrations", "api_keys"],
			},
			{
				title: "QuickBooks",
				description: "Two-way sync, error monitoring, and sync logs",
				href: "/dashboard/settings/finance/accounting",
				supabaseSources: ["finance_accounting_settings"],
			},
			{
				title: "Telnyx & Communications",
				description: "Phone numbers, SMS campaigns, and 10DLC",
				href: "/dashboard/settings/communications/phone-numbers",
				supabaseSources: ["phone_numbers", "communication_sms_settings"],
			},
			{
				title: "Supplier Catalogs",
				description: "Automated pricebook imports and refreshes",
				href: "/dashboard/settings/pricebook/integrations",
				supabaseSources: ["supplier_integrations"],
			},
			{
				title: "Webhooks & API access",
				description: "Keys, secrets, and delivery monitoring",
				href: "/dashboard/settings/development",
				supabaseSources: ["api_keys", "webhooks", "webhook_logs"],
			},
		],
	},
	{
		slug: "analytics",
		title: "Analytics & Telemetry",
		description: "Usage insights, automation health, and alerting",
		icon: BarChart3,
		supabaseSources: [
			"activities",
			"notifications",
			"call_logs",
			"jobs",
			"customers",
			"invoices",
		],
		links: [
			{
				title: "Mission Control",
				description: "Unified KPIs for operations and growth",
				href: "/dashboard/mission-control",
				supabaseSources: ["activities", "jobs", "customers"],
				tag: "beta",
			},
			{
				title: "Automation Runs",
				description: "Workflow throughput, failures, and retries",
				href: "/dashboard/settings/automation",
				supabaseSources: ["activities"],
			},
			{
				title: "Usage & Limits",
				description: "Plan allocation, metering, and alert policies",
				href: "/dashboard/settings/subscriptions",
				supabaseSources: ["activities", "companies"],
			},
		],
		documentation: [
			{
				title: "Thorbis Analytics Framework",
				href: "/docs/ANALYTICS.md",
			},
			{
				title: "Event Taxonomy",
				href: "/docs/ANALYTICS.md#event-taxonomy",
			},
		],
	},
];

const SETTINGS_CLUSTER_LOOKUP = new Map(
	SETTINGS_INFORMATION_ARCHITECTURE.map((cluster) => [cluster.slug, cluster]),
);

function getSettingsClusterDefinition(
	slug: SettingsClusterSlug,
): SettingsClusterDefinition | undefined {
	return SETTINGS_CLUSTER_LOOKUP.get(slug);
}
