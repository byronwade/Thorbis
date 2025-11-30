import { User, Mail, Phone, Building2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import { UserStatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";

type UserOverviewTabProps = {
	user: any;
};

/**
 * User Overview Tab
 * 
 * Displays key user information and company associations.
 */
export function UserOverviewTab({ user }: UserOverviewTabProps) {
	return (
		<div className="space-y-6">
			{/* User Information */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>User Information</CardTitle>
						<CardDescription>Basic user details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Name</label>
							<p className="text-sm">{user.full_name || "—"}</p>
						</div>
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Email</label>
							<p className="text-sm">{user.email}</p>
						</div>
						{user.phone && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Phone</label>
								<p className="text-sm">{user.phone}</p>
							</div>
						)}
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Status</label>
							<div>
								<UserStatusBadge status={user.memberships?.[0]?.status || "active"} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Account Details</CardTitle>
						<CardDescription>Account timeline</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<Calendar className="text-muted-foreground h-4 w-4" />
							<div>
								<label className="text-muted-foreground text-sm font-medium">Created</label>
								<p className="text-sm">{formatDate(user.created_at)}</p>
							</div>
						</div>
						{user.updated_at && (
							<div className="flex items-center gap-4">
								<Calendar className="text-muted-foreground h-4 w-4" />
								<div>
									<label className="text-muted-foreground text-sm font-medium">Last Updated</label>
									<p className="text-sm">{formatDate(user.updated_at)}</p>
								</div>
							</div>
						)}
						{user.last_sign_in_at && (
							<div className="flex items-center gap-4">
								<Calendar className="text-muted-foreground h-4 w-4" />
								<div>
									<label className="text-muted-foreground text-sm font-medium">Last Login</label>
									<p className="text-sm">{formatDate(user.last_sign_in_at)}</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Companies */}
			<Card>
				<CardHeader>
					<CardTitle>Companies</CardTitle>
					<CardDescription>
						{user.memberships?.length || 0} company membership
						{(user.memberships?.length || 0) !== 1 ? "s" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{user.memberships && user.memberships.length > 0 ? (
						<div className="space-y-3">
							{user.memberships.map((membership: any) => (
								<Link
									key={membership.company_id}
									href={`/dashboard/work/companies/${membership.company_id}`}
									className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
								>
									<div className="flex items-center gap-3">
										<Building2 className="text-muted-foreground h-5 w-5" />
										<div>
											<p className="font-medium">
												{membership.companies?.name || "Unknown Company"}
											</p>
											{membership.custom_roles?.name && (
												<p className="text-muted-foreground text-sm">
													Role: {membership.custom_roles.name}
												</p>
											)}
										</div>
									</div>
									<Badge variant="secondary" className="capitalize">
										{membership.status}
									</Badge>
								</Link>
							))}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No company memberships</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

