import { NextResponse } from "next/server";
import { getAppointmentsStatsData } from "@/components/work/appointments/appointments-stats";
import { getContractsStatsData } from "@/components/work/contracts/contracts-stats";
import { getEquipmentStatsData } from "@/components/work/equipment/equipment-stats";
import { getEstimatesStatsData } from "@/components/work/estimates/estimates-stats";
import { getInvoicesStatsData } from "@/components/work/invoices/invoices-stats";
import { getJobsStatsData } from "@/components/work/jobs/jobs-stats";
import { getMaterialsStatsData } from "@/components/work/materials/materials-stats";
import { getPaymentsStatsData } from "@/components/work/payments/payments-stats";
import { getPurchaseOrdersStatsData } from "@/components/work/purchase-orders/purchase-orders-stats";
import { getTeamStatsData } from "@/components/work/team/team-stats";
import { getVendorsStatsData } from "@/components/work/vendors/vendors-stats";

/**
 * API route to fetch stats for work pages
 * GET /api/work-stats/[page]
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ page: string }> },
) {
	const { page } = await params;

	try {
		let stats;

		switch (page) {
			case "appointments":
				stats = await getAppointmentsStatsData();
				break;
			case "jobs":
				stats = await getJobsStatsData();
				break;
			case "invoices":
				stats = await getInvoicesStatsData();
				break;
			case "contracts":
				stats = await getContractsStatsData();
				break;
			case "estimates":
				stats = await getEstimatesStatsData();
				break;
			case "payments":
				stats = await getPaymentsStatsData();
				break;
			case "equipment":
				stats = await getEquipmentStatsData();
				break;
			case "materials":
				stats = await getMaterialsStatsData();
				break;
			case "purchase-orders":
				stats = await getPurchaseOrdersStatsData();
				break;
			case "team":
				stats = await getTeamStatsData();
				break;
			case "vendors":
				stats = await getVendorsStatsData();
				break;
			default:
				return NextResponse.json({ error: "Invalid page" }, { status: 400 });
		}

		return NextResponse.json({ stats });
	} catch (error) {
		console.error(`Error fetching stats for ${page}:`, error);
		return NextResponse.json(
			{ error: "Failed to fetch stats" },
			{ status: 500 },
		);
	}
}
