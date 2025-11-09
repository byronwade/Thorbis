/**
 * Template Download Page - Server Component
 *
 * Generates and downloads Excel templates for imports
 */

import { redirect } from "next/navigation";
import { TemplateDownloadClient } from "@/components/data/template-download-client";
import { getCurrentUser } from "@/lib/auth/session";

interface TemplatePageProps {
  params: {
    type: string;
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  // Check authentication
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?message=Please log in to download templates");
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

  return <TemplateDownloadClient dataType={params.type} />;
}
