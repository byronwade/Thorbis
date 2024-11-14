import { Suspense } from "react";
import { SideNav, TopNav } from "@/thorbis/components/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<SideNav />
			<main className="flex-1 overflow-y-auto">
				<TopNav />
				<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
			</main>
		</div>
	);
}
