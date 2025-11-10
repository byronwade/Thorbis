/**
 * Inventory > Vendors > New Page - Server Component
 */

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorForm } from "@/components/inventory/vendor-form";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // No caching for create page

export default async function NewVendorPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-6">
      <div>
        <h1 className="font-semibold text-2xl">Add New Vendor</h1>
        <p className="text-muted-foreground">
          Create a new vendor profile to track supplier information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}

