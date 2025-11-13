"use client";

/**
 * Phone Settings Client Component
 *
 * Client-side UI for phone settings with tabs and interactive components
 */

import {
  BarChart3,
  Calendar,
  Clock,
  Phone,
  Route,
  Settings2,
  Users,
  Voicemail,
} from "lucide-react";
import { useState } from "react";
import { BusinessHoursEditor } from "@/components/telnyx/business-hours-editor";
import { CallAnalyticsDashboard } from "@/components/telnyx/call-analytics-dashboard";
import { CallFlowDesigner } from "@/components/telnyx/call-flow-designer";
import { CallRoutingManager } from "@/components/telnyx/call-routing-manager";
import { GeneralPhoneSettings } from "@/components/telnyx/general-phone-settings";
import { HolidayScheduleManager } from "@/components/telnyx/holiday-schedule-manager";
import { TeamExtensionsManager } from "@/components/telnyx/team-extensions-manager";
import { VoicemailSettingsAdvanced } from "@/components/telnyx/voicemail-settings-advanced";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PhoneSettingsClient() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">
          Phone & Voice Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive VoIP system with advanced call routing, extensions, and
          voicemail
        </p>
      </div>

      <Tabs
        className="space-y-6"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-8 lg:w-auto">
          <TabsTrigger className="gap-2" value="general">
            <Settings2 className="size-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="extensions">
            <Users className="size-4" />
            <span className="hidden sm:inline">Extensions</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="routing">
            <Route className="size-4" />
            <span className="hidden sm:inline">Call Routing</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="voicemail">
            <Voicemail className="size-4" />
            <span className="hidden sm:inline">Voicemail</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="hours">
            <Clock className="size-4" />
            <span className="hidden sm:inline">Hours</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="holidays">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Holidays</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="flows">
            <Phone className="size-4" />
            <span className="hidden sm:inline">Call Flows</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="analytics">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="general">
          <GeneralPhoneSettings />
        </TabsContent>

        <TabsContent className="space-y-6" value="extensions">
          <TeamExtensionsManager />
        </TabsContent>

        <TabsContent className="space-y-6" value="routing">
          <CallRoutingManager />
        </TabsContent>

        <TabsContent className="space-y-6" value="voicemail">
          <VoicemailSettingsAdvanced />
        </TabsContent>

        <TabsContent className="space-y-6" value="hours">
          <BusinessHoursEditor />
        </TabsContent>

        <TabsContent className="space-y-6" value="holidays">
          <HolidayScheduleManager />
        </TabsContent>

        <TabsContent className="space-y-6" value="flows">
          <CallFlowDesigner />
        </TabsContent>

        <TabsContent className="space-y-6" value="analytics">
          <CallAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
