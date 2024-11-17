"use client";
import { SignOutButton } from "./SignOutButton";

export function AdminHeader() {
	return (
		<header className="border-b">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<h1 className="text-xl font-semibold">Admin Dashboard</h1>
				</div>
				<SignOutButton />
			</div>
		</header>
	);
}
