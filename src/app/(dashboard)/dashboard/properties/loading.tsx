/**
 * Loading State for Properties List
 * Shows skeleton while properties load
 */

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table skeleton */}
      <Card>
        <div className="space-y-4 p-6">
          {/* Table header */}
          <div className="flex gap-4 border-b pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton className="h-4 flex-1" key={i} />
            ))}
          </div>

          {/* Table rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div className="flex gap-4 py-2" key={i}>
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton className="h-6 flex-1" key={j} />
              ))}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
