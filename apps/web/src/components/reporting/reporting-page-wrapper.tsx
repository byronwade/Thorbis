"use client";

/**
 * Reporting Page Wrapper - Client Component
 *
 * Wraps the reporting content with the toolbar
 * and handles global date range state.
 */

import { type ReactNode, useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { ReportingToolbar } from "./reporting-toolbar";

interface ReportingPageWrapperProps {
	children: ReactNode;
}

export function ReportingPageWrapper({ children }: ReportingPageWrapperProps) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [refreshKey, setRefreshKey] = useState(0);

	const handleDateChange = useCallback((range: DateRange) => {
		setDateRange(range);
		// In the future, this could trigger a refetch of data
		// For now, the date range is available for child components
	}, []);

	const handleRefresh = useCallback(() => {
		setRefreshKey((prev) => prev + 1);
		// This will trigger a re-render which can be used to refresh data
	}, []);

	return (
		<div className="flex w-full flex-col" key={refreshKey}>
			<ReportingToolbar
				onDateChange={handleDateChange}
				onRefresh={handleRefresh}
				showRefresh
			/>
			<div className="flex-1 overflow-y-auto">{children}</div>
		</div>
	);
}
