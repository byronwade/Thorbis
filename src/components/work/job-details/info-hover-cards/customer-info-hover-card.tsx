/**
 * Customer Info Hover Card
 * Shows customer details on hover with quick copy functionality
 */

"use client";

import { Check, Copy, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type CustomerInfoHoverCardProps = {
  customer: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    status?: string | null;
    customer_type?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip_code?: string | null;
  };
};

export function CustomerInfoHoverCard({
  customer,
}: CustomerInfoHoverCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const displayName =
    customer.display_name ||
    `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
    "Unknown Customer";

  const fullAddress = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
          href={`/dashboard/customers/${customer.id}`}
        >
          <User className="size-4" />
          {displayName}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80" side="bottom">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm">{displayName}</h4>
              {customer.company_name && (
                <p className="text-muted-foreground text-xs">
                  {customer.company_name}
                </p>
              )}
            </div>
            {customer.status && (
              <Badge className="capitalize" variant="outline">
                {customer.status}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-2">
            {customer.email && (
              <div className="group flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <a
                    className="truncate text-sm hover:text-primary hover:underline"
                    href={`mailto:${customer.email}`}
                  >
                    {customer.email}
                  </a>
                </div>
                <Button
                  className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(customer.email!, "email");
                  }}
                  size="icon"
                  variant="ghost"
                >
                  {copiedField === "email" ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            )}

            {customer.phone && (
              <div className="group flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                  <a
                    className="text-sm hover:text-primary hover:underline"
                    href={`tel:${customer.phone}`}
                  >
                    {customer.phone}
                  </a>
                </div>
                <Button
                  className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(customer.phone!, "phone");
                  }}
                  size="icon"
                  variant="ghost"
                >
                  {copiedField === "phone" ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            )}

            {fullAddress && (
              <div className="group flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <p className="text-sm">{fullAddress}</p>
                </div>
                <Button
                  className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(fullAddress, "address");
                  }}
                  size="icon"
                  variant="ghost"
                >
                  {copiedField === "address" ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {customer.customer_type && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <Badge className="capitalize" variant="secondary">
                  {customer.customer_type}
                </Badge>
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
