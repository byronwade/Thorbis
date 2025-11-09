/**
 * Archive Page - Server Component
 *
 * Displays all archived items across all entity types.
 * Users can restore items within 90 days or permanently delete after that period.
 *
 * Features:
 * - Filter by entity type (tabs)
 * - Search across all archived items
 * - Date range filters
 * - Bulk restore
 * - Shows countdown to permanent deletion
 */

import { notFound, redirect } from "next/navigation";
import { getArchiveStats } from "@/actions/archive";
import { ArchiveDataTable } from "@/components/archive/archive-data-table";
import { ArchiveStats } from "@/components/archive/archive-stats";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Archive & Deleted Items - Settings",
    description: "View and restore archived items from the past 90 days",
  };
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{
    entity?: string;
    range?: string;
    search?: string;
  }>;
}) {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
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

  // Fetch archive statistics
  const statsResult = await getArchiveStats();
  const stats = statsResult.success ? statsResult.data : null;

  const params = await searchParams;

  return (
    <div className="space-y-6">
      {/* Archive Stats */}
      {stats && <ArchiveStats stats={stats} />}

      {/* Archive Data Table */}
      <ArchiveDataTable
        dateRange={params.range || "30days"}
        entityFilter={params.entity || "all"}
        searchQuery={params.search}
      />
    </div>
  );
}
