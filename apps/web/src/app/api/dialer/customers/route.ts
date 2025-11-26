import { NextResponse } from "next/server";
import { getCustomersForDialer } from "@/actions/customers";

export async function GET() {
	try {
		const result = await getCustomersForDialer();
		if (!result.success || !result.data) {
			return NextResponse.json(
				{ error: result.error ?? "Failed to load customers" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ customers: result.data });
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to load customers",
			},
			{ status: 500 },
		);
	}
}
