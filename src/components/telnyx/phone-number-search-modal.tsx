/**
 * Phone Number Search Modal
 *
 * Search and purchase phone numbers with:
 * - Area code filter
 * - Number type selection (local, toll-free)
 * - Feature filters (voice, SMS, MMS)
 * - Real-time availability
 * - One-click purchase
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Phone, DollarSign, Check, Loader2 } from "lucide-react";
import { searchPhoneNumbers, purchasePhoneNumber } from "@/actions/telnyx";

interface PhoneNumberSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhoneNumberSearchModal({ open, onOpenChange }: PhoneNumberSearchModalProps) {
  const [areaCode, setAreaCode] = useState("831");
  const [numberType, setNumberType] = useState<"local" | "toll-free">("local");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [searching, setSearching] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setSearching(true);

    const features: Array<"voice" | "sms" | "mms"> = [];
    if (voiceEnabled) features.push("voice");
    if (smsEnabled) {
      features.push("sms");
      features.push("mms");
    }

    const { data } = await searchPhoneNumbers({
      areaCode: areaCode || undefined,
      numberType,
      features,
      limit: 10,
    });

    setResults(data || []);
    setSearching(false);
  };

  const handlePurchase = async (phoneNumber: string) => {
    setPurchasing(phoneNumber);

    // TODO: Get actual company ID from session
    const companyId = "temp-company-id";

    await purchasePhoneNumber({
      phoneNumber,
      companyId,
    });

    setPurchasing(null);
    onOpenChange(false);

    // Refresh the phone numbers list
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Phone Numbers</DialogTitle>
          <DialogDescription>
            Find and purchase a new phone number for your business
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Form */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="areaCode">Area Code (Optional)</Label>
              <Input
                id="areaCode"
                placeholder="e.g., 831, 650, 415"
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to search all area codes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberType">Number Type</Label>
              <Select value={numberType} onValueChange={(v: any) => setNumberType(v)}>
                <SelectTrigger id="numberType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">
                    <div className="flex items-center justify-between gap-4">
                      <span>Local Number</span>
                      <span className="text-xs text-muted-foreground">$1/month</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="toll-free">
                    <div className="flex items-center justify-between gap-4">
                      <span>Toll-Free (800/888/877/866/855)</span>
                      <span className="text-xs text-muted-foreground">$2/month</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feature Filters */}
          <div className="space-y-2">
            <Label>Required Features</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="voice"
                  checked={voiceEnabled}
                  onCheckedChange={(checked) => setVoiceEnabled(!!checked)}
                />
                <label
                  htmlFor="voice"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Voice Calling
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={smsEnabled}
                  onCheckedChange={(checked) => setSmsEnabled(!!checked)}
                />
                <label
                  htmlFor="sms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  SMS/MMS Messaging
                </label>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={searching}
            className="w-full"
            size="lg"
          >
            {searching ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 size-4" />
                Search Available Numbers
              </>
            )}
          </Button>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Available Numbers ({results.length})</Label>
                <p className="text-xs text-muted-foreground">
                  Click to purchase instantly
                </p>
              </div>

              <div className="max-h-[400px] space-y-2 overflow-y-auto rounded-lg border p-2">
                {results.map((number: any) => (
                  <div
                    key={number.phone_number}
                    className="flex items-center justify-between rounded-md border bg-card p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="size-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {formatPhoneNumber(number.phone_number)}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {number.features?.map((feature: string) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <DollarSign className="size-3" />
                          {numberType === "toll-free" ? "2.00" : "1.00"}/mo
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $0 setup fee
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePurchase(number.phone_number)}
                        disabled={!!purchasing}
                        size="sm"
                      >
                        {purchasing === number.phone_number ? (
                          <>
                            <Loader2 className="mr-2 size-3 animate-spin" />
                            Purchasing...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 size-3" />
                            Purchase
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!searching && results.length === 0 && areaCode && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Phone className="mx-auto mb-2 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No numbers found. Try a different area code or search all areas.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatPhoneNumber(phone: string): string {
  // Format +15551234567 to (555) 123-4567
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}
