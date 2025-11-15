/**
 * Adapter to convert our Supabase data model to V0 scheduler format
 */

import type { Job, Technician } from "./schedule-types";
import type { Assignment, JobCategory, TeamMember } from "./types";

// Status to category mapping
const STATUS_CATEGORIES: Record<Job["status"], JobCategory> = {
  scheduled: { id: "scheduled", name: "Scheduled", color: "#3b82f6" },
  dispatched: { id: "dispatched", name: "Dispatched", color: "#0ea5e9" },
  arrived: { id: "arrived", name: "Arrived", color: "#6366f1" },
  "in-progress": { id: "in-progress", name: "In Progress", color: "#f59e0b" },
  completed: { id: "completed", name: "Completed", color: "#10b981" },
  closed: { id: "closed", name: "Closed", color: "#059669" },
  cancelled: { id: "cancelled", name: "Cancelled", color: "#ef4444" },
};

export function technicianToTeamMember(technician: Technician): TeamMember {
  return {
    id: technician.id,
    name: technician.name,
    avatar: technician.avatar,
    role: technician.role,
  };
}

export function jobToAssignment(job: Job): Assignment {
  return {
    id: job.id,
    title: job.title,
    start:
      job.startTime instanceof Date
        ? job.startTime.toISOString()
        : job.startTime,
    end: job.endTime instanceof Date ? job.endTime.toISOString() : job.endTime,
    memberId: job.technicianId || "",
    categoryId: job.status,
    description: job.description,
    location: job.location.address.street,
    customer: job.customer.name,
  };
}

export function getCategories(): JobCategory[] {
  return Object.values(STATUS_CATEGORIES);
}

export function convertScheduleData(jobs: Job[], technicians: Technician[]) {
  return {
    members: technicians.map(technicianToTeamMember),
    categories: getCategories(),
    assignments: jobs.map(jobToAssignment),
  };
}
