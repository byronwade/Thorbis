"use client";
import { SignOutButton } from "./SignOutButton";
import { useSession } from "next-auth/react";

export function AdminHeader() {
	const { data: session } = useSession();

	return (
		<header className="border-b">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<h1 className="text-xl font-semibold">Admin Dashboard</h1>
					{session?.user?.name && <span className="text-sm text-muted-foreground">Signed in as {session.user.name}</span>}
				</div>
				<SignOutButton />
			</div>
		</header>
	);
}
