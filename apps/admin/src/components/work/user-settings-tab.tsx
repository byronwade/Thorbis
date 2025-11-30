"use client";

import { useState } from "react";
import { Settings, Ban, CheckCircle, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setUserStatus } from "@/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserSettingsTabProps = {
	user: any;
};

/**
 * User Settings Tab
 * 
 * Allows admins to manage user settings and actions.
 */
export function UserSettingsTab({ user }: UserSettingsTabProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const primaryMembership = user.memberships?.[0];
	const currentStatus = primaryMembership?.status || "active";

	const handleStatusChange = async (status: "active" | "suspended") => {
		setIsLoading(true);
		try {
			const result = await setUserStatus(user.id, status);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(`User ${status === "active" ? "activated" : "suspended"}`);
				router.refresh();
			}
		} catch (error) {
			toast.error("Failed to update user status");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* User Actions */}
			<Card>
				<CardHeader>
					<CardTitle>User Actions</CardTitle>
					<CardDescription>Manage user status</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Current Status</p>
							<Badge className="mt-1 capitalize">{currentStatus}</Badge>
						</div>
						<div className="flex gap-2">
							{currentStatus === "suspended" ? (
								<Button
									onClick={() => handleStatusChange("active")}
									disabled={isLoading}
									variant="default"
								>
									<CheckCircle className="mr-2 h-4 w-4" />
									Activate
								</Button>
							) : (
								<Button
									onClick={() => handleStatusChange("suspended")}
									disabled={isLoading}
									variant="destructive"
								>
									<Ban className="mr-2 h-4 w-4" />
									Suspend
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Links */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Links</CardTitle>
					<CardDescription>Navigate to related pages</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button variant="outline" asChild className="w-full justify-start">
						<a href={`mailto:${user.email}`}>
							<Mail className="mr-2 h-4 w-4" />
							Send Email
						</a>
					</Button>
					{user.memberships?.map((membership: any) => (
						<Button
							key={membership.company_id}
							variant="outline"
							asChild
							className="w-full justify-start"
						>
							<Link href={`/dashboard/work/companies/${membership.company_id}`}>
								View {membership.companies?.name || "Company"}
							</Link>
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

