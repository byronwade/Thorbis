"use client";

import { UserNav } from "@/components/dashboard/user-nav";

export function TopNav() {
	return (
		<header className="border-b">
			<div className="flex h-16 items-center px-4">
				<div className="flex-1" />
				<div className="flex items-center gap-4">
					<UserNav />
				</div>
			</div>
		</header>
	);
}
