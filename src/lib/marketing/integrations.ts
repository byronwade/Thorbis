import type { MarketingIntegrationContent } from "./types";

const INTEGRATIONS: MarketingIntegrationContent[] = [
  {
    kind: "integration",
    slug: "quickbooks",
    name: "QuickBooks Online",
    heroEyebrow: "Accounting • Job Costing • Two-Way Sync",
    heroTitle: "Keep operations and accounting perfectly aligned",
    heroDescription:
      "Sync customers, invoices, payments, and job costs between Thorbis and QuickBooks in minutes. Finance stays accurate while operations move fast.",
    summary:
      "Thorbis pushes jobs, invoices, and payments to QuickBooks automatically while pulling back balances and customer updates. No more manual double entry or month-end reconciliations.",
    partner: {
      name: "Intuit QuickBooks",
      website: "https://quickbooks.intuit.com",
      logo: "/integrations/quickbooks.svg",
    },
    categories: ["Accounting", "Job Costing", "Cash Flow"],
    primaryCta: {
      label: "Connect QuickBooks",
      href: "/register",
    },
    secondaryCta: {
      label: "Download implementation guide",
      href: "/templates?tag=quickbooks",
    },
    seo: {
      title: "Thorbis + QuickBooks Integration",
      description:
        "Sync customers, invoices, payments, and job costing between Thorbis and QuickBooks Online. Eliminate double entry and close books faster.",
      keywords: [
        "thorbis quickbooks integration",
        "field service quickbooks sync",
        "quickbooks online dispatch integration",
      ],
      image: "/images/integrations/quickbooks-og.png",
    },
    valueProps: [
      {
        title: "Two-way customer sync",
        description:
          "Keep customer records aligned across Thorbis and QuickBooks, including billing addresses, balances, and classifications.",
        icon: "repeat",
      },
      {
        title: "Automated revenue posting",
        description:
          "Push invoices, payments, and deposits from Thorbis to accounting as soon as jobs close—no CSV imports required.",
        icon: "wallet",
      },
      {
        title: "Job costing visibility",
        description:
          "Track labor, materials, and overhead at the job level with costs flowing into QuickBooks projects and classes.",
        icon: "scale",
      },
    ],
    workflows: [
      {
        title: "Same-day close",
        description:
          "Technicians finish a job in Thorbis, invoices sync instantly, and QuickBooks ledger updates without human intervention.",
        steps: [
          "Technician completes job and collects payment in Thorbis.",
          "Thorbis posts invoice, payment, and deposit to QuickBooks.",
          "Finance reviews synced transactions and closes the day.",
        ],
      },
      {
        title: "New customer onboarding",
        description:
          "Create accounts in either system and Thorbis ensures both databases stay unified, preventing duplicates and missed billing.",
      },
    ],
    stats: [
      {
        label: "Manual entry savings",
        value: "-20 hrs",
        description: "per week eliminated for accounting teams after syncing Thorbis and QuickBooks.",
      },
      {
        label: "Posting accuracy",
        value: "99.8%",
        description: "accuracy rate across invoices and payments after go-live.",
      },
    ],
    requirements: [
      "QuickBooks Online Essentials or higher.",
      "Thorbis Growth plan or above.",
      "Company administrator permissions in both systems.",
    ],
    resources: [
      {
        label: "Thorbis QuickBooks setup checklist",
        href: "/templates?tag=quickbooks",
      },
      {
        label: "Support article: QuickBooks sync settings",
        href: "/kb/user-guides/quickbooks-sync",
      },
    ],
    related: ["stripe", "zapier"],
    faq: [
      {
        question: "Do you support QuickBooks Desktop?",
        answer:
          "Yes. Thorbis provides a secure connector for QuickBooks Desktop Enterprise. Contact support for enablement details.",
      },
      {
        question: "How often does data sync?",
        answer:
          "Thorbis syncs in near real time. You can also trigger manual syncs or schedule batching to match accounting practices.",
      },
      {
        question: "Can I map classes and locations?",
        answer:
          "Absolutely. Map Thorbis business units to QuickBooks classes, locations, or projects to keep financial reporting structured.",
      },
    ],
  },
  {
    kind: "integration",
    slug: "stripe",
    name: "Stripe Payments",
    heroEyebrow: "Payments • Autopay • Digital Wallets",
    heroTitle: "Collect payments faster with modern checkout experiences",
    heroDescription:
      "Process credit cards, ACH, and digital wallets directly inside Thorbis with Stripe. Enable autopay for maintenance plans and reduce days sales outstanding.",
    summary:
      "Thorbis embeds Stripe across invoices, customer portal, and mobile workflows so payments happen instantly. Support cards, ACH, Apple Pay, Google Pay, and secure stored methods.",
    partner: {
      name: "Stripe",
      website: "https://stripe.com",
      logo: "/integrations/stripe.svg",
    },
    categories: ["Payments", "Cash Flow", "Customer Experience"],
    primaryCta: {
      label: "Enable Stripe payments",
      href: "/register",
    },
    secondaryCta: {
      label: "Review payment processing guide",
      href: "/kb/user-guides/stripe-payments",
    },
    seo: {
      title: "Thorbis + Stripe Payment Integration",
      description:
        "Accept credit cards, ACH, and digital wallets directly in Thorbis with Stripe. Offer autopay and reduce collections friction.",
      keywords: [
        "thorbis stripe integration",
        "field service stripe payments",
        "stripe autopay maintenance plans",
      ],
      image: "/images/integrations/stripe-og.png",
    },
    valueProps: [
      {
        title: "Accept any payment method",
        description:
          "Offer credit card, ACH bank debit, Apple Pay, and Google Pay from invoices, portal, or mobile app.",
        icon: "credit-card",
      },
      {
        title: "Autopay & subscriptions",
        description:
          "Save payment methods securely and automate recurring maintenance or membership billing.",
        icon: "repeat",
      },
      {
        title: "Instant reconciliation",
        description:
          "Stripe payouts sync to Thorbis and QuickBooks automatically, providing end-to-end visibility.",
        icon: "line-chart",
      },
    ],
    workflows: [
      {
        title: "Technician collects on-site",
        description:
          "Tech finalizes the job, presents invoice on mobile, and captures payment with card on file or tap-to-pay.",
      },
      {
        title: "Portal autopay for plans",
        description:
          "Customers enroll in autopay through the Thorbis portal. Stripe processes renewals and notifies finance automatically.",
      },
    ],
    stats: [
      {
        label: "Days sales outstanding",
        value: "-9 days",
        description: "average reduction once customers can pay immediately with Stripe in Thorbis.",
      },
    ],
    requirements: [
      "Active Stripe merchant account.",
      "Thorbis Growth or Scale plan.",
      "PCI compliance handled via Stripe—no extra audits.",
    ],
    resources: [
      {
        label: "Stripe onboarding checklist",
        href: "/templates?tag=stripe",
      },
      {
        label: "Support article: Accepting payments with Stripe",
        href: "/kb/user-guides/stripe-payments",
      },
    ],
    related: ["quickbooks", "zapier"],
    faq: [
      {
        question: "Are there additional processing fees?",
        answer:
          "Thorbis charges no extra fees. You pay Stripe’s standard processing rates or your negotiated pricing.",
      },
      {
        question: "Can I pass fees to customers?",
        answer:
          "You can configure convenience fees or discount ACH payments. Consult local regulations before enabling surcharges.",
      },
      {
        question: "Do you support Stripe Terminal?",
        answer:
          "Yes. Use Stripe Terminal for card-present transactions with Bluetooth or countertop readers linked to Thorbis.",
      },
    ],
  },
  {
    kind: "integration",
    slug: "zapier",
    name: "Zapier Automation",
    heroEyebrow: "Automation • Workflows • No-Code",
    heroTitle: "Automate repetitive tasks with Zapier’s 5,000+ app ecosystem",
    heroDescription:
      "Connect Thorbis to CRMs, marketing tools, spreadsheets, and more without writing code. Trigger workflows on jobs, invoices, or customer updates.",
    summary:
      "Zapier enables non-technical teams to orchestrate powerful automations by combining Thorbis events with thousands of SaaS apps.",
    partner: {
      name: "Zapier",
      website: "https://zapier.com",
      logo: "/integrations/zapier.svg",
    },
    categories: ["Automation", "Productivity"],
    primaryCta: {
      label: "Explore Zap templates",
      href: "https://zapier.com/apps/thorbis/integrations",
    },
    secondaryCta: {
      label: "Request advanced automation help",
      href: "/contact",
    },
    seo: {
      title: "Thorbis + Zapier Integration",
      description:
        "Trigger no-code automations using Thorbis data with thousands of Zapier apps. Streamline marketing, reporting, and back-office work.",
      keywords: [
        "thorbis zapier integration",
        "field service automation zapier",
        "thorbis workflows",
      ],
      image: "/images/integrations/zapier-og.png",
    },
    valueProps: [
      {
        title: "Triggers for every workflow",
        description:
          "React to job creation, status changes, invoice events, or customer updates to drive downstream automation.",
        icon: "workflow",
      },
      {
        title: "5,000+ app connections",
        description:
          "Sync Thorbis with CRMs, marketing platforms, spreadsheets, and BI tools instantly.",
        icon: "git-branch",
      },
      {
        title: "No developer required",
        description:
          "Operations teams build automations in minutes using Zapier’s visual editor—no code or APIs needed.",
        icon: "sparkles",
      },
    ],
    workflows: [
      {
        title: "New lead nurture",
        description:
          "When Thorbis creates a new estimate, Zapier sends a personalized email drip via HubSpot and creates a follow-up task in Asana.",
      },
      {
        title: "Daily KPI snapshots",
        description:
          "Push completed job metrics from Thorbis into Google Sheets or BI dashboards automatically for leadership reporting.",
      },
    ],
    requirements: [
      "Zapier Professional plan or higher recommended.",
      "Thorbis API access (included with Growth plan+).",
    ],
    resources: [
      {
        label: "Popular Zap templates",
        href: "https://zapier.com/apps/thorbis/integrations",
      },
      {
        label: "Thorbis API documentation",
        href: "/api-docs",
      },
    ],
    related: ["quickbooks", "stripe"],
    faq: [
      {
        question: "Which Zapier triggers are available?",
        answer:
          "Thorbis exposes triggers for job creation, updates, invoice events, customer lifecycle changes, and schedule updates.",
      },
      {
        question: "Can I build multi-step Zaps?",
        answer:
          "Yes. Use filter, formatter, and path steps to build complex branching automations using Thorbis data.",
      },
      {
        question: "Is there a limit on zap volume?",
        answer:
          "Zap throughput is governed by your Zapier usage limits. Thorbis does not throttle beyond API rate limits.",
      },
    ],
  },
];

export function getAllIntegrations(): MarketingIntegrationContent[] {
  return INTEGRATIONS;
}

export function getIntegrationBySlug(
  slug: string
): MarketingIntegrationContent | undefined {
  return INTEGRATIONS.find((integration) => integration.slug === slug);
}

export function getRelatedIntegrations(
  slug: string,
  limit = 3
): MarketingIntegrationContent[] {
  const current = getIntegrationBySlug(slug);
  if (!current) return [];

  const related =
    current.related
      ?.map((relatedSlug) => getIntegrationBySlug(relatedSlug))
      .filter((integration): integration is MarketingIntegrationContent =>
        Boolean(integration)
      ) ?? [];

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const others = INTEGRATIONS.filter(
    (integration) => integration.slug !== slug
  ).slice(0, limit - related.length);

  return [...related, ...others];
}

export function getFeaturedIntegrations(
  slugs: string[]
): MarketingIntegrationContent[] {
  return slugs
    .map((slug) => getIntegrationBySlug(slug))
    .filter((integration): integration is MarketingIntegrationContent =>
      Boolean(integration)
    );
}

