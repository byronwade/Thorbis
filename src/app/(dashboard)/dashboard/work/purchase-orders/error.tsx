"use client";

import { DashboardError } from "@/components/errors/dashboard-error";

export default function PurchaseOrdersError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <DashboardError error={error} reset={reset} />;
}
