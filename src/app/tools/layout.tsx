/**
 * Tools Marketing Layout - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static header component
 * - Minimal JavaScript for layout
 */

import { MarketingHeader } from "@/components/hero/marketing-header";
import { ToolsSidebar } from "@/components/tools/tools-sidebar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Marketing Header */}
      <MarketingHeader />

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-5rem)]">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:w-[240px] lg:shrink-0">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-6">
              <ToolsSidebar />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 py-6 lg:pl-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
