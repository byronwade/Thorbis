"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TestFullWidthPage() {
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: false,
  });

  return (
    <div className="flex h-full flex-col">
      {/* Custom header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <h1 className="font-semibold text-lg">Full Width Layout Test</h1>
          <div className="ml-auto text-muted-foreground text-sm">
            No padding • No max-width • No toolbar
          </div>
        </div>
      </div>

      {/* Full-width content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-64 border-r bg-muted/10 p-4">
          <h2 className="mb-4 font-semibold text-sm">Layout Config</h2>
          <ul className="space-y-2 text-muted-foreground text-xs">
            <li>✓ Max Width: full</li>
            <li>✓ Padding: none</li>
            <li>✓ Gap: none</li>
            <li>✓ Toolbar: hidden</li>
          </ul>
        </div>

        {/* Main content */}
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-2xl space-y-4 p-8 text-center">
            <h2 className="font-bold text-4xl">Full Width Layout</h2>
            <p className="text-lg text-muted-foreground">
              This page uses the full viewport width with no container
              constraints. Perfect for dashboards, communication tools, and
              data-heavy interfaces.
            </p>
            <div className="rounded-lg border bg-background p-6 text-left">
              <h3 className="mb-2 font-semibold">Use Cases</h3>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li>• Email and messaging interfaces</li>
                <li>• Analytics dashboards</li>
                <li>• Data tables and grids</li>
                <li>• Kanban boards</li>
                <li>• Calendar views</li>
                <li>• Split-pane applications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-64 border-l bg-muted/10 p-4">
          <h2 className="mb-4 font-semibold text-sm">Behavior</h2>
          <p className="text-muted-foreground text-xs">
            The content takes up 100% of the available width. No padding or gap
            is applied by the layout, allowing the page to manage its own
            spacing.
          </p>
        </div>
      </div>
    </div>
  );
}
