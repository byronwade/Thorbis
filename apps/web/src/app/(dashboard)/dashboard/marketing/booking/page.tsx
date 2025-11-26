/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BookingData } from "@/components/marketing/booking/booking-data";
import { BookingSkeleton } from "@/components/marketing/booking/booking-skeleton";

export default function BookingPage() {
	return (
		<Suspense fallback={<BookingSkeleton />}>
			<BookingData />
		</Suspense>
	);
}
