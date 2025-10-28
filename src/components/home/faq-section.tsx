"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can we get started with Stratos?",
      answer:
        "Most teams are up and running within 24 hours. We provide white-glove onboarding with a dedicated specialist who handles data migration, team training, and system customization. Your first call with our onboarding team happens within 2 hours of signing up.",
    },
    {
      question: "Do we need to sign a long-term contract?",
      answer:
        "No contracts required. Stratos operates on a month-to-month basis with no long-term commitment. You can cancel anytime, though 98% of our customers stay with us because we deliver results. We're confident you'll love Stratos.",
    },
    {
      question: "Will Stratos work offline in the field?",
      answer:
        "Yes! Our mobile app is built offline-first. Technicians can access job details, take photos, capture signatures, and process payments without internet. Everything syncs automatically when they're back online. This is perfect for basements, rural areas, or anywhere with spotty coverage.",
    },
    {
      question: "How much does Stratos cost?",
      answer:
        "Pricing starts at $99/month for small teams and scales based on your needs. We offer transparent pricing with no hidden fees, and our payment processing fees (2.3%) are the lowest in the industry. Most customers see ROI within 30 days through increased efficiency and faster payments.",
    },
    {
      question: "Can we migrate our existing data?",
      answer:
        "Absolutely. We handle data migration from all major platforms including ServiceTitan, Housecall Pro, Jobber, and more. Our team will import your customers, jobs, equipment history, and price books at no additional cost. The migration typically takes 2-3 days and we ensure zero data loss.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer 24/7 phone, chat, and email support with an average response time under 2 minutes. Every customer gets a dedicated success manager, unlimited training sessions, and access to our comprehensive knowledge base. Unlike competitors, support is included in your subscription—no extra charges.",
    },
    {
      question: "Does Stratos integrate with QuickBooks?",
      answer:
        "Yes, we have deep two-way integration with both QuickBooks Online and QuickBooks Desktop. Invoices, payments, expenses, and customers sync automatically in real-time. No manual entry, no export/import, no accounting headaches. Set it up once and forget about it.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Security is our top priority. Stratos is SOC 2 Type II certified with bank-level 256-bit encryption for all data. We perform regular security audits, maintain 99.9% uptime SLA, and backup your data every hour. Your data is hosted on AWS in secure, redundant data centers with automatic failover.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-black via-primary/5 to-black py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            FAQ
          </Badge>
          <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
            Questions?
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              We Have Answers
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-foreground text-lg">
            Everything you need to know about Stratos. Can&apos;t find what
            you&apos;re looking for? Chat with our team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-primary/20 bg-white/5 transition-all duration-300 hover:border-primary/40"
            >
              <button
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-primary/5"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                type="button"
              >
                <span className="pr-8 font-semibold text-white text-lg">
                  {faq.question}
                </span>
                <svg
                  className={`size-6 shrink-0 text-primary transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="border-primary/10 border-t p-6">
                  <p className="text-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-bold text-2xl text-white">
            Still have questions?
          </h3>
          <p className="mb-6 text-foreground">
            Our team is here to help. Get answers in minutes, not hours.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-primary/90"
            >
              <Link href="/contact">
                Talk to Sales
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="group rounded-lg border border-border bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10"
              variant="outline"
            >
              <Link href="/help">
                Visit Help Center
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-foreground/60 text-sm">
            Or call us at{" "}
            <a
              className="text-primary hover:underline"
              href="tel:1-800-STRATOS"
            >
              1-800-STRATOS
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
