/**
 * Edit Customer Page - Server Component
 *
 * Performance optimizations:
 * - Server Component with Server Actions for form handling
 * - Form validation handled server-side with Zod
 * - Redirects handled by Next.js navigation
 * - Reuses smart input components from create page
 */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateCustomer } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Edit Customer Page - Server Component
 *
 * Fetches customer data and renders edit form
 */
export default async function EditCustomerPage({ params }: PageProps) {
  const { id: customerId } = await params;

  // Fetch customer data
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .is("deleted_at", null)
    .single();

  if (!customer) {
    notFound();
  }

  // Server action for form submission
  async function handleSubmit(formData: FormData) {
    "use server";

    const result = await updateCustomer(customerId, formData);

    if (result.success) {
      redirect(`/dashboard/customers/${customerId}`);
    } else {
      // TODO: Add error handling with toast notifications
      console.error("Failed to update customer:", result.error);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button asChild size="icon" variant="ghost">
          <Link href={`/dashboard/customers/${customerId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="font-bold text-4xl tracking-tight">Edit Customer</h1>
          <p className="text-lg text-muted-foreground">
            Update customer information and preferences
          </p>
        </div>
      </div>

      <form action={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <h2 className="font-semibold text-xl">Basic Information</h2>
              <p className="text-muted-foreground text-sm">
                Customer type and company details
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Customer Type</Label>
                  <Select defaultValue={customer.type} name="type" required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    defaultValue={customer.company_name || ""}
                    id="companyName"
                    name="companyName"
                    placeholder="ABC Corporation"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <h2 className="font-semibold text-xl">Contact Information</h2>
              <p className="text-muted-foreground text-sm">
                Primary contact details
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    defaultValue={customer.first_name}
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    defaultValue={customer.last_name}
                    id="lastName"
                    name="lastName"
                    placeholder="Smith"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    defaultValue={customer.email}
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    defaultValue={customer.phone}
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    required
                    type="tel"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input
                    defaultValue={customer.secondary_phone || ""}
                    id="secondaryPhone"
                    name="secondaryPhone"
                    placeholder="(555) 987-6543"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod">
                    Preferred Contact Method
                  </Label>
                  <Select
                    defaultValue={customer.preferred_contact_method || "email"}
                    name="preferredContactMethod"
                  >
                    <SelectTrigger id="preferredContactMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <h2 className="font-semibold text-xl">Primary Address</h2>
              <p className="text-muted-foreground text-sm">
                Main service location
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  defaultValue={customer.address || ""}
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Apartment, suite, etc.</Label>
                <Input
                  defaultValue={customer.address2 || ""}
                  id="address2"
                  name="address2"
                  placeholder="Apt 4B"
                  type="text"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    defaultValue={customer.city || ""}
                    id="city"
                    name="city"
                    placeholder="San Francisco"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    defaultValue={customer.state || ""}
                    id="state"
                    name="state"
                    placeholder="CA"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    defaultValue={customer.zip_code || ""}
                    id="zipCode"
                    name="zipCode"
                    placeholder="94103"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <h2 className="font-semibold text-xl">Billing Information</h2>
              <p className="text-muted-foreground text-sm">
                Payment terms and billing preferences
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email (Optional)</Label>
                  <Input
                    defaultValue={customer.billing_email || ""}
                    id="billingEmail"
                    name="billingEmail"
                    placeholder="billing@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    defaultValue={customer.payment_terms || "due_on_receipt"}
                    name="paymentTerms"
                  >
                    <SelectTrigger id="paymentTerms">
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due_on_receipt">
                        Due on Receipt
                      </SelectItem>
                      <SelectItem value="net_15">Net 15</SelectItem>
                      <SelectItem value="net_30">Net 30</SelectItem>
                      <SelectItem value="net_60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (in dollars)</Label>
                  <Input
                    defaultValue={(customer.credit_limit || 0) / 100}
                    id="creditLimit"
                    min="0"
                    name="creditLimit"
                    placeholder="5000"
                    type="number"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked={customer.tax_exempt}
                    id="taxExempt"
                    name="taxExempt"
                    type="checkbox"
                  />
                  <Label className="font-normal" htmlFor="taxExempt">
                    Tax Exempt
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxExemptNumber">
                  Tax Exempt Number (if applicable)
                </Label>
                <Input
                  defaultValue={customer.tax_exempt_number || ""}
                  id="taxExemptNumber"
                  name="taxExemptNumber"
                  placeholder="EX-12345"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <h2 className="font-semibold text-xl">Additional Information</h2>
              <p className="text-muted-foreground text-sm">
                Lead source, tags, and notes
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select
                    defaultValue={customer.source || undefined}
                    name="source"
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="yelp">Yelp</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    defaultValue={customer.tags?.join(", ") || ""}
                    id="tags"
                    name="tags"
                    placeholder="VIP, commercial, recurring"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  defaultValue={customer.notes || ""}
                  id="notes"
                  name="notes"
                  placeholder="Any notes about this customer..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalNotes">
                  Internal Notes (not visible to customer)
                </Label>
                <Textarea
                  defaultValue={customer.internal_notes || ""}
                  id="internalNotes"
                  name="internalNotes"
                  placeholder="Internal notes for team members..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Form Actions - Sticky Bottom Bar */}
          <div className="sticky bottom-0 z-10 rounded-xl border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Ready to save these changes?
              </p>
              <div className="flex gap-3">
                <Button asChild type="button" variant="outline">
                  <Link href={`/dashboard/customers/${customerId}`}>
                    Cancel
                  </Link>
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
