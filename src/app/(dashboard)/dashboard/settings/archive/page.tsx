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

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArchiveDataTable } from "@/components/archive/archive-data-table";
import { ArchiveStats } from "@/components/archive/archive-stats";
import { getArchiveStats } from "@/actions/archive";

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
    return notFound();
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
        entityFilter={params.entity || "all"}
        dateRange={params.range || "30days"}
        searchQuery={params.search}
      />
    </div>
  );
}
