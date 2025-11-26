import { CompaniesTable } from "@/components/work/companies-table";
import type { Company } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockCompanies: Company[] = [
	{
		id: "1",
		name: "Acme Plumbing Co.",
		email: "contact@acmeplumbing.com",
		phone: "(555) 123-4567",
		plan: "professional",
		status: "active",
		usersCount: 12,
		jobsCount: 450,
		monthlyRevenue: 299,
		createdAt: "2024-01-15T10:30:00Z",
		industry: "Plumbing",
	},
	{
		id: "2",
		name: "Elite HVAC Services",
		email: "info@elitehvac.com",
		phone: "(555) 234-5678",
		plan: "enterprise",
		status: "active",
		usersCount: 45,
		jobsCount: 1200,
		monthlyRevenue: 599,
		createdAt: "2023-06-20T14:00:00Z",
		industry: "HVAC",
	},
	{
		id: "3",
		name: "Quick Fix Electric",
		email: "hello@quickfixelectric.com",
		phone: "(555) 345-6789",
		plan: "starter",
		status: "trial",
		usersCount: 3,
		jobsCount: 25,
		monthlyRevenue: 0,
		createdAt: "2024-11-01T09:15:00Z",
		trialEndsAt: "2024-11-15T09:15:00Z",
		industry: "Electrical",
	},
	{
		id: "4",
		name: "Johnson & Sons Roofing",
		email: "admin@johnsonroofing.com",
		phone: "(555) 456-7890",
		plan: "professional",
		status: "active",
		usersCount: 8,
		jobsCount: 180,
		monthlyRevenue: 299,
		createdAt: "2023-11-10T11:45:00Z",
		industry: "Roofing",
	},
	{
		id: "5",
		name: "Metro Landscaping",
		email: "support@metrolandscaping.com",
		phone: "(555) 567-8901",
		plan: "professional",
		status: "suspended",
		usersCount: 15,
		jobsCount: 320,
		monthlyRevenue: 0,
		createdAt: "2023-08-05T16:20:00Z",
		industry: "Landscaping",
	},
];

/**
 * Companies Management Page
 */
export default function CompaniesPage() {
	return (
		<div className="flex flex-col">
			<CompaniesTable
				companies={mockCompanies}
				totalCount={mockCompanies.length}
				showRefresh
			/>
		</div>
	);
}
