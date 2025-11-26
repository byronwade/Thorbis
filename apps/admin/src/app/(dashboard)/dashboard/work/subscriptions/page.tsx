import { SubscriptionsTable } from "@/components/work/subscriptions-table";
import type { Subscription } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockSubscriptions: Subscription[] = [
	{
		id: "sub_1",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		plan: "professional",
		status: "active",
		amount: 299,
		interval: "monthly",
		currentPeriodStart: "2024-11-01T00:00:00Z",
		currentPeriodEnd: "2024-12-01T00:00:00Z",
		createdAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "sub_2",
		companyId: "2",
		companyName: "Elite HVAC Services",
		plan: "enterprise",
		status: "active",
		amount: 5988,
		interval: "yearly",
		currentPeriodStart: "2024-06-20T00:00:00Z",
		currentPeriodEnd: "2025-06-20T00:00:00Z",
		createdAt: "2023-06-20T14:00:00Z",
	},
	{
		id: "sub_3",
		companyId: "3",
		companyName: "Quick Fix Electric",
		plan: "starter",
		status: "trialing",
		amount: 99,
		interval: "monthly",
		currentPeriodStart: "2024-11-01T09:15:00Z",
		currentPeriodEnd: "2024-11-15T09:15:00Z",
		createdAt: "2024-11-01T09:15:00Z",
	},
	{
		id: "sub_4",
		companyId: "4",
		companyName: "Johnson & Sons Roofing",
		plan: "professional",
		status: "active",
		amount: 299,
		interval: "monthly",
		currentPeriodStart: "2024-11-10T00:00:00Z",
		currentPeriodEnd: "2024-12-10T00:00:00Z",
		cancelAtPeriodEnd: true,
		createdAt: "2023-11-10T11:45:00Z",
	},
	{
		id: "sub_5",
		companyId: "5",
		companyName: "Metro Landscaping",
		plan: "professional",
		status: "past_due",
		amount: 299,
		interval: "monthly",
		currentPeriodStart: "2024-10-05T00:00:00Z",
		currentPeriodEnd: "2024-11-05T00:00:00Z",
		createdAt: "2023-08-05T16:20:00Z",
	},
];

/**
 * Subscriptions Management Page
 */
export default function SubscriptionsPage() {
	return (
		<div className="flex flex-col">
			<SubscriptionsTable
				subscriptions={mockSubscriptions}
				totalCount={mockSubscriptions.length}
				showRefresh
			/>
		</div>
	);
}
