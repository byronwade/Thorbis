/**
 * Comprehensive Tradesman Hourly Rate Calculator - Client Component
 *
 * This calculator helps trades companies determine their honest hourly rate
 * by factoring in all expenses, capacity constraints, and profit margins.
 *
 * SEO Optimized for:
 * - Trades companies (plumbing, HVAC, electrical, etc.)
 * - Service-based businesses
 * - Small business owners
 * - Contractors and technicians
 */

import type { Metadata } from "next";
import HonestHourlyRateCalculator from "./calculator-client";

export const revalidate = 3600; // Revalidate every hour

// SEO Metadata for programmatic SEO targeting trades companies
export const metadata: Metadata = {
  title:
    "Free Tradesman Hourly Rate Calculator | Calculate Your Service Business Rate",
  description:
    "Calculate your honest hourly rate for trades businesses. Factor in all expenses, capacity constraints, and profit margins to price your services right. Free calculator for plumbers, HVAC, electricians, and all service trades.",
  keywords: [
    "hourly rate calculator",
    "tradesman calculator",
    "service business pricing",
    "plumber hourly rate",
    "HVAC hourly rate",
    "electrician hourly rate",
    "contractor pricing calculator",
    "service business calculator",
    "trades business pricing",
    "hourly rate for trades",
    "service company pricing",
    "small business hourly rate",
    "trades pricing tool",
    "service rate calculator",
    "business expense calculator",
    "profit margin calculator",
    "break-even calculator",
    "trades business expenses",
    "service business expenses",
    "hourly billing rate",
  ],
  openGraph: {
    title: "Free Tradesman Hourly Rate Calculator | Thorbis",
    description:
      "Calculate your honest hourly rate for trades businesses. Factor in all expenses, capacity constraints, and profit margins.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Tradesman Hourly Rate Calculator",
    description:
      "Calculate your honest hourly rate for trades businesses. Factor in all expenses, capacity constraints, and profit margins.",
  },
  alternates: {
    canonical: "/tools/calculators/hourly-rate",
  },
};

export default function HourlyRateCalculatorPage() {
  return <HonestHourlyRateCalculator />;
}
