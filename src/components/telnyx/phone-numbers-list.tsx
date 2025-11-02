/**
 * Phone Numbers List
 *
 * Displays all company phone numbers with:
 * - Number, type, and features
 * - Usage metrics (calls, SMS)
 * - Routing configuration
 * - Status and actions
 */

"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  MessageSquare,
  Settings,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Trash2,
  Edit,
  Upload,
} from "lucide-react";

// Mock data - will be replaced with real data from server actions
const mockPhoneNumbers = [
  {
    id: "1",
    phoneNumber: "+1 (831) 430-6011",
    formattedNumber: "(831) 430-6011",
    countryCode: "US",
    areaCode: "831",
    numberType: "local",
    status: "active",
    features: ["voice", "sms", "mms"],
    incomingCallsCount: 147,
    outgoingCallsCount: 203,
    smsSentCount: 89,
    smsReceivedCount: 124,
    monthlyCost: 1.0,
    routingRule: "Business Hours Routing",
    voicemailEnabled: true,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    phoneNumber: "+1 (650) 555-0123",
    formattedNumber: "(650) 555-0123",
    countryCode: "US",
    areaCode: "650",
    numberType: "local",
    status: "active",
    features: ["voice", "sms"],
    incomingCallsCount: 89,
    outgoingCallsCount: 156,
    smsSentCount: 234,
    smsReceivedCount: 198,
    monthlyCost: 1.0,
    routingRule: "Direct to Support Team",
    voicemailEnabled: true,
    createdAt: "2025-01-20T14:22:00Z",
  },
  {
    id: "3",
    phoneNumber: "+1 (855) 000-1234",
    formattedNumber: "(855) 000-1234",
    countryCode: "US",
    areaCode: "855",
    numberType: "toll-free",
    status: "porting",
    features: ["voice"],
    incomingCallsCount: 0,
    outgoingCallsCount: 0,
    smsSentCount: 0,
    smsReceivedCount: 0,
    monthlyCost: 2.0,
    routingRule: "Not configured",
    voicemailEnabled: false,
    createdAt: "2025-01-28T09:15:00Z",
    portingStatus: "In Progress",
    portingEta: "February 4, 2025",
  },
];

export function PhoneNumbersList() {
  const [numbers] = useState(mockPhoneNumbers);

  return (
    <div className="space-y-4 p-6">
      {numbers.length === 0 ? (
        <EmptyState />
      ) : (
        numbers.map((number) => (
          <PhoneNumberCard key={number.id} number={number} />
        ))
      )}
    </div>
  );
}

function PhoneNumberCard({ number }: { number: typeof mockPhoneNumbers[0] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-semibold">
                {number.formattedNumber}
              </CardTitle>
              <Badge variant={getStatusVariant(number.status)}>
                {getStatusLabel(number.status)}
              </Badge>
              {number.numberType === "toll-free" && (
                <Badge variant="secondary">Toll-Free</Badge>
              )}
            </div>
            <CardDescription>
              {number.routingRule} {number.voicemailEnabled && "• Voicemail enabled"}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                Configure Routing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Release Number
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Porting Status (if applicable) */}
        {number.status === "porting" && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Porting {number.portingStatus}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Estimated completion: {number.portingEta}
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Status
              </Button>
            </div>
          </div>
        )}

        {/* Usage Metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            icon={Phone}
            label="Incoming Calls"
            value={number.incomingCallsCount.toLocaleString()}
            color="text-green-600 dark:text-green-400"
          />
          <MetricCard
            icon={Phone}
            label="Outgoing Calls"
            value={number.outgoingCallsCount.toLocaleString()}
            color="text-blue-600 dark:text-blue-400"
          />
          <MetricCard
            icon={MessageSquare}
            label="SMS Sent"
            value={number.smsSentCount.toLocaleString()}
            color="text-purple-600 dark:text-purple-400"
          />
          <MetricCard
            icon={DollarSign}
            label="Monthly Cost"
            value={`$${number.monthlyCost.toFixed(2)}`}
            color="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Features */}
        <div className="mt-4 flex flex-wrap gap-2">
          {number.features.map((feature) => (
            <Badge key={feature} variant="outline" className="capitalize">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={`size-4 ${color}`} />
        {label}
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Phone className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No phone numbers yet</h3>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Get started by purchasing a new number or porting an existing one
        </p>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="mr-2 size-4" />
            Port Number
          </Button>
          <Button>
            <Phone className="mr-2 size-4" />
            Purchase Number
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "porting":
      return "secondary";
    case "suspended":
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending Setup";
    case "porting":
      return "Porting";
    case "suspended":
      return "Suspended";
    default:
      return status;
  }
}
