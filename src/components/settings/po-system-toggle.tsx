"use client";

/**
 * PO System Toggle - Client Component Island
 *
 * Small client component for Purchase Order system toggle.
 * Extracted from settings page to allow main page to be server component.
 *
 * Performance:
 * - Only ~1KB of client-side JavaScript
 * - Main page can be server component
 */

import { Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function POSystemToggle() {
  const [poSystemEnabled, setPoSystemEnabled] = useState(false);

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Package className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Purchase Order System</CardTitle>
              <CardDescription className="text-sm">
                Track inventory, materials, and vendor orders
              </CardDescription>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Switch
              checked={poSystemEnabled}
              onCheckedChange={setPoSystemEnabled}
            />
          </div>
        </div>
      </CardHeader>
      {poSystemEnabled && (
        <CardContent className="pt-0">
          <Button asChild className="w-full sm:w-auto" variant="default">
            <Link href="/dashboard/settings/purchase-orders">
              Configure PO Settings
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
