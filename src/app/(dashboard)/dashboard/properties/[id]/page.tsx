import { Building2, Calendar, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
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
 * Property Detail Page - Server Component
 *
 * Displays comprehensive property information:
 * - Property details (address, type, size, year built)
 * - Associated customer information
 * - Job history for this property
 * - Equipment installed at property
 */

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

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

  // Fetch property with customer info
  const { data: property, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      customers (
        id,
        first_name,
        last_name,
        email,
        phone,
        company_name
      )
    `
    )
    .eq("id", id)
    .eq("company_id", activeCompanyId)
    .single();

  if (error || !property) {
    return notFound();
  }

  // Fetch jobs for this property
  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      `
      id,
      job_number,
      title,
      status,
      priority,
      scheduled_start,
      created_at
    `
    )
    .eq("property_id", id)
    .eq("company_id", activeCompanyId)
    .order("created_at", { ascending: false })
    .limit(10);

  // Transform customer to handle array/single object
  const customer = Array.isArray(property.customers)
    ? property.customers[0]
    : property.customers;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Link className="hover:text-foreground" href="/dashboard/customers">
              Customers
            </Link>
            <span>/</span>
            {customer && (
              <>
                <Link
                  className="hover:text-foreground"
                  href={`/dashboard/customers/${customer.id}`}
                >
                  {customer.first_name} {customer.last_name}
                </Link>
                <span>/</span>
              </>
            )}
            <span>Property</span>
          </div>
          <h1 className="mt-2 font-bold text-3xl tracking-tight">
            {property.name || property.address}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {property.address}
            {property.address2 && `, ${property.address2}`}
            {`, ${property.city}, ${property.state} ${property.zip_code}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/properties/${id}/edit`}>Edit Property</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/work/new?propertyId=${id}`}>
              Create Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <CardTitle>Property Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Type</p>
                <p className="font-medium capitalize">
                  {property.type || "Residential"}
                </p>
              </div>
              {property.square_footage && (
                <div>
                  <p className="text-muted-foreground text-sm">
                    Square Footage
                  </p>
                  <p className="font-medium">
                    {property.square_footage.toLocaleString()} sq ft
                  </p>
                </div>
              )}
              {property.year_built && (
                <div>
                  <p className="text-muted-foreground text-sm">Year Built</p>
                  <p className="font-medium">{property.year_built}</p>
                </div>
              )}
              {property.number_of_units && property.number_of_units > 1 && (
                <div>
                  <p className="text-muted-foreground text-sm">Units</p>
                  <p className="font-medium">{property.number_of_units}</p>
                </div>
              )}
            </div>

            {property.notes && (
              <div>
                <p className="text-muted-foreground text-sm">Notes</p>
                <p className="mt-1 text-sm">{property.notes}</p>
              </div>
            )}

            {property.access_instructions && (
              <div>
                <p className="text-muted-foreground text-sm">
                  Access Instructions
                </p>
                <p className="mt-1 text-sm">{property.access_instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        {customer && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-primary" />
                <CardTitle>Property Owner</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-lg">
                  {customer.first_name} {customer.last_name}
                </p>
                {customer.company_name && (
                  <p className="text-muted-foreground text-sm">
                    {customer.company_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Phone:
                    </span>
                    <a
                      className="text-sm hover:underline"
                      href={`tel:${customer.phone}`}
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Email:
                    </span>
                    <a
                      className="text-sm hover:underline"
                      href={`mailto:${customer.email}`}
                    >
                      {customer.email}
                    </a>
                  </div>
                )}
              </div>

              <Button asChild className="w-full" size="sm" variant="outline">
                <Link href={`/dashboard/customers/${customer.id}`}>
                  View Customer Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <CardTitle>Job History</CardTitle>
              </div>
              <CardDescription>
                Recent jobs performed at this property
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/dashboard/work?propertyId=${id}`}>View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!jobs || jobs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No jobs found for this property
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href={`/dashboard/work/new?propertyId=${id}`}>
                  Create First Job
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <Link
                  className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  href={`/dashboard/work/${job.id}`}
                  key={job.id}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{job.title}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : job.status === "in_progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : job.status === "scheduled"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {job.job_number}
                        {job.scheduled_start && (
                          <>
                            {" "}
                            • Scheduled:{" "}
                            {new Date(job.scheduled_start).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs ${
                          job.priority === "urgent"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : job.priority === "high"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {job.priority}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
