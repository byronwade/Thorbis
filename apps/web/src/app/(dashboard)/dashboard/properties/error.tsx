"use client";

import { DashboardError } from "@/components/dashboard/dashboard-error";

export default function PropertiesError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <DashboardError error={error} reset={reset} />;
}
