import type { ReactNode } from "react";
import { DynamicCommunicationLayout } from "./dynamic-layout";

/**
 * Communication Section Layout - Server Component
 *
 * This layout applies to all routes under /dashboard/communication/*
 * Uses the unified layout configuration system via a client wrapper
 * to ensure dynamic config loading based on the current pathname.
 */
export default function CommunicationLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <DynamicCommunicationLayout>{children}</DynamicCommunicationLayout>;
}
