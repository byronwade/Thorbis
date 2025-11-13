import { Building2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getActiveCompanyId,
  isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Properties List Page - Server Component
 *
 * Displays all properties for the company
 */

export default async function PropertiesPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Check if active company has completed onboarding (has payment)
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    // User hasn't completed onboarding or doesn't have an active company with payment
    // Redirect to onboarding for better UX
    redirect("/dashboard/welcome");
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    // Should not happen if onboarding is complete, but handle gracefully
    redirect("/dashboard/welcome");
  }

  // Fetch all properties
  // Only show non-archived properties (archived_at is null)
  const { data: properties } = await supabase
    .from("properties")
    .select(
      `
      *,
      customers (
        id,
        first_name,
        last_name,
        company_name
      )
    `
    )
    .eq("company_id", activeCompanyId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Properties</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all service locations
          </p>
        </div>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
          <CardDescription>
            {properties?.length || 0} properties in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!properties || properties.length === 0 ? (
            <div className="py-8 text-center">
              <Building2 className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No properties found</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Properties are created automatically when you add customers or
                create jobs
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {properties.map((property) => {
                const customer = Array.isArray(property.customers)
                  ? property.customers[0]
                  : property.customers;

                return (
                  <Link
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    href={`/dashboard/work/properties/${property.id}`}
                    key={property.id}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <p className="font-medium">
                            {property.name || property.address}
                          </p>
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-medium text-foreground text-xs capitalize dark:bg-foreground dark:text-muted-foreground">
                            {property.type || "residential"}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground text-sm">
                          {property.address}
                          {property.address2 && `, ${property.address2}`}
                          {`, ${property.city}, ${property.state} ${property.zip_code}`}
                        </p>
                        {customer && (
                          <p className="mt-1 text-muted-foreground text-xs">
                            Owner: {customer.first_name} {customer.last_name}
                            {customer.company_name &&
                              ` (${customer.company_name})`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 text-right text-sm">
                        {property.square_footage && (
                          <span className="text-muted-foreground">
                            {property.square_footage.toLocaleString()} sq ft
                          </span>
                        )}
                        {property.year_built && (
                          <span className="text-muted-foreground">
                            Built {property.year_built}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
