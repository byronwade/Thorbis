"use client";

/**
 * Leads Table Component - Lead Management with Scoring
 *
 * Features:
 * - Lead capture from multiple sources (Google Ads, Thumbtack, Forms)
 * - Automatic lead scoring (Hot, Warm, Cold)
 * - Lead qualification stages (New, Contacted, Qualified, Customer)
 * - Bulk actions and filtering
 */

import {
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type LeadSource =
  | "google-ads"
  | "thumbtack"
  | "website-form"
  | "facebook-ads"
  | "referral";
type LeadScore = "hot" | "warm" | "cold";
type LeadStage = "new" | "contacted" | "qualified" | "customer" | "lost";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  score: LeadScore;
  stage: LeadStage;
  value: number;
  createdAt: Date;
  lastContact?: Date;
  notes?: string;
};

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    source: "google-ads",
    score: "hot",
    stage: "new",
    value: 2500,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    source: "thumbtack",
    score: "hot",
    stage: "contacted",
    value: 3200,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    lastContact: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mdavis@example.com",
    phone: "(555) 345-6789",
    source: "website-form",
    score: "warm",
    stage: "qualified",
    value: 1800,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "(555) 456-7890",
    source: "facebook-ads",
    score: "warm",
    stage: "contacted",
    value: 2100,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "rbrown@example.com",
    phone: "(555) 567-8901",
    source: "referral",
    score: "cold",
    stage: "new",
    value: 1200,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
  },
];

const getSourceLabel = (source: LeadSource): string => {
  const labels: Record<LeadSource, string> = {
    "google-ads": "Google Ads",
    thumbtack: "Thumbtack",
    "website-form": "Website",
    "facebook-ads": "Facebook",
    referral: "Referral",
  };
  return labels[source];
};

const getScoreColor = (
  score: LeadScore
): "destructive" | "default" | "secondary" => {
  const colors: Record<LeadScore, "destructive" | "default" | "secondary"> = {
    hot: "destructive",
    warm: "default",
    cold: "secondary",
  };
  return colors[score];
};

const getStageColor = (
  stage: LeadStage
): "default" | "secondary" | "outline" => {
  const colors: Record<LeadStage, "default" | "secondary" | "outline"> = {
    new: "default",
    contacted: "secondary",
    qualified: "secondary",
    customer: "outline",
    lost: "outline",
  };
  return colors[stage];
};

const formatTimeAgo = (date: Date): string => {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export function LeadsTable() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = MOCK_LEADS.filter((lead) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.includes(query)
    );
  });

  const handleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-4 border-b p-4">
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>

        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-9 pl-8"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, or phone..."
            value={searchQuery}
          />
        </div>

        <Button size="sm" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {selectedIds.size} selected
            </span>
            <Button size="sm" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Text
            </Button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.size === filteredLeads.length &&
                    filteredLeads.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Est. Value</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={9}>
                  <div className="flex flex-col items-center gap-2">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                      No leads found. Try adjusting your search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(lead.id)}
                      onCheckedChange={() => handleSelect(lead.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <div className="truncate font-medium leading-tight">
                        {lead.name}
                      </div>
                      {lead.lastContact && (
                        <div className="mt-0.5 text-muted-foreground text-xs leading-tight">
                          Last contact: {formatTimeAgo(lead.lastContact)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-medium text-xs",
                        "border-border/50 bg-background text-muted-foreground"
                      )}
                      variant="outline"
                    >
                      {getSourceLabel(lead.source)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn("font-medium text-xs")}
                      variant={getScoreColor(lead.score)}
                    >
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {lead.score.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn("font-medium text-xs")}
                      variant={getStageColor(lead.stage)}
                    >
                      {lead.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">
                    ${lead.value.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs tabular-nums leading-tight">
                    {formatTimeAgo(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Text
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Convert to Job</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
