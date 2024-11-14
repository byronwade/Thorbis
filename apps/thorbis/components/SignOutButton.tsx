"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/thorbis/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
	return (
		<Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })} className="gap-2">
			<LogOut className="h-4 w-4" />
			Sign Out
		</Button>
	);
}
