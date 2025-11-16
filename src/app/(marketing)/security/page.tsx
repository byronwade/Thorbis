import Script from "next/script";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Thorbis Security & Trust",
  description:
    "Learn how Thorbis protects customer data. Review encryption, compliance, infrastructure, and incident response policies.",
  path: "/security",
  section: "Company",
  keywords: [
    "thorbis security",
    "field service security",
    "thorbis compliance",
  ],
});

const PILLARS = [
  {
    title: "Enterprise-grade infrastructure",
    description:
      "Thorbis is hosted on AWS with regional redundancy, automated backups, and 99.9%+ uptime. We leverage AWS PrivateLink to keep data isolated and encrypted.",
  },
  {
    title: "Secure development lifecycle",
    description:
      "All code changes undergo peer review, automated testing, and static analysis. Secrets management, least privilege access, and dependency scanning are mandatory.",
  },
  {
    title: "Compliance alignment",
    description:
      "Thorbis aligns with SOC 2 Type II controls and GDPR requirements. We maintain DPA agreements, subprocessors lists, and annual penetration tests.",
  },
  {
    title: "Customer data ownership",
    description:
      "You control your data. We provide export capabilities, data retention policies, and prompt deletion upon request.",
  },
];

const FAQ = [
  {
    question: "Where is data stored?",
    answer:
      "Thorbis stores data in AWS US-East and offers EU data residency upon request. All data is encrypted at rest with AES-256 and in transit via TLS 1.2+.",
  },
  {
    question: "Do you conduct penetration tests?",
    answer:
      "Yes. Independent penetration tests and vulnerability assessments are performed annually. Summaries are available under NDA.",
  },
  {
    question: "How do you handle incidents?",
    answer:
      "Thorbis maintains a documented incident response plan with 24/7 on-call coverage. Customers receive timely notifications and remediation updates.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Security", url: `${siteUrl}/security` },
            ])
          ),
        }}
        id="security-breadcrumb-ld"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-6">
          <Badge className="uppercase tracking-wide" variant="secondary">
            Security & trust
          </Badge>
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
            Protecting your business is our highest priority
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Thorbis was designed with security at its core. From encrypted data
            storage to rigorous compliance programs, we protect sensitive
            information for contractors of every size.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href="mailto:security@thorbis.com">
                Request our security packet
              </a>
            </Button>
            <Button asChild>
              <a href="https://status.thorbis.com" rel="noopener">
                View uptime status
              </a>
            </Button>
          </div>
        </section>

        <section className="mt-16 space-y-6">
          <h2 className="font-semibold text-2xl">Security pillars</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((pillar) => (
              <Card key={pillar.title}>
                <CardHeader>
                  <CardTitle>{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border bg-muted/20 p-10">
          <h2 className="font-semibold text-2xl">Certifications & policies</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
            <li>• SOC 2 Type II (audit underway, report available Q4 2025).</li>
            <li>• GDPR compliant with EU Standard Contractual Clauses.</li>
            <li>
              • Annual third-party penetration testing and continuous bug bounty
              program.
            </li>
            <li>
              • Role-based access controls, SSO, and MFA required for all
              employees.
            </li>
          </ul>
        </section>

        <section className="mt-16 space-y-4">
          <h2 className="font-semibold text-2xl">Frequently asked questions</h2>
          <Accordion collapsible type="single">
            {FAQ.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`security-faq-${index}`}
              >
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
