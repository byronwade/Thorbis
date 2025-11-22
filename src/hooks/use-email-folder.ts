"use client";

import { usePathname, useParams } from "next/navigation";
import { useMemo } from "react";

export type EmailFolder = "inbox" | "drafts" | "sent" | "archive" | "snoozed" | "spam" | "trash" | "bin" | string;

/**
 * Hook to determine the current email folder from the URL pathname
 * Supports both system folders and custom folders
 */
export function useEmailFolder(): EmailFolder {
	const pathname = usePathname();
	const params = useParams();

	return useMemo(() => {
		// Check for custom folder in URL: /communication/folder/[slug]
		if (pathname?.includes("/folder/") && params?.slug) {
			return params.slug as string;
		}
		
		// Check for label in URL: /communication/label/[label]
		if (pathname?.includes("/label/") && params?.slug) {
			return params.slug as string;
		}
		
		// System folders - check for explicit folder paths
		if (pathname?.includes("/inbox")) return "inbox";
		if (pathname?.includes("/drafts")) return "drafts";
		if (pathname?.includes("/sent")) return "sent";
		if (pathname?.includes("/archive")) return "archive";
		if (pathname?.includes("/snoozed")) return "snoozed";
		if (pathname?.includes("/spam")) return "spam";
		if (pathname?.includes("/trash")) return "trash";
		
		// Default to inbox if at /dashboard/communication (legacy support)
		if (pathname === "/dashboard/communication") return "inbox";
		
		return "inbox";
	}, [pathname, params]);
}

