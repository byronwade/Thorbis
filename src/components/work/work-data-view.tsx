"use client";

import { type ReactNode, useEffect } from "react";
import { useSetWorkView, useWorkView, type WorkSection, type WorkViewMode } from "@/lib/stores/work-view-store";

type WorkDataViewProps = {
	section: WorkSection;
	table: ReactNode;
	kanban: ReactNode;
	fallback?: ReactNode;
	forceView?: WorkViewMode;
};

export function WorkDataView({ section, table, kanban, fallback = null, forceView }: WorkDataViewProps) {
	const storedView = useWorkView(section);
	const setView = useSetWorkView(section);
	const viewMode = forceView ?? storedView;

	useEffect(() => {
		if (forceView && storedView !== forceView) {
			setView(forceView);
		}
	}, [forceView, setView, storedView]);

	if (viewMode === "kanban") {
		return <>{kanban ?? fallback}</>;
	}

	return <>{table ?? fallback}</>;
}
