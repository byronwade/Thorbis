/**
 * Job Customer Section
 * Displays customer information with link to customer details
 */

"use client";

import { Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { updateEntityTags } from "@/actions/entity-tags";

type JobCustomerProps = {
  customer: any;
};

export function JobCustomer({ customer }: JobCustomerProps) {
  const customerName =
    customer.display_name ||
    `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
    "Unknown Customer";

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage
            alt={customerName}
            src={customer.avatar_url}
          />
          <AvatarFallback>
            {customer.first_name?.[0]}
            {customer.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link
            className="font-medium text-lg text-foreground hover:text-primary"
            href={`/dashboard/customers/${customer.id}`}
          >
            {customerName}
          </Link>
          {customer.company_name && (
            <p className="text-muted-foreground text-sm">
              {customer.company_name}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Customer Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Tags:
        </span>
        <EntityTags
          entityId={customer.id}
          entityType="customer"
          onUpdateTags={(id, tags) => updateEntityTags("customer", id, tags)}
          tags={customer.tags || []}
        />
      </div>

      {/* Contact Information */}
      <div className="grid gap-4 md:grid-cols-2">
        {customer.email && (
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <Label>Email</Label>
              <a
                className="text-sm text-primary hover:underline"
                href={`mailto:${customer.email}`}
              >
                {customer.email}
              </a>
            </div>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center gap-3">
            <Phone className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <Label>Phone</Label>
              <a
                className="text-sm text-primary hover:underline"
                href={`tel:${customer.phone}`}
              >
                {customer.phone}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {customer.customer_type && (
        <div>
          <Label>Customer Type</Label>
          <p className="mt-2 text-sm capitalize">{customer.customer_type}</p>
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Button asChild className="flex-1" size="sm" variant="outline">
          <Link href={`/dashboard/customers/${customer.id}`}>
            View Customer Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

