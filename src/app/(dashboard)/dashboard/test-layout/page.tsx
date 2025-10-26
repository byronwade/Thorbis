"use client";

export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestLayoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Default Layout Test
        </h1>
        <p className="text-muted-foreground">
          This page uses the default 7xl max-width layout with standard padding
          and gap.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Layout Configuration</CardTitle>
          <CardDescription>
            This page demonstrates the default layout behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Active Settings</h3>
            <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
              <li>• Max Width: 7xl (1280px)</li>
              <li>• Padding: md (16px)</li>
              <li>• Gap: md (16px)</li>
              <li>• Toolbar: Visible</li>
            </ul>
          </div>

          <div className="rounded-lg border-2 border-primary/20 border-dashed bg-primary/5 p-4">
            <p className="font-medium text-sm">Content Container</p>
            <p className="mt-1 text-muted-foreground text-xs">
              This content should be centered and constrained to 1280px max
              width on large screens. Try resizing your browser to see the
              responsive behavior.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Card 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Sample card content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Sample card content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Card 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Sample card content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
