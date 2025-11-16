/**
 * Invoice Terms Component
 *
 * Editable terms and conditions, and notes section
 */

"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type InvoiceTermsProps = {
  terms: string | null;
  notes: string | null;
  onUpdate: (field: string, value: string) => void;
};

export function InvoiceTerms({ terms, notes, onUpdate }: InvoiceTermsProps) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2">
      {/* Terms and Conditions */}
      <Card className="p-6">
        <Label className="font-semibold text-base" htmlFor="terms">
          Terms and Conditions
        </Label>
        <Textarea
          className="mt-2 min-h-[150px]"
          id="terms"
          onChange={(e) => onUpdate("terms", e.target.value)}
          placeholder="Payment terms, late fees, warranty information, etc."
          value={terms || ""}
        />
        <p className="mt-2 text-muted-foreground text-xs">
          Standard payment terms, late fees, warranties, and other conditions
        </p>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <Label className="font-semibold text-base" htmlFor="notes">
          Notes
        </Label>
        <Textarea
          className="mt-2 min-h-[150px]"
          id="notes"
          onChange={(e) => onUpdate("notes", e.target.value)}
          placeholder="Additional notes or instructions for the customer..."
          value={notes || ""}
        />
        <p className="mt-2 text-muted-foreground text-xs">
          Internal notes or special instructions for this invoice
        </p>
      </Card>
    </div>
  );
}
