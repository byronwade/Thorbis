"use client";

import { useMemoizedValue } from "@/thorbis/lib/utils/memoization";
import { useCallback } from "react";

export function WebsitesList() {
	const getWebsites = useCallback(() => [] as Website[], []);
	const websites = useMemoizedValue(getWebsites, [getWebsites]);

	if (websites.length === 0) {
		return (
			<div className="text-center p-6">
				<p>No websites found. Create your first website to get started.</p>
			</div>
		);
	}

	return (
		<div className="divide-y">
			{websites.map((website) => (
				<div key={website.id} className="py-4">
					{website.name}
				</div>
			))}
		</div>
	);
}
