import type { MarketingIndustryContent } from "./types";

const INDUSTRY_CONTENT: MarketingIndustryContent[] = [
	{
		kind: "industry",
		slug: "hvac",
		name: "HVAC Contractors",
		designVariant: "thermal",
		heroEyebrow: "Heating • Cooling • Ventilation • Indoor Air Quality",
		heroTitle: "The #1 HVAC Business Software for Growing Contractors",
		heroDescription:
			"From emergency AC repairs to $50K system replacements, Thorbis helps HVAC contractors schedule smarter, dispatch faster, and get paid same-day. Manage residential service calls, commercial maintenance contracts, and new construction installs—all from one platform built specifically for heating and cooling professionals.",
		heroImage:
			"https://images.unsplash.com/photo-1507400492013-162706c8c837?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis is the complete HVAC business management platform trusted by residential and commercial contractors across the country. Our software handles everything from initial customer calls to final invoicing—including smart scheduling that accounts for technician certifications (EPA 608, NATE), equipment requirements, and drive time optimization. Whether you're running a 3-truck operation or managing 50+ technicians across multiple locations, Thorbis scales with your HVAC business while keeping overhead low at just $200/month base with unlimited users.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "View Pricing",
			href: "/pricing",
		},
		seo: {
			title: "HVAC Service Software & Dispatch | #1 for Contractors | Thorbis",
			description:
				"Best HVAC software for contractors. Manage scheduling, dispatch, maintenance agreements, invoicing & customer portals. $200/mo unlimited users. Trusted by 500+ HVAC companies.",
			keywords: [
				"hvac service software",
				"hvac business software",
				"hvac dispatch software",
				"hvac scheduling software",
				"hvac maintenance agreement software",
				"hvac contractor software",
				"hvac field service management",
				"hvac crm software",
				"hvac invoicing software",
				"hvac technician app",
				"hvac mobile app",
				"servicetitan alternative hvac",
				"housecall pro hvac",
				"jobber hvac alternative",
				"best hvac software 2024",
				"hvac business management",
				"hvac customer management",
				"hvac agreement management",
				"hvac install software",
				"commercial hvac software",
			],
		},
		fieldTypes: [
			"Residential Service",
			"Light Commercial",
			"New Construction",
			"Commercial HVAC",
		],
		painPoints: [
			"Summer and winter peaks overwhelm dispatch boards—customers wait hours for callbacks while competitors win the job.",
			"Maintenance agreement renewals slip through the cracks, losing $50K+ in recurring revenue annually.",
			"Install crews and service techs fight over shared equipment, trucks, and scheduling resources.",
			"Technicians waste 2+ hours daily on paperwork instead of completing revenue-generating calls.",
			"No visibility into technician locations, job status, or customer history during emergency dispatches.",
		],
		valueProps: [
			{
				title: "Maintenance Agreement Automation",
				description:
					"Auto-renew service contracts, schedule seasonal tune-ups, send reminder campaigns, and bill monthly/annually with autopay. Never lose a maintenance customer again.",
				icon: "refresh-cw",
			},
			{
				title: "Install & Service Coordination",
				description:
					"Manage multi-day system installations alongside same-day service calls. Shared inventory, crew scheduling, and progress billing keep projects profitable.",
				icon: "calendar-range",
			},
			{
				title: "Smart Upsell & Financing",
				description:
					"Present good-better-best options with built-in financing approval. IAQ add-ons, duct cleaning, and system upgrades increase average ticket by 19%.",
				icon: "sparkles",
			},
			{
				title: "Real-Time Tech Tracking",
				description:
					"GPS tracking, job status updates, and photo documentation give dispatchers complete visibility. Know where every tech is and what they're working on.",
				icon: "map-pin",
			},
		],
		playbook: [
			{
				title: "Pre-Season Tune-Up Blitz",
				description:
					"6 weeks before peak season: segment maintenance customers by equipment age, launch automated email/text campaigns, and use AI-powered booking to fill crews. Teams using this playbook see 40% higher spring/fall revenue.",
			},
			{
				title: "Install-to-Service Handoff",
				description:
					"Capture install details, register warranties automatically, and create first-year service reminders. Service techs arrive with full equipment history, serial numbers, and customer preferences.",
			},
			{
				title: "Emergency Call Triage",
				description:
					"AI-powered intake scores emergency priority (no heat in winter = critical), captures photos, and dispatches the nearest certified technician. Average response time drops to 45 minutes.",
			},
		],
		stats: [
			{
				label: "Maintenance Renewal Rate",
				value: "92%",
				description:
					"of service agreements renewed automatically—vs. 65% industry average with manual follow-up.",
			},
			{
				label: "Average Ticket Increase",
				value: "+19%",
				description:
					"when proposals include good-better-best options and instant financing approval.",
			},
			{
				label: "Dispatch Efficiency",
				value: "+24%",
				description:
					"more calls handled per dispatcher during summer/winter peak seasons.",
			},
			{
				label: "Admin Time Saved",
				value: "12 hrs/week",
				description:
					"per office staff member through automated scheduling, invoicing, and customer communications.",
			},
		],
		testimonial: {
			quote:
				"Before Thorbis, we lost 30% of maintenance customers every year. Now we're at 92% renewal and our techs close $15K more in upgrades monthly. The seasonal campaign automation alone paid for 3 years of software in one spring.",
			attribution: "Chris Bennett",
			role: "Owner, Sunrise Heating & Air (14 techs, Phoenix AZ)",
		},
		faq: [
			{
				question:
					"Can Thorbis manage HVAC maintenance agreements and service contracts?",
				answer:
					"Yes. Thorbis has the most comprehensive maintenance agreement management in the industry. Define unlimited plan types (Bronze/Silver/Gold), set visit frequencies (2x, 4x, or custom), configure pricing with automatic annual escalations, and enable auto-renewal with stored payment methods. Customers receive automated reminders, and techs get pre-populated checklists for each visit type.",
			},
			{
				question: "How does Thorbis handle multi-day HVAC installations?",
				answer:
					"Thorbis project management handles everything from initial load calculation to final inspection. Schedule crews across multiple days, track equipment orders and submittals, manage permit workflows, capture progress photos, and invoice by milestone or completion. Integration with suppliers means you can order equipment directly from job records.",
			},
			{
				question:
					"Does Thorbis track manufacturer rebates and warranty registrations?",
				answer:
					"Absolutely. When techs complete an install, Thorbis prompts for serial numbers and model numbers, automatically registers warranties with supported manufacturers, and tracks rebate eligibility. Export rebate reports by manufacturer program for easy submission. No more lost rebate dollars.",
			},
			{
				question:
					"Can technicians use Thorbis offline in basements and attics?",
				answer:
					"Yes. The Thorbis mobile app works fully offline. Techs can view job details, complete checklists, capture photos, collect signatures, and process payments without cell service. Everything syncs automatically when connectivity returns.",
			},
			{
				question:
					"How does Thorbis compare to ServiceTitan for HVAC contractors?",
				answer:
					"Thorbis delivers enterprise-grade HVAC features at 70-85% lower cost. ServiceTitan charges $259+ per technician per month ($3,100/year minimum). Thorbis is $200/month flat plus usage—unlimited users included. You get the same dispatch board, maintenance tracking, mobile app, and customer portal without per-seat fees eating into margins.",
			},
			{
				question:
					"Does Thorbis integrate with HVAC supplier catalogs and pricing?",
				answer:
					"Yes. Thorbis connects with major HVAC distributors for real-time pricing and availability. Build quotes with current costs, check stock before dispatching techs, and order parts directly from job records. Supported distributors include Ferguson, Winsupply, and regional suppliers.",
			},
			{
				question: "Can I track refrigerant usage and EPA compliance?",
				answer:
					"Thorbis includes refrigerant tracking with EPA 608 compliance documentation. Log refrigerant type, amount added/recovered, and cylinder serial numbers. Generate compliance reports for audits. Technician certifications are tracked and verified before assigning refrigerant-related jobs.",
			},
		],
	},
	{
		kind: "industry",
		slug: "plumbing",
		name: "Plumbing Companies",
		designVariant: "flow",
		heroEyebrow: "Emergency Service • Drain Cleaning • Water Heaters • Repipes",
		heroTitle: "Plumbing Software That Keeps Your Trucks Rolling 24/7",
		heroDescription:
			"From midnight sewer emergencies to $30K whole-house repipes, Thorbis helps plumbing contractors respond faster, quote smarter, and get paid on the spot. Built for the unpredictable nature of plumbing work—handle emergency calls, recurring drain maintenance, and major projects all from one platform.",
		heroImage:
			"https://images.unsplash.com/photo-1557281035-4c52d764680b?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis is purpose-built plumbing software that understands your business runs on emergencies, relationships, and reputation. Our platform handles 24/7 call intake with AI-powered triage, keeps trucks stocked with the right parts, and helps techs close high-margin replacements with on-site financing. Whether you're a 2-truck drain cleaning specialist or a 40-tech full-service plumbing company, Thorbis scales with your business at just $200/month base—no per-plumber fees, ever.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "View Pricing",
			href: "/pricing",
		},
		seo: {
			title:
				"Plumbing Business Software & Dispatch | #1 for Plumbers | Thorbis",
			description:
				"Best plumbing software for contractors. 24/7 emergency dispatch, drain maintenance tracking, truck inventory, instant invoicing. $200/mo unlimited plumbers. Used by 400+ plumbing companies.",
			keywords: [
				"plumbing software",
				"plumbing business software",
				"plumbing dispatch software",
				"plumbing scheduling software",
				"plumbing service software",
				"plumbing contractor software",
				"plumbing field service management",
				"plumbing crm software",
				"plumbing invoicing software",
				"plumber app",
				"plumbing mobile app",
				"drain cleaning software",
				"plumbing inventory software",
				"servicetitan alternative plumbing",
				"housecall pro plumbing",
				"jobber plumbing alternative",
				"best plumbing software 2024",
				"plumbing business management",
				"emergency plumbing dispatch",
				"plumbing estimating software",
				"water heater service software",
			],
		},
		fieldTypes: [
			"Residential Service",
			"Commercial Plumbing",
			"Drain & Sewer",
			"New Construction",
		],
		painPoints: [
			"Emergency calls at 2 AM derail tomorrow's schedule—and frustrated customers call competitors when they can't reach you.",
			"Truck inventory is chaos: techs run out of common fittings, make supply house runs, and return visits kill margins.",
			"No upfront pricing means customers comparison shop while your tech sits in their driveway waiting for approval.",
			"Paper invoices and delayed payments create cash flow gaps that make payroll stressful every other Friday.",
			"Drain maintenance customers forget to rebook, costing you predictable recurring revenue.",
		],
		valueProps: [
			{
				title: "24/7 Emergency Triage",
				description:
					"AI-powered call intake operates around the clock. True emergencies (flooding, no water, sewer backup) get priority dispatch. Less urgent calls book for next available slot automatically.",
				icon: "alert-triangle",
			},
			{
				title: "Smart Truck Inventory",
				description:
					"Set required stock levels per truck and job type. When parts run low, automated replenishment orders go to your preferred suppliers. No more supply house runs mid-job.",
				icon: "package-check",
			},
			{
				title: "On-Site Proposals & Financing",
				description:
					"Build replacement quotes with good-better-best options in 60 seconds. Instant financing approval means customers say yes on the spot instead of 'getting quotes.'",
				icon: "file-text",
			},
			{
				title: "Drain Program Automation",
				description:
					"Recurring drain maintenance programs with automated scheduling, reminder campaigns, and prepaid service packages. Turn one-time drain calls into annual customers.",
				icon: "refresh-cw",
			},
		],
		playbook: [
			{
				title: "Emergency Response Excellence",
				description:
					"AI intake scores urgency (flooding = dispatch now, slow drain = next day). GPS routing dispatches the nearest qualified plumber. Customer gets ETA text within 2 minutes of calling. Average arrival: 45 minutes.",
			},
			{
				title: "Drain Maintenance Machine",
				description:
					"After every drain cleaning: auto-enroll customer in annual maintenance reminder. 30 days before anniversary: email + text campaign. One-click rebooking fills your slow-season calendar.",
			},
			{
				title: "Water Heater Replacement Workflow",
				description:
					"Tech diagnoses failing unit → mobile app generates instant quote with financing → customer approves on tablet → Thorbis orders unit from distributor → next-day install scheduled automatically.",
			},
		],
		stats: [
			{
				label: "Emergency Response",
				value: "45 min",
				description:
					"average arrival time for emergency calls vs. 2+ hours with manual dispatch.",
			},
			{
				label: "First-Visit Fix Rate",
				value: "94%",
				description:
					"when techs have enforced truck stock templates and customer history at their fingertips.",
			},
			{
				label: "Replacement Revenue",
				value: "+23%",
				description:
					"increase when using on-site financing and good-better-best proposals.",
			},
			{
				label: "Return Trips Eliminated",
				value: "67%",
				description:
					"reduction in return visits through smart inventory management and photo documentation.",
			},
		],
		testimonial: {
			quote:
				"We went from 60% first-visit fix rate to 94% in three months. Thorbis truck inventory templates mean my guys have what they need. The emergency dispatch alone is worth 10x what we pay—we're winning calls we used to lose to faster competitors.",
			attribution: "Sasha Kim",
			role: "General Manager, FlowMaster Plumbing (22 techs, Seattle WA)",
		},
		faq: [
			{
				question: "Can Thorbis handle 24/7 emergency plumbing dispatch?",
				answer:
					"Absolutely. Thorbis AI intake works around the clock—answering calls, collecting problem details and photos, and scoring urgency. True emergencies (flooding, sewer backup, no water) trigger immediate dispatch to the nearest available plumber. Less urgent calls book automatically for next available slot. Your after-hours calls become tomorrow's scheduled jobs, not lost opportunities.",
			},
			{
				question: "How does truck inventory management work for plumbers?",
				answer:
					"Create inventory templates for each truck type (service van, drain truck, excavation). Set minimum stock levels for common parts (water heater elements, supply lines, p-traps). Thorbis tracks usage from job completions and triggers replenishment orders to your preferred suppliers when stock runs low. No more supply house runs between calls.",
			},
			{
				question: "Does Thorbis support plumbing permits and inspections?",
				answer:
					"Yes. Attach permit applications, approval documents, and inspection schedules to each job. Automated reminders ensure inspections don't get missed. Inspection results are logged with photos for your records and customer files.",
			},
			{
				question: "Can I track camera inspection and jetter equipment?",
				answer:
					"Thorbis equipment tracking logs hours on jetters, camera systems, and locators. Schedule preventive maintenance based on hours or calendar. Attach service records and calibration certificates. Know exactly when equipment needs attention before it breaks down on a job.",
			},
			{
				question: "How does Thorbis compare to ServiceTitan for plumbers?",
				answer:
					"Thorbis gives plumbing contractors enterprise features at 70-85% lower cost. ServiceTitan charges $259+ per plumber per month. Thorbis is $200/month flat with unlimited users. You get the same dispatch board, inventory tracking, customer portal, and mobile app—without per-seat fees crushing your margins as you grow.",
			},
			{
				question: "Can customers book drain cleaning appointments online?",
				answer:
					"Yes. Your Thorbis customer portal lets homeowners book available slots, see pricing, and pay deposits online. Existing customers see their service history and can request repeat services with one click. Fewer phone calls, more bookings.",
			},
			{
				question: "Does Thorbis integrate with plumbing suppliers?",
				answer:
					"Thorbis connects with major plumbing distributors for real-time pricing and inventory. Build quotes with current costs, check availability before committing to same-day repairs, and place orders directly from job records. Supported suppliers include Ferguson, Hajoca, and regional distributors.",
			},
		],
	},
	{
		kind: "industry",
		slug: "electrical",
		name: "Electrical Contractors",
		designVariant: "circuit",
		heroEyebrow: "Service • Installations • Projects • Compliance",
		heroTitle:
			"Electrical Contractor Software Built for Safety & Profitability",
		heroDescription:
			"From outlet replacements to $500K commercial buildouts, Thorbis helps electrical contractors stay compliant, win projects, and get paid faster. Manage service calls, track projects, enforce safety protocols, and deliver professional proposals—all from one platform built for how electricians actually work.",
		heroImage:
			"https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis is the complete electrical contractor software trusted by residential service shops and commercial electrical contractors alike. Our platform enforces NEC compliance with digital safety checklists, tracks labor and materials in real-time for accurate job costing, and generates professional proposals with digital approval workflows. Whether you're running a 5-person residential shop or a 100-electrician commercial operation, Thorbis scales with your business at $200/month base—unlimited users included.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "View Pricing",
			href: "/pricing",
		},
		seo: {
			title:
				"Electrical Contractor Software & Dispatch | #1 for Electricians | Thorbis",
			description:
				"Best electrical contractor software. NEC compliance checklists, project management, estimating, dispatch & invoicing. $200/mo unlimited electricians. Trusted by 300+ electrical contractors.",
			keywords: [
				"electrical contractor software",
				"electrician software",
				"electrical dispatch software",
				"electrical scheduling software",
				"electrical estimating software",
				"electrical field service management",
				"electrician crm",
				"electrical invoicing software",
				"electrician app",
				"electrical mobile app",
				"nec compliance software",
				"electrical project management",
				"electrical job costing",
				"servicetitan alternative electrical",
				"best electrical contractor software 2024",
				"commercial electrical software",
				"residential electrical software",
				"electrical proposal software",
				"electrical service software",
				"electrical business management",
			],
		},
		fieldTypes: [
			"Residential Service",
			"Commercial TI",
			"Industrial",
			"New Construction",
		],
		painPoints: [
			"Safety documentation and compliance photos scattered across personal phones—a liability nightmare waiting to happen.",
			"Project managers have zero visibility into labor hours and material usage until jobs are over budget.",
			"Estimators spend 4+ hours per proposal manually building quotes and change orders.",
			"No consistent way to track panel upgrades, service changes, or inspection requirements across jobs.",
			"Techs complete work but forget to document—leaving you exposed during inspections and audits.",
		],
		valueProps: [
			{
				title: "Safety Compliance Engine",
				description:
					"Enforce lockout/tagout, arc flash assessments, and PPE verification with required digital checklists. Jobs can't close without signed safety documentation and photos.",
				icon: "shield-check",
			},
			{
				title: "Real-Time Job Costing",
				description:
					"Electricians log labor codes and material pulls from the mobile app. Project managers see live budget vs. actual reports—no more surprises at job completion.",
				icon: "clipboard-list",
			},
			{
				title: "Professional Proposals & Change Orders",
				description:
					"Generate NEC-compliant proposals with alternates and tiered options in minutes. Change orders route for digital approval and auto-update project budgets.",
				icon: "file-text",
			},
			{
				title: "Project Progress Tracking",
				description:
					"Visual project boards show completion percentage, upcoming milestones, and inspection schedules. Submit AIA pay applications directly from Thorbis.",
				icon: "calendar-range",
			},
		],
		playbook: [
			{
				title: "Service-to-Panel-Upgrade Pipeline",
				description:
					"Every service call becomes an opportunity. Techs flag aging panels during diagnostics. Thorbis auto-generates upgrade proposals with financing. Average upsell rate: 18% of service calls convert to $3K+ panel jobs.",
			},
			{
				title: "Commercial TI Progress Billing",
				description:
					"Track rough-in, trim-out, and final phases separately. Log daily work reports with photos. Generate AIA G702/G703 pay applications tied to completion percentage. Get paid faster, argue less.",
			},
			{
				title: "Inspection Coordination",
				description:
					"Schedule inspections tied to project phases. Automated reminders ensure no missed appointments. Log inspection results with photos and required corrections. Complete audit trail for every job.",
			},
		],
		stats: [
			{
				label: "Safety Documentation",
				value: "100%",
				description:
					"of jobs include required safety checklists and photo evidence—vs. 40% with paper systems.",
			},
			{
				label: "Change Order Approval",
				value: "-70%",
				description:
					"faster approval time with digital routing vs. email chains and faxes.",
			},
			{
				label: "Material Variance",
				value: "-18%",
				description:
					"reduction in material cost overruns through real-time usage tracking.",
			},
			{
				label: "Estimating Speed",
				value: "3x faster",
				description:
					"proposal generation using assembly templates and saved pricing.",
			},
		],
		testimonial: {
			quote:
				"We bid $2M in commercial projects last quarter using Thorbis templates—would have taken twice as long in Excel. The safety compliance alone is worth it. Every inspector comments on how organized our documentation is.",
			attribution: "Jordan Blake",
			role: "Operations VP, VoltEdge Electric (45 electricians, Dallas TX)",
		},
		faq: [
			{
				question:
					"Does Thorbis support multi-phase commercial electrical projects?",
				answer:
					"Yes. Create unlimited project phases (rough-in, trim, final), assign labor and material budgets to each phase, and bill progress draws tied to completion percentage. AIA G702/G703 pay application generation is built-in. Perfect for commercial TI, industrial, and new construction projects.",
			},
			{
				question:
					"How does Thorbis enforce safety compliance for electricians?",
				answer:
					"Create custom safety checklists for different job types (arc flash assessments, lockout/tagout, confined space). Electricians must complete required checklists with photos and signatures before jobs can be closed. All documentation is timestamped and stored for audits. Non-compliant jobs are flagged in real-time.",
			},
			{
				question: "Can I track labor and materials for job costing?",
				answer:
					"Absolutely. Electricians log labor hours against task codes and scan/enter materials used from the mobile app. Project managers see real-time budget vs. actual reports. Integration with QuickBooks and accounting systems means accurate job costing without double-entry.",
			},
			{
				question: "Does Thorbis help with electrical estimating and proposals?",
				answer:
					"Yes. Build reusable assembly templates (panel upgrades, service changes, lighting packages) with labor, materials, and markup. Generate professional proposals with alternates and good-better-best options in minutes. Customers approve digitally and deposits process automatically.",
			},
			{
				question:
					"How does Thorbis compare to ServiceTitan for electrical contractors?",
				answer:
					"Thorbis delivers commercial-grade project management and compliance features at 70-85% lower cost. ServiceTitan charges $259+ per electrician per month. Thorbis is $200/month flat plus usage—unlimited users. You get the same dispatch, estimating, and mobile tools without per-seat fees eating into project margins.",
			},
			{
				question: "Can Thorbis track permits and inspections?",
				answer:
					"Yes. Attach permit applications and approvals to jobs. Schedule inspections tied to project phases with automated reminders. Log inspection results with photos and correction requirements. Complete permit history is available for every property and customer.",
			},
			{
				question: "Does Thorbis integrate with electrical supplier pricing?",
				answer:
					"Thorbis connects with major electrical distributors for current pricing and availability. Build quotes with real costs, check stock before committing to delivery dates, and place orders directly from job records. Supported distributors include Graybar, WESCO, and regional suppliers.",
			},
		],
	},
	{
		kind: "industry",
		slug: "handyman",
		name: "Handyman & Small Projects",
		designVariant: "versatile",
		heroEyebrow: "Punch Lists • Recurring Clients • Upsells",
		heroTitle: "Scale your handyman business without chaos",
		heroDescription:
			"Thorbis gives handyman teams simple scheduling, estimates, and payment tools to run efficient operations while growing repeat business.",
		heroImage:
			"https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Offer professional experiences with minimal admin overhead—perfect for owner-operators and multi-crew handyman operations.",
		primaryCta: {
			label: "Start a handyman trial",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download handyman templates",
			href: "/templates?tag=handyman",
		},
		seo: {
			title: "Handyman Business Software | Thorbis",
			description:
				"Dispatch crews, send estimates, and collect payments for handyman jobs with Thorbis. Build repeat business effortlessly.",
			keywords: [
				"handyman software",
				"handyman scheduling app",
				"handyman invoicing software",
			],
		},
		fieldTypes: ["Owner-Operator", "Multi-Crew", "Property Managers"],
		painPoints: [
			"Jobs are scheduled via text threads that get lost.",
			"Estimates take too long to send, causing leads to go cold.",
			"Owner-operators spend evenings invoicing and reconciling payments.",
		],
		valueProps: [
			{
				title: "Quick quoting",
				description:
					"Build consistent estimates with templates, service bundles, and stored photos.",
				icon: "sparkles",
			},
			{
				title: "Simple scheduling",
				description:
					"Drag-and-drop jobs, send appointment reminders, and let customers reschedule online.",
				icon: "calendar",
			},
			{
				title: "Instant payments",
				description:
					"Collect deposits or full payments via card or ACH and sync to accounting automatically.",
				icon: "credit-card",
			},
		],
		playbook: [
			{
				title: "Recurring punch lists",
				description:
					"Create subscription packages for property managers with scheduled visits and consolidated invoicing.",
			},
			{
				title: "Upsell automations",
				description:
					"Send follow-up offers for seasonal maintenance, interior painting, or additional projects after each job.",
			},
		],
		stats: [
			{
				label: "Estimate turnaround",
				value: "Same day",
				description: "quotes delivered through Thorbis templates.",
			},
			{
				label: "Customer repeat rate",
				value: "+28%",
				description: "by marketing maintenance bundles and follow-up offers.",
			},
			{
				label: "Evening admin time",
				value: "-12 hrs",
				description:
					"saved each week through automated invoicing and payments.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps my crews booked and cash flowing. Customers get polished estimates and reminders instead of messy text threads.",
			attribution: "Martha Greene",
			role: "Owner, Greene Handyman & Home Repair",
		},
		faq: [
			{
				question: "Is Thorbis overkill for a small team?",
				answer:
					"Thorbis scales with you. Start with scheduling, estimates, and payments—add advanced modules as you grow.",
			},
			{
				question: "Can I sync to QuickBooks Self-Employed?",
				answer:
					"Yes. Thorbis exports invoices and payments to both QuickBooks Online and Self-Employed editions.",
			},
			{
				question: "Do you support tip tracking?",
				answer:
					"Track tips separately and distribute automatically when closing out invoices.",
			},
		],
	},
	{
		kind: "industry",
		slug: "landscaping",
		name: "Landscaping & Lawn Care",
		designVariant: "organic",
		heroEyebrow: "Lawn Care • Landscape Design • Snow Removal • Irrigation",
		heroTitle: "Landscaping Software That Maximizes Route Density & Profit",
		heroDescription:
			"From weekly mowing routes to $100K hardscape installations, Thorbis helps landscaping companies pack more jobs per truck, upsell enhancements automatically, and know exactly which accounts are profitable. Built for the seasonal nature of landscaping with tools for maintenance, enhancements, and snow operations.",
		heroImage:
			"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis is the complete landscaping business management platform trusted by lawn care operators and full-service landscape companies. Our software optimizes recurring routes to maximize properties per crew per day, automates seasonal enhancement proposals, tracks crew time and materials for accurate job costing, and manages snow operations when winter hits. Whether you're running 2 mowing crews or 50 trucks across divisions, Thorbis scales at just $200/month base—no per-crew fees eating into your margins.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "View Pricing",
			href: "/pricing",
		},
		seo: {
			title:
				"Landscaping Business Software & Scheduling | #1 for Lawn Care | Thorbis",
			description:
				"Best landscaping software for lawn care & landscape contractors. Route optimization, crew tracking, enhancement upsells, snow management. $200/mo unlimited crews.",
			keywords: [
				"landscaping software",
				"lawn care software",
				"landscaping business software",
				"lawn care scheduling software",
				"landscaping route software",
				"landscape contractor software",
				"lawn service software",
				"landscaping crm",
				"landscaping invoicing software",
				"lawn care app",
				"landscaping crew management",
				"landscape estimating software",
				"snow removal software",
				"irrigation management software",
				"servicetitan alternative landscaping",
				"jobber landscaping alternative",
				"best landscaping software 2024",
				"lawn care business management",
				"landscape job costing",
				"landscaping route optimization",
			],
		},
		fieldTypes: [
			"Residential Maintenance",
			"Commercial Grounds",
			"Design/Build",
			"Snow & Ice",
		],
		painPoints: [
			"Route planning wastes hours—and crews still drive past 3 customers to reach the next stop.",
			"Enhancement proposals (mulch, aeration, plantings) happen randomly instead of systematically, leaving $50K+ on the table.",
			"No idea which accounts are profitable until year-end—some 'good customers' actually lose money.",
			"Crew overtime spikes in spring and fall because workloads aren't balanced across teams.",
			"Snow events create chaos—who's on call, which properties are priority, and how do you bill per-push vs. seasonal?",
		],
		valueProps: [
			{
				title: "Route Density Optimization",
				description:
					"AI-powered routing packs more properties per crew per day. Reduce windshield time by 18% and fit more recurring visits into each route without manual map planning.",
				icon: "route",
			},
			{
				title: "Crew Time & Cost Tracking",
				description:
					"GPS clock-in/out, job completion photos, and material logging feed real-time job costing. Know exactly which accounts make money and which don't.",
				icon: "check-circle",
			},
			{
				title: "Enhancement Automation",
				description:
					"Trigger seasonal proposals automatically: spring cleanup, mulch, aeration, fall cleanup, holiday lighting. Customers receive professional quotes without you lifting a finger.",
				icon: "leaf",
			},
			{
				title: "Snow Operations Module",
				description:
					"Manage plow routes, salt usage, on-call rotations, and per-event or seasonal billing. GPS verification proves service completion for property managers.",
				icon: "snowflake",
			},
		],
		playbook: [
			{
				title: "Spring Renewal Machine",
				description:
					"60 days before season: automated renewal emails to every maintenance customer. Include enhancement upsells (mulch, fertilizer program, irrigation startup). Average renewal rate: 89%. Average enhancement attach rate: 34%.",
			},
			{
				title: "Crew Profitability Scorecards",
				description:
					"Weekly reports show revenue per hour, overtime percentage, and quality scores by crew. Identify top performers for bonuses and underperformers for training. Stop guessing, start managing.",
			},
			{
				title: "Snow Event Response",
				description:
					"Weather alert triggers on-call notifications. Crews see priority routes on mobile app. GPS tracking proves service times. Automatic invoicing based on push count or hourly rates. Done before the sun comes up.",
			},
		],
		stats: [
			{
				label: "Route Efficiency",
				value: "+18%",
				description:
					"more properties completed per crew per day through AI-optimized routing.",
			},
			{
				label: "Enhancement Revenue",
				value: "+34%",
				description:
					"increase from automated seasonal upsell campaigns vs. manual outreach.",
			},
			{
				label: "Crew Overtime",
				value: "-30%",
				description:
					"reduction through balanced workload distribution and accurate job timing.",
			},
			{
				label: "Renewal Rate",
				value: "89%",
				description:
					"of maintenance contracts renewed automatically—vs. 72% with manual follow-up.",
			},
		],
		testimonial: {
			quote:
				"We added $180K in enhancement revenue last year just from Thorbis automations. The spring mulch campaign alone closed 340 proposals in 3 weeks. And we finally know which accounts make money—turns out we were losing $40/visit on some 'good customers.'",
			attribution: "Devon Price",
			role: "Owner, GreenPath Landscaping (38 crew members, Minneapolis MN)",
		},
		faq: [
			{
				question: "Does Thorbis support snow plowing and ice management?",
				answer:
					"Absolutely. The snow operations module handles plow routes, salt usage tracking, on-call crew rotations, weather-triggered alerts, and flexible billing (per-push, per-inch, hourly, or seasonal). GPS verification proves service completion times for property managers who question invoices.",
			},
			{
				question: "How does route optimization work for landscaping crews?",
				answer:
					"Thorbis analyzes property locations, service frequencies, and crew capacity to build routes that minimize drive time. The AI considers traffic patterns, service windows, and equipment requirements. Most landscapers see 15-20% more properties per day after switching from manual routing.",
			},
			{
				question: "Can I track job costing and crew profitability?",
				answer:
					"Yes. Crew members clock in/out via mobile app with GPS verification. Material usage is logged per job. Thorbis calculates true cost per property including labor, materials, equipment, and overhead. Identify which accounts are profitable and which need price increases or cancellation.",
			},
			{
				question: "How do seasonal enhancement campaigns work?",
				answer:
					"Set up enhancement templates (spring cleanup, mulch, aeration, fall cleanup) with pricing. Thorbis automatically sends proposals to eligible customers based on property attributes and purchase history. Customers approve online, and jobs are scheduled automatically. Average enhancement attach rate: 34%.",
			},
			{
				question: "Does Thorbis work for design/build landscape projects?",
				answer:
					"Yes. Project management features handle multi-phase landscape installations with crew scheduling, material tracking, change orders, and progress billing. Perfect for hardscaping, outdoor kitchens, and large plantings alongside your maintenance operations.",
			},
			{
				question: "How does Thorbis compare to Jobber for landscapers?",
				answer:
					"Thorbis delivers enterprise-grade route optimization and crew management at comparable cost. Jobber charges $49-$249/month depending on features. Thorbis is $200/month flat with all features included—route optimization, enhancement automation, snow operations, and job costing. No feature tiers or surprise upgrades.",
			},
			{
				question: "Can crews work offline in areas with poor cell coverage?",
				answer:
					"Yes. Crew leaders download routes and job details before heading out. Work offline all day—complete checklists, capture photos, log materials. Everything syncs automatically when connectivity returns. Perfect for rural properties and remote commercial accounts.",
			},
		],
	},
	{
		kind: "industry",
		slug: "pool-service",
		name: "Pool & Spa Service",
		designVariant: "aquatic",
		heroEyebrow:
			"Route Management • Chemical Logs • Retail Sales • Equipment Upgrades",
		heroTitle: "The #1 Pool Service Software for Route-Based Professionals",
		heroDescription:
			"Manage weekly routes, track chemical readings, document compliance, and grow equipment upgrade revenue—all from one platform built specifically for pool and spa service companies.",
		heroImage:
			"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives pool operators enterprise-grade route optimization, digital chemical logging, and retail integration tools—delivering crystal-clear pools and predictable recurring revenue.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download chemical log template",
			href: "/templates?tag=pool-service",
		},
		seo: {
			title:
				"Pool Service Software & Route Management | #1 for Pool Companies | Thorbis",
			description:
				"Track pool routes, chemical readings, and equipment upgrades with Thorbis software. Digital compliance logs, route optimization, and retail integration for pool and spa service professionals.",
			keywords: [
				"pool service software",
				"pool route management software",
				"pool chemical log app",
				"pool service dispatch software",
				"pool maintenance software",
				"pool company software",
				"pool route optimization",
				"pool service scheduling software",
				"commercial pool service software",
				"residential pool service software",
				"pool chemical tracking app",
				"pool compliance software",
				"pool service CRM",
				"pool technician app",
				"pool billing software",
				"spa service software",
				"hot tub service software",
				"pool equipment upgrade tracking",
				"pool water testing app",
				"pool service management",
			],
		},
		fieldTypes: [
			"Residential Weekly Service",
			"Commercial Aquatics",
			"Retail + Service Hybrid",
			"Spa & Hot Tub Service",
			"Pool Opening/Closing",
		],
		painPoints: [
			"Route changes and stop skips create billing errors—customers get charged for visits that didn't happen or miss payments for completed work.",
			"Chemical logs are managed on paper or spreadsheets, risking compliance issues and liability exposure with health departments.",
			"Upsell opportunities for heaters, automation, pumps, and remodels go untapped because technicians forget or lack sales tools.",
			"No visibility into route efficiency—technicians drive excessive miles while nearby pools go unserviced.",
			"Seasonal ramp-up chaos: spring openings and fall closings overwhelm the schedule without automated coordination.",
		],
		valueProps: [
			{
				title: "AI-Optimized Route Planning",
				description:
					"Maintain balanced weekly routes with drag-and-drop scheduling, skip tracking, and AI that minimizes drive time while maximizing pools per day.",
				icon: "map-pin",
			},
			{
				title: "Digital Chemical Logs & Compliance",
				description:
					"Record readings, photos, and dosing with automatic compliance reports. Timestamped entries protect you legally and satisfy health inspectors.",
				icon: "flask",
			},
			{
				title: "Retail & Upgrade Revenue Engine",
				description:
					"Sync service visits with retail sales, automatically recommend upgrades based on equipment age, and track follow-up opportunities until closed.",
				icon: "shopping-cart",
			},
			{
				title: "Customer Portal with Real-Time Updates",
				description:
					"Customers see service history, chemical readings, photos, and upcoming visits. Builds trust and reduces 'Did you come today?' calls.",
				icon: "layout-dashboard",
			},
		],
		playbook: [
			{
				title: "Spring Opening Automation",
				description:
					"60 days before season: automated campaigns to schedule openings. Collect deposits online. Send prep checklists. Route opening appointments geographically. Average opening-to-service conversion: 94%.",
			},
			{
				title: "Equipment Upgrade Pipeline",
				description:
					"Tag pools with equipment age and condition during service visits. AI generates upgrade proposals for pumps over 8 years, heaters showing inefficiency, and automation candidates. Track from proposal to install.",
			},
			{
				title: "Commercial Compliance Package",
				description:
					"Commercial clients receive weekly PDF reports with all chemical readings, photos, and technician notes. Automated health inspection prep with historical data export. Keep property managers happy and contracts renewed.",
			},
		],
		stats: [
			{
				label: "Route Efficiency",
				value: "+22%",
				description:
					"more pools serviced per day through AI-optimized routing vs. manual planning.",
			},
			{
				label: "Chemical Compliance",
				value: "100%",
				description:
					"digital logs with timestamped GPS-verified entries—never fail an inspection.",
			},
			{
				label: "Equipment Revenue",
				value: "+34%",
				description:
					"increase in equipment upgrade sales through automated proposal campaigns.",
			},
			{
				label: "Customer Retention",
				value: "96%",
				description:
					"annual retention rate with portal access and proactive communication.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps routes tight, chemicals logged, and upgrade opportunities organized. We added $120K in equipment sales last year just from automated proposals. Customers see exactly what we did at every visit—support calls dropped 60%.",
			attribution: "Nicole Hernandez",
			role: "Operations Manager, AquaGlow Pools (85 weekly routes, Phoenix AZ)",
		},
		faq: [
			{
				question:
					"Does Thorbis handle chemical compliance reports for commercial pools?",
				answer:
					"Yes. Generate branded compliance reports with all readings, photos, dosing records, and technician signatures. Export weekly PDFs for property managers or prepare documentation for health department inspections. All data is timestamped and GPS-verified.",
			},
			{
				question: "How does route optimization work for pool service?",
				answer:
					"Thorbis analyzes pool locations, service frequencies, and technician capacity to build routes that minimize drive time. The AI considers traffic patterns, gate codes, and equipment requirements. Most pool companies see 20-25% more pools per technician per day after switching from manual routing.",
			},
			{
				question: "Can I track retail sales alongside service accounts?",
				answer:
					"Absolutely. Thorbis associates retail transactions with service accounts. When a customer buys chemicals at your store, it's linked to their pool profile. Track equipment warranties, purchase history, and generate upgrade recommendations based on what they already own.",
			},
			{
				question: "How do you handle skipped stops and billing adjustments?",
				answer:
					"Mark skips with reasons (locked gate, weather, vacation hold). Billing adjusts automatically based on your rules. Customers receive real-time notifications. No more arguing about whether service happened—GPS verification proves it.",
			},
			{
				question: "Does Thorbis support seasonal openings and closings?",
				answer:
					"Yes. Set up opening and closing sequences with automated scheduling. Customers receive prep checklists, deposit requests, and appointment confirmations. Route seasonal work geographically to maximize efficiency during the busiest weeks.",
			},
			{
				question:
					"Can pool technicians work offline in areas with poor cell coverage?",
				answer:
					"Yes. Technicians download routes and pool details before heading out. Complete chemical logs, capture photos, and document work offline. Everything syncs automatically when connectivity returns—perfect for rural properties.",
			},
			{
				question:
					"How does Thorbis compare to other pool service software like Skimmer or LMN?",
				answer:
					"Thorbis delivers enterprise-grade features at transparent pricing. Skimmer charges $49-$199/month depending on routes. Thorbis is $200/month flat with unlimited routes, AI optimization, retail integration, and equipment tracking. No per-route fees, no feature tiers.",
			},
		],
	},
	{
		kind: "industry",
		slug: "pest-control",
		name: "Pest Control",
		designVariant: "shield",
		heroEyebrow:
			"Route Optimization • Chemical Compliance • Renewals • Inspections",
		heroTitle: "The #1 Pest Control Software for Growing Exterminators",
		heroDescription:
			"Manage recurring treatment routes, track chemical usage, automate renewals, and stay compliant—all from one platform built specifically for pest control professionals.",
		heroImage:
			"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives pest control operators enterprise-grade route optimization, digital compliance logging, and automated renewal workflows—protecting your recurring revenue and keeping regulators happy.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download compliance checklist",
			href: "/templates?tag=pest-control",
		},
		seo: {
			title:
				"Pest Control Software & Route Optimization | #1 for Exterminators | Thorbis",
			description:
				"Optimize pest control routes, track chemical usage, automate renewals, and stay compliant with Thorbis software built for pest control businesses.",
			keywords: [
				"pest control software",
				"pest control business software",
				"pest route optimization",
				"pest control chemical logs",
				"pest control scheduling software",
				"pest control CRM",
				"exterminator software",
				"pest control dispatch software",
				"pest control compliance software",
				"termite inspection software",
				"pest control renewal automation",
				"pest control billing software",
				"commercial pest control software",
				"residential pest control software",
				"integrated pest management software",
				"mosquito service software",
				"pest control technician app",
				"pest control route planning",
				"pest treatment tracking",
				"pest control management system",
			],
		},
		fieldTypes: [
			"Residential Pest Control",
			"Commercial IPM",
			"Mosquito & Tick Control",
			"Termite & Wood Destroying",
			"Wildlife Control",
		],
		painPoints: [
			"Route density suffers when technicians make manual adjustments—driving past customers to serve others miles away.",
			"Chemical reporting requirements differ by state and are tedious to compile manually. One mistake risks your license.",
			"Renewals rely on manual outreach—staff forgets to call, customers churn, and recurring revenue disappears.",
			"Commercial clients demand detailed inspection reports with photos, but creating them takes hours after each visit.",
			"Seasonal add-ons like mosquito and tick control are undersold because there's no system to identify and target eligible customers.",
		],
		valueProps: [
			{
				title: "AI-Optimized Route Density",
				description:
					"Plan monthly, quarterly, or seasonal routes with skip tracking and auto-rescheduling. AI maximizes stops per day while minimizing drive time.",
				icon: "map-pin",
			},
			{
				title: "Digital Chemical Compliance",
				description:
					"Record EPA numbers, batch IDs, dosage, weather conditions, and technician signatures. Export state-specific compliance forms with one click.",
				icon: "flask",
			},
			{
				title: "Automated Renewal Engine",
				description:
					"Send renewal notices 60 days out, capture e-signatures, and update billing with autopay. Protect recurring revenue without manual follow-up.",
				icon: "rotate-cw",
			},
			{
				title: "Commercial Inspection Reports",
				description:
					"Generate branded inspection summaries with photos, findings, and recommendations. Property managers get professional PDFs automatically.",
				icon: "clipboard-check",
			},
		],
		playbook: [
			{
				title: "Mosquito Season Campaign",
				description:
					"April 1st trigger: automated SMS and email campaigns to existing customers for mosquito/tick add-ons. Include pricing, online scheduling, and autopay enrollment. Average attach rate: 28% of residential base.",
			},
			{
				title: "Commercial IPM Reporting",
				description:
					"After each service, technicians complete digital checklists with photos. Thorbis generates branded PDF reports showing activity observed, treatments applied, and recommendations. Delivered to property managers within 24 hours.",
			},
			{
				title: "Termite Inspection Workflow",
				description:
					"Capture inspection diagrams on tablet, document findings with photos, generate NPMA-33 forms, and present treatment proposals on-site. Track from inspection through treatment completion and annual renewals.",
			},
		],
		stats: [
			{
				label: "Route Efficiency",
				value: "+24%",
				description:
					"more stops completed per technician per day through AI-optimized routing.",
			},
			{
				label: "Compliance Time",
				value: "-75%",
				description:
					"reduction in time spent on chemical reporting—8 hours to 2 hours monthly.",
			},
			{
				label: "Renewal Rate",
				value: "94%",
				description:
					"of annual pest plans renewed automatically vs. 78% with manual outreach.",
			},
			{
				label: "Add-On Revenue",
				value: "+32%",
				description:
					"increase from automated seasonal service campaigns (mosquito, tick, etc.).",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps our techs on tight routes and chemical logs compliant. Renewals happen automatically—we went from 78% to 94% retention in one year. The mosquito campaign alone added $85K in seasonal revenue.",
			attribution: "Logan Fisher",
			role: "Owner, ShieldGuard Pest Solutions (22 technicians, Atlanta GA)",
		},
		faq: [
			{
				question: "Does Thorbis support termite inspections and NPMA-33 forms?",
				answer:
					"Yes. Capture inspection diagrams on tablet, document findings with photos, and generate NPMA-33 forms automatically. Present treatment proposals on-site with e-signature capture. Track from inspection through treatment completion and annual renewals.",
			},
			{
				question: "How granular are chemical compliance records?",
				answer:
					"Track EPA registration numbers, batch IDs, application rates, dilution ratios, weather conditions, target pests, and technician signatures for each treatment. Export state-specific compliance forms (varies by state requirements) with one click.",
			},
			{
				question:
					"Can I handle different service frequencies for different customers?",
				answer:
					"Absolutely. Create service templates for monthly, bi-monthly, quarterly, or annual programs. Each customer can have a unique schedule. Thorbis auto-generates routes based on service dates and geographic clustering.",
			},
			{
				question: "How does renewal automation work?",
				answer:
					"Set renewal triggers (60/30/15 days before expiration). Thorbis sends email and SMS reminders with renewal links. Customers renew online with e-signature and autopay enrollment. Staff only handles exceptions—95% renew without manual intervention.",
			},
			{
				question: "Does Thorbis handle commercial IPM reporting requirements?",
				answer:
					"Yes. After each service, technicians complete digital inspection checklists with photos. Thorbis generates branded PDF reports showing activity observed, treatments applied, areas inspected, and recommendations. Reports deliver automatically to property managers.",
			},
			{
				question: "How do seasonal add-on campaigns work?",
				answer:
					"Set campaign triggers by date or service history. For mosquito season, Thorbis identifies eligible customers (residential, outdoor service area), sends targeted campaigns with pricing and scheduling links, and routes new services geographically. Track conversion rates and revenue by campaign.",
			},
			{
				question: "How does Thorbis compare to PestPac or ServSuite?",
				answer:
					"Thorbis delivers enterprise-grade features at transparent pricing. PestPac and ServSuite charge per-technician fees that scale with your business. Thorbis is $200/month flat with unlimited technicians, AI routing, compliance automation, and renewal management. No per-user fees, no surprise charges.",
			},
		],
	},
	{
		kind: "industry",
		slug: "appliance-repair",
		name: "Appliance Repair",
		designVariant: "technical",
		heroEyebrow:
			"Warranty Claims • Parts Logistics • First-Time Fix • Customer Experience",
		heroTitle: "The #1 Appliance Repair Software for Service Excellence",
		heroDescription:
			"Manage warranty claims, automate parts ordering, optimize technician routing, and delight customers with real-time updates—all from one platform built for appliance repair professionals.",
		heroImage:
			"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives appliance repair companies the tools to maximize first-time fix rates, streamline warranty processing, and deliver the customer experience that earns 5-star reviews.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download parts management guide",
			href: "/templates?tag=appliance",
		},
		seo: {
			title:
				"Appliance Repair Software & Warranty Management | #1 for Service Companies | Thorbis",
			description:
				"Manage warranty claims, schedule technicians, track parts inventory, and optimize first-time fix rates with Thorbis software built for appliance repair businesses.",
			keywords: [
				"appliance repair software",
				"appliance warranty management",
				"appliance parts tracking",
				"appliance service software",
				"appliance repair scheduling",
				"appliance repair dispatch",
				"appliance repair CRM",
				"warranty claim software",
				"appliance technician app",
				"appliance repair business software",
				"first time fix rate software",
				"appliance parts inventory",
				"commercial appliance repair software",
				"residential appliance service",
				"appliance repair routing",
				"appliance service management",
				"appliance repair invoicing",
				"manufacturer warranty software",
				"appliance diagnostic software",
				"appliance repair customer portal",
			],
		},
		fieldTypes: [
			"Warranty Service (Manufacturer)",
			"COD Residential",
			"Commercial Kitchen Equipment",
			"Laundromat & Multi-Family",
			"Extended Warranty/Home Warranty",
		],
		painPoints: [
			"Warranty information and claim numbers live in spreadsheets or email chains—technicians waste time hunting for coverage details.",
			"Parts ordering is manual and error-prone. Wrong parts ordered, delays extend job completion, callbacks eat into profit margins.",
			"Customers expect Amazon-level updates about technician arrival and job status. Radio silence creates anxiety and bad reviews.",
			"First-time fix rate suffers because technicians lack diagnostic history, model-specific resources, and proper parts on the truck.",
			"Home warranty and manufacturer warranty billing rules are complex—claims get rejected, payments delayed, revenue lost.",
		],
		valueProps: [
			{
				title: "Warranty Intelligence Hub",
				description:
					"Store manufacturer codes, coverage dates, claim numbers, and billing rules. Dispatchers instantly verify coverage. Technicians see warranty status on mobile before arrival.",
				icon: "library",
			},
			{
				title: "Smart Parts Management",
				description:
					"Generate purchase orders from diagnostic codes, track shipping status, and notify technicians when parts arrive. See truck inventory in real-time.",
				icon: "package-search",
			},
			{
				title: "Customer Communication Engine",
				description:
					"Send branded appointment reminders, technician bios with photos, live ETA tracking, and work summaries automatically. Build trust before the knock on the door.",
				icon: "bell",
			},
			{
				title: "First-Time Fix Optimization",
				description:
					"Access model-specific diagnostic guides, repair history, and common failure patterns. Technicians arrive prepared with the right parts and knowledge.",
				icon: "wrench",
			},
		],
		playbook: [
			{
				title: "Warranty Claim Processing",
				description:
					"Standardized workflow: diagnose → verify coverage → order parts → complete repair → submit claim → reconcile payment. Automated claim submission to major manufacturers. Track approvals and rejections. Average claim turnaround: 5 days vs. 14 days manual.",
			},
			{
				title: "Depot-to-Truck Parts Flow",
				description:
					"Parts arrive at depot, get logged with serial numbers, assigned to specific jobs, transferred to truck inventory. Technicians see what's on their truck. Depot managers see what needs restocking. No more 'I thought it was on the truck' callbacks.",
			},
			{
				title: "Model-Based Diagnostic Library",
				description:
					"Build a knowledge base of common failures by appliance model. When technicians enter model numbers, they see repair history, common issues, required parts, and success tips from previous repairs. First-time fix rates increase 15-20%.",
			},
		],
		stats: [
			{
				label: "First-Time Fix",
				value: "+23%",
				description:
					"improvement in first-time fix rate through diagnostic tools and smart parts management.",
			},
			{
				label: "Customer Rating",
				value: "4.8★",
				description:
					"average rating with live ETA tracking, technician profiles, and post-service summaries.",
			},
			{
				label: "Claim Turnaround",
				value: "-65%",
				description:
					"faster warranty claim processing—5 days average vs. 14 days with manual submission.",
			},
			{
				label: "Callback Rate",
				value: "-31%",
				description:
					"reduction in callbacks through proactive parts management and diagnostic support.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps warranty data, parts, and customer updates organized. Our first-time fix rate jumped from 68% to 84% in six months. Technicians arrive with the right part every time—callbacks are down 31% and customer reviews mention our communication constantly.",
			attribution: "Kim Alvarez",
			role: "Service Director, Apex Appliance Repair (18 technicians, Dallas TX)",
		},
		faq: [
			{
				question:
					"Does Thorbis integrate with parts distributors and suppliers?",
				answer:
					"Yes. Connect to major appliance parts distributors (Marcone, Reliable Parts, etc.) to pull real-time availability, pricing, and estimated delivery. Generate POs directly from diagnostic codes. Track shipments and receive notifications when parts arrive.",
			},
			{
				question:
					"How do you handle warranty claims for different manufacturers?",
				answer:
					"Thorbis supports claim submission workflows for major manufacturers (Whirlpool, GE, Samsung, LG, etc.) and home warranty companies. Store claim requirements, billing codes, and labor rates per manufacturer. Submit claims electronically and track approval status.",
			},
			{
				question: "Can we track serialized parts and warranty status?",
				answer:
					"Absolutely. Track serial numbers, manufacture dates, warranty periods, and return authorizations. When a technician scans a part serial number, they see full warranty status and coverage details. Perfect for extended warranty and manufacturer warranty work.",
			},
			{
				question:
					"How are customers kept informed throughout the repair process?",
				answer:
					"Customers receive appointment confirmations, technician profiles with photos, live ETA tracking on repair day, work-in-progress updates if parts are ordered, and completion summaries with next steps. Communication happens via email and SMS based on customer preference.",
			},
			{
				question: "Does Thorbis help improve first-time fix rates?",
				answer:
					"Yes. Technicians access model-specific diagnostic guides, repair history for the specific unit, common failure patterns, and parts information before arrival. Smart truck inventory ensures the right parts are on the vehicle. Average first-time fix improvement: 15-23%.",
			},
			{
				question:
					"Can dispatchers see technician truck inventory in real-time?",
				answer:
					"Yes. Truck inventory updates as parts are used, transferred, or restocked. Dispatchers can route calls to technicians who have the required parts on their truck. Depot managers see replenishment needs across the fleet.",
			},
			{
				question:
					"How does Thorbis compare to ServiceTitan or FieldEdge for appliance repair?",
				answer:
					"Thorbis is purpose-built for appliance repair workflows—warranty processing, parts logistics, and first-time fix optimization. ServiceTitan charges $150-300+ per technician/month. Thorbis is $200/month flat with unlimited technicians, warranty automation, and parts integration. No per-user fees.",
			},
		],
	},
	{
		kind: "industry",
		slug: "roofing",
		name: "Roofing Contractors",
		designVariant: "elevated",
		heroEyebrow: "Storm Response • Production • Insurance • Supplements",
		heroTitle: "The #1 Roofing Software for Insurance Restoration & Retail",
		heroDescription:
			"Manage storm response, coordinate crews and materials, track insurance claims, and maximize supplement recovery—all from one platform built for roofing contractors.",
		heroImage:
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives roofing contractors enterprise-grade storm response, production scheduling, and insurance documentation tools—turning chaos into predictable, profitable operations.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download roofing project pack",
			href: "/templates?tag=roofing",
		},
		seo: {
			title:
				"Roofing Software & Insurance Claims Management | #1 for Roofers | Thorbis",
			description:
				"Coordinate inspections, crews, materials, and insurance paperwork with Thorbis roofing software. Storm response, supplement tracking, and production scheduling for roofing contractors.",
			keywords: [
				"roofing software",
				"roofing CRM",
				"roofing project management",
				"roofing inspection app",
				"roofing contractor software",
				"storm damage roofing software",
				"insurance restoration software",
				"roofing supplement tracking",
				"roofing production scheduling",
				"roofing estimating software",
				"roofing business software",
				"commercial roofing software",
				"residential roofing software",
				"roofing crew scheduling",
				"roofing material ordering",
				"roofing customer portal",
				"roofing sales software",
				"roofing job costing",
				"roofing EagleView integration",
				"roofing claims management",
			],
		},
		fieldTypes: [
			"Insurance Restoration",
			"Retail Re-Roofing",
			"Commercial Roofing",
			"Storm Damage Response",
			"Roof Repair Programs",
		],
		painPoints: [
			"Storm response overwhelms call centers and sales teams without structured intake—leads fall through cracks, inspections get missed.",
			"Material ordering, delivery coordination, and crew scheduling across multiple jobs creates production bottlenecks and delays.",
			"Insurance paperwork, photos, measurements, and supplements get lost in email chains. Claims get denied, money left on the table.",
			"No visibility into production pipeline—you don't know which jobs are inspection-ready, approved, material-ordered, or scheduled.",
			"Supplement recovery is inconsistent. Some adjusters get everything documented perfectly, others leave thousands on the table.",
		],
		valueProps: [
			{
				title: "Storm Response Command Center",
				description:
					"Capture leads from all channels, validate service areas, triage by urgency, assign inspections geographically. Turn storm chaos into organized pipeline.",
				icon: "megaphone",
			},
			{
				title: "Production Scheduling Engine",
				description:
					"Coordinate crews, material deliveries, dumpsters, permits, and weather windows in one visual timeline. See your entire production pipeline at a glance.",
				icon: "calendar-range",
			},
			{
				title: "Insurance Documentation Hub",
				description:
					"Store inspection photos, EagleView/Hover reports, insurance estimates, supplements, and approvals with version control. Nothing gets lost.",
				icon: "folder-open",
			},
			{
				title: "Supplement Recovery System",
				description:
					"Standardized supplement checklists ensure nothing is missed. Track supplement status, document justifications with photos, and maximize claim value.",
				icon: "dollar-sign",
			},
		],
		playbook: [
			{
				title: "Storm-to-Close Pipeline",
				description:
					"Lead captured → inspection scheduled → EagleView ordered → insurance filed → approval received → materials ordered → production scheduled → installed → final payment. Track every job through every stage. Average cycle time: 21 days vs. 35 days industry average.",
			},
			{
				title: "Supplement Recovery Protocol",
				description:
					"Technicians complete standardized damage checklists with photos. AI flags commonly missed items (drip edge, ventilation, ice/water shield). Supplements submitted within 48 hours of inspection. Average supplement value increase: 18%.",
			},
			{
				title: "Weather-Adjusted Production",
				description:
					"Thorbis monitors weather forecasts and automatically adjusts production schedules. Rain delays trigger customer notifications and crew reassignments. Never show up to a job site in bad weather again.",
			},
		],
		stats: [
			{
				label: "Cycle Time",
				value: "-40%",
				description:
					"reduction from inspection to install completion—21 days vs. 35 day industry average.",
			},
			{
				label: "Supplement Recovery",
				value: "+$2,400",
				description:
					"average additional supplement value per claim through standardized documentation.",
			},
			{
				label: "Customer Rating",
				value: "4.9★",
				description:
					"average rating with proactive communication via homeowner portal.",
			},
			{
				label: "Lead Conversion",
				value: "+28%",
				description:
					"improvement in storm lead to signed contract conversion through structured follow-up.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps roofing projects organized from inspection to final invoice. We recovered an extra $2,400 per claim on supplements just by using standardized checklists. Insurance docs, photos, and production schedules live in one place—our adjusters are faster and our customers happier.",
			attribution: "Grant Wallace",
			role: "Production Manager, Summit Roofing (45 crew members, Oklahoma City OK)",
		},
		faq: [
			{
				question:
					"Does Thorbis integrate with EagleView and Hover for measurements?",
				answer:
					"Yes. Sync EagleView and Hover reports directly to jobs with measurements automatically imported. Order reports from within Thorbis and receive them attached to the project file. No manual data entry or file hunting.",
			},
			{
				question: "How does supplement tracking work?",
				answer:
					"Technicians complete standardized damage checklists during inspections. Thorbis flags commonly missed items (drip edge, ventilation, ice/water shield, etc.). Generate supplement requests with photo documentation. Track supplement status through approval and reconciliation.",
			},
			{
				question: "Can homeowners track their project progress?",
				answer:
					"Yes. Homeowners log into a branded portal to see inspection status, insurance approval, material delivery dates, installation schedule, and progress photos. Proactive communication reduces 'when will you be here?' calls by 70%.",
			},
			{
				question: "How do you handle weather delays and rescheduling?",
				answer:
					"Thorbis monitors weather forecasts for your job sites. When rain or high winds are predicted, the system alerts you to reschedule, notifies affected customers automatically, and reassigns crews to weather-appropriate work. No surprises for you or your customers.",
			},
			{
				question:
					"Does Thorbis support both insurance and retail roofing jobs?",
				answer:
					"Absolutely. Insurance jobs follow the full claims workflow (inspection, filing, supplement, approval, production). Retail jobs skip insurance steps and move straight from estimate to contract to production. Same system, different workflows.",
			},
			{
				question:
					"How does material ordering integrate with production scheduling?",
				answer:
					"When a job is approved, Thorbis generates material lists from the scope. Submit orders to suppliers directly. Track delivery dates. Production scheduling automatically accounts for material availability—no scheduling a job before materials arrive.",
			},
			{
				question:
					"How does Thorbis compare to AccuLynx or JobNimbus for roofing?",
				answer:
					"Thorbis delivers enterprise-grade roofing features at transparent pricing. AccuLynx and JobNimbus charge per-user fees that scale with your team. Thorbis is $200/month flat with unlimited users, supplement tracking, production scheduling, and measurement integrations. No per-user fees, no surprise charges.",
			},
		],
	},
	{
		kind: "industry",
		slug: "cleaning",
		name: "Cleaning & Janitorial",
		designVariant: "pristine",
		heroEyebrow:
			"Recurring Scheduling • Quality Control • Client Portals • Time Tracking",
		heroTitle:
			"The #1 Cleaning & Janitorial Software for Commercial Operations",
		heroDescription:
			"Manage recurring schedules, enforce quality standards, track time and attendance, and deliver transparent reporting to clients—all from one platform built for cleaning professionals.",
		heroImage:
			"https://images.unsplash.com/photo-1581578017421-9890848fc1c0?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives cleaning companies enterprise-grade scheduling, quality control, and client communication tools—turning inconsistent service into reliable, measurable excellence.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download cleaning checklist pack",
			href: "/templates?tag=cleaning",
		},
		seo: {
			title:
				"Cleaning & Janitorial Software | #1 for Commercial Cleaning | Thorbis",
			description:
				"Schedule cleaning crews, enforce quality checklists, track time and attendance, and share inspection reports with clients using Thorbis commercial cleaning software.",
			keywords: [
				"cleaning business software",
				"janitorial software",
				"janitorial scheduling software",
				"cleaning service software",
				"commercial cleaning software",
				"cleaning inspection app",
				"janitorial management software",
				"cleaning company software",
				"cleaning crew scheduling",
				"cleaning quality control software",
				"janitorial time tracking",
				"cleaning business CRM",
				"maid service software",
				"post construction cleaning software",
				"cleaning client portal",
				"janitorial inspection app",
				"cleaning service dispatch",
				"cleaning supply tracking",
				"janitorial bidding software",
				"cleaning work order management",
			],
		},
		fieldTypes: [
			"Commercial Nightly Janitorial",
			"Residential Maid Service",
			"Post-Construction Cleaning",
			"Medical/Healthcare Cleaning",
			"Industrial & Warehouse",
		],
		painPoints: [
			"Staff schedules change daily—call-outs, substitutions, and shift swaps create coverage gaps that clients notice.",
			"Quality control relies on paper checklists and inconsistent follow-up. Supervisors can't inspect every site every night.",
			"Clients demand transparency with photos and reports, but compiling them manually takes hours every week.",
			"Time tracking is unreliable—employees clock in from home, buddy punch, or forget to clock out. Labor costs spiral.",
			"No visibility into site profitability—some accounts lose money but you don't know which ones until it's too late.",
		],
		valueProps: [
			{
				title: "Recurring Schedule Engine",
				description:
					"Manage site-specific frequencies, rotations, shift swaps, and exclusions with drag-and-drop adjustments. Handle call-outs in seconds.",
				icon: "calendar",
			},
			{
				title: "Digital Checklists & Quality Audits",
				description:
					"Supervisors complete inspections with photos, scoring, and corrective action assignment. Track quality scores by site, crew, and time period.",
				icon: "clipboard-check",
			},
			{
				title: "Client Portal & Dashboards",
				description:
					"Clients view schedules, inspection history, photos, and open tickets in real time. Build trust through transparency.",
				icon: "layout-dashboard",
			},
			{
				title: "Geofenced Time & Attendance",
				description:
					"Employees clock in/out via mobile app with GPS verification. No buddy punching, no clocking in from home. Accurate labor costs.",
				icon: "map-pin",
			},
		],
		playbook: [
			{
				title: "Post-Construction Turnover Excellence",
				description:
					"Coordinate multi-day turnovers with phase-specific checklists, crew assignments, equipment staging, and punch list sign-offs. GC signs off digitally when complete. Average turnover completion: 98% on-time.",
			},
			{
				title: "Nightly Janitorial Quality Program",
				description:
					"Auto-assign crews based on contracted hours and certifications. Supervisors complete randomized inspections with photo documentation. Scores below threshold trigger corrective action workflows. Average quality score improvement: 23%.",
			},
			{
				title: "Site Profitability Analysis",
				description:
					"Track labor hours, supply costs, and equipment usage per site. Identify underpriced accounts before renewal. Present data-driven price increase justifications. Average margin improvement: 8% per site.",
			},
		],
		stats: [
			{
				label: "Missed Visits",
				value: "-32%",
				description:
					"reduction by enforcing digital scheduling, confirmations, and real-time coverage visibility.",
			},
			{
				label: "Quality Scores",
				value: "+23%",
				description:
					"improvement through systematic inspection programs and corrective action tracking.",
			},
			{
				label: "Client Retention",
				value: "+18%",
				description:
					"improvement from transparent reporting, client portals, and proactive communication.",
			},
			{
				label: "Labor Accuracy",
				value: "99%",
				description:
					"time tracking accuracy with geofenced clock-in/out—eliminates buddy punching.",
			},
		],
		testimonial: {
			quote:
				"Thorbis gives our supervisors and clients the same view. Schedules, inspections, and corrective actions are on autopilot. We identified 3 accounts losing money and either repriced or exited them. Quality scores are up 23% and client complaints are down 40%.",
			attribution: "Priya Desai",
			role: "Director of Operations, BrightClean Services (85 employees, Chicago IL)",
		},
		faq: [
			{
				question: "How does employee time tracking work with geofencing?",
				answer:
					"Employees clock in/out via the Thorbis mobile app. GPS verifies they're at the job site before allowing clock-in. No buddy punching, no clocking in from home. Managers see real-time attendance across all sites. Overtime alerts trigger before hours exceed budget.",
			},
			{
				question: "Can clients access their own reporting portal?",
				answer:
					"Yes. Each client gets branded portal access showing their schedules, completed visits with photos, inspection scores, open tickets, and service history. Property managers love the transparency—it reduces 'did you clean last night?' calls by 80%.",
			},
			{
				question: "How do quality inspections and corrective actions work?",
				answer:
					"Supervisors complete digital inspections with photo documentation and scoring. Scores below threshold automatically create corrective action tickets assigned to site leads. Track resolution and re-inspection. Quality trends visible by site, crew, and time period.",
			},
			{
				question: "Does Thorbis handle supply inventory and reordering?",
				answer:
					"Track supply usage per site. Crews log what they use during each visit. When inventory hits threshold, Thorbis generates replenishment orders. Know exactly which sites consume supplies fastest and adjust pricing accordingly.",
			},
			{
				question: "Can we track profitability by site or account?",
				answer:
					"Absolutely. Thorbis tracks labor hours, supply costs, and equipment usage per site. Compare actual costs to contract value. Identify accounts losing money before renewal. Present data-driven justification for price increases.",
			},
			{
				question: "How does scheduling handle call-outs and shift swaps?",
				answer:
					"When employees call out, Thorbis identifies qualified replacements based on certifications, location, and availability. Send shift offers to eligible staff. First to accept gets the shift. Coverage gaps get filled in minutes, not hours.",
			},
			{
				question: "How does Thorbis compare to Swept or CleanTelligent?",
				answer:
					"Thorbis delivers enterprise-grade features at transparent pricing. Swept and CleanTelligent charge per-user fees that scale with your workforce. Thorbis is $200/month flat with unlimited users, geofenced time tracking, quality programs, and client portals. No per-employee fees.",
			},
		],
	},
	{
		kind: "industry",
		slug: "locksmith",
		name: "Locksmith Services",
		designVariant: "secure",
		heroEyebrow:
			"Emergency Dispatch • Access Control • Automotive • Security Documentation",
		heroTitle: "The #1 Locksmith Software for Emergency & Commercial Services",
		heroDescription:
			"Respond to lockouts in minutes, document security work securely, manage automotive keys, and grow recurring access control contracts—all from one platform built for locksmith professionals.",
		heroImage:
			"https://images.unsplash.com/photo-1504280317859-9c6edb9b038a?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives locksmith businesses enterprise-grade dispatch, secure documentation, and contract management tools—turning emergency chaos into predictable, profitable operations.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download emergency playbook",
			href: "/templates?tag=locksmith",
		},
		seo: {
			title:
				"Locksmith Software & Emergency Dispatch | #1 for Lock Services | Thorbis",
			description:
				"Dispatch locksmiths to emergencies, manage access control contracts, track automotive key programming, and invoice instantly with Thorbis locksmith business software.",
			keywords: [
				"locksmith software",
				"locksmith dispatch app",
				"locksmith business software",
				"access control service software",
				"locksmith scheduling software",
				"locksmith CRM",
				"emergency locksmith dispatch",
				"automotive locksmith software",
				"key programming software",
				"locksmith invoicing software",
				"commercial locksmith software",
				"locksmith management system",
				"locksmith routing software",
				"locksmith customer portal",
				"access control maintenance software",
				"locksmith mobile app",
				"locksmith business management",
				"safe service software",
				"security service software",
				"locksmith work order software",
			],
		},
		fieldTypes: [
			"Emergency Lockout (Residential)",
			"Commercial Access Control",
			"Automotive Locksmith",
			"Safe & Vault Service",
			"Master Key Systems",
		],
		painPoints: [
			"Emergency calls require instant dispatch—every minute a customer waits, they call a competitor instead.",
			"Sensitive security data (key codes, master key systems, access levels) lives in unsecured spreadsheets or paper files.",
			"Automotive work requires VIN verification and proof of ownership before dispatch, but collecting this wastes valuable time.",
			"Commercial clients demand detailed inspection reports and SLA compliance tracking, but creating them manually takes hours.",
			"No visibility into which technicians are available, closest, or have the right equipment for specific job types.",
		],
		valueProps: [
			{
				title: "30-Second Emergency Dispatch",
				description:
					"AI intake captures lockout details, verifies customer info, collects payment authorization, and routes the nearest available technician—all before the call ends.",
				icon: "alarm-clock",
			},
			{
				title: "Encrypted Security Documentation",
				description:
					"Store key codes, master key systems, access levels, and hardware specs with military-grade encryption. Role-based permissions ensure only authorized staff see sensitive data.",
				icon: "shield",
			},
			{
				title: "Commercial Contract Management",
				description:
					"Schedule recurring access control inspections, track SLA compliance, generate professional reports, and automate renewal reminders. Keep commercial clients for years.",
				icon: "file-check",
			},
			{
				title: "Automotive Verification Workflow",
				description:
					"Collect VIN, proof of ownership photos, and driver's license before dispatch. Protect your business while serving legitimate customers quickly.",
				icon: "car",
			},
		],
		playbook: [
			{
				title: "Emergency Lockout Response",
				description:
					"Call received → AI intake captures details → customer verifies ID via text → nearest tech dispatched → customer sees live ETA → service completed → payment collected → review requested. Average dispatch-to-arrival: 28 minutes. Average customer rating: 4.9 stars.",
			},
			{
				title: "Commercial Access Control Program",
				description:
					"Monthly or quarterly inspections scheduled automatically. Technicians complete site checklists with photos. Reports delivered to property managers within 24 hours. Track device inventories, firmware versions, and replacement recommendations. Renewal rate: 97%.",
			},
			{
				title: "Automotive Key Programming Protocol",
				description:
					"Customer submits VIN and ownership proof via mobile link before dispatch. Technician arrives with correct key blanks. Program, test, and document in Thorbis. Customer signs digitally. Invoice generated and payment collected on-site.",
			},
		],
		stats: [
			{
				label: "Emergency Arrival",
				value: "28 min",
				description:
					"average dispatch-to-arrival time with AI routing and real-time technician tracking.",
			},
			{
				label: "Commercial Retention",
				value: "97%",
				description:
					"of access control contract clients retained through proactive service and reporting.",
			},
			{
				label: "Invoice Speed",
				value: "On-site",
				description:
					"payment collection with digital signatures—no waiting for checks or follow-up invoicing.",
			},
			{
				label: "After-Hours Revenue",
				value: "+45%",
				description:
					"increase from AI-powered 24/7 emergency intake with automated dispatch.",
			},
		],
		testimonial: {
			quote:
				"Thorbis makes emergency and access control work seamless. Our emergency arrival time dropped from 45 minutes to 28 minutes. Customers get live ETA updates. Commercial clients love the professional reports. And we document everything securely—key codes, master systems, all encrypted.",
			attribution: "Hector Yu",
			role: "Owner, Apex Access & Locksmith (12 technicians, Los Angeles CA)",
		},
		faq: [
			{
				question: "How is sensitive security data protected in Thorbis?",
				answer:
					"Thorbis encrypts all sensitive data (key codes, master key systems, access credentials) with AES-256 encryption at rest and in transit. Role-based permissions ensure only authorized staff can access specific data. Audit logs track every access. Your customers' security is our priority.",
			},
			{
				question: "Does Thorbis support 24/7 after-hours emergency dispatch?",
				answer:
					"Yes. Route after-hours calls to Thorbis AI assistant for instant intake and dispatch, or to on-call coordinators with full logging. AI captures customer details, verifies info via text, and dispatches the nearest available technician—even at 3am.",
			},
			{
				question: "How does automotive verification work to prevent fraud?",
				answer:
					"Before dispatch, customers receive a secure link to upload VIN photo, registration, and driver's license. AI verifies vehicle ownership matches the requestor. Technicians only dispatched after verification complete. Protects your business from theft liability.",
			},
			{
				question:
					"Can I track technician inventory (key blanks, programming tools)?",
				answer:
					"Absolutely. Track key blank inventory per technician, programming tool assignments, and usage per job. Know who has what equipment. Generate replenishment alerts when stock runs low. Never lose a job because a tech doesn't have the right blank.",
			},
			{
				question: "How do commercial access control contracts work?",
				answer:
					"Create contract templates with inspection frequencies, SLA terms, and pricing. Thorbis schedules inspections automatically. Technicians complete checklists with photos. Reports generate and deliver to property managers. Track SLA compliance and renewal dates.",
			},
			{
				question: "Does Thorbis support safe and vault service work?",
				answer:
					"Yes. Document safe models, combination protocols (securely encrypted), maintenance history, and warranty information. Schedule annual inspections. Track safe opening, repair, and installation work separately from standard locksmith services.",
			},
			{
				question: "How does Thorbis compare to other locksmith software?",
				answer:
					"Most locksmith software lacks security-grade encryption and emergency dispatch optimization. Thorbis is $200/month flat with unlimited technicians, encrypted documentation, AI emergency dispatch, and commercial contract management. No per-user fees, military-grade security.",
			},
		],
	},
	{
		kind: "industry",
		slug: "garage-door",
		name: "Garage Door Services",
		designVariant: "industrial",
		heroEyebrow:
			"Emergency Repair • Installations • Openers • Maintenance Plans",
		heroTitle: "The #1 Garage Door Software for Service & Installation",
		heroDescription:
			"Respond to emergency repairs fast, manage door and opener installations, and grow recurring maintenance revenue—all from one platform built for garage door professionals.",
		heroImage:
			"https://images.unsplash.com/photo-1494029722182-67245ba45304?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives garage door companies enterprise-grade dispatch, installation project management, and maintenance plan automation—turning every stuck door into long-term customer relationships.",
		primaryCta: {
			label: "Join Waitlist",
			href: "/waitlist",
		},
		secondaryCta: {
			label: "Download maintenance agreement kit",
			href: "/templates?tag=garage-door",
		},
		seo: {
			title:
				"Garage Door Software & Service Management | #1 for Door Companies | Thorbis",
			description:
				"Dispatch emergency repairs, manage door and opener installations, and automate maintenance plans for garage door companies with Thorbis service software.",
			keywords: [
				"garage door software",
				"garage door service software",
				"garage door dispatch",
				"garage door maintenance plans",
				"garage door CRM",
				"garage door company software",
				"garage door scheduling software",
				"garage door installation software",
				"overhead door software",
				"garage door business software",
				"garage door technician app",
				"garage door estimating software",
				"commercial door software",
				"rolling steel door software",
				"garage door opener software",
				"garage door repair software",
				"garage door invoicing software",
				"garage door customer portal",
				"garage door spring replacement software",
				"garage door service management",
			],
		},
		fieldTypes: [
			"Residential Garage Doors",
			"Commercial Overhead Doors",
			"Rolling Steel & Security",
			"Opener Installation & Repair",
			"Spring & Safety Systems",
		],
		painPoints: [
			"Emergency calls demand instant response—stuck doors and security issues can't wait. Customers call competitors when ETAs are unclear.",
			"Installation projects require coordination between measurements, door ordering, opener selection, and crew scheduling. Details fall through cracks.",
			"Maintenance plans are undersold because there's no system to present options, track enrollments, or automate renewal reminders.",
			"No visibility into which technicians are available, closest, or have the right parts on their truck for specific repair types.",
			"Commercial clients with rolling steel and high-speed doors have complex service needs but revenue gets lost without proper tracking.",
		],
		valueProps: [
			{
				title: "Emergency Priority Dispatch",
				description:
					"Flag stuck doors, security issues, and safety hazards for immediate routing. Customers receive live ETA updates. Nearest qualified technician dispatched in seconds.",
				icon: "alert-triangle",
			},
			{
				title: "Installation Project Management",
				description:
					"Manage measurement appointments, door selection, opener pairing, ordering, delivery tracking, and crew scheduling from one visual timeline.",
				icon: "clipboard-list",
			},
			{
				title: "Maintenance Plan Engine",
				description:
					"Enroll customers in annual safety inspections, lubrication programs, and proactive spring replacement. Autopay billing and automated scheduling.",
				icon: "repeat",
			},
			{
				title: "Parts & Inventory Tracking",
				description:
					"Track springs, rollers, openers, and hardware per truck. Know who has what parts. Route repairs to technicians with the right inventory on board.",
				icon: "package-search",
			},
		],
		playbook: [
			{
				title: "Emergency-to-Maintenance Conversion",
				description:
					"Emergency repair completed → technician performs safety inspection → documents worn springs, frayed cables, or aging opener → presents maintenance plan options on-site → customer enrolls with one tap. Maintenance plan attach rate: 34%.",
			},
			{
				title: "Installation Excellence Pipeline",
				description:
					"Lead captured → measurement appointment scheduled → technician captures dimensions with photos → door and opener selection presented with financing options → order placed → delivery tracked → install scheduled around delivery → completion verified with photos → maintenance plan offered. Average cycle: 12 days.",
			},
			{
				title: "Commercial Fleet Program",
				description:
					"Property managers with multiple locations get consolidated billing, priority dispatch, and quarterly inspection reports. Track all doors across portfolio. Automate compliance documentation. Average commercial contract value: $8,400/year.",
			},
		],
		stats: [
			{
				label: "Emergency Response",
				value: "32 min",
				description:
					"average dispatch-to-arrival time for stuck doors and security issues.",
			},
			{
				label: "Install Cycle Time",
				value: "-25%",
				description:
					"reduction in time from measurement to completion through streamlined coordination.",
			},
			{
				label: "Maintenance Revenue",
				value: "+42%",
				description:
					"increase through on-site plan presentation after every emergency and install.",
			},
			{
				label: "Customer Rating",
				value: "4.9★",
				description:
					"average rating with live ETA updates, before/after photos, and professional invoices.",
			},
		],
		testimonial: {
			quote:
				"Thorbis handles emergency calls, installs, and maintenance renewals seamlessly. We went from 12% maintenance plan attach rate to 34% just by presenting options after every service. Customers love the communication—they see the technician coming, get photos of their repair, and receive professional invoices instantly.",
			attribution: "Valerie Brooks",
			role: "Owner, DoorGuard Services (8 technicians, Houston TX)",
		},
		faq: [
			{
				question:
					"Does Thorbis integrate with door suppliers and distributors?",
				answer:
					"Yes. Import vendor catalogs for major manufacturers (Clopay, Amarr, CHI, Wayne Dalton, etc.). Submit orders directly. Track order status and delivery dates. Delivery documents attach to jobs automatically. No manual data entry or status calls.",
			},
			{
				question: "Can customers finance door and opener installations?",
				answer:
					"Absolutely. Present financing options at the proposal stage through integrated lending partners. Customers apply and get approved on-site. Track approval status and fund disbursement inside Thorbis. Increase average ticket by making premium options affordable.",
			},
			{
				question: "How do maintenance plans work for garage door service?",
				answer:
					"Create plan templates with annual or semi-annual visits including safety inspection, lubrication, balance testing, and hardware check. Customers enroll with e-signature and autopay. Thorbis schedules visits automatically and sends reminders. Track plan revenue separately from emergency and install work.",
			},
			{
				question: "Can technicians see parts inventory on their trucks?",
				answer:
					"Yes. Track springs (by size/type), rollers, cables, openers, and hardware per technician. When a call comes in, dispatchers see which techs have the likely needed parts. Route to the right technician to avoid callbacks. Parts usage logs automatically as jobs complete.",
			},
			{
				question: "Does Thorbis handle commercial and industrial door service?",
				answer:
					"Absolutely. Track rolling steel doors, high-speed doors, dock equipment, and commercial overhead doors separately. Service agreements with SLA terms. Inspection checklists specific to commercial equipment. Quarterly reporting for property managers.",
			},
			{
				question: "How does the emergency-to-maintenance conversion work?",
				answer:
					"After completing an emergency repair, technicians perform a quick safety inspection and document findings with photos. Thorbis generates maintenance plan options based on equipment age and condition. Customer sees options on tech's tablet and enrolls with one signature. Average attach rate: 34%.",
			},
			{
				question: "How does Thorbis compare to other garage door software?",
				answer:
					"Most garage door companies use generic field service software not built for their workflow. Thorbis is purpose-built with door-specific features: spring size tracking, opener compatibility, installation project management, and maintenance plan automation. $200/month flat, unlimited technicians, no per-user fees.",
			},
		],
	},
];

export function getAllIndustries(): MarketingIndustryContent[] {
	return INDUSTRY_CONTENT;
}

export function getIndustryBySlug(
	slug: string,
): MarketingIndustryContent | undefined {
	return INDUSTRY_CONTENT.find((industry) => industry.slug === slug);
}
