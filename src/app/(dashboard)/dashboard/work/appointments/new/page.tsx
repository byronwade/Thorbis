/**
 * New Appointment Page
 *
 * Server Component that fetches data and renders AppointmentForm
 */

import { redirect } from "next/navigation";
import { AppointmentForm } from "@/components/work/appointments/appointment-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login");
  }

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember) {
    redirect("/");
  }

  // Fetch customers
  const { data: customers } = await supabase
    .from("customers")
    .select("id, first_name, last_name, display_name, email, phone")
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, address, city, state")
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch jobs for linking
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, job_number, title, customer_id")
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch team members for assignment
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("id, user_id, first_name, last_name, role")
    .eq("company_id", teamMember.company_id)
    .order("first_name");

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="font-bold text-3xl tracking-tight">
          Schedule New Appointment
        </h1>
        <p className="text-muted-foreground">
          Create a new appointment with scheduling and team assignment
        </p>
      </div>

      <AppointmentForm
        customers={customers || []}
        jobs={jobs || []}
        preselectedCustomerId={
          typeof params.customerId === "string" ? params.customerId : undefined
        }
        preselectedJobId={
          typeof params.jobId === "string" ? params.jobId : undefined
        }
        preselectedPropertyId={
          typeof params.propertyId === "string" ? params.propertyId : undefined
        }
        properties={properties || []}
        teamMembers={teamMembers || []}
      />
    </div>
  );
}
