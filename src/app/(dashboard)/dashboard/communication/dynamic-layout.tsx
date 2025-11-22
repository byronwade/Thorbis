"use client";

import { SectionLayout } from "@/components/layout/section-layout";
import { getUnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function DynamicCommunicationLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const safePathname = pathname || "/dashboard/communication";
	const config = getUnifiedLayoutConfig(safePathname);

	return (
		<SectionLayout config={config} pathname={safePathname}>
			{children}
		</SectionLayout>
	);
}
