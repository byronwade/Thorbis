/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { [id]Data } from "@/components/shop/[id]/[id]-data";
import { [id]Skeleton } from "@/components/shop/[id]/[id]-skeleton";

export default function
[id];
Page();
{
	return (
    <Suspense fallback={<[id]Skeleton />
}
>
      <[id]Data />
    </Suspense>
  )
}
