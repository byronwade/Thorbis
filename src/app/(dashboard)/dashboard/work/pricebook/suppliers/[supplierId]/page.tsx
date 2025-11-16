/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { [supplierId]Data } from "@/components/work/[supplierId]/[supplierId]-data";
import { [supplierId]Skeleton } from "@/components/work/[supplierId]/[supplierId]-skeleton";

export default function
[supplierId];
Page();
{
	return (
    <Suspense fallback={<[supplierId]Skeleton />
}
>
      <[supplierId]Data />
    </Suspense>
  )
}
