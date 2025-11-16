/**
 * Export Workflow Page - Server Component
 *
 * Multi-step export wizard for all data types
 * Steps:
 * 1. Select filters
 * 2. Choose fields
 * 3. Format options
 * 4. Schedule (optional)
 * 5. Preview & download
 */

import { redirect } from "next/navigation";
import { ExportWorkflowClient } from "@/components/data/export-workflow-client";
import { getCurrentUser } from "@/lib/auth/session";

type ExportPageProps = {
  params: {
    type: string;
  };
};

export default async function ExportPage({ params }: ExportPageProps) {
  // Check authentication
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?message=Please log in to export data");
  }

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

  if (!validTypes.includes(params.type)) {
    redirect("/dashboard");
  }

  return <ExportWorkflowClient dataType={params.type} />;
}
