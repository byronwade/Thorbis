"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "Dashboard", href: "/dashboard" },
	{ name: "Websites", href: "/dashboard/websites" },
	{ name: "Deployments", href: "/dashboard/deployments" },
	{ name: "Settings", href: "/dashboard/settings" },
];

export function SideNav() {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col w-64 border-r bg-background">
			<div className="p-4">
				<h1 className="text-xl font-bold">Thorbis</h1>
			</div>
			<div className="flex-1 px-2 py-4 space-y-1">
				{navigation.map((item) => (
					<Link key={item.href} href={item.href} className={cn("flex items-center px-4 py-2 rounded-md", pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted")}>
						{item.name}
					</Link>
				))}
			</div>
		</nav>
	);
}
