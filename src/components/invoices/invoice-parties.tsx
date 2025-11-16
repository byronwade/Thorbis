/**
 * Invoice Parties Component
 *
 * Displays business, customer, and property information in a multi-column layout
 */

"use client";

import { Building2, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Invoice = {
  id: string;
  [key: string]: any;
};

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_zip: string | null;
  company_name: string | null;
};

type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  tax_id: string | null;
};

type Property = {
  id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  property_type: string | null;
};

type InvoicePartiesProps = {
  company: Company | null;
  customer: Customer | null;
  property?: Property | null;
  invoice: Invoice;
};

export function InvoiceParties({
  company,
  customer,
  property,
  invoice,
}: InvoicePartiesProps) {
  return (
    <div className="mb-8 space-y-6">
      {/* Business and Customer */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* From (Business) */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <Label className="font-semibold text-base">From</Label>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold">
              {company?.name || "Your Business"}
            </div>
            {company?.email && <div>{company.email}</div>}
            {company?.phone && <div>{company.phone}</div>}
            {company?.address && (
              <div className="text-muted-foreground">
                <div>{company.address}</div>
                {company.city && company.state && (
                  <div>
                    {company.city}, {company.state} {company.zip_code}
                  </div>
                )}
              </div>
            )}
            {company?.tax_id && (
              <div className="mt-2 text-muted-foreground">
                Tax ID: {company.tax_id}
              </div>
            )}
          </div>
        </Card>

        {/* To (Customer) */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <Label className="font-semibold text-base">Bill To</Label>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold">
              {customer?.display_name ||
                `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
                "Customer"}
            </div>
            {customer?.company_name && (
              <div className="text-muted-foreground">
                {customer.company_name}
              </div>
            )}
            {customer?.email && <div>{customer.email}</div>}
            {customer?.phone && <div>{customer.phone}</div>}
            {customer?.billing_address && (
              <div className="text-muted-foreground">
                <div>{customer.billing_address}</div>
                {customer.billing_city && customer.billing_state && (
                  <div>
                    {customer.billing_city}, {customer.billing_state}{" "}
                    {customer.billing_zip}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Property/Job Site Address (if applicable) */}
      {property && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Label className="font-semibold text-base">
              Job Site / Property
            </Label>
          </div>
          <div className="space-y-2 text-sm">
            {property.name && (
              <div className="font-semibold">{property.name}</div>
            )}
            {property.property_type && (
              <div className="text-muted-foreground capitalize">
                {property.property_type}
              </div>
            )}
            {property.address && (
              <div className="text-muted-foreground">
                <div>{property.address}</div>
                {property.city && property.state && (
                  <div>
                    {property.city}, {property.state} {property.zip_code}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
