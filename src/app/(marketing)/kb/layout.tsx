/**
 * Knowledge Base Layout - Server Component
 *
 * Wraps all KB pages with consistent layout
 * Uses marketing layout for public access
 */

import { MarketingHeader } from "@/components/hero/marketing-header";
import { Footer } from "@/components/layout/footer";

export default function KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
