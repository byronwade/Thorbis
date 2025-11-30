import { Suspense } from "react";
import { UsersTable } from "@/components/work/users-table";
import { getUsersWithDetails } from "@/actions/users";
import { UsersTableSkeleton } from "@/components/work/users-table-skeleton";
import type { User } from "@/types/entities";

/**
 * Users Management Page
 * 
 * Displays all users on the platform with their company associations.
 */
async function UsersData() {
	const result = await getUsersWithDetails(100);

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load users"}
				</p>
			</div>
		);
	}

	// Transform UserWithDetails to User type
	const users: User[] = result.data.map((userDetails) => {
		// Get primary company (first active one, or first one)
		const primaryCompany = userDetails.companies.find((c) => c.status === "active") || userDetails.companies[0];

		// Parse full_name into firstName/lastName if needed
		const nameParts = userDetails.full_name?.split(" ") || [];
		const firstName = nameParts[0] || undefined;
		const lastName = nameParts.slice(1).join(" ") || undefined;

		return {
			id: userDetails.id,
			email: userDetails.email,
			firstName,
			lastName,
			fullName: userDetails.full_name,
			role: (primaryCompany?.role as any) || "technician",
			status: (primaryCompany?.status as any) || "active",
			companyId: primaryCompany?.company_id,
			companyName: primaryCompany?.company_name,
			lastLogin: userDetails.last_sign_in_at,
			createdAt: userDetails.created_at,
			avatarUrl: userDetails.avatar_url,
		};
	});

	return (
		<UsersTable
			users={users}
			totalCount={users.length}
			showRefresh
		/>
	);
}

export default function UsersPage() {
	return (
		<div className="flex flex-col">
			<Suspense fallback={<UsersTableSkeleton />}>
				<UsersData />
			</Suspense>
		</div>
	);
}
