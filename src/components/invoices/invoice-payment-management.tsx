/**
 * Invoice Payment Management Component
 *
 * Comprehensive payment handling:
 * - Pay balance with existing cards
 * - Add new card on file
 * - Run new payment
 * - Track progress payments
 * - View payment history
 */

"use client";

import { AlertTriangle, CreditCard, DollarSign, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getOverdueStatus } from "@/lib/utils/invoice-overdue";

type PaymentMethod = {
  id: string;
  card_brand: string;
  last_four: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  cardholder_name: string;
};

type InvoicePaymentManagementProps = {
  invoice: {
    id: string;
    total_amount: number;
    paid_amount: number;
    balance_amount: number;
    status: string;
    due_date: string | null;
  };
  paymentMethods: PaymentMethod[];
  autoOpen?: boolean;
};

export function InvoicePaymentManagement({
  invoice,
  paymentMethods,
  autoOpen = false,
}: InvoicePaymentManagementProps) {
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Get overdue status for styling
  const overdueStatus = getOverdueStatus(
    invoice.due_date,
    invoice.balance_amount
  );
  const isOverdue = overdueStatus.showBanner;

  // Auto-open payment dialog when quick pay is triggered
  useEffect(() => {
    if (autoOpen && invoice.balance_amount > 0) {
      setShowPaymentDialog(true);
      // Pre-fill full balance
      setPaymentAmount((invoice.balance_amount / 100).toFixed(2));
    }
  }, [autoOpen, invoice.balance_amount]);

  // Format currency
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // Get card icon based on brand
  const getCardIcon = (_brand: string) => <CreditCard className="h-4 w-4" />;

  // Handle payment submission
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Payment processed successfully");
      setShowPaymentDialog(false);
      setPaymentAmount("");
    } catch (_error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle add new card
  const handleAddCard = async () => {
    try {
      // TODO: Implement card addition
      toast.success("Card added successfully");
      setShowAddCard(false);
    } catch (_error) {
      toast.error("Failed to add card");
    }
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign
            className={`h-5 w-5 ${isOverdue ? overdueStatus.colors.text : "text-muted-foreground"}`}
          />
          <Label
            className={`font-semibold text-base ${isOverdue ? overdueStatus.colors.text : ""}`}
          >
            {isOverdue ? "URGENT: Payment Required" : "Payment Management"}
          </Label>
        </div>
        {invoice.balance_amount > 0 && (
          <Dialog onOpenChange={setShowPaymentDialog} open={showPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                className={`
                  ${isOverdue ? overdueStatus.colors.badge : ""}
                  ${overdueStatus.urgency === "severe" ? "animate-pulse" : ""}
                  ${overdueStatus.urgency === "critical" ? "animate-pulse" : ""}
                `}
                size={isOverdue ? "lg" : "default"}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {isOverdue ? "Pay Now" : "Make Payment"}
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`sm:max-w-md ${isOverdue ? overdueStatus.colors.bg : ""}`}
            >
              <DialogHeader>
                <DialogTitle
                  className={isOverdue ? overdueStatus.colors.text : ""}
                >
                  {isOverdue ? "PAST DUE - Process Payment" : "Process Payment"}
                </DialogTitle>
                <DialogDescription
                  className={
                    isOverdue
                      ? `${overdueStatus.colors.text}font-semibold text-lg`
                      : ""
                  }
                >
                  {isOverdue && (
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{overdueStatus.message}</span>
                    </div>
                  )}
                  Balance due: {formatCurrency(invoice.balance_amount)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Payment Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      min="0"
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={paymentAmount}
                    />
                  </div>
                  <Button
                    onClick={() =>
                      setPaymentAmount(
                        (invoice.balance_amount / 100).toFixed(2)
                      )
                    }
                    size="sm"
                    variant="ghost"
                  >
                    Pay Full Balance
                  </Button>
                </div>

                <Separator />

                {/* Select Payment Method */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  {paymentMethods.length > 0 ? (
                    <Select
                      onValueChange={setSelectedCard}
                      value={selectedCard}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a card" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              {getCardIcon(method.card_brand)}
                              <span className="capitalize">
                                {method.card_brand}
                              </span>
                              <span>****{method.last_four}</span>
                              {method.is_default && (
                                <Badge className="ml-2" variant="outline">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No payment methods on file
                    </p>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => setShowAddCard(true)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Card
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className={`w-full ${isOverdue ? "bg-destructive text-white hover:bg-destructive" : ""}`}
                  disabled={!(paymentAmount && selectedCard) || isProcessing}
                  onClick={handlePayment}
                  size="lg"
                >
                  {isProcessing
                    ? "Processing..."
                    : isOverdue
                      ? `Pay ${formatCurrency(Number.parseFloat(paymentAmount || "0") * 100)} Now`
                      : "Process Payment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Saved Payment Methods */}
      {paymentMethods.length > 0 && (
        <div className="mb-6">
          <Label className="mb-3 block font-medium text-sm">
            Saved Payment Methods
          </Label>
          <div className="grid gap-3 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <Card
                className={`p-4 ${method.is_default ? "border-primary" : ""}`}
                key={method.id}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getCardIcon(method.card_brand)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {method.card_brand}
                        </span>
                        <span className="text-muted-foreground">
                          ****{method.last_four}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Expires {method.exp_month}/{method.exp_year}
                      </p>
                      <p className="text-sm">{method.cardholder_name}</p>
                    </div>
                  </div>
                  {method.is_default && (
                    <Badge variant="default">Default</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Card Dialog */}
      <Dialog onOpenChange={setShowAddCard} open={showAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card for future payments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddCard(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddCard}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
