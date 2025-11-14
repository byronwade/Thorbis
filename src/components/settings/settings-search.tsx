"use client";

/**
 * Settings Search - Client Component Island
 *
 * Small client component for search functionality.
 * Extracted from settings page to allow main page to be server component.
 *
 * Performance:
 * - Only ~2KB of client-side JavaScript
 * - Uses URL params for search state (shareable URLs)
 * - Main page can be server component
 */

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SettingsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams?.get("q") || "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/dashboard/settings?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
      <Input
        className="pl-9"
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search settings..."
        type="search"
        value={currentSearch}
      />
    </div>
  );
}
