"use client";

/**
 * LeadsDataTable Component
 * Full-width Gmail-style table for displaying leads matching work pages pattern
 */

import {
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { cn } from "@/lib/utils";

export type LeadSource =
  | "google-ads"
  | "thumbtack"
  | "website-form"
  | "facebook-ads"
  | "referral";
export type LeadScore = "hot" | "warm" | "cold";
export type LeadStage = "new" | "contacted" | "qualified" | "customer" | "lost";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  score: LeadScore;
  stage: LeadStage;
  value: number;
  createdAt: Date;
  lastContact: Date | null;
};

type LeadsDataTableProps = {
  leads: Lead[];
  itemsPerPage?: number;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTimeAgo(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getSourceLabel(source: LeadSource): string {
  const labels: Record<LeadSource, string> = {
    "google-ads": "Google Ads",
    thumbtack: "Thumbtack",
    "website-form": "Website",
    "facebook-ads": "Facebook",
    referral: "Referral",
  };
  return labels[source];
}

function getScoreBadge(score: LeadScore) {
  const config = {
    hot: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "HOT",
    },
    warm: {
      className:
        "border-orange-200/50 bg-orange-50/50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400",
      label: "WARM",
    },
    cold: {
      className:
        "border-blue-200/50 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
      label: "COLD",
    },
  };

  const scoreConfig = config[score];

  return (
    <Badge
      className={cn("font-medium text-xs", scoreConfig.className)}
      variant="outline"
    >
      <TrendingUp className="mr-1 h-3 w-3" />
      {scoreConfig.label}
    </Badge>
  );
}

function getStageBadge(stage: LeadStage) {
  const config = {
    new: {
      className: "border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600",
      label: "New",
    },
    contacted: {
      className:
        "border-purple-200/50 bg-purple-50/50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
      label: "Contacted",
    },
    qualified: {
      className:
        "border-green-200/50 bg-green-50/50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400",
      label: "Qualified",
    },
    customer: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Customer",
    },
    lost: {
      className:
        "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
      label: "Lost",
    },
  };

  const stageConfig = config[stage];

  return (
    <Badge
      className={cn("font-medium text-xs", stageConfig.className)}
      variant="outline"
    >
      {stageConfig.label}
    </Badge>
  );
}

export function LeadsDataTable({
  leads,
  itemsPerPage = 50,
}: LeadsDataTableProps) {
  const columns: ColumnDef<Lead>[] = [
    {
      key: "name",
      header: "Lead",
      width: "w-48",
      shrink: true,
      render: (lead) => (
        <div className="min-w-0">
          <Link
            className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
            href={`/dashboard/marketing/leads/${lead.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            {lead.name}
          </Link>
          {lead.lastContact && (
            <div className="mt-0.5 text-muted-foreground text-xs leading-tight">
              Last contact: {formatTimeAgo(lead.lastContact)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      width: "flex-1",
      render: (lead) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground text-xs leading-tight">
              {lead.email}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground text-xs leading-tight">
              {lead.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (lead) => (
        <Badge
          className={cn(
            "font-medium text-xs",
            "border-border/50 bg-background text-muted-foreground"
          )}
          variant="outline"
        >
          {getSourceLabel(lead.source)}
        </Badge>
      ),
    },
    {
      key: "score",
      header: "Score",
      width: "w-28",
      shrink: true,
      render: (lead) => getScoreBadge(lead.score),
    },
    {
      key: "stage",
      header: "Stage",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (lead) => getStageBadge(lead.stage),
    },
    {
      key: "value",
      header: "Est. Value",
      width: "w-28",
      shrink: true,
      align: "right",
      render: (lead) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(lead.value)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      width: "w-24",
      shrink: true,
      hideOnMobile: true,
      render: (lead) => (
        <span className="text-muted-foreground text-xs tabular-nums leading-tight">
          {formatTimeAgo(lead.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (lead) => (
        <div data-no-row-click>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Phone className="mr-2 h-4 w-4" />
                Call Lead
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <UserPlus className="mr-2 h-4 w-4" />
                Convert to Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Send Email",
      icon: <Mail className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Email leads:", Array.from(selectedIds));
      },
    },
    {
      label: "Send Text",
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Text leads:", Array.from(selectedIds));
      },
    },
    {
      label: "Call",
      icon: <Phone className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Call leads:", Array.from(selectedIds));
      },
    },
  ];

  const handleRowClick = (lead: Lead) => {
    window.location.href = `/dashboard/marketing/leads/${lead.id}`;
  };

  const searchFilter = (lead: Lead, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchStr) ||
      lead.email.toLowerCase().includes(searchStr) ||
      lead.phone.includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={leads}
      emptyIcon={
        <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
      }
      emptyMessage="No leads found"
      enableSelection={true}
      getItemId={(lead) => lead.id}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={handleRowClick}
      searchFilter={searchFilter}
      searchPlaceholder="Search leads by name, email, or phone..."
      showRefresh={false}
    />
  );
}
