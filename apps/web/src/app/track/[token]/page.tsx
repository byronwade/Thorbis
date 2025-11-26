/**
 * Customer Tracking Page
 *
 * Public page for customers to track their technician's arrival.
 * Shows real-time ETA, technician info, and optional location.
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTrackingLinkByToken } from "@/lib/customer-tracking/generate-tracking-link";
import { TrackingPageClient } from "./tracking-page-client";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: Props) {
	const { token } = await params;
	const trackingData = await getTrackingLinkByToken(token);

	if (!trackingData) {
		return {
			title: "Tracking Link Not Found",
		};
	}

	return {
		title: `Track Your Appointment - ${trackingData.companyName}`,
		description: `Track ${trackingData.technicianName}'s arrival for your appointment on ${trackingData.appointmentDate}`,
		robots: "noindex, nofollow", // Don't index tracking pages
	};
}

export default async function TrackingPage({ params }: Props) {
	const { token } = await params;
	const trackingData = await getTrackingLinkByToken(token);

	if (!trackingData) {
		notFound();
	}

	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<div className="animate-pulse text-muted-foreground">
						Loading tracking information...
					</div>
				</div>
			}
		>
			<TrackingPageClient initialData={trackingData} token={token} />
		</Suspense>
	);
}
