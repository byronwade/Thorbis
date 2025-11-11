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
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
