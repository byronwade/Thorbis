"use client";

import { DashboardError } from "@/components/errors/dashboard-error";

export default function ServiceAgreementsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <DashboardError error={error} reset={reset} />;
}
