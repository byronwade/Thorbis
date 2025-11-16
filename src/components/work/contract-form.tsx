"use client";

import { FileSignature, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createContract } from "@/actions/contracts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Contract Form Component - Client Component
 *
 * Used for creating new contracts with support for:
 * - Contracts linked to estimates (estimate has customer info)
 * - Contracts linked to invoices (invoice has customer info)
 * - Pre-filling data from related entities
 *
 * Note: Contracts are NOT linked directly to customers.
 * Customer info comes from the linked estimate/invoice.
 * For sending, we only need the signer's email address.
 */

type ContractFormProps = {
  jobId?: string;
  estimateId?: string;
  invoiceId?: string;
  initialData?: {
    title?: string;
    description?: string;
    content?: string;
    contractType?: string;
    signerEmail?: string;
    signerName?: string;
  };
};

export function ContractForm({
  jobId,
  estimateId,
  invoiceId,
  initialData,
}: ContractFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Add linked entity IDs if provided
    if (jobId) {
      formData.append("jobId", jobId);
    }
    if (estimateId) {
      formData.append("estimateId", estimateId);
    }
    if (invoiceId) {
      formData.append("invoiceId", invoiceId);
    }

    const result = await createContract(formData);

    if (result.success) {
      router.push(`/dashboard/work/contracts/${result.contractId}`);
    } else {
      setError(result.error || "Failed to create contract");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
            <CardDescription>Basic details about the contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Contract Title *</Label>
              <Input
                defaultValue={initialData?.title}
                id="title"
                name="title"
                placeholder="e.g., Annual Service Agreement"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                defaultValue={initialData?.description}
                id="description"
                name="description"
                placeholder="Brief description of the contract"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type *</Label>
              <Select
                defaultValue={initialData?.contractType || "service"}
                name="contractType"
                required
              >
                <SelectTrigger id="contractType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service Agreement</SelectItem>
                  <SelectItem value="maintenance">
                    Maintenance Contract
                  </SelectItem>
                  <SelectItem value="custom">Custom Contract</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Customer information comes from the linked estimate or invoice
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contract Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Terms</CardTitle>
            <CardDescription>
              The main body of the contract that will be signed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Contract Content *</Label>
              <Textarea
                className="min-h-[300px] font-mono text-sm"
                defaultValue={
                  initialData?.content ||
                  "This Agreement is entered into on [DATE] between [COMPANY] and [CUSTOMER].\n\nTerms and Conditions:\n\n1. Services to be provided:\n   - [Service details]\n\n2. Payment terms:\n   - [Payment details]\n\n3. Duration:\n   - [Contract duration]\n\n4. Termination:\n   - [Termination conditions]\n\nBy signing below, both parties agree to these terms."
                }
                id="content"
                name="content"
                placeholder="Enter the full contract text..."
                required
              />
              <p className="text-muted-foreground text-xs">
                Use placeholders like [DATE], [COMPANY], [CUSTOMER] that can be
                replaced automatically
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Additional Terms</Label>
              <Textarea
                id="terms"
                name="terms"
                placeholder="Any additional legal terms or conditions..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Validity Period */}
        <Card>
          <CardHeader>
            <CardTitle>Validity Period</CardTitle>
            <CardDescription>
              When this contract is valid from and until
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From</Label>
                <Input id="validFrom" name="validFrom" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" name="validUntil" type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Signer Information</CardTitle>
            <CardDescription>
              Person who will sign this contract - we'll email them the signing
              link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="signerName">Signer Name</Label>
                <Input
                  defaultValue={initialData?.signerName}
                  id="signerName"
                  name="signerName"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerEmail">Signer Email *</Label>
                <Input
                  defaultValue={initialData?.signerEmail}
                  id="signerEmail"
                  name="signerEmail"
                  placeholder="john@example.com"
                  required
                  type="email"
                />
                <p className="text-muted-foreground text-xs">
                  Required to send the contract for signature
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="signerTitle">Signer Title</Label>
                <Input
                  id="signerTitle"
                  name="signerTitle"
                  placeholder="e.g., CEO, Director"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerCompany">Signer Company</Label>
                <Input
                  id="signerCompany"
                  name="signerCompany"
                  placeholder="Company name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
            <CardDescription>
              Notes for internal use only (not visible to customer)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any internal notes or reminders..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="font-medium text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            disabled={isLoading}
            onClick={() => router.back()}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FileSignature className="mr-2 size-4" />
                Create Contract
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
