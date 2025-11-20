import { redirect } from "next/navigation";

type SearchParams = Promise<{
	jobId?: string;
	customerId?: string;
	date?: string;
}>;

type PageProps = {
	searchParams: SearchParams;
};

/**
 * Schedule New Appointment Page
 * Redirects to the appointments creation page with query params
 */
export default async function ScheduleNewPage({ searchParams }: PageProps) {
	const params = await searchParams;

	// Build query string from search params
	const queryParams = new URLSearchParams();

	if (params.jobId) {
		queryParams.set("jobId", params.jobId);
	}

	if (params.customerId) {
		queryParams.set("customerId", params.customerId);
	}

	if (params.date) {
		queryParams.set("date", params.date);
	}

	const queryString = queryParams.toString();
	const redirectUrl = `/dashboard/work/appointments/new${queryString ? `?${queryString}` : ""}`;

	redirect(redirectUrl);
}
