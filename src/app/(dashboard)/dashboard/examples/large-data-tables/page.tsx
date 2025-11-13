/**
 * Large Data Table Examples
 *
 * This page demonstrates three optimization strategies for handling large datasets:
 *
 * 1. OPTIMIZED CLIENT-SIDE (1,000 - 5,000 rows)
 *    - Uses React.memo, useMemo, useCallback
 *    - Client-side pagination
 *    - All data loaded at once
 *
 * 2. VIRTUALIZED CLIENT-SIDE (5,000 - 50,000 rows)
 *    - Uses @tanstack/react-virtual
 *    - Renders only visible rows
 *    - Smooth 60fps scrolling
 *
 * 3. SERVER-SIDE PAGINATION (50,000+ rows)
 *    - Fetches only current page from server
 *    - Database handles sorting/filtering
 *    - Unlimited scalability
 */

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizedExample } from "./optimized-example";
import { ServerSideExample } from "./server-side-example";
import { VirtualizedExample } from "./virtualized-example";

export default function LargeDataTablesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Large Data Table Examples</h1>
        <p className="text-muted-foreground">
          Three optimization strategies for handling datasets from 1,000 to
          100,000+ rows
        </p>
      </div>

      <Tabs className="w-full" defaultValue="optimized">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimized">
            Optimized
            <span className="ml-2 text-muted-foreground text-xs">
              (1K-5K rows)
            </span>
          </TabsTrigger>
          <TabsTrigger value="virtualized">
            Virtualized
            <span className="ml-2 text-muted-foreground text-xs">
              (5K-50K rows)
            </span>
          </TabsTrigger>
          <TabsTrigger value="server-side">
            Server-Side
            <span className="ml-2 text-muted-foreground text-xs">
              (50K+ rows)
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6" value="optimized">
          <Suspense fallback={<div>Loading...</div>}>
            <OptimizedExample />
          </Suspense>
        </TabsContent>

        <TabsContent className="mt-6" value="virtualized">
          <Suspense fallback={<div>Loading...</div>}>
            <VirtualizedExample />
          </Suspense>
        </TabsContent>

        <TabsContent className="mt-6" value="server-side">
          <Suspense fallback={<div>Loading...</div>}>
            <ServerSideExample />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
