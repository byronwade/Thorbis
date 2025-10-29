"use client";

/**
 * Campaigns Manager Component - Campaign Creation and Tracking
 *
 * Features:
 * - Email, SMS, and direct mail campaigns
 * - Campaign templates
 * - Automation workflows
 * - Performance tracking
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  CheckCircle2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";

type CampaignType = "email" | "sms" | "direct-mail";
type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed";

type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  scheduledDate?: Date;
  createdAt: Date;
};

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Spring HVAC Maintenance Reminder",
    type: "email",
    status: "active",
    recipients: 1250,
    sent: 1250,
    opened: 675,
    clicked: 248,
    converted: 45,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "New Customer Welcome Series",
    type: "sms",
    status: "active",
    recipients: 85,
    sent: 85,
    opened: 82,
    clicked: 38,
    converted: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Summer AC Tune-Up Special",
    type: "email",
    status: "scheduled",
    recipients: 2100,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Holiday Service Discount",
    type: "direct-mail",
    status: "draft",
    recipients: 500,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const getCampaignIcon = (type: CampaignType) => {
  switch (type) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "sms":
      return <MessageSquare className="h-4 w-4" />;
    case "direct-mail":
      return <Send className="h-4 w-4" />;
  }
};

const getStatusColor = (status: CampaignStatus): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "active":
      return "default";
    case "scheduled":
      return "secondary";
    case "draft":
      return "outline";
    case "paused":
      return "secondary";
    case "completed":
      return "outline";
  }
};

const calculateOpenRate = (opened: number, sent: number): string => {
  if (sent === 0) return "0%";
  return `${Math.round((opened / sent) * 100)}%`;
};

const calculateCTR = (clicked: number, opened: number): string => {
  if (opened === 0) return "0%";
  return `${Math.round((clicked / opened) * 100)}%`;
};

const calculateConversionRate = (converted: number, recipients: number): string => {
  if (recipients === 0) return "0%";
  return `${Math.round((converted / recipients) * 100)}%`;
};

export function CampaignsManager() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active").length;
  const scheduledCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "scheduled").length;
  const totalSent = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.sent, 0);
  const totalConverted = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.converted, 0);

  return (
    <div className="flex h-full flex-col">
      {/* Stats Cards */}
      <div className="grid gap-4 border-b p-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Campaigns</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{activeCampaigns}</div>
            <p className="text-muted-foreground text-xs">
              {scheduledCampaigns} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalSent.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Avg. Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">54%</div>
            <p className="text-muted-foreground text-xs">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Conversions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalConverted}</div>
            <p className="text-muted-foreground text-xs">4.2% conversion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Campaigns</h2>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <div className="space-y-4">
          {MOCK_CAMPAIGNS.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getCampaignIcon(campaign.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{campaign.name}</CardTitle>
                        <Badge variant={getStatusColor(campaign.status)} className="capitalize">
                          {campaign.status}
                        </Badge>
                      </div>
                      <CardDescription className="capitalize">
                        {campaign.type.replace("-", " ")} • {campaign.recipients.toLocaleString()} recipients
                        {campaign.scheduledDate && (
                          <span className="ml-2">
                            • Scheduled: {campaign.scheduledDate.toLocaleDateString()}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Start Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {campaign.sent > 0 && (
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-muted-foreground text-xs">Sent</div>
                      <div className="font-semibold text-lg">{campaign.sent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Open Rate</div>
                      <div className="font-semibold text-lg">
                        {calculateOpenRate(campaign.opened, campaign.sent)}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {campaign.opened.toLocaleString()} opened
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Click Rate</div>
                      <div className="font-semibold text-lg">
                        {calculateCTR(campaign.clicked, campaign.opened)}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {campaign.clicked.toLocaleString()} clicked
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Conversions</div>
                      <div className="font-semibold text-lg">{campaign.converted}</div>
                      <div className="text-muted-foreground text-xs">
                        {calculateConversionRate(campaign.converted, campaign.recipients)} rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
