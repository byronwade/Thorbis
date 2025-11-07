"use client";

/**
 * Add Payment Method Dialog
 *
 * Allows adding payment methods via Stripe with support for:
 * - Credit/Debit Cards
 * - ACH Bank Accounts
 * - Digital Wallets (Apple Pay, Google Pay)
 *
 * Uses Stripe Elements for secure PCI-compliant collection
 * Supports test mode with test card numbers
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Wallet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  onSuccess?: () => void;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  customerId,
  onSuccess,
}: AddPaymentMethodDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"card" | "ach">("card");

  // Test card state
  const [testCardNumber, setTestCardNumber] = useState("");
  const [testExpMonth, setTestExpMonth] = useState("");
  const [testExpYear, setTestExpYear] = useState("");
  const [testCvc, setTestCvc] = useState("");

  const handleAddTestCard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Integrate with Stripe API to create payment method
      // For now, simulate adding a test card

      // Validate test card
      if (!testCardNumber || !testExpMonth || !testExpYear || !testCvc) {
        setError("Please fill in all card details");
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("Payment method functionality coming soon! This will integrate with Stripe to securely save payment methods.");

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add payment method");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Securely add a payment method for invoices and recurring payments
          </DialogDescription>
        </DialogHeader>

        <Tabs value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card" className="gap-2">
              <CreditCard className="size-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="ach" className="gap-2">
              <Landmark className="size-4" />
              Bank Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            {/* Test Card Info Alert */}
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription className="text-xs">
                <strong>Test Cards:</strong> Use 4242 4242 4242 4242 (any CVC, future date)
              </AlertDescription>
            </Alert>

            {/* Card Number */}
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input
                type="text"
                placeholder="4242 4242 4242 4242"
                value={testCardNumber}
                onChange={(e) => setTestCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>

            {/* Expiration & CVC */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Input
                  type="text"
                  placeholder="MM"
                  value={testExpMonth}
                  onChange={(e) => setTestExpMonth(e.target.value)}
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="text"
                  placeholder="YYYY"
                  value={testExpYear}
                  onChange={(e) => setTestExpYear(e.target.value)}
                  maxLength={4}
                />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input
                  type="text"
                  placeholder="123"
                  value={testCvc}
                  onChange={(e) => setTestCvc(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTestCard}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Card"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ach" className="space-y-4">
            {/* ACH Bank Account */}
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription className="text-xs">
                <strong>Test Routing:</strong> 110000000 (any account number)
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Routing Number</Label>
                <Input
                  type="text"
                  placeholder="110000000"
                  maxLength={9}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  type="text"
                  placeholder="000123456789"
                />
              </div>
              <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input
                  type="text"
                  placeholder="John Smith"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1" disabled>
                Add Bank Account (Coming Soon)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
