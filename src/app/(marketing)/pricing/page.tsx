import { PricingCalculator } from "@/components/pricing/pricing-calculator";

export const metadata = {
  title: "Pricing - Thorbis Field Service Management",
  description:
    "$100/month base + pay-as-you-go. No per-user fees. Calculate your exact monthly cost with our interactive pricing calculator.",
};

export default function PricingPage() {
  return <PricingCalculator />;
}
