import { type ReactNode, Suspense } from "react";
import { CommunicationSectionLayout } from "@/components/layout/communication-section-layout";

/**
 * Communication Section Layout - Server Component Wrapper
 *
 * This layout applies to all routes under /dashboard/communication/*
 * It delegates to CommunicationSectionLayout (client component) which
 * conditionally applies the communication layout based on the route.
 *
 * Mobile routes (/mobile) bypass the SectionLayout to avoid rendering
 * the desktop sidebar.
 */
export default function CommunicationLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<CommunicationSectionLayout>
			<Suspense fallback={<div className="p-4">Loading...</div>}>
				{children}
			</Suspense>
		</CommunicationSectionLayout>
	);
}
