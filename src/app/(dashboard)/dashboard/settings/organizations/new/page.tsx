import { redirect } from "next/navigation";
import { getUserCompanies } from "@/lib/auth/user-data";
import { OrganizationCreationWizard } from "@/components/settings/organization-creation-wizard";

/**
 * Create Organization Page - Server Component
 *
 * Allows users to create additional organizations.
 * Shows pricing information for additional organizations ($100/month).
 */

export default async function CreateOrganizationPage() {
  // Get user's existing companies to show pricing warning if they have any
  const companies = await getUserCompanies();

  return <OrganizationCreationWizard existingCompaniesCount={companies.length} />;
}
