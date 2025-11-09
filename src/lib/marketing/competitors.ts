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
      "Thorbis delivers the enterprise capabilities contractors expect from ServiceTitan, without the hidden costs, shelfware, or multi-year commitments.",
    summary:
      "Switch to Thorbis for a modern platform built around AI-assisted workflows, flexible pricing, and rapid innovation. Operators gain a partner focused on speed, configurability, and a responsive product roadmap.",
    seo: {
      title:
        "Thorbis vs ServiceTitan | Modern Field Service Platform Comparison",
      description:
        "Compare Thorbis and ServiceTitan on pricing, user experience, AI, and implementation. Discover why high-growth contractors choose Thorbis.",
      keywords: [
        "servicetitan alternative",
        "servicetitan vs thorbis",
        "field service titan replacement",
      ],
    },
    idealCustomerProfile: [
      "Multi-location HVAC, plumbing, or electrical firms tired of complex pricing and slow innovation.",
      "Operators who want AI-powered call handling and self-service booking baked into the platform.",
      "Teams seeking fast implementation timelines and transparent, usage-based pricing.",
    ],
    thorbisAdvantages: [
      {
        title: "Transparent pricing & faster ROI",
        description:
          "Thorbis offers straightforward licensing with usage-based AI features. No installation, SMS, or feature unlock fees layered on top.",
        icon: "wallet",
      },
      {
        title: "AI-native workflows",
        description:
          "AI dispatcher, inbox summarization, and live booking are core features—not costly add-ons still in beta.",
        icon: "sparkles",
      },
      {
        title: "Implementation measured in weeks",
        description:
          "Dedicated migration teams and prebuilt data templates cut go-live timelines to 30-45 days, not months.",
        icon: "rocket",
      },
    ],
    comparisonTable: [
      {
        category: "Pricing & contracts",
        thorbis:
          "Predictable licensing with usage-based AI add-ons. Annual agreements with growth tiers.",
        competitor:
          "Multi-year contracts, per-module fees, and SMS/AI surcharges.",
      },
      {
        category: "AI capabilities",
        thorbis:
          "AI call handling, scheduling, and summary tools available to every customer out of the box.",
        competitor:
          "AI assistant still limited rollout; add-on fees and limited automation.",
      },
      {
        category: "User experience",
        thorbis:
          "Modern UI optimized for dispatchers and technicians. Feature releases shipped every two weeks.",
        competitor:
          "Legacy interface with steep learning curve and slower release cadence.",
      },
      {
        category: "Implementation",
        thorbis: "30-45 day guided migration with data cleansing included.",
        competitor:
          "4-6 month onboarding windows with heavy internal lift and third-party fees.",
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
      "No per-text or call recording surcharges—communications usage is included.",
      "AI assistant billed per answered minute with bundled allowances in growth tiers.",
      "Implementation billed as a fixed engagement, not hourly.",
    ],
    testimonial: {
      quote:
        "We ran on ServiceTitan for five years. Thorbis migrated our data in 40 days and our dispatchers adopted the new board within a week.",
      attribution: "Leslie Warren",
      role: "COO, Elevate Mechanical",
    },
    faq: [
      {
        question: "Can Thorbis import my historical ServiceTitan data?",
        answer:
          "Yes. We migrate customers, jobs, equipment, memberships, and pricebooks. Historical invoices and notes are stored for reference.",
      },
      {
        question: "Do you integrate with ServiceTitan-friendly vendors?",
        answer:
          "Thorbis offers direct integrations with QuickBooks, Sunbit, GreenSky, and popular distributor catalogs.",
      },
      {
        question: "How quickly can we launch?",
        answer:
          "Most teams complete onboarding within six weeks. We handle the heavy lifting so your staff stays focused on customers.",
      },
    ],
  },
  {
    slug: "housecall-pro",
    competitorName: "Housecall Pro",
    heroEyebrow: "Scaling Up • Workflows • Automation",
    heroTitle: "Thorbis vs Housecall Pro",
    heroDescription:
      "Graduating from Housecall Pro? Thorbis offers advanced scheduling, AI automation, and enterprise reporting built for teams expanding beyond five trucks.",
    summary:
      "Thorbis is the natural upgrade for Housecall Pro users who need deeper dispatch controls, multi-location support, and a roadmap aligned with mid-market growth.",
    seo: {
      title: "Thorbis vs Housecall Pro | Field Service Upgrade Comparison",
      description:
        "Evaluate Thorbis as the next step after Housecall Pro. Compare automations, multi-location support, and pricing.",
      keywords: [
        "housecall pro alternative",
        "housecall pro vs thorbis",
        "upgrade from housecall pro",
      ],
    },
    idealCustomerProfile: [
      "Growing service companies ready for more robust dispatch, inventory, and reporting.",
      "Operators managing multiple crews, locations, or commercial contracts.",
      "Teams adopting AI to handle call intake, booking, and follow-up automatically.",
    ],
    thorbisAdvantages: [
      {
        title: "Enterprise-grade dispatch",
        description:
          "Drag-and-drop board with crew assignments, skill routing, and live technician tracking surpasses basic calendar views.",
        icon: "calendar-range",
      },
      {
        title: "AI-first operations",
        description:
          "AI handling for calls, lead scoring, and summarization increases productivity without hiring.",
        icon: "sparkles",
      },
      {
        title: "Advanced analytics",
        description:
          "Live dashboards, job costing, and revenue attribution equip leaders with fast decisions.",
        icon: "line-chart",
      },
    ],
    comparisonTable: [
      {
        category: "Scheduling & dispatch",
        thorbis:
          "Full dispatch board with skills, crews, exceptions, and live re-routing.",
        competitor:
          "Calendar-based scheduling with limited capacity controls for complex teams.",
      },
      {
        category: "Automations",
        thorbis:
          "AI assistant, marketing automation, and renewal workflows included in core platform.",
        competitor:
          "Automation limited to sequences; AI call handling not native.",
      },
      {
        category: "Inventory & job costing",
        thorbis:
          "Multi-location inventory, serialized tracking, and expenses rolled into job profitability.",
        competitor: "Basic item lists without advanced job costing.",
      },
      {
        category: "Scalability",
        thorbis:
          "Supports multi-branch operations, complex pricebooks, and multi-role permissions.",
        competitor:
          "Optimized for single-location, residential companies with simpler requirements.",
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
      "Keep predictable monthly pricing while unlocking advanced automations.",
      "Volume-based discounts for teams adding branches or business units.",
      "Implementation credits available for qualifying Housecall Pro migrations.",
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
          "Yes. We run Thorbis in parallel, sync new jobs nightly, and execute a single cutover weekend with no downtime.",
      },
      {
        question: "Do technicians need new devices?",
        answer:
          "Thorbis mobile runs on iOS and Android. Provide recommended specs during onboarding to reuse existing hardware.",
      },
      {
        question: "How are online booking links handled?",
        answer:
          "Thorbis embeds on your website with minimal changes. Existing forms can forward into the Thorbis scheduler.",
      },
    ],
  },
  {
    slug: "jobber",
    competitorName: "Jobber",
    heroEyebrow: "Growing Crews • Recurring Work • Upsells",
    heroTitle: "Thorbis vs Jobber",
    heroDescription:
      "Outgrowing Jobber? Thorbis introduces enterprise-grade scheduling, AI-powered booking, and advanced analytics for teams ready to scale.",
    summary:
      "Thorbis is built for service companies expanding beyond simple routes. Gain control over complex workflows while keeping the user experience modern and friendly.",
    seo: {
      title: "Thorbis vs Jobber | Upgrade Comparison for Scaling Teams",
      description:
        "Compare Thorbis and Jobber on routing, automations, and enterprise readiness. See why scaling service companies upgrade to Thorbis.",
      keywords: [
        "jobber alternative",
        "jobber vs thorbis",
        "upgrade from jobber",
      ],
    },
    idealCustomerProfile: [
      "Roofing, landscaping, pest, or cleaning teams expanding into multiple crews or territories.",
      "Operators requiring deeper reporting, multi-location support, and advanced automations.",
      "Businesses introducing AI for booking, dispatch assistance, or marketing journeys.",
    ],
    thorbisAdvantages: [
      {
        title: "Advanced routing & crew management",
        description:
          "Bundle multi-stop routes by crew, enforce capacity, and monitor live progress across teams.",
        icon: "route",
      },
      {
        title: "Recurring revenue automation",
        description:
          "Manage contracts, renewals, and installment billing without manual spreadsheets.",
        icon: "repeat",
      },
      {
        title: "Insightful analytics",
        description:
          "Track job profitability, technician performance, and marketing attribution in real time.",
        icon: "line-chart",
      },
    ],
    comparisonTable: [
      {
        category: "Routing & crew control",
        thorbis:
          "Crew assignments, live geo-tracking, and AI suggestions to rebalance workloads.",
        competitor:
          "Basic route lists without capacity indicators or AI support.",
      },
      {
        category: "Recurring work management",
        thorbis:
          "Contracts with automated renewals, autopay, and lifecycle marketing.",
        competitor:
          "Recurring schedules handled manually with limited automation.",
      },
      {
        category: "AI capabilities",
        thorbis:
          "AI call handling, lead scoring, summaries, and smart scheduling are native features.",
        competitor:
          "Limited to automations and manual booking; no AI dispatcher.",
      },
      {
        category: "Reporting & insights",
        thorbis:
          "Customizable dashboards for revenue, margin, crew productivity, and upsells.",
        competitor: "Summary reporting without deep profitability visibility.",
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
      "Thorbis scales with crew count rather than per-user charges, keeping predictable margins.",
      "Route optimization and AI booking included—no need for separate add-ons.",
      "Custom onboarding packages available for seasonal businesses.",
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
      "FieldEdge loyalists choose Thorbis for a modern interface, AI-powered workflows, and rapid product development.",
    summary:
      "Thorbis maintains the reliability teams expect while introducing the AI-enabled automation FieldEdge lacks.",
    seo: {
      title: "Thorbis vs FieldEdge | Modern Alternative for Contractors",
      description:
        "See how Thorbis compares with FieldEdge on user experience, automation, and product roadmap.",
      keywords: [
        "fieldedge alternative",
        "fieldedge vs thorbis",
        "modern fieldedge replacement",
      ],
    },
    idealCustomerProfile: [
      "HVAC and plumbing operators frustrated by FieldEdge’s dated interface and slow roadmap.",
      "Teams who want call center automation, AI booking, and self-service portals without bolt-on tools.",
      "Operations leaders demanding integrated reporting and marketing automation.",
    ],
    thorbisAdvantages: [
      {
        title: "Modern, intuitive experience",
        description:
          "Dispatchers and technicians adopt Thorbis quickly with streamlined UI elements across web and mobile.",
        icon: "sparkles",
      },
      {
        title: "AI automation everywhere",
        description:
          "AI handles triage, scheduling, summaries, and marketing follow-up so staff can focus on customers.",
        icon: "bot",
      },
      {
        title: "Connected platform",
        description:
          "CRM, portal, marketing, inventory, and payroll in a single platform—no juggling legacy modules.",
        icon: "layers",
      },
    ],
    comparisonTable: [
      {
        category: "User experience",
        thorbis:
          "Responsive web UI, dark mode, keyboard shortcuts, and configurable dashboards.",
        competitor:
          "Legacy interface with limited customization and desktop dependence.",
      },
      {
        category: "Automation & AI",
        thorbis:
          "AI call handling, marketing automations, and portal updates included in platform.",
        competitor: "Manual workflows and limited marketing functionality.",
      },
      {
        category: "Innovation cadence",
        thorbis:
          "Bi-weekly releases with customer advisory councils shaping the roadmap.",
        competitor: "Slower release cycle with incremental updates.",
      },
      {
        category: "Implementation",
        thorbis:
          "Dedicated migration team with data cleanup, workflow redesign, and role-based training included.",
        competitor:
          "In-house configuration and limited onboarding resources prolong adoption.",
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
      "Thorbis includes marketing automation and AI features without separate point solutions.",
      "Flexible licensing supports seasonal or multi-branch organizations.",
      "Implementation costs offset with data migration credits for FieldEdge customers.",
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
      "Upgrade from ServiceM8 to Thorbis when you need advanced dispatch, AI automation, and robust reporting without sacrificing usability.",
    summary:
      "Thorbis retains the simplicity loved by ServiceM8 customers while unlocking the power required for larger teams.",
    seo: {
      title: "Thorbis vs ServiceM8 | Upgrade Overview",
      description:
        "Compare Thorbis and ServiceM8 for growing service businesses. See why teams upgrade when they outgrow starter tools.",
      keywords: [
        "servicem8 alternative",
        "servicem8 vs thorbis",
        "upgrade from servicem8",
      ],
    },
    idealCustomerProfile: [
      "Former ServiceM8 users now managing multiple technicians or divisions.",
      "Operators introducing AI for booking, dispatch, and marketing.",
      "Teams needing inventory tracking, project billing, or CRM depth beyond starter tools.",
    ],
    thorbisAdvantages: [
      {
        title: "Scalable scheduling & dispatch",
        description:
          "Move from simple calendars to a full dispatch board with capacity insights and live updates.",
        icon: "calendar-check",
      },
      {
        title: "Integrated CRM & marketing",
        description:
          "Turn every job into repeat revenue with CRM, campaigns, and customer portal built-in.",
        icon: "megaphone",
      },
      {
        title: "Inventory & job costing",
        description:
          "Track parts, labor, and profitability without relying on spreadsheets or third-party tools.",
        icon: "boxes",
      },
    ],
    comparisonTable: [
      {
        category: "Dispatching",
        thorbis:
          "Skill-based scheduling, crew coordination, and real-time updates per technician.",
        competitor:
          "Calendar-based scheduling with limited capacity views for larger teams.",
      },
      {
        category: "Automations",
        thorbis:
          "AI and marketing automations drive booking, renewals, and review requests.",
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
        thorbis:
          "Designed for 5 to 500 tech organizations with role-based permissions.",
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
        description:
          "Role-based training and office hours keep teams confident during transition.",
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
      "Thorbis provides the advanced routing, AI automation, and analytics growing service companies crave beyond Workiz.",
    summary:
      "Move to Thorbis when you need enterprise-grade scheduling, inventory, and marketing capabilities with a modern UX.",
    seo: {
      title: "Thorbis vs Workiz | Upgrade Comparison",
      description:
        "Understand the differences between Thorbis and Workiz on automation, routing, and analytics for service companies.",
      keywords: [
        "workiz alternative",
        "workiz vs thorbis",
        "upgrade from workiz",
      ],
    },
    idealCustomerProfile: [
      "Multi-service providers (HVAC, plumbing, appliance) ready for deeper automation.",
      "Teams introducing AI to booking, dispatch, and marketing workflows.",
      "Operators seeking granular reporting and job costing beyond Workiz dashboards.",
    ],
    thorbisAdvantages: [
      {
        title: "AI-enabled operations",
        description:
          "Automate call handling, lead routing, and customer communications with integrated AI.",
        icon: "sparkles",
      },
      {
        title: "Inventory & job costing",
        description:
          "Track materials, serialized assets, and labor costs in one system to protect margins.",
        icon: "boxes",
      },
      {
        title: "Marketing attribution",
        description:
          "Tie campaigns, referrals, and automations directly to revenue outcomes with built-in reporting.",
        icon: "line-chart",
      },
    ],
    comparisonTable: [
      {
        category: "Automation",
        thorbis:
          "AI assistant, marketing journeys, customer portal notifications all automated out of the box.",
        competitor:
          "Workiz automation limited to call tracking and reminders; AI not native.",
      },
      {
        category: "Inventory",
        thorbis:
          "Multi-location inventory, purchase orders, and serialized equipment tracking.",
        competitor: "Basic catalog without advanced inventory controls.",
      },
      {
        category: "Reporting",
        thorbis:
          "Custom dashboards for job costing, technician sales, and marketing attribution.",
        competitor: "Preset reports with limited customization.",
      },
      {
        category: "Scalability",
        thorbis:
          "Supports complex org structures, multiple brands, and finance integrations.",
        competitor: "Optimized for smaller teams with simpler needs.",
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
      "Thorbis licenses scale with active technicians; AI usage billed predictably.",
      "Marketing automation, inventory, and customer portal included—no extra modules required.",
      "Discounted onboarding for Workiz migrations concluding within 45 days.",
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

export function getCompetitorBySlug(
  slug: string
): CompetitorComparison | undefined {
  return COMPETITORS.find((competitor) => competitor.slug === slug);
}
