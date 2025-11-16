import type { MarketingIndustryContent } from "./types";

export const INDUSTRY_CONTENT: MarketingIndustryContent[] = [
	{
		kind: "industry",
		slug: "hvac",
		name: "HVAC Contractors",
		heroEyebrow: "Seasonal Demand • Maintenance Agreements • Install Projects",
		heroTitle: "Run a high-performing HVAC operation with Thorbis",
		heroDescription:
			"Balance install crews and service techs, protect maintenance agreement revenue, and deliver a five-star customer experience.",
		heroImage: "https://images.unsplash.com/photo-1507400492013-162706c8c837?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives HVAC operators real-time dispatch, recurring plan management, and project billing tools purpose-built for heating and cooling businesses.",
		primaryCta: {
			label: "Create your account",
			href: "/register",
		},
		secondaryCta: {
			label: "Download HVAC playbook",
			href: "/templates?tag=hvac",
		},
		seo: {
			title: "HVAC Service Software | Thorbis",
			description:
				"Schedule HVAC techs, manage maintenance agreements, and close premium installs with Thorbis HVAC software.",
			keywords: ["hvac service software", "hvac maintenance agreement management", "hvac dispatch board"],
		},
		fieldTypes: ["Residential", "Light Commercial", "New Construction"],
		painPoints: [
			"Seasonal peaks overwhelm the dispatch board, causing slow response times.",
			"Maintenance plan renewals slip through the cracks, reducing recurring revenue.",
			"Install crews and service techs compete for equipment and scheduling resources.",
		],
		valueProps: [
			{
				title: "Agreement automation",
				description: "Auto-renew maintenance plans, schedule tune-ups, and bill monthly or annually with autopay.",
				icon: "refresh-cw",
			},
			{
				title: "Project & service coordination",
				description:
					"Manage multi-day installs alongside same-day service calls with shared inventory and crew scheduling.",
				icon: "calendar-range",
			},
			{
				title: "Upsell enablement",
				description: "Present financing, IAQ add-ons, and system upgrades inside proposals and customer portals.",
				icon: "sparkles",
			},
		],
		playbook: [
			{
				title: "Pre-season tune-up blitz",
				description:
					"Segment maintenance customers, launch automated outreach, and use AI booking to fill crews before peak season.",
			},
			{
				title: "Install to service handoff",
				description:
					"Capture install details, warranty registration, and upsell opportunities so service techs have full context on day one.",
			},
		],
		stats: [
			{
				label: "Maintenance renewals",
				value: "92%",
				description: "of agreements renewed automatically through Thorbis workflows.",
			},
			{
				label: "Average ticket size",
				value: "+19%",
				description: "increase when proposals include financing and tiered options.",
			},
			{
				label: "Dispatch efficiency",
				value: "+24%",
				description: "more calls managed per coordinator during summer rush.",
			},
		],
		testimonial: {
			quote:
				"We run installs, service, and maintenance from the same board. Thorbis keeps agreements renewed and crews booked solid.",
			attribution: "Chris Bennett",
			role: "Owner, Sunrise Heating & Air",
		},
		faq: [
			{
				question: "Can Thorbis manage service plans?",
				answer:
					"Yes. Define plan types, visit frequencies, pricing escalations, and automatic renewals with stored payment methods.",
			},
			{
				question: "How do you handle multi-day installs?",
				answer:
					"Schedule crews, order equipment, track submittals, and invoice progress draws without leaving Thorbis.",
			},
			{
				question: "Do you support manufacturer rebates?",
				answer: "Track serial numbers, attach documents, and export rebate reports per manufacturer program.",
			},
		],
	},
	{
		kind: "industry",
		slug: "plumbing",
		name: "Plumbing Companies",
		heroEyebrow: "Emergency Calls • Drain Cleaning • Project Work",
		heroTitle: "Dispatch the right plumber faster, every time",
		heroDescription:
			"Thorbis reduces windshield time, tracks parts, and keeps customers informed—from drain calls to repipes.",
		heroImage: "https://images.unsplash.com/photo-1557281035-4c52d764680b?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Handle 24/7 emergencies, recurring maintenance, and high-margin replacements with a dispatch board tuned for plumbing workflows.",
		primaryCta: {
			label: "Explore plumbing workflows",
			href: "/register",
		},
		secondaryCta: {
			label: "Download plumbing toolkit",
			href: "/templates?tag=plumbing",
		},
		seo: {
			title: "Plumbing Dispatch & Operations Software | Thorbis",
			description:
				"Respond to plumbing emergencies, manage drain maintenance plans, and track truck stock with Thorbis.",
			keywords: ["plumbing dispatch software", "plumbing field service management", "plumbing inventory control"],
		},
		fieldTypes: ["Residential Service", "Commercial Plumbing", "Construction"],
		painPoints: [
			"Emergency jobs interrupt the schedule and frustrate customers when communication lags.",
			"Truck stock varies wildly by technician, causing return trips and lost revenue.",
			"Customers expect upfront pricing and financing for major replacements.",
		],
		valueProps: [
			{
				title: "Emergency triage",
				description:
					"AI intake prioritizes true emergencies, captures photos, and dispatches the nearest qualified tech.",
				icon: "alert-triangle",
			},
			{
				title: "Truck stock enforcement",
				description: "Set required inventory templates per truck, with automated replenishment workflows.",
				icon: "package-check",
			},
			{
				title: "On-site proposals & financing",
				description: "Build replacement quotes with good-better-best options and financing right from the mobile app.",
				icon: "file-text",
			},
		],
		playbook: [
			{
				title: "Drain maintenance programs",
				description:
					"Automate recurring jetting and camera inspections with reminder campaigns and technician checklists.",
			},
			{
				title: "Repipe project coordination",
				description: "Plan multi-day repipes with crew assignments, permit tracking, and progress billing in Thorbis.",
			},
		],
		stats: [
			{
				label: "Emergency response time",
				value: "45 min",
				description: "average arrival window achieved with Thorbis routing.",
			},
			{
				label: "First-time fix rate",
				value: "94%",
				description: "thanks to enforced truck stock templates and photo notes.",
			},
			{
				label: "Average project revenue",
				value: "+17%",
				description: "increase after adding on-site financing and proposals.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps our drain trucks moving and our repipe crews organized. Emergency calls no longer derail the schedule.",
			attribution: "Sasha Kim",
			role: "General Manager, FlowMaster Plumbing",
		},
		faq: [
			{
				question: "Can I track jetter equipment maintenance?",
				answer: "Yes. Log equipment hours, schedule maintenance, and attach service history.",
			},
			{
				question: "How do you handle permits?",
				answer: "Attach permit details, expiration dates, and required documents to each job with automated reminders.",
			},
			{
				question: "Do you support after-hours call centers?",
				answer: "Thorbis AI intake or forwarding rules capture jobs after hours and sync them to dispatch instantly.",
			},
		],
	},
	{
		kind: "industry",
		slug: "electrical",
		name: "Electrical Contractors",
		heroEyebrow: "Service Calls • Projects • Safety Compliance",
		heroTitle: "Run a safe, efficient electrical operation",
		heroDescription:
			"Thorbis drives productivity for electricians with detailed job workflows, safety checklists, and inventory control.",
		heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Track projects, capture documentation, and keep crews compliant with NEC requirements while delivering a polished customer experience.",
		primaryCta: {
			label: "Tour electrical features",
			href: "/register",
		},
		secondaryCta: {
			label: "Download electrical proposal pack",
			href: "/templates?tag=electrical",
		},
		seo: {
			title: "Electrical Contractor Software | Thorbis",
			description:
				"Schedule electricians, manage safety workflows, and track materials with Thorbis electrical contractor software.",
			keywords: ["electrical contractor software", "electrician dispatch", "nec compliance software"],
		},
		fieldTypes: ["Residential Service", "Commercial TI", "Industrial"],
		painPoints: [
			"Compliance documentation and photos live on personal devices.",
			"Project managers can’t see labor progress or material usage in real time.",
			"Estimators spend hours creating proposals and change orders manually.",
		],
		valueProps: [
			{
				title: "Safety checklists & documentation",
				description: "Enforce lockout/tagout, arc flash, and PPE checklists with required sign-offs and photos.",
				icon: "shield-check",
			},
			{
				title: "Project time & material tracking",
				description: "Technicians record labor codes and material pulls that feed directly into job costing.",
				icon: "clipboard-list",
			},
			{
				title: "Professional proposals & change orders",
				description: "Generate NEC-compliant proposals with alternates, revisions, and digital approvals.",
				icon: "file-text",
			},
		],
		playbook: [
			{
				title: "Service-to-project pipeline",
				description: "Convert diagnostic visits into panel upgrades or lighting retrofits with tiered proposals.",
			},
			{
				title: "Commercial TI progress billing",
				description: "Track progress, submit pay apps, and document inspections directly inside Thorbis.",
			},
		],
		stats: [
			{
				label: "Safety compliance",
				value: "100%",
				description: "of jobs logged with required checklists and signatures.",
			},
			{
				label: "Change order turnaround",
				value: "-70%",
				description: "reduction in approval time thanks to digital workflows.",
			},
			{
				label: "Material variance",
				value: "-18%",
				description: "decrease due to real-time usage tracking.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps our electricians compliant and our project managers informed. Change orders and photos tie directly to each job.",
			attribution: "Jordan Blake",
			role: "Operations VP, VoltEdge Electric",
		},
		faq: [
			{
				question: "Do you support multi-phase projects?",
				answer:
					"Yes. Create phases, budget labor and materials, and bill progress draws tied to percentage completion.",
			},
			{
				question: "How are safety checklists enforced?",
				answer: "Technicians must complete digital checklists with photo evidence before closing out the job.",
			},
			{
				question: "Can estimators work from templates?",
				answer: "Build reusable assemblies, NEC references, and pricing templates to accelerate estimating.",
			},
		],
	},
	{
		kind: "industry",
		slug: "handyman",
		name: "Handyman & Small Projects",
		heroEyebrow: "Punch Lists • Recurring Clients • Upsells",
		heroTitle: "Scale your handyman business without chaos",
		heroDescription:
			"Thorbis gives handyman teams simple scheduling, estimates, and payment tools to run efficient operations while growing repeat business.",
		heroImage: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Offer professional experiences with minimal admin overhead—perfect for owner-operators and multi-crew handyman operations.",
		primaryCta: {
			label: "Start a handyman trial",
			href: "/register",
		},
		secondaryCta: {
			label: "Download handyman templates",
			href: "/templates?tag=handyman",
		},
		seo: {
			title: "Handyman Business Software | Thorbis",
			description:
				"Dispatch crews, send estimates, and collect payments for handyman jobs with Thorbis. Build repeat business effortlessly.",
			keywords: ["handyman software", "handyman scheduling app", "handyman invoicing software"],
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
				description: "Build consistent estimates with templates, service bundles, and stored photos.",
				icon: "sparkles",
			},
			{
				title: "Simple scheduling",
				description: "Drag-and-drop jobs, send appointment reminders, and let customers reschedule online.",
				icon: "calendar",
			},
			{
				title: "Instant payments",
				description: "Collect deposits or full payments via card or ACH and sync to accounting automatically.",
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
				description: "saved each week through automated invoicing and payments.",
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
				answer: "Yes. Thorbis exports invoices and payments to both QuickBooks Online and Self-Employed editions.",
			},
			{
				question: "Do you support tip tracking?",
				answer: "Track tips separately and distribute automatically when closing out invoices.",
			},
		],
	},
	{
		kind: "industry",
		slug: "landscaping",
		name: "Landscaping & Lawn Care",
		heroEyebrow: "Route Density • Seasonal Services • Crew Management",
		heroTitle: "Grow a profitable landscaping operation with Thorbis",
		heroDescription:
			"Optimize routes, manage crews, and automate seasonal upsells for maintenance and enhancement work.",
		heroImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80",
		summary: "Thorbis helps landscapers improve route density, track job costing, and stay on top of renewals.",
		primaryCta: {
			label: "See landscaping workflows",
			href: "/register",
		},
		secondaryCta: {
			label: "Download route optimization kit",
			href: "/templates?tag=landscaping",
		},
		seo: {
			title: "Landscaping Business Software | Thorbis",
			description:
				"Optimize lawn routes, manage crews, and automate seasonal upsells with Thorbis landscaping software.",
			keywords: ["landscaping software", "lawn care scheduling", "landscaping route planning"],
		},
		fieldTypes: ["Residential Maintenance", "Commercial Grounds", "Snow & Ice"],
		painPoints: [
			"Route planning takes hours and doesn’t account for crew productivity.",
			"Enhancement upsells are missed because there’s no structured follow-up.",
			"Job costing is difficult when materials, labor, and equipment usage aren’t tracked in one place.",
		],
		valueProps: [
			{
				title: "Route density optimization",
				description:
					"Plan recurring visits to minimize windshield time and maintain mowing cycles without manual maps.",
				icon: "route",
			},
			{
				title: "Crew productivity tracking",
				description: "Log clock-ins, job completion photos, and materials used per crew to track profitability.",
				icon: "check-circle",
			},
			{
				title: "Seasonal upsell automations",
				description:
					"Trigger mulch, aeration, irrigation start-up, or snow proposals based on property history and season.",
				icon: "leaf",
			},
		],
		playbook: [
			{
				title: "Spring renewal campaign",
				description:
					"Auto-send renewals and upsell enhancements to every maintenance customer with approval tracking in Thorbis.",
			},
			{
				title: "Crew scorecards",
				description: "Review crew-level profitability, quality scores, and on-time performance to focus training.",
			},
		],
		stats: [
			{
				label: "Route efficiency",
				value: "+18%",
				description: "more jobs completed per crew per day.",
			},
			{
				label: "Enhancement revenue",
				value: "+23%",
				description: "increase from structured upsell journeys.",
			},
			{
				label: "Crew overtime",
				value: "-30%",
				description: "reduction through balanced scheduling and live tracking.",
			},
		],
		testimonial: {
			quote:
				"Thorbis routes our crews, tracks time, and keeps renewals on autopilot. We finally know which accounts are profitable.",
			attribution: "Devon Price",
			role: "Owner, GreenPath Landscaping",
		},
		faq: [
			{
				question: "Does Thorbis support snow operations?",
				answer: "Yes. Manage plow routes, on-call rotations, and per-event billing in the same platform.",
			},
			{
				question: "Can crews work offline?",
				answer: "Crew leaders download routes and checklists ahead of time, then sync when back in coverage.",
			},
			{
				question: "Do you integrate with GPS trackers?",
				answer: "Thorbis integrates with leading telematics vendors to monitor crew location and mileage.",
			},
		],
	},
	{
		kind: "industry",
		slug: "pool-service",
		name: "Pool & Spa Service",
		heroEyebrow: "Route Management • Chemical Logs • Retail Sales",
		heroTitle: "Deliver crystal-clear service with Thorbis",
		heroDescription:
			"Manage weekly routes, track chemical readings, and upsell equipment upgrades with a single system.",
		heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Thorbis gives pool operators the tools to stay compliant, track recurring visits, and grow retail revenue.",
		primaryCta: {
			label: "Tour pool service tools",
			href: "/register",
		},
		secondaryCta: {
			label: "Download chemical log template",
			href: "/templates?tag=pool-service",
		},
		seo: {
			title: "Pool Service Software | Thorbis",
			description:
				"Track pool routes, chemical readings, and equipment upgrades with Thorbis software built for pool and spa professionals.",
			keywords: ["pool service software", "pool route management", "pool chemical log app"],
		},
		fieldTypes: ["Residential Weekly", "Commercial Aquatics", "Retail + Service"],
		painPoints: [
			"Route changes and stop skips create billing errors.",
			"Chemical logs are managed on paper, risking compliance issues.",
			"Upsell opportunities for heaters, automation, or remodels go untapped.",
		],
		valueProps: [
			{
				title: "Recurring route planner",
				description: "Maintain balanced weekly routes with drag-and-drop scheduling and skip tracking.",
				icon: "calendar",
			},
			{
				title: "Digital chemical logs",
				description: "Record readings, photos, and dosing with automatic compliance reports available to customers.",
				icon: "flask",
			},
			{
				title: "Retail & upgrade tracking",
				description: "Sync service visits with retail sales, recommend upgrades, and track follow-up opportunities.",
				icon: "shopping-cart",
			},
		],
		playbook: [
			{
				title: "Spring opening sequence",
				description: "Schedule openings, send prep checklists, and collect deposits with automated reminders.",
			},
			{
				title: "Equipment upgrade pipeline",
				description: "Tag pools with outdated equipment, auto-create upgrade proposals, and monitor conversion.",
			},
		],
		stats: [
			{
				label: "Route adjustments",
				value: "-40%",
				description: "reduction in manual route edits after adopting Thorbis.",
			},
			{
				label: "Chemical log compliance",
				value: "100%",
				description: "digital logs stored with timestamped technician entries.",
			},
			{
				label: "Upgrade revenue",
				value: "+26%",
				description: "increase from structured upsell pipeline.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps routes tight, chemicals logged, and retail upgrades organized. Customers see exactly what we did at every visit.",
			attribution: "Nicole Hernandez",
			role: "Operations Manager, AquaGlow Pools",
		},
		faq: [
			{
				question: "Do you handle chemical compliance reports?",
				answer: "Yes. Export branded reports with readings and photos per visit for commercial clients or homeowners.",
			},
			{
				question: "Can I track retail sales?",
				answer: "Thorbis associates retail transactions with service accounts and tracks equipment warranty details.",
			},
			{
				question: "What about skipped stops?",
				answer: "Mark skips with reasons, adjust billing automatically, and notify customers in real time.",
			},
		],
	},
	{
		kind: "industry",
		slug: "pest-control",
		name: "Pest Control",
		heroEyebrow: "Route Density • Treatments • Compliance",
		heroTitle: "Keep pest control teams responsive and compliant",
		heroDescription:
			"Thorbis manages recurring treatment routes, chemical usage, and customer renewals for pest operators of any size.",
		heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Spend less time on paperwork and more time delivering exceptional pest control service with automated routing and reporting.",
		primaryCta: {
			label: "Explore pest control tools",
			href: "/register",
		},
		secondaryCta: {
			label: "Download compliance checklist",
			href: "/templates?tag=pest-control",
		},
		seo: {
			title: "Pest Control Business Software | Thorbis",
			description: "Optimize pest control routes, track chemical usage, and automate renewals with Thorbis software.",
			keywords: ["pest control software", "pest route optimization", "pest control chemical logs"],
		},
		fieldTypes: ["Residential Pest", "Commercial IPM", "Mosquito & Termite"],
		painPoints: [
			"Route density suffers when technicians make manual adjustments or skips.",
			"Chemical reporting requirements differ by state and are tedious to compile.",
			"Renewals rely on manual outreach, risking churn.",
		],
		valueProps: [
			{
				title: "Optimized recurring routes",
				description: "Plan monthly, quarterly, or seasonal routes with skip tracking and auto-rescheduling.",
				icon: "map-pin",
			},
			{
				title: "Chemical tracking & reporting",
				description: "Record mixes, application rates, and site notes; export state-specific compliance forms.",
				icon: "flask",
			},
			{
				title: "Renewal automation",
				description: "Send renewal notices, capture signatures, and update billing with autopay.",
				icon: "rotate-cw",
			},
		],
		playbook: [
			{
				title: "Mosquito season ramp-up",
				description: "Launch targeted SMS and email campaigns for seasonal add-ons with automated scheduling.",
			},
			{
				title: "Commercial inspection reports",
				description: "Provide branded inspection summaries with high-resolution photos and recommendations.",
			},
		],
		stats: [
			{
				label: "Route efficiency",
				value: "+20%",
				description: "increase in visits completed per technician each day.",
			},
			{
				label: "Compliance reporting time",
				value: "-8 hrs",
				description: "saved monthly by automating chemical logs and forms.",
			},
			{
				label: "Renewal rate",
				value: "93%",
				description: "of annual pest plans renewed through Thorbis automations.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps our techs on tight routes and chemical logs compliant. Renewals happen automatically, which protects our recurring revenue.",
			attribution: "Logan Fisher",
			role: "Owner, ShieldGuard Pest Solutions",
		},
		faq: [
			{
				question: "Do you support termite inspections?",
				answer: "Yes. Capture inspection diagrams, treatments, warranties, and renewal reminders in Thorbis.",
			},
			{
				question: "How granular are chemical records?",
				answer:
					"Track EPA numbers, batch IDs, dosage, weather conditions, and technician signatures for each treatment.",
			},
			{
				question: "Can I handle different service frequencies?",
				answer:
					"Create service templates for monthly, bi-monthly, quarterly, or annual programs with automated scheduling.",
			},
		],
	},
	{
		kind: "industry",
		slug: "appliance-repair",
		name: "Appliance Repair",
		heroEyebrow: "Warranty Calls • Parts Logistics • Customer Experience",
		heroTitle: "Delight appliance repair customers at scale",
		heroDescription:
			"Thorbis manages warranty claims, parts ordering, and technician routing so every repair is handled right the first time.",
		heroImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Track manufacturer warranties, manage depot inventory, and update customers automatically with technician ETAs.",
		primaryCta: {
			label: "Tour appliance repair workflows",
			href: "/register",
		},
		secondaryCta: {
			label: "Download parts management guide",
			href: "/templates?tag=appliance",
		},
		seo: {
			title: "Appliance Repair Software | Thorbis",
			description:
				"Manage warranty calls, schedule technicians, and track parts for appliance repair businesses with Thorbis.",
			keywords: ["appliance repair software", "appliance warranty management", "appliance parts tracking"],
		},
		fieldTypes: ["Warranty Service", "COD Residential", "Commercial Kitchen"],
		painPoints: [
			"Warranty information and claim numbers live in spreadsheets or email.",
			"Parts ordering is manual, leading to work stoppages and callbacks.",
			"Customers expect real-time updates about technician arrival and job status.",
		],
		valueProps: [
			{
				title: "Warranty intelligence",
				description: "Store manufacturer codes, coverage dates, and claim numbers with quick lookup for dispatchers.",
				icon: "library",
			},
			{
				title: "Parts ordering automation",
				description: "Generate purchase orders, track shipping status, and notify technicians when parts arrive.",
				icon: "package-search",
			},
			{
				title: "Customer notifications",
				description: "Send branded appointment reminders, technician bios, and work summaries automatically.",
				icon: "bell",
			},
		],
		playbook: [
			{
				title: "Warranty claim processing",
				description:
					"Create standardized workflows for claim submissions, manufacturer approvals, and billing reconciliation.",
			},
			{
				title: "Depot to truck transfers",
				description: "Track parts at the depot, assign to technicians, and update stock levels as jobs close.",
			},
		],
		stats: [
			{
				label: "Callback rate",
				value: "-31%",
				description: "reduction thanks to proactive parts and warranty management.",
			},
			{
				label: "Customer satisfaction",
				value: "4.8★",
				description: "average rating with ETA notifications and post-service updates.",
			},
			{
				label: "Claims processing time",
				value: "-50%",
				description: "faster claim submission and approval turnaround.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps warranty data, parts, and customer updates organized. Technicians arrive with the right part every time.",
			attribution: "Kim Alvarez",
			role: "Service Director, Apex Appliance Repair",
		},
		faq: [
			{
				question: "Do you integrate with part distributors?",
				answer: "Yes. Connect to major appliance distributors to pull availability and pricing in real time.",
			},
			{
				question: "Can we track serialized parts?",
				answer: "Track serial numbers, warranty periods, and return authorizations effortlessly in Thorbis.",
			},
			{
				question: "How are customers kept informed?",
				answer: "Customers receive appointment reminders, technician ETAs, and completion summaries via email or SMS.",
			},
		],
	},
	{
		kind: "industry",
		slug: "roofing",
		name: "Roofing Contractors",
		heroEyebrow: "Inspections • Production • Insurance",
		heroTitle: "Deliver flawless roofing projects from inspection to final bill",
		heroDescription:
			"Thorbis manages inspections, crew scheduling, material deliveries, and insurance documentation for roofing companies.",
		heroImage: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Handle storm response, retail re-roofs, and repair programs with clear workflows and customer communication.",
		primaryCta: {
			label: "See roofing operations",
			href: "/register",
		},
		secondaryCta: {
			label: "Download roofing project pack",
			href: "/templates?tag=roofing",
		},
		seo: {
			title: "Roofing Business Management Software | Thorbis",
			description:
				"Coordinate inspections, crews, and insurance paperwork with Thorbis roofing software. Close more jobs faster.",
			keywords: ["roofing software", "roofing project management", "roofing inspection app"],
		},
		fieldTypes: ["Insurance Restoration", "Retail Roofing", "Commercial"],
		painPoints: [
			"Storm response overwhelms call centers and crews without a structured intake process.",
			"Material ordering and delivery coordination slows down production.",
			"Insurance paperwork, photos, and supplements get lost in email chains.",
		],
		valueProps: [
			{
				title: "Storm intake & triage",
				description: "Capture leads from multiple channels, validate coverage areas, and assign inspections quickly.",
				icon: "megaphone",
			},
			{
				title: "Production scheduling",
				description: "Coordinate crews, deliveries, dumpsters, and weather windows in one timeline view.",
				icon: "calendar-range",
			},
			{
				title: "Documentation hub",
				description:
					"Store inspection photos, EagleView reports, insurance documents, and supplements with version control.",
				icon: "folder-open",
			},
		],
		playbook: [
			{
				title: "Inspection-to-production pipeline",
				description:
					"Move approved inspections through material ordering, crew assignment, and customer communication automatically.",
			},
			{
				title: "Insurance supplement tracking",
				description: "Manage supplements, approvals, and change orders with transparency for homeowners.",
			},
		],
		stats: [
			{
				label: "Cycle time",
				value: "-21%",
				description: "reduction from inspection to install completion.",
			},
			{
				label: "Supplement recovery",
				value: "+18%",
				description: "increase in approved supplements through structured documentation.",
			},
			{
				label: "Customer satisfaction",
				value: "4.9★",
				description: "average rating with proactive communication via the portal.",
			},
		],
		testimonial: {
			quote:
				"Thorbis keeps roofing projects organized from inspection to final invoice. Insurance docs, photos, and production schedules live in one place.",
			attribution: "Grant Wallace",
			role: "Production Manager, Summit Roofing",
		},
		faq: [
			{
				question: "Do you integrate with aerial measurement providers?",
				answer: "Yes. Sync EagleView and Hover reports directly to jobs with measurements imported.",
			},
			{
				question: "How do you manage weather delays?",
				answer:
					"Thorbis monitors weather feeds and helps reschedule crews and notify customers when conditions change.",
			},
			{
				question: "Can homeowners track progress?",
				answer: "Homeowners log into the portal to see schedules, progress photos, and outstanding tasks.",
			},
		],
	},
	{
		kind: "industry",
		slug: "cleaning",
		name: "Cleaning & Janitorial",
		heroEyebrow: "Recurring Service • Checklists • Quality Control",
		heroTitle: "Deliver consistent cleaning service without the chaos",
		heroDescription:
			"Thorbis helps cleaning companies manage recurring schedules, staff assignments, and quality audits effortlessly.",
		heroImage: "https://images.unsplash.com/photo-1581578017421-9890848fc1c0?auto=format&fit=crop&w=1600&q=80",
		summary:
			"Coordinators schedule crews, supervisors run inspections, and clients view reports through a shared portal.",
		primaryCta: {
			label: "Explore cleaning workflows",
			href: "/register",
		},
		secondaryCta: {
			label: "Download cleaning checklist pack",
			href: "/templates?tag=cleaning",
		},
		seo: {
			title: "Cleaning & Janitorial Software | Thorbis",
			description:
				"Schedule cleaning crews, enforce checklists, and share inspection reports with clients using Thorbis.",
			keywords: ["cleaning business software", "janitorial scheduling", "cleaning inspection app"],
		},
		fieldTypes: ["Commercial Nightly", "Residential Maid Service", "Post-Construction"],
		painPoints: [
			"Staff schedules change daily, making coverage difficult to manage.",
			"Quality control relies on paper checklists and inconsistent follow-up.",
			"Clients demand transparency with photos and reports.",
		],
		valueProps: [
			{
				title: "Recurring schedule engine",
				description: "Manage site-specific frequencies, rotations, and exclusions with drag-and-drop adjustments.",
				icon: "calendar",
			},
			{
				title: "Digital checklists & inspections",
				description: "Supervisors complete inspections with photos, scoring, and corrective actions.",
				icon: "clipboard-check",
			},
			{
				title: "Client portal & dashboards",
				description: "Clients view schedules, inspection history, and open issues in real time.",
				icon: "layout-dashboard",
			},
		],
		playbook: [
			{
				title: "Post-construction turnover",
				description: "Coordinate multi-day turnovers with crew assignments, equipment needs, and punch list sign-offs.",
			},
			{
				title: "Nightly janitorial rotation",
				description: "Auto-assign crews based on contracted hours, track clock-ins, and document supplies used.",
			},
		],
		stats: [
			{
				label: "Missed visits",
				value: "-32%",
				description: "reduction by enforcing digital scheduling and confirmations.",
			},
			{
				label: "Inspection completion",
				value: "96%",
				description: "of required inspections completed on time with Thorbis mobile.",
			},
			{
				label: "Client retention",
				value: "+15%",
				description: "improvement from transparent reporting and communication.",
			},
		],
		testimonial: {
			quote:
				"Thorbis gives our supervisors and clients the same view. Schedules, inspections, and corrective actions are on autopilot.",
			attribution: "Priya Desai",
			role: "Director of Operations, BrightClean Services",
		},
		faq: [
			{
				question: "Can employees clock in/out in Thorbis?",
				answer: "Yes. Use geofenced time tracking or QR codes to verify on-site attendance.",
			},
			{
				question: "Do clients get custom reporting?",
				answer: "Build site-specific dashboards with SLA metrics, inspection scores, and tickets.",
			},
			{
				question: "How do you manage supply inventory?",
				answer: "Track supply usage per site and generate replenishment tasks when thresholds are met.",
			},
		],
	},
	{
		kind: "industry",
		slug: "locksmith",
		name: "Locksmith Services",
		heroEyebrow: "Emergency Response • Access Control • Dispatch",
		heroTitle: "Answer every lockout and access call with confidence",
		heroDescription:
			"Thorbis helps locksmiths respond fast, document security work, and grow recurring access control contracts.",
		heroImage: "https://images.unsplash.com/photo-1504280317859-9c6edb9b038a?auto=format&fit=crop&w=1600&q=80",
		summary:
			"From emergency lockouts to enterprise access systems, Thorbis streamlines scheduling, documentation, and invoicing.",
		primaryCta: {
			label: "See locksmith toolkit",
			href: "/register",
		},
		secondaryCta: {
			label: "Download emergency playbook",
			href: "/templates?tag=locksmith",
		},
		seo: {
			title: "Locksmith Business Software | Thorbis",
			description: "Dispatch locksmiths, manage access control work, and invoice quickly with Thorbis software.",
			keywords: ["locksmith software", "locksmith dispatch app", "access control service software"],
		},
		fieldTypes: ["Emergency Lockout", "Commercial Access Control", "Automotive"],
		painPoints: [
			"Emergency calls require rapid dispatch and communication.",
			"Technicians need job history, key codes, and security protocols on-site.",
			"Commercial clients demand detailed reports and recurring maintenance.",
		],
		valueProps: [
			{
				title: "Rapid emergency dispatch",
				description:
					"AI intake captures lockout details, driver’s license info, and routes the nearest locksmith instantly.",
				icon: "alarm-clock",
			},
			{
				title: "Security documentation",
				description: "Store key codes, access levels, hardware specs, and before/after photos securely in Thorbis.",
				icon: "shield",
			},
			{
				title: "Maintenance contracts",
				description: "Schedule recurring access control inspections and track service level agreements.",
				icon: "file-check",
			},
		],
		playbook: [
			{
				title: "Automotive lockout workflow",
				description:
					"Capture VIN, proof of ownership, and payment before dispatching. Provide arrival countdown to customers.",
			},
			{
				title: "Access control inspections",
				description: "Technicians complete site checklists, document devices, and generate follow-up work orders.",
			},
		],
		stats: [
			{
				label: "Emergency arrival",
				value: "30 min",
				description: "average arrival window with optimized routing.",
			},
			{
				label: "Commercial retention",
				value: "97%",
				description: "of access control clients retained through contract automation.",
			},
			{
				label: "Invoice turnaround",
				value: "Same day",
				description: "thanks to digital signatures and payment collection.",
			},
		],
		testimonial: {
			quote:
				"Thorbis makes emergency and access control work seamless. We document everything and clients see professional reports instantly.",
			attribution: "Hector Yu",
			role: "Owner, Apex Access & Locksmith",
		},
		faq: [
			{
				question: "Is sensitive data secure?",
				answer: "Yes. Thorbis encrypts key codes and access details with role-based permissions.",
			},
			{
				question: "Do you support after-hours answering?",
				answer: "Route after-hours calls to Thorbis AI assistant or on-call coordinators with full logging.",
			},
			{
				question: "Can I manage automotive key programming?",
				answer: "Track key blanks, programming tools, and capture signatures digitally before release.",
			},
		],
	},
	{
		kind: "industry",
		slug: "garage-door",
		name: "Garage Door Services",
		heroEyebrow: "Emergency Service • Installations • Maintenance Plans",
		heroTitle: "Keep doors operating smoothly and customers delighted",
		heroDescription:
			"Thorbis helps garage door companies respond to emergencies, manage installs, and grow preventative maintenance revenue.",
		heroImage: "https://images.unsplash.com/photo-1494029722182-67245ba45304?auto=format&fit=crop&w=1600&q=80",
		summary: "Combine responsive dispatch, project scheduling, and maintenance plan automation in one platform.",
		primaryCta: {
			label: "Explore garage door workflows",
			href: "/register",
		},
		secondaryCta: {
			label: "Download maintenance agreement kit",
			href: "/templates?tag=garage-door",
		},
		seo: {
			title: "Garage Door Service Software | Thorbis",
			description:
				"Dispatch emergency repairs, manage installs, and automate maintenance plans for garage door companies with Thorbis.",
			keywords: ["garage door software", "garage door dispatch", "garage door maintenance plans"],
		},
		fieldTypes: ["Residential", "Commercial", "Rolling Steel"],
		painPoints: [
			"Emergency calls demand fast scheduling with clear technician ETAs.",
			"Install projects require coordination between parts, crews, and financing.",
			"Maintenance plans are difficult to track without automated reminders.",
		],
		valueProps: [
			{
				title: "Priority dispatch board",
				description: "Flag stuck doors and security issues for immediate routing with customer notifications.",
				icon: "alert-triangle",
			},
			{
				title: "Install project templates",
				description: "Manage measurement appointments, door ordering, and crew scheduling from one timeline.",
				icon: "clipboard-list",
			},
			{
				title: "Maintenance plan automation",
				description: "Enroll customers in safety checks, lubrication, and spring replacement programs with autopay.",
				icon: "repeat",
			},
		],
		playbook: [
			{
				title: "Emergency repair workflow",
				description:
					"Capture photos, secure payment info, and dispatch the nearest tech with rolling updates to the customer.",
			},
			{
				title: "Install to maintenance journey",
				description: "After install completion, trigger maintenance plan invitations and follow-up campaigns.",
			},
		],
		stats: [
			{
				label: "Emergency response time",
				value: "35 min",
				description: "average door-safety response time using Thorbis routing.",
			},
			{
				label: "Install project cycle time",
				value: "-18%",
				description: "reduction in time from quote to completion.",
			},
			{
				label: "Maintenance plan revenue",
				value: "+25%",
				description: "increase through automated enrollment campaigns.",
			},
		],
		testimonial: {
			quote:
				"Thorbis handles emergency calls, installs, and maintenance renewals seamlessly. Customers love the communication.",
			attribution: "Valerie Brooks",
			role: "Owner, DoorGuard Services",
		},
		faq: [
			{
				question: "Do you integrate with door suppliers?",
				answer: "Import vendor catalogs, track order statuses, and attach delivery documents to jobs.",
			},
			{
				question: "Can customers finance installations?",
				answer: "Yes. Offer financing at the proposal stage and track approvals inside Thorbis.",
			},
			{
				question: "How do you manage maintenance plans?",
				answer: "Set visit frequencies, automate reminders, and bill on autopay for enrolled customers.",
			},
		],
	},
];

export function getAllIndustries(): MarketingIndustryContent[] {
	return INDUSTRY_CONTENT;
}

export function getIndustryBySlug(slug: string): MarketingIndustryContent | undefined {
	return INDUSTRY_CONTENT.find((industry) => industry.slug === slug);
}
