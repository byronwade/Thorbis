import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type CompanyUsersTabProps = {
	companyId: string;
	memberships?: Array<{
		user_id: string;
		users: {
			id: string;
			email: string;
			full_name?: string;
			avatar_url?: string;
		} | null;
	}>;
};

/**
 * Company Users Tab
 * 
 * Displays all users in the company.
 */
export function CompanyUsersTab({ companyId, memberships = [] }: CompanyUsersTabProps) {
	if (memberships.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<Users className="text-muted-foreground mb-4 h-12 w-12" />
					<p className="text-muted-foreground text-sm">No users found</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Team Members</CardTitle>
					<CardDescription>
						{memberships.length} active member{memberships.length !== 1 ? "s" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{memberships.map((membership) => {
							const user = membership.users;
							if (!user) return null;

							const initials = user.full_name
								? user.full_name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)
								: user.email[0].toUpperCase();

							return (
								<Link
									key={membership.user_id}
									href={`/dashboard/work/users/${user.id}`}
									className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
								>
									<Avatar>
										<AvatarImage src={user.avatar_url || undefined} />
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium">
											{user.full_name || user.email}
										</p>
										<p className="text-muted-foreground text-sm">{user.email}</p>
									</div>
									<Badge variant="secondary">View Details</Badge>
								</Link>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



