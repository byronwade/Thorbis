/**
 * Metrics Block - Custom Tiptap Node
 *
 * Displays customer KPI metrics as cards:
 * - Total Revenue
 * - Total Jobs
 * - Total Properties
 * - Outstanding Balance
 *
 * Read-only display block (metrics calculated from database)
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { DollarSign, Briefcase, MapPin, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// React component that renders the block
export function MetricsBlockComponent({ node }: any) {
  const { totalRevenue, totalJobs, totalProperties, outstandingBalance } = node.attrs;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const metrics = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue || 0),
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Total Jobs",
      value: totalJobs || 0,
      icon: Briefcase,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Properties",
      value: totalProperties || 0,
      icon: MapPin,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Outstanding",
      value: formatCurrency(outstandingBalance || 0),
      icon: AlertCircle,
      iconColor: outstandingBalance > 0 ? "text-orange-600" : "text-gray-600",
      bgColor: outstandingBalance > 0 ? "bg-orange-50 dark:bg-orange-950" : "bg-gray-50 dark:bg-gray-950",
    },
  ];

  return (
    <NodeViewWrapper className="metrics-block">
      <div className="not-prose my-6">
        <h3 className="mb-4 font-semibold text-lg">Quick Stats</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">
                        {metric.label}
                      </p>
                      <p className="mt-2 font-bold text-2xl">{metric.value}</p>
                    </div>
                    <div className={cn("rounded-full p-2", metric.bgColor)}>
                      <Icon className={cn("size-5", metric.iconColor)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const MetricsBlock = Node.create({
  name: "metricsBlock",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      totalRevenue: {
        default: 0,
      },
      totalJobs: {
        default: 0,
      },
      totalProperties: {
        default: 0,
      },
      outstandingBalance: {
        default: 0,
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="metrics-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "metrics-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MetricsBlockComponent);
  },

  addCommands() {
    return {
      insertMetricsBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    } as any;
  },
});
