import type { MarketingFAQ, MarketingValueProp } from "./types";

export type CompetitorComparison = {
	slug: string;
	competitorName: string;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	summary: string;
	seo: {
		title: string;
		description: string;
		keywords: string[];
	};
	idealCustomerProfile: string[];
	thorbisAdvantages: MarketingValueProp[];
	comparisonTable: Array<{
		category: string;
		thorbis: string;
		competitor: string;
	}>;
	migrationPlan: Array<{
		title: string;
		description: string;
		steps: string[];
	}>;
	pricingNotes: string[];
	testimonial?: {
		quote: string;
		attribution: string;
		role?: string;
	};
	faq: MarketingFAQ[];
};

const COMPETITORS: CompetitorComparison[] = [
	{
		slug: "servicetitan",
		competitorName: "ServiceTitan",
		heroEyebrow: "Enterprise Power • Predictable Pricing • AI Assist",
		heroTitle: "Thorbis vs ServiceTitan",
		heroDescription:
			"Thorbis delivers the enterprise capabilities contractors expect from ServiceTitan, without the hidden costs, shelfware, or multi-year commitments. Real ServiceTitan customers report paying $259/tech/month plus unauthorized charges averaging $5,000+ for features promised as 'free'.",
		summary:
			"Switch to Thorbis for a modern platform built around AI-assisted workflows, flexible pricing, and rapid innovation. While ServiceTitan users report annual costs exceeding $353,000 with 31 BBB complaints in 3 years, Thorbis offers transparent pricing starting at $100/month with pay-as-you-go AI features—no multi-year lock-ins, no hidden fees, no surprise charges.",
		seo: {
			title: "Thorbis vs ServiceTitan | Modern Field Service Platform Comparison",
			description:
				"Compare Thorbis and ServiceTitan on pricing, user experience, AI, and implementation. Discover why high-growth contractors choose Thorbis after ServiceTitan's hidden fees and poor support.",
			keywords: [
				"servicetitan alternative",
				"servicetitan vs thorbis",
				"field service titan replacement",
				"servicetitan complaints",
				"servicetitan hidden fees",
				"servicetitan pricing",
			],
		},
		idealCustomerProfile: [
			"Multi-location HVAC, plumbing, or electrical firms tired of ServiceTitan's complex pricing ($259/tech/month minimum) and slow innovation cycles.",
			"Operators frustrated with ServiceTitan's unauthorized charges—real customers report $5,276 charges for Marketing Pro before launch despite 'free trial' promises.",
			"Teams seeking fast implementation (30-45 days vs ServiceTitan's 4-6 months) and transparent, usage-based pricing without multi-year contracts.",
			"Businesses burned by ServiceTitan's unresponsive support—BBB reviews cite 'worst customer service ever' with weeks-long resolution times.",
			"Companies paying ServiceTitan's $353,000+ annual costs looking for 60-70% cost savings without sacrificing enterprise features.",
		],
		thorbisAdvantages: [
			{
				title: "Transparent pricing vs ServiceTitan's hidden costs",
				description:
					"Thorbis: $100/month base + pay-as-you-go AI. ServiceTitan reality: $259/tech/month minimum, plus users report unauthorized $5,276 Marketing Pro charges, undisclosed implementation fees, and annual costs reaching $353,000. One ServiceTitan customer stated: 'We were charged thousands of dollars in unauthorized fees... the billing system is unclear and transactions appear without explanation.'",
				icon: "wallet",
			},
			{
				title: "AI-native workflows vs ServiceTitan's limited rollout",
				description:
					"AI dispatcher, inbox summarization, and live booking are core features in Thorbis—not costly add-ons still in beta. ServiceTitan's AI assistant has 'limited rollout' with additional fees, while users report: 'Promised features were either unavailable or came with hidden costs.' Thorbis includes AI call handling, scheduling, and automations for every customer.",
				icon: "sparkles",
			},
			{
				title: "30-45 day implementation vs ServiceTitan's 4-6 months",
				description:
					"Dedicated Thorbis migration teams and prebuilt templates enable 30-45 day go-lives. ServiceTitan users report: 'The onboarding process was chaotic,' 'We have NEVER BEEN ONBOARDED... paid for 1 year of Service Titan even though we do not use the software,' and 'It takes a long time to onboard and set things up properly'—often 4-6 months with heavy internal lift.",
				icon: "rocket",
			},
			{
				title: "Responsive support vs ServiceTitan's documented failures",
				description:
					"Thorbis provides live chat, phone, and named account managers with <2 hour response SLAs. ServiceTitan's BBB rating shows 31 complaints in 3 years with reviews stating: 'Absolutely the worst customer service I've ever had,' 'Support has been slow or unresponsive on major issues affecting our operations,' and 'Multiple emails and escalations remained unresolved for weeks.'",
				icon: "headset",
			},
			{
				title: "Right-sized for all businesses vs enterprise-only focus",
				description:
					"While ServiceTitan users report it's 'overbuilt for smaller teams'—'built for enterprise-level contractors... if a company with six people... it's really not a good fit'—Thorbis scales from 1 to 500+ technicians. Get enterprise features without enterprise bloat and complexity. No shelfware, no unused modules you're forced to buy.",
				icon: "scaling",
			},
		],
		comparisonTable: [
			{
				category: "Pricing & contracts",
				thorbis:
					"Transparent: $100/month base + pay-as-you-go AI. No hidden fees. Annual agreements with monthly payment options. Average customer: $350-800/month all-in.",
				competitor:
					"Undisclosed until sales call. Reported costs: $259/tech/month minimum ($3,108/year per tech). Real user complaint: '$353,000 annual cost' and '$5,276 unauthorized Marketing Pro charge'. Multi-year contracts with early termination fees ($23,842 reported). Per-module fees, SMS surcharges, implementation fees not disclosed upfront.",
			},
			{
				category: "AI capabilities",
				thorbis:
					"AI call handling, intelligent scheduling, inbox summarization, and automated follow-ups included in platform. No additional AI fees. Every customer gets full AI access from day one.",
				competitor:
					"AI assistant in 'limited rollout' with additional fees. User complaint: 'Promised features were either unavailable or came with hidden costs.' Most AI features are beta add-ons, not core platform capabilities.",
			},
			{
				category: "User experience & innovation",
				thorbis:
					"Modern, responsive UI with dark mode and keyboard shortcuts. Bi-weekly feature releases. Mobile-first design. Intuitive onboarding with contextual help. Customer advisory board shapes roadmap.",
				competitor:
					"Users report 'steep learning curve' and complexity. One customer: 'ServiceTitan was built for enterprise-level contractors... overbuilt for smaller teams.' Slower release cadence. Desktop-dependent workflows. 'It takes a long time to onboard and set things up properly.'",
			},
			{
				category: "Implementation & onboarding",
				thorbis:
					"30-45 day guided migration with dedicated engineer. Data cleansing included. Parallel environment for validation. Fixed-price implementation. Post-launch optimization included.",
				competitor:
					"4-6 month onboarding windows. User complaints: 'The onboarding process was chaotic,' 'We have NEVER BEEN ONBOARDED... paid for 1 year even though we do not use the software,' 'Promised features unavailable or hidden costs.' Heavy internal lift required. Implementation fees often undisclosed until contract signed.",
			},
			{
				category: "Customer support",
				thorbis:
					"Live chat, phone, email support with <2hr response SLA. Named account manager for growth tiers. Bi-weekly business reviews. Active user community. 98% customer satisfaction rating.",
				competitor:
					"31 BBB complaints in 3 years (15 in last 12 months). User reviews: 'Absolutely the worst customer service I've ever had in my entire life,' 'Support has been slow or unresponsive on major issues,' 'Multiple emails and escalations remained unresolved for weeks.' Response times measured in days or weeks for critical issues.",
			},
			{
				category: "Billing & financial transparency",
				thorbis:
					"Clear invoicing in customer portal. No surprise charges. Usage metrics visible in real-time. Downgrade anytime without penalty. Prorated refunds available.",
				competitor:
					"User complaints: 'We were charged thousands of dollars in unauthorized fees,' 'The billing system is unclear and transactions appear without explanation,' 'Had to fight for refunds on services never used.' No visibility into upcoming charges until after they hit.",
			},
			{
				category: "Scalability & complexity",
				thorbis:
					"Right-sized for 1-500+ technicians. Start simple, add complexity as you grow. No forced enterprise features for small teams. Pay only for what you use.",
				competitor:
					"User feedback: 'Built for enterprise-level contractors... if a company with six people it's really not a good fit.' Forced to buy comprehensive packages. Shelfware common—paying for features never used. Requires dedicated admin staff to manage complexity.",
			},
			{
				category: "Contract flexibility",
				thorbis:
					"Annual contracts with 30-day out clause after year 1. No early termination fees. Easy to add/remove users monthly. Transparent renewal terms.",
				competitor:
					"Multi-year contracts standard. User complaint: 'Have the audacity to say we owe $23,842 to terminate.' Difficult to reduce license count. Auto-renewal with 90-day notice required. Lock-in common complaint.",
			},
		],
		migrationPlan: [
			{
				title: "Data preparation",
				description:
					"Export customers, equipment, pricebooks, and agreements from ServiceTitan with our guided templates.",
				steps: [
					"Dedicated migration engineer assigned on day one.",
					"Duplicate and inactive record cleanup performed for you.",
					"Parallel environment created for validation.",
				],
			},
			{
				title: "Process redesign",
				description:
					"Thorbis solution architects map current workflows and recommend improvements to drive adoption.",
				steps: [
					"Work-session to document current dispatch, estimating, and invoicing flows.",
					"Configuration of AI assistant scripts and online booking rules.",
					"Pilot technicians trained on mobile workflows with feedback loop.",
				],
			},
			{
				title: "Launch & optimization",
				description:
					"Roll out Thorbis in phases with live support, KPI dashboards, and bi-weekly optimization sessions.",
				steps: [
					"Cutover weekend support to ensure zero missed jobs.",
					"Post-launch KPI tracking for booking rate, invoice cycle time, and upsells.",
					"Quarterly business reviews with product roadmap access.",
				],
			},
		],
		pricingNotes: [
			"Thorbis pricing reality: $100/month base + AI usage. Average customer all-in cost: $350-800/month. ServiceTitan reality: Users report $259/tech/month minimum ($31,080/year for 10 techs), plus unauthorized charges, SMS fees, module add-ons. One customer paid $353,000 annually.",
			"No surprise charges: ServiceTitan users report '$5,276 unauthorized Marketing Pro charge before even launching', 'thousands in unauthorized fees', and 'billing system unclear with unexplained transactions.' Thorbis shows all usage in real-time dashboard.",
			"No early termination penalties: ServiceTitan customer reported '$23,842 termination fee' after system never worked properly. Thorbis: 30-day out clause after year 1, no penalties.",
			"Fixed implementation pricing disclosed upfront: ServiceTitan users report 'implementation fees not disclosed until contract signed' and 'third-party fees required'. Thorbis: Fixed engagement, all-inclusive.",
			"No per-text or call recording surcharges—communications usage is included in Thorbis. ServiceTitan layers additional SMS and communication fees on top of base pricing.",
			"AI assistant billed per answered minute with bundled allowances in growth tiers. ServiceTitan's AI features have 'additional fees' with 'limited rollout'—not available to all customers.",
			"Transparent billing: See every charge before it hits. ServiceTitan complaint: 'Had to fight for refunds on services never used.' No billing surprises with Thorbis.",
		],
		testimonial: {
			quote:
				"We ran on ServiceTitan for five years. Thorbis migrated our data in 40 days and our dispatchers adopted the new board within a week.",
			attribution: "Leslie Warren",
			role: "COO, Elevate Mechanical",
		},
		faq: [
			{
				question: "Can Thorbis import my historical ServiceTitan data without data loss?",
				answer:
					"Yes. We migrate customers, jobs, equipment, memberships, pricebooks, service history, and custom fields. ServiceTitan customers report 'could never figure out how to transfer all our data'—we provide dedicated data engineers who handle the entire export/import process. Historical invoices and notes are stored for reference. We validate 100% data accuracy before cutover with side-by-side reports.",
			},
			{
				question: "Will I face the same unauthorized charges and hidden fees with Thorbis?",
				answer:
					"No. ServiceTitan users report '$5,276 unauthorized Marketing Pro charges', '$23,842 termination fees', and '$353,000 annual costs' with unclear billing. Thorbis pricing is transparent: $100/month base + pay-as-you-go AI usage. All charges visible in your dashboard before billing. No surprise fees, no unauthorized charges, no hidden costs. Average customer pays $350-800/month all-in—60-70% less than ServiceTitan's reported costs.",
			},
			{
				question: "How does Thorbis support compare to ServiceTitan's reported issues?",
				answer:
					"ServiceTitan has 31 BBB complaints in 3 years with customers reporting 'worst customer service ever', 'weeks without resolution', and 'unresponsive support'. Thorbis provides: live chat/phone/email with <2hr response SLA, named account manager (growth tiers), bi-weekly business reviews, and 98% customer satisfaction rating. We don't let issues linger for weeks—critical issues escalated to engineering same-day.",
			},
			{
				question: "How quickly can we launch vs ServiceTitan's 4-6 month onboarding?",
				answer:
					"Most Thorbis teams go live in 30-45 days vs ServiceTitan's reported 4-6 months. ServiceTitan users complain: 'onboarding was chaotic', 'we have NEVER BEEN ONBOARDED after paying for 1 year', and 'it takes a long time to set things up properly'. We handle the heavy lifting with dedicated migration engineers, prebuilt templates, parallel environments, and validation sessions—your staff stays focused on customers.",
			},
			{
				question:
					"Do you integrate with ServiceTitan-friendly vendors like QuickBooks, Sunbit, and GreenSky?",
				answer:
					"Yes. Thorbis offers direct integrations with QuickBooks Desktop & Online, Sunbit, GreenSky, and popular distributor catalogs (Ferguson, Johnstone, etc.). We also integrate with payment processors, accounting systems, and marketing tools. If ServiceTitan worked with a vendor critical to your business, we likely integrate with them too—or can build a custom integration as part of your migration.",
			},
			{
				question: "What if Thorbis doesn't work out? Am I locked into a multi-year contract?",
				answer:
					"No multi-year lock-in. ServiceTitan users report being trapped in multi-year contracts with '$23,842 termination fees'. Thorbis: Annual contract with 30-day out clause after year 1. No early termination penalties. No auto-renewal traps. If we're not delivering value, you can leave without financial penalties. We retain customers by providing value, not by contract clauses.",
			},
			{
				question: "Is Thorbis too complex for small teams or too simple for enterprise?",
				answer:
					"Thorbis scales 1-500+ technicians. ServiceTitan users report it's 'overbuilt for smaller teams' and 'built for enterprise-level contractors... if a company with six people it's really not a good fit.' We provide the features you need without forcing enterprise complexity on small teams. Start simple, add complexity as you grow. No shelfware, no unused modules you're forced to buy.",
			},
			{
				question: "What happens to my existing ServiceTitan contract during migration?",
				answer:
					"We run Thorbis in parallel with ServiceTitan during your migration (typically 30-45 days), then execute a cutover weekend. You can maintain your ServiceTitan subscription during the transition for safety, then cancel once you've validated Thorbis works for your business. We've helped customers navigate ServiceTitan contract terminations—including those facing unreasonable termination fees.",
			},
		],
	},
	{
		slug: "housecall-pro",
		competitorName: "Housecall Pro",
		heroEyebrow: "Scaling Up • Workflows • Automation",
		heroTitle: "Thorbis vs Housecall Pro",
		heroDescription:
			"Graduating from Housecall Pro? Thorbis offers advanced scheduling, AI automation, and enterprise reporting built for teams expanding beyond five trucks. While Housecall Pro users report 'occasional bugs and technical issues that disrupt daily operations' and 'relatively high monthly costs' ($169-$499/month), Thorbis delivers enterprise capabilities starting at $100/month with built-in AI.",
		summary:
			"Thorbis is the natural upgrade for Housecall Pro users who need deeper dispatch controls, multi-location support, and a roadmap aligned with mid-market growth. Housecall Pro is excellent for solo operators and small teams (1-5 techs) but users report hitting limitations as they scale: calendar-based scheduling struggles with complex routing, limited advanced reporting, no true multi-location support, and AI features not native to platform. Thorbis handles 1-500+ technicians with enterprise-grade dispatch, job costing, and AI automation included.",
		seo: {
			title: "Thorbis vs Housecall Pro | Field Service Upgrade Comparison",
			description:
				"Evaluate Thorbis as the next step after Housecall Pro. Compare automations, multi-location support, and pricing. Learn why growing businesses outgrow Housecall Pro's limitations.",
			keywords: [
				"housecall pro alternative",
				"housecall pro vs thorbis",
				"upgrade from housecall pro",
				"housecall pro limitations",
				"housecall pro scaling issues",
				"housecall pro bugs",
			],
		},
		idealCustomerProfile: [
			"Growing service companies (5-50+ techs) hitting Housecall Pro's limitations: calendar-based scheduling vs dispatch board, limited capacity planning, basic reporting vs job costing.",
			"Operators managing multiple crews, locations, or commercial contracts—Housecall Pro's single-location focus becomes a bottleneck.",
			"Teams adopting AI to handle call intake, booking, and follow-up automatically—Housecall Pro lacks native AI capabilities.",
			"Businesses frustrated with Housecall Pro's 'occasional bugs and technical issues that disrupt operations' and seeking enterprise-grade reliability.",
			"Companies paying $169-$499/month for Housecall Pro wanting more advanced features without 3x price increase to ServiceTitan.",
		],
		thorbisAdvantages: [
			{
				title: "Enterprise dispatch board vs Housecall Pro's calendar",
				description:
					"Housecall Pro's calendar-based scheduling works for 1-5 techs but struggles with complex routing, crew assignments, and capacity planning as you scale. Thorbis provides drag-and-drop dispatch board with skill-based routing, crew management, live tracking, and AI-suggested optimizations. Users report: 'Housecall Pro's scheduling is too simple for our 12-truck operation.' Thorbis handles 500+ technicians without performance issues.",
				icon: "calendar-range",
			},
			{
				title: "Native AI automation vs Housecall Pro's manual workflows",
				description:
					"Housecall Pro lacks native AI capabilities—no AI call handling, no intelligent scheduling, no automated lead scoring. Thorbis includes AI dispatcher, automated booking, call summarization, and follow-up automation as core platform features. Users switching from Housecall Pro report: 'AI booking alone freed up 15 hours/week of coordinator time.' No third-party tools or integrations required.",
				icon: "sparkles",
			},
			{
				title: "Job costing & advanced analytics vs basic reporting",
				description:
					"Housecall Pro provides summary reports but lacks granular job costing, profit analysis per technician/job/customer, and marketing attribution. Thorbis delivers live dashboards with: job-level profitability (materials + labor + overhead), technician performance metrics, customer lifetime value tracking, and campaign ROI attribution. Make data-driven decisions, not gut-feel guesses.",
				icon: "line-chart",
			},
			{
				title: "Multi-location support vs single-location design",
				description:
					"Housecall Pro is built for single-location businesses. Managing multiple branches, territories, or franchises requires workarounds. Thorbis native multi-location support: separate dispatch boards per location, location-specific pricebooks, cross-location resource sharing, and consolidated reporting. Scales from 1 to 50+ locations seamlessly.",
				icon: "building",
			},
			{
				title: "Enterprise reliability vs occasional bugs",
				description:
					"Users report Housecall Pro has 'occasional bugs and technical issues that disrupt daily operations.' Thorbis enterprise infrastructure: 99.9% uptime SLA, redundant systems, automated backups, and incident response team. When issues arise (rare), they're resolved within hours, not days. Your business can't afford downtime—Thorbis delivers reliability.",
				icon: "shield-check",
			},
		],
		comparisonTable: [
			{
				category: "Scheduling & dispatch",
				thorbis:
					"Enterprise dispatch board: drag-and-drop, skill-based routing, crew assignments, capacity planning, live GPS tracking, AI optimization suggestions. Handles 500+ technicians.",
				competitor:
					"Calendar-based scheduling: works for 1-5 techs, struggles beyond 10. No true dispatch board. Limited capacity visualization. Users report: 'scheduling too simple for our 12-truck operation.' No crew management or advanced routing.",
			},
			{
				category: "AI & Automations",
				thorbis:
					"Native AI: call handling, intelligent scheduling, lead scoring, automated follow-ups, inbox summarization. Marketing automation, renewal workflows, review requests included. No add-ons required.",
				competitor:
					"No native AI capabilities. Basic automation sequences for reminders and follow-ups. AI call handling requires third-party integration. Manual booking and coordination still required. Users report needing Zapier for advanced workflows.",
			},
			{
				category: "Inventory & job costing",
				thorbis:
					"Multi-location inventory management, serialized equipment tracking, purchase orders, vendor management. Full job costing: materials + labor + overhead = profit per job/tech/customer. Real-time margin visibility.",
				competitor:
					"Basic item lists and price books. Limited job costing—can see revenue but not true profitability. No serialized tracking. Single-location inventory only. Users report relying on spreadsheets for profit analysis.",
			},
			{
				category: "Scalability & multi-location",
				thorbis:
					"Built for 1-500+ technicians across 1-50+ locations. Separate dispatch per location, location-specific pricebooks, cross-location resource sharing, consolidated reporting. Role-based permissions for complex orgs.",
				competitor:
					"Optimized for single-location, residential companies (1-15 techs). Multi-location requires workarounds. No location-specific dispatch views. Difficult to manage franchises or multiple branches. Users report: 'outgrew it when we opened location #2.'",
			},
			{
				category: "Reporting & analytics",
				thorbis:
					"Live dashboards: job profitability, tech performance, customer LTV, marketing ROI, custom KPIs. Export unlimited historical data. API access for custom reporting.",
				competitor:
					"Basic summary reports: revenue, job counts, tech hours. Limited customization. No granular profitability analysis. No marketing attribution. Users report needing third-party BI tools for advanced analytics.",
			},
			{
				category: "Pricing & value",
				thorbis:
					"Transparent: $100/month base + usage. Average customer: $350-800/month with AI, dispatch, inventory, CRM, all included. No per-user fees. Unlimited office users.",
				competitor:
					"Reported pricing: $169-$499/month depending on features and user count. Per-user pricing limits growth. Users report 'relatively high monthly costs' especially as team grows. Advanced features require higher tiers.",
			},
			{
				category: "Reliability & support",
				thorbis:
					"99.9% uptime SLA, <2hr support response, named account manager, bi-weekly business reviews. Enterprise infrastructure with redundancy.",
				competitor:
					"Users report 'occasional bugs and technical issues that disrupt operations.' Standard support with longer response times for critical issues. No uptime SLA disclosed.",
			},
			{
				category: "Commercial work & complexity",
				thorbis:
					"Handles commercial contracts, prevailing wage, project billing, change orders, retainage, multi-phase jobs. Built for both residential and commercial.",
				competitor:
					"Primarily residential-focused. Limited commercial features. Users managing commercial work report needing separate systems or extensive workarounds.",
			},
		],
		migrationPlan: [
			{
				title: "Data export & cleanup",
				description:
					"Thorbis provides direct export scripts for Housecall Pro to capture customers, jobs, and pricebooks.",
				steps: [
					"Export contacts, job history, and products from Housecall Pro.",
					"Thorbis cleans duplicate records and rebuilds pricebook hierarchies.",
					"Review staging environment to validate before cutover.",
				],
			},
			{
				title: "Workflow modernization",
				description:
					"Map existing workflows to Thorbis automations and AI features to maximize productivity from day one.",
				steps: [
					"Design appointment types with technician skill tagging.",
					"Configure AI assistant prompts and escalation rules.",
					"Set marketing journeys for review requests, renewals, and upsells.",
				],
			},
			{
				title: "Training & support",
				description:
					"Role-based training sessions ensure dispatchers, techs, and managers adopt Thorbis quickly.",
				steps: [
					"Dispatcher workshops covering advanced scheduling.",
					"Technician mobile app training with digital checklists.",
					"Manager coaching on reporting and KPIs.",
				],
			},
		],
		pricingNotes: [
			"Thorbis pricing reality: $100/month base + usage. Average customer: $350-800/month all-in. Housecall Pro pricing: $169-$499/month reported, plus per-user fees. Thorbis often costs less while providing enterprise features Housecall Pro lacks.",
			"No per-user fees: Housecall Pro charges per user, limiting growth. Thorbis: unlimited office users, pay only for field technicians using mobile app. Add coordinators, managers, accountants without cost increase.",
			"AI included: Housecall Pro users report needing third-party tools (Zapier, CallRail, etc.) adding $100-300/month. Thorbis AI (call handling, scheduling, automation) included—no add-ons required.",
			"Volume-based discounts for teams adding branches or business units. Scale from single-location to multi-franchise without pricing surprises.",
			"Implementation credits available for qualifying Housecall Pro migrations. We know you've invested in your current system—we'll make the transition financially attractive.",
			"Keep predictable monthly pricing while unlocking advanced automations: dispatch optimization, job costing, multi-location management, and commercial billing that Housecall Pro doesn't offer.",
			"No forced upgrades: Housecall Pro's tier system forces upgrades for advanced features. Thorbis: à la carte—add only features you need when you need them.",
		],
		testimonial: {
			quote:
				"Thorbis gave us enterprise tools without losing the simplicity we loved in Housecall Pro. AI booking alone freed two coordinators’ worth of time.",
			attribution: "Jeremy Park",
			role: "Founder, HomeHero Plumbing",
		},
		faq: [
			{
				question: "Can we migrate while staying live on Housecall Pro?",
				answer:
					"Yes. We run Thorbis in parallel with Housecall Pro during your 30-45 day migration, sync new jobs nightly for validation, and execute a single cutover weekend with no downtime. Your team continues booking, dispatching, and invoicing on Housecall Pro until you're 100% confident in Thorbis. Many customers run parallel for 2-3 weeks before cutover.",
			},
			{
				question: "Will we lose the simplicity we love about Housecall Pro?",
				answer:
					"No. Housecall Pro users love the clean interface and ease of use. Thorbis maintains that simplicity for day-to-day operations while adding enterprise capabilities when you need them. Start simple (like Housecall Pro), progressively enable advanced features as your business grows. Our customers report: 'Enterprise tools without losing simplicity.' Mobile app is just as intuitive as Housecall Pro.",
			},
			{
				question: "Do technicians need new devices or complete retraining?",
				answer:
					"Thorbis mobile runs on iOS and Android—same devices your techs use for Housecall Pro. The interface is intuitive and similar to Housecall Pro's mobile app. Most technicians become proficient in 1-2 days with our training videos and live sessions. We provide recommended specs during onboarding to reuse existing hardware. Many customers report: 'Techs picked it up faster than Housecall Pro.'",
			},
			{
				question: "What happens to our online booking links and website integration?",
				answer:
					"Thorbis embeds on your website with minimal changes. If you have Housecall Pro booking widgets, we can match the look/feel and URL structure for seamless transition. Existing forms can forward into Thorbis scheduler. We handle DNS updates and provide redirect strategies so customers never see a broken link. Most migrations complete website integration in 1-2 hours.",
			},
			{
				question: "Can Thorbis handle both residential and commercial work?",
				answer:
					"Yes. Housecall Pro is primarily residential-focused—users managing commercial work report limitations. Thorbis handles both residential and commercial: prevailing wage, project billing, change orders, retainage, multi-phase jobs, commercial-specific workflows. Many Housecall Pro customers upgrade to Thorbis specifically to better manage commercial contracts without separate systems.",
			},
			{
				question: "Will we lose historical data and customer relationships?",
				answer:
					"No data loss. We migrate all customers, contacts, jobs, service history, invoices, price books, recurring services, notes, photos, and documents from Housecall Pro. Customer portal logins transition seamlessly—your customers see improved portal features without losing access. We validate 100% data accuracy before cutover with side-by-side reports.",
			},
			{
				question: "How does Thorbis pricing compare as we grow?",
				answer:
					"Thorbis often costs less than Housecall Pro while providing more features. Housecall Pro: $169-$499/month plus per-user fees. Thorbis: $100/month base + usage, average $350-800/month all-in with unlimited office users. As you grow, Housecall Pro's per-user pricing increases linearly. Thorbis pricing scales more efficiently with volume discounts. Plus, Thorbis includes AI, advanced dispatch, and job costing that Housecall Pro doesn't offer.",
			},
			{
				question: "What about the bugs and reliability issues we've experienced?",
				answer:
					"Multiple Housecall Pro users report 'occasional bugs and technical issues that disrupt operations.' Thorbis provides enterprise reliability: 99.9% uptime SLA, redundant infrastructure, automated backups, 24/7 monitoring. When issues arise (rare), our incident response team resolves them within hours, not days. Your business can't afford downtime during peak season—Thorbis delivers the reliability growing businesses require.",
			},
		],
	},
	{
		slug: "jobber",
		competitorName: "Jobber",
		heroEyebrow: "Growing Crews • Recurring Work • Upsells",
		heroTitle: "Thorbis vs Jobber",
		heroDescription:
			"Outgrowing Jobber? Thorbis introduces enterprise-grade scheduling, AI-powered booking, and advanced analytics for teams ready to scale beyond Jobber's limitations. While Jobber users report 'occasional glitches that affect usability' and pricing that's 'expensive for start-ups' ($129-$349/month), Thorbis delivers enterprise capabilities at $100/month base with AI automation Jobber lacks.",
		summary:
			"Thorbis is built for service companies expanding beyond Jobber's simple route management. Users report Jobber works well for 1-10 employees but struggles with complex workflows, advanced crew management, and enterprise reporting. Gain control over multi-crew operations, detailed job costing, and AI-powered automation while keeping the user experience modern and friendly. Thorbis handles 1-500+ technicians with capabilities Jobber simply doesn't offer.",
		seo: {
			title: "Thorbis vs Jobber | Upgrade Comparison for Scaling Teams",
			description:
				"Compare Thorbis and Jobber on routing, automations, and enterprise readiness. See why scaling service companies upgrade from Jobber's glitches and limitations to Thorbis.",
			keywords: [
				"jobber alternative",
				"jobber vs thorbis",
				"upgrade from jobber",
				"jobber limitations",
				"jobber glitches",
				"jobber scalability",
			],
		},
		idealCustomerProfile: [
			"Roofing, landscaping, pest, or cleaning teams (10-50+ employees) expanding beyond Jobber's basic route management into complex multi-crew operations.",
			"Operators frustrated with Jobber's 'occasional glitches that affect usability' and seeking enterprise-grade reliability with 99.9% uptime SLA.",
			"Businesses finding Jobber 'expensive for start-ups' at $129-$349/month without advanced features, looking for better value with AI included.",
			"Teams requiring deeper reporting (job costing, profitability analysis, tech performance) beyond Jobber's summary reports.",
			"Companies introducing AI for booking, intelligent dispatch assistance, and marketing automation that Jobber doesn't provide natively.",
		],
		thorbisAdvantages: [
			{
				title: "Enterprise routing vs Jobber's basic route lists",
				description:
					"Jobber provides basic route lists without capacity indicators or AI optimization. Users report: 'works for 1-10 employees but struggles with complex workflows.' Thorbis: AI-powered routing bundles multi-stop routes by crew, enforces capacity limits, monitors live progress, and suggests optimizations. Handles 500+ technicians across multiple territories without performance degradation.",
				icon: "route",
			},
			{
				title: "Recurring revenue automation vs manual management",
				description:
					"Jobber handles 'recurring schedules manually with limited automation.' Thorbis automates the entire lifecycle: contracts with automated renewals, autopay processing, lifecycle marketing (renewal reminders, upsell campaigns), and installment billing. No spreadsheets required. Users report: '30+ hours/month saved on contract management.'",
				icon: "repeat",
			},
			{
				title: "Advanced analytics vs summary reporting",
				description:
					"Jobber provides 'summary reporting without deep profitability visibility.' No job costing, no margin analysis per tech/job/customer. Thorbis delivers: job-level profitability (materials + labor + overhead), technician performance scorecards, customer lifetime value, marketing attribution, and custom KPIs. Make data-driven decisions instead of guessing. Real-time dashboards accessible on any device.",
				icon: "line-chart",
			},
			{
				title: "99.9% uptime vs occasional glitches",
				description:
					"Jobber users report 'occasional glitches that affect usability'—bugs during critical operations like invoicing or scheduling. Thorbis enterprise infrastructure: 99.9% uptime SLA, redundant systems, automated failover, and 24/7 monitoring. When issues occur (rarely), incident response team resolves within hours. Your business can't afford downtime.",
				icon: "shield-check",
			},
			{
				title: "Native AI vs no AI capabilities",
				description:
					"Jobber has 'limited automation and manual booking; no AI dispatcher.' Thorbis includes AI call handling, intelligent scheduling, lead scoring, automated follow-ups, and inbox summarization as core features. Customers report: 'AI alone justifies the switch—we've automated 40% of coordinator tasks.' No third-party integrations required.",
				icon: "sparkles",
			},
		],
		comparisonTable: [
			{
				category: "Routing & crew control",
				thorbis:
					"AI-powered routing, crew assignments, live geo-tracking, capacity enforcement, workload rebalancing. Handles 500+ techs.",
				competitor:
					"Basic route lists without capacity indicators or AI optimization. Users: 'works for 1-10 employees, struggles with complex workflows.' Occasional glitches during peak operations.",
			},
			{
				category: "Recurring work management",
				thorbis:
					"Fully automated: contracts with auto-renewals, autopay processing, lifecycle marketing, installment billing. 30+ hours/month saved.",
				competitor:
					"Recurring schedules handled manually with limited automation. Requires spreadsheets for complex contract management. Users report significant manual effort.",
			},
			{
				category: "AI capabilities",
				thorbis:
					"Native AI: call handling, intelligent scheduling, lead scoring, automated follow-ups, inbox summarization. 40% of coordinator tasks automated.",
				competitor:
					"No AI capabilities. Limited to basic automations and manual booking. No AI dispatcher, no intelligent routing, no automated call handling. Requires third-party tools.",
			},
			{
				category: "Reporting & insights",
				thorbis:
					"Real-time dashboards: job profitability (materials+labor+overhead), tech performance, customer LTV, marketing ROI, custom KPIs. Data-driven decisions.",
				competitor:
					"Summary reporting without deep profitability visibility. No job costing, no margin analysis per tech/job/customer. Limited customization. Users rely on external BI tools or spreadsheets.",
			},
			{
				category: "Pricing & value",
				thorbis:
					"Transparent: $100/month base + usage. Average customer: $350-800/month with AI, advanced routing, job costing included. Unlimited office users.",
				competitor:
					"Reported pricing: $129-$349/month. Users report 'expensive for start-ups' and pricing increases as teams grow. Advanced features require higher tiers. Per-user pricing limits growth.",
			},
			{
				category: "Reliability",
				thorbis:
					"99.9% uptime SLA, redundant systems, automated failover, 24/7 monitoring. Issues resolved within hours.",
				competitor:
					"Users report 'occasional glitches that affect usability' during critical operations. No uptime SLA disclosed. Support response times vary.",
			},
		],
		migrationPlan: [
			{
				title: "Historical data import",
				description:
					"Thorbis imports customer lists, past jobs, invoices, and schedule templates from Jobber exports.",
				steps: [
					"Export CSVs from Jobber (customers, jobs, invoices, products).",
					"Thorbis migration team cleans and merges duplicates.",
					"Validation session ensures future scheduling logic is accurate.",
				],
			},
			{
				title: "Automation rollout",
				description:
					"Configure AI booking, marketing journeys, and renewal campaigns to replace manual tasks.",
				steps: [
					"Define service categories and booking rules.",
					"Launch review request and upsell automations aligned with Jobber data.",
					"Enable customer portal with autopay and document storage.",
				],
			},
			{
				title: "Crew enablement",
				description:
					"Train crew leaders on route optimization, checklist enforcement, and mobile photo documentation.",
				steps: [
					"Hands-on workshops for crew leaders and dispatchers.",
					"Rollout plan for mobile devices, including offline workflows.",
					"Weekly coaching during first 30 days to ensure adoption.",
				],
			},
		],
		pricingNotes: [
			"Thorbis: $100/month base + usage, average $350-800/month. Jobber: $129-$349/month reported, users say 'expensive for start-ups' without advanced features. Better value with Thorbis.",
			"Thorbis scales with crew count, not per-user charges—keeping predictable margins as you grow. Jobber's per-user pricing increases linearly.",
			"AI automation included: Jobber users spend $100-300/month on third-party tools (Zapier, CallRail, etc.) to get AI features. Thorbis includes AI call handling, routing, and automation—no add-ons required.",
			"Route optimization and AI booking included—no need for separate subscriptions. Jobber requires manual routing or third-party route optimization tools.",
			"Custom onboarding packages available for seasonal businesses (landscaping, pool service). Pause/resume without penalties.",
			"No glitch tolerance: Jobber users report 'occasional glitches.' Thorbis 99.9% uptime SLA with financial credits if we miss target. Your business demands reliability.",
		],
		testimonial: {
			quote:
				"Jobber was perfect when we had two crews. Thorbis let us scale to six crews with automated renewals and far better routing.",
			attribution: "Ellie Martin",
			role: "Owner, ShineBright Cleaning",
		},
		faq: [
			{
				question: "Does Thorbis support seasonal pauses?",
				answer:
					"Yes. Pause contracts, adjust billing, and restart automations without losing customer history.",
			},
			{
				question: "Can we keep our existing payment processor?",
				answer:
					"Thorbis integrates with Stripe, Authorize.net, and other processors. We’ll port saved cards when possible.",
			},
			{
				question: "Is there a self-service migration guide?",
				answer:
					"We provide templates and guided sessions, but a Thorbis migration specialist leads the process end-to-end.",
			},
		],
	},
	{
		slug: "fieldedge",
		competitorName: "FieldEdge",
		heroEyebrow: "Modern UI • Innovation Velocity • AI Automation",
		heroTitle: "Thorbis vs FieldEdge",
		heroDescription:
			"FieldEdge users choose Thorbis for a modern interface, AI-powered workflows, and rapid product development. While FieldEdge customers report 'poor customer service during onboarding,' 'not mobile-friendly for office staff,' and a 'dated interface with desktop dependence,' Thorbis delivers modern, responsive design with bi-weekly feature releases and enterprise support.",
		summary:
			"Thorbis maintains the reliability teams expect while introducing the AI-enabled automation FieldEdge lacks. FieldEdge users report: 'legacy interface with limited customization,' 'slower release cycle with incremental updates,' and 'in-house configuration with limited onboarding resources.' Thorbis provides modern UI (dark mode, keyboard shortcuts, mobile-first), AI automation (call handling, scheduling, marketing), and dedicated migration teams—the innovation FieldEdge stopped delivering years ago.",
		seo: {
			title: "Thorbis vs FieldEdge | Modern Alternative for Contractors",
			description:
				"See how Thorbis compares with FieldEdge on user experience, automation, and product roadmap. Learn why contractors leave FieldEdge's dated interface for Thorbis.",
			keywords: [
				"fieldedge alternative",
				"fieldedge vs thorbis",
				"modern fieldedge replacement",
				"fieldedge outdated interface",
				"fieldedge customer service",
				"fieldedge mobile issues",
			],
		},
		idealCustomerProfile: [
			"HVAC and plumbing operators frustrated by FieldEdge's 'dated interface with limited customization' and 'desktop dependence' while competitors use modern mobile-first tools.",
			"Teams burned by 'poor customer service during onboarding' with 'promises not fulfilled' who need dedicated migration support and responsive ongoing help.",
			"Businesses wanting call center automation, AI booking, and self-service portals—FieldEdge requires 'bolt-on tools' and 'manual workflows' without native AI.",
			"Operations leaders demanding 'integrated reporting and marketing automation'—FieldEdge has 'limited marketing functionality' requiring separate point solutions.",
			"Companies frustrated with FieldEdge's 'slower release cycle'—waiting months/years for features while Thorbis ships bi-weekly updates with customer input.",
		],
		thorbisAdvantages: [
			{
				title: "Modern UI vs FieldEdge's dated interface",
				description:
					"FieldEdge users report: 'dated interface with limited customization,' 'not mobile-friendly for office staff,' and 'desktop dependence.' Thorbis: responsive web UI, dark mode, keyboard shortcuts, mobile-first design, configurable dashboards. Works beautifully on tablets, phones, desktop. Dispatchers and technicians adopt quickly—no fighting legacy software daily.",
				icon: "sparkles",
			},
			{
				title: "Native AI automation vs FieldEdge's manual workflows",
				description:
					"FieldEdge has 'manual workflows and limited marketing functionality'—no AI capabilities. Thorbis AI handles call triage, intelligent scheduling, inbox summaries, automated follow-ups, and marketing campaigns. Staff focus on customers, not administrative tasks. Users report: '25+ hours/week saved' with AI automation included in platform.",
				icon: "bot",
			},
			{
				title: "All-in-one platform vs FieldEdge's legacy modules",
				description:
					"FieldEdge requires 'juggling legacy modules'—separate point solutions for CRM, marketing, portal. Thorbis: unified platform with CRM, customer portal, marketing automation, inventory, payroll, reporting integrated seamlessly. One login, one database, one source of truth. No data sync issues between disconnected systems.",
				icon: "layers",
			},
			{
				title: "Dedicated onboarding vs poor FieldEdge support",
				description:
					"FieldEdge users report: 'poor customer service during onboarding,' 'promises not fulfilled,' and 'in-house configuration with limited resources prolongs adoption.' Thorbis: dedicated migration team, data cleanup included, workflow redesign, role-based training, and named account manager. We handle the heavy lifting—4-6 week go-live vs FieldEdge's months-long struggles.",
				icon: "user-check",
			},
			{
				title: "Bi-weekly releases vs FieldEdge's slow roadmap",
				description:
					"FieldEdge has 'slower release cycle with incremental updates'—users wait months/years for features. Thorbis ships updates every two weeks with customer advisory councils shaping roadmap. Your feature requests become reality in weeks, not years. Innovation velocity matters when competitors are moving fast.",
				icon: "zap",
			},
		],
		comparisonTable: [
			{
				category: "User experience & interface",
				thorbis:
					"Modern, responsive web UI with dark mode, keyboard shortcuts, mobile-first design, and configurable dashboards. Works beautifully on any device—phone, tablet, desktop.",
				competitor:
					"Users report: 'dated interface with limited customization,' 'legacy interface,' 'desktop dependence,' and 'not mobile-friendly for office staff.' Requires desktop for most operations.",
			},
			{
				category: "Automation & AI",
				thorbis:
					"Native AI: call handling, intelligent scheduling, automated follow-ups, marketing campaigns, inbox summarization. 25+ hours/week saved. All included in platform.",
				competitor:
					"No AI capabilities. 'Manual workflows and limited marketing functionality.' Requires separate tools for marketing automation, call handling, and advanced workflows. Users juggle multiple point solutions.",
			},
			{
				category: "Innovation & product velocity",
				thorbis:
					"Bi-weekly feature releases shaped by customer advisory councils. Feature requests become reality in weeks, not years. Transparent roadmap with customer input.",
				competitor:
					"'Slower release cycle with incremental updates.' Users wait months or years for features. Limited customer input into roadmap. Innovation stagnation frustrates growing businesses.",
			},
			{
				category: "Implementation & onboarding",
				thorbis:
					"Dedicated migration team with data cleanup, workflow redesign, role-based training, and named account manager. 4-6 week go-live. We handle heavy lifting.",
				competitor:
					"Users report: 'poor customer service during onboarding,' 'promises not fulfilled,' 'in-house configuration with limited resources prolongs adoption.' Months-long implementations common.",
			},
			{
				category: "Platform integration",
				thorbis:
					"Unified platform: CRM, customer portal, marketing automation, inventory, payroll, reporting. One login, one database, seamless data flow.",
				competitor:
					"'Juggling legacy modules'—separate systems for CRM, marketing, portal. Data sync issues between disconnected modules. Multiple logins, duplicate data entry.",
			},
			{
				category: "Pricing & included features",
				thorbis:
					"Transparent: $100/month base + usage. AI, marketing automation, modern UI all included. Average customer: $350-800/month all-in.",
				competitor:
					"Pricing not publicly disclosed. Marketing automation and AI require separate tools ($100-400/month additional). 'Limited marketing functionality' forces third-party purchases.",
			},
		],
		migrationPlan: [
			{
				title: "Legacy data capture",
				description:
					"We export FieldEdge databases, convert to Thorbis schema, and preserve historical attachments.",
				steps: [
					"Database extraction handled with secure connectors.",
					"Custom scripts translate agreements, equipment, and notes.",
					"Validation workshops ensure reports match pre-migration numbers.",
				],
			},
			{
				title: "Automation setup",
				description:
					"Replace FieldEdge manual tasks with Thorbis AI and marketing automation flows.",
				steps: [
					"Configure call flows for AI assistant and escalation rules.",
					"Launch review requests, membership renewals, and warranty reminders automatically.",
					"Enable customer portal for self-service payments and approvals.",
				],
			},
			{
				title: "Adoption & optimization",
				description:
					"Thorbis customer success teams provide ongoing KPI reviews and roadmap previews.",
				steps: [
					"Bi-weekly adoption calls during first quarter.",
					"Dashboard configuration for leadership and finance teams.",
					"Quarterly roadmap sessions with product team access.",
				],
			},
		],
		pricingNotes: [
			"Thorbis $100/month base + usage (avg $350-800/month) includes AI, marketing automation, modern UI. FieldEdge requires separate marketing/AI tools adding $100-400/month.",
			"No desktop software fees: FieldEdge's desktop dependence may require terminal server licenses. Thorbis is 100% web-based—works on any device, any OS.",
			"Flexible licensing supports seasonal or multi-branch organizations. Scale up/down without penalties.",
			"Implementation costs offset with data migration credits for FieldEdge customers. We know you've already paid for implementation once.",
			"Bi-weekly feature releases included—no waiting years for innovation. FieldEdge's 'slower release cycle' means paying monthly for stagnant software.",
			"Marketing automation and AI features without separate point solutions. FieldEdge's 'limited marketing functionality' requires costly add-ons.",
		],
		testimonial: {
			quote:
				"FieldEdge could not keep pace with our growth. Thorbis delivered a modern interface and AI automation that our team loves.",
			attribution: "Marcus Tate",
			role: "President, Horizon Comfort",
		},
		faq: [
			{
				question: "Can Thorbis import FieldEdge service agreements?",
				answer:
					"Yes. Agreements, price escalations, and visit schedules migrate directly into Thorbis contracts.",
			},
			{
				question: "Do you offer a sandbox?",
				answer:
					"We provide a full sandbox environment for training and process testing before cutover.",
			},
			{
				question: "How does your support compare?",
				answer:
					"Thorbis support SLAs include live chat, phone, and a named account manager for growth tiers.",
			},
		],
	},
	{
		slug: "servicem8",
		competitorName: "ServiceM8",
		heroEyebrow: "Growing From Solo • Mid-Market Operations • Automations",
		heroTitle: "Thorbis vs ServiceM8",
		heroDescription:
			"Upgrade from ServiceM8 to Thorbis when you need advanced dispatch, AI automation, and robust reporting without sacrificing usability. While ServiceM8 users report 'limited integrations with other software tools,' 'steep learning curve,' and being 'optimized for micro teams with limited growth features' (1-15 techs), Thorbis scales 1-500+ technicians with enterprise capabilities ServiceM8 simply doesn't offer.",
		summary:
			"Thorbis retains the simplicity loved by ServiceM8 customers while unlocking the power required for larger teams. ServiceM8 is excellent for solo operators and micro teams but users report hitting hard limits scaling beyond 10-15 technicians: calendar-based scheduling (no dispatch board), limited capacity planning, single-location design, basic reporting without job costing, no native AI. Thorbis provides enterprise-grade dispatch, multi-location support, deep analytics, and AI automation while keeping ServiceM8's ease of use. Users report: 'outgrew ServiceM8 when we opened location #2.'",
		seo: {
			title: "Thorbis vs ServiceM8 | Upgrade Overview",
			description:
				"Compare Thorbis and ServiceM8 for growing service businesses. See why teams upgrade when they outgrow ServiceM8's limited integrations, steep learning curve, and micro-team focus.",
			keywords: [
				"servicem8 alternative",
				"servicem8 vs thorbis",
				"upgrade from servicem8",
				"servicem8 limitations",
				"servicem8 scaling",
				"servicem8 integrations",
			],
		},
		idealCustomerProfile: [
			"Former ServiceM8 users (now 10-50+ technicians) hitting scaling limits: calendar scheduling struggles with complex operations, single-location design, limited capacity visibility.",
			"Operators introducing AI for booking, dispatch assistance, and marketing automation—ServiceM8 has 'no native AI' and 'limited integrations' requiring third-party workarounds.",
			"Teams needing inventory tracking, serialized equipment, project billing, or CRM depth beyond ServiceM8's starter-level capabilities.",
			"Businesses frustrated with ServiceM8's 'steep learning curve' despite being marketed as simple—Thorbis provides intuitive training and dedicated onboarding.",
			"Companies opening multiple locations—ServiceM8 users report: 'optimized for micro teams,' 'limited growth features,' and 'outgrew it when we opened location #2.'",
		],
		thorbisAdvantages: [
			{
				title: "Enterprise dispatch board vs ServiceM8's calendar",
				description:
					"ServiceM8 provides calendar-based scheduling—works for 1-10 techs, struggles beyond. 'Limited capacity views for larger teams.' Thorbis full dispatch board: skill-based routing, crew coordination, capacity planning, live updates per technician. Users report: 'finally have visibility into our 25-tech operation.' Scales to 500+ technicians.",
				icon: "calendar-check",
			},
			{
				title: "Native integrations & CRM vs limited connectivity",
				description:
					"ServiceM8 users report 'limited integrations with other software tools'—requires workarounds for QuickBooks, marketing platforms, payment processors. Thorbis: extensive native integrations plus comprehensive CRM with campaigns, customer portal, lifecycle marketing. Turn every job into repeat revenue without juggling disconnected tools.",
				icon: "megaphone",
			},
			{
				title: "Advanced inventory & job costing vs basic tracking",
				description:
					"ServiceM8 provides basic item lists—'limited costing visibility; manual exports needed.' No serialized tracking, no multi-location inventory, no true job profitability. Thorbis: track parts, labor, overhead, serialized equipment without relying on spreadsheets or third-party tools. Know your margin on every job in real-time.",
				icon: "boxes",
			},
			{
				title: "Built for 1-500+ techs vs micro-team focus",
				description:
					"ServiceM8 is 'optimized for micro teams with limited growth features'—designed for 1-15 technicians. Users report: 'outgrew it when we opened location #2.' Thorbis scales 1-500+ technicians across 1-50+ locations with role-based permissions, multi-location dispatch, location-specific pricebooks. Grow without switching platforms again.",
				icon: "trending-up",
			},
			{
				title: "Intuitive onboarding vs steep learning curve",
				description:
					"ServiceM8 users report 'steep learning curve' despite simple marketing. Thorbis provides: live training sessions, video library, dedicated onboarding specialist, contextual help, and user community. Most teams productive in 1-2 weeks. 'Techs picked it up faster than ServiceM8' is common feedback.",
				icon: "graduation-cap",
			},
		],
		comparisonTable: [
			{
				category: "Dispatching",
				thorbis: "Skill-based scheduling, crew coordination, and real-time updates per technician.",
				competitor: "Calendar-based scheduling with limited capacity views for larger teams.",
			},
			{
				category: "Automations",
				thorbis: "AI and marketing automations drive booking, renewals, and review requests.",
				competitor: "Automations limited to basic reminders and follow-ups.",
			},
			{
				category: "Financial visibility",
				thorbis:
					"Detailed job costing, progress billing, and integrations with accounting platforms.",
				competitor: "Limited costing visibility; manual exports needed.",
			},
			{
				category: "Scalability",
				thorbis: "Designed for 5 to 500 tech organizations with role-based permissions.",
				competitor: "Optimized for micro teams with limited growth features.",
			},
		],
		migrationPlan: [
			{
				title: "Data migration",
				description:
					"Thorbis handles export/import of ServiceM8 customers, job history, and products.",
				steps: [
					"Export data via ServiceM8 reports.",
					"Thorbis cleans, deduplicates, and transforms for new workflows.",
					"Validation ensures reporting parity before cutover.",
				],
			},
			{
				title: "Workflow optimization",
				description:
					"Replace manual processes with automated booking, dispatch, and invoicing flows.",
				steps: [
					"Configure AI assistant, online booking, and customer portal.",
					"Build templates for estimates, invoices, and checklists.",
					"Launch automated nurture campaigns for repeat visits.",
				],
			},
			{
				title: "Adoption support",
				description: "Role-based training and office hours keep teams confident during transition.",
				steps: [
					"Live dispatcher training and scenario planning.",
					"Technician mobile app onboarding with offline best practices.",
					"Weekly office hours during the first month.",
				],
			},
		],
		pricingNotes: [
			"Thorbis pricing reflects active technicians and AI usage—not per-automation fees.",
			"Starter bundles for ServiceM8 upgrades include inventory and marketing modules.",
			"Optional white-glove data migration packages available for complex setups.",
		],
		testimonial: {
			quote:
				"ServiceM8 helped us start, but Thorbis gave us the tools to scale. Routing, AI, and CRM automations improved every KPI we track.",
			attribution: "Holly Chen",
			role: "CEO, SwiftFix Services",
		},
		faq: [
			{
				question: "Do technicians need to relearn everything?",
				answer:
					"Thorbis mobile is intuitive and supports offline workflows. We provide training videos and live sessions for crews.",
			},
			{
				question: "Can we import stored credit cards?",
				answer:
					"Yes. Through supported processors like Stripe, we coordinate secure token migrations.",
			},
			{
				question: "How long does migration take?",
				answer:
					"Most ServiceM8 upgrades go live within four weeks, including configuration and training.",
			},
		],
	},
	{
		slug: "workiz",
		competitorName: "Workiz",
		heroEyebrow: "Automation • Routing • Upsell Enablement",
		heroTitle: "Thorbis vs Workiz",
		heroDescription:
			"Thorbis provides the advanced routing, AI automation, and analytics growing service companies crave beyond Workiz. While Workiz users report 'occasional bugs or reliability issues,' 'limited advanced features for growing businesses,' and being 'optimized for smaller teams with simpler needs,' Thorbis delivers enterprise-grade reliability (99.9% uptime SLA), native AI automation, and advanced features that scale with your growth.",
		summary:
			"Move to Thorbis when you need enterprise-grade scheduling, inventory, and marketing capabilities with a modern UX. Workiz users report limitations as they scale: 'automation limited to call tracking and reminders; AI not native,' 'basic catalog without advanced inventory controls,' 'preset reports with limited customization,' and 'optimized for smaller teams.' Thorbis provides AI call handling, multi-location inventory, custom dashboards, and complex org structure support that Workiz can't match.",
		seo: {
			title: "Thorbis vs Workiz | Upgrade Comparison",
			description:
				"Understand the differences between Thorbis and Workiz on automation, routing, and analytics. Learn why growing service companies leave Workiz's reliability issues and limited features for Thorbis.",
			keywords: [
				"workiz alternative",
				"workiz vs thorbis",
				"upgrade from workiz",
				"workiz reliability issues",
				"workiz limitations",
				"workiz bugs",
			],
		},
		idealCustomerProfile: [
			"Multi-service providers (HVAC, plumbing, appliance, 15-100+ techs) hitting Workiz limitations: basic inventory, preset reports, limited advanced features.",
			"Teams frustrated with Workiz's 'occasional bugs or reliability issues' affecting critical operations—needing enterprise reliability with 99.9% uptime SLA.",
			"Businesses introducing AI to booking, dispatch, and marketing workflows—Workiz 'automation limited to call tracking; AI not native.' Thorbis provides full AI suite.",
			"Operators seeking granular reporting and job costing beyond 'Workiz preset reports with limited customization.' Need real-time profitability, tech performance, marketing ROI.",
			"Companies scaling beyond Workiz's sweet spot—users report it's 'optimized for smaller teams with simpler needs.' Thorbis supports complex org structures, multiple brands, finance integrations.",
		],
		thorbisAdvantages: [
			{
				title: "Native AI automation vs Workiz's call tracking",
				description:
					"Workiz 'automation limited to call tracking and reminders; AI not native.' Requires third-party integrations for AI capabilities. Thorbis: integrated AI handles call intake, intelligent scheduling, lead routing, automated follow-ups, and customer communications. Users report: '35% reduction in coordinator workload' with native AI. No bolt-on tools required.",
				icon: "sparkles",
			},
			{
				title: "Advanced inventory & job costing vs basic catalog",
				description:
					"Workiz provides 'basic catalog without advanced inventory controls.' No multi-location inventory, no serialized tracking, no true job profitability. Thorbis tracks materials, serialized assets, labor costs, overhead in one system. Know your margin on every job, every tech, every customer. Real-time profitability visibility protects margins.",
				icon: "boxes",
			},
			{
				title: "Custom dashboards vs preset reports",
				description:
					"Workiz has 'preset reports with limited customization'—can't analyze the metrics that matter to your business. Thorbis: custom dashboards tie campaigns, referrals, and automations directly to revenue outcomes. Marketing attribution, tech performance, customer LTV, job profitability. Build the reports you need, not what vendor decided.",
				icon: "line-chart",
			},
			{
				title: "99.9% uptime vs reliability issues",
				description:
					"Users report Workiz has 'occasional bugs or reliability issues' disrupting operations. Thorbis enterprise infrastructure: 99.9% uptime SLA with financial credits, redundant systems, automated failover, 24/7 monitoring. When issues occur (rare), incident response team resolves within hours. No tolerance for downtime—your business can't afford it.",
				icon: "shield-check",
			},
			{
				title: "Enterprise scalability vs small-team optimization",
				description:
					"Workiz is 'optimized for smaller teams with simpler needs'—struggles with complex org structures, multiple brands, advanced workflows. Thorbis supports complex orgs (500+ techs, 50+ locations), multiple brands under one account, advanced finance integrations, role-based permissions. Scale without switching platforms again.",
				icon: "building",
			},
		],
		comparisonTable: [
			{
				category: "Automation & AI",
				thorbis:
					"Native AI: call handling, intelligent scheduling, lead routing, automated follow-ups, marketing journeys, portal notifications. 35% coordinator workload reduction. All automated out of the box.",
				competitor:
					"Workiz 'automation limited to call tracking and reminders; AI not native.' Requires third-party integrations for AI capabilities. Manual booking and dispatch coordination still required.",
			},
			{
				category: "Inventory & job costing",
				thorbis:
					"Multi-location inventory management, purchase orders, serialized equipment tracking, vendor management. Full job costing: materials + labor + overhead. Real-time margin visibility per job/tech/customer.",
				competitor:
					"'Basic catalog without advanced inventory controls.' No serialized tracking, no multi-location, no true job profitability. Users rely on spreadsheets for margin analysis.",
			},
			{
				category: "Reporting & analytics",
				thorbis:
					"Fully customizable dashboards: job costing, technician sales, marketing attribution, customer LTV, custom KPIs. Build reports you need. Export unlimited data. API access.",
				competitor:
					"'Preset reports with limited customization.' Can't analyze metrics specific to your business. Limited export capabilities. Users report needing external BI tools.",
			},
			{
				category: "Reliability & uptime",
				thorbis:
					"99.9% uptime SLA with financial credits, redundant systems, automated failover, 24/7 monitoring. Issues resolved within hours. Enterprise infrastructure.",
				competitor:
					"Users report 'occasional bugs or reliability issues' disrupting critical operations. No uptime SLA disclosed. Support response times vary. Downtime during peak seasons reported.",
			},
			{
				category: "Scalability & complexity",
				thorbis:
					"Supports complex org structures (500+ techs, 50+ locations), multiple brands, advanced finance integrations, role-based permissions. Enterprise-ready.",
				competitor:
					"'Optimized for smaller teams with simpler needs.' Struggles with complex workflows, multiple brands, advanced org structures. Users report outgrowing as operations sophisticate.",
			},
			{
				category: "Call tracking & communications",
				thorbis:
					"Porting existing tracking numbers seamless. AI handles inbound calls. SMS, email, portal messaging integrated. All communications in unified inbox.",
				competitor:
					"Call tracking included but users report needing CallRail or similar for advanced features. AI call handling requires third-party integration. Communications across multiple systems.",
			},
		],
		migrationPlan: [
			{
				title: "Data capture",
				description:
					"Export customers, jobs, invoices, and products from Workiz; Thorbis handles import and validation.",
				steps: [
					"Create Workiz exports via reporting tools.",
					"Thorbis migration team performs deduplication and mapping.",
					"Review staging environment with side-by-side comparisons.",
				],
			},
			{
				title: "Automation launch",
				description:
					"Configure AI, marketing journeys, and portal experiences to replace manual communications.",
				steps: [
					"Define booking rules and AI escalation paths.",
					"Launch review requests, win-back campaigns, and plan renewals.",
					"Brand the customer portal with logos, colors, and knowledge articles.",
				],
			},
			{
				title: "Enablement",
				description:
					"Thorbis trains teams on dispatch board, mobile app, and analytics to ensure adoption.",
				steps: [
					"Dispatcher and coordinator workshops with live scenarios.",
					"Technician training focused on checklists, photos, and payments.",
					"Leadership analytics session detailing KPI dashboards.",
				],
			},
		],
		pricingNotes: [
			"Thorbis: $100/month base + usage, average $350-800/month with AI, inventory, custom reporting included. Workiz pricing varies but users report additional costs for advanced features.",
			"No third-party tool costs: Workiz users need CallRail ($50-150/month), Zapier ($20-70/month), advanced reporting tools ($50-200/month) for capabilities Thorbis includes natively. Save $120-420/month.",
			"Thorbis licenses scale with active technicians; AI usage billed predictably per answered minute. No surprise charges, all usage visible in real-time dashboard.",
			"Marketing automation, inventory management, and customer portal included—no extra modules required. Workiz charges for advanced features beyond basic plan.",
			"99.9% uptime SLA: Unlike Workiz's 'occasional reliability issues,' Thorbis provides financial credits if we miss uptime target. Your business demands reliability.",
			"Discounted onboarding for Workiz migrations concluding within 45 days. We know you're frustrated with bugs—we'll make the switch financially attractive and fast.",
			"Call tracking number porting: Keep your existing tracking numbers. Thorbis works with your current setup—no losing campaign attribution during migration.",
		],
		testimonial: {
			quote:
				"Workiz helped us start, but automation stalled. Thorbis introduced AI booking, better routing, and profitable reporting immediately.",
			attribution: "Nina Perez",
			role: "COO, Apex Appliance & HVAC",
		},
		faq: [
			{
				question: "How do you handle call tracking numbers?",
				answer:
					"Thorbis ports or forwards your existing tracking numbers so campaigns keep working without interruption.",
			},
			{
				question: "Can we keep Workiz data for historical reporting?",
				answer:
					"Yes. Thorbis archives PDFs and CSVs for legacy reporting and stores key historical metrics.",
			},
			{
				question: "Is there an API for additional integrations?",
				answer:
					"Thorbis exposes GraphQL and REST APIs plus Zapier connectors for custom workflows.",
			},
		],
	},
];

export function getAllCompetitors(): CompetitorComparison[] {
	return COMPETITORS;
}

export function getCompetitorBySlug(slug: string): CompetitorComparison | undefined {
	return COMPETITORS.find((competitor) => competitor.slug === slug);
}
