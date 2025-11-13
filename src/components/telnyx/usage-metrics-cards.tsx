/**
 * Usage Metrics Cards - Server Component
 *
 * Displays key usage metrics in card format
 */

import {
  DollarSign,
  Hash,
  MessageSquare,
  Phone,
  Voicemail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UsageMetrics = {
  callMinutes: number;
  smsSent: number;
  smsReceived: number;
  voicemailCount: number;
  voicemailMinutes: number;
  totalCost: number;
  phoneNumberCount: number;
};

type Costs = {
  callCost: number;
  smsCost: number;
  voicemailTranscriptionCost: number;
  phoneNumberCost: number;
  totalCost: number;
};

export function UsageMetricsCards({
  metrics,
  costs,
}: {
  metrics: UsageMetrics;
  costs: Costs;
}) {
  const cards = [
    {
      title: "Call Minutes",
      value: metrics.callMinutes.toLocaleString(),
      cost: `$${costs.callCost.toFixed(2)}`,
      icon: Phone,
      description: "Total minutes this month",
      color: "text-primary",
    },
    {
      title: "SMS Sent",
      value: metrics.smsSent.toLocaleString(),
      cost: `$${costs.smsCost.toFixed(2)}`,
      icon: MessageSquare,
      description: `${metrics.smsReceived} received (free)`,
      color: "text-success",
    },
    {
      title: "Voicemails",
      value: metrics.voicemailCount.toLocaleString(),
      cost: `$${costs.voicemailTranscriptionCost.toFixed(2)}`,
      icon: Voicemail,
      description: `${metrics.voicemailMinutes} minutes total`,
      color: "text-accent-foreground",
    },
    {
      title: "Phone Numbers",
      value: metrics.phoneNumberCount.toLocaleString(),
      cost: `$${costs.phoneNumberCost.toFixed(2)}/mo`,
      icon: Hash,
      description: "Active numbers",
      color: "text-warning",
    },
    {
      title: "Total Cost",
      value: `$${costs.totalCost.toFixed(2)}`,
      cost: "This month",
      icon: DollarSign,
      description: "All services combined",
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">{card.title}</CardTitle>
            <card.icon className={`size-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{card.value}</div>
            <p className="text-muted-foreground text-xs">{card.description}</p>
            <p className="mt-1 font-medium text-muted-foreground text-xs">
              {card.cost}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
