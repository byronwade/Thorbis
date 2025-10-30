"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  customer: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
}

interface Technician {
  id: string;
  name: string;
  role: string;
  status: "available" | "on-job" | "on-break" | "offline";
  jobs: Job[];
}

const HOUR_WIDTH = 120; // Width of each hour column in pixels
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

const mockTechnicians: Technician[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Technician",
    status: "on-job",
    jobs: [
      {
        id: "j1",
        title: "HVAC Maintenance",
        customer: "ABC Corp",
        startTime: "08:00",
        endTime: "10:30",
        status: "completed",
        priority: "medium",
        location: "123 Main St",
      },
      {
        id: "j2",
        title: "Emergency Repair",
        customer: "XYZ Inc",
        startTime: "11:00",
        endTime: "14:00",
        status: "in-progress",
        priority: "urgent",
        location: "456 Oak Ave",
      },
      {
        id: "j3",
        title: "Installation",
        customer: "Tech Solutions",
        startTime: "15:00",
        endTime: "17:30",
        status: "scheduled",
        priority: "high",
        location: "789 Pine Rd",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Field Technician",
    status: "available",
    jobs: [
      {
        id: "j4",
        title: "System Inspection",
        customer: "Global Systems",
        startTime: "09:00",
        endTime: "11:00",
        status: "completed",
        priority: "low",
        location: "321 Elm St",
      },
      {
        id: "j5",
        title: "Preventive Maintenance",
        customer: "Local Business",
        startTime: "13:00",
        endTime: "15:00",
        status: "scheduled",
        priority: "medium",
        location: "654 Maple Dr",
      },
    ],
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Senior Technician",
    status: "on-job",
    jobs: [
      {
        id: "j6",
        title: "Equipment Replacement",
        customer: "Manufacturing Co",
        startTime: "07:30",
        endTime: "12:00",
        status: "in-progress",
        priority: "high",
        location: "987 Industrial Pkwy",
      },
      {
        id: "j7",
        title: "Follow-up Service",
        customer: "Retail Store",
        startTime: "13:30",
        endTime: "15:30",
        status: "scheduled",
        priority: "low",
        location: "147 Commerce Blvd",
      },
    ],
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Field Technician",
    status: "on-break",
    jobs: [
      {
        id: "j8",
        title: "Diagnostic Service",
        customer: "Healthcare Facility",
        startTime: "08:00",
        endTime: "10:00",
        status: "completed",
        priority: "medium",
        location: "258 Medical Center Dr",
      },
      {
        id: "j9",
        title: "Repair Work",
        customer: "Office Complex",
        startTime: "14:00",
        endTime: "16:00",
        status: "scheduled",
        priority: "medium",
        location: "369 Corporate Way",
      },
    ],
  },
  {
    id: "5",
    name: "David Brown",
    role: "Lead Technician",
    status: "available",
    jobs: [
      {
        id: "j10",
        title: "Emergency Call",
        customer: "Restaurant Chain",
        startTime: "10:00",
        endTime: "12:30",
        status: "completed",
        priority: "urgent",
        location: "741 Restaurant Row",
      },
    ],
  },
  {
    id: "6",
    name: "Emily Davis",
    role: "Field Technician",
    status: "on-job",
    jobs: [
      {
        id: "j11",
        title: "Annual Inspection",
        customer: "Office Building",
        startTime: "07:00",
        endTime: "09:00",
        status: "completed",
        priority: "low",
        location: "852 Business Park",
      },
      {
        id: "j12",
        title: "System Upgrade",
        customer: "Tech Startup",
        startTime: "10:00",
        endTime: "13:00",
        status: "in-progress",
        priority: "high",
        location: "963 Innovation Dr",
      },
    ],
  },
  {
    id: "7",
    name: "Robert Martinez",
    role: "Senior Technician",
    status: "on-job",
    jobs: [
      {
        id: "j13",
        title: "Equipment Installation",
        customer: "Factory",
        startTime: "08:30",
        endTime: "11:30",
        status: "in-progress",
        priority: "high",
        location: "159 Industrial Ave",
      },
      {
        id: "j14",
        title: "Maintenance Check",
        customer: "Warehouse",
        startTime: "14:00",
        endTime: "16:30",
        status: "scheduled",
        priority: "medium",
        location: "357 Storage Rd",
      },
    ],
  },
  {
    id: "8",
    name: "Lisa Anderson",
    role: "Field Technician",
    status: "available",
    jobs: [
      {
        id: "j15",
        title: "Consultation",
        customer: "New Client",
        startTime: "09:00",
        endTime: "10:00",
        status: "scheduled",
        priority: "low",
        location: "246 Prospect St",
      },
      {
        id: "j16",
        title: "Installation Project",
        customer: "Retail Chain",
        startTime: "11:00",
        endTime: "15:00",
        status: "scheduled",
        priority: "high",
        location: "468 Commerce Center",
      },
    ],
  },
  {
    id: "9",
    name: "James Wilson",
    role: "Lead Technician",
    status: "on-job",
    jobs: [
      {
        id: "j17",
        title: "Emergency Service",
        customer: "Hospital",
        startTime: "07:00",
        endTime: "10:00",
        status: "completed",
        priority: "urgent",
        location: "579 Medical Plaza",
      },
      {
        id: "j18",
        title: "Follow-up Visit",
        customer: "Clinic",
        startTime: "11:30",
        endTime: "13:00",
        status: "in-progress",
        priority: "medium",
        location: "680 Health Center",
      },
    ],
  },
  {
    id: "10",
    name: "Patricia Taylor",
    role: "Field Technician",
    status: "on-break",
    jobs: [
      {
        id: "j19",
        title: "Routine Maintenance",
        customer: "School District",
        startTime: "08:00",
        endTime: "11:00",
        status: "completed",
        priority: "medium",
        location: "791 Education Way",
      },
    ],
  },
  {
    id: "11",
    name: "Christopher Moore",
    role: "Senior Technician",
    status: "on-job",
    jobs: [
      {
        id: "j20",
        title: "System Repair",
        customer: "Data Center",
        startTime: "09:30",
        endTime: "14:00",
        status: "in-progress",
        priority: "urgent",
        location: "802 Server Farm Rd",
      },
      {
        id: "j21",
        title: "Testing",
        customer: "Data Center",
        startTime: "14:30",
        endTime: "16:00",
        status: "scheduled",
        priority: "high",
        location: "802 Server Farm Rd",
      },
    ],
  },
  {
    id: "12",
    name: "Jennifer Garcia",
    role: "Field Technician",
    status: "available",
    jobs: [
      {
        id: "j22",
        title: "Initial Assessment",
        customer: "Shopping Mall",
        startTime: "10:00",
        endTime: "12:00",
        status: "scheduled",
        priority: "low",
        location: "913 Retail Plaza",
      },
      {
        id: "j23",
        title: "Repair Work",
        customer: "Restaurant",
        startTime: "13:00",
        endTime: "15:00",
        status: "scheduled",
        priority: "medium",
        location: "024 Dining District",
      },
    ],
  },
];

const statusColors = {
  scheduled: "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300",
  "in-progress":
    "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300",
  completed:
    "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300",
  cancelled: "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300",
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

const technicianStatusColors = {
  available: "bg-green-500",
  "on-job": "bg-yellow-500",
  "on-break": "bg-orange-500",
  offline: "bg-gray-500",
};

function timeToPosition(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = (hours - 7) * 60 + minutes;
  return (totalMinutes / 60) * HOUR_WIDTH;
}

function calculateWidth(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const durationMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  return (durationMinutes / 60) * HOUR_WIDTH;
}

export function TechnicianScheduleChart() {
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  // Sync horizontal scrolling between header and body
  useEffect(() => {
    const headerScroll = headerScrollRef.current;
    const bodyScroll = bodyScrollRef.current;

    if (!(headerScroll && bodyScroll)) return;

    const syncScroll =
      (source: HTMLDivElement, target: HTMLDivElement) => () => {
        target.scrollLeft = source.scrollLeft;
      };

    const headerListener = syncScroll(headerScroll, bodyScroll);
    const bodyListener = syncScroll(bodyScroll, headerScroll);

    headerScroll.addEventListener("scroll", headerListener);
    bodyScroll.addEventListener("scroll", bodyListener);

    return () => {
      headerScroll.removeEventListener("scroll", headerListener);
      bodyScroll.removeEventListener("scroll", bodyListener);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border-y">
      {/* Header with time slots - Fixed at top */}
      <div className="z-20 flex h-14 shrink-0 border-b bg-background">
        <div className="flex w-[250px] shrink-0 items-center border-r bg-background px-4">
          <h3 className="font-semibold text-sm">Technicians</h3>
        </div>
        <div
          className="scrollbar-hide flex flex-1 overflow-x-auto"
          ref={headerScrollRef}
        >
          <div className="flex min-w-max">
            {HOURS.map((hour) => (
              <div
                className="flex items-center justify-center border-r font-medium text-muted-foreground text-xs"
                key={hour}
                style={{ width: HOUR_WIDTH }}
              >
                {hour === 12
                  ? "12 PM"
                  : hour > 12
                    ? `${hour - 12} PM`
                    : `${hour} AM`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable technician rows */}
      <div className="min-h-0 flex-1 overflow-auto" ref={bodyScrollRef}>
        <div className="min-w-max divide-y">
          {mockTechnicians.map((technician) => (
            <div className="flex min-h-[100px]" key={technician.id}>
              {/* Technician info */}
              <div className="sticky left-0 z-10 w-[250px] shrink-0 border-r bg-background p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">
                        {technician.name}
                      </h4>
                      <div
                        className={cn(
                          "size-2 rounded-full",
                          technicianStatusColors[technician.status]
                        )}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {technician.role}
                    </p>
                    <Badge className="mt-1 text-xs" variant="outline">
                      {technician.jobs.length} jobs
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Schedule timeline */}
              <div className="relative flex-1 bg-muted/20">
                {/* Hour markers */}
                {HOURS.map((hour, index) => (
                  <div
                    className={cn(
                      "absolute top-0 bottom-0 border-r",
                      hour === 12
                        ? "border-muted-foreground/30"
                        : "border-muted-foreground/10"
                    )}
                    key={hour}
                    style={{ left: index * HOUR_WIDTH }}
                  />
                ))}

                {/* Jobs */}
                {technician.jobs.map((job) => (
                  <div
                    className={cn(
                      "absolute top-2 m-1 rounded-md border-2 p-2 transition-all hover:scale-105 hover:shadow-md",
                      statusColors[job.status]
                    )}
                    key={job.id}
                    style={{
                      left: timeToPosition(job.startTime),
                      width: calculateWidth(job.startTime, job.endTime),
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1">
                          <div
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              priorityColors[job.priority]
                            )}
                          />
                          <h5 className="truncate font-semibold text-xs">
                            {job.title}
                          </h5>
                        </div>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {job.customer}
                        </p>
                        <p className="mt-1 font-medium text-[10px]">
                          {job.startTime} - {job.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Footer with Stats and Legend */}
      <div className="z-20 shrink-0 border-t bg-background">
        <div className="flex items-center justify-between gap-8 px-6 py-3">
          {/* Statistics Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 border-r pr-6">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10">
                  <span className="font-semibold text-blue-600 text-sm dark:text-blue-400">
                    {mockTechnicians.reduce(
                      (acc, tech) =>
                        acc +
                        tech.jobs.filter((j) => j.status === "scheduled")
                          .length,
                      0
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-xs leading-none">Scheduled</p>
                  <p className="text-[10px] text-muted-foreground">
                    jobs today
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-yellow-500/10">
                  <span className="font-semibold text-sm text-yellow-600 dark:text-yellow-400">
                    {mockTechnicians.reduce(
                      (acc, tech) =>
                        acc +
                        tech.jobs.filter((j) => j.status === "in-progress")
                          .length,
                      0
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-xs leading-none">Active</p>
                  <p className="text-[10px] text-muted-foreground">
                    in progress
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-green-500/10">
                  <span className="font-semibold text-green-600 text-sm dark:text-green-400">
                    {mockTechnicians.reduce(
                      (acc, tech) =>
                        acc +
                        tech.jobs.filter((j) => j.status === "completed")
                          .length,
                      0
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-xs leading-none">Completed</p>
                  <p className="text-[10px] text-muted-foreground">finished</p>
                </div>
              </div>
            </div>

            {/* Technician Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="text-xs">
                  {
                    mockTechnicians.filter((t) => t.status === "available")
                      .length
                  }{" "}
                  Available
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-yellow-500" />
                <span className="text-xs">
                  {mockTechnicians.filter((t) => t.status === "on-job").length}{" "}
                  On Job
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-orange-500" />
                <span className="text-xs">
                  {
                    mockTechnicians.filter((t) => t.status === "on-break")
                      .length
                  }{" "}
                  On Break
                </span>
              </div>
            </div>
          </div>

          {/* Priority Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-muted-foreground">
              Priority:
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-gray-500" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-blue-500" />
                <span>Med</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-orange-500" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-red-500" />
                <span>Urgent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
