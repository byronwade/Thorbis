/**
 * Invoice Payment Form Component
 *
 * Handles payment processing for invoices using company's configured processor
 *
 * Features:
 * - Payment method selection
 * - Card payment via Adyen
 * - ACH payment via Plaid
 * - Payment processing
 * - Error handling
 * - Success confirmation
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Building2, CheckCircle } from "lucide-react";
import { processInvoicePayment } from "@/actions/payments/process-invoice-payment";

interface InvoicePaymentFormProps {
  invoice: any;
  token: string;
  company: any;
  customer: any;
}

export function InvoicePaymentForm({ invoice, token, company, customer }: InvoicePaymentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ach">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card payment fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState(customer.display_name || `${customer.first_name} ${customer.last_name}`);

  // ACH payment fields
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountName, setAccountName] = useState(customer.display_name || `${customer.first_name} ${customer.last_name}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isProcessing) return;

    setIsProcessing(true);

    startTransition(async () => {
      try {
        const result = await processInvoicePayment({
          invoiceId: invoice.id,
          token,
          paymentMethod,
          amount: invoice.total_amount,
          paymentDetails:
            paymentMethod === "card"
              ? {
                  cardNumber: cardNumber.replace(/\s/g, ""),
                  cardExpiry,
                  cardCvc,
                  cardName,
                }
              : {
                  accountNumber,
                  routingNumber,
                  accountName,
                },
        });

        if (result.success) {
          setPaymentSuccess(true);
          toast.success("Payment successful!", {
            description: "Your payment has been processed. You will receive a confirmation email shortly.",
          });

          // Redirect to success page after a delay
          setTimeout(() => {
            router.push(`/pay/${invoice.id}/success`);
          }, 2000);
        } else {
          toast.error("Payment failed", {
            description: result.error || "Unable to process payment. Please try again.",
          });
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Payment error", {
          description: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (paymentSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <CardTitle className="text-green-900">Payment Successful!</CardTitle>
              <CardDescription className="text-green-700">
                Your payment has been processed successfully.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Select your payment method and enter your details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex cursor-pointer items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit or Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ach" id="ach" />
                <Label htmlFor="ach" className="flex cursor-pointer items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank Account (ACH)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Payment Fields */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "");
                    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                    setCardNumber(formatted);
                  }}
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                      } else {
                        setCardExpiry(value);
                      }
                    }}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACH Payment Fields */}
          {paymentMethod === "ach" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input
                  id="accountName"
                  placeholder="John Doe"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="110000000"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={9}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="000123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isProcessing || isPending}>
            {isProcessing || isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ${(invoice.total_amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}`
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

