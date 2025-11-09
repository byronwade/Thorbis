/**
 * Settings > Subscriptions Page - Server Component
 *
 * Displays subscription status for all organizations the user belongs to
 * Allows managing billing, canceling, and reactivating subscriptions
 *
 * Performance optimizations:
 * - Server Component for initial data fetching
 * - Client Components for interactive billing actions
 * - Efficient query with joins to minimize database calls
 */

import { AlertCircle, CreditCard, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubscriptionCard } from "@/components/billing/subscription-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Revalidate every minute

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="space-y-6 py-8">
        <h1 className="font-bold text-4xl tracking-tight">Subscriptions</h1>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Database Not Configured</AlertTitle>
          <AlertDescription>
            Unable to connect to database. Please check your environment
            configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get all companies where user is a member
  const { data: memberships, error } = await supabase
    .from("team_members")
    .select(
      `
      company_id,
      companies!inner(
        id,
        name,
        stripe_subscription_id,
        stripe_subscription_status,
        subscription_current_period_start,
        subscription_current_period_end,
        subscription_cancel_at_period_end,
        trial_ends_at
      )
    `
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching memberships:", error);
    return (
      <div className="space-y-6 py-8">
        <h1 className="font-bold text-4xl tracking-tight">Subscriptions</h1>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error Loading Subscriptions</AlertTitle>
          <AlertDescription>
            Failed to load your subscription data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const companies = memberships?.map((m: any) => m.companies) || [];
  const activeSubscriptions = companies.filter(
    (c: any) =>
      c.stripe_subscription_status === "active" ||
      c.stripe_subscription_status === "trialing"
  );
  const inactiveCompanies = companies.filter(
    (c: any) =>
      !c.stripe_subscription_status ||
      c.stripe_subscription_status === "canceled"
  );

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-bold text-4xl tracking-tight">Subscriptions</h1>
        <p className="text-lg text-muted-foreground">
          Manage billing for all your organizations
        </p>
      </div>

      {/* Multi-Org Pricing Notice */}
      {companies.length > 1 && (
        <Alert>
          <CreditCard className="size-4" />
          <AlertTitle>Multi-Organization Billing</AlertTitle>
          <AlertDescription>
            Your first organization is included in the base plan. Each
            additional organization adds <strong>$100/month</strong> to your
            subscription.
          </AlertDescription>
        </Alert>
      )}

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-2xl tracking-tight">
            Active Subscriptions ({activeSubscriptions.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {activeSubscriptions.map((company: any) => (
              <SubscriptionCard
                cancelAtPeriodEnd={company.subscription_cancel_at_period_end}
                companyId={company.id}
                companyName={company.name}
                currentPeriodEnd={company.subscription_current_period_end}
                currentPeriodStart={company.subscription_current_period_start}
                key={company.id}
                status={company.stripe_subscription_status}
                subscriptionId={company.stripe_subscription_id}
                trialEndsAt={company.trial_ends_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* Organizations Without Subscriptions */}
      {inactiveCompanies.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-2xl tracking-tight">
            Organizations Needing Billing Setup ({inactiveCompanies.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {inactiveCompanies.map((company: any) => (
              <SubscriptionCard
                cancelAtPeriodEnd={company.subscription_cancel_at_period_end}
                companyId={company.id}
                companyName={company.name}
                currentPeriodEnd={company.subscription_current_period_end}
                currentPeriodStart={company.subscription_current_period_start}
                key={company.id}
                status={company.stripe_subscription_status}
                subscriptionId={company.stripe_subscription_id}
                trialEndsAt={company.trial_ends_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Organizations */}
      {companies.length === 0 && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>No Organizations Found</AlertTitle>
          <AlertDescription>
            You don't belong to any organizations yet. Create one to get
            started.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Organization Button */}
      <div className="flex justify-center pt-4">
        <Button asChild size="lg">
          <Link href="/dashboard/welcome">
            <Plus className="mr-2 size-5" />
            Add New Organization
          </Link>
        </Button>
      </div>

      {/* Billing Information */}
      <div className="rounded-lg border bg-muted/50 p-6">
        <h3 className="mb-4 font-semibold text-lg">Billing Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <p>
              <strong>Base Plan:</strong> Includes your first organization with
              all features
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <p>
              <strong>Additional Organizations:</strong> $100/month per
              organization
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <p>
              <strong>Billing Cycle:</strong> Monthly, charged automatically on
              the 1st
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <p>
              <strong>Cancellation:</strong> Cancel anytime. Access continues
              until the end of the billing period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
