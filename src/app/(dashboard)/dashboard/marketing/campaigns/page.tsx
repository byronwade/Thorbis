/**
 * Campaigns Page - Campaign Management
 *
 * Full-width seamless datatable layout for managing campaigns
 */

import { Megaphone } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Megaphone className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h2 className="mb-2 font-semibold text-2xl">Marketing Campaigns</h2>
        <p className="text-muted-foreground">
          Create and manage email, SMS, and direct mail campaigns
        </p>
        <p className="mt-4 text-muted-foreground text-sm">
          Coming soon - Datatable for campaign management
        </p>
      </div>
    </div>
  );
}
