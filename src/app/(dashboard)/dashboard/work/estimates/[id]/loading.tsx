/**
 * Estimate Details Loading State
 *
 * Skeleton loader for estimate details page
 * Matches job details loading pattern with stats bar + sections
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      {/* Stats Bar Skeleton */}
      <div className="border-b bg-background">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div className="space-y-2" key={i}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="flex-1 space-y-4 overflow-auto p-6">
        {/* Estimate Header */}
        <div className="space-y-3 rounded-lg border bg-card p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Collapsible Sections */}
        {[...Array(6)].map((_, i) => (
          <div className="space-y-3 rounded-lg border bg-card" key={i}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="size-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
