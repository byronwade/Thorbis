import { Suspense } from "react";
import { CustomFieldsContent } from "./custom-fields-content";
import { getCustomFields } from "@/actions/settings/customers";

/**
 * Settings > Customers > Custom Fields Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Data fetched on server
 * - Client interactivity extracted to separate component
 */

export const metadata = {
  title: "Custom Fields - Customer Settings",
  description: "Add custom fields to collect additional customer information",
};

export default async function CustomFieldsPage() {
  const result = await getCustomFields();
  const initialFields = result.success ? result.data : [];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomFieldsContent initialFields={initialFields} />
    </Suspense>
  );
}
