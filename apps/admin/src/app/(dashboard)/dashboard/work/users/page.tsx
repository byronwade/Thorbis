import { UsersTable } from "@/components/work/users-table";
import type { User } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockUsers: User[] = [
	{
		id: "1",
		email: "john@acmeplumbing.com",
		firstName: "John",
		lastName: "Smith",
		role: "owner",
		status: "active",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		lastLogin: "2024-11-10T14:30:00Z",
		createdAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "2",
		email: "sarah@elitehvac.com",
		firstName: "Sarah",
		lastName: "Johnson",
		role: "admin",
		status: "active",
		companyId: "2",
		companyName: "Elite HVAC Services",
		lastLogin: "2024-11-11T09:15:00Z",
		createdAt: "2023-06-20T14:00:00Z",
	},
	{
		id: "3",
		email: "mike@quickfixelectric.com",
		firstName: "Mike",
		lastName: "Williams",
		role: "owner",
		status: "pending",
		companyId: "3",
		companyName: "Quick Fix Electric",
		createdAt: "2024-11-01T09:15:00Z",
	},
	{
		id: "4",
		email: "tech1@acmeplumbing.com",
		firstName: "Bob",
		lastName: "Davis",
		role: "technician",
		status: "active",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		lastLogin: "2024-11-10T08:00:00Z",
		createdAt: "2024-03-01T11:45:00Z",
	},
	{
		id: "5",
		email: "manager@johnsonroofing.com",
		firstName: "Lisa",
		lastName: "Johnson",
		role: "manager",
		status: "active",
		companyId: "4",
		companyName: "Johnson & Sons Roofing",
		lastLogin: "2024-11-09T16:20:00Z",
		createdAt: "2023-11-15T09:00:00Z",
	},
	{
		id: "6",
		email: "suspended@metrolandscaping.com",
		firstName: "Tom",
		lastName: "Brown",
		role: "owner",
		status: "suspended",
		companyId: "5",
		companyName: "Metro Landscaping",
		lastLogin: "2024-10-01T10:00:00Z",
		createdAt: "2023-08-05T16:20:00Z",
	},
];

/**
 * Users Management Page
 */
export default function UsersPage() {
	return (
		<div className="flex flex-col">
			<UsersTable
				users={mockUsers}
				totalCount={mockUsers.length}
				showRefresh
			/>
		</div>
	);
}
