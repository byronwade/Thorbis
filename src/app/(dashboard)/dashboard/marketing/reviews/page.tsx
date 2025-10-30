/**
 * Reviews Page - Review Management
 *
 * Full-width seamless datatable layout for managing reviews
 */

import { Star } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Star className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
        <h2 className="mb-2 font-semibold text-2xl">Review Management</h2>
        <p className="text-muted-foreground">
          Monitor and respond to reviews across Google, Facebook, and Yelp
        </p>
        <p className="mt-4 text-muted-foreground text-sm">
          Coming soon - Datatable for review management
        </p>
      </div>
    </div>
  );
}
