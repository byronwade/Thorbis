"use client";

import { useState } from "react";
import { Settings, Eye, Archive, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setCompanyStatus, requestCompanyAccess } from "@/actions/companies";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

type CompanySettingsTabProps = {
	company: any;
};

/**
 * Company Settings Tab
 * 
 * Allows admins to manage company settings and actions.
 */
export function CompanySettingsTab({ company }: CompanySettingsTabProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleStatusChange = async (status: "active" | "suspended") => {
		setIsLoading(true);
		try {
			const result = await setCompanyStatus(company.id, status);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(`Company ${status === "active" ? "activated" : "suspended"}`);
				router.refresh();
			}
		} catch (error) {
			toast.error("Failed to update company status");
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewAs = async () => {
		setIsLoading(true);
		try {
			const result = await requestCompanyAccess(company.id, undefined, "Admin viewing company");
			if (result.error) {
				toast.error(result.error);
			} else if (result.sessionId) {
				// Redirect to view-as page
				router.push(`/dashboard/view-as/${company.id}`);
			}
		} catch (error) {
			toast.error("Failed to request access");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Company Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Company Actions</CardTitle>
					<CardDescription>Manage company status and access</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Current Status</p>
							<Badge className="mt-1 capitalize">{company.status || "active"}</Badge>
						</div>
						<div className="flex gap-2">
							{company.status === "suspended" ? (
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
									<Archive className="mr-2 h-4 w-4" />
									Suspend
								</Button>
							)}
						</div>
					</div>

					<div className="pt-4 border-t">
						<Button onClick={handleViewAs} disabled={isLoading} variant="outline">
							<Eye className="mr-2 h-4 w-4" />
							View As Company
						</Button>
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
						<Link href={`/dashboard/work/companies/${company.id}/edit`}>
							<Settings className="mr-2 h-4 w-4" />
							Edit Company
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full justify-start">
						<Link href={`/dashboard/work/users?companyId=${company.id}`}>
							View All Users
						</Link>
					</Button>
					{company.stripe_subscription_id && (
						<Button variant="outline" asChild className="w-full justify-start">
							<Link href={`/dashboard/work/subscriptions/${company.stripe_subscription_id}`}>
								View Subscription
							</Link>
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

