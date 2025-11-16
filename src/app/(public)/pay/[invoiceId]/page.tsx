/**
 * Public Invoice Payment Page
 *
 * Customer-facing page for paying invoices via secure payment link
 *
 * Features:
 * - Token validation
 * - Invoice details display
 * - Payment processing via company's configured processor
 * - Payment confirmation
 */

import { format } from "date-fns";
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Mail,
  Phone,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { InvoicePaymentForm } from "@/components/payment/invoice-payment-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { validatePaymentToken } from "@/lib/payments/payment-tokens";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pay Invoice - Thorbis",
  description: "Securely pay your invoice online",
};

type PageProps = {
  params: Promise<{
    invoiceId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function InvoicePaymentPage({
  params,
  searchParams,
}: PageProps) {
  const { invoiceId } = await params;
  const { token } = await searchParams;

  // Validate token
  if (!token) {
    return (
      <div className="container mx-auto max-w-2xl py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Invalid Payment Link
            </CardTitle>
            <CardDescription>
              No payment token was provided. Please use the link from your
              email.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Get client IP for security tracking
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const clientIp = forwardedFor
    ? forwardedFor.split(",")[0]
    : headersList.get("x-real-ip") || undefined;

  // Validate the payment token
  const validation = await validatePaymentToken(token, clientIp);

  if (!(validation.isValid && validation.invoiceId)) {
    return (
      <div className="container mx-auto max-w-2xl py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Invalid Payment Link
            </CardTitle>
            <CardDescription>{validation.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              This payment link may have expired or already been used. Please
              contact the company for a new payment link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verify invoice ID matches token
  if (validation.invoiceId !== invoiceId) {
    return notFound();
  }

  // Fetch invoice details
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      customer:customers!customer_id(
        id,
        first_name,
        last_name,
        display_name,
        email,
        phone,
        company_name
      ),
      company:companies!company_id(
        id,
        name,
        email,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code
      )
    `
    )
    .eq("id", invoiceId)
    .single();

  if (error || !invoice) {
    return notFound();
  }

  // Check if invoice is already paid
  if (invoice.status === "paid") {
    return (
      <div className="container mx-auto max-w-2xl py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              Invoice Already Paid
            </CardTitle>
            <CardDescription>
              This invoice has already been paid. Thank you for your payment!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Invoice Number:
                </span>
                <span className="font-medium text-sm">
                  {invoice.invoice_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Amount:</span>
                <span className="font-medium text-sm">
                  {formatCurrency(invoice.total_amount / 100)}
                </span>
              </div>
              {invoice.paid_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Paid On:
                  </span>
                  <span className="font-medium text-sm">
                    {format(new Date(invoice.paid_at), "MMM dd, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normalize customer data
  const customer = Array.isArray(invoice.customer)
    ? invoice.customer[0]
    : invoice.customer;
  const company = Array.isArray(invoice.company)
    ? invoice.company[0]
    : invoice.company;

  if (!(customer && company)) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl space-y-6 px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-bold text-3xl">Pay Invoice</h1>
          <p className="mt-2 text-muted-foreground">
            Securely pay your invoice with {company.name}
          </p>
        </div>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoice {invoice.invoice_number}</CardTitle>
                <CardDescription>
                  Issued {format(new Date(invoice.created_at), "MMMM dd, yyyy")}
                </CardDescription>
              </div>
              <Badge
                className="text-sm"
                variant={
                  invoice.status === "overdue" ? "destructive" : "secondary"
                }
              >
                {invoice.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Info */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Building2 className="h-4 w-4" />
                From
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{company.name}</p>
                {company.address_line1 && (
                  <p className="text-muted-foreground">
                    {company.address_line1}
                  </p>
                )}
                {company.address_line2 && (
                  <p className="text-muted-foreground">
                    {company.address_line2}
                  </p>
                )}
                {company.city && (
                  <p className="text-muted-foreground">
                    {company.city}, {company.state} {company.postal_code}
                  </p>
                )}
                {company.email && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {company.email}
                  </p>
                )}
                {company.phone && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {company.phone}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <User className="h-4 w-4" />
                Bill To
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {customer.display_name ||
                    `${customer.first_name} ${customer.last_name}`}
                </p>
                {customer.company_name && (
                  <p className="text-muted-foreground">
                    {customer.company_name}
                  </p>
                )}
                {customer.email && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </p>
                )}
                {customer.phone && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Invoice Details */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  Invoice Number
                </span>
                <span className="font-medium">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due Date
                </span>
                <span className="font-medium">
                  {invoice.due_date
                    ? format(new Date(invoice.due_date), "MMM dd, yyyy")
                    : "Upon receipt"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  Amount Due
                </span>
                <span className="font-bold text-2xl">
                  {formatCurrency(invoice.total_amount / 100)}
                </span>
              </div>
            </div>

            {invoice.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 font-semibold text-sm">Notes</h3>
                  <p className="text-muted-foreground text-sm">
                    {invoice.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Form */}
        <InvoicePaymentForm
          company={company}
          customer={customer}
          invoice={invoice}
          token={token}
        />

        {/* Security Notice */}
        <div className="text-center text-muted-foreground text-xs">
          <p>
            Your payment is secure and encrypted. By submitting payment, you
            agree to pay the amount shown above.
          </p>
        </div>
      </div>
    </div>
  );
}
