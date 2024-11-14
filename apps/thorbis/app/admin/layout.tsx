import { AdminHeader } from "@/thorbis/components/AdminHeader";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/thorbis/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen flex flex-col">
			<AdminHeader />
			<main className="flex-1">{children}</main>
		</div>
	);
}
