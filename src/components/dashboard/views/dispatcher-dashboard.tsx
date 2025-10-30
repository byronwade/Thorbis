import {
  AlertCircle,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Users,
  Zap,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Dispatcher Dashboard - Server Component
 *
 * Focus: Real-time operations, technician locations, job assignments, emergency dispatch
 * Target User: Dispatcher who manages day-to-day scheduling and technician coordination
 */

export default function DispatcherDashboard() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-4xl tracking-tight">
            Dispatch Command Center
          </h1>
          <Badge className="text-blue-600" variant="outline">
            Dispatcher View
          </Badge>
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1">
            <div className="size-2 animate-pulse rounded-full bg-green-500" />
            <span className="font-medium text-muted-foreground text-xs">
              Live
            </span>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{currentDate}</p>
      </div>

      {/* Emergency Alert Banner */}
      <Card className="border-red-500 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-500">
              <Zap className="size-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">2 Emergency Jobs Waiting</p>
              <p className="text-muted-foreground text-xs">
                Longest wait: 18 minutes
              </p>
            </div>
          </div>
          <Button size="sm" variant="destructive">
            <Phone className="mr-2 size-4" />
            Dispatch Now
          </Button>
        </CardContent>
      </Card>

      {/* Top Operational KPIs - 4 columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          change="2 emergency waiting"
          changeType="negative"
          description="Need immediate dispatch"
          icon={AlertCircle}
          title="Unassigned Jobs"
          tooltip="Jobs that have been created but not yet assigned to a technician. Dispatch these ASAP."
          value="8"
        />
        <KPICard
          change="7 available, 5 busy"
          changeType="positive"
          icon={Users}
          title="Technicians On Duty"
          tooltip="Total number of technicians clocked in and working today"
          value="12"
        />
        <KPICard
          change="Target: < 60 min"
          changeType="positive"
          icon={Clock}
          title="Avg. Response Time"
          tooltip="Average time from customer call to technician arrival. Industry standard is 60-90 minutes."
          value="42 min"
        />
        <KPICard
          change="3 running late"
          changeType="neutral"
          icon={MapPin}
          title="Jobs in Progress"
          tooltip="Number of jobs currently being worked on by technicians"
          value="17"
        />
      </div>

      {/* Technician Status Map - Large Interactive Section */}
      <div className="space-y-3">
        <SectionHeader
          description="Real-time technician locations and status"
          title="Technician Map"
          tooltip="Live GPS tracking of all technicians. Click on a technician to see details or assign a job."
        />
        <Card className="min-h-[400px]">
          <CardContent className="flex items-center justify-center pt-6">
            <div className="text-center">
              <MapPin className="mx-auto size-16 text-muted-foreground" />
              <p className="mt-4 font-medium text-lg text-muted-foreground">
                Interactive Map Component
              </p>
              <p className="text-muted-foreground text-sm">
                Real-time GPS tracking with technician locations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Dispatch + Technician Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unassigned Jobs Queue */}
        <div className="space-y-3">
          <SectionHeader
            description="Jobs waiting for assignment"
            title="Unassigned Jobs Queue"
            tooltip="Drag and drop jobs to technicians or click Quick Assign"
          />
          <Card>
            <CardContent className="space-y-3 pt-6">
              {/* Emergency Job */}
              <div className="flex items-start gap-3 rounded-lg border-2 border-red-500 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                  <Zap className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">EMERGENCY</Badge>
                    <span className="text-muted-foreground text-xs">
                      18 min ago
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-sm">
                    No Hot Water - Urgent
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Sarah Johnson • 123 Main St • Water heater failure
                  </p>
                </div>
                <Button size="sm" variant="destructive">
                  Dispatch
                </Button>
              </div>

              {/* Regular Jobs */}
              {[
                {
                  customer: "Mike Davis",
                  address: "456 Oak Ave",
                  issue: "AC not cooling",
                  time: "32 min ago",
                },
                {
                  customer: "Lisa Chen",
                  address: "789 Pine St",
                  issue: "Leaking faucet",
                  time: "45 min ago",
                },
                {
                  customer: "Tom Wilson",
                  address: "321 Elm Dr",
                  issue: "Furnace inspection",
                  time: "1 hour ago",
                },
              ].map((job, index) => (
                <div
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                  key={index}
                >
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                    <Radio className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Standard</Badge>
                      <span className="text-muted-foreground text-xs">
                        {job.time}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-sm">{job.issue}</p>
                    <p className="text-muted-foreground text-xs">
                      {job.customer} • {job.address}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Assign
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Technician Status Board */}
        <div className="space-y-3">
          <SectionHeader
            description="Current status of all technicians"
            title="Technician Status"
            tooltip="Click on a technician to view their schedule or send them to a job"
          />
          <Card>
            <CardContent className="space-y-3 pt-6">
              {/* Available Technicians */}
              {[
                {
                  name: "John Smith",
                  status: "available",
                  location: "Near downtown",
                },
                {
                  name: "Mike Rodriguez",
                  status: "available",
                  location: "West side",
                },
              ].map((tech, index) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-green-500 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30"
                  key={index}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-500">
                    <Users className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{tech.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="border-green-600 text-green-600"
                        variant="outline"
                      >
                        ✓ Available
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {tech.location}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Assign Job
                  </Button>
                </div>
              ))}

              {/* Busy Technicians */}
              {[
                {
                  name: "Dave Wilson",
                  status: "busy",
                  job: "AC Repair",
                  eta: "45 min",
                },
                {
                  name: "Sarah Lee",
                  status: "busy",
                  job: "Water Heater",
                  eta: "1.2 hrs",
                },
                {
                  name: "Tom Brown",
                  status: "busy",
                  job: "Drain Cleaning",
                  eta: "30 min",
                },
              ].map((tech, index) => (
                <div
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                  key={index}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Navigation className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{tech.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="border-blue-600 text-blue-600"
                        variant="outline"
                      >
                        On Job
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {tech.job} • ETA {tech.eta}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                </div>
              ))}

              {/* Late Technicians */}
              <div className="flex items-center gap-3 rounded-lg border border-yellow-500 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/30">
                <div className="flex size-10 items-center justify-center rounded-full bg-yellow-500">
                  <Clock className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Chris Martinez</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="border-yellow-600 text-yellow-600"
                      variant="outline"
                    >
                      ⚠ Running Late
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      25 min behind schedule
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Call Tech
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <Card className="border-blue-500 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Radio className="size-6 text-blue-600" />
              <div>
                <p className="font-bold text-sm">Quick Actions</p>
                <p className="text-muted-foreground text-xs">
                  Common dispatch operations
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                <Phone className="mr-2 size-4" />
                New Customer Call
              </Button>
              <Button size="sm" variant="outline">
                <Zap className="mr-2 size-4" />
                Emergency Dispatch
              </Button>
              <Button size="sm" variant="outline">
                <Users className="mr-2 size-4" />
                Send Bulk SMS
              </Button>
              <Button size="sm" variant="outline">
                <MapPin className="mr-2 size-4" />
                View All Routes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
