/**
 * Template Download API Route
 *
 * Generates and returns Excel templates for import
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateExcelTemplate } from "@/lib/data/excel-template-generator";

interface RouteContext {
  params: {
    type: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { type } = context.params;

    // Validate data type
    const validTypes = [
      "jobs",
      "invoices",
      "estimates",
      "contracts",
      "purchase-orders",
      "customers",
      "pricebook",
      "materials",
      "equipment",
      "schedule",
      "maintenance-plans",
      "service-agreements",
      "service-tickets",
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    // Generate template
    const template = generateExcelTemplate(type);

    // Convert blob to buffer
    const buffer = Buffer.from(await template.arrayBuffer());

    // Return file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${type}_import_template.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Template API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
