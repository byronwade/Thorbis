import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/work/job-form";
import { createClient } from "@/lib/supabase/server";

/**
 * Edit Job Page - Server Component
 *
 * Performance optimizations:
 * - Server Component handles data fetching
 * - Form is client component for interactivity
 * - Pre-populated with existing job data
 */

type EditJobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id: jobId } = await params;

  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please sign in to edit this job</p>
      </div>
    );
  }

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember?.company_id) {
    // User hasn't completed onboarding or doesn't have an active company membership
    // Redirect to onboarding for better UX
    redirect("/dashboard/welcome");
  }

  // Fetch the job to edit
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("company_id", teamMember.company_id)
    .is("deleted_at", null)
    .single();

  if (jobError || !job) {
    return notFound();
  }

  // Fetch customers for dropdown
  const { data: customers } = await supabase
    .from("customers")
    .select(
      "id, first_name, last_name, email, phone, company_name, address, city, state, zip_code"
    )
    .eq("company_id", teamMember.company_id)
    .is("deleted_at", null)
    .order("first_name", { ascending: true });

  // Fetch properties for dropdown
  const { data: propertiesRaw } = await supabase
    .from("properties")
    .select(`
      id,
      name,
      address,
      city,
      state,
      customer_id,
      customers!customer_id(first_name, last_name)
    `)
    .eq("company_id", teamMember.company_id)
    .order("address", { ascending: true });

  // Transform properties to match expected type
  const properties = propertiesRaw?.map((property: any) => ({
    ...property,
    customers:
      Array.isArray(property.customers) && property.customers.length > 0
        ? property.customers[0]
        : null,
  }));

  // Fetch team members for assignment dropdown
  const { data: teamMembersRaw } = await supabase
    .from("team_members")
    .select(`
      user_id,
      users!user_id(id, first_name, last_name, email)
    `)
    .eq("company_id", teamMember.company_id)
    .eq("status", "active");

  // Transform team members to match expected type
  const teamMembers = teamMembersRaw?.map((member: any) => ({
    ...member,
    users:
      Array.isArray(member.users) && member.users.length > 0
        ? member.users[0]
        : null,
  }));

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-6">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Button asChild className="mb-4" size="sm" variant="ghost">
              <Link href={`/dashboard/work/${jobId}`}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Job
              </Link>
            </Button>
            <h1 className="font-bold text-3xl tracking-tight">Edit Job</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Update job details for {job.job_number}
            </p>
          </div>

          {/* Form */}
          <JobForm
            customers={customers || []}
            existingJob={job}
            mode="edit"
            preselectedCustomerId={job.customer_id || undefined}
            preselectedPropertyId={job.property_id}
            properties={properties || []}
            teamMembers={teamMembers || []}
          />
        </div>
      </div>
    </div>
  );
}
