/**
 * Outreach Page - Customer Outreach
 *
 * Full-width seamless datatable layout for customer outreach
 */

import { Send } from "lucide-react";

export default function OutreachPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Send className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h2 className="mb-2 font-semibold text-2xl">Customer Outreach</h2>
        <p className="text-muted-foreground">
          Targeted outreach campaigns for maintenance reminders and special
          offers
        </p>
        <p className="mt-4 text-muted-foreground text-sm">
          Coming soon - Datatable for outreach management
        </p>
      </div>
    </div>
  );
}
