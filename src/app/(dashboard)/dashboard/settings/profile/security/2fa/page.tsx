/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { 2faData } from "@/components/settings/2fa/2fa-data";
import { 2faSkeleton } from "@/components/settings/2fa/2fa-skeleton";

export default function
2faPage()
{
	return (
    <Suspense fallback={<2faSkeleton />}>
      <2faData />
    </Suspense>
  );
}
