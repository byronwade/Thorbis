export type IntegrationCategory =
	| "all"
	| "accounting"
	| "communication"
	| "marketing"
	| "payment"
	| "crm"
	| "scheduling"
	| "analytics";

export type Integration = {
	id: string;
	name: string;
	description: string;
	category: IntegrationCategory;
	icon?: string;
	color: string;
	isConnected: boolean;
	isPremium?: boolean;
	website?: string;
	features?: string[];
};

// Compiled from HouseCall Pro, Jobber, and ServiceTitan integrations
// Using Clearbit logo API for real company logos
export const integrations: Integration[] = [
	// Accounting
	{
		id: "quickbooks-online",
		name: "QuickBooks Online",
		description:
			"Sync invoices, payments, and customer data with QuickBooks Online for seamless accounting.",
		category: "accounting",
		icon: "https://logo.clearbit.com/quickbooks.intuit.com",
		color: "bg-green-600",
		isConnected: true,
		website: "https://quickbooks.intuit.com",
		features: [
			"Invoice sync",
			"Payment tracking",
			"Customer data",
			"Tax reports",
		],
	},
	{
		id: "quickbooks-desktop",
		name: "QuickBooks Desktop",
		description:
			"Connect your QuickBooks Desktop for automated financial record keeping.",
		category: "accounting",
		icon: "https://logo.clearbit.com/quickbooks.intuit.com",
		color: "bg-green-600",
		isConnected: false,
		website: "https://quickbooks.intuit.com",
		features: ["Desktop sync", "Financial reports", "Inventory tracking"],
	},
	{
		id: "sage-intacct",
		name: "Sage Intacct",
		description:
			"Enterprise-grade financial management and accounting software integration.",
		category: "accounting",
		icon: "https://logo.clearbit.com/sageintacct.com",
		color: "bg-emerald-600",
		isConnected: false,
		isPremium: true,
		website: "https://www.sageintacct.com",
		features: [
			"Multi-entity accounting",
			"Advanced reporting",
			"Revenue recognition",
		],
	},
	{
		id: "xero",
		name: "Xero",
		description:
			"Beautiful accounting software for small businesses with real-time collaboration.",
		category: "accounting",
		icon: "https://logo.clearbit.com/xero.com",
		color: "bg-blue-600",
		isConnected: false,
		website: "https://www.xero.com",
		features: [
			"Bank reconciliation",
			"Expense tracking",
			"Payroll integration",
		],
	},

	// Payment Processing
	{
		id: "stripe",
		name: "Stripe",
		description:
			"Accept payments online and in-person with the world's leading payment platform.",
		category: "payment",
		icon: "https://logo.clearbit.com/stripe.com",
		color: "bg-indigo-600",
		isConnected: true,
		website: "https://stripe.com",
		features: [
			"Online payments",
			"Recurring billing",
			"Mobile payments",
			"Payment links",
		],
	},
	{
		id: "square",
		name: "Square",
		description:
			"All-in-one payment processing, point of sale, and business management tools.",
		category: "payment",
		icon: "https://logo.clearbit.com/squareup.com",
		color: "bg-black",
		isConnected: false,
		website: "https://squareup.com",
		features: ["POS system", "Invoicing", "Payment processing", "Inventory"],
	},
	{
		id: "paypal",
		name: "PayPal",
		description:
			"Accept PayPal payments and offer flexible payment options to customers.",
		category: "payment",
		icon: "https://logo.clearbit.com/paypal.com",
		color: "bg-blue-700",
		isConnected: false,
		website: "https://www.paypal.com",
		features: ["Online checkout", "Pay later options", "Global payments"],
	},
	{
		id: "wisetack",
		name: "Wisetack",
		description:
			"Offer consumer financing options to increase job approval rates and ticket sizes.",
		category: "payment",
		icon: "https://logo.clearbit.com/wisetack.com",
		color: "bg-purple-600",
		isConnected: false,
		website: "https://www.wisetack.com",
		features: [
			"Point-of-sale financing",
			"Instant approval",
			"No impact to credit",
		],
	},

	// Communication
	{
		id: "twilio",
		name: "Twilio",
		description:
			"Send SMS, make calls, and communicate with customers via phone.",
		category: "communication",
		icon: "https://logo.clearbit.com/twilio.com",
		color: "bg-red-600",
		isConnected: true,
		website: "https://www.twilio.com",
		features: ["SMS messaging", "Voice calls", "Video calls", "WhatsApp"],
	},
	{
		id: "slack",
		name: "Slack",
		description:
			"Get real-time notifications and collaborate with your team in Slack channels.",
		category: "communication",
		icon: "https://logo.clearbit.com/slack.com",
		color: "bg-purple-600",
		isConnected: true,
		website: "https://slack.com",
		features: ["Team messaging", "File sharing", "Workflow automation"],
	},
	{
		id: "microsoft-teams",
		name: "Microsoft Teams",
		description:
			"Collaborate with your team and share updates through Microsoft Teams.",
		category: "communication",
		icon: "https://logo.clearbit.com/microsoft.com",
		color: "bg-blue-700",
		isConnected: false,
		website: "https://www.microsoft.com/teams",
		features: ["Video meetings", "Chat", "File collaboration", "Calendar"],
	},
	{
		id: "ringcentral",
		name: "RingCentral",
		description: "Business phone system with calls, SMS, and team messaging.",
		category: "communication",
		icon: "https://logo.clearbit.com/ringcentral.com",
		color: "bg-orange-600",
		isConnected: false,
		website: "https://www.ringcentral.com",
		features: [
			"VoIP",
			"Video conferencing",
			"Team messaging",
			"Call analytics",
		],
	},

	// Marketing & CRM
	{
		id: "mailchimp",
		name: "Mailchimp",
		description:
			"Send targeted email campaigns and newsletters to your customer base.",
		category: "marketing",
		icon: "https://logo.clearbit.com/mailchimp.com",
		color: "bg-yellow-500",
		isConnected: false,
		website: "https://mailchimp.com",
		features: ["Email campaigns", "Automation", "Analytics", "Landing pages"],
	},
	{
		id: "hubspot",
		name: "HubSpot",
		description:
			"All-in-one CRM platform for marketing, sales, and customer service.",
		category: "crm",
		icon: "https://logo.clearbit.com/hubspot.com",
		color: "bg-orange-600",
		isConnected: true,
		website: "https://www.hubspot.com",
		features: ["CRM", "Marketing automation", "Sales pipeline", "Live chat"],
	},
	{
		id: "salesforce",
		name: "Salesforce",
		description: "World's #1 CRM platform for managing customer relationships.",
		category: "crm",
		icon: "https://logo.clearbit.com/salesforce.com",
		color: "bg-blue-600",
		isConnected: false,
		isPremium: true,
		website: "https://www.salesforce.com",
		features: ["Sales Cloud", "Service Cloud", "Marketing Cloud", "Analytics"],
	},
	{
		id: "sendgrid",
		name: "SendGrid",
		description:
			"Deliver transactional and marketing emails at scale with SendGrid.",
		category: "marketing",
		icon: "https://logo.clearbit.com/sendgrid.com",
		color: "bg-blue-500",
		isConnected: false,
		website: "https://sendgrid.com",
		features: ["Email delivery", "Templates", "Analytics", "A/B testing"],
	},
	{
		id: "constant-contact",
		name: "Constant Contact",
		description: "Email marketing and automation tools for small businesses.",
		category: "marketing",
		icon: "https://logo.clearbit.com/constantcontact.com",
		color: "bg-blue-600",
		isConnected: false,
		website: "https://www.constantcontact.com",
		features: ["Email marketing", "Social media", "Event management"],
	},

	// Scheduling & Calendar
	{
		id: "google-calendar",
		name: "Google Calendar",
		description:
			"Sync your schedule with Google Calendar for seamless planning.",
		category: "scheduling",
		icon: "https://logo.clearbit.com/google.com",
		color: "bg-blue-600",
		isConnected: true,
		website: "https://calendar.google.com",
		features: ["Calendar sync", "Event reminders", "Shared calendars"],
	},
	{
		id: "calendly",
		name: "Calendly",
		description:
			"Automated scheduling for customer appointments and consultations.",
		category: "scheduling",
		icon: "https://logo.clearbit.com/calendly.com",
		color: "bg-blue-600",
		isConnected: false,
		website: "https://calendly.com",
		features: ["Online booking", "Calendar integration", "Automated reminders"],
	},
	{
		id: "microsoft-outlook",
		name: "Microsoft Outlook",
		description:
			"Sync appointments and emails with Microsoft Outlook calendar.",
		category: "scheduling",
		icon: "https://logo.clearbit.com/microsoft.com",
		color: "bg-blue-700",
		isConnected: false,
		website: "https://outlook.com",
		features: ["Email", "Calendar", "Contacts", "Tasks"],
	},

	// Analytics & Reporting
	{
		id: "google-analytics",
		name: "Google Analytics",
		description:
			"Track website traffic and customer behavior with Google Analytics.",
		category: "analytics",
		icon: "https://logo.clearbit.com/google.com",
		color: "bg-orange-600",
		isConnected: false,
		website: "https://analytics.google.com",
		features: ["Website analytics", "User behavior", "Conversion tracking"],
	},
	{
		id: "databox",
		name: "Databox",
		description:
			"Create custom dashboards and track KPIs from all your business tools.",
		category: "analytics",
		icon: "https://logo.clearbit.com/databox.com",
		color: "bg-green-600",
		isConnected: false,
		website: "https://databox.com",
		features: ["Custom dashboards", "KPI tracking", "Data visualization"],
	},

	// Automation & Productivity
	{
		id: "zapier",
		name: "Zapier",
		description:
			"Connect Thorbis with 5,000+ apps and automate workflows without code.",
		category: "all",
		icon: "https://logo.clearbit.com/zapier.com",
		color: "bg-orange-500",
		isConnected: true,
		website: "https://zapier.com",
		features: [
			"Workflow automation",
			"5000+ app connections",
			"Multi-step zaps",
		],
	},
	{
		id: "make",
		name: "Make (Integromat)",
		description: "Visual platform to design, build, and automate workflows.",
		category: "all",
		icon: "https://logo.clearbit.com/make.com",
		color: "bg-purple-600",
		isConnected: false,
		website: "https://www.make.com",
		features: ["Visual automation", "API connections", "Advanced logic"],
	},

	// Lead Generation
	{
		id: "angi",
		name: "Angi (Angie's List)",
		description:
			"Receive and manage leads from Angi directly in your dashboard.",
		category: "crm",
		icon: "https://logo.clearbit.com/angi.com",
		color: "bg-red-600",
		isConnected: false,
		website: "https://www.angi.com",
		features: ["Lead generation", "Customer reviews", "Service requests"],
	},
	{
		id: "thumbtack",
		name: "Thumbtack",
		description:
			"Get matched with customers looking for your services on Thumbtack.",
		category: "crm",
		icon: "https://logo.clearbit.com/thumbtack.com",
		color: "bg-blue-600",
		isConnected: false,
		website: "https://www.thumbtack.com",
		features: ["Lead generation", "Instant match", "Customer reviews"],
	},
	{
		id: "home-depot",
		name: "The Home Depot",
		description:
			"Partner with The Home Depot to offer services to their customers.",
		category: "crm",
		icon: "https://logo.clearbit.com/homedepot.com",
		color: "bg-orange-600",
		isConnected: false,
		isPremium: true,
		website: "https://www.homedepot.com",
		features: ["Lead generation", "Pro referrals", "Brand partnership"],
	},

	// GPS & Fleet Management
	{
		id: "fleetsharp",
		name: "FleetSharp",
		description:
			"Live GPS tracking and fleet management for your service vehicles.",
		category: "all",
		icon: "https://logo.clearbit.com/fleetsharp.com",
		color: "bg-blue-700",
		isConnected: false,
		website: "https://www.fleetsharp.com",
		features: ["GPS tracking", "Route optimization", "Driver behavior"],
	},

	// Payroll
	{
		id: "gusto",
		name: "Gusto",
		description: "Modern payroll, benefits, and HR management for your team.",
		category: "all",
		icon: "https://logo.clearbit.com/gusto.com",
		color: "bg-red-500",
		isConnected: false,
		website: "https://gusto.com",
		features: ["Payroll", "Benefits", "Time tracking", "HR tools"],
	},

	// Documentation
	{
		id: "companycam",
		name: "CompanyCam",
		description:
			"Capture and organize photos from every job site automatically.",
		category: "all",
		icon: "https://logo.clearbit.com/companycam.com",
		color: "bg-blue-600",
		isConnected: false,
		website: "https://companycam.com",
		features: ["Photo documentation", "Project timeline", "Client sharing"],
	},
];
